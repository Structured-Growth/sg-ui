// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { OwnedGridPresentationColumn } from "./ownedGridColumns";
import { useOwnedGridLayoutController, type OwnedGridLayoutControllerOptions } from "./ownedGridLayoutController";

afterEach(cleanup);
const columns: OwnedGridPresentationColumn<unknown>[] = [
  { field: "name", cellType: "text" },
  { field: "score", cellType: "custom", minWidth: 90, maxWidth: 200 },
  { field: "status" },
  { field: "actions", cellType: "menu" },
];

describe("owned grid layout controller", () => {
  it("seeds defaults once and keeps callback-only concerns editable", () => {
    const visibility = vi.fn();
    const order = vi.fn();
    const widths = vi.fn();
    const { result, rerender } = renderHook((options: OwnedGridLayoutControllerOptions<unknown>) => useOwnedGridLayoutController(options), {
      initialProps: { columns, defaultColumnVisibilityModel: { status: false }, defaultColumnOrder: ["score", "name"], defaultColumnWidths: { score: 100 },
        onColumnVisibilityModelChange: visibility, onColumnOrderChange: order, onColumnWidthsChange: widths },
    });
    expect(result.current.layout.visibility.status).toBe(false);
    act(() => {
      result.current.setVisibility({ score: false, status: true });
      result.current.setOrder(["status", "score", "name"]);
      result.current.setWidths({ score: 150 });
    });
    rerender({ columns, defaultColumnVisibilityModel: { status: false }, defaultColumnOrder: ["name"], defaultColumnWidths: { score: 190 },
      onColumnVisibilityModelChange: visibility, onColumnOrderChange: order, onColumnWidthsChange: widths });
    expect(result.current.layout).toMatchObject({ visibility: { name: true, score: false, status: true, actions: true },
      order: ["status", "score", "name", "actions"], widths: { score: 150 } });
    expect(visibility).toHaveBeenCalledOnce();
    expect(order).toHaveBeenCalledWith(["status", "score", "name", "actions"]);
    expect(widths).toHaveBeenCalledWith({ score: 150 });
  });

  it("keeps controlled values authoritative without freezing other concerns", () => {
    const visibility = vi.fn();
    const widths = vi.fn();
    const { result, rerender } = renderHook((options: OwnedGridLayoutControllerOptions<unknown>) => useOwnedGridLayoutController(options), {
      initialProps: { columns, columnVisibilityModel: { status: false }, columnWidths: { score: 110 },
        onColumnVisibilityModelChange: visibility, onColumnWidthsChange: widths },
    });
    act(() => {
      result.current.setVisibility({ status: true });
      result.current.setWidths({ score: 170 });
      result.current.setOrder(["score", "status", "name"]);
    });
    expect(result.current.layout.visibility.status).toBe(false);
    expect(result.current.layout.widths).toEqual({ score: 110 });
    expect(result.current.layout.order).toEqual(["score", "status", "name", "actions"]);
    expect(visibility).toHaveBeenCalledWith({ name: true, score: true, status: true, actions: true });
    expect(widths).toHaveBeenCalledWith({ score: 170 });
    rerender({ columns, columnVisibilityModel: { status: true }, columnWidths: { score: 170 },
      onColumnVisibilityModelChange: visibility, onColumnWidthsChange: widths });
    expect(result.current.layout.visibility.status).toBe(true);
    expect(result.current.layout.widths).toEqual({ score: 170 });
  });

  it("normalizes controlled inputs and requests with locks, bounds and declared fields", () => {
    const order = vi.fn();
    const widths = vi.fn();
    const { result } = renderHook(() => useOwnedGridLayoutController({ columns,
      columnVisibilityModel: { name: false, actions: false, missing: false },
      columnOrder: ["actions", "score", "score", "missing"], columnWidths: { score: 1000, missing: 100, name: NaN },
      onColumnOrderChange: order, onColumnWidthsChange: widths }));
    expect(result.current.layout).toEqual({ visibility: { name: true, score: true, status: true, actions: true },
      order: ["score", "name", "status", "actions"], widths: { score: 200 }, lockedFields: ["name", "actions"] });
    act(() => {
      result.current.setOrder(["actions", "missing", "status", "status"]);
      result.current.setWidths({ score: 1, name: Infinity, status: -100, missing: 100 });
    });
    expect(order).toHaveBeenCalledWith(["status", "name", "score", "actions"]);
    expect(widths).toHaveBeenCalledWith({ score: 90 });
  });

  it("treats empty controlled values as authoritative and controls order independently", () => {
    const order = vi.fn();
    const { result, rerender } = renderHook((options: OwnedGridLayoutControllerOptions<unknown>) => useOwnedGridLayoutController(options), {
      initialProps: { columns, columnOrder: [], columnWidths: {}, columnVisibilityModel: {},
        defaultColumnOrder: ["score", "name"], defaultColumnWidths: { score: 150 }, defaultColumnVisibilityModel: { status: false },
        onColumnOrderChange: order },
    });
    act(() => {
      result.current.setOrder(["status", "score"]);
      result.current.setWidths({ score: 180 });
      result.current.setVisibility({ status: false });
    });
    expect(result.current.layout.order).toEqual(["name", "score", "status", "actions"]);
    expect(result.current.layout.widths).toEqual({});
    expect(result.current.layout.visibility.status).toBe(true);
    expect(order).toHaveBeenCalledWith(["status", "score", "name", "actions"]);
    rerender({ columns, columnOrder: ["status", "score"], columnWidths: {}, columnVisibilityModel: {},
      defaultColumnOrder: ["score", "name"], defaultColumnWidths: { score: 150 }, defaultColumnVisibilityModel: { status: false },
      onColumnOrderChange: order });
    expect(result.current.layout.order).toEqual(["status", "score", "name", "actions"]);
  });

  it("reconciles layout when column definitions change", () => {
    const { result, rerender } = renderHook(({ definitions }) => useOwnedGridLayoutController({ columns: definitions,
      defaultColumnVisibilityModel: { status: false }, defaultColumnOrder: ["score", "status", "name"], defaultColumnWidths: { score: 180 } }),
    { initialProps: { definitions: columns } });
    rerender({ definitions: [{ field: "name" }, { field: "category" }, { field: "actions", cellType: "menu" }] });
    expect(result.current.layout).toEqual({ visibility: { name: true, category: true, actions: true },
      order: ["name", "category", "actions"], widths: {}, lockedFields: ["name", "actions"] });
  });

  it("isolates local state from caller and callback mutations", () => {
    const defaults = { score: 100 };
    const requested = { score: 150 };
    const { result } = renderHook(() => useOwnedGridLayoutController({ columns, defaultColumnWidths: defaults,
      onColumnWidthsChange: value => { value.score = 199; } }));
    defaults.score = 190;
    act(() => result.current.setWidths(requested));
    requested.score = 195;
    expect(result.current.layout.widths).toEqual({ score: 150 });
  });
});
