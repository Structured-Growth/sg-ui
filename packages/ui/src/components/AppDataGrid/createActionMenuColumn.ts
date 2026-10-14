import { createOwnedGridActionMenuColumn } from "./ownedGridColumns";
import type { AppDataGridColumn } from "./types";

export type AppDataGridActionMenuColumnOptions<Row> = {
  headerName?: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  getMenuActions: NonNullable<AppDataGridColumn<Row>["getMenuActions"]>;
};

/** Actions are locked and normalized last by the grid layout. */
export function createActionMenuColumn<Row>({ headerName = "Action", ...options }: AppDataGridActionMenuColumnOptions<Row>): AppDataGridColumn<Row> {
  return createOwnedGridActionMenuColumn({ ...options, headerName });
}
