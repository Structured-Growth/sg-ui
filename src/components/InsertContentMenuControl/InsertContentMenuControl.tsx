import { useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import ImageIcon from "@mui/icons-material/Image";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppButton } from "../AppButton";

type InsertAction = {
  id: string;
  label: string;
  icon: ReactNode;
  onClick?: () => void;
};

export type InsertContentMenuControlProps = {
  disabled?: boolean;
  onInsertImage?: () => void;
  onInsertHorizontalRule?: () => void;
  onInsertColumnsLayout?: () => void;
};

export function InsertContentMenuControl({
  disabled = false,
  onInsertImage,
  onInsertHorizontalRule,
  onInsertColumnsLayout,
}: InsertContentMenuControlProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const openMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const actions: InsertAction[] = [
    {
      id: "image",
      icon: <ImageIcon fontSize="small" />,
      label: "Image",
      onClick: onInsertImage,
    },
    {
      id: "horizontalRule",
      icon: <HorizontalRuleIcon fontSize="small" />,
      label: "Horizontal Rule",
      onClick: onInsertHorizontalRule,
    },
    {
      id: "columnsLayout",
      icon: <ViewWeekIcon fontSize="small" />,
      label: "Columns Layout",
      onClick: onInsertColumnsLayout,
    },
  ];

  return (
    <>
      <AppButton
        color="inherit"
        disabled={disabled}
        onClick={openMenu}
        size="small"
        startIcon={<AddIcon fontSize="small" />}
        sx={{ minHeight: 30, minWidth: 0, px: 0.5, py: 0.25 }}
        variant="text"
      >
        Insert
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
            sx={{ minWidth: 260 }}
          >
            <Stack alignItems="center" direction="row" spacing={1.5} sx={{ width: "100%" }}>
              <Box sx={{ alignItems: "center", color: "text.secondary", display: "flex", justifyContent: "center", minWidth: 24 }}>
                {action.icon}
              </Box>
              <Typography sx={{ flex: 1 }} variant="body2">
                {action.label}
              </Typography>
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
