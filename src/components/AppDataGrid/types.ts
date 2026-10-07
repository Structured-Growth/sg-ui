import type { OwnedGridCellType, OwnedGridMenuAction, OwnedGridPresentationColumn } from "./ownedGridColumns";
import type { OwnedGridPaginationModel, OwnedGridSortRule } from "./ownedGridModel";

export type AppDataGridMenuAction<Row> = OwnedGridMenuAction<Row>;
export type AppDataGridSortDirection = "asc" | "desc";
export type AppDataGridSortRule = OwnedGridSortRule;
export type AppDataGridCellType = OwnedGridCellType;
export type AppDataGridColumn<Row> = OwnedGridPresentationColumn<Row>;
export type AppDataGridSelectionState = "none" | "some" | "all";
export type AppGridRowId = string;
export type AppGridRowSelectionModel = Set<string>;
export type AppGridColumnVisibilityModel = Record<string, boolean>;
export type AppGridPaginationModel = OwnedGridPaginationModel;
export type AppDataGridSelectionConfig<Row> = {
  selectedRowIds?: ReadonlySet<string>;
  defaultSelectedRowIds?: ReadonlySet<string>;
  onSelectedRowIdsChange?: (nextIds: Set<string>) => void;
  isRowSelectable?: (row: Row) => boolean;
  selectAllLabel?: string;
  selectNoneLabel?: string;
};
export type AppDataGridRowDragDropPosition = "before" | "after";
export type AppDataGridRowDragReorderParams<Row> = {
  sourceRow: Row; sourceRowId: string; targetRow: Row; targetRowId: string;
  position: AppDataGridRowDragDropPosition;
};
export type AppDataGridRowDragConfig<Row> = {
  onReorder: (params: AppDataGridRowDragReorderParams<Row>) => void;
  getRowLabel?: (row: Row) => string;
  isRowDraggable?: (row: Row) => boolean;
  handleColumnWidth?: number;
};
