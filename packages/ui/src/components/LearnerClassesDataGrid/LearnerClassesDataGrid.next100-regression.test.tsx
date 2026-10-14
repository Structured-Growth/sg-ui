// @vitest-environment jsdom
import { createRef, useState } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "../../theme";
import { SGNavigationProvider } from "../../adapters/navigation";
import type { LearnerClass } from "../../models";
import { DataToolbar, type DataToolbarFilterRule } from "../DataToolbar";
import { LearnerClassesDataGrid, type LearnerClassesDataGridProps } from "./index";

afterEach(cleanup);
const rows: LearnerClass[] = Array.from({ length: 6 }, (_, index) => ({
  id: `c${index + 1}`, courseName: `Course ${index + 1}`, siteName: index < 3 ? "North" : "South",
  instructorName: "Host instructor", progressPercent: 10, nextActivity: "Read", dueAt: "invalid",
}));

it("composes host filter changes with learner paging, original rows, selection and native table props", async () => {
  const user = userEvent.setup(), selected = vi.fn();
  const tableRef = createRef<HTMLTableElement>();
  const fields = [{ id: "siteName", label: "Campus", type: "string" as const }];
  function Host() {
    const [filterRules, setFilterRules] = useState<DataToolbarFilterRule[]>([]);
    const [paginationModel, setPaginationModel] = useState({ page: 1, pageSize: 2 });
    const props: LearnerClassesDataGridProps = { rows, filterFields: fields, filterRules, paginationModel,
      pageSizeOptions: [2], onPaginationModelChange: setPaginationModel, tableRef,
      className: "host-learner-grid", style: { maxWidth: 640 },
      selection: { defaultSelectedRowIds: new Set(["retained"]), onSelectedRowIdsChange: selected } };
    return <><DataToolbar showColumnsButton={false} showSortButton={false} showSearchButton={false}
      showRefreshButton={false} filterFields={fields} filterRules={filterRules}
      onFilterRulesChange={next => { setPaginationModel({ page: 0, pageSize: 2 }); setFilterRules(next); }} />
      <LearnerClassesDataGrid {...props} /></>;
  }
  render(<Provider><Host /></Provider>);
  expect(screen.getByText("Course 3")).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Filter" }));
  await user.click(screen.getByRole("button", { name: /Columns 1/ }));
  await user.click(screen.getByRole("option", { name: "Campus" }));
  await user.type(screen.getByLabelText("Value 1"), "South");
  await user.click(screen.getByRole("button", { name: "Apply" }));
  expect(screen.queryByText("Course 3")).toBeNull();
  expect(screen.getByText("Course 4")).toBeTruthy();
  expect(screen.getByText("Course 5")).toBeTruthy();
  expect(screen.queryByText("Course 6")).toBeNull();
  await user.click(screen.getByRole("checkbox", { name: "Select page" }));
  expect(selected).toHaveBeenCalledExactlyOnceWith(new Set(["retained", "c4", "c5"]));
  await user.click(screen.getByRole("button", { name: "Next page" }));
  expect(screen.getByText("Course 6")).toBeTruthy();
  expect(screen.queryByText("Course 4")).toBeNull();
  expect(tableRef.current).toBe(screen.getByRole("grid", { name: "Courses" }));
  const container = tableRef.current!.closest("[data-sgui-part='grid-container']") as HTMLElement;
  expect(container.className).toContain("host-learner-grid");
  expect(container.style.maxWidth).toBe("640px");
  expect(rows.map(row => row.id)).toEqual(["c1", "c2", "c3", "c4", "c5", "c6"]);
});

it("delivers the original learner row on Enter and isolates Details navigation from row activation", async () => {
  const user = userEvent.setup(), rowAction = vi.fn(), navigate = vi.fn();
  render(<Provider><SGNavigationProvider value={{ pathname: "/", navigate }}>
    <LearnerClassesDataGrid rows={[rows[0]!]} onRowAction={rowAction} />
  </SGNavigationProvider></Provider>);
  const row = screen.getByText("c1").closest("tr")!;
  row.focus();
  await user.keyboard("{Enter}");
  expect(rowAction).toHaveBeenCalledExactlyOnceWith(rows[0]);
  expect(rowAction.mock.calls[0]![0]).toBe(rows[0]);
  rowAction.mockClear();
  await user.click(screen.getByRole("button", { name: "Actions for Course 1" }));
  await user.click(screen.getByRole("menuitem", { name: "Details" }));
  expect(navigate).toHaveBeenCalledExactlyOnceWith("/sections/c1/learner/me", { replace: undefined });
  expect(rowAction).not.toHaveBeenCalled();
});

it("isolates sibling learner selection and paging and resets local state on remount", async () => {
  const user = userEvent.setup(), firstSelection = vi.fn(), secondSelection = vi.fn();
  function view(generation: number) {
    return <Provider><section aria-label="First learner view"><LearnerClassesDataGrid key={generation}
      rows={rows} label="First courses" pageSizeOptions={[2]} defaultPaginationModel={{ page: 0, pageSize: 2 }}
      selection={{ onSelectedRowIdsChange: firstSelection }} /></section>
      <section aria-label="Second learner view"><LearnerClassesDataGrid rows={rows} label="Second courses"
        pageSizeOptions={[2]} defaultPaginationModel={{ page: 0, pageSize: 2 }}
        selection={{ onSelectedRowIdsChange: secondSelection }} /></section></Provider>;
  }
  const { rerender } = render(view(0));
  const first = within(screen.getByRole("region", { name: "First learner view" }));
  const second = within(screen.getByRole("region", { name: "Second learner view" }));
  await user.click(first.getByRole("checkbox", { name: "Select Course 1" }));
  expect(firstSelection).toHaveBeenCalledExactlyOnceWith(new Set(["c1"]));
  expect(second.getByRole("checkbox", { name: "Select Course 1" })).toHaveProperty("checked", false);
  await user.click(first.getByRole("button", { name: "Next page" }));
  expect(first.getByText("Course 3")).toBeTruthy();
  expect(second.getByText("Course 1")).toBeTruthy();
  await user.click(second.getByRole("checkbox", { name: "Select Course 2" }));
  expect(secondSelection).toHaveBeenCalledExactlyOnceWith(new Set(["c2"]));
  rerender(view(1));
  expect(first.getByText("Course 1")).toBeTruthy();
  expect(first.getByRole("checkbox", { name: "Select Course 1" })).toHaveProperty("checked", false);
  expect(second.getByRole("checkbox", { name: "Select Course 2" })).toHaveProperty("checked", true);
  expect(firstSelection).toHaveBeenCalledTimes(1);
  expect(secondSelection).toHaveBeenCalledTimes(1);
});
