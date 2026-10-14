"use client";
import { useEffect, useRef, type RefObject } from "react";

/** Reset calendar transactions only after every native/delegated host handler. */
export function useCalendarFormReset(ref: RefObject<HTMLElement | null>, reset: () => void) {
  const latestReset = useRef(reset);
  latestReset.current = reset;
  const resetting = useRef(false);
  useEffect(() => {
    const form = ref.current?.closest("form");
    const pending = new Set<ReturnType<typeof setTimeout>>();
    const captureReset = (event: Event) => {
      resetting.current = true;
      // Native dispatch may checkpoint microtasks between listeners. A task
      // lets React's delegated onReset prevent the event before we decide.
      const timer = setTimeout(() => {
        pending.delete(timer);
        resetting.current = pending.size > 0;
        if (!event.defaultPrevented) latestReset.current();
      }, 0);
      pending.add(timer);
    };
    form?.addEventListener("reset", captureReset, true);
    return () => {
      form?.removeEventListener("reset", captureReset, true);
      pending.forEach(timer => clearTimeout(timer));
      resetting.current = false;
    };
  }, [ref]);
  return resetting;
}
