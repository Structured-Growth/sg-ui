import { forwardRef, type CSSProperties } from "react";
import { Box, spacingValue, type BoxProps, type Spacing } from "../Box/Box";
import styles from "./Stack.module.css";
export interface StackProps extends BoxProps {
  direction?: "row" | "column";
  gap?: Spacing;
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
  /** Stack horizontally above 38rem and vertically below it. */
  responsive?: boolean;
}
export const Stack = forwardRef<HTMLElement, StackProps>(function Stack({ direction = "column", gap = 2, align = "stretch", justify = "start", wrap, responsive, className, style, ...props }, ref) {
  return <Box {...props} ref={ref} className={[styles.root, className].filter(Boolean).join(" ")}
    data-direction={direction} data-align={align} data-justify={justify} data-wrap={wrap || undefined}
    data-responsive={responsive || undefined} style={{ gap: spacingValue(gap), ...style } as CSSProperties} />;
});
