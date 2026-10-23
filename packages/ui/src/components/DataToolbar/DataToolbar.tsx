"use client";
import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { Button } from "../../components/Button/Button";
import { SearchField } from "../../experimental/SearchField/SearchField";
import { ToggleButtonGroup } from "../../experimental/ToggleButton/ToggleButton";
import { CachedIcon } from "../../experimental/icons/CachedIcon";
import { FilterListIcon } from "../../experimental/icons/FilterListIcon";
import { SortIcon } from "../../experimental/icons/SortIcon";
import { ViewColumnIcon } from "../../experimental/icons/ViewColumnIcon";
import { ViewListIcon } from "../../experimental/icons/ViewListIcon";
import { WindowIcon } from "../../experimental/icons/WindowIcon";
import { useTranslation } from "../../i18n";
import { DataToolbarColumnsMenu, type DataToolbarColumnOption } from "./components/DataToolbarColumnsMenu";
import { DataToolbarSortMenu, type DataToolbarSortOption, type DataToolbarSortRule } from "./components/DataToolbarSortMenu";
import { DataToolbarFilterMenu, type DataToolbarFilterField, type DataToolbarFilterRule } from "./components/DataToolbarFilterMenu";
import styles from "./DataToolbar.module.css";
export type { DataToolbarSelectionOption, DataToolbarSelectionState } from "./components/DataToolbarSelectionMenu";
export type { DataToolbarSortDirection, DataToolbarSortOption, DataToolbarSortRule } from "./components/DataToolbarSortMenu";
export type { DataToolbarFilterField, DataToolbarFilterFieldType, DataToolbarFilterOperator, DataToolbarFilterRule } from "./components/DataToolbarFilterMenu";
export type CoursesViewMode = "cards" | "list";
export type DataGridInteractionMode = "client" | "server";

export type DataToolbarProps = {
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
  selectedCount?: number;
  mode?: DataGridInteractionMode;
  viewMode?: CoursesViewMode;
  onViewModeChange?: (mode: CoursesViewMode) => void;
  showViewModeToggle?: boolean;
  onRefresh?: () => void;
  showRefreshButton?: boolean;
  showColumnsButton?: boolean;
  showSortButton?: boolean;
  showFilterButton?: boolean;
  showSearchButton?: boolean;
  leftContent?: ReactNode;
  leftContentWhenSelected?: ReactNode;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  columnOptions?: DataToolbarColumnOption[];
  onColumnOptionsChange?: (nextOptions: DataToolbarColumnOption[]) => void;
  sortOptions?: DataToolbarSortOption[];
  sortRules?: DataToolbarSortRule[];
  onSortRulesChange?: (nextRules: DataToolbarSortRule[]) => void;
  filterFields?: DataToolbarFilterField[];
  filterRules?: DataToolbarFilterRule[];
  onFilterRulesChange?: (nextRules: DataToolbarFilterRule[]) => void;
};


export const DataToolbar = forwardRef<HTMLDivElement, DataToolbarProps>(function DataToolbar({
 viewMode, onViewModeChange, showViewModeToggle, onRefresh, showRefreshButton = true,
 showColumnsButton = true, showSortButton = true, showFilterButton = true, showSearchButton = true,
 leftContent, leftContentWhenSelected, searchPlaceholder, searchValue, onSearchValueChange,
 columnOptions, onColumnOptionsChange, sortOptions, sortRules, onSortRulesChange,
 filterFields, filterRules, onFilterRulesChange, selectedCount, className, style, "aria-label": accessibleName,
}, ref) {
 const { t, useNamespace } = useTranslation();
 useNamespace("common.ui");
 const tr = (key: string, defaultMessage: string) => t(key, { defaultMessage, namespace: "common.ui" });
 const canToggleViewMode = showViewModeToggle ?? Boolean(viewMode && onViewModeChange);
 return <div ref={ref} role="group" aria-label={accessibleName ?? tr("common.ui.toolbar.label", "Data toolbar")}
  className={[styles.root, className].filter(Boolean).join(" ")} style={style} data-sgui-part="data-toolbar">
  <div className={styles.actions}>
   {showRefreshButton && <Button variant="text" tone="neutral" density="compact" aria-label={tr("common.ui.toolbar.refresh", "Refresh")}
    disabled={!onRefresh} onPress={onRefresh}><CachedIcon /></Button>}
   {leftContentWhenSelected ?? leftContent}
   {selectedCount !== undefined && selectedCount > 0 && <span role="status" className={styles.selected}>
    {t("common.ui.toolbar.selected", { defaultMessage: "{count} selected", values: { count: selectedCount }, namespace: "common.ui" })}</span>}
  </div>
  <div className={styles.actions}>
   {showSearchButton && <SearchField className={styles.search} expandable showResults={false} density="compact"
    aria-label={tr("common.ui.toolbar.search", "Search")} collapseLabel={tr("common.ui.toolbar.closeSearch", "Clear and close search")}
    placeholder={searchPlaceholder ?? tr("common.ui.toolbar.search", "Search")}
    value={searchValue} onValueChange={onSearchValueChange} />}
   {showColumnsButton && (columnOptions && onColumnOptionsChange
    ? <DataToolbarColumnsMenu options={columnOptions} onChange={onColumnOptionsChange} />
    : <Button variant="outlined" tone="neutral" density="compact" disabled startIcon={<ViewColumnIcon />}>{tr("common.ui.toolbar.columns", "Columns")}</Button>)}
   {showSortButton && (sortOptions && sortRules && onSortRulesChange
    ? <DataToolbarSortMenu options={sortOptions} value={sortRules} onApply={onSortRulesChange} />
    : <Button variant="outlined" tone="neutral" density="compact" disabled startIcon={<SortIcon />}>{tr("common.ui.toolbar.sort", "Sort")}</Button>)}
   {showFilterButton && (filterFields && filterRules && onFilterRulesChange
    ? <DataToolbarFilterMenu fields={filterFields} value={filterRules} onApply={onFilterRulesChange} />
    : <Button variant="outlined" tone="neutral" density="compact" disabled startIcon={<FilterListIcon />}>{tr("common.ui.toolbar.filter", "Filter")}</Button>)}
   {canToggleViewMode && <ToggleButtonGroup className={styles.views} density="compact" iconOnly
    label={tr("common.ui.toolbar.viewMode", "View mode")} selectionMode="single" allowEmpty={false}
    selectedIds={viewMode ? [viewMode] : []} disabled={!onViewModeChange}
    options={[
     {id:"cards",label:tr("common.ui.toolbar.cards", "Cards"),icon:<WindowIcon />},
     {id:"list",label:tr("common.ui.toolbar.list", "List"),icon:<ViewListIcon />},
    ]} onSelectionChange={ids => {
     const next = ids[0];
     if ((next === "cards" || next === "list") && next !== viewMode) onViewModeChange?.(next);
    }} />}

  </div>
 </div>;
});
