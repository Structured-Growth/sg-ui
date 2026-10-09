// @vitest-environment jsdom
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { AppDataGrid, type AppDataGridProps, type AppDataGridViewState } from "./index";
import { Provider } from "../../experimental/Provider/Provider";

afterEach(cleanup);

it("restores standalone persisted grids independently and remounts the complete reset defaults", async () => {
  const user = userEvent.setup();
  type Course = { key: string; name: string; score: number };
  const rows: Course[] = [{ key: "a", name: "Course 1", score: 10 }, { key: "b", name: "Course 2", score: 20 }];
  const values = new Map<string, string>();
  const storage = { getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); }, removeItem: (key: string) => { values.delete(key); } };
  const persistedKey = (key: string) => `sgui:grid:${key}:v1`;
  for (const key of ["first", "second"]) values.set(persistedKey(key), JSON.stringify({ version: 1, state: {
    paginationModel: { page: 0, pageSize: 1 }, searchValue: "Course 2", sortRules: [], filterRules: [],
    columnVisibilityModel: { name: true, score: false }, columnOrder: ["score", "name"], columnWidths: { score: 180 },
  } }));
  const reset = vi.fn<(state: AppDataGridViewState) => void>();
  const props: AppDataGridProps<Course> = { rows, columns: [{ field: "name", headerName: "Course" },
    { field: "score", headerName: "Score", filterType: "number", minWidth: 80, maxWidth: 200 }],
    label: "Courses", getRowId: row => row.key, getRowLabel: row => row.name, pageSizeOptions: [1, 2],
    defaultPaginationModel: { page: 1, pageSize: 2 }, defaultSearchValue: "Course",
    defaultSortRules: [{ field: "score", direction: "desc" }], defaultFilterRules: [{ field: "score", operator: "gte", value: "10" }],
    defaultColumnVisibilityModel: { name: true, score: true }, defaultColumnOrder: ["name", "score"], defaultColumnWidths: { score: 120 },
    selection: { defaultSelectedRowIds: new Set(["a"]) }, showResetView: true };
  const mount = () => render(<Provider><section aria-label="First view"><AppDataGrid {...props}
    persistence={{ key: "first", storage }} onResetView={reset} /></section><section aria-label="Second view">
    <AppDataGrid {...props} persistence={{ key: "second", storage }} /></section></Provider>);
  const mounted = mount();
  const first = within(screen.getByRole("region", { name: "First view" }));
  const second = within(screen.getByRole("region", { name: "Second view" }));
  await waitFor(() => expect(first.getByText("Course 2")).toBeTruthy());
  const secondSaved = values.get(persistedKey("second"));
  await user.click(first.getByRole("button", { name: "Reset view" }));
  expect(reset).toHaveBeenCalledExactlyOnceWith({ paginationModel: { page: 0, pageSize: 2 },
    searchValue: "Course", sortRules: [{ field: "score", direction: "desc" }], filterRules: [{ field: "score", operator: "gte", value: "10" }],
    selectedRowIds: new Set(), columnVisibilityModel: { name: true, score: true }, columnOrder: ["name", "score"], columnWidths: { score: 120 } });
  expect(first.getByRole("checkbox", { name: "Select Course 1" })).toHaveProperty("checked", false);
  expect(first.getAllByRole("row").slice(1).map(row => row.getAttribute("data-grid-row"))).toEqual(["b", "a"]);
  expect(second.queryByText("Course 1")).toBeNull();
  expect(values.get(persistedKey("second"))).toBe(secondSaved);
  const saved = JSON.parse(values.get(persistedKey("first"))!).state;
  expect(saved).toEqual({ paginationModel: { page: 0, pageSize: 2 }, searchValue: "Course",
    sortRules: [{ field: "score", direction: "desc" }], filterRules: [{ field: "score", operator: "gte", value: "10" }],
    columnVisibilityModel: { name: true, score: true }, columnOrder: ["name", "score"], columnWidths: { score: 120 } });
  mounted.unmount();
  mount();
  await waitFor(() => expect(within(screen.getByRole("region", { name: "First view" })).getByText("Course 1")).toBeTruthy());
  expect(within(screen.getByRole("region", { name: "Second view" })).queryByText("Course 1")).toBeNull();
  expect(reset).toHaveBeenCalledTimes(1);
});
