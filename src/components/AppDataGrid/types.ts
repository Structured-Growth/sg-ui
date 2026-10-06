import type { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import type { ReactNode } from "react";

export type AppDataGridMenuAction<RowModel extends GridValidRowModel> = {
  id: string;
  label: string;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
  onClick?: (row: RowModel) => void;
};

export type AppDataGridSortDirection = "asc" | "desc" | "";

export type AppDataGridSortRule = {
  field: string;
  direction: AppDataGridSortDirection;
};

export type AppDataGridCellType = "text" | "date" | "dateTime" | "link" | "copyable" | "json" | "image" | "menu" | "custom";

export type AppDataGridSelectionState = "none" | "some" | "all";

export type AppDataGridSelectionConfig<RowModel extends GridValidRowModel> = {
  selectedRowIds?: Set<string>;
  onSelectedRowIdsChange?: (nextIds: Set<string>) => void;
  getRowId?: (row: RowModel) => string;
  selectAllLabel?: string;
  selectNoneLabel?: string;
};

export type AppDataGridRowDragDropPosition = "before" | "after";

export type AppDataGridRowDragReorderParams<RowModel extends GridValidRowModel> = {
  sourceRow: RowModel;
  sourceRowId: string;
  targetRow: RowModel;
  targetRowId: string;
  position: AppDataGridRowDragDropPosition;
};

export type AppDataGridRowDragConfig<RowModel extends GridValidRowModel> = {
  onReorder: (params: AppDataGridRowDragReorderParams<RowModel>) => void;
  getRowId?: (row: RowModel) => string;
  getRowLabel?: (row: RowModel) => string;
  isRowDraggable?: (row: RowModel) => boolean;
  handleColumnWidth?: number;
};

export type AppDataGridColumn<RowModel extends GridValidRowModel> = Omit<GridColDef<RowModel>, "renderCell"> & {
  cellType?: AppDataGridCellType;
  pinned?: "left" | "right";
  locked?: boolean;
  getCellValue?: (row: RowModel) => unknown;
  renderCustomCell?: (row: RowModel) => ReactNode;
  getLink?: (row: RowModel) => { href: string; label?: string; abbr?: string };
  getImageSrc?: (row: RowModel) => string | null | undefined;
  getMenuActions?: (row: RowModel) => AppDataGridMenuAction<RowModel>[];
  fallbackText?: string;
};
