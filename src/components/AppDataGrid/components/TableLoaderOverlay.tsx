import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export function TableLoaderOverlay() {
  return (
    <Box sx={{ alignItems: "center", display: "grid", height: "100%", placeItems: "center" }}>
      <CircularProgress size={26} />
    </Box>
  );
}
