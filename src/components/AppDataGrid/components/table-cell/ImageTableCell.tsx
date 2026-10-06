import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";

type ImageTableCellProps = {
  src?: string | null;
  alt?: string;
};

export function ImageTableCell({ src, alt = "Row image" }: ImageTableCellProps) {
  return (
    <Box sx={{ alignItems: "center", display: "flex", justifyContent: "center", width: "100%" }}>
      {src ? <Avatar alt={alt} src={src} sx={{ borderRadius: 1, height: 32, width: 32 }} /> : <HorizontalRuleIcon color="disabled" />}
    </Box>
  );
}
