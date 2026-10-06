"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import CachedIcon from "@mui/icons-material/Cached";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import ViewListIcon from "@mui/icons-material/ViewList";
import WindowIcon from "@mui/icons-material/Window";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import type { ReactNode } from "react";
import { useTranslation } from "../../i18n";
import { DataToolbarColumnsMenu, type DataToolbarColumnOption } from "./components/DataToolbarColumnsMenu";
import {
  DataToolbarSortMenu,
  type DataToolbarSortOption,
  type DataToolbarSortRule,
} from "./components/DataToolbarSortMenu";
import {
  DataToolbarFilterMenu,
  type DataToolbarFilterField,
  type DataToolbarFilterRule,
} from "./components/DataToolbarFilterMenu";
export type {
  DataToolbarSelectionOption,
  DataToolbarSelectionState,
} from "./components/DataToolbarSelectionMenu";
export type { DataToolbarSortDirection, DataToolbarSortOption, DataToolbarSortRule } from "./components/DataToolbarSortMenu";
export type { DataToolbarFilterField, DataToolbarFilterFieldType, DataToolbarFilterOperator, DataToolbarFilterRule } from "./components/DataToolbarFilterMenu";

export type ClassesViewMode = "cards" | "list";
export type DataGridInteractionMode = "client" | "server";

export type DataToolbarProps = {
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

const toolbarActionButtonSx = {
  borderColor: "divider",
  color: "text.secondary",
  px: 1.25,
  py: 0.25,
  textTransform: "none",
};

export function DataToolbar({
  viewMode,
  onViewModeChange,
  showViewModeToggle,
  onRefresh,
  showRefreshButton = true,
  showColumnsButton = true,
  showSortButton = true,
  showFilterButton = true,
  showSearchButton = true,
  leftContent,
  leftContentWhenSelected,
  searchPlaceholder,
  searchValue,
  onSearchValueChange,
  columnOptions,
  onColumnOptionsChange,
  sortOptions,
  sortRules,
  onSortRulesChange,
  filterFields,
  filterRules,
  onFilterRulesChange,
}: DataToolbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [internalSearchValue, setInternalSearchValue] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { t, useNamespace } = useTranslation();
  useNamespace("common.ui");
  const tr = (key: string, defaultMessage: string) => t(key, { defaultMessage, namespace: "common.ui" });

  const resolvedSearchValue = searchValue ?? internalSearchValue;
  const resolvedSearchPlaceholder = searchPlaceholder ?? tr("common.ui.toolbar.search", "Search");

  const canToggleViewMode = useMemo(() => {
    if (typeof showViewModeToggle === "boolean") {
      return showViewModeToggle;
    }

    return Boolean(viewMode && onViewModeChange);
  }, [onViewModeChange, showViewModeToggle, viewMode]);
  const resolvedLeftContent = leftContentWhenSelected ?? leftContent;

  const handleSearchChange = (value: string) => {
    if (onSearchValueChange) {
      onSearchValueChange(value);
      return;
    }

    setInternalSearchValue(value);
  };

  useEffect(() => {
    if (!isSearchOpen) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [isSearchOpen]);

  return (
    <Box
      sx={{
        alignItems: "center",
        bgcolor: "action.hover",
        borderBottom: 1,
        borderColor: "divider",
        display: "flex",
        justifyContent: "space-between",
        minHeight: 54,
        px: 1.5,
      }}
    >
      <Box sx={{ alignItems: "center", display: "flex", gap: 1 }}>
        {showRefreshButton ? (
          <IconButton onClick={onRefresh} size="small">
            <CachedIcon fontSize="small" />
          </IconButton>
        ) : null}
        {resolvedLeftContent}
      </Box>

      <Box sx={{ alignItems: "center", display: "flex", gap: 1 }}>
        {showSearchButton ? (
          <Box sx={{ alignItems: "center", display: "flex" }}>
            <Collapse in={!isSearchOpen} orientation="horizontal" timeout={180}>
              <IconButton
                onClick={() => {
                  setIsSearchOpen(true);
                }}
                size="small"
              >
                <SearchIcon fontSize="small" />
              </IconButton>
            </Collapse>

            <Collapse in={isSearchOpen} orientation="horizontal" timeout={180}>
              <Paper
                sx={{
                  alignItems: "center",
                  borderRadius: "5px",
                  display: "flex",
                  pl: 1,
                  pr: 0.5,
                  width: { xs: 180, sm: 260 },
                }}
                variant="outlined"
              >
                <SearchIcon color="action" fontSize="small" />
                <InputBase
                  inputRef={searchInputRef}
                  onBlur={() => {
                    if (!resolvedSearchValue.trim()) {
                      setIsSearchOpen(false);
                    }
                  }}
                  onChange={(event) => {
                    handleSearchChange(event.target.value);
                  }}
                  placeholder={resolvedSearchPlaceholder}
                  sx={{ ml: 1, width: "100%" }}
                  value={resolvedSearchValue}
                />
                <IconButton
                  onClick={() => {
                    if (resolvedSearchValue) {
                      handleSearchChange("");
                    }
                    setIsSearchOpen(false);
                  }}
                  size="small"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Paper>
            </Collapse>
          </Box>
        ) : null}

        {showColumnsButton ? (
          columnOptions && onColumnOptionsChange ? (
            <DataToolbarColumnsMenu onChange={onColumnOptionsChange} options={columnOptions} />
          ) : (
            <Button size="small" startIcon={<ViewColumnIcon fontSize="small" />} sx={toolbarActionButtonSx}>
              {tr("common.ui.toolbar.columns", "Columns")}
            </Button>
          )
        ) : null}

        {showSortButton ? (
          sortOptions && sortRules && onSortRulesChange ? (
            <DataToolbarSortMenu onApply={onSortRulesChange} options={sortOptions} value={sortRules} />
          ) : (
            <Button size="small" startIcon={<SortIcon fontSize="small" />} sx={toolbarActionButtonSx}>
              {tr("common.ui.toolbar.sort", "Sort")}
            </Button>
          )
        ) : null}

        {showFilterButton ? (
          filterFields && filterRules && onFilterRulesChange ? (
            <DataToolbarFilterMenu fields={filterFields} onApply={onFilterRulesChange} value={filterRules} />
          ) : (
            <Button size="small" startIcon={<FilterListIcon fontSize="small" />} sx={toolbarActionButtonSx}>
              {tr("common.ui.toolbar.filter", "Filter")}
            </Button>
          )
        ) : null}

        {canToggleViewMode ? (
          <ToggleButtonGroup
            exclusive
            onChange={(_, nextMode: ClassesViewMode | null) => {
              if (nextMode && onViewModeChange) {
                onViewModeChange(nextMode);
              }
            }}
            size="small"
            sx={{
              "& .MuiToggleButton-root": {
                border: 1,
                borderColor: "divider",
                color: "text.secondary",
                px: 1,
                py: 0.25,
              },
              "& .Mui-selected": {
                bgcolor: "action.selected",
                color: "primary.main",
              },
            }}
            value={viewMode}
          >
            <ToggleButton value="cards">
              <WindowIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="list">
              <ViewListIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        ) : null}
      </Box>
    </Box>
  );
}
