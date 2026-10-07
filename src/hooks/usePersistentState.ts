"use client";
import { useCallback, useRef, useSyncExternalStore } from "react";

const CHANGE_EVENT = "persistent-state-change";
// Browser-scoped fallback: never share a request's state through a server module cache.
type SavedState = { value: unknown; version?: number; absent?: true };
const browserFallbacks = new WeakMap<object, Map<string, SavedState>>();
const equivalent = (left: unknown, right: unknown) => {
  if (Object.is(left, right)) return true;
  try { return JSON.stringify(left) === JSON.stringify(right); } catch { return false; }
};
export interface PersistentStateOptions<T> {
  /** Defaults to false: each hook instance owns memory-only state. */
  storage?: "local" | "session" | false;
  validate?: (value: unknown) => value is T;
  /** Omit for the existing raw JSON format. Set for a versioned envelope. */
  version?: number;
  migrate?: (value: unknown, previousVersion: number | undefined) => T | undefined;
}

export function usePersistentState<T>(storageKey: string | undefined, initialValue: T, options: PersistentStateOptions<T> = {}) {
  const storageKind = options.storage ?? false;
  if (storageKind !== false && !storageKey?.trim()) throw new TypeError("Persistent state requires a nonempty key when storage is enabled");
  const key = storageKey ?? "";
  const scopeKey = `${storageKind}:${key}`;
  const initial = useRef({ key: scopeKey, value: initialValue });
  const local = useRef<{ value: T } | undefined>(undefined);
  const cache = useRef<{ key: string; raw?: string | null; source: SavedState; version?: number; migrate?: PersistentStateOptions<T>["migrate"]; candidate: unknown } | undefined>(undefined);
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

  const resolveSaved = (source: SavedState, raw?: string | null): T => {
    const previous = cache.current;
    const { version, migrate } = settings.current;
    if (previous?.key === scopeKey && previous.source === source && previous.version === version && previous.migrate === migrate) {
      return previous.candidate !== undefined && valid(previous.candidate) ? previous.candidate : initial.current.value;
    }
    let candidate = source.value;
    if (!source.absent && version !== undefined && version !== source.version) {
      try { candidate = migrate?.(candidate, source.version); } catch { candidate = undefined; }
    }
    // Persisted JSON migration functions may return equivalent new objects each render.
    // Retain the previous snapshot identity so useSyncExternalStore stays stable.
    if (previous?.key === scopeKey && equivalent(previous.candidate, candidate)) candidate = previous.candidate;
    cache.current = { key: scopeKey, raw, source, version, migrate, candidate };
    return candidate !== undefined && valid(candidate) ? candidate : initial.current.value;
  };
  const getSnapshot = useCallback((): T => {
    if (typeof window === "undefined") return initial.current.value;
    if (storageKind === false) {
      const candidate = local.current ? local.current.value : initial.current.value;
      return valid(candidate) ? candidate : initial.current.value;
    }
    const savedFallback = fallback().get(scopeKey);
    if (savedFallback) return resolveSaved(savedFallback);
    let raw: string | null;
    try { raw = storage()!.getItem(key); } catch {
      return cache.current?.key === scopeKey ? resolveSaved(cache.current.source, cache.current.raw) : initial.current.value;
    }
    if (cache.current?.key === scopeKey && cache.current.raw === raw) return resolveSaved(cache.current.source, raw);
    let source: SavedState = { value: initial.current.value, absent: true };
    if (raw !== null) {
      try {
        const parsed: unknown = JSON.parse(raw);
        const envelope = parsed !== null && typeof parsed === "object" && "__sguiPersistent" in parsed && parsed.__sguiPersistent === true
          ? parsed as { version?: number; value?: unknown } : undefined;
        source = envelope ? { value: envelope.value, version: envelope.version } : { value: parsed };
      } catch { /* Malformed JSON keeps a stable default snapshot. */ }
    }
    return resolveSaved(source, raw);
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
      cache.current = { key: scopeKey, raw, version, source: { value: resolved, version }, migrate: settings.current.migrate, candidate: resolved };
      if (previous === raw) return;
    } catch {
      // Preserve changes even when reads/writes, quotas or serialization fail.
      fallback().set(scopeKey, { value: resolved, version });
    }
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { key, storage: storageKind } }));
  }, [getSnapshot, key, scopeKey, storageKind]);
  return [value, setValue] as const;
}
