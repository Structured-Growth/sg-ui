"use client";
import { useCallback, useRef, useSyncExternalStore } from "react";

const CHANGE_EVENT = "persistent-state-change";
// Browser-scoped fallback: never share a request's state through a server module cache.
const browserFallbacks = new WeakMap<object, Map<string, unknown>>();
export interface PersistentStateOptions<T> {
  storage?: "local" | "session" | false;
  validate?: (value: unknown) => value is T;
  /** Omit for the existing raw JSON format. Set for a versioned envelope. */
  version?: number;
  migrate?: (value: unknown, previousVersion: number | undefined) => T | undefined;
}

export function usePersistentState<T>(key: string, initialValue: T, options: PersistentStateOptions<T> = {}) {
  const storageKind = options.storage ?? "local";
  const scopeKey = `${storageKind}:${key}`;
  const initial = useRef({ key: scopeKey, value: initialValue });
  const local = useRef<{ value: T } | undefined>(undefined);
  const cache = useRef<{ key: string; raw: string | null; version?: number; value: T } | undefined>(undefined);
  const settings = useRef(options);
  settings.current = options;
  if (initial.current.key !== scopeKey) {
    initial.current = { key: scopeKey, value: initialValue };
    local.current = undefined;
    cache.current = undefined;
  }
  const subscribers = useRef(new Set<() => void>());
  const fallback = () => {
    let values = browserFallbacks.get(window);
    if (!values) {
      values = new Map(); browserFallbacks.set(window, values);
      const store = values;
      // Retire stale fallbacks even for views that are temporarily unmounted.
      window.addEventListener("storage", event => {
        let changedStorage: "local" | "session" | undefined;
        if (event.storageArea) {
          try {
            if (event.storageArea === window.localStorage) changedStorage = "local";
            else if (event.storageArea === window.sessionStorage) changedStorage = "session";
            else return;
          } catch { return; }
        }
        for (const storedKey of store.keys()) {
          if (changedStorage && !storedKey.startsWith(`${changedStorage}:`)) continue;
          if (event.key === null || storedKey === `local:${event.key}` || storedKey === `session:${event.key}`) store.delete(storedKey);
        }
      });
    }
    return values;
  };
  const storage = () => storageKind === false ? undefined : storageKind === "local" ? window.localStorage : window.sessionStorage;
  const valid = (candidate: unknown): candidate is T => !settings.current.validate || settings.current.validate(candidate);

  const getSnapshot = useCallback((): T => {
    if (typeof window === "undefined") return initial.current.value;
    if (storageKind === false) return local.current ? local.current.value : initial.current.value;
    if (fallback().has(scopeKey)) {
      const candidate = fallback().get(scopeKey);
      return valid(candidate) ? candidate : initial.current.value;
    }
    let raw: string | null;
    try { raw = storage()!.getItem(key); } catch { return cache.current?.value ?? initial.current.value; }
    const version = settings.current.version;
    if (cache.current?.key === scopeKey && cache.current.raw === raw && cache.current.version === version) {
      return valid(cache.current.value) ? cache.current.value : initial.current.value;
    }
    let value = initial.current.value;
    if (raw !== null) {
      try {
        const parsed: unknown = JSON.parse(raw);
        const envelope = parsed !== null && typeof parsed === "object" && "__sguiPersistent" in parsed && parsed.__sguiPersistent === true
          ? parsed as { version?: number; value?: unknown } : undefined;
        const previousVersion = envelope?.version;
        let candidate = envelope ? envelope.value : parsed;
        if (version !== undefined && version !== previousVersion) candidate = settings.current.migrate?.(candidate, previousVersion);
        if (valid(candidate) && (candidate !== undefined || version === previousVersion)) value = candidate as T;
      } catch { /* Malformed JSON or a rejected migration keeps a stable default snapshot. */ }
    }
    cache.current = { key: scopeKey, raw, version, value };
    return value;
  }, [key, scopeKey, storageKind]);

  const subscribe = useCallback((callback: () => void) => {
    if (typeof window === "undefined") return () => {};
    subscribers.current.add(callback);
    const onStorage = (event: StorageEvent) => {
      if (storageKind === false || (event.key !== null && event.key !== key)) return;
      try { if (event.storageArea && event.storageArea !== storage()) return; } catch { return; }
      fallback().delete(scopeKey);
      cache.current = undefined;
      callback();
    };
    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<{ key?: string; storage?: string }>).detail;
      if (storageKind !== false && detail?.key === key && (!detail.storage || detail.storage === storageKind)) callback();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => {
      subscribers.current.delete(callback);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(CHANGE_EVENT, onChange);
    };
  }, [key, scopeKey, storageKind]);
  const getServerSnapshot = useCallback(() => initial.current.value, [scopeKey]);
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback((next: T | ((previous: T) => T)) => {
    if (typeof window === "undefined") return;
    const resolved = typeof next === "function" ? (next as (previous: T) => T)(getSnapshot()) : next;
    if (!valid(resolved)) throw new TypeError("Persistent state failed its configured validation");
    if (storageKind === false) {
      local.current = { value: resolved };
      subscribers.current.forEach(callback => callback());
      return;
    }
    const version = settings.current.version;
    try {
      const raw = JSON.stringify(version === undefined ? resolved : { __sguiPersistent: true, version, value: resolved });
      if (raw === undefined) throw new TypeError("Value cannot be serialized as JSON");
      const previous = storage()!.getItem(key);
      if (previous !== raw) storage()!.setItem(key, raw);
      fallback().delete(scopeKey);
      cache.current = { key: scopeKey, raw, version, value: resolved };
      if (previous === raw) return;
    } catch {
      // Preserve changes even when reads/writes, quotas or serialization fail.
      fallback().set(scopeKey, resolved);
    }
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { key, storage: storageKind } }));
  }, [getSnapshot, key, scopeKey, storageKind]);
  return [value, setValue] as const;
}
