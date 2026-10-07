// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { normalizeCardPagination } from "../CardPaginationFooter/pagination";
import { useOwnedGridController, type OwnedGridControllerOptions } from "./ownedGridController";
import { processOwnedGridRows } from "./ownedGridModel";

type Row = { id: string; name: string };
const rows: Row[] = Array.from({ length: 41 }, (_, index) => ({ id: String(index), name: `Course ${index}` }));
const columns = [{ field: "name" }];
type Options = OwnedGridControllerOptions<Row> & { rows: Row[]; mode?: "client" | "server" };

// Compose the real controller, row processor and footer display normalization.
// Known totals for requests are explicitly supplied by this host fixture.
function usePage(options: Options) {
  const controller = useOwnedGridController(options);
  const processed = processOwnedGridRows({ ...options, ...controller.state });
  const displayed = normalizeCardPagination(processed.paginationModel.page, processed.paginationModel.pageSize, processed.rowCount);
  return { ...controller, processed, displayed };
}

const base: Options = { rows, columns, pageSizeOptions: [10], defaultPaginationModel: { page: 3, pageSize: 10 } };

describe("page shrink across criteria, processing and display", () => {
  it("keeps dataset replacement separate from a host-supplied bounded local transaction", () => {
    const onStateChange = vi.fn(); const onPaginationModelChange = vi.fn();
    const props = { ...base, rowCount: rows.length, defaultSelectedRowIds: new Set(["40"]), onStateChange, onPaginationModelChange };
    const { result, rerender } = renderHook(usePage, { initialProps: props });
    expect(result.current.processed.rowIds).toEqual(rows.slice(30, 40).map(row => row.id));
    rerender({ ...props, rows: rows.slice(0, 11), rowCount: 11 });
    expect(result.current.state.paginationModel.page).toBe(3);
    expect(result.current.displayed.page).toBe(1);
    expect(onStateChange).not.toHaveBeenCalled();
    act(() => result.current.dispatch({ type: "page", value: result.current.state.paginationModel.page }));
    expect(result.current.state.paginationModel.page).toBe(1);
    expect(result.current.processed.rowIds).toEqual(["10"]);
    expect(result.current.displayed.page).toBe(1);
    expect(onPaginationModelChange).toHaveBeenCalledExactlyOnceWith({ page: 1, pageSize: 10 });
    expect(onStateChange).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
      paginationModel: { page: 1, pageSize: 10 }, selectedRowIds: new Set(["40"]),
    }));
    rerender({ ...props, rows: [], rowCount: 0 });
    act(() => result.current.dispatch({ type: "page", value: 1 }));
    expect(result.current.state.paginationModel.page).toBe(0);
    expect(result.current.processed.rows).toEqual([]);
    expect(result.current.displayed).toMatchObject({ page: 0, count: 0, pageCount: 0 });
    expect(result.current.state.selectedRowIds).toEqual(new Set(["40"]));
  });

  it("does not turn display clamping or a rejected request into controlled host acceptance", () => {
    const onStateChange = vi.fn(); const onPaginationModelChange = vi.fn();
    const props = { ...base, paginationModel: { page: 3, pageSize: 10 }, rowCount: 41, onStateChange, onPaginationModelChange };
    const shrunk = { ...props, rows: rows.slice(0, 11), rowCount: 11 };
    const { result, rerender } = renderHook(usePage, { initialProps: props });
    rerender(shrunk);
    expect(result.current.displayed.page).toBe(1);
    expect(onPaginationModelChange).not.toHaveBeenCalled();
    act(() => result.current.dispatch({ type: "pagination", value: { page: 99, pageSize: 10 } }));
    expect(onPaginationModelChange).toHaveBeenCalledExactlyOnceWith({ page: 1, pageSize: 10 });
    expect(onStateChange).toHaveBeenCalledTimes(1);
    rerender({ ...shrunk }); // Host rejects the request by retaining its authoritative model.
    expect(result.current.state.paginationModel).toEqual(props.paginationModel);
    expect(result.current.processed.paginationModel).toEqual(props.paginationModel);
    expect(result.current.displayed.page).toBe(1);
    expect(onStateChange).toHaveBeenCalledTimes(1);
    rerender({ ...shrunk, paginationModel: { page: 1, pageSize: 10 } });
    expect(result.current.processed.rowIds).toEqual(["10"]);
    expect(result.current.state.paginationModel.page).toBe(result.current.displayed.page);
    expect(onStateChange).toHaveBeenCalledTimes(1);
  });

  it("preserves server rows through known-to-unknown totals without inferring their length as a total", () => {
    const onStateChange = vi.fn();
    const props: Options = { ...base, mode: "server", rows: rows.slice(30, 32), paginationModel: { page: 3, pageSize: 10 }, rowCount: 41, onStateChange };
    const { result, rerender } = renderHook(usePage, { initialProps: props });
    rerender({ ...props, rowCount: 11 });
    expect(result.current.displayed.page).toBe(1);
    expect(result.current.processed.rows).toEqual(props.rows);
    expect(onStateChange).not.toHaveBeenCalled();
    rerender({ ...props, rowCount: undefined, hasNextPage: false });
    expect(result.current.displayed).toMatchObject({ page: 3, count: undefined });
    expect(result.current.processed.rows).toEqual(props.rows);
    act(() => result.current.dispatch({ type: "page", value: 4 }));
    expect(onStateChange).toHaveBeenLastCalledWith(expect.objectContaining({ paginationModel: { page: 3, pageSize: 10 } }));
    rerender({ ...props, rowCount: undefined, hasNextPage: true });
    act(() => result.current.dispatch({ type: "page", value: 4 }));
    expect(onStateChange).toHaveBeenLastCalledWith(expect.objectContaining({ paginationModel: { page: 4, pageSize: 10 } }));
    expect(result.current.state.paginationModel.page).toBe(3);
    expect(result.current.processed.rows).toEqual(props.rows);
  });
});
