import type { OwnedGridControllerOptions } from "./ownedGridController";
import { normalizeOwnedGridLayout } from "./ownedGridColumns";
import type { OwnedGridLayoutControllerOptions } from "./ownedGridLayoutController";
import { normalizeGridFilterRules, normalizeGridPagination, normalizeGridSortRules } from "./ownedGridModel";
import type { OwnedGridCriteriaState } from "./ownedGridState";

/** Complete requested reset snapshot. Controlled concerns remain host-owned. */
export interface AppDataGridViewState extends OwnedGridCriteriaState {
  columnVisibilityModel: Record<string, boolean>;
  columnOrder: string[];
  columnWidths: Record<string, number>;
  viewMode?: "list" | "cards";
}

export function createOwnedGridResetState<Row>(options: OwnedGridControllerOptions<Row> & OwnedGridLayoutControllerOptions<Row>, viewMode?: "list" | "cards"): AppDataGridViewState {
  const layout = normalizeOwnedGridLayout(options.columns, { visibility: options.defaultColumnVisibilityModel,
    order: options.defaultColumnOrder, widths: options.defaultColumnWidths });
  return {
    paginationModel: normalizeGridPagination({ page: 0, pageSize: options.defaultPaginationModel?.pageSize ?? 25 }, options.pageSizeOptions),
    sortRules: normalizeGridSortRules(options.defaultSortRules ?? [], options.columns),
    filterRules: normalizeGridFilterRules(options.defaultFilterRules ?? [], options.columns, options.filterFields),
    searchValue: options.defaultSearchValue ?? "", selectedRowIds: new Set(),
    columnVisibilityModel: { ...layout.visibility }, columnOrder: [...layout.order], columnWidths: { ...layout.widths },
    ...(viewMode === undefined ? {} : { viewMode }),
  };
}
