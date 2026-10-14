// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { usePersistentPaginationModel } from "./usePersistentPaginationModel";

beforeEach(() => { window.localStorage.clear(); window.sessionStorage.clear(); window.dispatchEvent(new StorageEvent("storage", { key: null })); });
afterEach(cleanup);

describe("usePersistentPaginationModel", () => {
  it("keeps arbitrary sizes in isolated memory by default", () => {
    window.localStorage.setItem("grid", '{"page":9,"pageSize":100}');
    const first = renderHook(() => usePersistentPaginationModel("grid"));
    const second = renderHook(() => usePersistentPaginationModel());
    expect(first.result.current[0]).toEqual({ page: 0, pageSize: 25 });
    act(() => first.result.current[1]({ page: 4.8, pageSize: 150 }));
    act(() => first.result.current[1](previous => ({ ...previous, page: previous.page + 1 })));
    expect(first.result.current[0]).toEqual({ page: 5, pageSize: 150 });
    expect(second.result.current[0]).toEqual({ page: 0, pageSize: 25 });
    expect(JSON.parse(window.localStorage.getItem("grid")!)).toEqual({ page: 9, pageSize: 100 });
  });
  it("restores, normalizes and writes explicit session persistence", () => {
    window.sessionStorage.setItem("grid", '{"page":-3,"pageSize":26}');
    const { result } = renderHook(() => usePersistentPaginationModel("grid", undefined, { storage: "session", pageSizeOptions: [10, 75, 200] }));
    expect(result.current[0]).toEqual({ page: 0, pageSize: 75 });
    expect(JSON.parse(window.sessionStorage.getItem("grid")!)).toEqual({ page: 0, pageSize: 75 });
    act(() => result.current[1]({ page: 2, pageSize: 500 }));
    expect(result.current[0]).toEqual({ page: 2, pageSize: 200 });
  });
  it("accepts an omitted key in memory mode and reconfigures sizes live", () => {
    const { result, rerender } = renderHook(({ sizes }) => usePersistentPaginationModel(undefined, { page: 0, pageSize: 150 }, { pageSizeOptions: sizes }), { initialProps: { sizes: [10, 75, 200] } });
    expect(result.current[0].pageSize).toBe(200);
    rerender({ sizes: [10, 300] });
    expect(result.current[0].pageSize).toBe(300);
  });
  it("forwards schema migration and rejects malformed stored models", () => {
    window.localStorage.setItem("legacy", '{"page":2,"pageSize":250}');
    const { result } = renderHook(() => usePersistentPaginationModel("legacy", undefined, { storage: "local", version: 2,
      migrate: (stored, version) => version === undefined ? stored as { page: number; pageSize: number } : undefined }));
    expect(result.current[0]).toEqual({ page: 2, pageSize: 250 });
    act(() => result.current[1](previous => ({ ...previous, page: 3 })));
    expect(JSON.parse(window.localStorage.getItem("legacy")!)).toEqual({ __sguiPersistent: true, version: 2, value: { page: 3, pageSize: 250 } });
    window.localStorage.setItem("invalid", '{"page":"bad","pageSize":250}');
    const invalid = renderHook(() => usePersistentPaginationModel("invalid", undefined, { storage: "local" }));
    expect(invalid.result.current[0]).toEqual({ page: 0, pageSize: 25 });
  });
});
