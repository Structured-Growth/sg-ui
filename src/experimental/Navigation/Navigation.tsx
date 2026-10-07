"use client";
import { forwardRef, type HTMLAttributes } from "react";
import { Link, type LinkProps } from "../Link/Link";
import styles from "./Navigation.module.css";

export interface NavigationProps extends Omit<HTMLAttributes<HTMLElement>, "aria-label"> {
  /** Distinguishes this landmark from other navigation on the page. */
  label: string;
}
/** Compose List/ListItem and NavigationItem; navigation never uses menu roles. */
export const Navigation = forwardRef<HTMLElement, NavigationProps>(function Navigation({ label, className, ...props }, ref) {
  return <nav {...props} ref={ref} aria-label={label} className={[styles.root, className].filter(Boolean).join(" ")} data-sgui-part="navigation" />;
});
export interface NavigationItemProps extends Omit<LinkProps, "aria-current" | "tone" | "underline"> {
  /** The host decides the current route; matching policy stays outside the library. */
  current?: boolean;
}
export const NavigationItem = forwardRef<HTMLAnchorElement, NavigationItemProps>(function NavigationItem({ current = false, className, ...props }, ref) {
  return <Link {...props} ref={ref} tone="inherit" underline="none" aria-current={current ? "page" : undefined} className={[styles.item, className].filter(Boolean).join(" ")} data-sgui-part="navigation-item" />;
});
