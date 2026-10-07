"use client";
import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
const useNativeLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
/** Suppress synchronous interaction-engine reset callbacks until host delegation completes. */
export function useStandaloneFormReset(ref: RefObject<HTMLElement | null>, reset: () => void, preserve?: () => (() => void) | undefined) {
  const resetting = useRef(false);
  const resetRef = useRef(reset);
  const preserveRef = useRef(preserve);
  useNativeLayoutEffect(() => { resetRef.current = reset; preserveRef.current = preserve; });
  const binding = useRef<{ form: HTMLFormElement | null | undefined; dispose: () => void } | null>(null);
  // Read association after each commit: the input ref can stay stable while its
  // form attribute changes or a host replaces the associated form element.
  useNativeLayoutEffect(() => {
    const element = ref.current;
    const form = element instanceof HTMLInputElement ? element.form : element?.closest("form");
    if (binding.current?.form === form) return;
    binding.current?.dispose();
    const pending = new Set<ReturnType<typeof setTimeout>>();
    const listener = (event: Event) => {
      resetting.current = true;
      const restore = preserveRef.current?.();
      // Native events may checkpoint microtasks between listeners; a task waits
      // for delegated host prevention and keeps upstream reset callbacks silent.
      const timer = setTimeout(() => {
        pending.delete(timer);
        resetting.current = pending.size > 0;
        if (!event.defaultPrevented) resetRef.current();
        else restore?.();
      }, 0);
      pending.add(timer);
    };
    form?.addEventListener("reset", listener, true);
    binding.current = { form, dispose: () => {
      form?.removeEventListener("reset", listener, true);
      pending.forEach(timer => clearTimeout(timer));
      resetting.current = false;
    } };
  });
  useNativeLayoutEffect(() => () => {
    binding.current?.dispose();
    binding.current = null;
  }, []);
  return resetting;
}
