"use client";
import { useCallback, useEffect, useRef, type HTMLAttributes } from "react";
import { revealFocusedElement } from "../AuthShell/revealFocusedControl";

/** Internal client leaf; the public shell and server-provided children stay server eligible. */
export function AppShellMain(props: HTMLAttributes<HTMLElement>) {
  const mainRef = useRef<HTMLElement>(null);
  const frame = useRef<number | null>(null);
  const schedule = useCallback(() => {
    const main = mainRef.current;
    const view = main?.ownerDocument.defaultView;
    if (!main || !view) return;
    if (frame.current !== null) view.cancelAnimationFrame(frame.current);
    frame.current = view.requestAnimationFrame(() => {
      frame.current = null;
      const focused = main.ownerDocument.activeElement;
      if (!(focused instanceof view.HTMLElement)) return;
      revealFocusedElement(main, focused, "instant");
      if (!main.isConnected || !main.contains(focused) || focused.closest('[role="dialog"]')) return;
      // scrollIntoView reveals the border box, not its keyboard focus outline.
      // Finish native scrolling inside this pane without moving sibling regions.
      const box = focused.getBoundingClientRect();
      const css = view.getComputedStyle(focused);
      const outline = css.outlineStyle === "none" ? 0
        : Math.max(0, (parseFloat(css.outlineWidth) || 0) + (parseFloat(css.outlineOffset) || 0));
      if (!main.clientHeight || !box.height || box.height + 2 * outline > main.clientHeight) return;
      const top = main.getBoundingClientRect().top + main.clientTop;
      const bottom = top + main.clientHeight;
      const delta = box.top - outline < top ? box.top - outline - top
        : box.bottom + outline > bottom ? box.bottom + outline - bottom : 0;
      if (delta) main.scrollTop = Math.max(0,
        Math.min(main.scrollHeight - main.clientHeight, main.scrollTop + delta));
    });
  }, []);
  useEffect(() => {
    const main = mainRef.current;
    const view = main?.ownerDocument.defaultView;
    if (!main || !view) return;
    const observer = typeof view.ResizeObserver === "function" ? new view.ResizeObserver(schedule) : null;
    observer?.observe(main);
    if (main.firstElementChild) observer?.observe(main.firstElementChild);
    view.addEventListener("resize", schedule);
    return () => {
      observer?.disconnect();
      view.removeEventListener("resize", schedule);
      if (frame.current !== null) view.cancelAnimationFrame(frame.current);
      frame.current = null;
    };
  }, [schedule]);
  return <main {...props} ref={mainRef} onFocusCapture={schedule} />;
}
