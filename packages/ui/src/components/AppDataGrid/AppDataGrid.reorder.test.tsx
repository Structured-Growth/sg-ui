// @vitest-environment jsdom
import { render, screen, cleanup, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppDataGrid, type AppDataGridProps } from "./AppDataGrid";
import { Provider } from "../../experimental/Provider/Provider";

afterEach(cleanup);
const rows = [{ id: 1, key: "alpha", name: "Course 1" }, { id: 2, key: "beta", name: "Course 2" }, { id: 3, key: "gamma", name: "Course 3" }];
type Row = typeof rows[number];
const base: AppDataGridProps<Row> = {
  rows, columns: [{ field: "name", headerName: "Course" }], label: "Courses",
  getRowLabel: row => row.name, defaultPaginationModel: { page: 0, pageSize: 5 }, pageSizeOptions: [2, 5],
};
const grid = (extra: Partial<AppDataGridProps<Row>>) => <Provider><AppDataGrid {...base} {...extra} /></Provider>;
const move = (name: string) => screen.getByRole("button", { name }) as HTMLButtonElement;

describe("AppDataGrid public row reorder", () => {
  it("requests exact string IDs and host rows without mutating their order", async () => {
    const onReorder = vi.fn();
    render(grid({ rowDrag: { onReorder } }));
    expect(move("Move Course 1 up").disabled).toBe(true);
    expect(move("Move Course 3 down").disabled).toBe(true);
    await userEvent.click(move("Move Course 2 up"));
    expect(onReorder).toHaveBeenLastCalledWith({ sourceRow: rows[1], sourceRowId: "2", targetRow: rows[0], targetRowId: "1", position: "before" });
    await userEvent.click(move("Move Course 2 down"));
    expect(onReorder).toHaveBeenLastCalledWith({ sourceRow: rows[1], sourceRowId: "2", targetRow: rows[2], targetRowId: "3", position: "after" });
    expect(onReorder).toHaveBeenCalledTimes(2);
    expect(screen.getAllByRole("row").slice(1).map(row => row.textContent?.match(/Course \d/)?.[0])).toEqual(["Course 1", "Course 2", "Course 3"]);
  });

  it("uses getRowId for requests and retains source-control focus through host commit and rollback", async () => {
    const onReorder = vi.fn(); const getRowId = (row: Row) => row.key;
    const fourth = { id: 4, key: "delta", name: "Course 4" };
    const original = [...rows, fourth];
    const props = { rows: original, getRowId, rowDrag: { onReorder } };
    const view = render(grid(props));
    await userEvent.click(move("Move Course 2 down"));
    expect(onReorder).toHaveBeenCalledWith({ sourceRow: rows[1], sourceRowId: "beta", targetRow: rows[2], targetRowId: "gamma", position: "after" });
    view.rerender(grid({ ...props, rows: [rows[0]!, rows[2]!, rows[1]!, fourth] }));
    await waitFor(() => expect(document.activeElement?.getAttribute("aria-label")).toBe("Move Course 2 down"));
    view.rerender(grid({ ...props, rows: original.map(row => ({ ...row })) }));
    await waitFor(() => expect(document.activeElement?.getAttribute("aria-label")).toBe("Move Course 2 down"));
    expect(screen.getAllByRole("row").slice(1).map(row => row.textContent?.match(/Course \d/)?.[0])).toEqual(["Course 1", "Course 2", "Course 3", "Course 4"]);
    expect(onReorder).toHaveBeenCalledTimes(1);
  });

  it("disables a host-declared non-draggable source while allowing other sources", async () => {
    const onReorder = vi.fn();
    render(grid({ rowDrag: { onReorder, isRowDraggable: row => row.id !== 2 } }));
    for (const name of ["Reorder Course 2", "Move Course 2 up", "Move Course 2 down"]) expect(move(name).disabled).toBe(true);
    await userEvent.click(move("Move Course 2 up"));
    expect(onReorder).not.toHaveBeenCalled();
    await userEvent.click(move("Move Course 1 down"));
    expect(onReorder).toHaveBeenCalledWith(expect.objectContaining({ sourceRowId: "1", targetRowId: "2" }));
  });

  it("restores focus to the source drag handle when its move control becomes disabled", async () => {
    const onReorder = vi.fn(); const props = { rowDrag: { onReorder } };
    const view = render(grid(props));
    await userEvent.click(move("Move Course 2 down"));
    view.rerender(grid({ ...props, rows: [rows[0]!, rows[2]!, rows[1]!] }));
    await waitFor(() => expect(document.activeElement).toBe(move("Reorder Course 2")));
    expect(move("Move Course 2 down").disabled).toBe(true);
  });

  it("preserves external focus when the host commits a pending reorder", async () => {
    const onReorder = vi.fn(); const props = { rowDrag: { onReorder } };
    const composition = (orderedRows: Row[]) => <>{grid({ ...props, rows: orderedRows })}<button>Outside grid</button></>;
    const view = render(composition(rows));
    await userEvent.click(move("Move Course 2 down"));
    const outside = screen.getByRole("button", { name: "Outside grid" });
    await userEvent.click(outside);
    view.rerender(composition([rows[0]!, rows[2]!, rows[1]!]));
    // Wait for the grid's deferred collection/focus repair to have run.
    await act(async () => { await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
    expect(document.activeElement).toBe(outside);
    expect(onReorder).toHaveBeenCalledTimes(1);
  });

  it("retains the source control through a host pending phase and async commit", async () => {
    const onReorder = vi.fn(); const fourth = { id: 4, key: "delta", name: "Course 4" };
    const original = [...rows, fourth]; const props = { rows: original, rowDrag: { onReorder } };
    const view = render(grid(props));
    await userEvent.click(move("Move Course 2 down"));
    view.rerender(grid({ ...props, refreshing: true }));
    expect(move("Move Course 2 down").disabled).toBe(true);
    await act(async () => { await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
    view.rerender(grid({ ...props, rows: [rows[0]!, rows[2]!, rows[1]!, fourth], refreshing: false }));
    await waitFor(() => expect(document.activeElement).toBe(move("Move Course 2 down")));
    expect(onReorder).toHaveBeenCalledTimes(1);
  });

  it("restores the source control after a pending optimistic reorder rolls back to the exact original array", async () => {
    const onReorder = vi.fn(); const fourth = { id: 4, key: "delta", name: "Course 4" };
    const original = [...rows, fourth]; const props = { rows: original, rowDrag: { onReorder } };
    const view = render(grid(props));
    await userEvent.click(move("Move Course 2 down"));
    view.rerender(grid({ ...props, rows: [rows[0]!, rows[2]!, rows[1]!, fourth], refreshing: true }));
    await act(async () => { await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
    expect(move("Move Course 2 down").disabled).toBe(true);
    view.rerender(grid({ ...props, rows: original, refreshing: false }));
    await waitFor(() => expect(document.activeElement).toBe(move("Move Course 2 down")));
    expect(screen.getAllByRole("row").slice(1).map(row => row.textContent?.match(/Course \d/)?.[0])).toEqual(["Course 1", "Course 2", "Course 3", "Course 4"]);
    expect(onReorder).toHaveBeenCalledTimes(1);
  });

  it.each<[string, Partial<AppDataGridProps<Row>>]>([
    ["sorted", { sortRules: [{ field: "name", direction: "asc" }] }],
    ["searched", { searchValue: "Course" }],
    ["filtered", { filterRules: [{ field: "name", operator: "contains", value: "Course" }] }],
    ["multiple pages", { paginationModel: { page: 0, pageSize: 2 } }],
    ["server pages", { mode: "server", rowCount: 3 }],
    ["loading", { loading: true }],
    ["refreshing", { refreshing: true }],
    ["failed", { errorMessage: "Refresh failed" }],
    ["multiple selected rows", { selection: { selectedRowIds: new Set(["1", "2"]) } }],
  ])("disables reorder for %s collections", async (_name, extra) => {
    const onReorder = vi.fn(); render(grid({ ...extra, rowDrag: { onReorder } }));
    for (const button of screen.getAllByRole("button", { name: /^(Reorder Course|Move Course)/ })) expect((button as HTMLButtonElement).disabled).toBe(true);
    await userEvent.click(move("Move Course 1 down"));
    expect(onReorder).not.toHaveBeenCalled();
  });

  it("cancels a keyboard drag without requesting a host reorder", async () => {
    const onReorder = vi.fn(); render(grid({ rowDrag: { onReorder } }));
    const handle = move("Reorder Course 2"); await act(async () => handle.focus());
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(document.activeElement?.getAttribute("aria-roledescription")).toBe("drop indicator"));
    await userEvent.keyboard("{Escape}");
    expect(onReorder).not.toHaveBeenCalled();
    await waitFor(() => expect(document.activeElement).toBe(handle));
  });

  it("returns cancellation focus to an unselected drag source when another row is selected", async () => {
    const onReorder = vi.fn();
    render(grid({ selection: { selectedRowIds: new Set(["1"]) }, rowDrag: { onReorder } }));
    await userEvent.tab();
    const handle = move("Reorder Course 2");
    await act(async () => handle.focus());
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(document.activeElement?.getAttribute("aria-roledescription")).toBe("drop indicator"));
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(document.activeElement).toBe(handle));
    expect(onReorder).not.toHaveBeenCalled();
    expect((screen.getByRole("checkbox", { name: "Select Course 1" }) as HTMLInputElement).checked).toBe(true);
  });

  it("requests a keyboard drop using the same public row identity", async () => {
    const onReorder = vi.fn(); render(grid({ getRowId: row => row.key, rowDrag: { onReorder } }));
    await userEvent.tab();
    await act(async () => move("Reorder Course 2").focus());
    expect(document.activeElement).toBe(move("Reorder Course 2"));
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(document.activeElement?.getAttribute("aria-roledescription")).toBe("drop indicator"));
    await userEvent.keyboard("{ArrowDown}{ArrowDown}");
    await waitFor(() => expect(document.activeElement?.getAttribute("aria-label")).toBe("Insert after Course 3"));
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(onReorder).toHaveBeenCalledTimes(1));
    expect(onReorder).toHaveBeenCalledWith({ sourceRow: rows[1], sourceRowId: "beta", targetRow: rows[2], targetRowId: "gamma", position: "after" });
  });

  it("rejects a keyboard drop captured before host replacement of the dataset", async () => {
    const onReorder = vi.fn(); const getRowId = (row: Row) => row.key;
    const props = { getRowId, rowDrag: { onReorder } }; const view = render(grid(props));
    await userEvent.tab();
    await act(async () => move("Reorder Course 2").focus());
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(document.activeElement?.getAttribute("aria-roledescription")).toBe("drop indicator"));
    await userEvent.keyboard("{ArrowDown}{ArrowDown}");
    await waitFor(() => expect(document.activeElement?.getAttribute("aria-label")).toBe("Insert after Course 3"));
    view.rerender(grid({ ...props, rows: rows.map(row => ({ ...row })) }));
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(document.activeElement?.getAttribute("aria-roledescription")).not.toBe("drop indicator"));
    expect(onReorder).not.toHaveBeenCalled();
  });

  it("does not request a keyboard drop that leaves the source in its existing position", async () => {
    const onReorder = vi.fn(); render(grid({ rowDrag: { onReorder } }));
    await userEvent.tab();
    await act(async () => move("Reorder Course 2").focus());
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(document.activeElement?.getAttribute("aria-roledescription")).toBe("drop indicator"));
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(document.activeElement?.getAttribute("aria-roledescription")).not.toBe("drop indicator"));
    expect(onReorder).not.toHaveBeenCalled();
  });
});
