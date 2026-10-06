"use client";

import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export type DataToolbarSelectionOption = {
  id: string;
  label: string;
};

export type DataToolbarSelectionState = "none" | "some" | "all";

type DataToolbarSelectionMenuProps = {
  options: DataToolbarSelectionOption[];
  selectionState: DataToolbarSelectionState;
  onToggleSelection: () => void;
  onSelectOption: (optionId: string) => void;
};

export function DataToolbarSelectionMenu({
  options,
  selectionState,
  onToggleSelection,
  onSelectOption,
}: DataToolbarSelectionMenuProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <Box sx={{ alignItems: "center", display: "flex", gap: 0.125, pl: 1 }}>
        <Checkbox
          checked={selectionState === "all"}
          indeterminate={selectionState === "some"}
          onChange={onToggleSelection}
          size="small"
          sx={{ p: 0 }}
        />
        <IconButton
          onClick={(event) => {
            setAnchorEl(event.currentTarget);
          }}
          size="small"
          sx={{ p: 0, width: 16, height: 16 }}
        >
          <ArrowDropDownIcon fontSize="small" />
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        open={open}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.id}
            onClick={() => {
              onSelectOption(option.id);
              setAnchorEl(null);
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
