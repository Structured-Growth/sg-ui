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
      if (focused instanceof view.HTMLElement) revealFocusedElement(main, focused, "instant");
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
