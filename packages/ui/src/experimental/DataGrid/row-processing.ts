import type { GridColumn, GridFilter, GridValue } from "./types";
function comparable(value: GridValue): string | number | boolean | null {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value.getTime();
  return value;
}
/** Nulls sort first in ascending order; equal values retain input order in the engine. */
export function compareGridValues(a: GridValue, b: GridValue): number {
  const left = comparable(a); const right = comparable(b);
  if (left === right) return 0;
  if (left === null) return -1;
  if (right === null) return 1;
  if (typeof left === "number" && typeof right === "number") return left < right ? -1 : 1;
  if (typeof left === "boolean" && typeof right === "boolean") return left ? 1 : -1;
  return String(left).localeCompare(String(right), "en", { numeric: true, sensitivity: "base" });
}
export function filterGridRows<Row>(rows: readonly Row[], columns: readonly GridColumn<Row>[], filters: readonly GridFilter[], search: string): Row[] {
  const byId = new Map(columns.map(column => [column.id, column]));
  const query = search.trim().toLocaleLowerCase();
  return rows.filter(row => (!query || columns.some(column => String(column.getValue(row) ?? "").toLocaleLowerCase().includes(query))) && filters.every(rule => {
    const column = byId.get(rule.column);
    if (!column || !rule.value.trim()) return true;
    const value = comparable(column.getValue(row));
    if (value === null) return false;
    if (rule.operator === "contains") return String(value).toLocaleLowerCase().includes(rule.value.toLocaleLowerCase());
    if (rule.operator === "equals") return String(value) === rule.value;
    const operand = typeof value === "number" ? Number(rule.value) : rule.value;
    if (typeof operand === "number" && !Number.isFinite(operand)) return false;
    return rule.operator === "gte" ? value >= operand : value <= operand;
  }));
}
