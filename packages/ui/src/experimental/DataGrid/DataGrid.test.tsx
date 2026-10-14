// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataGrid } from "./DataGrid";
import { Button } from "../Button/Button";
import { defaultGridState, type GridColumn } from "./types";
import { compareGridValues, filterGridRows } from "./row-processing";
afterEach(cleanup);
interface Item { id: string; name: string; score: number }
const rows: Item[] = [{ id: "a", name: "Science", score: 20 }, { id: "b", name: "Mathematics", score: 10 }, { id: "c", name: "Science", score: 10 }];
const columns: GridColumn<Item>[] = [{ id: "name", label: "Name", getValue: row => row.name }, { id: "score", label: "Score", getValue: row => row.score }];
const props = { label: "Courses", rows, columns, getRowId: (row: Item) => row.id, getRowLabel: (row: Item) => `${row.name} ${row.id}` };
it("filters before sorting and pagination and preserves stable null/number/date semantics", () => {
  expect(filterGridRows(rows, columns, [{ column: "score", operator: "gte", value: "15" }], "science")).toEqual([rows[0]]);
  expect(compareGridValues(null, 0)).toBe(-1); expect(compareGridValues(2, 10)).toBe(-1);
  expect(compareGridValues(new Date("2024-02-29"), new Date("2024-03-01"))).toBe(-1);
  expect(compareGridValues("Course 2", "Course 10")).toBe(-1);
  expect(filterGridRows(rows, columns, [{ column: "score", operator: "gte", value: "10" }, { column: "score", operator: "lte", value: "15" }], "science")).toEqual([rows[2]]);
});
it("commits numeric widths through keyboard resize activation", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<DataGrid {...props} onStateChange={change} />);
  const slider = screen.getByRole("slider", { name: /Resize Name/ });
  await user.click(slider); await user.keyboard("{Enter}{ArrowRight}{Enter}");
  expect(change.mock.calls.at(-1)?.[0].widths.name).toBe(190);
});
it("cancels a keyboard drag without requesting a host reorder", async () => {
  const user = userEvent.setup(); const reorder = vi.fn();
  render(<DataGrid {...props} onReorder={reorder} />);
  const trigger = screen.getByRole("button", { name: "Reorder Science a" });
  for (let index = 0; index < 20 && document.activeElement !== trigger; index++) await user.tab();
  expect(document.activeElement).toBe(trigger);
  await user.keyboard("{Enter}");
  expect(await screen.findByText(/Started dragging/)).toBeTruthy();
  await user.keyboard("{Escape}"); expect(reorder).not.toHaveBeenCalled();
  expect(await screen.findByText("Drop canceled.")).toBeTruthy();
});
it("sorts multiple priorities and filters loaded client rows", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<DataGrid {...props} onStateChange={change} defaultState={{ filters: [{ column: "score", operator: "gte", value: "10" }] }} />);
  await user.click(screen.getByRole("button", { name: "Sort Score" }));
  await user.click(screen.getByRole("button", { name: "Sort Name" }));
  expect(change.mock.calls.at(-1)?.[0].sort).toEqual([{ column: "score", direction: "asc" }, { column: "name", direction: "asc" }]);
  const dataRows = screen.getAllByRole("row").slice(1);
  expect(dataRows.map(row => within(row).getByRole("rowheader").textContent)).toEqual(["Mathematics", "Science", "Science"]);
  expect(dataRows.map(row => within(row).getAllByRole("gridcell").at(-1)?.textContent)).toEqual(["10", "10", "20"]);
  await user.type(screen.getByRole("searchbox"), "Math");
  expect(screen.getAllByRole("row")).toHaveLength(2);
  expect(change.mock.calls.at(-1)?.[0].page).toBe(0);
});
it("retains cross-page selection and distinguishes selecting the current page", async () => {
  const user = userEvent.setup();
  const many = Array.from({ length: 26 }, (_, i) => ({ id: String(i), name: `Course ${i}`, score: i }));
  render(<DataGrid {...props} rows={many} />);
  await user.click(screen.getByRole("checkbox", { name: "Select Course 0 0" }));
  await user.click(screen.getByRole("button", { name: "Next page" }));
  expect(screen.getByRole("status").textContent).toBe("1 selected");
  await user.click(screen.getByRole("checkbox", { name: "Select page" }));
  expect(screen.getByRole("status").textContent).toBe("2 selected");
  await user.click(screen.getByRole("button", { name: "Previous page" }));
  expect((screen.getByRole("checkbox", { name: "Select Course 0 0" }) as HTMLInputElement).checked).toBe(true);
});
it("preserves server row order, emits owned callbacks and handles unknown totals", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<DataGrid {...props} mode="server" hasNextPage state={{ ...defaultGridState, sort: [{ column: "score", direction: "asc" }] }} onStateChange={change} />);
  const dataRows = screen.getAllByRole("row").slice(1);
  expect(within(dataRows[0]!).getByRole("checkbox", { name: "Select Science a" })).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Next page" }));
  expect(change.mock.calls.at(-1)?.[0].page).toBe(1); expect(screen.getByText("Page 1")).toBeTruthy();
});
it("locks the first column, hides optional columns and exposes non-drag reordering", async () => {
  const user = userEvent.setup(); const reorder = vi.fn();
  render(<DataGrid {...props} onReorder={reorder} renderActions={row => <button>Edit {row.id}</button>} />);
  await user.click(screen.getByRole("button", { name: "Columns" }));
  expect((screen.getByRole("checkbox", { name: "Name" }) as HTMLInputElement).disabled).toBe(true);
  await user.click(screen.getByRole("checkbox", { name: "Score" })); await user.keyboard("{Escape}");
  expect(screen.queryByRole("button", { name: "Sort Score" })).toBeNull();
  await user.click(screen.getByRole("button", { name: "Move Science a down" }));
  expect(reorder).toHaveBeenCalledExactlyOnceWith("a", "b", "after");
  await user.click(screen.getByRole("button", { name: "Sort Name" }));
  expect((screen.getByRole("button", { name: "Move Science a down" }) as HTMLButtonElement).disabled).toBe(true);
});

