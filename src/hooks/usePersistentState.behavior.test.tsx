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
  const first = renderHook(() => usePersistentState("blocked-view", { count: 0 }, { validate: isCount }));
  const second = renderHook(() => usePersistentState("blocked-view", { count: 0 }, { validate: isCount }));
  act(() => first.result.current[1](previous => ({ count: previous.count + 1 })));
  act(() => first.result.current[1](previous => ({ count: previous.count + 1 })));
  expect(first.result.current[0]).toEqual({ count: 2 }); expect(second.result.current[0]).toEqual({ count: 2 });
});
it("retains updates after a quota failure even if an old stored value is readable", () => {
  window.localStorage.setItem("quota-view", JSON.stringify({ count: 3 }));
  vi.spyOn(window.Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Quota"); });
  const { result } = renderHook(() => usePersistentState("quota-view", { count: 0 }, { validate: isCount }));
  act(() => result.current[1]({ count: 5 })); expect(result.current[0]).toEqual({ count: 5 });
});
it("rejects malformed stored shapes, supports explicit migration and writes versioned values", () => {
  window.localStorage.setItem("schema-view", '{"count":"wrong"}');
  const { result } = renderHook(() => usePersistentState("schema-view", { count: 0 }, { version: 2, validate: isCount,
    migrate: (stored, version) => version === undefined && stored !== null && typeof stored === "object" && "count" in stored ? { count: Number(stored.count) || 0 } : undefined }));
  expect(result.current[0]).toEqual({ count: 0 });
  act(() => result.current[1]({ count: 4 }));
  expect(JSON.parse(window.localStorage.getItem("schema-view")!)).toEqual({ __sguiPersistent: true, version: 2, value: { count: 4 } });
  expect(() => result.current[1]({ count: "wrong" } as unknown as { count: number })).toThrow(/validation/);
});
it("changes keys without stale snapshots and handles cross-tab updates and clear", () => {
  window.localStorage.setItem("view-a", '{"count":2}'); window.localStorage.setItem("view-b", '{"count":8}');
  const { result, rerender } = renderHook(({ key }) => usePersistentState(key, { count: 0 }, { validate: isCount }), { initialProps: { key: "view-a" } });
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
  const local = renderHook(() => usePersistentState("same-key", 0));
  const session = renderHook(() => usePersistentState("same-key", 0, { storage: "session" }));
  act(() => local.result.current[1](2)); act(() => session.result.current[1](3));
  expect(local.result.current[0]).toBe(2); expect(session.result.current[0]).toBe(3);
  const nullable = renderHook(() => usePersistentState<string | null>("nullable", "initial", { storage: false }));
  act(() => nullable.result.current[1](null)); expect(nullable.result.current[0]).toBeNull();
});
it("keeps stable defaults for malformed JSON and rejected schema versions", () => {
  window.localStorage.setItem("malformed-view", "{");
  const { result, rerender } = renderHook(() => usePersistentState("malformed-view", { count: 0 }, { validate: isCount, version: 2 }));
  const initial = result.current[0]; rerender(); expect(result.current[0]).toBe(initial);
  act(() => { window.localStorage.setItem("malformed-view", JSON.stringify({ __sguiPersistent: true, version: 1, value: { count: 99 } })); window.dispatchEvent(new StorageEvent("storage", { key: "malformed-view" })); });
  expect(result.current[0]).toEqual({ count: 0 });
});
it("migrates valid legacy state explicitly and validates malformed legacy shapes", () => {
  window.localStorage.setItem("valid-legacy", '{"count":7}');
  const migrate = vi.fn((stored: unknown, previous: number | undefined) => previous === undefined && isCount(stored) ? stored : undefined);
  const migrated = renderHook(() => usePersistentState("valid-legacy", { count: 0 }, { version: 2, validate: isCount, migrate }));
  expect(migrated.result.current[0]).toEqual({ count: 7 }); expect(migrate).toHaveBeenCalledWith({ count: 7 }, undefined);
  window.localStorage.setItem("wrong-shape", '{"count":"wrong"}');
  const rejected = renderHook(() => usePersistentState("wrong-shape", { count: 0 }, { validate: isCount }));
  expect(rejected.result.current[0]).toEqual({ count: 0 });
});
