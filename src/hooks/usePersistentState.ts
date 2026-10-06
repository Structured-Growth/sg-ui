"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

const PERSISTENT_STATE_EVENT = "persistent-state-change";

const readValue = <T,>(key: string, initialValue: T): T => {
  try {
    const stored = window.localStorage.getItem(key);

    if (!stored) {
      return initialValue;
    }

    return JSON.parse(stored) as T;
  } catch {
    return initialValue;
  }
};

export function usePersistentState<T>(key: string, initialValue: T) {
  const initialValueRef = useRef<T>(initialValue);
  const lastRawRef = useRef<string | null>(null);
  const lastParsedRef = useRef<T>(initialValue);

  useEffect(() => {
    initialValueRef.current = initialValue;
  }, [initialValue]);

  useEffect(() => {
    lastRawRef.current = null;
    lastParsedRef.current = initialValueRef.current;
  }, [key]);

  const subscribe = useCallback(
    (callback: () => void) => {
      if (typeof window === "undefined") {
        return () => {};
      }

      const onStorage = (event: StorageEvent) => {
        if (event.key === key) {
          callback();
        }
      };

      const onPersistentStateChange = (event: Event) => {
        const customEvent = event as CustomEvent<{ key?: string }>;

        if (customEvent.detail?.key === key) {
          callback();
        }
      };

      window.addEventListener("storage", onStorage);
      window.addEventListener(PERSISTENT_STATE_EVENT, onPersistentStateChange);

      return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener(PERSISTENT_STATE_EVENT, onPersistentStateChange);
      };
    },
    [key],
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const raw = window.localStorage.getItem(key);

      if (raw === null) {
        if (lastRawRef.current !== null) {
          lastRawRef.current = null;
          lastParsedRef.current = initialValue;
        }

        return lastParsedRef.current;
      }

      if (raw === lastRawRef.current) {
        return lastParsedRef.current;
      }

      const parsed = JSON.parse(raw) as T;
      lastRawRef.current = raw;
      lastParsedRef.current = parsed;
      return parsed;
    } catch {
      lastRawRef.current = null;
      lastParsedRef.current = initialValue;
      return lastParsedRef.current;
    }
  }, [initialValue, key]);
  const getServerSnapshot = useCallback(() => initialValue, [initialValue]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (nextValue: T | ((prevValue: T) => T)) => {
      if (typeof window === "undefined") {
        return;
      }

      try {
        const previousValue = readValue(key, initialValue);
        const resolvedValue =
          typeof nextValue === "function"
            ? (nextValue as (prevValue: T) => T)(previousValue)
            : nextValue;

        const raw = JSON.stringify(resolvedValue);
        const previousRaw = window.localStorage.getItem(key);

        // Avoid re-dispatching when the serialized value has not changed.
        if (previousRaw === raw) {
          lastRawRef.current = raw;
          lastParsedRef.current = resolvedValue;
          return;
        }

        window.localStorage.setItem(key, raw);
        lastRawRef.current = raw;
        lastParsedRef.current = resolvedValue;
        window.dispatchEvent(
          new CustomEvent(PERSISTENT_STATE_EVENT, {
            detail: { key },
          }),
        );
      } catch {
        // Ignore write failures (private mode, quota, etc.) and keep in-memory state.
      }
    },
    [initialValue, key],
  );

  return [value, setValue] as const;
}
