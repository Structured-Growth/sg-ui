import { createTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, type ColumnDef } from "@tanstack/react-table";
import type { DataToolbarFilterField, DataToolbarFilterFieldType, DataToolbarFilterOperator, DataToolbarFilterRule } from "../DataToolbar/components/DataToolbarFilterMenu";
import { parseFilterRuleValues } from "../DataToolbar/filterRuleValue";

/** Preparatory catalog model. No engine objects are exposed to consumers. */
export type OwnedGridPaginationModel = { page: number; pageSize: number };
export type OwnedGridSortRule = { field: string; direction: "asc" | "desc" };
export type OwnedGridPageSizeOption = number | { value: number; label: string };
export type OwnedGridColumn<Row> = {
  field: string;
  getCellValue?: (row: Row) => unknown;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: DataToolbarFilterFieldType;
};
export type OwnedGridProcessingOptions<Row> = {
  rows: readonly Row[];
  columns: readonly OwnedGridColumn<Row>[];
  getRowId?: (row: Row) => string;
  mode?: "client" | "server";
  paginationModel: OwnedGridPaginationModel;
  sortRules?: readonly OwnedGridSortRule[];
  filterRules?: readonly DataToolbarFilterRule[];
  filterFields?: readonly DataToolbarFilterField[];
  searchValue?: string;
  rowCount?: number;
  hasNextPage?: boolean;
};
export type OwnedGridProcessingResult<Row> = {
  rows: Row[];
  processedRows: Row[];
  rowIds: string[];
  rowCount: number | undefined;
  canNextPage: boolean;
  /** Requested criteria; client rows use the last available display page. */
  paginationModel: OwnedGridPaginationModel;
};

const positiveInteger = (value: number) => Number.isSafeInteger(value) && value > 0;
export function normalizeGridPageSizeOptions(options: readonly OwnedGridPageSizeOption[] = []): Array<{ value: number; label: string }> {
  const seen = new Set<number>();
  const valid = options.flatMap(option => {
    const value = typeof option === "number" ? option : option.value;
    if (!positiveInteger(value) || seen.has(value)) return [];
    seen.add(value);
    return [{ value, label: typeof option === "number" ? String(value) : option.label }];
  });
  return valid.length ? valid : [25, 50, 100].map(value => ({ value, label: String(value) }));
}
export function normalizeGridPagination(model: OwnedGridPaginationModel, options?: readonly OwnedGridPageSizeOption[]): OwnedGridPaginationModel {
  const sizes = normalizeGridPageSizeOptions(options);
  const pageSize = sizes.some(option => option.value === model.pageSize) ? model.pageSize : sizes[0]!.value;
  return { page: pageSize !== model.pageSize || !Number.isSafeInteger(model.page) || model.page < 0 ? 0 : model.page, pageSize };
}
export function normalizeGridSortRules<Row>(rules: readonly OwnedGridSortRule[], columns: readonly OwnedGridColumn<Row>[]): OwnedGridSortRule[] {
  const seen = new Set<string>();
  return rules.flatMap(rule => {
    const column = columns.find(candidate => candidate.field === rule.field);
    if (!column || column.sortable === false || seen.has(rule.field) || (rule.direction !== "asc" && rule.direction !== "desc")) return [];
    seen.add(rule.field);
    return [{ field: rule.field, direction: rule.direction }];
  });
}
export function getOwnedGridCellValue<Row>(row: Row, column: OwnedGridColumn<Row>): unknown {
  if (column.getCellValue) return column.getCellValue(row);
  return row !== null && typeof row === "object" ? (row as Record<string, unknown>)[column.field] : undefined;
}
export function getOwnedGridRowId<Row>(row: Row, getRowId?: (row: Row) => string): string {
  const value = getRowId ? getRowId(row) : row !== null && typeof row === "object" ? (row as { id?: unknown }).id : undefined;
  if (typeof value === "string" && value.trim()) return value;
  if (!getRowId && typeof value === "number" && Number.isFinite(value)) return String(value);
  throw new Error("AppDataGrid requires a stable nonempty row ID. Provide getRowId or an id field.");
}

