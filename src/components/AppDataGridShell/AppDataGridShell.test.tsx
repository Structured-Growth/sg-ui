// @vitest-environment jsdom
import { createRef } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppDataGridShell } from "./AppDataGridShell";
import type { OwnedGridCriteriaState } from "../AppDataGrid/ownedGridState";
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

it("resets the live persisted view atomically to declared defaults and clears selection", async () => {
  const user = userEvent.setup(); const state = vi.fn(); const reset = vi.fn();
  const values = new Map<string, string>([["sgui:grid:reset-courses:v1", JSON.stringify({ version: 1, state: {
    paginationModel: { page: 2, pageSize: 1 }, searchValue: "History", viewMode: "cards",
    sortRules: [{ field: "score", direction: "desc" }], columnOrder: ["score", "name"], columnWidths: { score: 240 },
    columnVisibilityModel: { score: false },
  } })], ["page:reset-courses:viewMode", JSON.stringify("cards")]]);
  const storage = { getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); }, removeItem: (key: string) => { values.delete(key); } };
  const { unmount } = render(<AppDataGridShell {...props} showResetView persistence={{ key: "reset-courses", storage }}
    selection={{ defaultSelectedRowIds: new Set(["off-page"]) }} defaultColumnWidths={{ score: 120 }}
    defaultSortRules={[{ field: "name", direction: "asc" }]} onStateChange={state} onResetView={reset} />);
  expect(screen.getByText("1 selected")).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Reset view" }));
  expect(state).toHaveBeenCalledTimes(1);
  expect(reset).toHaveBeenCalledTimes(1);
  expect(reset.mock.calls[0]![0]).toMatchObject({ paginationModel: { page: 0, pageSize: 1 },
    searchValue: "", sortRules: [{ field: "name", direction: "asc" }], filterRules: [], selectedRowIds: new Set(),
    columnOrder: ["name", "score"], columnVisibilityModel: { name: true, score: true }, columnWidths: { score: 120 }, viewMode: "list" });
  expect(screen.queryByText("1 selected")).toBeNull();
  expect(screen.getByRole("checkbox", { name: "Select History" })).toBeTruthy();
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Reset view" }));
  expect(values.has("page:reset-courses:viewMode")).toBe(false);
  expect(JSON.parse(values.get("sgui:grid:reset-courses:v1")!).state).toMatchObject({ paginationModel: { page: 0, pageSize: 1 }, searchValue: "", viewMode: "list", columnWidths: { score: 120 } });
  unmount();
  render(<AppDataGridShell {...props} persistence={{ key: "reset-courses", storage }} />);
  expect(screen.getByRole("grid", { name: "Courses" })).toBeTruthy();
  expect(screen.getByRole("checkbox", { name: "Select History" })).toBeTruthy();
});

it("requests every controlled reset concern once and keeps reset persistence until the host accepts", async () => {
  const user = userEvent.setup(); const pagination = vi.fn(); const sort = vi.fn(); const filter = vi.fn();
  const search = vi.fn(); const selection = vi.fn(); const visibility = vi.fn(); const order = vi.fn(); const widths = vi.fn(); const view = vi.fn(); const state = vi.fn();
  let saved: string | null = null;
  const storage = { getItem: () => saved, setItem: (_key: string, value: string) => { saved = value; }, removeItem: () => { saved = null; } };
  const controlled = { paginationModel: { page: 2, pageSize: 2 }, searchValue: "Science", sortRules: [{ field: "score", direction: "desc" as const }],
    filterRules: [{ field: "score", operator: "gte", value: "0" }], columnVisibilityModel: { score: false }, columnOrder: ["score", "name"], columnWidths: { score: 220 },
    selection: { selectedRowIds: new Set(["a"]), onSelectedRowIdsChange: selection }, view: { ...props.view, mode: "cards" as const, onModeChange: view } };
  const common = { ...props, showResetView: true, persistence: { key: "controlled-reset", storage },
    onPaginationModelChange: pagination, onSortRulesChange: sort, onFilterRulesChange: filter, onSearchChange: search,
    onColumnVisibilityModelChange: visibility, onColumnOrderChange: order, onColumnWidthsChange: widths, onStateChange: state };
  const { rerender } = render(<AppDataGridShell {...common} {...controlled} />);
  await user.click(screen.getByRole("button", { name: "Reset view" }));
  expect(pagination).toHaveBeenCalledExactlyOnceWith({ page: 0, pageSize: 1 });
  expect(sort).toHaveBeenCalledExactlyOnceWith([]); expect(filter).toHaveBeenCalledExactlyOnceWith([]);
  expect(search).toHaveBeenCalledExactlyOnceWith(""); expect(selection).toHaveBeenCalledExactlyOnceWith(new Set());
  expect(visibility).toHaveBeenCalledExactlyOnceWith({ name: true, score: true });
  expect(order).toHaveBeenCalledExactlyOnceWith(["name", "score"]); expect(widths).toHaveBeenCalledExactlyOnceWith({});
  expect(view).toHaveBeenCalledExactlyOnceWith("list"); expect(state).toHaveBeenCalledTimes(1);
  expect(screen.getByText("1 selected")).toBeTruthy();
  rerender(<AppDataGridShell {...common} {...controlled} label="Rerendered courses" />);
  expect(JSON.parse(saved!).state).toMatchObject({ paginationModel: { page: 0, pageSize: 1 }, searchValue: "", viewMode: "list" });
  rerender(<AppDataGridShell {...common} paginationModel={{ page: 0, pageSize: 1 }} searchValue="" sortRules={[]} filterRules={[]}
    columnVisibilityModel={{ name: true, score: true }} columnOrder={["name", "score"]} columnWidths={{}}
    selection={{ selectedRowIds: new Set(), onSelectedRowIdsChange: selection }} view={{ ...props.view, mode: "list", onModeChange: view }} />);
  expect(screen.getByRole("grid", { name: "Courses" })).toBeTruthy();
  expect(screen.queryByText("1 selected")).toBeNull();
});

