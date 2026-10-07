"use client";

import { forwardRef, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactElement, type Ref } from "react";
import { Table, TableHeader, Column, TableBody, Row, Cell, ResizableTableContainer, ColumnResizer } from "react-aria-components/Table";
import { CheckboxContext } from "react-aria-components/Checkbox";
import { Checkbox } from "../../experimental/Checkbox/Checkbox";
import { useTranslation } from "../../i18n";
import { changeOwnedGridHeaderSort, measureOwnedGridWidths, type OwnedGridPresentationColumn } from "./ownedGridColumns";
import { getOwnedGridCellValue, getOwnedGridRowId, processOwnedGridRows } from "./ownedGridModel";
import { getOwnedGridPageSelection, selectOwnedGridPage } from "./ownedGridState";
import { useOwnedGridController, type OwnedGridControllerOptions } from "./ownedGridController";
import { useOwnedGridLayoutController, type OwnedGridLayoutControllerOptions } from "./ownedGridLayoutController";
import { OwnedGridCell, type OwnedGridCellProps } from "./ownedGridCells";
import { OwnedGridHeaderSortMenu, OwnedGridStatus } from "./ownedGridParts";
import styles from "./ownedGridInteraction.module.css";

const useBrowserLayoutEffect = typeof document === "undefined" ? useEffect : useLayoutEffect;

/** Internal catalog interaction; public AppDataGrid integration lands separately. */
export interface OwnedGridInteractionProps<RowModel> extends OwnedGridControllerOptions<RowModel>, OwnedGridLayoutControllerOptions<RowModel> {
  label: string;
  rows: readonly RowModel[];
  columns: readonly OwnedGridPresentationColumn<RowModel>[];
  getRowId?: (row: RowModel) => string;
  getRowLabel: (row: RowModel) => string;
  mode?: "client" | "server";
  selection?: boolean;
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
  const { state, dispatch } = useOwnedGridController(props);
  const { layout, setWidths } = useOwnedGridLayoutController(props);
  const processed = useMemo(() => processOwnedGridRows({ ...props, mode, ...state }),
    [rows, columns, getRowId, mode, props.rowCount, props.hasNextPage, props.filterFields, state.paginationModel, state.sortRules, state.filterRules, state.searchValue]);
  const visible = layout.order.map(field => columns.find(column => column.field === field)!).filter(column => layout.visibility[column.field]);
  const container = useRef<HTMLDivElement | null>(null);
  const table = useRef<HTMLTableElement | null>(null);
  const [availableWidth, setAvailableWidth] = useState(0);
  const resizing = useRef<string | null>(null);
  const measured = measureOwnedGridWidths(visible, availableWidth - (selection ? 48 : 0), layout.widths);
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
      (node.querySelector<HTMLElement>("tbody [data-grid-field]") ?? table.current)?.focus();
    } else if (!saved.element.isConnected) {
      const cells = [...node.querySelectorAll<HTMLElement>("[data-grid-field]")];
      const cell = cells.find(cell => cell.dataset.gridRow === saved.rowId && cell.dataset.gridField === saved.field) ??
        cells.find(cell => cell.dataset.gridRow === saved.rowId) ?? cells.find(cell => cell.dataset.gridField === saved.field) ?? table.current;
      const controls = cell?.querySelectorAll<HTMLElement>("button, a, input, [role='slider']");
      (saved.index >= 0 ? controls?.[saved.index] ?? cell : cell)?.focus();
    }
  });
  const noRows = pageRows.length === 0;
  const status = errorMessage !== undefined ? "error" : loading && noRows ? "loading" : refreshing || loading ? "refreshing" :
    noRows ? (state.searchValue || state.filterRules.length ? "noResults" : "empty") : undefined;
  return <div onFocusCapture={event => {
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
    <Table ref={setTable} aria-label={label} aria-busy={loading || refreshing || undefined} className={styles.table}
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
        {selection && <Column id="__selection" width={48} minWidth={48} maxWidth={48} textValue={t("common.ui.grid.selection", { defaultMessage: "Selection" })} className={[styles.header, styles.selection].join(" ")}>
          <CheckboxContext.Provider value={null}><Checkbox label={t("common.ui.selectPage", { defaultMessage: "Select page" })} checked={pageSelection === "all"} mixed={pageSelection === "some"}
            disabled={!selectable.length} onCheckedChange={checked => dispatch({ type: "selection", value: selectOwnedGridPage(state.selectedRowIds, selectable, checked) })} /></CheckboxContext.Provider>
        </Column>}
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
      <TableBody items={pageRows} dependencies={[visible, state.selectedRowIds, locale, timeZone, formatDate, getRowLabel]} renderEmptyState={() => <OwnedGridStatus state={status ?? "empty"} message={errorMessage} onRetry={onRetry} />}>
        {row => <Row id={row.id} textValue={getRowLabel(row.original)} className={styles.row}>
          {selection && <Cell className={[styles.cell, styles.selection].join(" ")} data-grid-field="__selection" data-grid-row={row.id}>
            <Checkbox slot="selection" label={t("common.ui.selectRow", { defaultMessage: "Select {label}", values: { label: getRowLabel(row.original) } })} />
          </Cell>}
          {visible.map(column => <Cell key={column.field} className={styles.cell} data-grid-field={column.field} data-grid-row={row.id}>
            <OwnedGridCell row={row.original} column={column} value={getOwnedGridCellValue(row.original, column)} rowLabel={getRowLabel(row.original)} locale={locale} timeZone={timeZone} formatDate={formatDate} />
          </Cell>)}
        </Row>}
      </TableBody>
    </Table>
  </ResizableTableContainer></div>;
}

export const OwnedGridInteraction = forwardRef(Interaction) as <RowModel>(props: OwnedGridInteractionProps<RowModel> & { ref?: Ref<HTMLDivElement> }) => ReactElement;
