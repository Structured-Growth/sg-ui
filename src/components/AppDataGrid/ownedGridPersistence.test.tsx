// @vitest-environment jsdom
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";
import { useOwnedGridController } from "./ownedGridController";
import { normalizeOwnedGridPersistedState, ownedGridPersistenceKey, readOwnedGridPersistence, useOwnedGridPersistence, type OwnedGridPersistenceOptions, type OwnedGridStorage } from "./ownedGridPersistence";

const columns = [{ field: "name", cellType: "text" as const }, { field: "score", filterType: "number" as const, minWidth: 100, maxWidth: 300 }, { field: "actions", cellType: "menu" as const }];
function fixture(key = "courses") {
  const values = new Map<string, string>();
  const storage: OwnedGridStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); }, removeItem: key => { values.delete(key); } };
  const options: OwnedGridPersistenceOptions<unknown> = { columns, pageSizeOptions: [10, 250], persistence: { key, storage } };
  return { values, storage, options };
}
describe("owned grid optional persistence", () => {
  it("validates every restored concern and drops undeclared fields, invalid rules and nonpersistable state", () => {
    const { options } = fixture();
    const restored = normalizeOwnedGridPersistedState({ paginationModel: { page: 7, pageSize: 25 },
      sortRules: [null, { field: "name", direction: "asc" }, { field: "name", direction: "desc" }, { field: "old", direction: "asc" }, { field: "score", direction: "sideways" }],
      filterRules: [null, { field: "score", operator: "gt", value: "10" }, { field: "score", operator: "gt", value: "bad" }, { field: "old", operator: "contains", value: "x" }, { field: "name", operator: "arbitrary", value: "x" }],
      columnVisibilityModel: { name: false, score: false, actions: false, old: true }, columnOrder: ["actions", "score", "old", "score", null],
      columnWidths: { score: 900, name: -1, actions: "100", old: 100 }, searchValue: "saved", viewMode: "cards", selectedRowIds: ["a"], rows: [{ secret: "private" }], error: "failure",
    }, options);
    expect(restored).toEqual({ paginationModel: { page: 0, pageSize: 10 }, sortRules: [{ field: "name", direction: "asc" }],
      filterRules: [{ field: "score", operator: "gt", value: "10" }], columnVisibilityModel: { name: true, score: false, actions: true },
      columnOrder: ["score", "name", "actions"], columnWidths: { score: 300 }, searchValue: "saved", viewMode: "cards" });
    expect(normalizeOwnedGridPersistedState({ paginationModel: { page: -1, pageSize: 10 }, searchValue: 2, viewMode: "unknown" }, options)).toEqual({});
  });
  it("migrates valid legacy list pagination before cards and rejects retired sort models", () => {
    const { values, options } = fixture();
    values.set("datagrid:courses:paginationModel", JSON.stringify({ page: 2, pageSize: 10 }));
    values.set("page:courses:cardsPaginationModel", JSON.stringify({ page: 4, pageSize: 250 }));
    values.set("page:courses:viewMode", JSON.stringify("cards"));
    values.set("page:courses:columnVisibilityModel", JSON.stringify({ score: false, ghost: false }));
    values.set("page:courses:sortModel", JSON.stringify([{ field: "name", sort: "asc" }]));
    expect(readOwnedGridPersistence(options)).toEqual({ paginationModel: { page: 2, pageSize: 10 }, viewMode: "cards", columnVisibilityModel: { name: true, score: false, actions: true } });
    values.set("datagrid:courses:paginationModel", "null");
    expect(readOwnedGridPersistence(options).paginationModel).toEqual({ page: 4, pageSize: 250 });
  });
  it("prefers the versioned envelope, rejects incompatible versions and survives invalid JSON/storage failures", () => {
    const { values, options } = fixture();
    values.set("datagrid:courses:paginationModel", JSON.stringify({ page: 2, pageSize: 10 }));
    values.set(ownedGridPersistenceKey("courses"), JSON.stringify({ version: 1, state: { paginationModel: { page: 8, pageSize: 250 } } }));
    expect(readOwnedGridPersistence(options).paginationModel?.page).toBe(8);
    values.set(ownedGridPersistenceKey("courses"), JSON.stringify({ version: 99 }));
    expect(readOwnedGridPersistence(options)).toEqual({});
    values.clear(); values.set(ownedGridPersistenceKey("courses"), "{malformed");
    expect(readOwnedGridPersistence(options)).toEqual({});
    const blocked = { getItem: () => { throw Error("blocked"); }, setItem: () => { throw Error("quota"); }, removeItem: () => { throw Error("blocked"); } };
    const { result } = renderHook(() => useOwnedGridPersistence({ ...options, persistence: { key: "blocked", storage: blocked } }));
    expect(result.current.defaults).toEqual({});
    expect(() => { result.current.persist({ searchValue: "ok" }); result.current.reset(); }).not.toThrow();
  });
  it("restores defaults once without overriding controlled concerns and persists only the resolved state", () => {
    const { values, options } = fixture();
    values.set(ownedGridPersistenceKey("courses"), JSON.stringify({ version: 1, state: { searchValue: "restored", paginationModel: { page: 3, pageSize: 10 } } }));
    const persistence = renderHook(() => useOwnedGridPersistence(options));
    const { result, rerender } = renderHook(({ searchValue }) => useOwnedGridController({ ...options,
      defaultSearchValue: persistence.result.current.defaults.searchValue,
      defaultPaginationModel: persistence.result.current.defaults.paginationModel, searchValue,
    }), { initialProps: { searchValue: "host" } });
    expect(persistence.result.current.ready).toBe(true);
    expect(result.current.state.searchValue).toBe("host");
    expect(result.current.state.paginationModel.page).toBe(3);
    act(() => result.current.dispatch({ type: "search", value: "request" }));
    persistence.result.current.persist(result.current.state);
    expect(JSON.parse(values.get(ownedGridPersistenceKey("courses"))!).state).toEqual({ searchValue: "host", paginationModel: { page: 0, pageSize: 10 }, sortRules: [], filterRules: [] });
    values.set(ownedGridPersistenceKey("courses"), JSON.stringify({ version: 1, state: { searchValue: "new disk" } }));
    rerender({ searchValue: "next host" });
    persistence.rerender();
    expect(persistence.result.current.defaults.searchValue).toBe("restored");
    expect(result.current.state.searchValue).toBe("next host");
  });
  it("keeps keys independent, excludes accidental extra properties and clears legacy keys on reset", () => {
    const { values, options, storage } = fixture();
    const { result } = renderHook(() => useOwnedGridPersistence(options));
    const { result: other } = renderHook(() => useOwnedGridPersistence({ ...options, persistence: { key: "other", storage } }));
    result.current.persist({ searchValue: "one", selectedRowIds: new Set(["private"]) } as never);
    other.current.persist({ searchValue: "two" });
    expect(JSON.parse(values.get(ownedGridPersistenceKey("courses"))!).state).toEqual({ searchValue: "one" });
    values.set("page:courses:cardsPaginationModel", "{}");
    result.current.reset();
    expect(values.has(ownedGridPersistenceKey("courses"))).toBe(false);
    expect(values.has("page:courses:cardsPaginationModel")).toBe(false);
    expect(JSON.parse(values.get(ownedGridPersistenceKey("other"))!).state.searchValue).toBe("two");
  });
  it("hydrates a saved view through a readiness gate without reading disk during SSR", async () => {
    const { values, options, storage } = fixture();
    values.set(ownedGridPersistenceKey("courses"), JSON.stringify({ version: 1, state: { searchValue: "saved view", paginationModel: { page: 2, pageSize: 10 } } }));
    const getItem = vi.spyOn(storage, "getItem");
    function Body({ defaults }: { defaults: ReturnType<typeof useOwnedGridPersistence>["defaults"] }) {
      const { state } = useOwnedGridController({ ...options, defaultSearchValue: defaults.searchValue, defaultPaginationModel: defaults.paginationModel });
      return <div>{state.searchValue}:{state.paginationModel.page}</div>;
    }
    function Harness() {
      const persistence = useOwnedGridPersistence(options);
      return persistence.ready ? <Body defaults={persistence.defaults} /> : <div role="status">Restoring view</div>;
    }
    const html = renderToString(<Harness />);
    expect(html).toContain("Restoring view");
    expect(getItem).not.toHaveBeenCalled();
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.append(container);
    const errors = vi.fn();
    const root = hydrateRoot(container, <Harness />, { onRecoverableError: errors });
    await waitFor(() => expect(container.textContent).toBe("saved view:2"));
    expect(errors).not.toHaveBeenCalled();
    act(() => root.unmount());
    container.remove();
    const disabled = renderHook(() => useOwnedGridPersistence({ columns }));
    expect(disabled.result.current.ready).toBe(true);
  });
  it("does not access storage without a nonempty per-view key", () => {
    const getItem = vi.fn();
    const { options } = fixture();
    expect(readOwnedGridPersistence({ ...options, persistence: { key: " ", storage: { getItem, setItem: vi.fn(), removeItem: vi.fn() } } })).toEqual({});
    expect(getItem).not.toHaveBeenCalled();
  });
});
