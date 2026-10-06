import { useRef, useState } from "react";
import type { ReactNode } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FormatClearIcon from "@mui/icons-material/FormatClear";
import FormatStrikethroughIcon from "@mui/icons-material/FormatStrikethrough";
import HighlightIcon from "@mui/icons-material/Highlight";
import SubscriptIcon from "@mui/icons-material/Subscript";
import SuperscriptIcon from "@mui/icons-material/Superscript";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppButton } from "../AppButton";

type TextStyleActionId =
  | "lowercase"
  | "uppercase"
  | "capitalize"
  | "strikethrough"
  | "subscript"
  | "superscript"
  | "highlight"
  | "clear";

type TextStyleAction = {
  id: TextStyleActionId;
  label: string;
  shortcut?: string;
  icon: ReactNode;
  onClick?: () => void;
};

export type TextStyleMenuControlProps = {
  onLowercase?: () => void;
  onUppercase?: () => void;
  onCapitalize?: () => void;
  onStrikethrough?: () => void;
  onSubscript?: () => void;
  onSuperscript?: () => void;
  onHighlight?: () => void;
  onClearFormatting?: () => void;
  disabled?: boolean;
};

export function TextStyleMenuControl({
  onLowercase,
  onUppercase,
  onCapitalize,
  onStrikethrough,
  onSubscript,
  onSuperscript,
  onHighlight,
  onClearFormatting,
  disabled = false,
}: TextStyleMenuControlProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);

  const openMenu = () => {
    setAnchorEl(triggerRef.current);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const actions: TextStyleAction[] = [
    { id: "lowercase", icon: <Typography variant="body2">abc</Typography>, label: "Lowercase", onClick: onLowercase, shortcut: "^+Shift+1" },
    { id: "uppercase", icon: <Typography variant="body2">ABC</Typography>, label: "Uppercase", onClick: onUppercase, shortcut: "^+Shift+2" },
    { id: "capitalize", icon: <Typography variant="body2">Tt</Typography>, label: "Capitalize", onClick: onCapitalize, shortcut: "^+Shift+3" },
    { id: "strikethrough", icon: <FormatStrikethroughIcon fontSize="small" />, label: "Strikethrough", onClick: onStrikethrough, shortcut: "⌘+Shift+X" },
    { id: "subscript", icon: <SubscriptIcon fontSize="small" />, label: "Subscript", onClick: onSubscript, shortcut: "⌘+," },
    { id: "superscript", icon: <SuperscriptIcon fontSize="small" />, label: "Superscript", onClick: onSuperscript, shortcut: "⌘+." },
    { id: "highlight", icon: <HighlightIcon fontSize="small" />, label: "Highlight", onClick: onHighlight },
    { id: "clear", icon: <FormatClearIcon fontSize="small" />, label: "Clear Formatting", onClick: onClearFormatting, shortcut: "⌘+\\" },
  ];

  return (
    <>
      <AppButton
        aria-label="Text style"
        tone="neutral"
        disabled={disabled}
        onPress={openMenu}
        ref={triggerRef}
        aria-haspopup="menu"
        aria-expanded={Boolean(anchorEl)}
        density="compact"
        style={{ minHeight: 30, minWidth: 0, padding: "2px 4px" }}
        variant="text"
      >
        <Typography variant="body2">Aa</Typography>
        <ArrowDropDownIcon fontSize="small" />
      </AppButton>
      <Menu anchorEl={anchorEl} onClose={closeMenu} open={Boolean(anchorEl)} slotProps={{ list: { dense: true } }}>
        {actions.map((action) => (
          <MenuItem
            key={action.id}
            onClick={() => {
              action.onClick?.();
              closeMenu();
            }}
            sx={{ minWidth: 280 }}
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
        ))}
      </Menu>
    </>
  );
}
