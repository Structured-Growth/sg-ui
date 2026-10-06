import type { GridValidRowModel } from "@mui/x-data-grid";
import type { AppDataGridColumn } from "./types";

export type AppDataGridActionMenuColumnOptions<RowModel extends GridValidRowModel> = {
  headerName?: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  pinned?: "left" | "right";
  locked?: boolean;
  getMenuActions: NonNullable<AppDataGridColumn<RowModel>["getMenuActions"]>;
};

export const createActionMenuColumn = <RowModel extends GridValidRowModel>({
  headerName = "Action",
  width = 110,
  minWidth,
  maxWidth,
  pinned = "right",
  locked = true,
  getMenuActions,
}: AppDataGridActionMenuColumnOptions<RowModel>): AppDataGridColumn<RowModel> => ({
  field: "actions",
  headerName,
  headerClassName: "dg-last-col",
  cellClassName: "dg-last-col",
  width,
  minWidth,
  maxWidth,
  pinned,
  locked,
  sortable: false,
  filterable: false,
  cellType: "menu",
  getMenuActions,
});
