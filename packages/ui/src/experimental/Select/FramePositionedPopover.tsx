"use client";
import { forwardRef, useCallback, useEffect, useLayoutEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Popover, PopoverContext } from "react-aria-components/Popover";
import { useLocale } from "react-aria-components/I18nProvider";
import { useSlottedContext } from "react-aria-components/slots";

/** Private Select popup inputs. Do not expose interaction-engine prop types. */
interface FramePositionedPopoverProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  dir?: string;
  lang?: string;
  "data-sgui-scope"?: string;
  "data-sgui-theme"?: "light" | "dark" | "system";
  "data-sgui-density"?: "compact" | "comfortable";
  placement?: "top" | "bottom" | "left" | "right" | "start" | "end"
    | `${"top" | "bottom"} ${"start" | "end" | "left" | "right"}`
    | `${"left" | "right" | "start" | "end"} ${"top" | "bottom"}`;
  offset?: number;
  crossOffset?: number;
  containerPadding?: number;
  shouldFlip?: boolean;
  boundaryElement?: Element;
}

const useCommittedEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Keep React Aria's collision calculation outside ResizeObserver delivery.
 * It can change max-height, which otherwise resizes the observed overlay within
 * that same delivery and causes native undelivered-notification errors. */
export const FramePositionedPopover = forwardRef<HTMLDivElement, FramePositionedPopoverProps>(function FramePositionedPopover(props, forwardedRef) {
  const context = useSlottedContext(PopoverContext);
  const { direction } = useLocale();
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const [positionPass, setPositionPass] = useState(true);
  const ref = useCallback((node: HTMLDivElement | null) => {
    setElement(node);
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  }, [forwardedRef]);
  // Child layout effects perform the initial/requested positioning pass first.
  // Disable the upstream sizing callbacks before the native observer phase.
  useCommittedEffect(() => { if (element && positionPass) setPositionPass(false); }, [element, positionPass]);
  // Locale/placement updates also need a pass even when their dimensions match.
  useCommittedEffect(() => { setPositionPass(true); }, [direction, props.placement, props.offset, props.crossOffset,
    props.containerPadding, props.shouldFlip, props.boundaryElement]);
  useEffect(() => {
    if (!element) { setPositionPass(true); return; }
    const view = element.ownerDocument.defaultView;
    if (!view) return;
    let frame: number | null = null;
    const requestPosition = () => {
      if (frame !== null) return;
      frame = view.requestAnimationFrame(() => {
        frame = null;
        if (element.isConnected) setPositionPass(true);
      });
    };
    const onScroll = (event: Event) => {
      const source = event.composedPath()[0] ?? event.target;
      if (source === element.ownerDocument || source === view) { requestPosition(); return; }
      for (let ancestor = context?.triggerRef?.current?.parentElement; ancestor; ancestor = ancestor.parentElement) {
        if (source === ancestor) { requestPosition(); return; }
      }
    };
    const sizes = new WeakMap<Element, string>();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(entries => {
      let changed = false;
      for (const entry of entries) {
        const size = `${entry.contentRect.width}:${entry.contentRect.height}`;
        if (sizes.get(entry.target) !== size) { sizes.set(entry.target, size); changed = true; }
      }
      if (changed) requestPosition();
    });
    observer?.observe(element);
    if (context?.triggerRef?.current) observer?.observe(context.triggerRef.current);
    element.ownerDocument.addEventListener("scroll", onScroll, { capture: true, passive: true });
    view.addEventListener("resize", requestPosition);
    view.visualViewport?.addEventListener("resize", requestPosition);
    view.visualViewport?.addEventListener("scroll", requestPosition);
    return () => {
      observer?.disconnect();
      element.ownerDocument.removeEventListener("scroll", onScroll, true);
      view.removeEventListener("resize", requestPosition);
      view.visualViewport?.removeEventListener("resize", requestPosition);
      view.visualViewport?.removeEventListener("scroll", requestPosition);
      if (frame !== null) view.cancelAnimationFrame(frame);
    };
  }, [element, context?.triggerRef]);
  return <Popover {...props} ref={ref} shouldUpdatePosition={positionPass} />;
});
