// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useOwnedGridController, type OwnedGridControllerOptions } from "./ownedGridController";

const base: OwnedGridControllerOptions<{ name: string }> = { columns: [{ field: "name" }], pageSizeOptions: [10, 250] };

describe("owned grid concern controllers", () => {
  it("preserves criteria references on selection and unrelated parent renders", () => {
    const { result, rerender } = renderHook(props => useOwnedGridController(props), { initialProps: {
      ...base, defaultSortRules: [{ field: "name", direction: "asc" as const }],
      defaultFilterRules: [{ field: "name", operator: "contains" as const, value: "course" }],
    } });
    const initial = result.current.state;
    act(() => result.current.dispatch({ type: "selection", value: new Set(["a"]) }));
    expect(result.current.state.selectedRowIds).not.toBe(initial.selectedRowIds);
    expect(result.current.state.paginationModel).toBe(initial.paginationModel);
    expect(result.current.state.sortRules).toBe(initial.sortRules);
    expect(result.current.state.filterRules).toBe(initial.filterRules);
    const selected = result.current.state;
    rerender({ ...base, defaultSortRules: [], defaultFilterRules: [] });
    expect(result.current.state).toBe(selected);
    act(() => result.current.dispatch({ type: "sort", value: [{ field: "name", direction: "desc" }] }));
    expect(result.current.state.sortRules).not.toBe(initial.sortRules);
    expect(result.current.state.paginationModel).toBe(initial.paginationModel);
    expect(result.current.state.filterRules).toBe(initial.filterRules);
    expect(result.current.state.selectedRowIds).toBe(selected.selectedRowIds);
  });

  it("seeds defaults once and callbacks alone observe committed local changes", () => {
    const onSearchChange = vi.fn();
    const { result, rerender } = renderHook(props => useOwnedGridController(props), { initialProps: { ...base, defaultSearchValue: "initial", onSearchChange } });
    act(() => result.current.dispatch({ type: "search", value: "edited" }));
    rerender({ ...base, defaultSearchValue: "replacement", onSearchChange });
    expect(result.current.state.searchValue).toBe("edited");
    expect(onSearchChange).toHaveBeenCalledExactlyOnceWith("edited");
  });

  it("keeps each controlled value authoritative while committing other concerns", () => {
    const onStateChange = vi.fn();
    const { result, rerender } = renderHook(props => useOwnedGridController(props), { initialProps: {
      ...base, paginationModel: { page: 3, pageSize: 10 }, searchValue: "host", onStateChange,
    } });
    act(() => result.current.dispatch({ type: "sort", value: [{ field: "name", direction: "desc" }] }));
    expect(result.current.state.paginationModel.page).toBe(3);
    expect(result.current.state.sortRules).toEqual([{ field: "name", direction: "desc" }]);
    expect(onStateChange.mock.calls[0]![0].paginationModel.page).toBe(0);
    act(() => result.current.dispatch({ type: "search", value: "request" }));
    expect(result.current.state.searchValue).toBe("host");
    rerender({ ...base, paginationModel: { page: 0, pageSize: 10 }, searchValue: "accepted", onStateChange });
    expect(result.current.state.searchValue).toBe("accepted");
    expect(result.current.state.paginationModel.page).toBe(0);
  });

  it("does not mutate controlled collections or commit requested collections", () => {
    const selectedRowIds = new Set(["host"]);
    const sortRules = [{ field: "name", direction: "asc" as const }];
    const filterRules = [{ field: "name", operator: "contains" as const, value: "host" }];
    const onStateChange = vi.fn(snapshot => { snapshot.sortRules.length = 0; snapshot.filterRules.length = 0; snapshot.selectedRowIds.clear(); });
    const { result } = renderHook(() => useOwnedGridController({ ...base, selectedRowIds, sortRules, filterRules, onStateChange }));
    act(() => {
      result.current.dispatch({ type: "selection", value: new Set(["requested"]) });
      result.current.dispatch({ type: "sort", value: [] });
      result.current.dispatch({ type: "filter", value: [] });
    });
    expect(result.current.state.selectedRowIds).toEqual(new Set(["host"]));
    expect(result.current.state.sortRules).toEqual(sortRules);
    expect(result.current.state.filterRules).toEqual(filterRules);
    expect(selectedRowIds).toEqual(new Set(["host"]));
    expect(sortRules).toHaveLength(1);
    expect(filterRules).toHaveLength(1);
  });

  it("notifies reset before criterion and one combined request containing both", () => {
    const calls: string[] = [];
    const { result } = renderHook(() => useOwnedGridController({ ...base, defaultPaginationModel: { page: 2, pageSize: 10 },
      onPaginationModelChange: model => { calls.push("page"); expect(model.page).toBe(0); },
      onFilterRulesChange: () => calls.push("filter"),
      onStateChange: snapshot => { calls.push("combined"); expect(snapshot.paginationModel.page).toBe(0); expect(snapshot.filterRules[0]?.value).toBe("course"); },
    }));
    act(() => result.current.dispatch({ type: "filter", value: [{ field: "name", operator: "contains", value: "course" }] }));
    expect(calls).toEqual(["page", "filter", "combined"]);
  });

  it("supports successive local transactions in one event and isolates returned state", () => {
    const defaults = new Set(["retained"]);
    const { result } = renderHook(() => useOwnedGridController({ ...base, defaultSelectedRowIds: defaults }));
    defaults.clear();
    result.current.state.selectedRowIds = new Set();
    act(() => {
      result.current.dispatch({ type: "search", value: "course" });
      result.current.dispatch({ type: "page", value: 2 });
    });
    expect(result.current.state.searchValue).toBe("course");
    expect(result.current.state.paginationModel.page).toBe(2);
    expect(result.current.state.selectedRowIds).toEqual(new Set(["retained"]));
  });

  it("accepts a footer page/size action once and resets on size changes", () => {
    const onPaginationModelChange = vi.fn(); const onStateChange = vi.fn();
    const { result } = renderHook(() => useOwnedGridController({ ...base, defaultPaginationModel: { page: 4, pageSize: 10 }, onPaginationModelChange, onStateChange }));
    act(() => result.current.dispatch({ type: "pagination", value: { page: 4, pageSize: 250 } }));
    expect(result.current.state.paginationModel).toEqual({ page: 0, pageSize: 250 });
    expect(onPaginationModelChange).toHaveBeenCalledExactlyOnceWith({ page: 0, pageSize: 250 });
    expect(onStateChange).toHaveBeenCalledTimes(1);
  });

  it("normalizes obsolete local page sizes when options change", () => {
    const onPaginationModelChange = vi.fn();
    const { result, rerender } = renderHook(props => useOwnedGridController(props), { initialProps: { ...base, defaultPaginationModel: { page: 3, pageSize: 10 }, onPaginationModelChange } });
    rerender({ ...base, pageSizeOptions: [250], defaultPaginationModel: { page: 3, pageSize: 10 }, onPaginationModelChange });
    expect(result.current.state.paginationModel).toEqual({ page: 0, pageSize: 250 });
    expect(onPaginationModelChange).toHaveBeenCalledExactlyOnceWith({ page: 0, pageSize: 250 });
  });

  it("requests obsolete controlled size once until host changes its authoritative value", () => {
    const onPaginationModelChange = vi.fn();
    const props = { ...base, paginationModel: { page: 3, pageSize: 10 }, onPaginationModelChange };
    const { result, rerender } = renderHook(options => useOwnedGridController(options), { initialProps: props });
    rerender({ ...props, pageSizeOptions: [250] });
    rerender({ ...props, pageSizeOptions: [250] });
    expect(result.current.state.paginationModel).toEqual(props.paginationModel);
    expect(onPaginationModelChange).toHaveBeenCalledExactlyOnceWith({ page: 0, pageSize: 250 });
    rerender({ ...props, pageSizeOptions: [250], paginationModel: { page: 0, pageSize: 250 } });
    expect(result.current.state.paginationModel.pageSize).toBe(250);
  });
});