/** Null, invalid numbers and invalid dates sort first; ties retain source order. */
export function compareOwnedGridValues(left: unknown, right: unknown, type?: DataToolbarFilterFieldType): number {
  const scalar = (value: unknown): string | number | boolean | null => {
    if (type === "number") return numericValue(value);
    if (type === "date") return dateInstant(value);
    if (value == null) return null;
    if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value.getTime();
    if (typeof value === "number") return Number.isFinite(value) ? value : null;
    if (typeof value === "boolean") return value;
    return searchableText(value);
  };
  const a = scalar(left); const b = scalar(right);
  if (a === b) return 0;
  if (a === null) return -1;
  if (b === null) return 1;
  if (typeof a === "number" && typeof b === "number") return a < b ? -1 : 1;
  if (typeof a === "boolean" && typeof b === "boolean") return a ? 1 : -1;
  return String(a).localeCompare(String(b), "en", { numeric: true, sensitivity: "base" });
}
function searchableText(value: unknown): string {
  if (value == null) return "";
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? "" : value.toISOString();
  if (typeof value === "object") {
    try { return JSON.stringify(value) ?? ""; } catch { return String(value); }
  }
  return String(value);
}
const operators: Record<DataToolbarFilterFieldType, readonly DataToolbarFilterOperator[]> = {
  string: ["contains", "equals", "starts_with", "ends_with", "is_empty", "is_not_empty"],
  number: ["eq", "neq", "gt", "gte", "lt", "lte"],
  date: ["on", "before", "after", "on_or_before", "on_or_after"],
  enum: ["is", "is_not"],
};
/** Date-only strings preserve their day. Instants use UTC for deterministic SSR/client filtering. */
function dateInstant(value: unknown): number | null {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value.getTime();
  if (typeof value !== "string") return null;
  const raw = value.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/.exec(raw);
  if (!match) return null;
  const year = Number(match[1]); const month = Number(match[2]); const day = Number(match[3]);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day); date.setUTCHours(0, 0, 0, 0);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  if (raw.length === 10) return date.getTime();
  // Require a timezone and reject rollover times, rather than using the environment's local zone.
  if (!/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d{1,3})?)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.test(raw)) return null;
  const instant = Date.parse(raw);
  return Number.isNaN(instant) ? null : instant;
}
function calendarDay(value: unknown): number | null {
  const instant = dateInstant(value);
  if (instant === null) return null;
  const date = new Date(instant);
  date.setUTCHours(0, 0, 0, 0);
  return date.getTime();
}
const numericValue = (value: unknown): number | null => {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (typeof value === "string" && !value.trim()) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};
export function normalizeGridFilterRules<Row>(rules: readonly DataToolbarFilterRule[], columns: readonly OwnedGridColumn<Row>[], filterFields?: readonly DataToolbarFilterField[]): DataToolbarFilterRule[] {
  return rules.flatMap(rule => {
    const column = columns.find(candidate => candidate.field === rule.field);
    const type = filterFields?.find(field => field.id === rule.field)?.type ?? column?.filterType ?? "string";
    if (!column || column.filterable === false || !operators[type].some(operator => operator === rule.operator)) return [];
    if (rule.operator === "is_empty" || rule.operator === "is_not_empty") return [{ ...rule, value: "" }];
    if (!rule.value.trim() || (type === "enum" && !parseFilterRuleValues(rule.value).length)) return [];
    if (type === "number" && numericValue(rule.value) === null) return [];
    if (type === "date" && calendarDay(rule.value) === null) return [];
    return [{ ...rule }];
  });
}
function matches(value: unknown, rule: DataToolbarFilterRule, type: DataToolbarFilterFieldType): boolean {
  if (type === "string") {
    const text = searchableText(value).toLowerCase(); const target = rule.value.trim().toLowerCase();
    const empty = !text.trim();
    switch (rule.operator) {
      case "is_empty": return empty;
      case "is_not_empty": return !empty;
      case "contains": return !empty && text.includes(target);
      case "equals": return !empty && text === target;
      case "starts_with": return !empty && text.startsWith(target);
      case "ends_with": return !empty && text.endsWith(target);
    }
  }
  if (type === "enum") {
    const values = parseFilterRuleValues(rule.value);
    const included = values.includes(searchableText(value));
    return rule.operator === "is" ? included : !included;
  }
  const a = type === "number" ? numericValue(value) : calendarDay(value);
  const b = type === "number" ? numericValue(rule.value) : calendarDay(rule.value);
  if (a === null || b === null) return false;
  switch (rule.operator) {
    case "eq": case "on": return a === b;
    case "neq": return a !== b;
    case "gt": case "after": return a > b;
    case "gte": case "on_or_after": return a >= b;
    case "lt": case "before": return a < b;
    case "lte": case "on_or_before": return a <= b;
    default: return false;
  }
}

