import type { ReactNode } from "react";
import Box from "@mui/material/Box";

type CustomTableCellProps = {
  children: ReactNode;
};

export function CustomTableCell({ children }: CustomTableCellProps) {
  return <Box sx={{ alignItems: "center", display: "flex", minHeight: 40 }}>{children}</Box>;
}
