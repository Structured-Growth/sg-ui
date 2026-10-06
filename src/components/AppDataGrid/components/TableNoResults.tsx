import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export function TableNoResults() {
  return (
    <Box sx={{ alignItems: "center", display: "grid", height: "100%", placeItems: "center" }}>
      <Typography color="text.secondary" variant="body2">
        No results found
      </Typography>
    </Box>
  );
}
