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
  /** Rows being moved, in their current host order. */
  sourceRows: readonly Row[];
  sourceRowIds: readonly string[];
  position: AppDataGridRowDragDropPosition;
};
export type AppDataGridRowDropTarget = {
  id: string;
  label: string;
  /** Tagging usually copies; moving to a folder usually moves. Defaults to copy. */
  operation?: "copy" | "move";
  disabled?: boolean;
};
export type AppDataGridRowTransferParams<Row> = {
  sourceRows: readonly Row[];
  sourceRowIds: readonly string[];
  targetId: string;
  operation: "copy" | "move";
};
export type AppDataGridRowDragConfig<Row> = ({
  mode?: "reorder";
  /** Show adjacent Move up/down buttons. Defaults to false. */
  showMoveButtons?: boolean;
  onReorder: (params: AppDataGridRowDragReorderParams<Row>) => void;
  dropTargets?: never;
  onDrop?: never;
} | {
  /** Transfer loaded rows to named host destinations without reordering. Works with server pages and processed views. */
  mode: "transfer";
  showMoveButtons?: false;
  dropTargets: readonly AppDataGridRowDropTarget[];
  onDrop: (params: AppDataGridRowTransferParams<Row>) => void;
  onReorder?: never;
}) & {
  getRowLabel?: (row: Row) => string;
  isRowDraggable?: (row: Row) => boolean;
  /** Width of the separate move-controls/grip column. Shared checkbox cells use their measured width. */
  handleColumnWidth?: number;
  /** Disable handle dragging while retaining any enabled move buttons. Defaults to false. */
  dragDisabled?: boolean;
};
