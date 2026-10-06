"use client";
import { useEffect, type RefObject } from "react";
/** Associate a composite's state with its nearest native form without owning submission. */
export function useFormReset(ref: RefObject<HTMLElement | null>, reset: () => void) {
  useEffect(() => {
    const form = ref.current?.closest("form");
    const listener = (event: Event) => {
      // Wait until the host's reset handler has had a chance to prevent the reset.
      queueMicrotask(() => { if (!event.defaultPrevented) reset(); });
    };
    form?.addEventListener("reset", listener);
    return () => form?.removeEventListener("reset", listener);
  }, [ref, reset]);
}
