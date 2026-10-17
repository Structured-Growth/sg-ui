"use client";
import { createContext, forwardRef, useContext, useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type FocusEvent, type ReactNode } from "react";
import { useFocusManager, type FocusManager } from "react-aria/FocusScope";
import { Modal, ModalOverlay } from "react-aria-components/Modal";
import { Dialog as AriaDialog } from "react-aria-components/Dialog";
import { Heading } from "react-aria-components/Heading";
import { Text } from "react-aria-components/Text";
import { useOverlayScope } from "../../foundation/ThemeScope";
import { useTranslation } from "../../i18n";
import { Button } from "../../components/Button/Button";
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

interface RecoveryScope {
  dialog: HTMLElement | null;
  initialFocus: HTMLElement | null;
  opener: Element | null;
  manager: FocusManager | null;
}
const RecoveryContext = createContext<RecoveryScope | null>(null);

function DialogRecovery({ scope, parent }: { scope: RecoveryScope; parent: RecoveryScope | null }) {
  const manager = useFocusManager();
  const opener = useRef(typeof document === "undefined" ? null : document.activeElement);
  scope.manager = manager ?? null;
  scope.opener = opener.current;
  useEffect(() => {
    const closingDialog = scope.dialog;
    const capturedOpener = opener.current;
    const active = closingDialog?.ownerDocument.activeElement;
    if (!scope.initialFocus && active instanceof HTMLElement
      && active.closest('[role="dialog"]') === closingDialog) scope.initialFocus = active;
    return () => {
      // React Aria schedules restoration in layout cleanup. Inert is released
      // in passive cleanup; this single frame follows both and host effects.
      closingDialog?.ownerDocument.defaultView?.requestAnimationFrame(() => {
        const surviving = parent?.dialog;
        if (!parent || !surviving?.isConnected || closingDialog.isConnected
          || !capturedOpener || capturedOpener.isConnected || surviving.closest("[inert]")) return;
        const doc = surviving.ownerDocument;
        const active = doc.activeElement;
        // Keep successful host/other-overlay focus. Only repair lost focus,
        // inert background focus, or the ancestor opener selected by restoration.
        if (active !== doc.body && active !== parent.opener && !active?.closest("[inert]")) return;
        if (active?.closest('[role="dialog"]') && !surviving.contains(active)) return;
        const preferred = parent.initialFocus;
        if (preferred?.isConnected && surviving.contains(preferred)
          && !preferred.closest('[inert], [hidden], [aria-hidden="true"]')
          && !preferred.matches(":disabled")) preferred.focus();
        if (surviving.contains(doc.activeElement)) return;
        parent.manager?.focusFirst({ tabbable: true });
        if (!surviving.contains(doc.activeElement)) surviving.focus();
      });
    };
  }, [scope, parent]);
  useEffect(() => {
    const dialog = scope.dialog;
    const view = dialog?.ownerDocument.defaultView;
    if (!dialog || !view) return;
    let frame = 0;
    const revealAfterLayout = () => {
      view.cancelAnimationFrame(frame);
      frame = view.requestAnimationFrame(() => {
        const active = dialog.ownerDocument.activeElement;
        // A nested modal owns its own focus. Never scroll a parent for it.
        if (active instanceof HTMLElement && active.closest('[role="dialog"]') === dialog) {
          revealFocusedElement(active, dialog);
        }
      });
    };
    // Resizing an already focused control does not dispatch another focus event.
    // Observe fixed chrome too: text spacing/font changes can resize the header
    // while leaving the dialog's own outer dimensions unchanged.
    const observer = typeof view.ResizeObserver === "function" ? new view.ResizeObserver(revealAfterLayout) : null;
    observer?.observe(dialog);
    for (const region of dialog.querySelectorAll(':scope > [data-sgui-part]')) observer?.observe(region);
    view.addEventListener("resize", revealAfterLayout);
    return () => {
      view.cancelAnimationFrame(frame);
      observer?.disconnect();
      view.removeEventListener("resize", revealAfterLayout);
    };
  }, [scope]);
  return null;
}

function revealFocusedControl(event: FocusEvent<HTMLElement>) {
  // Initial focus may suppress the browser's automatic scrolling. Keep
  // focused descendants reachable when enlarged chrome needs an outer scrollport.
  const target = event.target as HTMLElement;
  const dialog = event.currentTarget.closest('[role="dialog"]');
  if (!dialog || target.closest('[role="dialog"]') !== dialog) return;
  revealFocusedElement(target, dialog);
}

