// @vitest-environment jsdom
import { createRef } from "react";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppDataGrid } from "./AppDataGrid";
import { Provider } from "../../experimental/Provider/Provider";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });
const rows = Array.from({ length: 12 }, (_, index) => ({ id: index + 1, name: `Course ${index + 1}`, score: 12 - index }));
const columns = [{ field: "name", headerName: "Course" }, { field: "score", headerName: "Score" }];
const base = { rows, columns, label: "Courses", getRowLabel: (row: typeof rows[number]) => row.name,
  pageSizeOptions: [5, 250], defaultPaginationModel: { page: 0, pageSize: 5 } };
const mount = (extra: Partial<import("./AppDataGrid").AppDataGridProps<typeof rows[number]>> = {}) => render(<Provider><AppDataGrid {...base} {...extra} /></Provider>);
describe("AppDataGrid owned public composition", () => {
  it("renders owned cells, real native refs, and requests footer page changes once", async () => {
    const ref = createRef<HTMLDivElement>(); const tableRef = createRef<HTMLTableElement>(); const onStateChange = vi.fn();
    render(<Provider><AppDataGrid {...base} ref={ref} tableRef={tableRef} onStateChange={onStateChange} /></Provider>);
    expect(ref.current?.tagName).toBe("DIV"); expect(tableRef.current?.tagName).toBe("TABLE");
    expect(screen.getByText("Course 1")).toBeTruthy(); expect(screen.queryByText("Course 6")).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getByText("Course 6")).toBeTruthy();
    await waitFor(() => expect(document.activeElement?.getAttribute("data-grid-row")).toBe("6"));
    expect(onStateChange).toHaveBeenCalledTimes(1);
    expect(onStateChange.mock.calls[0][0].paginationModel).toEqual({ page: 1, pageSize: 5 });
  });
  it("header sort resets the page in a single transaction with pagination before sorting", async () => {
    const order: string[] = []; const onStateChange = vi.fn();
    mount({ defaultPaginationModel: { page: 1, pageSize: 5 }, onPaginationModelChange: () => order.push("page"), onSortRulesChange: () => order.push("sort"), onStateChange });
    await userEvent.click(screen.getByRole("button", { name: "Sort Score" }));
    await userEvent.click(screen.getByRole("menuitemradio", { name: "Sort Ascending" }));
    expect(order).toEqual(["page", "sort"]); expect(onStateChange).toHaveBeenCalledTimes(1);
    expect(onStateChange.mock.calls[0][0]).toMatchObject({ paginationModel: { page: 0, pageSize: 5 }, sortRules: [{ field: "score", direction: "asc" }] });
    expect(screen.getByText("Course 12")).toBeTruthy();
  });
  it("callback-only selection is writable and keeps retained IDs while skipping disabled rows", async () => {
    const onSelectedRowIdsChange = vi.fn();
    mount({ selection: { defaultSelectedRowIds: new Set(["99"]), onSelectedRowIdsChange, isRowSelectable: row => row.id !== 2 } });
    await userEvent.click(screen.getByRole("checkbox", { name: "Select page" }));
    expect(onSelectedRowIdsChange.mock.calls[0][0]).toEqual(new Set(["99", "1", "3", "4", "5"]));
    await userEvent.click(screen.getByRole("checkbox", { name: "Select page" }));
    expect(onSelectedRowIdsChange.mock.calls[1][0]).toEqual(new Set(["99"]));
  });
  it("passes server pages through with unknown totals and host navigation", async () => {
    mount({ rows: rows.slice(5, 7), mode: "server", paginationModel: { page: 3, pageSize: 5 }, hasNextPage: false, searchValue: "absent", sortRules: [{ field: "score", direction: "asc" }] });
    expect(screen.getByText("Course 6")).toBeTruthy(); expect(screen.getByText("Course 7")).toBeTruthy();
    expect(screen.getByText("Total unknown")).toBeTruthy(); expect((screen.getByRole("button", { name: "Next page" }) as HTMLButtonElement).disabled).toBe(true);
  });
  it("supports custom page sizes above the retired engine limit with one size transaction", async () => {
    const onStateChange = vi.fn(); mount({ onStateChange });
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Rows per page" }), "250");
    await waitFor(() => expect(screen.getByText("Course 12")).toBeTruthy());
    expect(onStateChange).toHaveBeenCalledTimes(1); expect(onStateChange.mock.calls[0][0].paginationModel).toEqual({ page: 0, pageSize: 250 });
  });
});

