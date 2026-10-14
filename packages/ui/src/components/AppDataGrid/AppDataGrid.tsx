"use client";

import { forwardRef, useEffect, useMemo, useRef, type ReactElement, type Ref } from "react";
import { OwnedGridInteraction, type OwnedGridInteractionProps } from "./ownedGridInteraction";
import { useOwnedGridController } from "./ownedGridController";
import { processOwnedGridRows, normalizeGridPageSizeOptions } from "./ownedGridModel";
import type { AppDataGridSelectionConfig } from "./types";
import { AppPaginationFooter } from "../CardPaginationFooter";
import { useOwnedGridLayoutController } from "./ownedGridLayoutController";
import { useOwnedGridPersistence, type OwnedGridPersistenceConfig } from "./ownedGridPersistence";
import { OwnedGridStatus } from "./ownedGridParts";
import { Button } from "../../experimental/Button/Button";
import { useTranslation } from "../../i18n";
import { createOwnedGridResetState, type AppDataGridViewState } from "./ownedGridReset";
import { transitionOwnedGridState, type OwnedGridTransition } from "./ownedGridState";
import styles from "./AppDataGrid.module.css";

/** Owned catalog grid. Host rows and server work remain outside this component. */
export type AppDataGridProps<RowModel> = Omit<OwnedGridInteractionProps<RowModel>,
  "selection" | "selectedRowIds" | "defaultSelectedRowIds" | "onSelectedRowIdsChange" | "isRowSelectable" | "processingResult" | "dispatchTransition" | "selectPageLabel" | "selectNoneLabel"> & {
  selection?: boolean | AppDataGridSelectionConfig<RowModel>;
  hideFooter?: boolean;
  /** Optional per-view persistence key. */
  storageKey?: string;
  persistence?: OwnedGridPersistenceConfig;
  /** Offer an accessible reset action. Defaults to false. */
  showResetView?: boolean;
  /** One complete requested snapshot, including controlled concerns. */
  onResetView?: (state: AppDataGridViewState) => void;
};

type ComposedGridProps<RowModel> = AppDataGridProps<RowModel> & Pick<OwnedGridInteractionProps<RowModel>, "processingResult" | "dispatchTransition">;

