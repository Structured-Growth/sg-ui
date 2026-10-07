"use client";

import { forwardRef, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactElement, type Ref } from "react";
import { Table, TableHeader, Column, TableBody, Row, Cell, ResizableTableContainer, ColumnResizer } from "react-aria-components/Table";
import { useDragAndDrop, DropIndicator } from "react-aria-components/useDragAndDrop";
import { DataGridDragHandle } from "../AppDataGridRowDnd/DataGridDragHandle";
import type { AppDataGridRowDragConfig } from "./types";
import { CheckboxContext } from "react-aria-components/Checkbox";
import { Menu } from "../../experimental/Menu/Menu";
import { Button } from "../../experimental/Button/Button";
import { ArrowDropDownIcon } from "../../experimental/icons";
import { Checkbox } from "../../experimental/Checkbox/Checkbox";
import { useTranslation } from "../../i18n";
import { changeOwnedGridHeaderSort, measureOwnedGridWidths, type OwnedGridPresentationColumn } from "./ownedGridColumns";
import { getOwnedGridCellValue, getOwnedGridRowId, processOwnedGridRows, type OwnedGridProcessingResult } from "./ownedGridModel";
import { getOwnedGridPageSelection, selectOwnedGridPage } from "./ownedGridState";
import { useOwnedGridController, type OwnedGridControllerOptions } from "./ownedGridController";
import { useOwnedGridLayoutController, type OwnedGridLayoutControllerOptions } from "./ownedGridLayoutController";
import { OwnedGridCell, type OwnedGridCellProps } from "./ownedGridCells";
import { OwnedGridHeaderSortMenu, OwnedGridStatus } from "./ownedGridParts";
import type { OwnedGridTransition } from "./ownedGridState";
import styles from "./ownedGridInteraction.module.css";

const useBrowserLayoutEffect = typeof document === "undefined" ? useEffect : useLayoutEffect;

/** Internal catalog interaction; public AppDataGrid integration lands separately. */
export interface OwnedGridInteractionProps<RowModel> extends OwnedGridControllerOptions<RowModel>, OwnedGridLayoutControllerOptions<RowModel> {
  dispatchTransition?: (action: OwnedGridTransition) => void;
  processingResult?: OwnedGridProcessingResult<RowModel>;
  label: string;
  rows: readonly RowModel[];
  columns: readonly OwnedGridPresentationColumn<RowModel>[];
  getRowId?: (row: RowModel) => string;
  getRowLabel: (row: RowModel) => string;
  mode?: "client" | "server";
  selection?: boolean;
  rowDrag?: AppDataGridRowDragConfig<RowModel>;
  selectPageLabel?: string;
  selectNoneLabel?: string;
  isRowSelectable?: (row: RowModel) => boolean;
  onRowAction?: (row: RowModel) => void;
  loading?: boolean;
  refreshing?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  locale?: string;
  timeZone?: string;
  formatDate?: OwnedGridCellProps<RowModel>["formatDate"];
  className?: string;
  style?: CSSProperties;
  /** The forwarded ref is the native scrolling container; this is the table. */
  tableRef?: Ref<HTMLTableElement>;
}

