"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { DataToolbarFilterRule } from "../DataToolbar/DataToolbar";
import { normalizeGridFilterRules, normalizeGridPagination, normalizeGridSortRules, type OwnedGridPaginationModel, type OwnedGridSortRule } from "./ownedGridModel";
import { notifyOwnedGridTransition, transitionOwnedGridState, type OwnedGridChangeCallbacks, type OwnedGridCriteriaState, type OwnedGridTransition, type OwnedGridTransitionOptions } from "./ownedGridState";

/** Each concern chooses its own owner; callbacks alone never imply control. */
export interface OwnedGridControllerOptions<Row> extends OwnedGridTransitionOptions<Row>, OwnedGridChangeCallbacks {
  paginationModel?: OwnedGridPaginationModel;
  defaultPaginationModel?: OwnedGridPaginationModel;
  sortRules?: readonly OwnedGridSortRule[];
  defaultSortRules?: readonly OwnedGridSortRule[];
  filterRules?: readonly DataToolbarFilterRule[];
  defaultFilterRules?: readonly DataToolbarFilterRule[];
  searchValue?: string;
  defaultSearchValue?: string;
  selectedRowIds?: ReadonlySet<string>;
  defaultSelectedRowIds?: ReadonlySet<string>;
}

function cloneState(state: OwnedGridCriteriaState): OwnedGridCriteriaState {
  return { ...state, paginationModel: { ...state.paginationModel }, sortRules: state.sortRules.map(rule => ({ ...rule })),
    filterRules: state.filterRules.map(rule => ({ ...rule })), selectedRowIds: new Set(state.selectedRowIds) };
}

function resolveState<Row>(local: OwnedGridCriteriaState, options: OwnedGridControllerOptions<Row>): OwnedGridCriteriaState {
  return cloneState({ paginationModel: options.paginationModel ?? local.paginationModel, sortRules: options.sortRules ? [...options.sortRules] : local.sortRules,
    filterRules: options.filterRules ? [...options.filterRules] : local.filterRules, searchValue: options.searchValue ?? local.searchValue,
    selectedRowIds: options.selectedRowIds ?? local.selectedRowIds });
}

/** Owns criteria only, never host rows, processing output or asynchronous work. */
export function useOwnedGridController<Row>(options: OwnedGridControllerOptions<Row>): {
  state: OwnedGridCriteriaState;
  dispatch: (action: OwnedGridTransition) => void;
} {
  const [local, setLocal] = useState<OwnedGridCriteriaState>(() => ({
    paginationModel: normalizeGridPagination(options.defaultPaginationModel ?? { page: 0, pageSize: 25 }, options.pageSizeOptions),
    sortRules: normalizeGridSortRules(options.defaultSortRules ?? [], options.columns),
    filterRules: normalizeGridFilterRules(options.defaultFilterRules ?? [], options.columns, options.filterFields),
    searchValue: options.defaultSearchValue ?? "", selectedRowIds: new Set(options.defaultSelectedRowIds),
  }));
  const localRef = useRef(local);
  localRef.current = local;
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const [dispatch] = useState(() => (action: OwnedGridTransition) => {
    const current = optionsRef.current;
    const previous = resolveState(localRef.current, current);
    const next = transitionOwnedGridState(previous, action, current);
    // Commit only locally owned concerns. The requested combined snapshot can
    // differ from controlled props until the host accepts it on its next render.
    const owned = localRef.current;
    const paginationChanged = owned.paginationModel.page !== next.paginationModel.page || owned.paginationModel.pageSize !== next.paginationModel.pageSize;
    const committed: OwnedGridCriteriaState = {
      paginationModel: current.paginationModel === undefined && paginationChanged ? { ...next.paginationModel } : owned.paginationModel,
      sortRules: current.sortRules === undefined && action.type === "sort" ? next.sortRules.map(rule => ({ ...rule })) : owned.sortRules,
      filterRules: current.filterRules === undefined && action.type === "filter" ? next.filterRules.map(rule => ({ ...rule })) : owned.filterRules,
      searchValue: current.searchValue === undefined ? next.searchValue : owned.searchValue,
      selectedRowIds: current.selectedRowIds === undefined && action.type === "selection" ? new Set(next.selectedRowIds) : owned.selectedRowIds,
    };
    localRef.current = committed;
    setLocal(committed);
    notifyOwnedGridTransition(previous, next, action, current);
  });

  // Stable criteria references let processing consumers avoid rebuilding rows
  // for selection, layout or unrelated parent renders. Copies still isolate
  // consumers from host collections and our internal local state.
  const paginationSource = options.paginationModel ?? local.paginationModel;
  const sortSource = options.sortRules ?? local.sortRules;
  const filterSource = options.filterRules ?? local.filterRules;
  const selectionSource = options.selectedRowIds ?? local.selectedRowIds;
  const paginationModel = useMemo(() => ({ ...paginationSource }), [paginationSource]);
  const sortRules = useMemo(() => sortSource.map(rule => ({ ...rule })), [sortSource]);
  const filterRules = useMemo(() => filterSource.map(rule => ({ ...rule })), [filterSource]);
  const selectedRowIds = useMemo(() => new Set(selectionSource), [selectionSource]);
  const searchValue = options.searchValue ?? local.searchValue;
  const state = useMemo(() => ({ paginationModel, sortRules, filterRules, selectedRowIds, searchValue }),
    [paginationModel, sortRules, filterRules, selectedRowIds, searchValue]);
  const normalizationRequest = useRef<string | undefined>(undefined);
  const normalizedPagination = normalizeGridPagination(state.paginationModel, options.pageSizeOptions);
  const paginationKey = `${state.paginationModel.page}:${state.paginationModel.pageSize}:${normalizedPagination.page}:${normalizedPagination.pageSize}`;
  useEffect(() => {
    if (state.paginationModel.page === normalizedPagination.page && state.paginationModel.pageSize === normalizedPagination.pageSize) {
      normalizationRequest.current = undefined;
      return;
    }
    if (normalizationRequest.current === paginationKey) return;
    normalizationRequest.current = paginationKey;
    dispatch({ type: "pagination", value: normalizedPagination });
  }, [dispatch, paginationKey, state.paginationModel.page, state.paginationModel.pageSize, normalizedPagination.page, normalizedPagination.pageSize]);

  return { state, dispatch };
}
