"use client";

import { forwardRef, useEffect, useMemo, useRef, useState, type ReactElement, type ReactNode, type Ref } from "react";
import { DataToolbar, type ClassesViewMode, type DataToolbarColumnOption, type DataToolbarProps } from "../DataToolbar";
import { ComposedAppDataGrid as AppDataGrid, type AppDataGridProps } from "../AppDataGrid/AppDataGrid";
import { AppPaginationFooter } from "../CardPaginationFooter";
import { useOwnedGridController } from "../AppDataGrid/ownedGridController";
import { useOwnedGridLayoutController } from "../AppDataGrid/ownedGridLayoutController";
import { getOwnedGridRowId, normalizeGridPageSizeOptions, processOwnedGridRows } from "../AppDataGrid/ownedGridModel";
import { OwnedGridStatus } from "../AppDataGrid/ownedGridParts";
import { useOwnedGridPersistence, type OwnedGridPersistedState, type OwnedGridPersistenceConfig } from "../AppDataGrid/ownedGridPersistence";
import styles from "./AppDataGridShell.module.css";

/** Criteria are owned by the shell. Toolbar callbacks observe those transactions. */
export type AppDataGridShellToolbarConfig = Omit<DataToolbarProps,
  "mode" | "viewMode" | "onViewModeChange" | "columnOptions" | "onColumnOptionsChange" | "selectedCount"
> & {
  show?: boolean;
  showSelectedCount?: boolean;
  baseColumnOptions?: readonly { id: string; label: string; locked?: boolean }[];
  onColumnOptionsChange?: (options: DataToolbarColumnOption[]) => void;
};

/** Cards use the same identity, processing and pagination as the list. */
export type AppDataGridShellCardsConfig<RowModel> = {
  renderCard: (row: RowModel) => ReactNode;
};
export type AppDataGridShellViewConfig<RowModel> = {
  enabled?: boolean;
  mode?: ClassesViewMode;
  defaultMode?: ClassesViewMode;
  onModeChange?: (mode: ClassesViewMode) => void;
  cards?: AppDataGridShellCardsConfig<RowModel>;
};
export type AppDataGridShellProps<RowModel> = Omit<AppDataGridProps<RowModel>, "processingResult" | "dispatchTransition"> & {
  persistence?: OwnedGridPersistenceConfig;
  footer?: ReactNode;
  toolbar?: AppDataGridShellToolbarConfig;
  view?: AppDataGridShellViewConfig<RowModel>;
};

