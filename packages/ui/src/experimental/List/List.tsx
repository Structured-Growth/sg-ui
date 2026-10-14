"use client";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Button, type ButtonProps } from "../Button/Button";
import { Typography } from "../Typography/Typography";
import styles from "./List.module.css";

export interface ListProps extends HTMLAttributes<HTMLUListElement> {}
/** Presentation lists retain native list semantics; selection belongs to their controls. */
export const List = forwardRef<HTMLUListElement, ListProps>(function List({ className, ...props }, ref) {
  return <ul {...props} ref={ref} className={[styles.root, className].filter(Boolean).join(" ")} data-sgui-part="list" />;
});
export interface ListItemProps extends HTMLAttributes<HTMLLIElement> {}
export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(function ListItem({ className, ...props }, ref) {
  return <li {...props} ref={ref} className={[styles.item, className].filter(Boolean).join(" ")} data-sgui-part="list-item" />;
});
export interface ListItemButtonProps extends Omit<ButtonProps, "variant" | "tone"> {
  /** Selected styling and pressed state. When omitted, native aria-pressed is preserved. */
  selected?: boolean;
}
export const ListItemButton = forwardRef<HTMLButtonElement, ListItemButtonProps>(function ListItemButton({ selected, className, ...props }, ref) {
  return <Button {...props} ref={ref} variant="text" tone="neutral" aria-pressed={selected ?? props["aria-pressed"]} className={[styles.action, className].filter(Boolean).join(" ")} />;
});
export interface ListItemTextProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  primary: ReactNode;
  secondary?: ReactNode;
}
export const ListItemText = forwardRef<HTMLSpanElement, ListItemTextProps>(function ListItemText({ primary, secondary, className, ...props }, ref) {
  return <span {...props} ref={ref} className={[styles.text, className].filter(Boolean).join(" ")} data-sgui-part="list-item-text"><Typography as="span" variant="body2">{primary}</Typography>{secondary != null && <Typography as="span" variant="caption" tone="muted">{secondary}</Typography>}</span>;
});
export interface ListItemIconProps extends HTMLAttributes<HTMLSpanElement> {}
/** Decorative only: put the accessible label on the adjacent text/control. */
export const ListItemIcon = forwardRef<HTMLSpanElement, ListItemIconProps>(function ListItemIcon({ className, ...props }, ref) {
  return <span {...props} ref={ref} aria-hidden="true" className={[styles.icon, className].filter(Boolean).join(" ")} data-sgui-part="list-item-icon" />;
});
