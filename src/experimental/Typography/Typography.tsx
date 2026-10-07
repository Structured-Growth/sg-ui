import { createElement, forwardRef, type HTMLAttributes } from "react";
import styles from "./Typography.module.css";
export type TypographyVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body1" | "body2" | "bodyAlt2" | "subtitle1" | "subtitle2" | "caption" | "overline" | "button" | "code";
export type TextElement = "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "label" | "code" | "strong" | "em";
export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  /** Visual role; heading semantics are selected separately with as. */
  variant?: TypographyVariant;
  as?: TextElement;
  tone?: "default" | "muted" | "primary" | "danger";
  noWrap?: boolean;
}
export const Typography = forwardRef<HTMLElement, TypographyProps>(function Typography({ variant = "body1", as = "p", tone = "default", noWrap, className, ...props }, ref) {
  return createElement(as, { ...props, ref, className: [styles.root, className].filter(Boolean).join(" "),
    "data-variant": variant, "data-tone": tone, "data-no-wrap": noWrap || undefined });
});
