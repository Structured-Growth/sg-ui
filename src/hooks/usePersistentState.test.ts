// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, renderHook } from "@testing-library/react";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { usePersistentState } from "./usePersistentState";

beforeEach(() => {
  window.localStorage.clear();
  window.dispatchEvent(new StorageEvent("storage", { key: null, storageArea: window.localStorage }));
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("usePersistentState with real React subscriptions", () => {
  it("restores stored JSON and synchronizes functional updates across mounted views", () => {
    window.localStorage.setItem("count", '{"count":1}');
    const first = renderHook(() => usePersistentState("count", { count: 0 }, { storage: "local" }));
    const second = renderHook(() => usePersistentState("count", { count: 0 }, { storage: "local" }));
    const change = vi.fn();
    window.addEventListener("persistent-state-change", change);
    try {
      expect(first.result.current[0]).toEqual({ count: 1 });
      act(() => first.result.current[1](previous => ({ count: previous.count + 1 })));
      expect(first.result.current[0]).toEqual({ count: 2 });
      expect(second.result.current[0]).toEqual({ count: 2 });
      expect(window.localStorage.getItem("count")).toBe('{"count":2}');
      act(() => first.result.current[1]({ count: 2 }));
      expect(change).toHaveBeenCalledTimes(1);
    } finally { window.removeEventListener("persistent-state-change", change); }
  });

  it("restores stable initial state after another tab removes a previously stored key", () => {
    window.localStorage.setItem("removed", '{"count":8}');
    const { result, rerender } = renderHook(() => usePersistentState("removed", { count: 0 }, { storage: "local" }));
    expect(result.current[0]).toEqual({ count: 8 });
    act(() => {
      window.localStorage.removeItem("removed");
      window.dispatchEvent(new StorageEvent("storage", { key: "removed", storageArea: window.localStorage }));
    });
    expect(result.current[0]).toEqual({ count: 0 });
    const initial = result.current[0];
    rerender();
    expect(result.current[0]).toBe(initial);
  });

  it("retains snapshot identity for unchanged stored JSON", () => {
    window.localStorage.setItem("stable", '{"count":5}');
    const { result, rerender } = renderHook(() => usePersistentState("stable", { count: 0 }, { storage: "local" }));
    const snapshot = result.current[0];
    rerender();
    expect(result.current[0]).toBe(snapshot);
  });

  it("ignores notifications for other keys and updates on a matching storage event", () => {
    window.localStorage.setItem("watched", '{"count":1}');
    const { result } = renderHook(() => usePersistentState("watched", { count: 0 }, { storage: "local" }));
    act(() => {
      window.localStorage.setItem("watched", '{"count":3}');
      window.dispatchEvent(new StorageEvent("storage", { key: "other", storageArea: window.localStorage }));
      window.dispatchEvent(new CustomEvent("persistent-state-change", { detail: { key: "other", storage: "local" } }));
    });
    expect(result.current[0]).toEqual({ count: 1 });
    act(() => window.dispatchEvent(new StorageEvent("storage", { key: "watched", storageArea: window.localStorage })));
    expect(result.current[0]).toEqual({ count: 3 });
  });

  it.each([null, "{invalid-json"])("uses defaults for missing/malformed JSON %s when applying a functional update", raw => {
    if (raw !== null) window.localStorage.setItem("invalid", raw);
    const { result } = renderHook(() => usePersistentState("invalid", { count: 4 }, { storage: "local" }));
    expect(result.current[0]).toEqual({ count: 4 });
    act(() => result.current[1](previous => ({ count: previous.count + 1 })));
    expect(result.current[0]).toEqual({ count: 5 });
    expect(window.localStorage.getItem("invalid")).toBe('{"count":5}');
  });

  it("unsubscribes mounted listeners on unmount", () => {
    const add = vi.spyOn(window, "addEventListener");
    const remove = vi.spyOn(window, "removeEventListener");
    const view = renderHook(() => usePersistentState("cleanup", 0, { storage: "local" }));
    const changeSubscriptions = add.mock.calls.filter(([type]) => type === "persistent-state-change");
    expect(changeSubscriptions).toHaveLength(1);
    view.unmount();
    expect(remove).toHaveBeenCalledWith("persistent-state-change", changeSubscriptions[0][1]);
    const storageSubscriptions = add.mock.calls.filter(([type]) => type === "storage");
    expect(remove).toHaveBeenCalledWith("storage", storageSubscriptions.at(-1)![1]);
  });

  it("uses the server snapshot without reading ambient browser storage during SSR", () => {
    window.localStorage.setItem("server", '99');
    const read = vi.spyOn(window.Storage.prototype, "getItem");
    function ServerView() {
      const [value] = usePersistentState("server", 4, { storage: "local" });
      return createElement("output", null, value);
    }
    expect(renderToString(createElement(ServerView))).toBe("<output>4</output>");
    expect(read).not.toHaveBeenCalled();
  });
});
