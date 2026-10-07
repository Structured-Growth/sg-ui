import { forwardRef } from "react";
import { Box, type BoxProps } from "../Box/Box";
import styles from "./Surface.module.css";
export interface SurfaceProps extends BoxProps {
  tone?: "default" | "subtle";
  variant?: "flat" | "outlined" | "raised";
}
export const Surface = forwardRef<HTMLElement, SurfaceProps>(function Surface({ tone = "default", variant = "flat", className, ...props }, ref) {
  return <Box {...props} ref={ref} className={[styles.root, className].filter(Boolean).join(" ")} data-tone={tone} data-variant={variant} />;
});
