import { useRef, useState } from "react";
import type { ReactNode } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatIndentDecreaseIcon from "@mui/icons-material/FormatIndentDecrease";
import FormatIndentIncreaseIcon from "@mui/icons-material/FormatIndentIncrease";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppButton } from "../AppButton";

export type AlignOption = "left" | "center" | "right" | "justify" | "start" | "end";

type AlignMenuAction = {
  id: string;
  label: string;
  icon: ReactNode;
  shortcut?: string;
  onClick?: () => void;
};

export type TextAlignMenuControlProps = {
  value?: AlignOption;
  disabled?: boolean;
  onChange?: (next: AlignOption) => void;
  onOutdent?: () => void;
  onIndent?: () => void;
};

const ALIGN_META: Record<AlignOption, { label: string; icon: ReactNode; shortcut?: string }> = {
  left: { label: "Left Align", icon: <FormatAlignLeftIcon fontSize="small" />, shortcut: "⌘+Shift+L" },
  center: { label: "Center Align", icon: <FormatAlignCenterIcon fontSize="small" />, shortcut: "⌘+Shift+E" },
  right: { label: "Right Align", icon: <FormatAlignRightIcon fontSize="small" />, shortcut: "⌘+Shift+R" },
  justify: { label: "Justify Align", icon: <FormatAlignJustifyIcon fontSize="small" />, shortcut: "⌘+Shift+J" },
  start: { label: "Start Align", icon: <FormatAlignLeftIcon fontSize="small" /> },
  end: { label: "End Align", icon: <FormatAlignRightIcon fontSize="small" /> },
};

export function TextAlignMenuControl({
  value = "left",
  disabled = false,
  onChange,
  onOutdent,
  onIndent,
}: TextAlignMenuControlProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);

  const openMenu = () => {
    setAnchorEl(triggerRef.current);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const actions: AlignMenuAction[] = [
    { id: "left", ...ALIGN_META.left, onClick: () => onChange?.("left") },
    { id: "center", ...ALIGN_META.center, onClick: () => onChange?.("center") },
    { id: "right", ...ALIGN_META.right, onClick: () => onChange?.("right") },
    { id: "justify", ...ALIGN_META.justify, onClick: () => onChange?.("justify") },
    { id: "start", ...ALIGN_META.start, onClick: () => onChange?.("start") },
    { id: "end", ...ALIGN_META.end, onClick: () => onChange?.("end") },
    { id: "outdent", label: "Outdent", icon: <FormatIndentDecreaseIcon fontSize="small" />, onClick: onOutdent, shortcut: "⌘+[" },
    { id: "indent", label: "Indent", icon: <FormatIndentIncreaseIcon fontSize="small" />, onClick: onIndent, shortcut: "⌘+]" },
  ];

  const triggerMeta = ALIGN_META[value];

  return (
    <>
      <AppButton
        aria-label={triggerMeta.label}
        tone="neutral"
        disabled={disabled}
        onPress={openMenu}
        ref={triggerRef}
        aria-haspopup="menu"
        aria-expanded={Boolean(anchorEl)}
        density="compact"
        startIcon={triggerMeta.icon}
        style={{ minHeight: 30, minWidth: 0, padding: "2px 4px" }}
        variant="text"
      >
        <ArrowDropDownIcon fontSize="small" />
      </AppButton>
      <Menu anchorEl={anchorEl} onClose={closeMenu} open={Boolean(anchorEl)} slotProps={{ list: { dense: true } }}>
        {actions.map((action, index) => (
          <Box key={action.id}>
            {index === 6 ? <Box sx={{ borderTop: 1, borderColor: "divider", my: 0.5 }} /> : null}
            <MenuItem
              onClick={() => {
                action.onClick?.();
                closeMenu();
              }}
              sx={{ minWidth: 320 }}
            >
              <Stack alignItems="center" direction="row" spacing={1.5} sx={{ width: "100%" }}>
                <Box sx={{ alignItems: "center", color: "text.secondary", display: "flex", justifyContent: "center", minWidth: 24 }}>
                  {action.icon}
                </Box>
                <Typography sx={{ flex: 1 }} variant="body2">
                  {action.label}
                </Typography>
                {action.shortcut ? (
                  <Typography color="text.secondary" variant="body2">
                    {action.shortcut}
                  </Typography>
                ) : null}
              </Stack>
            </MenuItem>
          </Box>
        ))}
      </Menu>
    </>
  );
}
