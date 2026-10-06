"use client";
import { forwardRef, type ReactNode } from "react";
import { Button, type ButtonProps } from "../Button/Button";
import styles from "./IconButton.module.css";
export interface IconButtonProps extends Omit<ButtonProps, "children" | "startIcon" | "endIcon" | "aria-label" | "aria-labelledby"> {
  label: string;
  children: ReactNode;
}
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton({ label, children, variant = "text", tone = "neutral", className, ...props }, ref) {
  return <Button {...props} ref={ref} variant={variant} tone={tone} aria-label={label} className={[styles.root, className].filter(Boolean).join(" ")}><span aria-hidden="true" className={styles.icon}>{children}</span></Button>;
});
