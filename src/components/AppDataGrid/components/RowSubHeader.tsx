import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import type { TypographyProps } from "@mui/material/Typography";

export type RowSubHeaderProps = {
  title: string;
  expanded?: boolean;
  onToggle?: () => void;
  trailingContent?: ReactNode;
  titleVariant?: TypographyProps["variant"];
  onTitleDoubleClick?: () => void;
  titleTooltip?: string;
};

export function RowSubHeader({
  title,
  expanded = true,
  onToggle,
  trailingContent,
  titleVariant = "body2",
  onTitleDoubleClick,
  titleTooltip,
}: RowSubHeaderProps) {
  return (
    <Box sx={{ alignItems: "center", display: "flex", gap: 1, minHeight: 0, width: "100%" }}>
      <IconButton
        aria-label={expanded ? "Collapse section" : "Expand section"}
        onClick={onToggle}
        size="small"
      >
        {expanded ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
      </IconButton>
      <Typography
        onDoubleClick={onTitleDoubleClick}
        sx={onTitleDoubleClick ? { cursor: "text" } : undefined}
        title={titleTooltip}
        variant={titleVariant}
      >
        {title}
      </Typography>
      {trailingContent ? <Box sx={{ ml: "auto" }}>{trailingContent}</Box> : null}
    </Box>
  );
}
