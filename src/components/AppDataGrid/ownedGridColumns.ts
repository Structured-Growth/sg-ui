import type { ReactNode } from "react";
import type { OwnedGridColumn, OwnedGridSortRule } from "./ownedGridModel";

export type OwnedGridCellType = "text" | "date" | "dateTime" | "link" | "copyable" | "json" | "image" | "menu" | "custom";
export type OwnedGridMenuAction<Row> = {
  id: string;
  label: string;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
  disabled?: boolean;
  pending?: boolean;
  onPress?: (row: Row) => void;
};
/** Internal catalog presentation contract; engine params never reach a host. */
export type OwnedGridPresentationColumn<Row> = OwnedGridColumn<Row> & {
  headerName?: string;
  cellType?: OwnedGridCellType;
  renderCustomCell?: (row: Row) => ReactNode;
  formatValue?: (value: unknown, row: Row) => string;
  getLink?: (row: Row) => { href: string; label?: string; abbr?: string; target?: "_blank" | "_self" | "_parent" | "_top"; rel?: string };
  getImageSrc?: (row: Row) => string | null | undefined;
  getMenuActions?: (row: Row) => readonly OwnedGridMenuAction<Row>[];
  fallbackText?: string;
  /** False wraps display text and preserves line breaks instead of ellipsizing. */
  truncate?: boolean;
  locked?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  flex?: number;
};
const reserved = new Set(["__selection", "__drag", "__select__", "__drag__"]);
const finitePositive = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value > 0;
export function createOwnedGridColumns<Row>(columns: readonly OwnedGridPresentationColumn<Row>[]): OwnedGridPresentationColumn<Row>[] {
  const fields = new Set<string>();
  return columns.map(column => {
    if (!column.field.trim() || reserved.has(column.field) || fields.has(column.field)) throw new Error(`AppDataGrid column field is invalid or duplicated: ${column.field}`);
    fields.add(column.field);
    for (const key of ["width", "minWidth", "maxWidth", "flex"] as const) {
      if (column[key] !== undefined && !finitePositive(column[key])) throw new Error(`AppDataGrid ${key} must be finite and positive: ${column.field}`);
    }
    if (column.minWidth !== undefined && column.maxWidth !== undefined && column.minWidth > column.maxWidth) throw new Error(`AppDataGrid minWidth exceeds maxWidth: ${column.field}`);
    return { ...column };
  });
}
export function createOwnedGridActionMenuColumn<Row>(options: {
  headerName?: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  getMenuActions: NonNullable<OwnedGridPresentationColumn<Row>["getMenuActions"]>;
}): OwnedGridPresentationColumn<Row> {
  return createOwnedGridColumns<Row>([{ ...options, field: "actions", cellType: "menu", width: options.width ?? 110, locked: true, sortable: false, filterable: false }])[0]!;
}
/** Header and toolbar share the same ordered rules. A chosen field becomes priority one. */
export function changeOwnedGridHeaderSort(rules: readonly OwnedGridSortRule[], field: string, direction?: "asc" | "desc"): OwnedGridSortRule[] {
  const remainder = rules.filter(rule => rule.field !== field).map(rule => ({ ...rule }));
  return direction ? [{ field, direction }, ...remainder] : remainder;
}
export function normalizeOwnedGridLayout<Row>(columns: readonly OwnedGridPresentationColumn<Row>[], input: {
  visibility?: Readonly<Record<string, boolean>>;
  order?: readonly string[];
  widths?: Readonly<Record<string, number>>;
} = {}) {
  const definitions = createOwnedGridColumns(columns);
  const fields = definitions.map(column => column.field);
  const firstText = definitions.find(column => column.cellType === undefined || column.cellType === "text" || column.cellType === "link" || column.cellType === "copyable");
  const locked = new Set(definitions.filter(column => column.locked || column.cellType === "menu" || column === firstText).map(column => column.field));
  const order = [...new Set([...(input.order ?? []).filter(field => fields.includes(field)), ...fields])];
  const actionFields = new Set(definitions.filter(column => column.cellType === "menu").map(column => column.field));
  const visibility = Object.fromEntries(definitions.map(column => [column.field, locked.has(column.field) || input.visibility?.[column.field] !== false]));
  const widths: Record<string, number> = {};
  for (const column of definitions) {
    const width = input.widths?.[column.field];
    if (finitePositive(width)) widths[column.field] = Math.min(column.maxWidth ?? Infinity, Math.max(column.minWidth ?? 80, width));
  }
  return { visibility, order: [...order.filter(field => !actionFields.has(field)), ...order.filter(field => actionFields.has(field))], widths, lockedFields: [...locked] };
}
/** Bounded flex allocation. An explicit committed width overrides a flex weight. */
export function measureOwnedGridWidths<Row>(columns: readonly OwnedGridPresentationColumn<Row>[], availableWidth: number, overrides: Readonly<Record<string, number>> = {}): Record<string, number> {
  const definitions = createOwnedGridColumns(columns);
  const widths: Record<string, number> = {};
  const flexible: OwnedGridPresentationColumn<Row>[] = [];
  const clamp = (column: OwnedGridPresentationColumn<Row>, width: number) => Math.min(column.maxWidth ?? Infinity, Math.max(column.minWidth ?? 80, width));
  let remaining = Math.max(0, Number.isFinite(availableWidth) ? availableWidth : 0);
  for (const column of definitions) {
    const override = overrides[column.field];
    if (!finitePositive(override) && column.width === undefined && column.flex !== undefined) flexible.push(column);
    else {
      widths[column.field] = clamp(column, finitePositive(override) ? override : column.width ?? 160);
      remaining -= widths[column.field]!;
    }
  }
  if (flexible.length) {
    // Find the weighted allocation after bounds, including mixed min/max cases.
    const budget = Math.max(0, remaining);
    let low = 0;
    let high = Math.max(1, ...flexible.map(column => budget / column.flex!));
    for (let iteration = 0; iteration < 80; iteration++) {
      const weightUnit = (low + high) / 2;
      const total = flexible.reduce((sum, column) => sum + clamp(column, weightUnit * column.flex!), 0);
      if (total > budget) high = weightUnit;
      else low = weightUnit;
    }
    for (const column of flexible) widths[column.field] = clamp(column, Math.round(((low + high) / 2) * column.flex! * 1000000) / 1000000);
  }
  return widths;
}
