import type { ReactNode } from "react";
export type GridValue = string | number | boolean | Date | null | undefined;
export interface GridColumn<Row> {
  id: string;
  label: string;
  getValue: (row: Row) => GridValue;
  renderCell?: (row: Row) => ReactNode;
  sortable?: boolean;
  hideable?: boolean;
  width?: number;
  minWidth?: number;
}
export interface GridSort { column: string; direction: "asc" | "desc" }
export interface GridFilter { column: string; operator: "contains" | "equals" | "gte" | "lte"; value: string }
export interface GridState {
  sort: GridSort[];
  filters: GridFilter[];
  search: string;
  page: number;
  pageSize: number;
  selectedIds: string[];
  hiddenColumns: string[];
  widths: Record<string, number>;
}
export const defaultGridState: GridState = { sort: [], filters: [], search: "", page: 0, pageSize: 25, selectedIds: [], hiddenColumns: [], widths: {} };
export interface DataGridProps<Row> {
  label: string;
  rows: readonly Row[];
  columns: readonly GridColumn<Row>[];
  getRowId: (row: Row) => string;
  getRowLabel: (row: Row) => string;
  state?: GridState;
  defaultState?: Partial<GridState>;
  onStateChange?: (state: GridState) => void;
  mode?: "client" | "server";
  total?: number;
  /** Required for unknown-total server pagination. */
  hasNextPage?: boolean;
  loading?: boolean;
  errorMessage?: string;
  onRefresh?: () => void;
  renderActions?: (row: Row) => ReactNode;
  /** Non-drag alternative. Reordering is disabled while sorted, filtered, searching or paginated. */
  onReorder?: (sourceId: string, targetId: string, position: "before" | "after") => void;
}
