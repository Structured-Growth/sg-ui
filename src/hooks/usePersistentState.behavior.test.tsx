// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { act, cleanup, renderHook } from "@testing-library/react";
import { usePersistentState } from "./usePersistentState";
beforeEach(() => { window.localStorage.clear(); window.sessionStorage.clear(); window.dispatchEvent(new StorageEvent("storage", { key: null })); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
const isCount = (value: unknown): value is { count: number } => value !== null && typeof value === "object" && "count" in value && typeof value.count === "number";
it("does not erase an unmounted session fallback when another tab clears local storage", () => {
  const write = vi.spyOn(window.Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Quota"); });
  const session = renderHook(() => usePersistentState("isolated-fallback", 0, { storage: "session" }));
  act(() => session.result.current[1](7));
  session.unmount(); write.mockRestore();
  act(() => window.dispatchEvent(new StorageEvent("storage", { key: null, storageArea: window.localStorage })));
  const remounted = renderHook(() => usePersistentState("isolated-fallback", 0, { storage: "session" }));
  expect(remounted.result.current[0]).toBe(7);
  act(() => window.dispatchEvent(new StorageEvent("storage", { key: null, storageArea: window.sessionStorage })));
  expect(remounted.result.current[0]).toBe(0);
});
it("retains functional updates in memory when storage reads and writes are blocked", () => {
  vi.spyOn(window.Storage.prototype, "getItem").mockImplementation(() => { throw new Error("Blocked"); });
  vi.spyOn(window.Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Quota"); });
  const first = renderHook(() => usePersistentState("blocked-view", { count: 0 }, { storage: "local", validate: isCount }));
  const second = renderHook(() => usePersistentState("blocked-view", { count: 0 }, { storage: "local", validate: isCount }));
  act(() => first.result.current[1](previous => ({ count: previous.count + 1 })));
  act(() => first.result.current[1](previous => ({ count: previous.count + 1 })));
  expect(first.result.current[0]).toEqual({ count: 2 }); expect(second.result.current[0]).toEqual({ count: 2 });
});
it("retains updates after a quota failure even if an old stored value is readable", () => {
  window.localStorage.setItem("quota-view", JSON.stringify({ count: 3 }));
  vi.spyOn(window.Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Quota"); });
  const { result } = renderHook(() => usePersistentState("quota-view", { count: 0 }, { storage: "local", validate: isCount }));
  act(() => result.current[1]({ count: 5 })); expect(result.current[0]).toEqual({ count: 5 });
});
it.each(["local", "session"] as const)("synchronizes %s fallback recovery when the requested value already matches saved JSON", storage => {
  const store = storage === "local" ? window.localStorage : window.sessionStorage;
  store.setItem("recovered-view", "3");
  const first = renderHook(() => usePersistentState("recovered-view", 0, { storage }));
  const second = renderHook(() => usePersistentState("recovered-view", 0, { storage }));
  const independent = renderHook(() => usePersistentState("independent-view", 0, { storage }));
  const memory = renderHook(() => usePersistentState("recovered-view", 0));
  const write = vi.spyOn(window.Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Quota"); });
  act(() => first.result.current[1](5));
  expect(first.result.current[0]).toBe(5);
  expect(second.result.current[0]).toBe(5);
  write.mockRestore();
  const recoveredWrite = vi.spyOn(window.Storage.prototype, "setItem");
  act(() => first.result.current[1](3));
  expect(first.result.current[0]).toBe(3);
  expect(second.result.current[0]).toBe(3);
  expect(independent.result.current[0]).toBe(0);
  expect(memory.result.current[0]).toBe(0);
  expect(store.getItem("recovered-view")).toBe("3");
  expect(recoveredWrite).not.toHaveBeenCalled();
  act(() => second.result.current[1](previous => previous + 1));
  expect(first.result.current[0]).toBe(4);
  expect(second.result.current[0]).toBe(4);
  expect(store.getItem("recovered-view")).toBe("4");
});
it("rejects malformed stored shapes, supports explicit migration and writes versioned values", () => {
  window.localStorage.setItem("schema-view", '{"count":"wrong"}');
  const { result } = renderHook(() => usePersistentState("schema-view", { count: 0 }, { storage: "local", version: 2, validate: isCount,
    migrate: (stored, version) => version === undefined && stored !== null && typeof stored === "object" && "count" in stored ? { count: Number(stored.count) || 0 } : undefined }));
  expect(result.current[0]).toEqual({ count: 0 });
  act(() => result.current[1]({ count: 4 }));
  expect(JSON.parse(window.localStorage.getItem("schema-view")!)).toEqual({ __sguiPersistent: true, version: 2, value: { count: 4 } });
  expect(() => result.current[1]({ count: "wrong" } as unknown as { count: number })).toThrow(/validation/);
});
it("changes keys without stale snapshots and handles cross-tab updates and clear", () => {
  window.localStorage.setItem("view-a", '{"count":2}'); window.localStorage.setItem("view-b", '{"count":8}');
  const { result, rerender } = renderHook(({ key }) => usePersistentState(key, { count: 0 }, { storage: "local", validate: isCount }), { initialProps: { key: "view-a" } });
  expect(result.current[0]).toEqual({ count: 2 }); rerender({ key: "view-b" }); expect(result.current[0]).toEqual({ count: 8 });
  act(() => { window.localStorage.setItem("view-b", '{"count":9}'); window.dispatchEvent(new StorageEvent("storage", { key: "view-b", storageArea: window.localStorage })); });
  expect(result.current[0]).toEqual({ count: 9 });
  act(() => { window.localStorage.clear(); window.dispatchEvent(new StorageEvent("storage", { key: null, storageArea: window.localStorage })); });
  expect(result.current[0]).toEqual({ count: 0 });
});
it("isolates storage-disabled instances and local versus session state", () => {
  const first = renderHook(() => usePersistentState("memory-only", 0, { storage: false }));
  const second = renderHook(() => usePersistentState("memory-only", 0, { storage: false }));
  act(() => first.result.current[1](1)); expect(first.result.current[0]).toBe(1); expect(second.result.current[0]).toBe(0);
  const local = renderHook(() => usePersistentState("same-key", 0, { storage: "local" }));
  const session = renderHook(() => usePersistentState("same-key", 0, { storage: "session" }));
  act(() => local.result.current[1](2)); act(() => session.result.current[1](3));
  expect(local.result.current[0]).toBe(2); expect(session.result.current[0]).toBe(3);
  const nullable = renderHook(() => usePersistentState<string | null>("nullable", "initial", { storage: false }));
  act(() => nullable.result.current[1](null)); expect(nullable.result.current[0]).toBeNull();
});
it("keeps stable defaults for malformed JSON and rejected schema versions", () => {
  window.localStorage.setItem("malformed-view", "{");
  const { result, rerender } = renderHook(() => usePersistentState("malformed-view", { count: 0 }, { storage: "local", validate: isCount, version: 2 }));
  const initial = result.current[0]; rerender(); expect(result.current[0]).toBe(initial);
  act(() => { window.localStorage.setItem("malformed-view", JSON.stringify({ __sguiPersistent: true, version: 1, value: { count: 99 } })); window.dispatchEvent(new StorageEvent("storage", { key: "malformed-view" })); });
  expect(result.current[0]).toEqual({ count: 0 });
});
it("migrates valid legacy state explicitly and validates malformed legacy shapes", () => {
  window.localStorage.setItem("valid-legacy", '{"count":7}');
  const migrate = vi.fn((stored: unknown, previous: number | undefined) => previous === undefined && isCount(stored) ? stored : undefined);
  const migrated = renderHook(() => usePersistentState("valid-legacy", { count: 0 }, { storage: "local", version: 2, validate: isCount, migrate }));
  expect(migrated.result.current[0]).toEqual({ count: 7 }); expect(migrate).toHaveBeenCalledWith({ count: 7 }, undefined);
  window.localStorage.setItem("wrong-shape", '{"count":"wrong"}');
  const rejected = renderHook(() => usePersistentState("wrong-shape", { count: 0 }, { storage: "local", validate: isCount }));
  expect(rejected.result.current[0]).toEqual({ count: 0 });
});
it("uses isolated memory by default without reading or writing browser storage", () => {
  const read = vi.spyOn(window.Storage.prototype, "getItem");
  const write = vi.spyOn(window.Storage.prototype, "setItem");
  const first = renderHook(() => usePersistentState(undefined, 0));
  const second = renderHook(() => usePersistentState(undefined, 0));
  act(() => first.result.current[1](previous => previous + 1));
  expect(first.result.current[0]).toBe(1); expect(second.result.current[0]).toBe(0);
  expect(read).not.toHaveBeenCalled(); expect(write).not.toHaveBeenCalled();
});
it("requires a distinct nonempty key when persistence is enabled", () => {
  expect(() => renderHook(() => usePersistentState(undefined, 0, { storage: "local" }))).toThrow(/nonempty key/);
  expect(() => renderHook(() => usePersistentState("  ", 0, { storage: "session" }))).toThrow(/nonempty key/);
});
it("revalidates stored and memory snapshots when validators change", () => {
  window.localStorage.setItem("live-validation", '{"count":8}');
  const permissive = (value: unknown): value is { count: number } => isCount(value);
  const strict = (value: unknown): value is { count: number } => isCount(value) && value.count < 5;
  const stored = renderHook(({ validate }) => usePersistentState("live-validation", { count: 0 }, { storage: "local", validate }), { initialProps: { validate: strict } });
  expect(stored.result.current[0]).toEqual({ count: 0 });
  stored.rerender({ validate: permissive }); expect(stored.result.current[0]).toEqual({ count: 8 });
  stored.rerender({ validate: strict }); expect(stored.result.current[0]).toEqual({ count: 0 });
  const memory = renderHook(({ validate }) => usePersistentState(undefined, { count: 0 }, { validate }), { initialProps: { validate: permissive } });
  act(() => memory.result.current[1]({ count: 8 }));
  memory.rerender({ validate: strict }); expect(memory.result.current[0]).toEqual({ count: 0 });
  memory.rerender({ validate: permissive }); expect(memory.result.current[0]).toEqual({ count: 8 });
});
it("supports adding migration after rejecting a stored legacy schema with stable inline callbacks", () => {
  window.localStorage.setItem("live-migration", '{"count":8}');
  const { result, rerender } = renderHook(({ migrate }) => usePersistentState("live-migration", { count: 0 }, {
    storage: "local", version: 2, validate: (value): value is { count: number } => isCount(value),
    migrate: migrate ? (value) => isCount(value) ? { count: value.count + 1 } : undefined : undefined,
  }), { initialProps: { migrate: false } });
  expect(result.current[0]).toEqual({ count: 0 });
  rerender({ migrate: true }); expect(result.current[0]).toEqual({ count: 9 });
  const snapshot = result.current[0]; rerender({ migrate: true }); expect(result.current[0]).toBe(snapshot);
});
it("migrates or rejects versioned fallback data and revalidates blocked-read caches", () => {
  const write = vi.spyOn(window.Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Quota"); });
  const { result, rerender } = renderHook(({ version, migrate }) => usePersistentState("fallback-version", { count: 0 }, {
    storage: "local", version, validate: isCount,
    migrate: migrate ? (value, previous) => previous === 1 && isCount(value) ? { count: value.count + 10 } : undefined : undefined,
  }), { initialProps: { version: 1, migrate: false } });
  act(() => result.current[1]({ count: 8 })); expect(result.current[0]).toEqual({ count: 8 });
  rerender({ version: 2, migrate: false }); expect(result.current[0]).toEqual({ count: 0 });
  rerender({ version: 2, migrate: true }); expect(result.current[0]).toEqual({ count: 18 });
  write.mockRestore();
  window.localStorage.setItem("blocked-cache", '{"__sguiPersistent":true,"version":1,"value":{"count":8}}');
  const cached = renderHook(({ version, reject }) => usePersistentState("blocked-cache", { count: 0 }, { storage: "local", version,
    validate: (value): value is { count: number } => isCount(value) && (!reject || value.count < 5) }), { initialProps: { version: 1, reject: false } });
  expect(cached.result.current[0]).toEqual({ count: 8 });
  vi.spyOn(window.Storage.prototype, "getItem").mockImplementation(() => { throw new Error("Blocked"); });
  cached.rerender({ version: 1, reject: true }); expect(cached.result.current[0]).toEqual({ count: 0 });
  cached.rerender({ version: 2, reject: false }); expect(cached.result.current[0]).toEqual({ count: 0 });
});
it("keeps initial defaults across live version changes when storage is absent or malformed", () => {
  window.localStorage.setItem("malformed-live-version", "{");
  const migrate = vi.fn((value: unknown) => isCount(value) ? { count: value.count + 10 } : undefined);
  const empty = renderHook(({ version }) => usePersistentState("empty-live-version", { count: 3 }, { storage: "local", version, validate: isCount, migrate }), { initialProps: { version: 1 } });
  const malformed = renderHook(({ version }) => usePersistentState("malformed-live-version", { count: 4 }, { storage: "local", version, validate: isCount, migrate }), { initialProps: { version: 1 } });
  empty.rerender({ version: 2 }); malformed.rerender({ version: 2 });
  expect(empty.result.current[0]).toEqual({ count: 3 }); expect(malformed.result.current[0]).toEqual({ count: 4 });
  expect(migrate).not.toHaveBeenCalled();
});
