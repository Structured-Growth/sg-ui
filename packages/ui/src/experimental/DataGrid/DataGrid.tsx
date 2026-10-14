"use client";
import { useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, type ColumnDef } from "@tanstack/react-table";
import { Table, TableHeader, Column, TableBody, Row, Cell, ResizableTableContainer, ColumnResizer } from "react-aria-components/Table";
import { useDragAndDrop } from "react-aria-components/useDragAndDrop";
import { Button } from "../Button/Button";
import { Checkbox } from "../Checkbox/Checkbox";
import { TextField } from "../TextField/TextField";
import { Popover } from "../Popover/Popover";
import { useTranslation } from "../../i18n";
import { compareGridValues, filterGridRows } from "./row-processing";
import { defaultGridState, type DataGridProps, type GridState } from "./types";
import styles from "./DataGrid.module.css";

/** Migration integration proof. The host owns server requests and reorder persistence. */
export function DataGrid<RowModel>({ label, rows, columns, getRowId, getRowLabel, state, defaultState,
  onStateChange, mode = "client", total, hasNextPage, loading, errorMessage, onRefresh, renderActions, onReorder }: DataGridProps<RowModel>) {
  const { t } = useTranslation();
  const [internal, setInternal] = useState<GridState>(() => ({ ...defaultGridState, ...defaultState }));
  const current = state ?? internal;
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
    <ResizableTableContainer className={styles.container} onResize={widths => update({ widths: Object.fromEntries([...widths].filter((entry): entry is [string, number] => typeof entry[0] === "string" && typeof entry[1] === "number")) })}>
      <Table aria-label={label} aria-busy={loading || undefined} selectionMode="multiple" selectionBehavior="toggle" dragAndDropHooks={dragAndDropHooks}
        selectedKeys={current.selectedIds} onSelectionChange={keys => update({ selectedIds: keys === "all" ? [...new Set([...current.selectedIds, ...pageRows.map(row => row.id)])] : [...keys].map(String) })}
        className={styles.table}>
        <TableHeader>
          <Column id="__selection" width={150} minWidth={100} className={styles.header}><Checkbox slot="selection" label={t("common.ui.selectPage", { defaultMessage: "Select page" })} /></Column>
          {visible.map((column, index) => <Column key={column.id} id={column.id} isRowHeader={index === 0} textValue={column.label}
            width={current.widths[column.id] ?? column.width ?? 180} minWidth={column.minWidth ?? 80} className={styles.header}>
            <div className={styles.columnHeader}>{column.sortable !== false ? <Button variant="text" tone="neutral" onPress={() => toggleSort(column.id)} aria-label={t("common.ui.sortColumn", { defaultMessage: "Sort {label}", values: { label: column.label } })}>
              {column.label}{current.sort.find(rule => rule.column === column.id)?.direction === "asc" ? " ↑" : current.sort.some(rule => rule.column === column.id) ? " ↓" : ""}
              {current.sort.length > 1 && current.sort.some(rule => rule.column === column.id) && ` ${current.sort.findIndex(rule => rule.column === column.id) + 1}`}
            </Button> : column.label}<ColumnResizer className={styles.resizer} aria-label={t("common.ui.resizeColumn", { defaultMessage: "Resize {label}", values: { label: column.label } })} /></div>
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
      <label>{t("common.ui.pageSize", { defaultMessage: "Rows per page" })} <select value={current.pageSize} onChange={event => update({ pageSize: Number(event.target.value), page: 0 })}>
        {[25, 50, 100].map(size => <option key={size} value={size}>{size}</option>)}
      </select></label>
      <Button variant="outlined" tone="neutral" disabled={loading || current.page === 0} onPress={() => update({ page: current.page - 1 })}>{t("common.ui.previousPage", { defaultMessage: "Previous page" })}</Button>
      <Button variant="outlined" tone="neutral" disabled={loading || !nextPage} onPress={() => update({ page: current.page + 1 })}>{t("common.ui.nextPage", { defaultMessage: "Next page" })}</Button>
    </footer>
  </div>;
}