function Interaction<RowModel>(props: OwnedGridInteractionProps<RowModel>, forwardedRef: Ref<HTMLDivElement>) {
  const { label, rows, columns, getRowId, getRowLabel, mode = "client", selection = true, isRowSelectable,
    onRowAction, loading, refreshing, errorMessage, onRetry, locale, timeZone, formatDate, className, style, tableRef } = props;
  const { t } = useTranslation();
  const { state, dispatch: localDispatch } = useOwnedGridController(props);
  const dispatch = props.dispatchTransition ?? localDispatch;
  const { layout, setWidths } = useOwnedGridLayoutController(props);
  const processed = useMemo(() => props.processingResult ?? processOwnedGridRows({ ...props, mode, ...state }),
    [props.processingResult, rows, columns, getRowId, mode, props.rowCount, props.hasNextPage, props.filterFields, state.paginationModel, state.sortRules, state.filterRules, state.searchValue]);
  const visible = layout.order.map(field => columns.find(column => column.field === field)!).filter(column => layout.visibility[column.field]);
  const container = useRef<HTMLDivElement | null>(null);
  const table = useRef<HTMLTableElement | null>(null);
  const [availableWidth, setAvailableWidth] = useState(0);
  const resizing = useRef<string | null>(null);
  const reorderWidth = props.rowDrag?.handleColumnWidth ?? 144;
  const measured = measureOwnedGridWidths(visible, availableWidth - (selection ? 80 : 0) - (props.rowDrag ? reorderWidth : 0), layout.widths);
  const pageRows = processed.rows.map(row => ({ id: getOwnedGridRowId(row, getRowId), original: row }));
  const selectable = pageRows.filter(row => isRowSelectable?.(row.original) !== false).map(row => row.id);
  const pageSelection = getOwnedGridPageSelection(state.selectedRowIds, selectable);
  const focus = useRef<{ rowId?: string; field?: string; index: number; element: HTMLElement } | null>(null);
  const previousPage = useRef(state.paginationModel.page);
  const setContainer = useCallback((node: HTMLDivElement | null) => {
    container.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node); else if (forwardedRef) forwardedRef.current = node;
  }, [forwardedRef]);
  const setTable = useCallback((node: HTMLDivElement | HTMLTableElement | null) => {
    const native = node as HTMLTableElement | null;
    table.current = native;
    if (typeof tableRef === "function") tableRef(native); else if (tableRef) tableRef.current = native;
  }, [tableRef]);
  useBrowserLayoutEffect(() => {
    const node = container.current;
    if (!node) return;
    const measure = () => setAvailableWidth(node.clientWidth);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useBrowserLayoutEffect(() => {
    const pageChanged = previousPage.current !== state.paginationModel.page;
    previousPage.current = state.paginationModel.page;
    const saved = focus.current;
    const node = container.current;
    if (!saved || !node) return;
    // Only repair this grid's lost focus. Never take focus from another instance.
    if (document.activeElement !== document.body && !node.contains(document.activeElement)) return;
    if (pageChanged) {
      node.scrollTop = 0;
      (node.querySelector<HTMLElement>("tbody [data-grid-field]:not([data-grid-field='__selection']):not([data-grid-field='__reorder'])") ?? table.current)?.focus();
    } else if (!saved.element.isConnected || (saved.element instanceof HTMLButtonElement && saved.element.disabled)) {
      const cells = [...node.querySelectorAll<HTMLElement>("[data-grid-field]")];
      const cell = cells.find(cell => cell.dataset.gridRow === saved.rowId && cell.dataset.gridField === saved.field) ??
        cells.find(cell => cell.dataset.gridRow === saved.rowId) ?? cells.find(cell => cell.dataset.gridField === saved.field) ?? table.current;
      const controls = cell?.querySelectorAll<HTMLElement>("button, a, input, [role='slider']");
      const control = saved.index >= 0 ? controls?.[saved.index] : undefined;
      (control instanceof HTMLButtonElement && control.disabled ? cell?.querySelector<HTMLElement>("button:not(:disabled)") ?? cell : control ?? cell)?.focus();
    }
  });
  // Only complete, unprocessed client collections have an unambiguous host order.
  const canReorder = !!props.rowDrag && mode === "client" && !loading && !refreshing && errorMessage === undefined &&
    !state.sortRules.length && !state.filterRules.length && !state.searchValue && state.paginationModel.page === 0 &&
    rows.length <= state.paginationModel.pageSize && processed.rowCount === rows.length && state.selectedRowIds.size <= 1;
  const currentReorder = useRef({ rows, canReorder, rowDrag: props.rowDrag, getRowId });
  currentReorder.current = { rows, canReorder, rowDrag: props.rowDrag, getRowId };
  const dragSource = useRef<{ id: string; rows: readonly RowModel[]; getRowId: typeof getRowId } | null>(null);
  const [reorderAnnouncement, setReorderAnnouncement] = useState("");
  const pendingReorderFocus = useRef<{ id: string; label: string | null; rows: readonly RowModel[]; changed?: boolean } | null>(null);
  useEffect(() => {
    const saved = pendingReorderFocus.current;
    const node = container.current;
    if (!saved || (!saved.changed && saved.rows === rows) || !node) return;
    saved.changed = true;
    // Collection focus reconciliation runs after commit. Repair afterwards,
    // checking again that another view has not received focus in the meantime.
    const frame = requestAnimationFrame(() => {
      if (document.activeElement !== document.body && !node.contains(document.activeElement)) { pendingReorderFocus.current = null; return; }
      const cell = [...node.querySelectorAll<HTMLElement>("[data-grid-field='__reorder']")].find(cell => cell.dataset.gridRow === saved.id);
      const buttons = [...(cell?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ?? [])];
      (buttons.find(button => button.getAttribute("aria-label") === saved.label) ?? buttons[0] ?? cell)?.focus();
      if (buttons.length || !cell) pendingReorderFocus.current = null;
    });
    return () => cancelAnimationFrame(frame);
  }, [rows, canReorder]);
  const requestReorder = (sourceId: string, targetId: string, position: "before" | "after") => {
    const current = currentReorder.current;
    const sourceRow = current.rows.find(row => getOwnedGridRowId(row, current.getRowId) === sourceId);
    const targetRow = current.rows.find(row => getOwnedGridRowId(row, current.getRowId) === targetId);
    if (!current.canReorder || !current.rowDrag || sourceRow === undefined || targetRow === undefined || sourceId === targetId || current.rowDrag.isRowDraggable?.(sourceRow) === false) return;
    const sourceIndex = current.rows.indexOf(sourceRow); const targetIndex = current.rows.indexOf(targetRow);
    if ((position === "before" && sourceIndex === targetIndex - 1) || (position === "after" && sourceIndex === targetIndex + 1)) return;
    if (container.current?.contains(document.activeElement)) {
      pendingReorderFocus.current = { id: sourceId, label: document.activeElement?.getAttribute("aria-label") ?? null, rows: current.rows };
    }
    current.rowDrag.onReorder({ sourceRow, sourceRowId: sourceId, targetRow, targetRowId: targetId, position });
    setReorderAnnouncement(t("common.ui.grid.reorderRequested", { defaultMessage: "Move requested for {label}", values: { label: getRowLabel(sourceRow) } }));
  };
  const { dragAndDropHooks } = useDragAndDrop({ isDisabled: !canReorder,
    getItems: keys => [...keys].map(key => {
      const row = rows.find(row => getOwnedGridRowId(row, getRowId) === String(key));
      return { "text/plain": row === undefined ? "" : props.rowDrag?.getRowLabel?.(row) ?? getRowLabel(row) };
    }),
    getAllowedDropOperations: () => ["move"],
    getDropOperation: target => target.type === "item" && target.dropPosition !== "on" ? "move" : "cancel",
    onDragStart: event => {
      const id = event.keys.size === 1 ? String([...event.keys][0]) : "";
      const source = rows.find(row => getOwnedGridRowId(row, getRowId) === id);
      dragSource.current = canReorder && source !== undefined && props.rowDrag?.isRowDraggable?.(source) !== false ? { id, rows, getRowId } : null;
    },
    onReorder: event => {
      const saved = dragSource.current;
      // A response/replacement during a drag invalidates its captured order.
      if (saved && saved.rows === currentReorder.current.rows && saved.getRowId === currentReorder.current.getRowId && event.keys.size === 1 && event.keys.has(saved.id) && event.target.dropPosition !== "on")
        requestReorder(saved.id, String(event.target.key), event.target.dropPosition);
    },
    onDragEnd: () => {
      const saved = dragSource.current;
      dragSource.current = null;
      if (!saved) return;
      requestAnimationFrame(() => {
        const node = container.current;
        if (!node || (document.activeElement !== document.body && !node.contains(document.activeElement))) return;
        const cell = [...node.querySelectorAll<HTMLElement>("[data-grid-field='__reorder']")].find(cell => cell.dataset.gridRow === saved.id);
        (cell?.querySelector<HTMLElement>("[data-sgui-part='grid-drag-handle']:not(:disabled)") ?? cell)?.focus();
      });
    },
    renderDropIndicator: target => <DropIndicator target={target} className={styles.dropIndicator} />,
  });
  const noRows = pageRows.length === 0;
  const status = errorMessage !== undefined ? "error" : loading && noRows ? "loading" : refreshing || loading ? "refreshing" :
    noRows ? (state.searchValue || state.filterRules.length ? "noResults" : "empty") : undefined;
  return <div className={styles.root} onFocusCapture={event => {
      const element = event.target as HTMLElement;
      if (!container.current?.contains(element)) return;
      const cell = element.closest<HTMLElement>("[data-grid-field]");
      focus.current = { rowId: cell?.dataset.gridRow, field: cell?.dataset.gridField, element,
        index: cell ? [...cell.querySelectorAll("button, a, input, [role='slider']")].indexOf(element) : -1 };
    }}><ResizableTableContainer ref={setContainer} className={[styles.container, className].filter(Boolean).join(" ")} style={style}
    data-sgui-part="grid-container" onResize={widths => {
      const active = table.current?.contains(document.activeElement) ? (document.activeElement as HTMLElement)?.closest<HTMLElement>("[data-grid-field]")?.dataset.gridField : undefined;
      const field = active && columns.some(column => column.field === active) ? active : resizing.current;
      const width = field ? widths.get(field) : undefined;
      if (field && typeof width === "number") setWidths({ ...layout.widths, [field]: width });
    }} onResizeEnd={() => { resizing.current = null; }}>
    {status && !noRows && <OwnedGridStatus state={status} message={errorMessage} onRetry={onRetry} />}
    <Table ref={setTable} dragAndDropHooks={dragAndDropHooks} aria-label={label} aria-busy={loading || refreshing || undefined} className={styles.table}
      sortDescriptor={state.sortRules[0] ? { column: state.sortRules[0].field, direction: state.sortRules[0].direction === "asc" ? "ascending" : "descending" } : undefined}
      onSortChange={sort => dispatch({ type: "sort", value: changeOwnedGridHeaderSort(state.sortRules, String(sort.column), sort.direction === "ascending" ? "asc" : "desc") })}
      selectionMode={selection ? "multiple" : "none"} selectionBehavior="toggle"
      selectedKeys={state.selectedRowIds} disabledKeys={pageRows.filter(row => isRowSelectable?.(row.original) === false).map(row => row.id)} disabledBehavior="selection"
      onSelectionChange={keys => {
        // React Aria operates on the loaded collection; retained IDs belong to SGUI.
        const selected = keys === "all" ? new Set(selectable) : new Set([...keys].map(String));
        const next = selectOwnedGridPage(state.selectedRowIds, selectable, false);
        for (const id of selectable) if (selected.has(id)) next.add(id);
        dispatch({ type: "selection", value: next });
      }} onRowAction={onRowAction ? key => {
        const row = pageRows.find(row => row.id === String(key));
        if (row) onRowAction(row.original);
      } : undefined}>
      <TableHeader>
        {selection && <Column id="__selection" width={80} minWidth={80} maxWidth={80} textValue={t("common.ui.grid.selection", { defaultMessage: "Selection" })} className={[styles.header, styles.selection].join(" ")}>
          <div className={styles.selectionControls}><CheckboxContext.Provider value={null}><Checkbox label={t("common.ui.selectPage", { defaultMessage: "Select page" })} checked={pageSelection === "all"} mixed={pageSelection === "some"}
            disabled={!selectable.length} onCheckedChange={checked => dispatch({ type: "selection", value: selectOwnedGridPage(state.selectedRowIds, selectable, checked) })} /></CheckboxContext.Provider>
          <Menu label={t("common.ui.grid.selectionActions", { defaultMessage: "Selection actions" })}
            trigger={<Button variant="text" density="compact" aria-label={t("common.ui.grid.selectionActions", { defaultMessage: "Selection actions" })}><ArrowDropDownIcon /></Button>}
            items={[{ id: "page", label: props.selectPageLabel ?? t("common.ui.selectPage", { defaultMessage: "Select page" }), disabled: !selectable.length },
              { id: "none", label: props.selectNoneLabel ?? t("common.ui.selectNone", { defaultMessage: "None" }) }]}
            onAction={id => dispatch({ type: "selection", value: id === "page" ? selectOwnedGridPage(state.selectedRowIds, selectable, true) : new Set() })} /></div>
        </Column>}
        {props.rowDrag && <Column id="__reorder" width={reorderWidth} minWidth={reorderWidth} maxWidth={reorderWidth} className={styles.header} textValue={t("common.ui.grid.reorder", { defaultMessage: "Reorder" })}>{t("common.ui.grid.reorder", { defaultMessage: "Reorder" })}</Column>}
        {visible.map((column, index) => {
          const direction = state.sortRules.find(rule => rule.field === column.field)?.direction;
          return <Column key={column.field} id={column.field} isRowHeader={index === 0} textValue={column.headerName ?? column.field}
            allowsSorting={column.sortable !== false} width={measured[column.field]} minWidth={column.minWidth ?? 80} maxWidth={column.maxWidth} className={styles.header}
            aria-sort={direction === "asc" ? "ascending" : direction === "desc" ? "descending" : undefined}
            data-grid-field={column.field}>
            <div className={styles.headerContent}>
              {column.sortable !== false ? <OwnedGridHeaderSortMenu label={column.headerName ?? column.field} sortDirection={direction}
                onSortSelect={direction => dispatch({ type: "sort", value: changeOwnedGridHeaderSort(state.sortRules, column.field, direction) })} /> : <span>{column.headerName ?? column.field}</span>}
              <span onFocusCapture={() => { resizing.current = column.field; }} onPointerDownCapture={() => { resizing.current = column.field; }} onKeyDownCapture={() => { resizing.current = column.field; }}><ColumnResizer className={styles.resizer} aria-label={t("common.ui.resizeColumn", { defaultMessage: "Resize {label}", values: { label: column.headerName ?? column.field } })}
                /></span>
            </div>
          </Column>;
        })}

      </TableHeader>
      <TableBody items={pageRows} dependencies={[visible, state.selectedRowIds, locale, timeZone, formatDate, getRowLabel, props.rowDrag, canReorder]} renderEmptyState={() => <OwnedGridStatus state={status ?? "empty"} message={errorMessage} onRetry={onRetry} />}>
        {row => <Row id={row.id} textValue={getRowLabel(row.original)} className={styles.row} data-sgui-part="grid-row" data-grid-row={row.id}>
          {selection && <Cell className={[styles.cell, styles.selection].join(" ")} data-grid-field="__selection" data-grid-row={row.id}>
            <Checkbox slot="selection" label={t("common.ui.selectRow", { defaultMessage: "Select {label}", values: { label: getRowLabel(row.original) } })} />
          </Cell>}
          {props.rowDrag && <Cell className={styles.cell} data-grid-field="__reorder" data-grid-row={row.id}>
            <div className={styles.reorderControls}>
              <DataGridDragHandle slot="drag" label={t("common.ui.dragRow", { defaultMessage: "Reorder {label}", values: { label: props.rowDrag.getRowLabel?.(row.original) ?? getRowLabel(row.original) } })} disabled={!canReorder || props.rowDrag.isRowDraggable?.(row.original) === false} />
              <Button variant="text" tone="neutral" density="compact" disabled={!canReorder || props.rowDrag.isRowDraggable?.(row.original) === false || pageRows[0]?.id === row.id}
                aria-label={t("common.ui.moveUp", { defaultMessage: "Move {label} up", values: { label: getRowLabel(row.original) } })}
                onPress={() => requestReorder(row.id, pageRows[pageRows.findIndex(item => item.id === row.id) - 1]!.id, "before")}>↑</Button>
              <Button variant="text" tone="neutral" density="compact" disabled={!canReorder || props.rowDrag.isRowDraggable?.(row.original) === false || pageRows.at(-1)?.id === row.id}
                aria-label={t("common.ui.moveDown", { defaultMessage: "Move {label} down", values: { label: getRowLabel(row.original) } })}
                onPress={() => requestReorder(row.id, pageRows[pageRows.findIndex(item => item.id === row.id) + 1]!.id, "after")}>↓</Button>
            </div>
          </Cell>}
          {visible.map(column => <Cell key={column.field} className={styles.cell} data-grid-field={column.field} data-grid-row={row.id}>
            <OwnedGridCell row={row.original} column={column} value={getOwnedGridCellValue(row.original, column)} rowLabel={getRowLabel(row.original)} locale={locale} timeZone={timeZone} formatDate={formatDate} />
          </Cell>)}

        </Row>}
      </TableBody>
    </Table>
  </ResizableTableContainer><span role="status" className={styles.announcement}>{reorderAnnouncement}</span></div>;
}

export const OwnedGridInteraction = forwardRef(Interaction) as <RowModel>(props: OwnedGridInteractionProps<RowModel> & { ref?: Ref<HTMLDivElement> }) => ReactElement;
