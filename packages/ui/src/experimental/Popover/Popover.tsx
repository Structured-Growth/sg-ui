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
import type { ButtonProps } from "../../components/Button/Button";
import styles from "./Popover.module.css";

export interface PopoverProps {
  trigger: ReactElement<ButtonProps>;
  title: string;
  /** Hide the visible heading while retaining title as the dialog accessible name. */
  showTitle?: boolean;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Auto uses a bottom drawer on narrow viewports. Dialog and drawer stay fixed; popover remains anchored. */
  presentation?: "popover" | "dialog" | "drawer" | "auto";
  placement?: "bottom start" | "bottom end" | "top start" | "top end";
  /** Content sizing follows its children up to the viewport width. */
  size?: "md" | "lg" | "content";
}

// Mount the interaction hooks only while open, so the owned scroll subscription
// and positioning observers have the same lifetime as the overlay.
function OpenPopover({ title, showTitle = true, children, placement, size, presentation }: Pick<PopoverProps, "title" | "showTitle" | "children" | "placement" | "size" | "presentation">) {
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
    getTargetRect: target => {
      const rect = target.getBoundingClientRect();
      const overlay = popoverRef.current;
      if (!overlay) return rect;
      const view = target.ownerDocument.defaultView!;
      const viewport = view.visualViewport;
      const top = (viewport?.offsetTop ?? 0) + 12;
      const bottom = (viewport?.offsetTop ?? 0) + (viewport?.height ?? view.innerHeight) - 12;
      // Responsive reflow can move the trigger outside its scrolled pane.
      // Measure space from a viewport-bounded virtual anchor, otherwise an
      // offscreen trigger incorrectly appears to have unlimited room above it.
      const anchorTop = Math.max(top, Math.min(rect.top, bottom - rect.height));
      const anchor = anchorTop === rect.top ? rect : new view.DOMRect(rect.x, anchorTop, rect.width, rect.height);
      const border = overlay.offsetHeight - overlay.clientHeight;
      const naturalHeight = overlay.scrollHeight + border;
      // Let the native positioner flip whenever either side can fit. Otherwise
      // shift along the main axis before constraining content to a scrollport.
      if (naturalHeight <= Math.max(anchor.top - top - 8, bottom - anchor.bottom - 8)) return anchor;
      const height = Math.min(naturalHeight, bottom - top);
      const above = placement?.startsWith("top");
      const preferredTop = above ? anchor.top - 8 - height : anchor.bottom + 8;
      const fittedTop = Math.max(top, Math.min(preferredTop, bottom - height));
      const targetTop = above ? fittedTop + height + 8 : fittedTop - rect.height - 8;
      return new view.DOMRect(rect.x, targetTop, rect.width, rect.height);
    },
  });
  useEffect(() => {
    const trigger = triggerRef.current;
    if (!state.isOpen || !trigger) return;
    const doc = trigger.ownerDocument;
    const view = doc.defaultView;
    if (!view) return;
    const readGeometry = (anchor: Element) => {
      const rect = anchor.getBoundingClientRect();
      const viewport = view.visualViewport;
      const ancestors: { element: HTMLElement; values: number[] }[] = [];
      for (let parent = anchor.parentElement; parent; parent = parent.parentElement) {
        ancestors.push({ element: parent, values: [parent.scrollLeft, parent.scrollTop, parent.clientWidth, parent.clientHeight] });
      }
      return { anchor, ancestors, values: [rect.left, rect.top, rect.width, rect.height,
        view.scrollX, view.scrollY, view.innerWidth, view.innerHeight,
        viewport?.offsetLeft ?? 0, viewport?.offsetTop ?? 0, viewport?.width ?? view.innerWidth,
        viewport?.height ?? view.innerHeight, viewport?.scale ?? 1] };
    };
    let previous = readGeometry(trigger);
    let frame: number | null = null;
    const schedulePosition = () => {
      if (frame !== null) return;
      frame = view.requestAnimationFrame(() => {
        frame = null;
        const current = triggerRef.current;
        if (!current?.isConnected || !popoverRef.current) return;
        const next = readGeometry(current);
        const sameNumbers = (left: number[], right: number[]) => left.length === right.length
          && left.every((value, index) => value === right[index]);
        const unchanged = previous.anchor === next.anchor && sameNumbers(previous.values, next.values)
          && previous.ancestors.length === next.ancestors.length && previous.ancestors.every((ancestor, index) =>
            ancestor.element === next.ancestors[index].element && sameNumbers(ancestor.values, next.ancestors[index].values));
        previous = next;
        // Native focus can deliver an already-settled ancestor scroll event after
        // opening. Avoid rewriting positioning styles when nothing moved.
        if (!unchanged) updatePosition();
      });
    };
    const onScroll = (event: Event) => {
      // Ignore scrolling inside the overlay or an unrelated host region. Read
      // the live ancestor chain so reparented anchors retain their scroll owner.
      const source = event.composedPath()[0] ?? event.target;
      if (source === doc || source === view) {
        schedulePosition();
        return;
      }
      for (let ancestor = triggerRef.current?.parentElement; ancestor; ancestor = ancestor.parentElement) {
        if (source === ancestor) {
          schedulePosition();
          return;
        }
      }
    };
    doc.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () => {
      doc.removeEventListener("scroll", onScroll, true);
      if (frame !== null) view.cancelAnimationFrame(frame);
    };
  }, [state.isOpen, triggerRef, updatePosition]);
  return <Overlay shouldContainFocus>
    <div {...underlayProps} style={{ position: "fixed", inset: 0 }} />
    <div ref={groupRef} style={{ display: "contents" }}>
      <div {...popoverProps} {...scope} ref={ref} style={{
        ...scope.style, ...overlayProps.style,
        "--trigger-width": `${triggerRef.current?.getBoundingClientRect().width ?? 0}px`,
        "--trigger-anchor-point": triggerAnchorPoint ? `${triggerAnchorPoint.x}px ${triggerAnchorPoint.y}px` : undefined,
      } as CSSProperties}
        data-trigger="DialogTrigger" data-presentation={presentation} data-size={size} data-placement={resolvedPlacement ?? undefined} className={styles.root}>
        <DismissButton onDismiss={state.close} />
        <Dialog className={styles.dialog} aria-label={showTitle ? undefined : title}>{showTitle && <Heading slot="title" className={styles.title}>{title}</Heading>}{children}</Dialog>
        <DismissButton onDismiss={state.close} />
      </div>
    </div>
  </Overlay>;
}

function PopoverContent(props: Pick<PopoverProps, "title" | "showTitle" | "children" | "placement" | "size" | "presentation">) {
  const state = useContext(OverlayTriggerStateContext)!;
  return state.isOpen ? <OpenPopover {...props} /> : null;
}

export function Popover({ trigger, title, showTitle = true, children, open, defaultOpen, onOpenChange, placement = "bottom start", size = "md", presentation = "popover" }: PopoverProps) {
  return <DialogTrigger isOpen={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
    {trigger}<PopoverContent presentation={presentation} title={title} showTitle={showTitle} placement={placement} size={size}>{children}</PopoverContent>
  </DialogTrigger>;
}
