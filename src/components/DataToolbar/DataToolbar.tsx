"use client";
import { forwardRef, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Button } from "../../experimental/Button/Button";
import { TextField } from "../../experimental/TextField/TextField";
import { ToggleButton } from "../../experimental/ToggleButton/ToggleButton";
import { CachedIcon, CloseIcon, FilterListIcon, SearchIcon, SortIcon, ViewColumnIcon, ViewListIcon, WindowIcon } from "../../experimental/icons";
import { useTranslation } from "../../i18n";
import { DataToolbarColumnsMenu, type DataToolbarColumnOption } from "./components/DataToolbarColumnsMenu";
import { DataToolbarSortMenu, type DataToolbarSortOption, type DataToolbarSortRule } from "./components/DataToolbarSortMenu";
import { DataToolbarFilterMenu, type DataToolbarFilterField, type DataToolbarFilterRule } from "./components/DataToolbarFilterMenu";
import styles from "./DataToolbar.module.css";
export type { DataToolbarSelectionOption, DataToolbarSelectionState } from "./components/DataToolbarSelectionMenu";
export type { DataToolbarSortDirection, DataToolbarSortOption, DataToolbarSortRule } from "./components/DataToolbarSortMenu";
export type { DataToolbarFilterField, DataToolbarFilterFieldType, DataToolbarFilterOperator, DataToolbarFilterRule } from "./components/DataToolbarFilterMenu";
export type ClassesViewMode = "cards" | "list";
export type DataGridInteractionMode = "client" | "server";

export type DataToolbarProps = {
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
  selectedCount?: number;
  mode?: DataGridInteractionMode;
  viewMode?: ClassesViewMode;
  onViewModeChange?: (mode: ClassesViewMode) => void;
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
 const [isSearchOpen, setIsSearchOpen] = useState(false);
 const [internalSearchValue, setInternalSearchValue] = useState("");
 const searchInputRef = useRef<HTMLInputElement>(null);
 const searchTriggerRef = useRef<HTMLButtonElement>(null);
 const { t, useNamespace } = useTranslation();
 useNamespace("common.ui");
 const tr = (key: string, defaultMessage: string) => t(key, { defaultMessage, namespace: "common.ui" });
 const resolvedSearchValue = searchValue ?? internalSearchValue;
 const handleSearchChange = (value: string) => {
   if (searchValue === undefined) setInternalSearchValue(value);
   onSearchValueChange?.(value);
 };
 const closeSearch = () => {
   if (resolvedSearchValue) handleSearchChange("");
   setIsSearchOpen(false);
   searchTriggerRef.current?.focus();
 };
 useEffect(() => { if (isSearchOpen) searchInputRef.current?.focus(); }, [isSearchOpen]);
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
   {showSearchButton && <div className={styles.search}>
    <Button ref={searchTriggerRef} variant="text" tone="neutral" density="compact" aria-label={tr("common.ui.toolbar.search", "Search")}
     aria-expanded={isSearchOpen} onPress={() => { setIsSearchOpen(true); searchInputRef.current?.focus(); }}><SearchIcon /></Button>
    {isSearchOpen && <div className={styles.searchField} onKeyDown={event => {
     if (event.key === "Escape") { event.stopPropagation(); event.preventDefault(); closeSearch(); }
    }}>
     <TextField ref={searchInputRef} type="search" density="compact" aria-label={tr("common.ui.toolbar.search", "Search")}
      placeholder={searchPlaceholder ?? tr("common.ui.toolbar.search", "Search")} value={resolvedSearchValue} onValueChange={handleSearchChange} />
     <Button variant="text" tone="neutral" density="compact" aria-label={tr("common.ui.toolbar.closeSearch", "Clear and close search")}
      onPress={closeSearch}><CloseIcon /></Button>
    </div>}
   </div>}
   {showColumnsButton && (columnOptions && onColumnOptionsChange
    ? <DataToolbarColumnsMenu options={columnOptions} onChange={onColumnOptionsChange} />
    : <Button variant="outlined" tone="neutral" density="compact" disabled startIcon={<ViewColumnIcon />}>{tr("common.ui.toolbar.columns", "Columns")}</Button>)}
   {showSortButton && (sortOptions && sortRules && onSortRulesChange
    ? <DataToolbarSortMenu options={sortOptions} value={sortRules} onApply={onSortRulesChange} />
    : <Button variant="outlined" tone="neutral" density="compact" disabled startIcon={<SortIcon />}>{tr("common.ui.toolbar.sort", "Sort")}</Button>)}
   {showFilterButton && (filterFields && filterRules && onFilterRulesChange
    ? <DataToolbarFilterMenu fields={filterFields} value={filterRules} onApply={onFilterRulesChange} />
    : <Button variant="outlined" tone="neutral" density="compact" disabled startIcon={<FilterListIcon />}>{tr("common.ui.toolbar.filter", "Filter")}</Button>)}
   {canToggleViewMode && <div className={styles.views} role="group" aria-label={tr("common.ui.toolbar.viewMode", "View mode")}>
    <ToggleButton density="compact" selected={viewMode === "cards"} disabled={!onViewModeChange}
     aria-label={tr("common.ui.toolbar.cards", "Cards")} onPress={() => onViewModeChange?.("cards")}><WindowIcon /></ToggleButton>
    <ToggleButton density="compact" selected={viewMode === "list"} disabled={!onViewModeChange}
     aria-label={tr("common.ui.toolbar.list", "List")} onPress={() => onViewModeChange?.("list")}><ViewListIcon /></ToggleButton>
   </div>}
  </div>
 </div>;
});