// G-05/H-16: a controlled host can defer or reject a request in either presentation.
it.each(["list", "cards"] as const)("orders controlled %s filter and size requests without replacing host state", async mode => {
  const user = userEvent.setup(); const order: string[] = [];
  const pagination = vi.fn(() => order.push("page"));
  const filter = vi.fn(() => order.push("filter"));
  const state = vi.fn((_value: OwnedGridCriteriaState) => order.push("state"));
  const initial = { paginationModel: { page: 4, pageSize: 1 }, filterRules: [{ field: "name", operator: "contains" as const, value: "Science" }] };
  const common = { ...props, mode: "server" as const, hasNextPage: true,
    toolbar: { filterFields: [{ id: "name", label: "Name", type: "string" as const }] },
    view: { ...props.view, mode }, onPaginationModelChange: pagination, onFilterRulesChange: filter, onStateChange: state };
  const { rerender } = render(<AppDataGridShell {...common} {...initial} />);
  await user.click(screen.getByRole("button", { name: "Filter 1" }));
  await user.clear(screen.getByLabelText("Value 1"));
  await user.type(screen.getByLabelText("Value 1"), "History");
  expect(order).toEqual([]); // Draft edits do not request host rows.
  await user.click(screen.getByRole("button", { name: "Apply" }));
  expect(order).toEqual(["page", "filter", "state"]);
  expect(pagination).toHaveBeenCalledExactlyOnceWith({ page: 0, pageSize: 1 });
  expect(filter).toHaveBeenCalledExactlyOnceWith([{ field: "name", operator: "contains", value: "History" }]);
  expect(state.mock.calls[0]![0]).toMatchObject({ paginationModel: { page: 0, pageSize: 1 }, filterRules: [{ field: "name", operator: "contains", value: "History" }] });
  // A rejected request keeps the original controlled filter and page.
  await user.click(screen.getByRole("button", { name: "Filter 1" }));
  expect(screen.getByLabelText("Value 1")).toHaveProperty("value", "Science");
  await user.click(screen.getByRole("button", { name: "Cancel" }));
  order.length = 0; pagination.mockClear(); state.mockClear();
  await user.selectOptions(screen.getByRole("combobox", { name: "Rows per page" }), "2");
  expect(order).toEqual(["page", "state"]);
  expect(pagination).toHaveBeenCalledExactlyOnceWith({ page: 0, pageSize: 2 });
  expect(state.mock.calls[0]![0]).toMatchObject({ paginationModel: { page: 0, pageSize: 2 }, filterRules: initial.filterRules });
  expect(screen.getByRole("combobox", { name: "Rows per page" })).toHaveProperty("value", "1");
  rerender(<AppDataGridShell {...common} paginationModel={{ page: 0, pageSize: 2 }} filterRules={initial.filterRules} rows={rows.slice(0, 2)} />);
  expect(screen.getByRole("combobox", { name: "Rows per page" })).toHaveProperty("value", "2");
  expect(screen.getByRole("button", { name: "Previous page" })).toHaveProperty("disabled", true);
  expect(state).toHaveBeenCalledTimes(1); // Host acceptance is not another request.
});

