"use client";

import { forwardRef, type AriaAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Button as AriaButton } from "react-aria-components/Button";
import { ProgressBar } from "react-aria-components/ProgressBar";
import { useTranslation } from "../../i18n";
import type { Density } from "../../foundation/ThemeScope";
import styles from "./Button.module.css";

export interface ButtonProps extends AriaAttributes, Pick<ButtonHTMLAttributes<HTMLButtonElement>,
  "id" | "children" | "name" | "type" | "form" | "formAction" | "formEncType" | "formMethod" |
  "formNoValidate" | "formTarget" | "disabled" | "autoFocus" | "className" | "style" | "title" | "tabIndex" | "slot"> {
  value?: string;
  variant?: "filled" | "outlined" | "text";
  tone?: "primary" | "neutral";
  density?: Density;
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  /** One activation callback for pointer, keyboard and touch. No upstream event object. */
  onPress?: () => void;
}

/** Experimental owned contract for the migration proof; links remain separate controls. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "filled", tone = "primary", density, loading = false, disabled,
    children, startIcon, endIcon, className, onPress, type = "button", ...props }, ref,
) {
  const { t } = useTranslation();
  return (
    <AriaButton {...props} ref={ref}
      // Pending reset buttons must suppress the native default as well as the press callback.
      type={loading && type === "reset" ? "button" : type} isDisabled={disabled} isPending={loading}
      onPress={onPress} className={[styles.root, className].filter(Boolean).join(" ")}
      data-variant={variant} data-tone={tone} data-sgui-density={density} data-sgui-part="button">
      {loading ? <ProgressBar isIndeterminate className={styles.spinner}
        aria-label={t("common.ui.pending", { defaultMessage: "Pending" })} /> :
        startIcon && <span aria-hidden="true" className={styles.icon}>{startIcon}</span>}
      <span className={styles.label}>{children}</span>
      {endIcon && <span aria-hidden="true" className={styles.icon}>{endIcon}</span>}
    </AriaButton>
  );
});
