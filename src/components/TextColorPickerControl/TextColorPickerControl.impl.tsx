import { useMemo, useState } from "react";
import type { ChangeEvent, MouseEvent } from "react";
import type { ReactNode } from "react";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

const DEFAULT_COLOR = "#000000";
const HEX_PATTERN = /^#([0-9a-fA-F]{6})$/;

function normalizeHexColor(value: string): string | null {
  const normalized = value.trim();
  return HEX_PATTERN.test(normalized) ? normalized.toLowerCase() : null;
}

type ThemeColorPreset = {
  id: string;
  label: string;
  themePath: string;
  cssVarValue: string;
  resolvedHex: string;
};

function resolveHexFromValue(value: string, presets: ThemeColorPreset[]): string {
  const normalizedHex = normalizeHexColor(value);
  if (normalizedHex) {
    return normalizedHex;
  }
  const matchedPreset = presets.find((preset) => preset.cssVarValue === value);
  if (matchedPreset) {
    return matchedPreset.resolvedHex;
  }
  return DEFAULT_COLOR;
}

export type TextColorPickerControlProps = {
  value?: string;
  onChange?: (nextColor: string) => void;
  triggerIcon?: ReactNode;
  disabled?: boolean;
};

export function TextColorPickerControl({
  value = DEFAULT_COLOR,
  onChange,
  triggerIcon = <FormatColorTextIcon fontSize="small" />,
  disabled = false,
}: TextColorPickerControlProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [draftColor, setDraftColor] = useState(value);

  const themeColorPresets = useMemo<ThemeColorPreset[]>(() => {
    const toPreset = (id: string, label: string, themePath: string, cssVarName: string, resolved: string): ThemeColorPreset | null => {
      const resolvedHex = normalizeHexColor(resolved);
      if (!resolvedHex) {
        return null;
      }
      return {
        id,
        label,
        themePath,
        cssVarValue: `var(${cssVarName}, ${resolvedHex})`,
        resolvedHex,
      };
    };

    return [
      toPreset("text-primary", "Text Primary", "theme.palette.text.primary", "--mui-palette-text-primary", theme.palette.text.primary),
      toPreset("text-secondary", "Text Secondary", "theme.palette.text.secondary", "--mui-palette-text-secondary", theme.palette.text.secondary),
      toPreset("primary-main", "Primary", "theme.palette.primary.main", "--mui-palette-primary-main", theme.palette.primary.main),
      toPreset("primary-light", "Primary Light", "theme.palette.primary.light", "--mui-palette-primary-light", theme.palette.primary.light),
      toPreset("secondary-main", "Secondary", "theme.palette.secondary.main", "--mui-palette-secondary-main", theme.palette.secondary.main),
      toPreset("secondary-light", "Secondary Light", "theme.palette.secondary.light", "--mui-palette-secondary-light", theme.palette.secondary.light),
      toPreset("error-main", "Error", "theme.palette.error.main", "--mui-palette-error-main", theme.palette.error.main),
      toPreset("warning-main", "Warning", "theme.palette.warning.main", "--mui-palette-warning-main", theme.palette.warning.main),
      toPreset("info-main", "Info", "theme.palette.info.main", "--mui-palette-info-main", theme.palette.info.main),
      toPreset("success-main", "Success", "theme.palette.success.main", "--mui-palette-success-main", theme.palette.success.main),
      toPreset("grey-900", "Grey 900", "theme.palette.grey[900]", "--mui-palette-grey-900", theme.palette.grey[900]),
      toPreset("grey-700", "Grey 700", "theme.palette.grey[700]", "--mui-palette-grey-700", theme.palette.grey[700]),
      toPreset("grey-500", "Grey 500", "theme.palette.grey[500]", "--mui-palette-grey-500", theme.palette.grey[500]),
      toPreset("grey-300", "Grey 300", "theme.palette.grey[300]", "--mui-palette-grey-300", theme.palette.grey[300]),
      toPreset("grey-100", "Grey 100", "theme.palette.grey[100]", "--mui-palette-grey-100", theme.palette.grey[100]),
      toPreset("black", "Black", "theme.palette.common.black", "--mui-palette-common-black", theme.palette.common.black),
      toPreset("white", "White", "theme.palette.common.white", "--mui-palette-common-white", theme.palette.common.white),
      toPreset("background-paper", "Background Paper", "theme.palette.background.paper", "--mui-palette-background-paper", theme.palette.background.paper),
    ].filter((preset): preset is ThemeColorPreset => preset !== null);
  }, [theme]);
  const currentColor = useMemo(() => resolveHexFromValue(value, themeColorPresets), [value, themeColorPresets]);
  const popoverOpen = Boolean(anchorEl);

  const commitColor = (nextColor: string) => {
    const normalizedHex = normalizeHexColor(nextColor);
    if (!normalizedHex) {
      return;
    }
    setDraftColor(normalizedHex);
    onChange?.(normalizedHex);
  };

  const selectThemePreset = (preset: ThemeColorPreset) => {
    setDraftColor(preset.themePath);
    onChange?.(preset.cssVarValue);
  };

  const openPopover = (event: MouseEvent<HTMLElement>) => {
    const matchedPreset = themeColorPresets.find((preset) => preset.cssVarValue === value);
    setDraftColor(matchedPreset ? matchedPreset.themePath : currentColor);
    setAnchorEl(event.currentTarget);
  };

  const closePopover = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton disabled={disabled} onClick={openPopover} size="small" sx={{ borderRadius: 1, color: "text.secondary", p: 0.5 }}>
        {triggerIcon}
        <ArrowDropDownIcon fontSize="small" />
      </IconButton>

      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        onClose={closePopover}
        open={popoverOpen}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
      >
        <Box sx={{ p: 2, width: 320 }}>
          <Stack alignItems="center" direction="row" spacing={1}>
            <Typography variant="body2">Color</Typography>
            <TextField
              onBlur={() => {
                commitColor(draftColor);
              }}
              onChange={(event) => setDraftColor(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  commitColor(draftColor);
                }
              }}
              size="small"
              value={draftColor}
            />
          </Stack>

          <Box
            sx={{
              columnGap: 1,
              display: "grid",
              gridTemplateColumns: "repeat(9, 1fr)",
              mt: 1.5,
              rowGap: 1,
            }}
          >
            {themeColorPresets.map((preset) => (
              <IconButton
                key={preset.id}
                onClick={() => selectThemePreset(preset)}
                size="small"
                sx={{
                  backgroundColor: preset.resolvedHex,
                  border: 1,
                  borderColor: value === preset.cssVarValue ? "text.primary" : "divider",
                  borderRadius: 1,
                  height: 24,
                  p: 0,
                  width: 24,
                }}
                title={`${preset.label} (${preset.themePath})`}
              />
            ))}
          </Box>

          <Box sx={{ mt: 2 }}>
            <Box
              component="input"
              onChange={(event: ChangeEvent<HTMLInputElement>) => commitColor(event.target.value)}
              sx={{ border: 0, display: "block", height: 40, p: 0, width: "100%" }}
              type="color"
              value={currentColor}
            />
          </Box>
        </Box>
      </Popover>
    </>
  );
}
