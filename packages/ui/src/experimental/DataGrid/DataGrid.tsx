"use client";
import { useMemo, useRef, useState } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, type ColumnDef } from "@tanstack/react-table";
import { Table, TableHeader, Column, TableBody, Row, Cell, ResizableTableContainer, ColumnResizer } from "react-aria-components/Table";
import { useDragAndDrop } from "react-aria-components/useDragAndDrop";
import { Button } from "../../components/Button/Button";
import { Checkbox } from "../Checkbox/Checkbox";
import { Select } from "../Select/Select";
import { TextField } from "../TextField/TextField";
import { Popover } from "../Popover/Popover";
import { useTranslation } from "../../i18n";
import { compareGridValues, filterGridRows } from "./row-processing";
import { defaultGridState, type DataGridProps, type GridState } from "./types";
import { useLeadingColumnResize } from "./useLeadingColumnResize";
import styles from "./DataGrid.module.css";
import { canResizeLeadingColumn, getGridFillColumn, retainGridFillColumn } from "./column-sizing";

/** Migration integration proof. The host owns server requests and reorder persistence. */
export function DataGrid<RowModel>({ label, rows, columns, getRowId, getRowLabel, state, defaultState,
  onStateChange, mode = "client", total, hasNextPage, loading, errorMessage, onRefresh, renderActions, onReorder }: DataGridProps<RowModel>) {
  const { t } = useTranslation();
  const [internal, setInternal] = useState<GridState>(() => ({ ...defaultGridState, ...defaultState }));
  const current = state ?? internal;
  const resizing = useRef<string | null>(null);
    function update(patch: Partial<GridState>) {
    const next = { ...current, ...patch };
    if (!state) setInternal(next);
    onStateChange?.(next);
  }
  const data = useMemo(() => mode === "server" ? [...rows] : filterGridRows(rows, columns, current.filters, current.search), [rows, columns, current.filters, current.search, mode]);
  const definitions = useMemo<ColumnDef<RowModel>[]>(() => columns.map(column => ({ id: column.id, accessorFn: column.getValue,
    sortingFn: (a, b) => compareGridValues(column.getValue(a.original), column.getValue(b.original)), sortUndefined: false })), [columns]);
  const engine = useReactTable({ data, columns: definitions, getRowId,
    state: { sorting: current.sort.map(rule => ({ id: rule.column, desc: rule.direction === "desc" })), pagination: { pageIndex: current.page, pageSize: current.pageSize } },
    getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel(),
    manualSorting: mode === "server", manualPagination: mode === "server", autoResetPageIndex: false });
  const visible = columns.filter((column, index) => index === 0 || column.hideable === false || !current.hiddenColumns.includes(column.id));
  const sizingColumns = visible.map(column => ({ ...column, flex: column.width === undefined ? 1 : undefined }));
  const fillColumn = getGridFillColumn(sizingColumns, current.widths);
  const pointerWidths = useRef<Record<string, number>>({});
  const pointerResize = useLeadingColumnResize((snapshot, width, cancelled) => {
    update({ widths: cancelled ? pointerWidths.current : retainGridFillColumn(sizingColumns, { ...snapshot.widths, [snapshot.field]: width }, snapshot.field) });
  });
  const pageRows = engine.getRowModel().rows;
  const count = mode === "server" ? total : data.length;
  const nextPage = count === undefined ? !!hasNextPage : (current.page + 1) * current.pageSize < count;
  const canReorder = !!onReorder && mode === "client" && !current.sort.length && !current.filters.length && !current.search && current.page === 0 && data.length <= current.pageSize && current.selectedIds.length <= 1;
  const { dragAndDropHooks } = useDragAndDrop({ isDisabled: !canReorder,
    getItems: keys => [...keys].map(key => ({ "text/plain": getRowLabel(rows.find(row => getRowId(row) === key)!) })),
    getAllowedDropOperations: () => ["move"],
    onReorder: event => {
      const source = [...event.keys][0];
      if (canReorder && source !== undefined && event.target.dropPosition !== "on")
        onReorder?.(String(source), String(event.target.key), event.target.dropPosition);
    },
  });
  const toggleSort = (column: string) => {
    const previous = current.sort.find(rule => rule.column === column);
    const rest = current.sort.filter(rule => rule.column !== column);
    update({ page: 0, sort: previous?.direction === "desc" ? rest : [...rest, { column, direction: previous ? "desc" : "asc" }] });
  };
  return <div className={styles.root}>
    <div className={styles.toolbar}>
      <TextField label={t("common.ui.search", { defaultMessage: "Search" })} type="search" value={current.search}
        onValueChange={search => update({ search, page: 0 })} disabled={loading} />
      {onRefresh && <Button variant="outlined" tone="neutral" onPress={onRefresh} loading={loading}>{t("common.ui.refresh", { defaultMessage: "Refresh" })}</Button>}
      <Popover title={t("common.ui.columns", { defaultMessage: "Columns" })} trigger={<Button variant="outlined" tone="neutral">{t("common.ui.columns", { defaultMessage: "Columns" })}</Button>}>
        {columns.map((column, index) => <Checkbox key={column.id} label={column.label} checked={visible.includes(column)} disabled={index === 0 || column.hideable === false}
          onCheckedChange={checked => update({ hiddenColumns: checked ? current.hiddenColumns.filter(id => id !== column.id) : [...current.hiddenColumns, column.id] })} />)}
      </Popover>
      <span role="status">{t("common.ui.selectedCount", { defaultMessage: "{count} selected", values: { count: current.selectedIds.length } })}</span>
      {current.selectedIds.length > 0 && <Button variant="text" tone="neutral" onPress={() => update({ selectedIds: [] })}>{t("common.ui.selectNone", { defaultMessage: "Select none" })}</Button>}
    </div>
    {errorMessage && <p role="alert">{errorMessage}</p>}
    <ResizableTableContainer className={styles.container} onResize={widths => {
      const field = resizing.current;
      const width = field ? widths.get(field) : undefined;
      if (!field || typeof width !== "number" || !Number.isFinite(width)) return;
      const next = retainGridFillColumn(sizingColumns, { ...current.widths, ...Object.fromEntries([...widths].filter(([id, value]) => visible.some(column => column.id === id) && typeof value === "number" && Number.isFinite(value))) } as Record<string, number>, field);
      update({ widths: next });
    }} onResizeEnd={() => { resizing.current = null; }}>
      <Table aria-label={label} aria-busy={loading || undefined} selectionMode="multiple" selectionBehavior="toggle" dragAndDropHooks={dragAndDropHooks}
        selectedKeys={current.selectedIds} onSelectionChange={keys => update({ selectedIds: keys === "all" ? [...new Set([...current.selectedIds, ...pageRows.map(row => row.id)])] : [...keys].map(String) })}
        className={styles.table}>
        <TableHeader>
          <Column id="__selection" width={150} minWidth={100} className={styles.header}><Checkbox slot="selection" label={t("common.ui.selectPage", { defaultMessage: "Select page" })} /></Column>
          {visible.map((column, index) => <Column key={column.id} id={column.id} isRowHeader={index === 0} data-width-column-index={index} textValue={column.label}
            width={column.id === fillColumn ? "1fr" : current.widths[column.id] ?? column.width ?? "1fr"} minWidth={column.minWidth ?? (column.width === undefined ? 120 : 80)} maxWidth={column.maxWidth} className={styles.header}>
            <div className={styles.columnHeader}><div className={styles.columnLabel}>{column.sortable !== false ? <Button variant="text" tone="neutral" onPress={() => toggleSort(column.id)} aria-label={t("common.ui.sortColumn", { defaultMessage: "Sort {label}", values: { label: column.label } })}>
              {column.label}{current.sort.find(rule => rule.column === column.id)?.direction === "asc" ? " ↑" : current.sort.some(rule => rule.column === column.id) ? " ↓" : ""}
              {current.sort.length > 1 && current.sort.some(rule => rule.column === column.id) && ` ${current.sort.findIndex(rule => rule.column === column.id) + 1}`}
            </Button> : column.label}</div>{canResizeLeadingColumn(visible, index) ? <span className={styles.resizeHandle} onFocusCapture={() => { resizing.current = column.id; }} onPointerDownCapture={event => {
              pointerWidths.current = current.widths;
              const table = event.currentTarget.closest("table");
              const widths = Object.fromEntries(visible.map((item, index) => {
                const header = table?.querySelector<HTMLElement>(`[data-width-column-index="${index}"]`);
                return [item.id, header?.getBoundingClientRect().width ?? current.widths[item.id] ?? item.width ?? 160];
              }));
              pointerResize.start(event, { field: column.id, widths, min: column.minWidth ?? (column.width === undefined ? 120 : 80), max: column.maxWidth });
            }} onPointerMove={pointerResize.move} onPointerUp={pointerResize.end} onPointerCancel={pointerResize.cancel} onLostPointerCapture={pointerResize.lost} onKeyDownCapture={() => { resizing.current = column.id; }}><ColumnResizer className={styles.resizer} aria-label={t("common.ui.resizeColumn", { defaultMessage: "Resize {label}", values: { label: column.label } })} /></span> : <span className={styles.resizeHandle} aria-hidden="true" data-sgui-part="inactive-column-divider"><span className={styles.resizer} data-disabled="true" /></span>}</div>
          </Column>)}
          {(renderActions || onReorder) && <Column id="__actions" width={240} className={styles.header}>{t("common.ui.actions", { defaultMessage: "Actions" })}</Column>}
        </TableHeader>
        <TableBody items={pageRows} dependencies={[visible, renderActions, canReorder]} renderEmptyState={() => loading ? t("common.ui.loading", { defaultMessage: "Loading…" }) : t("common.ui.noResults", { defaultMessage: "No results" })}>
          {row => <Row id={row.id} textValue={getRowLabel(row.original)} className={styles.row}>
            <Cell className={styles.cell}><div className={styles.actions}>{canReorder && <Button slot="drag" variant="text" tone="neutral" aria-label={t("common.ui.dragRow", { defaultMessage: "Reorder {label}", values: { label: getRowLabel(row.original) } })}>↕</Button>}<Checkbox slot="selection" label={t("common.ui.selectRow", { defaultMessage: "Select {label}", values: { label: getRowLabel(row.original) } })} /></div></Cell>
            {visible.map(column => <Cell key={column.id} className={styles.cell}>{column.renderCell?.(row.original) ?? String(column.getValue(row.original) ?? "")}</Cell>)}
            {(renderActions || onReorder) && <Cell className={styles.cell}><div className={styles.actions}>{renderActions?.(row.original)}{onReorder && <>
              <Button variant="text" tone="neutral" disabled={!canReorder || row.index === 0} aria-label={t("common.ui.moveUp", { defaultMessage: "Move {label} up", values: { label: getRowLabel(row.original) } })}
                onPress={() => onReorder(row.id, pageRows[row.index - 1]!.id, "before")}>↑</Button>
              <Button variant="text" tone="neutral" disabled={!canReorder || row.index === pageRows.length - 1} aria-label={t("common.ui.moveDown", { defaultMessage: "Move {label} down", values: { label: getRowLabel(row.original) } })}
                onPress={() => onReorder(row.id, pageRows[row.index + 1]!.id, "after")}>↓</Button>
            </>}</div></Cell>}
          </Row>}
        </TableBody>
      </Table>
    </ResizableTableContainer>
    <footer className={styles.footer}>
      <span>{t("common.ui.pageNumber", { defaultMessage: "Page {page}", values: { page: current.page + 1 } })}</span>
      <Select label={t("common.ui.pageSize", { defaultMessage: "Rows per page" })} value={String(current.pageSize)} disabled={loading}
        options={[...new Set([5, 10, 25, 50, 100, current.pageSize])].sort((a, b) => a - b).map(size => ({ id: String(size), label: String(size) }))}
        onValueChange={value => { if (value !== null) update({ pageSize: Number(value), page: 0 }); }} />
      <Button variant="outlined" tone="neutral" disabled={loading || current.page === 0} onPress={() => update({ page: current.page - 1 })}>{t("common.ui.previousPage", { defaultMessage: "Previous page" })}</Button>
      <Button variant="outlined" tone="neutral" disabled={loading || !nextPage} onPress={() => update({ page: current.page + 1 })}>{t("common.ui.nextPage", { defaultMessage: "Next page" })}</Button>
    </footer>
  </div>;
}
