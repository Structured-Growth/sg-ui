"use client";

import { useCallback, useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTranslation } from "../../../i18n";
import { toLabelKey } from "../../../i18n/labelKey";

export type DataToolbarColumnOption = {
  id: string;
  label: string;
  locked?: boolean;
  visible: boolean;
};

type DataToolbarColumnsMenuProps = {
  options: DataToolbarColumnOption[];
  onChange: (nextOptions: DataToolbarColumnOption[]) => void;
};

const toolbarButtonSx = {
  borderColor: "divider",
  color: "text.secondary",
  px: 1.25,
  py: 0.25,
  textTransform: "none",
};

const compactOptionRowSx = {
  justifyContent: "flex-start",
  minHeight: 30,
  px: 0.75,
  textTransform: "none",
};

export function DataToolbarColumnsMenu({ options, onChange }: DataToolbarColumnsMenuProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [query, setQuery] = useState("");
  const { t, useNamespace } = useTranslation();
  useNamespace("common.ui");
  const tr = (key: string, defaultMessage: string) => t(key, { defaultMessage, namespace: "common.ui" });
  const trLabel = useCallback(
    (label: string) => t(toLabelKey("common.ui.label", label), { defaultMessage: label, namespace: "common.ui" }),
    [t],
  );

  const isOpen = Boolean(anchorEl);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return options;
    }

    return options.filter((option) => trLabel(option.label).toLowerCase().includes(normalizedQuery));
  }, [options, query, trLabel]);

  const handleToggle = (id: string) => {
    onChange(
      options.map((option) =>
        option.id === id
          ? {
              ...option,
              visible: option.locked ? true : !option.visible,
            }
          : option,
      ),
    );
  };

  const handleReset = () => {
    onChange(
      options.map((option) => ({
        ...option,
        visible: true,
      })),
    );
  };

  return (
    <>
      <Button
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
        }}
        size="small"
        startIcon={<ViewColumnIcon fontSize="small" />}
        sx={toolbarButtonSx}
        variant="outlined"
      >
        {tr("common.ui.toolbar.columns", "Columns")}
      </Button>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        disableScrollLock
        onClose={() => {
          setAnchorEl(null);
          setQuery("");
        }}
        open={isOpen}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
      >
        <Box sx={{ width: 320 }}>
          <Box sx={{ p: 1.5 }}>
            <Paper sx={{ alignItems: "center", display: "flex", px: 1, py: 0.25 }} variant="outlined">
              <SearchIcon color="action" fontSize="small" />
              <InputBase
                onChange={(event) => {
                  setQuery(event.target.value);
                }}
                placeholder={tr("common.ui.toolbar.search", "Search")}
                sx={{ fontSize: 13, ml: 0.75, width: "100%" }}
                value={query}
              />
            </Paper>
          </Box>

          <Divider />

          <Stack spacing={0.25} sx={{ maxHeight: 280, overflowY: "auto", p: 1 }}>
            {filteredOptions.map((option) => (
              <Button
                disabled={option.locked}
                key={option.id}
                onClick={() => {
                  handleToggle(option.id);
                }}
                sx={compactOptionRowSx}
              >
                <Checkbox checked={option.visible} disabled={option.locked} size="small" sx={{ mr: 0.75, p: 0.25 }} />
                <Typography color="text.primary" sx={{ fontSize: 13 }}>
                  {trLabel(option.label)}
                </Typography>
              </Button>
            ))}
            {filteredOptions.length === 0 ? (
              <Typography color="text.secondary" sx={{ fontSize: 13, px: 1.25, py: 0.75 }}>
                {tr("common.ui.columns.noMatching", "No matching columns")}
              </Typography>
            ) : null}
          </Stack>

          <Divider />

          <Box sx={{ p: 1 }}>
            <Button fullWidth onClick={handleReset} size="small" variant="outlined">
              {tr("common.ui.common.reset", "Reset")}
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
}
