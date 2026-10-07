import type { DataToolbarFilterField, DataToolbarFilterRule } from "../DataToolbar/DataToolbar";
import { normalizeGridFilterRules, normalizeGridPagination, normalizeGridSortRules, type OwnedGridColumn, type OwnedGridPageSizeOption, type OwnedGridPaginationModel, type OwnedGridSortRule } from "./ownedGridModel";

/** Shared engine-independent transaction snapshot; never stores host rows. */
export interface OwnedGridCriteriaState {
  paginationModel: OwnedGridPaginationModel;
  sortRules: OwnedGridSortRule[];
  filterRules: DataToolbarFilterRule[];
  searchValue: string;
  selectedRowIds: ReadonlySet<string>;
}
export type OwnedGridTransition =
  | { type: "search"; value: string }
  | { type: "sort"; value: readonly OwnedGridSortRule[] }
  | { type: "filter"; value: readonly DataToolbarFilterRule[] }
  | { type: "page"; value: number }
  | { type: "pageSize"; value: number }
  | { type: "pagination"; value: OwnedGridPaginationModel }
  | { type: "selection"; value: ReadonlySet<string> };

export interface OwnedGridTransitionOptions<Row> {
  columns: readonly OwnedGridColumn<Row>[];
  filterFields?: readonly DataToolbarFilterField[];
  pageSizeOptions?: readonly OwnedGridPageSizeOption[];
  /** A known total; omission deliberately leaves server navigation to the host. */
  rowCount?: number;
  hasNextPage?: boolean;
}

/** Produces one complete next snapshot without mutating input or controlled slices. */
export function transitionOwnedGridState<Row>(state: OwnedGridCriteriaState, action: OwnedGridTransition, options: OwnedGridTransitionOptions<Row>): OwnedGridCriteriaState {
  switch (action.type) {
    case "search": return { ...state, paginationModel: { ...state.paginationModel, page: 0 }, searchValue: action.value };
    case "sort": return { ...state, paginationModel: { ...state.paginationModel, page: 0 }, sortRules: normalizeGridSortRules(action.value, options.columns) };
    case "filter": return { ...state, paginationModel: { ...state.paginationModel, page: 0 }, filterRules: normalizeGridFilterRules(action.value, options.columns, options.filterFields) };
    case "selection": return { ...state, selectedRowIds: new Set(action.value) };
    case "pageSize": return { ...state, paginationModel: normalizeGridPagination({ page: 0, pageSize: action.value }, options.pageSizeOptions) };
    case "pagination": {
      // The footer supplies one atomic page/size request, never two host requests.
      const next = transitionOwnedGridState(state, action.value.pageSize !== state.paginationModel.pageSize
        ? { type: "pageSize", value: action.value.pageSize }
        : { type: "page", value: action.value.page }, options);
      return next;
    }
    case "page": {
      const model = normalizeGridPagination({ ...state.paginationModel, page: action.value }, options.pageSizeOptions);
      if (options.rowCount !== undefined && Number.isSafeInteger(options.rowCount) && options.rowCount >= 0) {
        model.page = Math.min(model.page, Math.max(0, Math.ceil(options.rowCount / model.pageSize) - 1));
      } else if (options.hasNextPage === false && model.page > state.paginationModel.page) {
        model.page = state.paginationModel.page;
      }
      return { ...state, paginationModel: model };
    }
  }
}

export interface OwnedGridChangeCallbacks {
  onPaginationModelChange?: (value: OwnedGridPaginationModel) => void;
  onSortRulesChange?: (value: OwnedGridSortRule[]) => void;
  onFilterRulesChange?: (value: DataToolbarFilterRule[]) => void;
  onSearchChange?: (value: string) => void;
  onSelectedRowIdsChange?: (value: Set<string>) => void;
  onStateChange?: (value: OwnedGridCriteriaState) => void;
}

/** Slice requests precede a single combined notification for host server requests. */
export function notifyOwnedGridTransition(previous: OwnedGridCriteriaState, next: OwnedGridCriteriaState, action: OwnedGridTransition, callbacks: OwnedGridChangeCallbacks): void {
  if (previous.paginationModel.page !== next.paginationModel.page || previous.paginationModel.pageSize !== next.paginationModel.pageSize) {
    callbacks.onPaginationModelChange?.({ ...next.paginationModel });
  }
  switch (action.type) {
    case "search": callbacks.onSearchChange?.(next.searchValue); break;
    case "sort": callbacks.onSortRulesChange?.(next.sortRules.map(rule => ({ ...rule }))); break;
    case "filter": callbacks.onFilterRulesChange?.(next.filterRules.map(rule => ({ ...rule }))); break;
    case "selection": callbacks.onSelectedRowIdsChange?.(new Set(next.selectedRowIds)); break;
  }
  callbacks.onStateChange?.({ ...next, paginationModel: { ...next.paginationModel }, sortRules: next.sortRules.map(rule => ({ ...rule })), filterRules: next.filterRules.map(rule => ({ ...rule })), selectedRowIds: new Set(next.selectedRowIds) });
}

/** Page selection retains off-page IDs; disabled rows cannot be newly selected. */
export function selectOwnedGridPage(selected: ReadonlySet<string>, selectablePageIds: readonly string[], checked: boolean): Set<string> {
  const next = new Set(selected);
  for (const id of selectablePageIds) {
    if (checked) next.add(id); else next.delete(id);
  }
  return next;
}

export function getOwnedGridPageSelection(selected: ReadonlySet<string>, selectablePageIds: readonly string[]): "none" | "some" | "all" {
  const unique = new Set(selectablePageIds);
  const count = [...unique].filter(id => selected.has(id)).length;
  return count === 0 ? "none" : count === unique.size ? "all" : "some";
}
