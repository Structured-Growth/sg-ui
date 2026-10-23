// @vitest-environment jsdom
import { act, cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppDataGrid, type AppDataGridProps } from "./AppDataGrid";
import { Provider } from "../../experimental/Provider/Provider";

afterEach(cleanup);
const rows = [{ id: "one", name: "Course 1" }, { id: "two", name: "Course 2" }, { id: "three", name: "Course 3" }];
type Course = typeof rows[number];
const columns = [{ field: "name", headerName: "Course" }];
const base: AppDataGridProps<Course> = { rows, columns, label: "Courses", getRowLabel: row => row.name,
  defaultPaginationModel: { page: 0, pageSize: 5 }, pageSizeOptions: [2, 5] };
const policies: [string, Partial<AppDataGridProps<Course>>][] = [
  ["sorting", { sortRules: [{ field: "name", direction: "asc" }] }],
  ["filtering", { filterRules: [{ field: "name", operator: "contains", value: "Course" }] }],
  ["pagination", { paginationModel: { page: 0, pageSize: 2 } }],
];
const button = (name: string) => screen.getByRole("button", { name, exact: true });
const names = () => screen.getAllByRole("rowheader").map(cell => cell.textContent);
const indicators = () => document.querySelectorAll('[aria-roledescription="drop indicator"]');
async function start() {
  await userEvent.tab();
  await act(async () => button("Reorder Course 2").focus());
  await userEvent.keyboard("{Enter}");
  await waitFor(() => expect(document.activeElement?.getAttribute("aria-roledescription")).toBe("drop indicator"));
}

describe("reorder processing policy transitions", () => {
  it.each(policies)("restores Move after removing %s without reordering the host rows", async (_name, policy) => {
    const onReorder = vi.fn();
    const viewFor = (extra: Partial<AppDataGridProps<Course>>) => <Provider><AppDataGrid {...base} {...extra} rowDrag={{ showMoveButtons: true, onReorder }} /></Provider>;
    const view = render(viewFor(policy));
    for (const action of screen.getAllByRole("button", { name: /^(Reorder|Move) Course/ }))
      expect((action as HTMLButtonElement).disabled).toBe(true);
    await userEvent.click(button("Move Course 1 down"));
    expect(onReorder).not.toHaveBeenCalled();
    // Restore explicit controlled defaults rather than switching to uncontrolled state.
    view.rerender(viewFor({ sortRules: [], filterRules: [], paginationModel: { page: 0, pageSize: 5 } }));
    await userEvent.click(button("Move Course 2 down"));
    expect(onReorder).toHaveBeenCalledTimes(1);
    expect(onReorder).toHaveBeenCalledWith({ sourceRows: [rows[1]], sourceRowIds: ["two"], sourceRow: rows[1], sourceRowId: "two", targetRow: rows[2], targetRowId: "three", position: "after" });
    expect(names()).toEqual(["Course 1", "Course 2", "Course 3"]);
    expect(screen.getByRole("status").textContent).toBe("Move requested for Course 2");
  });

  it.each(policies)("rejects the in-flight keyboard request when %s becomes active", async (_name, policy) => {
    const onReorder = vi.fn();
    const viewFor = (extra: Partial<AppDataGridProps<Course>>) => <Provider><AppDataGrid {...base} {...extra} rowDrag={{ showMoveButtons: true, onReorder }} /></Provider>;
    const view = render(viewFor({}));
    await start();
    await userEvent.keyboard("{ArrowDown}{ArrowDown}");
    await waitFor(() => expect(document.activeElement?.getAttribute("aria-label")).toBe("Insert after Course 3"));
    view.rerender(viewFor(policy));
    await userEvent.keyboard("{Enter}{Escape}");
    await waitFor(() => expect(indicators()).toHaveLength(0));
    expect(onReorder).not.toHaveBeenCalled();
    view.rerender(viewFor({ sortRules: [], filterRules: [], paginationModel: { page: 0, pageSize: 5 } }));
    await userEvent.click(button("Move Course 2 down"));
    expect(onReorder).toHaveBeenCalledTimes(1);
    expect(names()).toEqual(["Course 1", "Course 2", "Course 3"]);
  });

  it("cancels keyboard drag without affecting a sibling grid with colliding IDs", async () => {
    const onReorder = vi.fn(), siblingReorder = vi.fn();
    render(<Provider>
      <section aria-label="Source grid"><AppDataGrid {...base} rowDrag={{ showMoveButtons: true, onReorder }} /></section>
      <section aria-label="Sibling grid"><AppDataGrid {...base} label="Sibling courses"
        selection={{ selectedRowIds: new Set(["three"]) }} rowDrag={{ showMoveButtons: true, onReorder: siblingReorder }} /></section>
    </Provider>);
    const source = within(screen.getByRole("region", { name: "Source grid" }));
    const sibling = within(screen.getByRole("region", { name: "Sibling grid" }));
    await userEvent.tab();
    const handle = source.getByRole("button", { name: "Reorder Course 2" });
    await act(async () => handle.focus());
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(document.activeElement?.getAttribute("aria-roledescription")).toBe("drop indicator"));
    await userEvent.keyboard("{ArrowDown}{Escape}");
    await waitFor(() => expect(document.activeElement).toBe(handle));
    expect(indicators()).toHaveLength(0);
    expect(onReorder).not.toHaveBeenCalled();
    expect(siblingReorder).not.toHaveBeenCalled();
    expect((sibling.getByRole("checkbox", { name: "Select Course 3" }) as HTMLInputElement).checked).toBe(true);
    expect(sibling.getAllByRole("rowheader").map(cell => cell.textContent)).toEqual(["Course 1", "Course 2", "Course 3"]);
    await userEvent.click(sibling.getByRole("button", { name: "Move Course 2 down" }));
    expect(siblingReorder).toHaveBeenCalledTimes(1);
    expect(onReorder).not.toHaveBeenCalled();
  });
});
