// @vitest-environment jsdom
import { createRef } from "react";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppDataGrid } from "./AppDataGrid";
import { Provider } from "../../experimental/Provider/Provider";

afterEach(cleanup);
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
