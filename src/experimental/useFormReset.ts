"use client";
import { useEffect, useRef, type RefObject } from "react";

/** Associate a composite's state with its nearest native form without owning submission. */
export function useFormReset(ref: RefObject<HTMLElement | null>, reset: () => void) {
  const latestReset = useRef(reset);
  latestReset.current = reset;
  const resetting = useRef(false);
  useEffect(() => {
    const form = ref.current?.closest("form");
    const pending = new Set<ReturnType<typeof setTimeout>>();
    const listener = (event: Event) => {
      resetting.current = true;
      // Native dispatch can checkpoint microtasks between listeners. Defer to
      // a task so delegated host handlers can prevent reset before we decide.
      const timer = setTimeout(() => {
        pending.delete(timer);
        resetting.current = pending.size > 0;
        if (!event.defaultPrevented) latestReset.current();
      }, 0);
      pending.add(timer);
    };
    // Capture before nested React Aria fields attempt their individual resets.
    form?.addEventListener("reset", listener, true);
    return () => {
      form?.removeEventListener("reset", listener, true);
      pending.forEach(timer => clearTimeout(timer));
      resetting.current = false;
    };
  }, [ref]);
  return resetting;
}