it.each(["list", "cards"] as const)("retains valid %s selection through unknown totals, pending/error and disappearing host rows", async mode => {
  const user = userEvent.setup(); const state = vi.fn(); const selection = vi.fn(); const retry = vi.fn();
  const common = { ...props, mode: "server" as const, paginationModel: { page: 4, pageSize: 1 },
    view: { ...props.view, mode }, onStateChange: state, onRetry: retry,
    selection: { defaultSelectedRowIds: new Set(["a", "b"]), onSelectedRowIdsChange: selection } };
  const { rerender } = render(<AppDataGridShell {...common} hasNextPage />);
  expect(screen.getByText("Total unknown")).toBeTruthy();
  expect(screen.getByText("2 selected")).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Next page" }));
  expect(state.mock.calls[0]![0]).toMatchObject({ paginationModel: { page: 5, pageSize: 1 }, selectedRowIds: new Set(["a", "b"]) });
  rerender(<AppDataGridShell {...common} refreshing hasNextPage />);
  expect(screen.getByText("Refreshing rows")).toBeTruthy();
  expect(screen.getByText("Science")).toBeTruthy();
  rerender(<AppDataGridShell {...common} errorMessage="Host request failed" hasNextPage />);
  expect(screen.getByText("Host request failed")).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Retry" }));
  expect(retry).toHaveBeenCalledTimes(1);
  // The host accepts a replacement page and known total after the first row disappears.
  rerender(<AppDataGridShell {...common} rows={rows.slice(1)} rowCount={2} paginationModel={{ page: 0, pageSize: 1 }} />);
  expect(screen.queryByText("Science")).toBeNull();
  expect(screen.getByText("2 selected")).toBeTruthy(); // Off-page IDs remain host-owned.
  if (mode === "list") expect(screen.getByRole("checkbox", { name: "Select Mathematics" })).toHaveProperty("checked", true);
  else expect(screen.getAllByRole("listitem").map(item => item.textContent)).toEqual(["Mathematics", "History"]);
  rerender(<AppDataGridShell {...common} rows={[]} paginationModel={{ page: 5, pageSize: 1 }} hasNextPage={false} />);
  expect(screen.getByText("No rows available")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Next page" })).toHaveProperty("disabled", true);
  expect(screen.getByRole("button", { name: "Previous page" })).toHaveProperty("disabled", false);
  expect(screen.getByText("2 selected")).toBeTruthy();
  expect(state).toHaveBeenCalledTimes(1);
  expect(selection).not.toHaveBeenCalled();
});

// H-17: separate view keys and owners survive remount without crossing instances.
it("isolates grid/card selection, sorting and filters with distinct persisted view keys", async () => {
  const user = userEvent.setup(); const values = new Map<string, string>();
  const storage = { getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); }, removeItem: (key: string) => { values.delete(key); } };
  const firstState = vi.fn(); const secondState = vi.fn();
  const common = { ...props, pageSizeOptions: [25], defaultPaginationModel: { page: 0, pageSize: 25 },
    toolbar: { filterFields: [{ id: "name", label: "Name", type: "string" as const }] } };
  const pair = <><section aria-label="Grid view"><AppDataGridShell {...common} persistence={{ key: "independent-grid", storage }}
    onStateChange={firstState} /></section><section aria-label="Card view"><AppDataGridShell {...common} label="Other courses"
    view={{ ...props.view, defaultMode: "cards" }} persistence={{ key: "independent-card", storage }} onStateChange={secondState} /></section></>;
  const { unmount } = render(pair);
  const grid = within(screen.getByRole("region", { name: "Grid view" }));
  const cards = within(screen.getByRole("region", { name: "Card view" }));
  await user.click(grid.getByRole("checkbox", { name: "Select Science" }));
  await user.click(grid.getByRole("button", { name: "Sort Score" }));
  await user.click(screen.getByRole("menuitemradio", { name: "Sort Descending" }));
  await user.click(cards.getByRole("button", { name: "Filter" }));
  await user.click(screen.getByRole("button", { name: /Columns 1/ }));
  await user.click(screen.getByRole("option", { name: "Name", exact: true }));
  await user.type(screen.getByLabelText("Value 1"), "History");
  await user.click(screen.getByRole("button", { name: "Apply" }));
  expect(grid.getByText("1 selected")).toBeTruthy();
  expect([...grid.getByRole("grid").querySelectorAll("tbody [data-grid-field='name']")].map(item => item.textContent)).toEqual(["History", "Science", "Mathematics"]);
  expect(cards.queryByText("1 selected")).toBeNull();
  expect(cards.getAllByRole("listitem").map(item => item.textContent)).toEqual(["History"]);
  expect(firstState).toHaveBeenCalledTimes(2); expect(secondState).toHaveBeenCalledTimes(1);
  const savedGrid = JSON.parse(values.get("sgui:grid:independent-grid:v1")!).state;
  const savedCard = JSON.parse(values.get("sgui:grid:independent-card:v1")!).state;
  expect(savedGrid).toMatchObject({ filterRules: [], sortRules: [{ field: "score", direction: "desc" }], viewMode: "list" });
  expect(savedCard).toMatchObject({ filterRules: [{ field: "name", operator: "contains", value: "History" }], sortRules: [], viewMode: "cards" });
  unmount(); render(pair);
  expect(screen.queryByText("1 selected")).toBeNull();
  expect(within(screen.getByRole("region", { name: "Card view" })).getAllByRole("listitem").map(item => item.textContent)).toEqual(["History"]);
  expect([...screen.getByRole("grid", { name: "Courses" }).querySelectorAll("tbody [data-grid-field='name']")].map(item => item.textContent)).toEqual(["History", "Science", "Mathematics"]);
});
