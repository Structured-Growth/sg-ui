import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type TextTableCellProps = {
  value: unknown;
  fallbackText?: string;
  title?: string;
  truncate?: boolean;
};

export function TextTableCell({ value, fallbackText = "\u2014", title, truncate = false }: TextTableCellProps) {
  const hasValue = value !== null && value !== undefined && value !== "";
  const displayValue = hasValue ? String(value) : fallbackText;

  return (
    <Box sx={{ alignItems: "center", display: "flex", height: "100%", minHeight: 0, width: "100%" }}>
      <Typography
        color={hasValue ? "text.primary" : "text.secondary"}
        title={title}
        variant="bodyAlt2"
        sx={truncate ? { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } : undefined}
      >
        {displayValue}
      </Typography>
    </Box>
  );
}