export function processOwnedGridRows<Row>(options: OwnedGridProcessingOptions<Row>): OwnedGridProcessingResult<Row> {
  const { rows, columns, getRowId, paginationModel, mode = "client" } = options;
  if (!Number.isSafeInteger(paginationModel.page) || paginationModel.page < 0 || !positiveInteger(paginationModel.pageSize))
    throw new Error("AppDataGrid pagination requires a nonnegative page and positive safe integer pageSize.");
  const fields = new Set<string>();
  for (const column of columns) {
    if (!column.field.trim() || ["__selection", "__drag", "__select__", "__drag__"].includes(column.field) || fields.has(column.field))
      throw new Error(`AppDataGrid column field is invalid or duplicated: ${column.field}`);
    fields.add(column.field);
  }
  const identities = new Map<Row, string>(); const ids = new Set<string>();
  for (const row of rows) {
    const id = getOwnedGridRowId(row, getRowId);
    if (ids.has(id)) throw new Error(`AppDataGrid row ID is duplicated: ${id}`);
    ids.add(id); identities.set(row, id);
  }
  if (mode === "server") {
    const count = options.rowCount !== undefined && Number.isSafeInteger(options.rowCount) && options.rowCount >= 0 ? options.rowCount : undefined;
    return { rows: [...rows], processedRows: [...rows], rowIds: [...ids], rowCount: count, paginationModel: { ...paginationModel },
      canNextPage: count === undefined ? !!options.hasNextPage : (paginationModel.page + 1) * paginationModel.pageSize < count };
  }
  const active = normalizeGridFilterRules(options.filterRules ?? [], columns, options.filterFields).map(rule => {
    const column = columns.find(candidate => candidate.field === rule.field)!;
    const type = options.filterFields?.find(field => field.id === rule.field)?.type ?? column.filterType ?? "string";
    return { rule, column, type };
  });
  const query = (options.searchValue ?? "").trim().toLowerCase();
  const data = rows.filter(row => (!query || columns.some(column => column.filterable !== false && searchableText(getOwnedGridCellValue(row, column)).toLowerCase().includes(query))) &&
    active.every(({ rule, column, type }) => matches(getOwnedGridCellValue(row, column), rule, type)));
  const sortRules = normalizeGridSortRules(options.sortRules ?? [], columns);
  const definitions: ColumnDef<Row>[] = columns.map(column => ({ id: column.field, accessorFn: row => getOwnedGridCellValue(row, column),
    sortingFn: (a, b) => compareOwnedGridValues(getOwnedGridCellValue(a.original, column), getOwnedGridCellValue(b.original, column),
      options.filterFields?.find(field => field.id === column.field)?.type ?? column.filterType), sortUndefined: false }));
  // Complete client data defines the display bound; do not accept or mutate host criteria.
  const displayPage = Math.min(paginationModel.page, Math.max(0, Math.ceil(data.length / paginationModel.pageSize) - 1));
  const table = createTable<Row>({ data, columns: definitions, getRowId: row => identities.get(row)!,
    state: { sorting: sortRules.map(rule => ({ id: rule.field, desc: rule.direction === "desc" })), pagination: { pageIndex: displayPage, pageSize: paginationModel.pageSize } },
    onStateChange: () => {}, renderFallbackValue: null, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(), autoResetPageIndex: false });
  const page = table.getRowModel().rows;
  return { rows: page.map(row => row.original), processedRows: table.getPrePaginationRowModel().rows.map(row => row.original), rowIds: page.map(row => row.id),
    rowCount: data.length, canNextPage: (displayPage + 1) * paginationModel.pageSize < data.length, paginationModel: { ...paginationModel } };
}
