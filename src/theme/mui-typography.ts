import type { CSSProperties } from "react";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    bodyAlt2: CSSProperties;
  }

  interface TypographyVariantsOptions {
    bodyAlt2?: CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    bodyAlt2: true;
  }
}
