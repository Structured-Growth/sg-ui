"use client";
import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { Dialog, type DialogDismissReason } from "../../experimental/Dialog/Dialog";
import { Button, type ButtonProps } from "../../experimental/Button/Button";
import { useTranslation } from "../../i18n";
import styles from "./AppModal.module.css";

export type AppModalCloseReason = DialogDismissReason;
export type AppModalStep = { current: number; total: number; label?: string };
export type AppModalAction = {
  label: string;
  onPress?: () => void;
  variant?: ButtonProps["variant"];
  tone?: ButtonProps["tone"];
  disabled?: boolean;
  loading?: boolean;
  autoFocus?: boolean;
};
export type AppModalProps = {
  open: boolean;
  onClose?: (reason: AppModalCloseReason) => void;
  title?: string;
  "aria-label"?: string;
  subtitle?: string;
  children: ReactNode;
  disableEscapeKeyDown?: boolean;
  showCloseButton?: boolean;
  headerContent?: ReactNode;
  footerContent?: ReactNode;
  steps?: AppModalStep;
  primaryAction?: AppModalAction;
  secondaryAction?: AppModalAction;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  width?: number | string;
  height?: number | string;
  heightMode?: "auto" | "sm" | "md" | "lg";
  disableBackdropClose?: boolean;
  className?: string;
  style?: CSSProperties;
  bodyClassName?: string;
  bodyStyle?: CSSProperties;
};

export const AppModal = forwardRef<HTMLElement, AppModalProps>(function AppModal({ open, onClose, title, subtitle, children,
  disableEscapeKeyDown = false, showCloseButton = false, headerContent, footerContent, steps, primaryAction, secondaryAction,
  size = "sm", width, height, heightMode = "auto", disableBackdropClose = false, className, style, bodyClassName, bodyStyle,
  "aria-label": label }, ref) {
  const { t } = useTranslation();
  const showSteps = Boolean(steps && Number.isFinite(steps.total) && steps.total >= 2);
  const stepLabel = showSteps && steps ? steps.label ?? t("common.ui.modalStep", {
    defaultMessage: "Step {current} of {total}", values: { current: steps.current, total: steps.total },
  }) : undefined;
  const resolvedHeight = height ?? (size === "full" ? undefined : { auto: undefined, sm: "56dvh", md: "68dvh", lg: "80dvh" }[heightMode]);
  const action = (item: AppModalAction, primary: boolean) => <Button onPress={item.onPress}
    variant={item.variant ?? (primary ? "filled" : "text")} tone={item.tone ?? (primary ? "primary" : "neutral")}
    density="compact" disabled={item.disabled} loading={item.loading} autoFocus={item.autoFocus}>{item.label}</Button>;
  const footer = footerContent || showSteps || primaryAction || secondaryAction ? <div className={styles.footer}>
    {stepLabel && <span className={styles.steps}>{stepLabel}</span>}
    <div className={styles.actions}>{footerContent ?? <>{secondaryAction && action(secondaryAction, false)}{primaryAction && action(primaryAction, true)}</>}</div>
  </div> : undefined;
  return <Dialog ref={ref} open={open} title={title} aria-label={label ?? (headerContent ? title : undefined)} description={subtitle}
    header={headerContent} footer={footer} size={size} onDismiss={reason => onClose?.(reason)}
    dismissOnEscape={!disableEscapeKeyDown} dismissOnOutside={!disableBackdropClose} showCloseButton={showCloseButton}
    className={className} bodyClassName={[styles.body, bodyClassName].filter(Boolean).join(" ")} bodyStyle={bodyStyle}
    surfaceStyle={{ ...(width !== undefined ? { width, maxWidth: "calc(100vw - 2rem)" } : {}), ...(resolvedHeight !== undefined ? { height: resolvedHeight } : {}), ...style }}>
    {children}
  </Dialog>;
});
