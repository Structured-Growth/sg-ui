"use client";

import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import SortIcon from "@mui/icons-material/Sort";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useTranslation } from "../../../i18n";
import { toLabelKey } from "../../../i18n/labelKey";

export type DataToolbarSortOption = {
  id: string;
  label: string;
};

export type DataToolbarSortDirection = "asc" | "desc";

export type DataToolbarSortRule = {
  field: string;
  direction: DataToolbarSortDirection | "";
};

type DataToolbarSortMenuProps = {
  options: DataToolbarSortOption[];
  value: DataToolbarSortRule[];
  onApply: (nextRules: DataToolbarSortRule[]) => void;
};

const toolbarButtonSx = {
  borderColor: "divider",
  color: "text.secondary",
  pl: 1.25,
  pr: 2.25,
  py: 0.25,
  textTransform: "none",
};

const compactSelectMenuProps = {
  MenuListProps: {
    dense: true,
  },
  PaperProps: {
    sx: {
      minWidth: 180,
    },
  },
};

const compactSelectMenuItemSx = {
  fontSize: 13,
  minHeight: 30,
  px: 1.25,
};

const createEmptyRule = (): DataToolbarSortRule => ({
  field: "",
  direction: "",
});

export function DataToolbarSortMenu({ options, value, onApply }: DataToolbarSortMenuProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [draftRules, setDraftRules] = useState<DataToolbarSortRule[]>(value.length ? value : [createEmptyRule()]);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const { t, useNamespace } = useTranslation();
  useNamespace("common.ui");
  const tr = (key: string, defaultMessage: string) => t(key, { defaultMessage, namespace: "common.ui" });
  const trLabel = (label: string) => t(toLabelKey("common.ui.label", label), { defaultMessage: label, namespace: "common.ui" });

  const isOpen = Boolean(anchorEl);
  const usedFields = useMemo(() => draftRules.map((rule) => rule.field).filter(Boolean), [draftRules]);
  const hasAvailableFieldForNewRule = useMemo(
    () => options.some((option) => !usedFields.includes(option.id)),
    [options, usedFields],
  );
  const orderOptions: Array<{ id: DataToolbarSortDirection; label: string }> = [
    { id: "asc", label: tr("common.ui.sort.order.ascending", "Ascending") },
    { id: "desc", label: tr("common.ui.sort.order.descending", "Descending") },
  ];

  const getRowOptions = (rowIndex: number) =>
    options.filter((option) => {
      const currentField = draftRules[rowIndex]?.field;
      return option.id === currentField || !usedFields.includes(option.id);
    });

  const addRule = () => {
    if (!options.length) {
      return;
    }

    const nextField = options.find((option) => !usedFields.includes(option.id))?.id;
    if (!nextField) {
      return;
    }

    setDraftRules((prev) => [...prev, { direction: "asc", field: nextField }]);
  };

  const removeRule = (index: number) => {
    setDraftRules((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  };

  const updateField = (index: number, event: SelectChangeEvent<string>) => {
    const nextField = event.target.value;
    setDraftRules((prev) =>
      prev.map((rule, currentIndex) =>
        currentIndex === index
          ? {
              ...rule,
              field: nextField,
            }
          : rule,
      ),
    );
  };

  const updateDirection = (index: number, event: SelectChangeEvent<string>) => {
    const nextDirection = event.target.value as DataToolbarSortDirection;
    setDraftRules((prev) =>
      prev.map((rule, currentIndex) =>
        currentIndex === index
          ? {
              ...rule,
              direction: nextDirection,
            }
          : rule,
      ),
    );
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const moveRule = (sourceIndex: number, targetIndex: number) => {
    if (sourceIndex === targetIndex || sourceIndex < 0 || targetIndex < 0) {
      return;
    }

    setDraftRules((currentRules) => {
      if (sourceIndex >= currentRules.length || targetIndex >= currentRules.length) {
        return currentRules;
      }

      const nextRules = [...currentRules];
      const [movedRule] = nextRules.splice(sourceIndex, 1);
      nextRules.splice(targetIndex, 0, movedRule);
      return nextRules;
    });
  };

  return (
    <>
      <Badge
        badgeContent={value.length > 0 ? value.length : 0}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        color="primary"
        overlap="rectangular"
        sx={{
          "& .MuiBadge-badge": {
            fontSize: 12,
            fontWeight: 700,
            minWidth: 22,
            right: 6,
            top: 6,
          },
        }}
      >
        <Button
          onClick={(event) => {
            setDraftRules(value.length ? value : [createEmptyRule()]);
            setAnchorEl(event.currentTarget);
          }}
          size="small"
          startIcon={<SortIcon fontSize="small" />}
          sx={toolbarButtonSx}
          variant="outlined"
        >
          {tr("common.ui.toolbar.sort", "Sort")}
        </Button>
      </Badge>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        disableScrollLock
        onClose={closeMenu}
        open={isOpen}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
      >
        <Box sx={{ minWidth: 660, p: 2 }}>
          <Stack spacing={1.5}>
            <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: "24px 1fr 1fr 32px" }}>
              <Box />
              <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{tr("common.ui.sort.column", "Column")}</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{tr("common.ui.sort.order", "Order")}</Typography>
              <Box />
            </Box>

            {draftRules.map((rule, index) => (
              <Box
                key={`${rule.field}-${index}`}
                onDragOver={(event) => {
                  if (draggingIndex === null || draggingIndex === index) {
                    return;
                  }

                  event.preventDefault();
                  setDropIndex((currentDropIndex) => (currentDropIndex === index ? currentDropIndex : index));
                }}
                onDrop={(event) => {
                  if (draggingIndex === null || draggingIndex === index) {
                    return;
                  }

                  event.preventDefault();
                  moveRule(draggingIndex, index);
                  setDraggingIndex(null);
                  setDropIndex(null);
                }}
                sx={{
                  alignItems: "flex-end",
                  display: "grid",
                  gap: 1.5,
                  gridTemplateColumns: "24px 1fr 1fr 32px",
                  ...(dropIndex === index
                    ? {
                        borderTop: 2,
                        borderTopColor: "primary.main",
                        pt: 0.5,
                      }
                    : {}),
                }}
              >
                <Box
                  draggable={draftRules.length > 1}
                  onDragEnd={() => {
                    setDraggingIndex(null);
                    setDropIndex(null);
                  }}
                  onDragStart={(event) => {
                    setDraggingIndex(index);
                    event.dataTransfer.setData("text/plain", String(index));
                    event.dataTransfer.effectAllowed = "move";
                  }}
                  sx={{
                    alignItems: "center",
                    color: draftRules.length > 1 ? "text.disabled" : "action.disabled",
                    cursor: draftRules.length > 1 ? "grab" : "default",
                    display: "inline-flex",
                    minHeight: 32,
                  }}
                >
                  <DragIndicatorIcon fontSize="small" />
                </Box>

                <Box>
                  <Select
                    MenuProps={compactSelectMenuProps}
                    fullWidth
                    onChange={(event) => updateField(index, event)}
                    size="small"
                    value={rule.field}
                    variant="standard"
                  >
                    <MenuItem sx={compactSelectMenuItemSx} value="">
                      <em>{tr("common.ui.sort.selectColumn", "Select column")}</em>
                    </MenuItem>
                    {getRowOptions(index).map((option) => (
                      <MenuItem key={option.id} sx={compactSelectMenuItemSx} value={option.id}>
                        {trLabel(option.label)}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                <Box>
                  <Select
                    MenuProps={compactSelectMenuProps}
                    displayEmpty
                    fullWidth
                    onChange={(event) => updateDirection(index, event)}
                    size="small"
                    value={rule.direction}
                    variant="standard"
                  >
                    <MenuItem sx={compactSelectMenuItemSx} value="">
                      <em>{tr("common.ui.sort.selectOrder", "Select order")}</em>
                    </MenuItem>
                    {orderOptions.map((option) => (
                      <MenuItem key={option.id} sx={compactSelectMenuItemSx} value={option.id}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                <Box sx={{ alignItems: "center", display: "grid", minHeight: 32, width: 32 }}>
                  {draftRules.length > 1 ? (
                    <IconButton
                      onClick={() => {
                        removeRule(index);
                      }}
                      size="small"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  ) : (
                    <Box sx={{ height: 32, width: 32 }} />
                  )}
                </Box>
              </Box>
            ))}

            <Box sx={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
              <IconButton
                disabled={!hasAvailableFieldForNewRule}
                onClick={addRule}
                size="small"
                sx={{
                  border: 1,
                  borderColor: hasAvailableFieldForNewRule ? "primary.main" : "action.disabled",
                  borderRadius: 1,
                  color: hasAvailableFieldForNewRule ? "primary.main" : "action.disabled",
                  p: 0.5,
                  "&.Mui-disabled": {
                    borderColor: "action.disabled",
                    color: "action.disabled",
                  },
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>

              <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                <Button
                  onClick={() => {
                    setDraftRules([createEmptyRule()]);
                  }}
                  size="small"
                  variant="outlined"
                >
                  {tr("common.ui.common.reset", "Reset")}
                </Button>
                <Button
                  onClick={() => {
                    onApply(draftRules.filter((rule) => Boolean(rule.field && rule.direction)));
                    closeMenu();
                  }}
                  size="small"
                  variant="contained"
                >
                  {tr("common.ui.common.apply", "Apply")}
                </Button>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Popover>
    </>
  );
}
