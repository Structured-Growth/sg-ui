"use client";

import { type MouseEvent, type ReactNode, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SortIcon from "@mui/icons-material/Sort";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "../../../../i18n";
import type { AppDataGridSortDirection } from "../../types";

type TableHeaderSortMenuProps = {
  label: ReactNode;
  sortDirection?: AppDataGridSortDirection;
  onSortSelect: (direction: AppDataGridSortDirection) => void;
};

export function TableHeaderSortMenu({ label, sortDirection = "", onSortSelect }: TableHeaderSortMenuProps) {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const { t, useNamespace } = useTranslation();
  useNamespace("common.ui");
  const tr = (key: string, defaultMessage: string) => t(key, { defaultMessage, namespace: "common.ui" });
  const isOpen = Boolean(menuAnchor);

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    if (isOpen) {
      setMenuAnchor(null);
      return;
    }
    setMenuAnchor(event.currentTarget);
  };

  return (
    <Box
      className={`app-grid-sortable-header${isOpen ? " app-grid-sortable-header-open" : ""}`}
      sx={{
        alignItems: "center",
        display: "flex",
        minHeight: "100%",
        width: "100%",
      }}
    >
      <Box sx={{ alignItems: "center", display: "inline-flex", flex: 1, gap: 0.5, minWidth: 0, overflow: "hidden" }}>
        <Box sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</Box>
        <Box sx={{ alignItems: "center", display: "inline-flex", justifyContent: "center", width: 16 }}>
          {sortDirection === "asc" || sortDirection === "desc" ? <SortIcon color="action" fontSize="small" /> : null}
        </Box>
      </Box>
      <IconButton
        className="app-grid-sort-trigger"
        onClick={handleOpenMenu}
        size="small"
        sx={{
          flexShrink: 0,
          ml: 0.5,
          minHeight: 20,
          minWidth: 20,
          p: 0.25,
          width: 20,
          ...(isOpen
            ? {
                opacity: 1,
                visibility: "visible",
              }
            : null),
          ...(isOpen
            ? {
                bgcolor: "action.selected",
                color: "text.primary",
              }
            : null),
        }}
      >
        <ArrowDropDownIcon fontSize="small" />
      </IconButton>

      <Menu
        PaperProps={{
          sx: {
            minWidth: 172,
          },
        }}
        MenuListProps={{
          dense: true,
        }}
        anchorEl={menuAnchor}
        onClose={handleCloseMenu}
        open={isOpen}
      >
        <MenuItem
          onClick={() => {
            onSortSelect("asc");
            handleCloseMenu();
          }}
          sx={{ fontSize: 13, minHeight: 30, px: 1.25 }}
        >
          {tr("common.ui.headerSort.ascending", "Sort Ascending")}
        </MenuItem>
        <MenuItem
          onClick={() => {
            onSortSelect("desc");
            handleCloseMenu();
          }}
          sx={{ fontSize: 13, minHeight: 30, px: 1.25 }}
        >
          {tr("common.ui.headerSort.descending", "Sort Descending")}
        </MenuItem>
        {sortDirection === "asc" || sortDirection === "desc" ? (
          <MenuItem
            onClick={() => {
              onSortSelect("");
              handleCloseMenu();
            }}
            sx={{ fontSize: 13, minHeight: 30, px: 1.25 }}
          >
            {tr("common.ui.headerSort.clear", "Clear Sort")}
          </MenuItem>
        ) : null}
      </Menu>
    </Box>
  );
}