function revealFocusedElement(target: HTMLElement, dialog: Element) {
  target.ownerDocument.defaultView?.requestAnimationFrame(() => {
    // Measure after focus-scope scroll restoration and the portal's layout.
    if (target.ownerDocument.activeElement !== target || !target.isConnected) return;
    const targetRect = target.getBoundingClientRect();
    const targetStyle = target.ownerDocument.defaultView!.getComputedStyle(target);
    const outline = targetStyle.outlineStyle === "none" ? 0 : Math.max(0,
      (parseFloat(targetStyle.outlineWidth) || 0) + (parseFloat(targetStyle.outlineOffset) || 0));
    const bounds = { top: targetRect.top - outline, bottom: targetRect.bottom + outline,
      left: targetRect.left - outline, right: targetRect.right + outline };
    const rect = dialog.getBoundingClientRect();
    const viewport = { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right };
    // Nested panels have their own clipping bounds. Native Tab scrolling
    // may reveal only an input's caret, leaving the control or its focus ring clipped.
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
  const parentRecovery = useContext(RecoveryContext);
  // When both controlled overlays start open, register the parent first. Mounting
  // both portals in the same commit lets the parent's modal isolation hide the
  // already-mounted child. A nested overlay activates after that parent commit.
  const [nestedReady, setNestedReady] = useState(parentRecovery === null);
  useEffect(() => { setNestedReady(true); }, []);
  const recovery = useMemo<RecoveryScope>(() => ({ dialog: null, initialFocus: null, opener: null, manager: null }), []);
  const dialogRef = useCallback((element: HTMLElement | null) => {
    if (element && element !== recovery.dialog) recovery.initialFocus = null;
    recovery.dialog = element;
    if (typeof ref === "function") return ref(element);
    if (ref) ref.current = element;
  }, [recovery, ref]);
  const descriptionId = useId();
  const { t } = useTranslation();
  const reason = useRef<DialogDismissReason>("dismiss");
  // Portal events propagate through this logical ancestor, including backdrop events.
  return <div onFocusCapture={event => {
    const target = event.target as HTMLElement;
    if ((!recovery.initialFocus || recovery.initialFocus === recovery.dialog)
      && target.closest('[role="dialog"]') === recovery.dialog) recovery.initialFocus = target;
  }} onKeyDownCapture={event => { reason.current = event.key === "Escape" ? "escape" : "dismiss"; }}
    onClickCapture={event => { if (event.detail === 0) reason.current = "dismiss"; }}>
    <ModalOverlay {...scope} isOpen={open && nestedReady} isDismissable={dismissOnOutside}
    isKeyboardDismissDisabled={!dismissOnEscape} className={styles.overlay} data-sgui-part="dialog-overlay" data-size={size}
    shouldCloseOnInteractOutside={() => { reason.current = "outside"; return true; }}
    onOpenChange={next => { if (!next) onDismiss(reason.current); }}>
      <Modal className={styles.modal} data-size={size} style={surfaceStyle} data-sgui-part="dialog-surface">
        <RecoveryContext.Provider value={recovery}><AriaDialog ref={dialogRef} style={style} aria-describedby={description && !header ? descriptionId : undefined} aria-label={label ?? (!title ? t("common.ui.dialog", { defaultMessage: "Dialog" }) : undefined)} className={[styles.dialog, className].filter(Boolean).join(" ")}>
          <DialogRecovery scope={recovery} parent={parentRecovery} />
          {(header || title || description || showCloseButton) && <header onFocusCapture={revealFocusedControl} className={styles.header} data-sgui-part="dialog-header">
            <div className={styles.heading}>{header ?? <>{title && <Heading slot="title" className={styles.title}>{title}</Heading>}
              {description && <Text id={descriptionId} slot="description" className={styles.description}>{description}</Text>}</>}</div>
            {showCloseButton && <Button variant="text" tone="neutral" onPress={() => onDismiss("close-button")}
              aria-label={t("common.ui.close", { defaultMessage: "Close" })}>{t("common.ui.close", { defaultMessage: "Close" })}</Button>}
          </header>}
          <div onFocusCapture={revealFocusedControl} className={[styles.body, bodyClassName].filter(Boolean).join(" ")} style={bodyStyle} data-sgui-part="dialog-body">{children}</div>
          {footer && <footer onFocusCapture={revealFocusedControl} className={styles.footer} data-sgui-part="dialog-footer">{footer}</footer>}
        </AriaDialog></RecoveryContext.Provider>
      </Modal>
    </ModalOverlay>
  </div>;
});