function ReadyShell<RowModel>({ persisted: persistence, shellRef: ref, ...props }: AppDataGridShellProps<RowModel> & {
  shellRef: Ref<HTMLDivElement>; persisted: { defaults: OwnedGridPersistedState; persist: (state: OwnedGridPersistedState) => void };
}) {
  const { toolbar, view, selection = true, mode = "client", className, style, hideFooter, footer,
    rows, columns, getRowId, getRowLabel, label, ...gridProps } = props;
  const selectionConfig = typeof selection === "object" ? selection : undefined;
  const filterFields = props.filterFields ?? toolbar?.filterFields;
  const defaults = persistence.defaults;
  const toolbarSortRules = useMemo(() => toolbar?.sortRules?.flatMap(rule => rule.field && (rule.direction === "asc" || rule.direction === "desc")
    ? [{ field: rule.field, direction: rule.direction }] : []), [toolbar?.sortRules]);
  const { state, dispatch } = useOwnedGridController({ ...props, filterFields,
    defaultPaginationModel: defaults.paginationModel ?? props.defaultPaginationModel,
    defaultSortRules: defaults.sortRules ?? props.defaultSortRules,
    defaultFilterRules: defaults.filterRules ?? props.defaultFilterRules,
    defaultSearchValue: defaults.searchValue ?? props.defaultSearchValue,
    searchValue: props.searchValue ?? toolbar?.searchValue,
    sortRules: props.sortRules ?? toolbarSortRules,
    filterRules: props.filterRules ?? toolbar?.filterRules,
    selectedRowIds: selectionConfig?.selectedRowIds,
    defaultSelectedRowIds: selectionConfig?.defaultSelectedRowIds,
    onSelectedRowIdsChange: selectionConfig?.onSelectedRowIdsChange,
    onSearchChange: value => { props.onSearchChange?.(value); if (toolbar?.onSearchValueChange !== props.onSearchChange) toolbar?.onSearchValueChange?.(value); },
    onSortRulesChange: value => { props.onSortRulesChange?.(value); if (toolbar?.onSortRulesChange !== props.onSortRulesChange) toolbar?.onSortRulesChange?.(value); },
    onFilterRulesChange: value => { props.onFilterRulesChange?.(value); if (toolbar?.onFilterRulesChange !== props.onFilterRulesChange) toolbar?.onFilterRulesChange?.(value); },
  });
  const { layout, setVisibility, setOrder, setWidths } = useOwnedGridLayoutController({ ...props,
    defaultColumnVisibilityModel: defaults.columnVisibilityModel ?? props.defaultColumnVisibilityModel,
    defaultColumnOrder: defaults.columnOrder ?? props.defaultColumnOrder,
    defaultColumnWidths: defaults.columnWidths ?? props.defaultColumnWidths });
  const processed = useMemo(() => processOwnedGridRows({ rows, columns, getRowId, mode, filterFields,
    rowCount: props.rowCount, hasNextPage: props.hasNextPage, ...state }),
  [rows, columns, getRowId, mode, filterFields, props.rowCount, props.hasNextPage,
    state.paginationModel, state.sortRules, state.filterRules, state.searchValue]);
  const [localView, setLocalView] = useState<ClassesViewMode>(() => defaults.viewMode ?? view?.defaultMode ?? "list");
  const viewMode = view?.mode ?? localView;
  useEffect(() => { persistence.persist({ ...state, columnVisibilityModel: layout.visibility,
    columnOrder: layout.order, columnWidths: layout.widths, viewMode }); });
  const canToggle = view?.enabled !== false && Boolean(view?.cards);
  const cards = canToggle && viewMode === "cards";
  const columnOptions = layout.order.map(field => {
    const column = columns.find(candidate => candidate.field === field)!;
    const hostOption = toolbar?.baseColumnOptions?.find(option => option.id === field);
    return { id: field, label: hostOption?.label ?? column.headerName ?? field,
      visible: layout.visibility[field]!, locked: layout.lockedFields.includes(field) };
  });
  const entry = useRef<HTMLDivElement>(null);
  const cardFocus = useRef<{ id: string; index: number; element: HTMLElement } | null>(null);
  useEffect(() => {
    const saved = cardFocus.current;
    const node = entry.current;
    if (!cards || !saved || !node || saved.element.isConnected) return;
    if (document.activeElement !== document.body && !node.contains(document.activeElement)) return;
    const items = [...node.querySelectorAll<HTMLElement>("[data-sgui-part='grid-card']")];
    const item = items.find(item => item.dataset.gridRow === saved.id) ?? items[0];
    const controls = item?.querySelectorAll<HTMLElement>("button, a, input, select, textarea, [tabindex='0']");
    (saved.index >= 0 ? controls?.[saved.index] ?? item ?? node : item ?? node).focus();
  });
  const pendingPageFocus = useRef<{ page: number; origin: Element | null } | null>(null);
  // Footer page changes enter the new page only after the authoritative value
  // changes. Toolbar/search and another instance keep their own focus.
  useEffect(() => {
    if (pendingPageFocus.current === null || pendingPageFocus.current.page !== state.paginationModel.page) return;
    const origin = pendingPageFocus.current.origin;
    pendingPageFocus.current = null;
    if (document.activeElement !== origin && document.activeElement !== document.body) return;
    const node = entry.current;
    const scrolling = node?.querySelector<HTMLElement>("[data-sgui-part='grid-container']") ?? node;
    if (scrolling) scrolling.scrollTop = 0;
    (node?.querySelector<HTMLElement>("tbody [data-grid-field]:not([data-grid-field='__selection']), [data-sgui-part='grid-card']") ?? node)?.focus();
  }, [state.paginationModel.page]);
  const hasCriteria = Boolean(state.searchValue || state.filterRules.length);
  return <div ref={ref} className={[styles.root, className].filter(Boolean).join(" ")} style={style} data-sgui-part="data-grid-shell">
    {toolbar?.show !== false && <DataToolbar {...toolbar} mode={mode}
      selectedCount={toolbar?.showSelectedCount === false ? undefined : state.selectedRowIds.size}
      leftContentWhenSelected={state.selectedRowIds.size ? toolbar?.leftContentWhenSelected : undefined}
      columnOptions={columnOptions} onColumnOptionsChange={options => {
        setVisibility(Object.fromEntries(options.map(option => [option.id, option.visible])));
        setOrder(options.map(option => option.id));
        toolbar?.onColumnOptionsChange?.(options.map(option => ({ ...option })));
      }}
      sortOptions={toolbar?.sortOptions ?? columns.filter(column => column.sortable !== false).map(column => ({ id: column.field, label: column.headerName ?? column.field }))}
      sortRules={state.sortRules} onSortRulesChange={value => dispatch({ type: "sort", value: value.flatMap(rule => rule.field && (rule.direction === "asc" || rule.direction === "desc")
        ? [{ field: rule.field, direction: rule.direction }] : []) })}
      filterFields={filterFields ? [...filterFields] : undefined} filterRules={state.filterRules}
      onFilterRulesChange={value => dispatch({ type: "filter", value })}
      searchValue={state.searchValue} onSearchValueChange={value => dispatch({ type: "search", value })}
      showViewModeToggle={canToggle} viewMode={canToggle ? viewMode : undefined}
      onViewModeChange={canToggle ? next => { if (view?.mode === undefined) setLocalView(next); view?.onModeChange?.(next); } : undefined} />}
    <div ref={entry} className={styles.content} tabIndex={-1} aria-label={label} onFocusCapture={event => {
      if (!cards || !event.currentTarget.contains(event.target)) return;
      const element = event.target as HTMLElement;
      const card = element.closest<HTMLElement>("[data-sgui-part='grid-card']");
      if (!card?.dataset.gridRow) return;
      const controls = [...card.querySelectorAll<HTMLElement>("button, a, input, select, textarea, [tabindex='0']")];
      cardFocus.current = { id: card.dataset.gridRow, index: controls.indexOf(element), element };
    }}>
      {cards && view?.cards ? <>
        {props.errorMessage ? <OwnedGridStatus state="error" message={props.errorMessage} onRetry={props.onRetry} />
          : props.loading || props.refreshing ? <OwnedGridStatus state={processed.rows.length ? "refreshing" : "loading"} />
          : !processed.rows.length ? <OwnedGridStatus state={hasCriteria ? "noResults" : "empty"} /> : null}
        <div className={styles.cards} aria-label={label} role="list" aria-busy={props.loading || props.refreshing || undefined}>
          {processed.rows.map(row => <div className={styles.card} key={getOwnedGridRowId(row, getRowId)} role="listitem" tabIndex={-1}
            aria-label={getRowLabel(row)} data-grid-row={getOwnedGridRowId(row, getRowId)} data-sgui-part="grid-card">{view.cards!.renderCard(row)}</div>)}
        </div>
      </> : <AppDataGrid {...gridProps} storageKey={undefined} persistence={undefined} label={label} getRowLabel={getRowLabel} getRowId={getRowId}
        rows={rows} columns={columns} mode={mode} filterFields={filterFields} processingResult={processed} dispatchTransition={dispatch}
        {...state} selection={selection === false ? false : { ...selectionConfig, selectedRowIds: state.selectedRowIds,
          onSelectedRowIdsChange: value => dispatch({ type: "selection", value }) }}
        onPaginationModelChange={value => dispatch({ type: "pagination", value })}
        onSortRulesChange={value => dispatch({ type: "sort", value })}
        onFilterRulesChange={value => dispatch({ type: "filter", value })}
        onSearchChange={value => dispatch({ type: "search", value })} onStateChange={undefined}
        columnVisibilityModel={layout.visibility} onColumnVisibilityModelChange={setVisibility}
        columnOrder={layout.order} onColumnOrderChange={setOrder} columnWidths={layout.widths} onColumnWidthsChange={setWidths} hideFooter />}
    </div>
    {!hideFooter && (footer ?? <AppPaginationFooter page={state.paginationModel.page} pageSize={state.paginationModel.pageSize}
      pageSizeOptions={normalizeGridPageSizeOptions(props.pageSizeOptions).map(option => option.value)} totalCount={processed.rowCount}
      hasNextPage={processed.canNextPage} onPageChange={() => {}} onPageSizeChange={() => {}}
      onPaginationModelChange={value => {
        pendingPageFocus.current = { page: value.pageSize !== state.paginationModel.pageSize ? 0 : value.page, origin: document.activeElement };
        dispatch({ type: "pagination", value });
      }} />)}
  </div>;
}

function Shell<RowModel>(props: AppDataGridShellProps<RowModel>, ref: Ref<HTMLDivElement>) {
  const persisted = useOwnedGridPersistence({ persistence: props.persistence ?? (props.storageKey ? { key: props.storageKey } : undefined),
    columns: props.columns, filterFields: props.filterFields ?? props.toolbar?.filterFields, pageSizeOptions: props.pageSizeOptions });
  if (!persisted.ready) return <div ref={ref} className={[styles.root, props.className].filter(Boolean).join(" ")} style={props.style}
    data-sgui-part="data-grid-shell" aria-label={props.label}><OwnedGridStatus state="loading" /></div>;
  return <ReadyShell {...props} persisted={persisted} shellRef={ref} />;
}

export const AppDataGridShell = forwardRef(Shell) as <RowModel>(props: AppDataGridShellProps<RowModel> & {
  ref?: Ref<HTMLDivElement>;
}) => ReactElement;
