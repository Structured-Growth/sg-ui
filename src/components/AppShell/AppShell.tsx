import Box from "@mui/material/Box";

type AppShellProps = {
  navigation: React.ReactNode;
  children: React.ReactNode;
};

export function AppShell({ navigation, children }: AppShellProps) {
  return (
    <Box sx={{ bgcolor: "background.default", display: "flex", height: "100vh", overflow: "hidden" }}>
      {navigation}
      <Box component="main" sx={{ display: "flex", flex: 1, flexDirection: "column", minHeight: 0, minWidth: 0, overflow: "hidden" }}>
        {children}
      </Box>
    </Box>
  );
}
