import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type DocumentEditorLayoutProps = {
  title: string;
  titleNode?: ReactNode;
  headerRight?: ReactNode;
  menuBar?: ReactNode;
  toolbar?: ReactNode;
  children: ReactNode;
};

export function DocumentEditorLayout({ title, titleNode, headerRight, menuBar, toolbar, children }: DocumentEditorLayoutProps) {
  return (
    <Box sx={{ display: "flex", flex: 1, flexDirection: "column", minHeight: 0 }}>
      <Box sx={{ borderBottom: menuBar ? 0 : 1, borderColor: "divider", px: 2, py: 1.5 }}>
        <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2}>
          {titleNode ?? (
            <Typography sx={{ fontSize: 18, fontWeight: 500 }} variant="body1">
              {title}
            </Typography>
          )}
          {headerRight}
        </Stack>
      </Box>

      {menuBar ? <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2, py: 0 }}>{menuBar}</Box> : null}

      {toolbar ? <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2, py: 1.25 }}>{toolbar}</Box> : null}

      <Box sx={{ flex: 1, minHeight: 0 }}>
        {children}
      </Box>
    </Box>
  );
}
