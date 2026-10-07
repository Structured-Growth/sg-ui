// @vitest-environment jsdom
import { createRef } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppDataGridShell } from "./AppDataGridShell";
import type { AppDataGridColumn } from "../AppDataGrid";
afterEach(cleanup);
type Course = { id: string; name: string; score: number };
const rows: Course[] = [{ id: "a", name: "Science", score: 20 }, { id: "b", name: "Mathematics", score: 10 }, { id: "c", name: "History", score: 30 }];
const columns: AppDataGridColumn<Course>[] = [{ field: "name", headerName: "Name" }, { field: "score", headerName: "Score", filterType: "number" }];
const props = { label: "Courses", rows, columns, getRowLabel: (row: Course) => row.name,
  pageSizeOptions: [1, 2, 25], defaultPaginationModel: { page: 0, pageSize: 1 },
  view: { cards: { renderCard: (row: Course) => <span>{row.name}</span> } } };
it("shares client page, selection and criteria between list and cards with one footer", async () => {
  const user = userEvent.setup();
  render(<AppDataGridShell {...props} />);
  await user.click(screen.getByRole("checkbox", { name: "Select Science" }));
  expect(screen.getByText("1 selected")).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Next page" }));
  expect(screen.getByRole("checkbox", { name: "Select Mathematics" })).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Cards" }));
  expect(within(screen.getByRole("list", { name: "Courses" })).getByText("Mathematics")).toBeTruthy();
  expect(screen.getAllByRole("button", { name: "Next page" })).toHaveLength(1);
  await user.click(screen.getByRole("button", { name: "List" }));
  expect(screen.getByText("1 selected")).toBeTruthy();
  expect(screen.getByRole("checkbox", { name: "Select Mathematics" })).toBeTruthy();
});
it("header sorting emits one combined transaction with page reset before criterion", async () => {
  const user = userEvent.setup(); const order: string[] = []; const state = vi.fn();
  render(<AppDataGridShell {...props} defaultPaginationModel={{ page: 1, pageSize: 1 }}
    onPaginationModelChange={() => order.push("page")} onSortRulesChange={() => order.push("sort")} onStateChange={state} />);
  await user.click(screen.getByRole("button", { name: "Sort Score" }));
  await user.click(screen.getByRole("menuitemradio", { name: "Sort Ascending" }));
  expect(order).toEqual(["page", "sort"]);
  expect(state).toHaveBeenCalledTimes(1);
  expect(state.mock.calls[0]![0]).toMatchObject({ paginationModel: { page: 0, pageSize: 1 }, sortRules: [{ field: "score", direction: "asc" }] });
  expect(screen.getByRole("checkbox", { name: "Select Mathematics" })).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Cards" }));
  expect(within(screen.getByRole("list", { name: "Courses" })).getByText("Mathematics")).toBeTruthy();
});
it("server cards preserve every supplied row and host order beyond page zero", async () => {
  const user = userEvent.setup(); const request = vi.fn();
  render(<AppDataGridShell {...props} mode="server" paginationModel={{ page: 4, pageSize: 1 }}
    searchValue="missing" sortRules={[{ field: "score", direction: "asc" }]} hasNextPage onStateChange={request}
    view={{ ...props.view, defaultMode: "cards" }} />);
  expect(screen.getAllByRole("listitem").map(item => item.textContent)).toEqual(["Science", "Mathematics", "History"]);
  expect(screen.getByText("Total unknown")).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Next page" }));
  expect(request).toHaveBeenCalledTimes(1);
  expect(request.mock.calls[0]![0].paginationModel).toEqual({ page: 5, pageSize: 1 });
  expect(screen.getAllByRole("listitem")).toHaveLength(3);
});
it("keeps controlled view and selection authoritative while callback-only criteria stay writable", async () => {
  const user = userEvent.setup(); const viewChange = vi.fn(); const search = vi.fn(); const selection = vi.fn();
  render(<AppDataGridShell {...props} view={{ ...props.view, mode: "list", onModeChange: viewChange }}
    onSearchChange={search} selection={{ selectedRowIds: new Set(), onSelectedRowIdsChange: selection }} />);
  await user.click(screen.getByRole("button", { name: "Cards" }));
  expect(viewChange).toHaveBeenCalledExactlyOnceWith("cards");
  expect(screen.getByRole("grid", { name: "Courses" })).toBeTruthy();
  await user.click(screen.getByRole("checkbox", { name: "Select Science" }));
  expect(selection).toHaveBeenCalledExactlyOnceWith(new Set(["a"]));
  expect((screen.getByRole("checkbox", { name: "Select Science" }) as HTMLInputElement).checked).toBe(false);
  await user.click(screen.getByRole("button", { name: "Search" }));
  await user.type(screen.getByRole("searchbox", { name: "Search" }), "History");
  expect(search).toHaveBeenLastCalledWith("History");
  expect(screen.getByRole("checkbox", { name: "Select History" })).toBeTruthy();
});
it("forwards native shell ref, isolates instances and enters the requested page from its footer", async () => {
  const user = userEvent.setup(); const ref = createRef<HTMLDivElement>();
  const result = render(<><AppDataGridShell {...props} ref={ref} /><AppDataGridShell {...props} label="Other courses" /></>);
  expect(ref.current?.tagName).toBe("DIV");
  const next = within(ref.current!).getByRole("button", { name: "Next page" });
  await user.click(next);
  await waitFor(() => expect(document.activeElement?.getAttribute("data-grid-row")).toBe("b"));
  expect(within(screen.getByRole("grid", { name: "Other courses" })).getByRole("checkbox", { name: "Select Science" })).toBeTruthy();
  result.unmount();
});
it("restores validated shell defaults while controlled props win and never persists selection", async () => {
  const user = userEvent.setup(); let saved = JSON.stringify({ version: 1, state: { paginationModel: { page: 1, pageSize: 1 }, viewMode: "cards" } });
  const storage = { getItem: () => saved, setItem: (_key: string, value: string) => { saved = value; }, removeItem: vi.fn() };
  const { rerender } = render(<AppDataGridShell {...props} persistence={{ key: "shell-test", storage }} />);
  expect(screen.getByRole("listitem").textContent).toBe("Mathematics");
  await user.click(screen.getByRole("button", { name: "List" }));
  await user.click(screen.getByRole("checkbox", { name: "Select Mathematics" }));
  expect(saved).not.toContain("selectedRowIds");
  rerender(<AppDataGridShell {...props} persistence={{ key: "shell-test", storage }} paginationModel={{ page: 0, pageSize: 1 }} />);
  expect(screen.getByRole("checkbox", { name: "Select Science" })).toBeTruthy();
});
it("page-size changes request page zero and the new size once", async () => {
  const user = userEvent.setup(); const pagination = vi.fn(); const state = vi.fn();
  render(<AppDataGridShell {...props} defaultPaginationModel={{ page: 1, pageSize: 1 }}
    onPaginationModelChange={pagination} onStateChange={state} />);
  await user.selectOptions(screen.getByRole("combobox", { name: "Rows per page" }), "2");
  expect(pagination).toHaveBeenCalledExactlyOnceWith({ page: 0, pageSize: 2 });
  expect(state).toHaveBeenCalledTimes(1);
  expect(screen.getAllByRole("checkbox")).toHaveLength(3);
  expect(screen.getByRole("checkbox", { name: "Select Science" })).toBeTruthy();
  expect(screen.getByRole("checkbox", { name: "Select Mathematics" })).toBeTruthy();
});
it("filters cards through declared fields and announces retained-row refresh", () => {
  render(<AppDataGridShell {...props} filterRules={[{ field: "score", operator: "gte", value: "25" }]}
    refreshing view={{ ...props.view, defaultMode: "cards" }} />);
  expect(screen.getAllByRole("listitem").map(item => item.textContent)).toEqual(["History"]);
  expect(screen.getByText("Refreshing rows")).toBeTruthy();
});
it("hydrates the initial persisted-view loading gate before restoring card state", async () => {
  const { renderToString } = await import("react-dom/server");
  const { hydrateRoot } = await import("react-dom/client");
  const { act } = await import("@testing-library/react");
  const saved = JSON.stringify({ version: 1, state: { paginationModel: { page: 1, pageSize: 1 }, viewMode: "cards" } });
  const storage = { getItem: () => saved, setItem: vi.fn(), removeItem: vi.fn() };
  const element = <AppDataGridShell {...props} persistence={{ key: "hydration-view", storage }} />;
  const container = document.createElement("div");
  container.innerHTML = renderToString(element);
  document.body.appendChild(container);
  expect(container.textContent).toContain("Loading rows");
  const recoverable = vi.fn();
  let root: ReturnType<typeof hydrateRoot> | undefined;
  await act(async () => { root = hydrateRoot(container, element, { onRecoverableError: recoverable }); });
  expect(within(container).getByRole("listitem").textContent).toBe("Mathematics");
  expect(recoverable).not.toHaveBeenCalled();
  await act(async () => root?.unmount());
  container.remove();
});
it("repairs disappearing card action focus without taking focus from another view", async () => {
  const user = userEvent.setup(); const view = { defaultMode: "cards" as const,
    cards: { renderCard: (row: Course) => <button>Open {row.name}</button> } };
  const { rerender } = render(<AppDataGridShell {...props} pageSizeOptions={[25]} defaultPaginationModel={{ page: 0, pageSize: 25 }} view={view} />);
  await user.click(screen.getByRole("button", { name: "Open Science" }));
  rerender(<AppDataGridShell {...props} rows={rows.slice(1)} pageSizeOptions={[25]} defaultPaginationModel={{ page: 0, pageSize: 25 }} view={view} />);
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Open Mathematics" }));
  await user.click(screen.getByRole("button", { name: "Search" }));
  const input = screen.getByRole("searchbox", { name: "Search" });
  rerender(<AppDataGridShell {...props} rows={rows.slice(2)} pageSizeOptions={[25]} defaultPaginationModel={{ page: 0, pageSize: 25 }} view={view} />);
  expect(document.activeElement).toBe(input);
});
