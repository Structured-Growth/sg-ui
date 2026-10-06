import type { ReactNode } from "react";
import { Box, Stack, Typography } from "../primitives";

export type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footerContent?: ReactNode;
};

export function AuthShell({
  title,
  subtitle,
  children,
  footerContent,
}: AuthShellProps) {
  return (
    <Box
      sx={{
        alignItems: "center",
        bgcolor: "background.default",
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        p: 2,
      }}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          boxShadow: 2,
          maxWidth: 560,
          p: { xs: 3, md: 4 },
          width: "100%",
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography component="h1" sx={{ fontSize: { xs: 34, md: 42 }, fontWeight: 600, lineHeight: 1.08, mb: 1.25 }}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography color="text.secondary">
              {subtitle}
            </Typography>
          ) : null}
        </Box>

        <Box>{children}</Box>

        {footerContent ? (
          <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
            {footerContent}
          </Stack>
        ) : null}
      </Box>
    </Box>
  );
}
