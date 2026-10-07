"use client";
import { forwardRef, useId, useRef, type CSSProperties, type FocusEvent, type ReactNode } from "react";
import { Modal, ModalOverlay } from "react-aria-components/Modal";
import { Dialog as AriaDialog } from "react-aria-components/Dialog";
import { Heading } from "react-aria-components/Heading";
import { Text } from "react-aria-components/Text";
import { useOverlayScope } from "../../foundation/ThemeScope";
import { useTranslation } from "../../i18n";
import { Button } from "../Button/Button";
import styles from "./Dialog.module.css";

export type DialogDismissReason = "escape" | "outside" | "close-button" | "dismiss";
export interface DialogProps {
  open: boolean;
  title?: string;
  "aria-label"?: string;
  description?: string;
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  dismissOnOutside?: boolean;
  dismissOnEscape?: boolean;
  showCloseButton?: boolean;
  onDismiss: (reason: DialogDismissReason) => void;
  className?: string;
  style?: CSSProperties;
  surfaceStyle?: CSSProperties;
  bodyClassName?: string;
  bodyStyle?: CSSProperties;
}

function revealFocusedControl(event: FocusEvent<HTMLElement>) {
  // Initial focus may suppress the browser's automatic scrolling. Keep
  // focused descendants reachable when enlarged chrome needs an outer scrollport.
  const target = event.target as HTMLElement;
  const dialog = event.currentTarget.closest('[role="dialog"]');
  if (!dialog || target.closest('[role="dialog"]') !== dialog) return;
  target.ownerDocument.defaultView?.requestAnimationFrame(() => {
    // Measure after focus-scope scroll restoration and the portal's layout.
    if (target.ownerDocument.activeElement !== target || !target.isConnected) return;
    const bounds = target.getBoundingClientRect();
    const rect = dialog.getBoundingClientRect();
    const viewport = { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right };
    // Nested panels have their own clipping bounds. Native Tab scrolling
    // may reveal only an input's caret, leaving the control partly clipped.
    for (let parent = target.parentElement; parent && dialog.contains(parent); parent = parent.parentElement) {
      const css = target.ownerDocument.defaultView!.getComputedStyle(parent);
      const clip = parent.getBoundingClientRect();
      if (/auto|scroll|hidden|clip/.test(css.overflowY)) {
        viewport.top = Math.max(viewport.top, clip.top);
        viewport.bottom = Math.min(viewport.bottom, clip.bottom);
      }
      if (/auto|scroll|hidden|clip/.test(css.overflowX)) {
        viewport.left = Math.max(viewport.left, clip.left);
        viewport.right = Math.min(viewport.right, clip.right);
      }
    }
    if (bounds.top < viewport.top || bounds.bottom > viewport.bottom || bounds.left < viewport.left || bounds.right > viewport.right) {
      target.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  });
}

export const Dialog = forwardRef<HTMLElement, DialogProps>(function Dialog({ open, title, description, children, header, footer, size = "md",
  dismissOnOutside = true, dismissOnEscape = true, showCloseButton = true, onDismiss, className, style, surfaceStyle,
  bodyClassName, bodyStyle, "aria-label": label }, ref) {
  const scope = useOverlayScope();
  const descriptionId = useId();
  const { t } = useTranslation();
  const reason = useRef<DialogDismissReason>("dismiss");
  // Portal events propagate through this logical ancestor, including backdrop events.
  return <div onKeyDownCapture={event => { reason.current = event.key === "Escape" ? "escape" : "dismiss"; }}
    onClickCapture={event => { if (event.detail === 0) reason.current = "dismiss"; }}>
    <ModalOverlay {...scope} isOpen={open} isDismissable={dismissOnOutside}
    isKeyboardDismissDisabled={!dismissOnEscape} className={styles.overlay} data-sgui-part="dialog-overlay" data-size={size}
    shouldCloseOnInteractOutside={() => { reason.current = "outside"; return true; }}
    onOpenChange={next => { if (!next) onDismiss(reason.current); }}>
      <Modal className={styles.modal} data-size={size} style={surfaceStyle} data-sgui-part="dialog-surface">
        <AriaDialog ref={ref} style={style} aria-describedby={description && !header ? descriptionId : undefined} aria-label={label ?? (!title ? t("common.ui.dialog", { defaultMessage: "Dialog" }) : undefined)} className={[styles.dialog, className].filter(Boolean).join(" ")}>
          {(header || title || description || showCloseButton) && <header onFocusCapture={revealFocusedControl} className={styles.header} data-sgui-part="dialog-header">
            <div className={styles.heading}>{header ?? <>{title && <Heading slot="title" className={styles.title}>{title}</Heading>}
              {description && <Text id={descriptionId} slot="description" className={styles.description}>{description}</Text>}</>}</div>
            {showCloseButton && <Button variant="text" tone="neutral" onPress={() => onDismiss("close-button")}
              aria-label={t("common.ui.close", { defaultMessage: "Close" })}>{t("common.ui.close", { defaultMessage: "Close" })}</Button>}
          </header>}
          <div onFocusCapture={revealFocusedControl} className={[styles.body, bodyClassName].filter(Boolean).join(" ")} style={bodyStyle} data-sgui-part="dialog-body">{children}</div>
          {footer && <footer onFocusCapture={revealFocusedControl} className={styles.footer} data-sgui-part="dialog-footer">{footer}</footer>}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  </div>;
});
