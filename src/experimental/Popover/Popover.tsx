"use client";
import { useCallback, useContext, useEffect, useRef, type CSSProperties, type ReactElement, type ReactNode } from "react";
import { DialogTrigger, Dialog, OverlayTriggerStateContext } from "react-aria-components/Dialog";
import { PopoverContext } from "react-aria-components/Popover";
import { useSlottedContext } from "react-aria-components/slots";
import { Overlay, DismissButton } from "react-aria/Overlay";
import { usePopover } from "react-aria/usePopover";
import { useOverlayPosition } from "react-aria/useOverlayPosition";
import { Heading } from "react-aria-components/Heading";
import { useLocale } from "react-aria-components/I18nProvider";
import { useOverlayScope, useOverlayDirectionRef } from "../../foundation/ThemeScope";
import type { ButtonProps } from "../Button/Button";
import styles from "./Popover.module.css";

export interface PopoverProps {
  trigger: ReactElement<ButtonProps>;
  title: string;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: "bottom start" | "bottom end" | "top start" | "top end";
  size?: "md" | "lg";
}

// Mount the interaction hooks only while open, so the owned scroll subscription
// and positioning observers have the same lifetime as the overlay.
function OpenPopover({ title, children, placement, size }: Pick<PopoverProps, "title" | "children" | "placement" | "size">) {
  const state = useContext(OverlayTriggerStateContext)!;
  const context = useSlottedContext(PopoverContext)!;
  const triggerRef = context.triggerRef!;
  const popoverRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const scope = useOverlayScope();
  const { direction } = useLocale();
  const directionRef = useOverlayDirectionRef(direction);
  const ref = useCallback((element: HTMLDivElement | null) => {
    popoverRef.current = element;
    directionRef(element);
  }, [directionRef]);
  // React Aria still owns modality/dismissal. Disable its internal positioning
  // so there is one active position owner, whose update callback we can use.
  const { popoverProps, underlayProps } = usePopover({
    triggerRef, popoverRef, groupRef, shouldUpdatePosition: false,
  }, state);
  const { overlayProps, placement: resolvedPlacement, triggerAnchorPoint, updatePosition } = useOverlayPosition({
    targetRef: triggerRef, overlayRef: popoverRef, placement, offset: 8, isOpen: state.isOpen, onClose: null,
  });
  useEffect(() => {
    const trigger = triggerRef.current;
    if (!state.isOpen || !trigger) return;
    const doc = trigger.ownerDocument;
    const onScroll = (event: Event) => {
      // Ignore scrolling within the dialog or an unrelated host region. Capture
      // catches native, non-bubbling scroll and also supports reparented anchors.
      const source = event.composedPath()[0] ?? event.target;
      if (source === doc || source === doc.defaultView) {
        updatePosition();
        return;
      }
      for (let ancestor = trigger.parentElement; ancestor; ancestor = ancestor.parentElement) {
        if (source === ancestor) {
          updatePosition();
          return;
        }
      }
    };
    doc.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () => doc.removeEventListener("scroll", onScroll, true);
  }, [state.isOpen, triggerRef, updatePosition]);
  return <Overlay shouldContainFocus>
    <div {...underlayProps} style={{ position: "fixed", inset: 0 }} />
    <div ref={groupRef} style={{ display: "contents" }}>
      <div {...popoverProps} {...scope} ref={ref} style={{
        ...scope.style, ...overlayProps.style,
        "--trigger-width": `${triggerRef.current?.getBoundingClientRect().width ?? 0}px`,
        "--trigger-anchor-point": triggerAnchorPoint ? `${triggerAnchorPoint.x}px ${triggerAnchorPoint.y}px` : undefined,
      } as CSSProperties}
        data-trigger="DialogTrigger" data-size={size} data-placement={resolvedPlacement ?? undefined} className={styles.root}>
        <DismissButton onDismiss={state.close} />
        <Dialog className={styles.dialog}><Heading slot="title" className={styles.title}>{title}</Heading>{children}</Dialog>
        <DismissButton onDismiss={state.close} />
      </div>
    </div>
  </Overlay>;
}

function PopoverContent(props: Pick<PopoverProps, "title" | "children" | "placement" | "size">) {
  const state = useContext(OverlayTriggerStateContext)!;
  return state.isOpen ? <OpenPopover {...props} /> : null;
}

export function Popover({ trigger, title, children, open, defaultOpen, onOpenChange, placement = "bottom start", size = "md" }: PopoverProps) {
  return <DialogTrigger isOpen={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
    {trigger}<PopoverContent title={title} placement={placement} size={size}>{children}</PopoverContent>
  </DialogTrigger>;
}
