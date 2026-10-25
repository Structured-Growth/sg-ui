"use client";

import { forwardRef, useCallback, useEffect, useLayoutEffect, useId, useMemo, useRef, useState, type CSSProperties, type ReactElement, type Ref } from "react";
import { Table, TableHeader, Column, TableBody, Row, Cell, ResizableTableContainer, ColumnResizer, type TableRenderProps } from "react-aria-components/Table";
import { useDragAndDrop, DropIndicator } from "react-aria-components/useDragAndDrop";
import { DropZone } from "react-aria-components/DropZone";
import { DataGridDragHandle } from "../AppDataGridRowDnd/DataGridDragHandle";
import type { AppDataGridRowDragConfig } from "./types";
import { CheckboxContext } from "react-aria-components/Checkbox";
import { Menu } from "../../experimental/Menu/Menu";
import { Button } from "../../components/Button/Button";
import { ArrowDropDownIcon } from "../../experimental/icons/ArrowDropDownIcon";
import { Checkbox } from "../../experimental/Checkbox/Checkbox";
import { useTranslation } from "../../i18n";
import { createOwnedGridColumns, changeOwnedGridHeaderSort, measureOwnedGridWidths, retainOwnedGridFlexColumn, type OwnedGridPresentationColumn } from "./ownedGridColumns";
import { getOwnedGridCellValue, getOwnedGridRowId, processOwnedGridRows, type OwnedGridProcessingResult } from "./ownedGridModel";
import { getOwnedGridPageSelection, selectOwnedGridPage } from "./ownedGridState";
import { useOwnedGridController, type OwnedGridControllerOptions } from "./ownedGridController";
import { useOwnedGridLayoutController, type OwnedGridLayoutControllerOptions } from "./ownedGridLayoutController";
import { OwnedGridCell, type OwnedGridCellProps } from "./ownedGridCells";
import { OwnedGridHeaderSortMenu, OwnedGridStatus } from "./ownedGridParts";
import type { OwnedGridTransition } from "./ownedGridState";
import { canResizeLeadingColumn } from "../../experimental/DataGrid/column-sizing";
import { useLeadingColumnResize } from "../../experimental/DataGrid/useLeadingColumnResize";
import styles from "./ownedGridInteraction.module.css";

const useBrowserLayoutEffect = typeof document === "undefined" ? useEffect : useLayoutEffect;

function syncNativeBusy(node: HTMLTableElement | null, busy: boolean) {
  if (!node) return;
  if (busy && node.getAttribute("aria-busy") !== "true") node.setAttribute("aria-busy", "true");
  else if (!busy && node.hasAttribute("aria-busy")) node.removeAttribute("aria-busy");
}

/** Internal catalog interaction; public AppDataGrid integration lands separately. */
export interface OwnedGridInteractionProps<RowModel> extends OwnedGridControllerOptions<RowModel>, OwnedGridLayoutControllerOptions<RowModel> {
  dispatchTransition?: (action: OwnedGridTransition) => void;
  /** Internal shell placement: the toolbar owns error announcement and retry. */
  errorInToolbar?: boolean;
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
  const definitions = useMemo(() => createOwnedGridColumns(columns), [columns]);
  const visible = layout.order.map(field => definitions.find(column => column.field === field)!).filter(column => layout.visibility[column.field]);
  const root = useRef<HTMLDivElement | null>(null);
  const statusNode = useRef<HTMLDivElement | null>(null);
  const statusFocus = useRef<HTMLElement | null>(null);
  const statusScroll = useRef<{ entry: HTMLElement; node: HTMLDivElement; top: number; left: number } | null>(null);
  const container = useRef<HTMLDivElement | null>(null);
  const table = useRef<HTMLTableElement | null>(null);
  const tableState = useRef<TableRenderProps["state"] | null>(null);
  const busy = !!(loading || refreshing);
  const currentBusy = useRef(busy);
  currentBusy.current = busy;
  const [availableWidth, setAvailableWidth] = useState(0);
  const resizing = useRef<string | null>(null);
  const selectionObserver = useRef<ResizeObserver | null>(null);
  const [selectionWidth, setSelectionWidth] = useState(80);
  const showReorderColumn = !!props.rowDrag && (!selection || props.rowDrag.showMoveButtons === true);
  const dragCellField = selection ? "__selection" : "__reorder";
  const reorderWidth = props.rowDrag?.handleColumnWidth ?? (props.rowDrag?.showMoveButtons ? 144 : 80);
  const measured = measureOwnedGridWidths(visible, availableWidth - (selection ? selectionWidth : 0) - (showReorderColumn ? reorderWidth : 0), layout.widths);
  const pointerWidths = useRef<Record<string, number>>({});
  const pointerResize = useLeadingColumnResize((snapshot, width, cancelled) => {
    if (cancelled) { setWidths(pointerWidths.current); return; }
    const next = { ...snapshot.widths, [snapshot.field]: width };
    setWidths(availableWidth > 0 ? retainOwnedGridFlexColumn(visible, next, snapshot.field) : next);
  });
  const pageRows = processed.rows.map(row => ({ id: getOwnedGridRowId(row, getRowId), original: row }));
  const selectable = pageRows.filter(row => isRowSelectable?.(row.original) !== false).map(row => row.id);
  const pageSelection = getOwnedGridPageSelection(state.selectedRowIds, selectable);
  const selectionAnchor = useRef<{id:string; page:string} | null>(null);
  const pendingSelectionRange = useRef<{ids:string[]; checked:boolean} | null>(null);
  const selectionPage = JSON.stringify(pageRows.map(row => row.id));
  function prepareRowSelection(target:EventTarget,shift:boolean) {
    pendingSelectionRange.current = null;
    const cell = (target as HTMLElement).closest<HTMLElement>('[data-grid-field="__selection"]');
    const id = cell?.dataset.gridRow;
    if (!selection || !id || !cell?.querySelector("label")?.contains(target as Node) || !selectable.includes(id)) return;
    const anchor = selectionAnchor.current;
    if (shift && anchor?.page === selectionPage) {
      const start = pageRows.findIndex(row => row.id === anchor.id);
      const end = pageRows.findIndex(row => row.id === id);
      if (start >= 0 && end >= 0) pendingSelectionRange.current = {
        ids: pageRows.slice(Math.min(start,end),Math.max(start,end)+1)
          .filter(row => isRowSelectable?.(row.original) !== false).map(row => row.id),
        checked: !state.selectedRowIds.has(id),
      };
    }
    // Every activated selector becomes the next anchor, including a Shift press.
    selectionAnchor.current = {id,page:selectionPage};
  }

