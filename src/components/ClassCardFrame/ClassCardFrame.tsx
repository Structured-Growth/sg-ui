import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import type { SxProps, Theme } from "@mui/material/styles";

export const STANDARD_CLASS_CARD_WIDTH = 420;
export const STANDARD_CLASS_CARD_MIN_WIDTH = 360;

type ClassCardFrameProps = {
  header: ReactNode;
  body: ReactNode;
  footer?: ReactNode;
  width?: number;
  headerSx?: SxProps<Theme>;
  bodySx?: SxProps<Theme>;
  footerSx?: SxProps<Theme>;
};

export function ClassCardFrame({
  header,
  body,
  footer,
  width = STANDARD_CLASS_CARD_WIDTH,
  headerSx,
  bodySx,
  footerSx,
}: ClassCardFrameProps) {
  return (
    <Card sx={{ border: 1, borderColor: "divider", borderRadius: 1, maxWidth: width, width: "100%" }}>
      <CardContent sx={[{ bgcolor: "grey.100", px: 2, py: 2 }, ...(Array.isArray(headerSx) ? headerSx : [headerSx])]}>
        {header}
      </CardContent>

      <CardContent sx={[{ px: 2, py: 2 }, ...(Array.isArray(bodySx) ? bodySx : [bodySx])]}>{body}</CardContent>

      {footer ? <Box sx={[{ bgcolor: "grey.100", px: 1.25, py: 1 }, ...(Array.isArray(footerSx) ? footerSx : [footerSx])]}>{footer}</Box> : null}
    </Card>
  );
}
