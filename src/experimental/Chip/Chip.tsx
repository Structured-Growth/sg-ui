import { forwardRef, type AriaAttributes, type CSSProperties, type ReactNode } from "react";
import type { Density } from "../../foundation/ThemeScope";
import styles from "./Chip.module.css";

export interface ChipProps extends AriaAttributes {
  children: ReactNode;
  tone?: "neutral" | "primary";
  variant?: "filled" | "outlined";
  density?: Density;
  id?: string;
  title?: string;
  className?: string;
  style?: CSSProperties;
}

/** A presentation label. Use TagGroup for keyboard navigable, removable tokens. */
export const Chip = forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  { children, tone = "neutral", variant = "filled", density, className, ...props }, ref,
) {
  return <span {...props} ref={ref} data-sgui-part="chip" data-tone={tone}
    data-variant={variant} data-sgui-density={density}
    className={[styles.root, className].filter(Boolean).join(" ")}>{children}</span>;
});
