import { describe, expect, it } from "vitest";
import { getOwnedGridPageSelection, notifyOwnedGridTransition, selectOwnedGridPage, transitionOwnedGridState, type OwnedGridCriteriaState, type OwnedGridTransition } from "./ownedGridState";

const initial = (): OwnedGridCriteriaState => ({ paginationModel: { page: 3, pageSize: 10 }, searchValue: "", sortRules: [], filterRules: [], selectedRowIds: new Set(["off-page", "a"]) });
const options = { columns: [{ field: "name" }, { field: "hidden", sortable: false }], pageSizeOptions: [10, 250] };

describe("owned grid transactions", () => {
  it.each<OwnedGridTransition>([{ type: "search", value: "course" }, { type: "sort", value: [{ field: "name", direction: "asc" }] }, { type: "filter", value: [{ field: "name", operator: "contains", value: "course" }] }])("resets page before criterion and emits one combined snapshot: $type", action => {
    const previous = initial();
    const next = transitionOwnedGridState(previous, action, options);
    const calls: string[] = [];
    notifyOwnedGridTransition(previous, next, action, {
      onPaginationModelChange: model => { expect(model.page).toBe(0); calls.push("page"); },
      onSearchChange: () => calls.push("criterion"), onSortRulesChange: () => calls.push("criterion"), onFilterRulesChange: () => calls.push("criterion"),
      onStateChange: snapshot => { expect(snapshot.paginationModel.page).toBe(0); calls.push("combined"); },
    });
    expect(calls).toEqual(["page", "criterion", "combined"]);
    expect(previous.paginationModel.page).toBe(3);
    expect(next.selectedRowIds).toEqual(previous.selectedRowIds);
  });
  it("does not issue redundant page reset when already on page zero", () => {
    const previous = { ...initial(), paginationModel: { page: 0, pageSize: 10 } };
    const action = { type: "search", value: "new" } as const;
    const calls: string[] = [];
    notifyOwnedGridTransition(previous, transitionOwnedGridState(previous, action, options), action, {
      onPaginationModelChange: () => calls.push("page"), onSearchChange: () => calls.push("search"), onStateChange: () => calls.push("combined"),
    });
    expect(calls).toEqual(["search", "combined"]);
  });
  it("cleans stale and duplicate sort fields before processing or host requests", () => {
    expect(transitionOwnedGridState(initial(), { type: "sort", value: [{ field: "stale", direction: "asc" }, { field: "hidden", direction: "asc" }, { field: "name", direction: "desc" }, { field: "name", direction: "asc" }] }, options).sortRules).toEqual([{ field: "name", direction: "desc" }]);
  });
  it("allows custom sizes above retired engine limits and resets once", () => {
    expect(transitionOwnedGridState(initial(), { type: "pageSize", value: 250 }, options).paginationModel).toEqual({ page: 0, pageSize: 250 });
  });
  it("clamps known totals but never treats an unknown loaded page as a total", () => {
    expect(transitionOwnedGridState(initial(), { type: "page", value: 99 }, { ...options, rowCount: 41 }).paginationModel.page).toBe(4);
    expect(transitionOwnedGridState(initial(), { type: "page", value: 4 }, options).paginationModel.page).toBe(4);
    expect(transitionOwnedGridState(initial(), { type: "page", value: 4 }, { ...options, hasNextPage: false }).paginationModel.page).toBe(3);
    expect(transitionOwnedGridState(initial(), { type: "page", value: 2 }, { ...options, hasNextPage: false }).paginationModel.page).toBe(2);
  });
  it.each([
    { rowCount: 0, requested: 3, expected: 0 },
    { rowCount: 10, requested: 3, expected: 0 },
    { rowCount: 11, requested: 3, expected: 1 },
    { rowCount: 30, requested: 3, expected: 2 },
    { rowCount: 31, requested: 3, expected: 3 },
    { rowCount: -1, requested: 4, expected: 4 },
    { rowCount: NaN, requested: 4, expected: 4 },
    { rowCount: 1.5, requested: 4, expected: 4 },
  ])("atomically bounds page requests for total $rowCount", ({ rowCount, requested, expected }) => {
    const previous = initial();
    const action = { type: "pagination", value: { page: requested, pageSize: 10 } } as const;
    const next = transitionOwnedGridState(previous, action, { ...options, rowCount, hasNextPage: true });
    const calls: string[] = [];
    notifyOwnedGridTransition(previous, next, action, {
      onPaginationModelChange: model => { calls.push("page"); expect(model).toEqual({ page: expected, pageSize: 10 }); },
      onStateChange: snapshot => { calls.push("combined"); expect(snapshot).toEqual({ ...previous, paginationModel: { page: expected, pageSize: 10 } }); },
    });
    expect(calls).toEqual(expected === previous.paginationModel.page ? ["combined"] : ["page", "combined"]);
    expect(previous.paginationModel).toEqual({ page: 3, pageSize: 10 });
    expect(next.selectedRowIds).toEqual(new Set(["off-page", "a"]));
  });
  it("isolates callbacks from the transaction snapshot", () => {
    const previous = initial();
    const action = { type: "sort", value: [{ field: "name", direction: "asc" }] } as const;
    const next = transitionOwnedGridState(previous, action, options);
    notifyOwnedGridTransition(previous, next, action, { onPaginationModelChange: model => { model.page = 100; }, onSortRulesChange: rules => rules.pop(), onStateChange: snapshot => { (snapshot.selectedRowIds as Set<string>).clear(); } });
    expect(next.paginationModel.page).toBe(0);
    expect(next.sortRules).toHaveLength(1);
    expect(next.selectedRowIds.size).toBe(2);
  });
});

describe("current selectable page selection", () => {
  it("retains off-page and disabled selected IDs on select/unselect", () => {
    const retained = new Set(["off-page", "disabled", "a"]);
    expect(selectOwnedGridPage(retained, ["a", "b"], true)).toEqual(new Set(["off-page", "disabled", "a", "b"]));
    expect(selectOwnedGridPage(retained, ["a", "b"], false)).toEqual(new Set(["off-page", "disabled"]));
    expect(retained.size).toBe(3);
  });
  it("computes mixed selection only against unique selectable IDs", () => {
    expect(getOwnedGridPageSelection(new Set(["off-page"]), [])).toBe("none");
    expect(getOwnedGridPageSelection(new Set(["a"]), ["a", "a"])).toBe("all");
    expect(getOwnedGridPageSelection(new Set(["a"]), ["a", "b"])).toBe("some");
  });
});
