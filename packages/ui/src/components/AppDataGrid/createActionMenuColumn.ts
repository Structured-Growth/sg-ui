import { createOwnedGridActionMenuColumn } from "./ownedGridColumns";
import type { AppDataGridColumn } from "./types";

export type AppDataGridActionMenuColumnOptions<Row> = {
  headerName?: string;
  /** Fixed action width, defaulting to 110px and clamped to supplied bounds. */
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  getMenuActions: NonNullable<AppDataGridColumn<Row>["getMenuActions"]>;
};

/** Actions have a fixed width (110px by default), are locked and normalized last. */
export function createActionMenuColumn<Row>({ headerName = "Action", ...options }: AppDataGridActionMenuColumnOptions<Row>): AppDataGridColumn<Row> {
  return createOwnedGridActionMenuColumn({ ...options, headerName });
}
