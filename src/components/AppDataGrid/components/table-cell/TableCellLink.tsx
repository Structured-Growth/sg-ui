import Link from "../../../../adapters/Link";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { CellFallback } from "./CellFallback";

type TableCellLinkProps = {
  href: string;
  label?: string;
  abbr?: string;
  fallbackText?: string;
};

export function TableCellLink({ href, label, abbr, fallbackText }: TableCellLinkProps) {
  const hasLabel = Boolean(label);

  return (
    <Box sx={{ alignItems: "center", display: "flex", gap: 1.25, height: "100%", minHeight: 0 }}>
      {abbr ? (
        <Avatar sx={{ bgcolor: "grey.400", fontSize: 12, height: 28, width: 28 }}>
          {abbr}
        </Avatar>
      ) : null}
      <Link href={href} style={{ alignItems: "center", color: "inherit", display: "inline-flex", minHeight: 0, textDecoration: "none" }}>
        {hasLabel ? (
          <Typography sx={{ textDecoration: "underline", verticalAlign: "middle" }} variant="bodyAlt2">
            {label}
          </Typography>
        ) : (
          <Typography color="text.secondary" variant="bodyAlt2">
            <CellFallback fallbackText={fallbackText} value={label} />
          </Typography>
        )}
      </Link>
    </Box>
  );
}