it("offers an opt-in live reset without replacing the native container ref", async () => {
  const user = userEvent.setup(); const state = vi.fn(); const ref = createRef<HTMLDivElement>();
  const reset = vi.fn(value => { value.searchValue = "callback mutation"; value.selectedRowIds.add("mutated"); value.columnOrder.reverse(); });
  render(<AppDataGrid {...base} ref={ref} showResetView defaultSearchValue="Course" defaultPaginationModel={{ page: 1, pageSize: 5 }}
    selection={{ defaultSelectedRowIds: new Set(["a"]) }} onResetView={reset} onStateChange={state} />);
  await user.click(screen.getByRole("button", { name: "Reset view" }));
  expect(reset).toHaveBeenCalledTimes(1); expect(state).toHaveBeenCalledTimes(1);
  expect(state.mock.calls[0]![0]).toMatchObject({ paginationModel: { page: 0, pageSize: 5 }, searchValue: "Course", selectedRowIds: new Set() });
  expect(ref.current?.tagName).toBe("DIV");
  expect(screen.getByRole("checkbox", { name: "Select Course 1" })).toBeTruthy();
  expect((screen.getByRole("checkbox", { name: "Select Course 1" }) as HTMLInputElement).checked).toBe(false);
});

it.each([false, true])("keeps a shrunk client page coherent with host acceptance=%s", async accept => {
  const dataset = Array.from({ length: 41 }, (_, index) => ({ id: String(index + 1), name: `Shrink course ${index + 1}`, score: index }));
  const page = vi.fn(); const combined = vi.fn(); const selected = vi.fn(); const order: string[] = [];
  const focusOptions: Array<FocusOptions | undefined> = [];
  const originalFocus = HTMLElement.prototype.focus;
  const focusSpy = vi.spyOn(HTMLElement.prototype, "focus").mockImplementation(function (this: HTMLElement, options) {
    if (this.dataset.gridField === "name") focusOptions.push(options);
    originalFocus.call(this, options);
  });
  const config = { ...base, rows: dataset, pageSizeOptions: [10], paginationModel: { page: 3, pageSize: 10 },
    rowCount: 1, hasNextPage: false,
    selection: { defaultSelectedRowIds: new Set(["41"]), onSelectedRowIdsChange: selected },
    onPaginationModelChange: (value: { page: number; pageSize: number }) => { order.push("page"); page(value); },
    onStateChange: (value: unknown) => { order.push("state"); combined(value); } };
  const { rerender } = render(<AppDataGrid {...config} />);
  expect(screen.getByText("Shrink course 31")).toBeTruthy();
  rerender(<AppDataGrid {...config} rows={dataset.slice(0, 11)} />);
  expect(screen.getByText("Shrink course 11")).toBeTruthy();
  expect(screen.getByText("11-11 of 11")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Next page" }).hasAttribute("disabled")).toBe(true);
  expect(page).not.toHaveBeenCalled(); expect(combined).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole("button", { name: "Previous page" }));
  expect(page).toHaveBeenCalledExactlyOnceWith({ page: 0, pageSize: 10 });
  expect(order).toEqual(["page", "state"]);
  expect(combined.mock.calls[0][0]).toMatchObject({ paginationModel: { page: 0, pageSize: 10 }, selectedRowIds: new Set(["41"]) });
  expect(screen.getByText("Shrink course 11")).toBeTruthy();
  rerender(<AppDataGrid {...config} rows={dataset.slice(0, 11)} paginationModel={{ page: accept ? 0 : 3, pageSize: 10 }} />);
  expect(screen.getByText(accept ? "Shrink course 1" : "Shrink course 11")).toBeTruthy();
  if (accept) {
    expect(document.activeElement?.getAttribute("data-grid-field")).toBe("name");
    expect(focusOptions.length).toBeGreaterThan(0);
    // The first call is the owned footer-entry focus; React Aria may then
    // refocus with its own scroll-preserving fallback in jsdom.
    expect(focusOptions[0]).toEqual({ preventScroll: true });
  }
  focusSpy.mockRestore();
  expect(combined).toHaveBeenCalledTimes(1);
  expect(selected).not.toHaveBeenCalled();
  rerender(<AppDataGrid {...config} rows={[]} />);
  expect(screen.getByText("0-0 of 0")).toBeTruthy();
  expect(combined).toHaveBeenCalledTimes(1);
  rerender(<AppDataGrid {...config} />);
  expect(screen.getByText("Shrink course 31")).toBeTruthy();
});

it("uses the complete client total for callback-only page requests despite server hints", async () => {
  const page = vi.fn(); const combined = vi.fn();
  const config = { ...base, pageSizeOptions: [1], defaultPaginationModel: { page: 0, pageSize: 1 },
    rowCount: 0, hasNextPage: false, onPaginationModelChange: page, onStateChange: combined };
  const { rerender } = render(<AppDataGrid {...config} />);
  await userEvent.click(screen.getByRole("button", { name: "Last page" }));
  expect(page).toHaveBeenCalledExactlyOnceWith({ page: base.rows.length - 1, pageSize: 1 });
  expect(screen.getByText(base.rows.at(-1)!.name)).toBeTruthy();
  rerender(<AppDataGrid {...config} rows={base.rows.slice(0, 2)} />);
  expect(screen.getByText(base.rows[1]!.name)).toBeTruthy();
  expect(page).toHaveBeenCalledTimes(1);
  await userEvent.click(screen.getByRole("button", { name: "Previous page" }));
  expect(screen.getByText(base.rows[0]!.name)).toBeTruthy();
  expect(combined).toHaveBeenCalledTimes(2);
});