  const focus = useRef<{ rowId?: string; field?: string; index: number; element: HTMLElement } | null>(null);
  const previousPage = useRef(state.paginationModel);
  const previousReorderEnabled = useRef(!!props.rowDrag);
  const reorderFocusFrame = useRef<number | null>(null);
  useEffect(() => () => {
    if (reorderFocusFrame.current !== null) cancelAnimationFrame(reorderFocusFrame.current);
  }, []);
  const setContainer = useCallback((node: HTMLDivElement | null) => {
    container.current = node;
    // Firefox otherwise adds the overflow pane as an implicit native Tab stop.
    // The interaction wrapper filters tabIndex; this owned native ref delegates
    // collection entry to the table while preserving programmatic pane focus.
    if (node) node.tabIndex = -1;
    if (typeof forwardedRef === "function") forwardedRef(node); else if (forwardedRef) forwardedRef.current = node;
  }, [forwardedRef]);
  const setTable = useCallback((node: HTMLDivElement | HTMLTableElement | null) => {
    const native = node as HTMLTableElement | null;
    table.current = native;
    // React Aria Table filters aria-busy. Keep the owned state on its native
    // element, including replacement tables, before exposing the host ref.
    syncNativeBusy(native, currentBusy.current);
    if (typeof tableRef === "function") tableRef(native); else if (tableRef) tableRef.current = native;
  }, [tableRef]);
  useBrowserLayoutEffect(() => {
    // Reassert after each commit without recreating the collection or ref.
    syncNativeBusy(table.current, busy);
  });
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
  // A collection ref can arrive after the first layout effect. Observe it
  // directly: storing this DOM node in state rerenders every grid cell on mount.
  const observeSelectionControls = useCallback((controls: HTMLDivElement | null) => {
    selectionObserver.current?.disconnect();
    selectionObserver.current = null;
    const header = controls?.closest("th");
    if (!controls || !header) return;
    const measure = () => {
      const children = [...controls.children].map(child => child.getBoundingClientRect()).filter(box => box.width > 0 && box.height > 0);
      const controlStyle = getComputedStyle(controls), headerStyle = getComputedStyle(header);
      const pixels = (value: string) => Number.parseFloat(value) || 0;
      const contentWidth = children.reduce((width, box) => width + box.width, 0) + Math.max(0, children.length - 1) * pixels(controlStyle.columnGap);
      const chrome = pixels(headerStyle.paddingInlineStart) + pixels(headerStyle.paddingInlineEnd) + pixels(headerStyle.borderInlineStartWidth) + pixels(headerStyle.borderInlineEndWidth);
      // Read actual token-sized children so coarse/touch and enlarged text fit,
      // retaining the historical pointer allocation and one shared sizing budget.
      setSelectionWidth(Math.max(80, Math.ceil(contentWidth + chrome)));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(controls);
    for (const child of controls.children) observer.observe(child);
    selectionObserver.current = observer;
  }, []);
  useBrowserLayoutEffect(() => {
    const saved = statusFocus.current;
    if (!saved && !statusScroll.current) return;
    const preserveScroll = () => {
      const scroll = statusScroll.current;
      // React Aria also scrolls its active cell after focus reconciliation.
      // Retain this interaction's scroll only while it still owns that entry.
      if (!scroll?.node.isConnected || !scroll.entry.contains(document.activeElement)) return;
      scroll.node.scrollTop = scroll.top;
      scroll.node.scrollLeft = scroll.left;
    };
    const restore = () => {
      // Empty-state content may commit after its parent collection. Recheck
      // ownership after that commit, including any deliberate host focus move.
      if (!saved || statusFocus.current !== saved || saved.isConnected) return;
      statusFocus.current = null;
      const node = container.current;
      if (document.activeElement !== document.body || !node?.isConnected) return;
      const bodyCell = node.querySelector<HTMLElement>("tbody [data-grid-field]:not([data-grid-field='__selection']):not([data-grid-field='__reorder'])");
      const header = node.querySelector<HTMLElement>("thead [data-grid-field]");
      const entry = bodyCell ?? header?.querySelector<HTMLElement>("button:not(:disabled), [role='slider']") ?? header ?? table.current;
      if (!entry) return;
      statusScroll.current = { entry, node, top: node.scrollTop, left: node.scrollLeft };
      entry.focus({ preventScroll: true });
      preserveScroll();
    };
    restore();
    let frame = requestAnimationFrame(() => {
      restore();
      preserveScroll();
      // React Aria schedules its keyboard scroll in a passive-effect frame,
      // after this layout effect's frame. Repair after that native scroll too.
      frame = requestAnimationFrame(() => { preserveScroll(); statusScroll.current = null; });
    });
    return () => cancelAnimationFrame(frame);
  });
  useBrowserLayoutEffect(() => {
    const pageChanged = previousPage.current.page !== state.paginationModel.page || previousPage.current.pageSize !== state.paginationModel.pageSize;
    previousPage.current = state.paginationModel;
    const reorderChanged = previousReorderEnabled.current !== !!props.rowDrag;
    previousReorderEnabled.current = !!props.rowDrag;
    const saved = focus.current;
    const node = container.current;
    if (!saved || !node) return;
    // Only repair this grid's lost focus. Never take focus from another instance.
    if (document.activeElement !== document.body && !node.contains(document.activeElement)) return;
    if (pageChanged) {
      node.scrollTop = 0;
      node.scrollLeft = 0;
      (node.querySelector<HTMLElement>("tbody [data-grid-field]:not([data-grid-field='__selection']):not([data-grid-field='__reorder'])") ?? table.current)?.focus({ preventScroll: true });
    } else if (!saved.element.isConnected || (saved.element instanceof HTMLButtonElement && saved.element.disabled)) {
      const restore = () => {
        if (!node.isConnected || (document.activeElement !== document.body && !node.contains(document.activeElement))) return;
        const cells = [...node.querySelectorAll<HTMLElement>("[data-grid-field]")];
        const cell = cells.find(cell => cell.dataset.gridRow === saved.rowId && cell.dataset.gridField === saved.field) ??
          cells.find(cell => cell.dataset.gridRow === saved.rowId) ??
          cells.find(cell => cell.dataset.gridRow !== undefined && cell.dataset.gridField === saved.field) ??
          cells.find(cell => cell.dataset.gridField === saved.field) ?? table.current;
        const controls = cell?.querySelectorAll<HTMLElement>("button, a, input, [role='slider']");
        const control = saved.index >= 0 ? controls?.[saved.index] : undefined;
        (control instanceof HTMLButtonElement && control.disabled ? cell?.querySelector<HTMLElement>("button:not(:disabled)") ?? cell : control ?? cell)?.focus({ preventScroll: true });
      };
      restore();
      // A newly mounted React Aria collection reconciles focus after commit.
      if (reorderChanged) {
        if (reorderFocusFrame.current !== null) cancelAnimationFrame(reorderFocusFrame.current);
        reorderFocusFrame.current = requestAnimationFrame(() => {
          reorderFocusFrame.current = null;
          restore();
        });
      }
    }
  });
  const transfer = props.rowDrag?.mode === "transfer";
  const dragMime = `application/x-sgui-grid-${useId().replace(/[^a-z0-9]/gi, "")}`;
  const canTransfer = transfer && !loading && !refreshing && errorMessage === undefined;
  // Only complete, unprocessed client collections have an unambiguous host order.
  const canReorder = !!props.rowDrag && !transfer && mode === "client" && !loading && !refreshing && errorMessage === undefined &&
    !state.sortRules.length && !state.filterRules.length && !state.searchValue && state.paginationModel.page === 0 &&
    rows.length <= state.paginationModel.pageSize && processed.rowCount === rows.length;
  const currentReorder = useRef({ rows, dragRows: transfer ? processed.rows : rows, canReorder, canTransfer, rowDrag: props.rowDrag, getRowId, selectedIds: state.selectedRowIds });
  currentReorder.current = { rows, dragRows: transfer ? processed.rows : rows, canReorder, canTransfer, rowDrag: props.rowDrag, getRowId, selectedIds: state.selectedRowIds };
  const dragAnchor = useRef<string | null>(null);
  // Native dragstart capture identifies pointer drags; a pointer press alone
  // must not classify a later keyboard drag as pointer input.
  const dragModality = useRef<"pointer" | "keyboard">("keyboard");
  const dragSource = useRef<{ ids: string[]; id: string; rows: readonly RowModel[]; getRowId: typeof getRowId; handle: HTMLButtonElement | null; pointer: boolean } | null>(null);
  const cancelDropFocus = useRef<(() => void) | null>(null);
  const cancelPointerDropFocus = useRef<(() => void) | null>(null);
  useBrowserLayoutEffect(() => () => cancelPointerDropFocus.current?.(), []);
  useBrowserLayoutEffect(() => () => cancelDropFocus.current?.(), [rows, getRowId, canReorder]);
  const [reorderAnnouncement, setReorderAnnouncement] = useState("");
  const pendingReorderFocus = useRef<{ id: string; label: string | null; field?: string; rows: readonly RowModel[]; changed?: boolean } | null>(null);
  useEffect(() => {
    const saved = pendingReorderFocus.current;
    const node = container.current;
    if (!saved || (!saved.changed && saved.rows === rows) || !node) return;
    saved.changed = true;
    // Collection focus reconciliation runs after commit. Repair afterwards,
    // checking again that another view has not received focus in the meantime.
    const frame = requestAnimationFrame(() => {
      if (document.activeElement !== document.body && !node.contains(document.activeElement)) { pendingReorderFocus.current = null; return; }
      const cell = [...node.querySelectorAll<HTMLElement>(`[data-grid-field='${saved.field ?? dragCellField}']`)].find(cell => cell.dataset.gridRow === saved.id);
      const buttons = [...(cell?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ?? [])];
      const grip = cell?.closest("tr")?.querySelector<HTMLButtonElement>("[data-sgui-part='grid-drag-handle']:not(:disabled)");
      (buttons.find(button => button.getAttribute("aria-label") === saved.label) ?? grip ?? buttons[0] ?? cell)?.focus();
      if (buttons.length || !cell) pendingReorderFocus.current = null;
    });
    return () => cancelAnimationFrame(frame);
  }, [rows, canReorder]);
  const moveRows = (sourceId: string) => {
    const current = currentReorder.current;
    return current.dragRows.filter(row => {
      const id = getOwnedGridRowId(row, current.getRowId);
      return current.selectedIds.has(sourceId) ? current.selectedIds.has(id) : id === sourceId;
    });
  };
  const canMoveRow = (sourceId: string) => (canReorder || canTransfer) && moveRows(sourceId).every(row => props.rowDrag?.isRowDraggable?.(row) !== false);
  const adjacentTarget = (sourceId: string, direction: "before" | "after") => {
    const sources = moveRows(sourceId);
    const edge = direction === "before" ? sources[0] : sources.at(-1);
    const index = edge === undefined ? -1 : rows.indexOf(edge);
    return index < 0 ? undefined : rows[index + (direction === "before" ? -1 : 1)];
  };
  const requestReorder = (sourceId: string, targetId: string, position: "before" | "after", capturedIds?: readonly string[]) => {
    const current = currentReorder.current;
    const sourceRow = current.rows.find(row => getOwnedGridRowId(row, current.getRowId) === sourceId);
    const targetRow = current.rows.find(row => getOwnedGridRowId(row, current.getRowId) === targetId);
    const sourceRows = moveRows(sourceId);
    const sourceRowIds = sourceRows.map(row => getOwnedGridRowId(row, current.getRowId));
    if (!current.canReorder || !current.rowDrag || current.rowDrag.mode === "transfer" || sourceRow === undefined || targetRow === undefined || !sourceRows.length ||
      sourceRowIds.includes(targetId) || sourceRows.some(row => current.rowDrag?.isRowDraggable?.(row) === false) ||
      (capturedIds && (capturedIds.length !== sourceRowIds.length || capturedIds.some((id, index) => id !== sourceRowIds[index])))) return;
    const remaining = current.rows.filter(row => !sourceRows.includes(row));
    const targetIndex = remaining.indexOf(targetRow);
    remaining.splice(targetIndex + (position === "after" ? 1 : 0), 0, ...sourceRows);
    if (remaining.every((row, index) => row === current.rows[index])) return;
    if (!dragSource.current?.pointer && container.current?.contains(document.activeElement)) {
      pendingReorderFocus.current = { id: sourceId, label: document.activeElement?.getAttribute("aria-label") ?? null, field: document.activeElement?.closest<HTMLElement>("[data-grid-field]")?.dataset.gridField, rows: current.rows };
    }
    current.rowDrag.onReorder({ sourceRow, sourceRowId: sourceId, sourceRows, sourceRowIds, targetRow, targetRowId: targetId, position });
    setReorderAnnouncement(sourceRows.length > 1
      ? t("common.ui.grid.reorderGroupRequested", { defaultMessage: "Move requested for {count} rows", values: { count: sourceRows.length } })
      : t("common.ui.grid.reorderRequested", { defaultMessage: "Move requested for {label}", values: { label: getRowLabel(sourceRow) } }));
  };
  const { dragAndDropHooks } = useDragAndDrop({ isDisabled: !(canReorder || canTransfer) || props.rowDrag?.dragDisabled === true,
    renderDragPreview: items => ({
      element: <span className={styles.dragPreview} data-sgui-part="grid-row-drag-preview">{t("common.ui.grid.dragRowCount", { defaultMessage: "{count, plural, one {# row} other {# rows}}", values: { count: items.length } })}</span>,
      x: -4, y: 16,
    }),
    getItems: keys => [...keys].map(key => {
      const row = rows.find(row => getOwnedGridRowId(row, getRowId) === String(key));
      return { "text/plain": row === undefined ? "" : props.rowDrag?.getRowLabel?.(row) ?? getRowLabel(row), ...(transfer ? {[dragMime]: String(key)} : {}) };
    }),
    getAllowedDropOperations: () => transfer ? ["copy", "move"] : ["move"],
    getDropOperation: target => !transfer && target.type === "item" && target.dropPosition !== "on" ? "move" : "cancel",
    onDragStart: event => {
      cancelDropFocus.current?.();
      cancelPointerDropFocus.current?.();
      if (dragModality.current === "pointer") pendingReorderFocus.current = null;
      const id = dragAnchor.current && event.keys.has(dragAnchor.current) ? dragAnchor.current : String([...event.keys][0] ?? "");
      const ids = (transfer ? processed.rows : rows).filter(row => event.keys.has(getOwnedGridRowId(row, getRowId))).map(row => getOwnedGridRowId(row, getRowId));
      const source = rows.find(row => getOwnedGridRowId(row, getRowId) === id);
      const cell = [...(container.current?.querySelectorAll<HTMLElement>(`[data-grid-field='${dragCellField}']`) ?? [])].find(cell => cell.dataset.gridRow === id);
      const handle = cell?.querySelector<HTMLButtonElement>("[data-sgui-part='grid-drag-handle']") ?? null;
      dragSource.current = canMoveRow(id) && !props.rowDrag?.dragDisabled && source !== undefined ? { ids, id, rows, getRowId, handle, pointer: dragModality.current === "pointer" } : null;
    },
    onReorder: transfer ? undefined : event => {
      const saved = dragSource.current;
      // A response/replacement during a drag invalidates its captured order.
      if (saved && !currentReorder.current.rowDrag?.dragDisabled && saved.rows === currentReorder.current.rows && saved.getRowId === currentReorder.current.getRowId && event.keys.size === saved.ids.length && saved.ids.every(id => event.keys.has(id)) && event.target.dropPosition !== "on")
        requestReorder(saved.id, String(event.target.key), event.target.dropPosition, saved.ids);
    },
    onDragEnd: event => {
      const saved = dragSource.current;
      dragSource.current = null;
      dragModality.current = "keyboard";
      cancelDropFocus.current?.();
      cancelPointerDropFocus.current?.();
      const node = container.current;
      if (saved?.pointer && node) {
        // Native drag completion may replay collection focus onto any grip.
        // Pointer drops do not own keyboard focus; release only that replay,
        // and stop observing as soon as the user makes another input choice.
        let frame: number | null = null;
        const cancel = () => {
          if (frame !== null) cancelAnimationFrame(frame);
          frame = null;
          document.removeEventListener("focusin", onFocus, true);
          document.removeEventListener("pointerdown", cancel, true);
          document.removeEventListener("keydown", cancel, true);
          if (cancelPointerDropFocus.current === cancel) cancelPointerDropFocus.current = null;
        };
        const schedule = () => {
          if (frame !== null) cancelAnimationFrame(frame);
          frame = requestAnimationFrame(() => {
            frame = null;
            if (!node.isConnected) { cancel(); return; }
            const active = document.activeElement;
            if (active instanceof HTMLElement && node.contains(active) && active.matches("[data-sgui-part='grid-drag-handle']")) active.blur();
          });
        };
        const onFocus = (event: FocusEvent) => {
          if (!(event.target instanceof HTMLElement)) return;
          if (node.contains(event.target) && event.target.matches("[data-sgui-part='grid-drag-handle']")) schedule();
          else if (!node.contains(event.target) && event.target !== document.body) cancel();
        };
        cancelPointerDropFocus.current = cancel;
        document.addEventListener("focusin", onFocus, true);
        document.addEventListener("pointerdown", cancel, true);
        document.addEventListener("keydown", cancel, true);
        schedule();
        return;
      }
      const handle = saved?.handle;
      const sourceRow = handle?.closest<HTMLElement>("tr[data-grid-row]");
      if (!saved || !node || !handle?.isConnected || handle.disabled || !sourceRow || sourceRow.dataset.gridRow !== saved.id || !node.contains(handle) ||
        (document.activeElement !== document.body && !node.contains(document.activeElement))) return;
      const snapshot = currentReorder.current;
      let frame: number | null = null;
      const sourceCell = handle.closest("[data-grid-field]");
      // Keyboard cancellation restores the drag handle, then the collection
      // may briefly reconcile to its one selected row. Admit only that exact
      // native row entry before our first repair, never its controls or cells.
      const selectedId = event.dropOperation === "cancel" && state.selectedRowIds.size === 1 ? [...state.selectedRowIds][0] : undefined;
      const cancellationRow = selectedId === undefined ? null : [...node.querySelectorAll<HTMLElement>("tr[data-grid-row]")].find(row => row.dataset.gridRow === selectedId);
      const entry = document.activeElement;
      const dropEntry = entry instanceof HTMLElement && node.contains(entry) && entry.getAttribute("aria-roledescription") === "drop indicator";
      if (entry !== document.body && entry !== handle && entry !== sourceRow && entry !== sourceCell && entry !== cancellationRow && !dropEntry) return;
      let initial = true;
      if (event.dropOperation === "cancel" && dropEntry) {
        // Keyboard-visible nested focus preserves the previous collection cell
        // key. Align that internal key before DragManager restores/replays the
        // source handle, without focusing a cell or changing selected rows.
        const interaction = tableState.current;
        const column = interaction?.collection.columns.find(column => column.key === dragCellField);
        const cell = column ? [...(interaction?.collection.getChildren?.(saved.id) ?? [])].find(cell => cell.index === column.index) : undefined;
        if (cell) interaction?.selectionManager.setFocusedKey(cell.key);
      }
      const cancel = () => {
        if (frame !== null) cancelAnimationFrame(frame);
        frame = null;
        document.removeEventListener("focusin", onFocus, true);
        document.removeEventListener("pointerdown", cancel, true);
        document.removeEventListener("keydown", cancel, true);
        if (cancelDropFocus.current === cancel) cancelDropFocus.current = null;
      };
      const schedule = () => {
        if (frame !== null) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          frame = null;
          const current = currentReorder.current;
          if (!node.isConnected || !handle.isConnected || handle.disabled || !(current.canReorder || current.canTransfer) ||
            current.rows !== snapshot.rows || current.getRowId !== snapshot.getRowId || !sourceRow.contains(handle) || sourceRow.dataset.gridRow !== saved.id) { cancel(); return; }
          // Restore only our source entry. A host/other control owns any other
          // focus, including a deliberate move followed by removal to body.
          const active = document.activeElement;
          const ownsEntry = active === document.body || active === sourceRow || active === sourceCell || (initial && active === cancellationRow);
          initial = false;
          if (ownsEntry) handle.focus({ preventScroll: true });
          else if (active !== handle) cancel();
        });
      };
      const onFocus = (event: FocusEvent) => {
        if (event.target === handle) return;
        // React Aria may reconcile the internal drop to the source TR after
        // our initial frame. Follow that observed native focus event, rather
        // than guessing the dependency's delayed reconciliation interval.
        if (event.target === sourceRow || event.target === sourceCell || (initial && event.target === cancellationRow)) schedule();
        else cancel();
      };
      cancelDropFocus.current = cancel;
      document.addEventListener("focusin", onFocus, true);
      document.addEventListener("pointerdown", cancel, true);
      document.addEventListener("keydown", cancel, true);
      schedule();
    },
    renderDropIndicator: target => <DropIndicator target={target} className={styles.dropIndicator} />,
  });
  const noRows = pageRows.length === 0;
  const status = errorMessage !== undefined ? "error" : loading && noRows ? "loading" : refreshing || loading ? "refreshing" :
    noRows ? (state.searchValue || state.filterRules.length ? "noResults" : "empty") : undefined;
  const renderGrip = (row: {id:string; original:RowModel}) => props.rowDrag && <span className={styles.gripOwner}
    onPointerDownCapture={() => { dragAnchor.current = row.id; }} onFocusCapture={() => { dragAnchor.current = row.id; }}>
    <DataGridDragHandle className={styles.inlineGrip} slot="drag"
      label={transfer ? t("common.ui.grid.transferRow", {defaultMessage:"Drag {label}",values:{label:props.rowDrag.getRowLabel?.(row.original) ?? getRowLabel(row.original)}}) : t("common.ui.dragRow", {defaultMessage:"Reorder {label}",values:{label:props.rowDrag.getRowLabel?.(row.original) ?? getRowLabel(row.original)}})}
      disabled={!canMoveRow(row.id) || props.rowDrag.dragDisabled}/>
  </span>;
  return <div ref={root} className={styles.root}
    onDragStartCapture={() => { dragModality.current = "pointer"; }}
    onPointerDownCapture={event => { dragModality.current = "keyboard"; prepareRowSelection(event.target,event.shiftKey); }}
    onPointerCancelCapture={() => { pendingSelectionRange.current = null; }}
    onKeyDownCapture={event => {
      dragModality.current = "keyboard";
      if (event.key === " " || event.key === "Enter") prepareRowSelection(event.target,event.shiftKey);
      else pendingSelectionRange.current = null;
    }} onBlurCapture={event => {
      // A deliberate move to a host control or another grid ends our ownership.
      // A removed focused node has no related target and still needs repair.
      if (event.relatedTarget instanceof Node && !root.current?.contains(event.relatedTarget)) {
        cancelDropFocus.current?.();
        if (dragSource.current) dragSource.current.handle = null;
        focus.current = null;
        statusFocus.current = null;
        statusScroll.current = null;
      }
    }} onFocusCapture={event => {
      const element = event.target as HTMLElement;
      if (!statusScroll.current?.entry.contains(element)) statusScroll.current = null;
      statusFocus.current = statusNode.current?.contains(element) ? element : null;
      if (statusFocus.current) { focus.current = null; return; }
      if (!container.current?.contains(element)) return;
      const cell = element.closest<HTMLElement>("[data-grid-field]");
      focus.current = { rowId: cell?.dataset.gridRow, field: cell?.dataset.gridField, element,
        index: cell ? [...cell.querySelectorAll("button, a, input, [role='slider']")].indexOf(element) : -1 };
    }}>{status && !noRows && !(status === "error" && props.errorInToolbar) && <OwnedGridStatus ref={statusNode} state={status} message={errorMessage} onRetry={onRetry} />}
    {props.rowDrag?.mode === "transfer" && <div className={styles.transferTargets}>
      {props.rowDrag.dropTargets.map(target => <DropZone key={target.id} aria-label={t("common.ui.grid.dropRows",{defaultMessage:"Drop rows: {label}",values:{label:target.label}})}
        className={styles.transferTarget} isDisabled={target.disabled || !canTransfer || props.rowDrag?.dragDisabled}
        getDropOperation={types => types.has(dragMime) ? target.operation ?? "copy" : "cancel"}
        onDrop={async event => {
          const saved = dragSource.current;
          if (!saved) return;
          const ids = await Promise.all(event.items.map(item => item.kind === "text" && item.types.has(dragMime) ? item.getText(dragMime).catch(() => null) : Promise.resolve(null)));
          const current = currentReorder.current;
          const config = current.rowDrag;
          if (config?.mode !== "transfer" || !current.canTransfer || config.dragDisabled || current.rows !== saved.rows || current.getRowId !== saved.getRowId || ids.length !== saved.ids.length || new Set(ids).size !== saved.ids.length || ids.some(id => id === null || !saved.ids.includes(id))) return;
          const destination = config.dropTargets.find(item => item.id === target.id);
          const sources = moveRows(saved.id);
          if (!destination || destination.disabled || event.dropOperation !== (destination.operation ?? "copy") || sources.length !== saved.ids.length || sources.some(row => !saved.ids.includes(getOwnedGridRowId(row,current.getRowId)) || config.isRowDraggable?.(row) === false)) return;
          config.onDrop({sourceRows:sources,sourceRowIds:saved.ids,targetId:target.id,operation:destination.operation ?? "copy"});
        }}>
        <Button variant="outlined" tone="neutral" disabled={target.disabled || !canTransfer || props.rowDrag?.dragDisabled || !processed.rows.some(row => state.selectedRowIds.has(getOwnedGridRowId(row,getRowId))) || processed.rows.some(row => state.selectedRowIds.has(getOwnedGridRowId(row,getRowId)) && props.rowDrag?.isRowDraggable?.(row) === false)}
          onPress={() => {
            const config = currentReorder.current.rowDrag;
            if (config?.mode !== "transfer") return;
            const sources = processed.rows.filter(row => state.selectedRowIds.has(getOwnedGridRowId(row,getRowId)));
            if (!sources.length || sources.some(row => config.isRowDraggable?.(row) === false)) return;
            config.onDrop({sourceRows:sources,sourceRowIds:sources.map(row => getOwnedGridRowId(row,getRowId)),targetId:target.id,operation:target.operation ?? "copy"});
          }}>{target.label}</Button>
      </DropZone>)}
    </div>}
    {/* Firefox otherwise inserts an implicit Tab stop on the native scroll pane.
        The table owns collection entry; the pane remains programmatically focusable. */}
    <ResizableTableContainer ref={setContainer} className={[styles.container, className].filter(Boolean).join(" ")} style={style}
    data-sgui-part="grid-container" onResize={widths => {
      const active = table.current?.contains(document.activeElement) ? (document.activeElement as HTMLElement)?.closest<HTMLElement>("[data-grid-field]")?.dataset.gridField : undefined;
      const field = resizing.current ?? (active && columns.some(column => column.field === active) ? active : undefined);
      const width = field ? widths.get(field) : undefined;
      if (field && typeof width === "number") {
        const next = availableWidth > 0 ? { ...layout.widths, ...Object.fromEntries([...widths].filter(([id, value]) => visible.some(column => column.field === id) && typeof value === "number" && Number.isFinite(value))) } as Record<string, number> : { ...layout.widths, [field]: width };
        setWidths(availableWidth > 0 ? retainOwnedGridFlexColumn(visible, next, field) : next);
      }
    }} onResizeEnd={() => { resizing.current = null; }}>
    {/* React Aria requires a stable hook surface within each Table instance.
        Recreate only when the host enables/disables reorder, retaining the outer
        container and repairing its focused cell in the layout effect above. */}
    <Table key={props.rowDrag ? (transfer ? "transfer" : "reorder") : "ordinary"} ref={setTable} dragAndDropHooks={props.rowDrag ? dragAndDropHooks : undefined} aria-label={label} className={({ state: interaction }) => { tableState.current = interaction; return styles.table; }}
      sortDescriptor={state.sortRules[0] ? { column: state.sortRules[0].field, direction: state.sortRules[0].direction === "asc" ? "ascending" : "descending" } : undefined}
      onSortChange={sort => dispatch({ type: "sort", value: changeOwnedGridHeaderSort(state.sortRules, String(sort.column), sort.direction === "ascending" ? "asc" : "desc") })}
      selectionMode={selection ? "multiple" : "none"} selectionBehavior="toggle"
      selectedKeys={state.selectedRowIds} disabledKeys={pageRows.filter(row => isRowSelectable?.(row.original) === false).map(row => row.id)} disabledBehavior="selection"
      onSelectionChange={keys => {
        // Apply the destination checkbox's next state to the inclusive interval.
        // Other selections remain intact; the last Shift destination is the next anchor.
        const range = pendingSelectionRange.current;
        pendingSelectionRange.current = null;
        if (range) {
          dispatch({ type: "selection", value: selectOwnedGridPage(state.selectedRowIds,range.ids,range.checked) });
          return;
        }
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
        {selection && <Column id="__selection" width={selectionWidth} minWidth={selectionWidth} maxWidth={selectionWidth} textValue={t("common.ui.grid.selection", { defaultMessage: "Selection" })} className={[styles.header, styles.selection].join(" ")}>
          <div ref={observeSelectionControls} className={styles.selectionControls}><CheckboxContext.Provider value={null}><Checkbox label={t("common.ui.selectPage", { defaultMessage: "Select page" })} checked={pageSelection === "all"} mixed={pageSelection === "some"}
            disabled={!selectable.length} onCheckedChange={checked => dispatch({ type: "selection", value: selectOwnedGridPage(state.selectedRowIds, selectable, checked) })} /></CheckboxContext.Provider>
          <Menu label={t("common.ui.grid.selectionActions", { defaultMessage: "Selection actions" })}
            trigger={<Button variant="text" density="compact" aria-label={t("common.ui.grid.selectionActions", { defaultMessage: "Selection actions" })}><ArrowDropDownIcon /></Button>}
            items={[{ id: "page", label: props.selectPageLabel ?? t("common.ui.selectPage", { defaultMessage: "Select page" }), disabled: !selectable.length },
              { id: "none", label: props.selectNoneLabel ?? t("common.ui.selectNone", { defaultMessage: "None" }) }]}
            onAction={id => dispatch({ type: "selection", value: id === "page" ? selectOwnedGridPage(state.selectedRowIds, selectable, true) : new Set() })} /></div>
        </Column>}
        {showReorderColumn && <Column id="__reorder" width={reorderWidth} minWidth={reorderWidth} maxWidth={reorderWidth} className={styles.header} textValue={t("common.ui.grid.reorder", { defaultMessage: "Reorder" })}>{props.rowDrag?.showMoveButtons ? t("common.ui.grid.reorder", { defaultMessage: "Reorder" }) : null}</Column>}
        {visible.map((column, index) => {
          const direction = state.sortRules.find(rule => rule.field === column.field)?.direction;
          return <Column key={column.field} id={column.field} isRowHeader={index === 0} textValue={column.headerName ?? column.field}
            allowsSorting={column.sortable !== false} width={measured[column.field]} minWidth={column.minWidth ?? 80} maxWidth={column.maxWidth} className={styles.header}
            aria-sort={direction === "asc" ? "ascending" : direction === "desc" ? "descending" : undefined}
            data-grid-field={column.field}>
            <div className={styles.headerContent}>
              {column.sortable !== false ? <OwnedGridHeaderSortMenu label={column.headerName ?? column.field} sortDirection={direction}
                onSortSelect={direction => dispatch({ type: "sort", value: changeOwnedGridHeaderSort(state.sortRules, column.field, direction) })} /> : <span>{column.headerName ?? column.field}</span>}
              {canResizeLeadingColumn(visible, index) ? <span className={styles.resizeHandle} onFocusCapture={() => { resizing.current = column.field; }} onPointerDownCapture={event => {
                pointerWidths.current = layout.widths;
                pointerResize.start(event, { field: column.field, widths: measured, min: column.minWidth ?? 80, max: column.maxWidth });
              }} onPointerMove={pointerResize.move} onPointerUp={pointerResize.end} onPointerCancel={pointerResize.cancel} onLostPointerCapture={pointerResize.lost} onKeyDownCapture={() => { resizing.current = column.field; }}><ColumnResizer className={styles.resizer} aria-label={t("common.ui.resizeColumn", { defaultMessage: "Resize {label}", values: { label: column.headerName ?? column.field } })}
                /></span> : (index > 0 || (!layout.lockedFields.includes(column.field) && (selection || showReorderColumn))) ? <span className={styles.resizeHandle} aria-hidden="true" data-sgui-part="inactive-column-divider"><span className={styles.resizer} data-disabled="true" /></span> : null}
            </div>
          </Column>;
        })}

      </TableHeader>
      <TableBody items={pageRows} dependencies={[visible, state.selectedRowIds, locale, timeZone, formatDate, getRowLabel, props.rowDrag, canReorder, canTransfer]} renderEmptyState={() => status === "error" && props.errorInToolbar ? null : <OwnedGridStatus ref={statusNode} state={status ?? "empty"} message={errorMessage} onRetry={onRetry} />}>
        {row => <Row id={row.id} textValue={getRowLabel(row.original)} className={styles.row} data-sgui-part="grid-row" data-grid-row={row.id}>
          {selection && <Cell className={[styles.cell, styles.selection].join(" ")} data-grid-field="__selection" data-grid-row={row.id}>
            <div className={styles.selectionControls}>{renderGrip(row)}<Checkbox slot="selection" label={t("common.ui.selectRow", { defaultMessage: "Select {label}", values: { label: getRowLabel(row.original) } })} /></div>
          </Cell>}
          {props.rowDrag && showReorderColumn && <Cell className={styles.cell} data-grid-field="__reorder" data-grid-row={row.id}>
            <div className={styles.reorderControls} onPointerDownCapture={() => { dragAnchor.current = row.id; }} onFocusCapture={() => { dragAnchor.current = row.id; }}>
              {!selection && renderGrip(row)}
              {!transfer && props.rowDrag.showMoveButtons && <><Button variant="text" tone="neutral" density="compact" disabled={!canMoveRow(row.id) || !adjacentTarget(row.id, "before")}
                aria-label={t("common.ui.moveUp", { defaultMessage: "Move {label} up", values: { label: getRowLabel(row.original) } })}
                onPress={() => requestReorder(row.id, getOwnedGridRowId(adjacentTarget(row.id, "before")!, getRowId), "before")}>↑</Button>
              <Button variant="text" tone="neutral" density="compact" disabled={!canMoveRow(row.id) || !adjacentTarget(row.id, "after")}
                aria-label={t("common.ui.moveDown", { defaultMessage: "Move {label} down", values: { label: getRowLabel(row.original) } })}
                onPress={() => requestReorder(row.id, getOwnedGridRowId(adjacentTarget(row.id, "after")!, getRowId), "after")}>↓</Button></>}
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
