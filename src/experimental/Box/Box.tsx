import { createElement, forwardRef, type CSSProperties, type HTMLAttributes } from "react";
import styles from "./Box.module.css";
export type Spacing = 0 | 1 | 2 | 3 | 4;
export type BoxElement = "div" | "section" | "article" | "main" | "nav" | "aside" | "header" | "footer" | "span";
export interface BoxProps extends HTMLAttributes<HTMLElement> {
  as?: BoxElement;
  padding?: Spacing;
  /** Center content and bound its readable width; native style can adjust the bound. */
  container?: boolean;
}
export function spacingValue(value: Spacing) { return value === 0 ? "0px" : `var(--sgui-space${value})`; }
export const Box = forwardRef<HTMLElement, BoxProps>(function Box({ as = "div", padding = 0, container, className, style, ...props }, ref) {
  return createElement(as, { ...props, ref, className: [styles.root, className].filter(Boolean).join(" "),
    "data-container": container || undefined, style: { padding: spacingValue(padding), ...style } as CSSProperties });
});