function Grid<RowModel>(props: ComposedGridProps<RowModel> & { persist?: ReturnType<typeof useOwnedGridPersistence<RowModel>>["persist"]; resetPersistence?: ReturnType<typeof useOwnedGridPersistence<RowModel>>["reset"]; resetDefaults?: AppDataGridProps<RowModel> }, ref: Ref<HTMLDivElement>) {
  const { selection = true, hideFooter = false, processingResult, storageKey: _storageKey, persistence: _persistence, persist, resetPersistence, resetDefaults, showResetView, onResetView, ...interaction } = props;
  const { t } = useTranslation();
  const config = typeof selection === "object" ? selection : undefined;
  const { state, dispatch: localDispatch } = useOwnedGridController({ ...interaction,
    rowCount: props.mode === "server" ? props.rowCount : undefined, hasNextPage: props.mode === "server" ? props.hasNextPage : undefined,
    selectedRowIds: config?.selectedRowIds, defaultSelectedRowIds: config?.defaultSelectedRowIds,
    onSelectedRowIdsChange: config?.onSelectedRowIdsChange });
  const { layout, setVisibility, setOrder, setWidths } = useOwnedGridLayoutController(interaction);
  useEffect(() => { persist?.({ ...state, columnVisibilityModel: layout.visibility, columnOrder: layout.order, columnWidths: layout.widths }); }, [persist, state, layout]);
  const requestedDispatch = props.dispatchTransition ?? localDispatch;
  const processed = useMemo(() => processingResult ?? processOwnedGridRows({ ...interaction, ...state }),
    [processingResult, props.rows, props.columns, props.getRowId, props.mode, props.rowCount, props.hasNextPage, props.filterFields,
      state.paginationModel, state.sortRules, state.filterRules, state.searchValue]);
  const dispatch = (action: OwnedGridTransition) => {
    if (props.mode !== "server" && (action.type === "page" || action.type === "pageSize" || action.type === "pagination")) {
      const next = transitionOwnedGridState(state, action, { columns: props.columns, pageSizeOptions: props.pageSizeOptions, rowCount: processed.rowCount });
      requestedDispatch({ type: "pagination", value: next.paginationModel });
    } else requestedDispatch(action);
  };
  const root = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<{ page: number; origin: Element | null } | null>(null);
  useEffect(() => {
    const pending = pendingFocus.current;
    if (!pending || state.paginationModel.page !== pending.page) return;
    pendingFocus.current = null;
    if (document.activeElement !== pending.origin && document.activeElement !== document.body) return;
    const container = root.current?.querySelector<HTMLElement>("[data-sgui-part='grid-container']");
    if (container) container.scrollTop = 0;
    (container?.querySelector<HTMLElement>("tbody [data-grid-field]:not([data-grid-field='__selection']):not([data-grid-field='__reorder'])") ?? container?.querySelector<HTMLElement>("table"))?.focus({ preventScroll: true });
  }, [state.paginationModel.page]);
  const options = normalizeGridPageSizeOptions(props.pageSizeOptions).map(option => option.value);
  return <div ref={root} className={styles.root} data-sgui-part="data-grid">
    {showResetView && <Button className={styles.resetView} variant="text" tone="neutral" density="compact" onPress={() => {
      const next = createOwnedGridResetState(resetDefaults ?? props);
      resetPersistence?.(next);
      setVisibility(next.columnVisibilityModel); setOrder(next.columnOrder); setWidths(next.columnWidths);
      dispatch({ type: "reset", value: next });
      onResetView?.(next);
    }}>{t("common.ui.grid.resetView", { defaultMessage: "Reset view" })}</Button>}
    <OwnedGridInteraction {...interaction} ref={ref} processingResult={processed} dispatchTransition={dispatch} {...state}
      selection={selection !== false} isRowSelectable={config?.isRowSelectable}
      selectPageLabel={config?.selectAllLabel} selectNoneLabel={config?.selectNoneLabel}
      columnVisibilityModel={layout.visibility} onColumnVisibilityModelChange={setVisibility}
      columnOrder={layout.order} onColumnOrderChange={setOrder} columnWidths={layout.widths} onColumnWidthsChange={setWidths}
      onSelectedRowIdsChange={value => dispatch({ type: "selection", value })}
      onPaginationModelChange={value => dispatch({ type: "pagination", value })}
      onSearchChange={value => dispatch({ type: "search", value })}
      onSortRulesChange={value => dispatch({ type: "sort", value })}
      onFilterRulesChange={value => dispatch({ type: "filter", value })}
      onStateChange={undefined} />
    {!hideFooter && <AppPaginationFooter page={processed.paginationModel.page} pageSize={processed.paginationModel.pageSize}
      pageSizeOptions={options} totalCount={processed.rowCount} hasNextPage={processed.canNextPage}
      onPageChange={() => {}} onPageSizeChange={() => {}}
      onPaginationModelChange={value => {
        pendingFocus.current = { page: value.pageSize !== state.paginationModel.pageSize ? 0 : value.page, origin: document.activeElement };
        dispatch({ type: "pagination", value });
      }} />}
  </div>;
}

export const ComposedAppDataGrid = forwardRef(Grid) as <RowModel>(props: ComposedGridProps<RowModel> & {
  ref?: Ref<HTMLDivElement>; persist?: ReturnType<typeof useOwnedGridPersistence<RowModel>>["persist"];
  resetPersistence?: ReturnType<typeof useOwnedGridPersistence<RowModel>>["reset"]; resetDefaults?: AppDataGridProps<RowModel>;
}) => ReactElement;
function PersistentGrid<RowModel>(props: AppDataGridProps<RowModel>, ref: Ref<HTMLDivElement>) {
  const persistence = useOwnedGridPersistence({ ...props, persistence: props.persistence ?? (props.storageKey ? { key: props.storageKey } : undefined) });
  if (!persistence.ready) return <OwnedGridStatus state="loading" />;
  const restored = persistence.defaults;
  return <ComposedAppDataGrid {...props} ref={ref} persist={persistence.persist} resetPersistence={persistence.reset} resetDefaults={props}
    defaultPaginationModel={restored.paginationModel ?? props.defaultPaginationModel}
    defaultSortRules={restored.sortRules ?? props.defaultSortRules}
    defaultFilterRules={restored.filterRules ?? props.defaultFilterRules}
    defaultSearchValue={restored.searchValue ?? props.defaultSearchValue}
    defaultColumnVisibilityModel={restored.columnVisibilityModel ?? props.defaultColumnVisibilityModel}
    defaultColumnOrder={restored.columnOrder ?? props.defaultColumnOrder}
    defaultColumnWidths={restored.columnWidths ?? props.defaultColumnWidths} />;
}
export const AppDataGrid = forwardRef(PersistentGrid) as <RowModel>(props: AppDataGridProps<RowModel> & {
  ref?: Ref<HTMLDivElement>;
}) => ReactElement;