it("isolates overlapping row keys and nested cell actions between independent grids", async () => {
  const user = userEvent.setup();
  const firstChange = vi.fn(); const secondChange = vi.fn(); const action = vi.fn();
  const interactiveColumns: GridColumn<Item>[] = [
    columns[0]!,
    { ...columns[1]!, renderCell: row => <Button onPress={() => action(row.id)}>Inspect {row.name} {row.id}</Button> },
  ];
  render(<>
    <DataGrid {...props} label="First courses" columns={interactiveColumns} onStateChange={firstChange} />
    <DataGrid {...props} label="Second courses" columns={interactiveColumns} onStateChange={secondChange} />
  </>);
  const first = within(screen.getByRole("grid", { name: "First courses" }));
  const second = within(screen.getByRole("grid", { name: "Second courses" }));
  await user.click(first.getByRole("checkbox", { name: "Select Science a" }));
  expect(firstChange.mock.calls.at(-1)?.[0].selectedIds).toEqual(["a"]);
  expect(secondChange).not.toHaveBeenCalled();
  expect((second.getByRole("checkbox", { name: "Select Science a" }) as HTMLInputElement).checked).toBe(false);
  firstChange.mockClear();
  await user.click(first.getByRole("button", { name: "Inspect Science a" }));
  await user.click(second.getByRole("button", { name: "Inspect Science a" }));
  expect(action.mock.calls).toEqual([["a"], ["a"]]);
  expect(firstChange).not.toHaveBeenCalled();
  expect(secondChange).not.toHaveBeenCalled();
  await user.click(second.getByRole("checkbox", { name: "Select Mathematics b" }));
  expect(secondChange.mock.calls.at(-1)?.[0].selectedIds).toEqual(["b"]);
  expect((first.getByRole("checkbox", { name: "Select Science a" }) as HTMLInputElement).checked).toBe(true);
  expect((first.getByRole("checkbox", { name: "Select Mathematics b" }) as HTMLInputElement).checked).toBe(false);
});
