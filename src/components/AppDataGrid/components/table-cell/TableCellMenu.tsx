"use client";

import { type MouseEvent, useState } from "react";
import Link from "../../../../adapters/Link";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import type { GridValidRowModel } from "@mui/x-data-grid";
import type { AppDataGridMenuAction } from "../../types";

type TableCellMenuProps<RowModel extends GridValidRowModel> = {
  row: RowModel;
  actions: AppDataGridMenuAction<RowModel>[];
};

export function TableCellMenu<RowModel extends GridValidRowModel>({ row, actions }: TableCellMenuProps<RowModel>) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton aria-label="Row actions" onClick={handleOpen} size="small">
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        MenuListProps={{ dense: true }}
        onClose={handleClose}
        open={open}
        PaperProps={{ sx: { minWidth: 156 } }}
      >
        {actions.map((action) =>
          action.href ? (
            <MenuItem
              component={Link}
              href={action.href}
              key={action.id}
              rel={action.rel}
              onClick={() => {
                action.onClick?.(row);
                handleClose();
              }}
              target={action.target}
              sx={{ color: "inherit", fontSize: 13, minHeight: 30, px: 1.25, textDecoration: "none" }}
            >
              {action.label}
            </MenuItem>
          ) : (
            <MenuItem
              key={action.id}
              onClick={() => {
                action.onClick?.(row);
                handleClose();
              }}
              sx={{ fontSize: 13, minHeight: 30, px: 1.25 }}
            >
              {action.label}
            </MenuItem>
          ),
        )}
      </Menu>
    </>
  );
}
