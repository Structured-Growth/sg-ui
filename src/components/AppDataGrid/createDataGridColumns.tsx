import { createOwnedGridColumns } from "./ownedGridColumns";
import type { AppDataGridColumn } from "./types";

/** Validate explicit owned columns. Rendering and canonical header sorting belong to AppDataGrid. */
export function createDataGridColumns<Row>(columns: readonly AppDataGridColumn<Row>[]): AppDataGridColumn<Row>[] {
  return createOwnedGridColumns(columns);
}
