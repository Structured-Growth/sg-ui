"use client";
import { useRef, type ReactNode } from "react";
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
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  dismissOnOutside?: boolean;
  dismissOnEscape?: boolean;
  showCloseButton?: boolean;
  onDismiss: (reason: DialogDismissReason) => void;
  className?: string;
}

export function Dialog({ open, title, description, children, footer, size = "md",
  dismissOnOutside = true, dismissOnEscape = true, showCloseButton = true, onDismiss, className }: DialogProps) {
  const scope = useOverlayScope();
  const { t } = useTranslation();
  const reason = useRef<DialogDismissReason>("dismiss");
  // React portal events propagate through this logical ancestor, including backdrop events.
  // Reset on the next interaction, not in a microtask between native capture/bubble listeners.
  return <div onKeyDownCapture={event => { reason.current = event.key === "Escape" ? "escape" : "dismiss"; }}
    onClickCapture={event => { if (event.detail === 0) reason.current = "dismiss"; }}>
    <ModalOverlay {...scope} isOpen={open} isDismissable={dismissOnOutside}
    isKeyboardDismissDisabled={!dismissOnEscape} className={styles.overlay}
    shouldCloseOnInteractOutside={() => { reason.current = "outside"; return true; }}
    onOpenChange={next => { if (!next) onDismiss(reason.current); }}>
      <Modal className={styles.modal} data-size={size}>
        <AriaDialog className={[styles.dialog, className].filter(Boolean).join(" ")}>
          <header className={styles.header}>
            <div><Heading slot="title" className={styles.title}>{title}</Heading>
              {description && <Text slot="description" className={styles.description}>{description}</Text>}</div>
            {showCloseButton && <Button variant="text" tone="neutral" onPress={() => onDismiss("close-button")}
              aria-label={t("common.ui.close", { defaultMessage: "Close" })}>{t("common.ui.close", { defaultMessage: "Close" })}</Button>}
          </header>
          <div className={styles.body} data-sgui-part="dialog-body">{children}</div>
          {footer && <footer className={styles.footer}>{footer}</footer>}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  </div>;
}
