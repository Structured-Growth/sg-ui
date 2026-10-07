// @vitest-environment jsdom
import { createRef, StrictMode } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OwnedGridInteraction } from "./ownedGridInteraction";
import type { OwnedGridPresentationColumn } from "./ownedGridColumns";
afterEach(cleanup);
type Item = { id: string; name: string; score: number };
const rows: Item[] = [{ id: "a", name: "Science", score: 20 }, { id: "b", name: "Mathematics", score: 10 }, { id: "c", name: "History", score: 30 }];
const columns: OwnedGridPresentationColumn<Item>[] = [{ field: "name", headerName: "Name", width: 180 }, { field: "score", headerName: "Score", minWidth: 80, maxWidth: 200 }];
const props = { label: "Courses", rows, columns, getRowLabel: (row: Item) => row.name };
it("uses owned header sorting and client processing with original host rows", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<OwnedGridInteraction {...props} onStateChange={change} />);
  await user.click(screen.getByRole("button", { name: "Sort Score" }));
  await user.click(screen.getByRole("menuitemradio", { name: "Sort Ascending" }));
  expect(change.mock.calls.at(-1)?.[0].sortRules).toEqual([{ field: "score", direction: "asc" }]);
  expect(screen.getAllByRole("row").slice(1).map(row => within(row).getByRole("rowheader").textContent)).toEqual(["Mathematics", "Science", "History"]);
  expect(rows.map(row => row.id)).toEqual(["a", "b", "c"]);
  expect(screen.getByRole("columnheader", { name: /Score/ }).getAttribute("aria-sort")).toBe("ascending");
});
it("retains off-page and disabled IDs while toggling only selectable page rows", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const { rerender } = render(<OwnedGridInteraction {...props} mode="server" rows={[rows[0]!, rows[1]!]} isRowSelectable={row => row.id !== "b"}
    defaultSelectedRowIds={new Set(["off-page", "b"])} onSelectedRowIdsChange={change} />);
  await user.click(screen.getByRole("checkbox", { name: "Select page" }));
  expect(change).toHaveBeenLastCalledWith(new Set(["off-page", "b", "a"]));
  expect((screen.getByRole("checkbox", { name: "Select Mathematics" }) as HTMLInputElement).disabled).toBe(true);
  rerender(<OwnedGridInteraction {...props} mode="server" rows={[rows[2]!]} isRowSelectable={row => row.id !== "b"}
    defaultSelectedRowIds={new Set()} onSelectedRowIdsChange={change} />);
  await user.click(screen.getByRole("checkbox", { name: "Select History" }));
  expect(change).toHaveBeenLastCalledWith(new Set(["off-page", "b", "a", "c"]));
  await user.click(screen.getByRole("checkbox", { name: "Select page" }));
  expect(change).toHaveBeenLastCalledWith(new Set(["off-page", "b", "a"]));
});
it("keeps controlled selection authoritative and server order unchanged", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<OwnedGridInteraction {...props} mode="server" searchValue="missing" sortRules={[{ field: "score", direction: "asc" }]}
    selectedRowIds={new Set()} onSelectedRowIdsChange={change} />);
  expect(screen.getAllByRole("row").slice(1).map(row => within(row).getByRole("rowheader").textContent)).toEqual(["Science", "Mathematics", "History"]);
  await user.click(screen.getByRole("checkbox", { name: "Select Science" }));
  expect(change).toHaveBeenCalledExactlyOnceWith(new Set(["a"]));
  expect((screen.getByRole("checkbox", { name: "Select Science" }) as HTMLInputElement).checked).toBe(false);
});
it("commits bounded numeric keyboard widths without freezing untouched flex columns", async () => {
  const user = userEvent.setup(); const widths = vi.fn();
  render(<OwnedGridInteraction {...props} onColumnWidthsChange={widths} />);
  const slider = screen.getByRole("slider", { name: /Resize Name/ });
  await user.click(slider); await user.keyboard("{Enter}{ArrowRight}{Enter}");
  expect(widths.mock.calls.at(-1)?.[0]).toEqual({ name: 190 });
});
it("accepts repeated focused native slider changes without a pointer or key event", () => {
  const widths = vi.fn();
  render(<OwnedGridInteraction {...props} onColumnWidthsChange={widths} />);
  const slider = screen.getByRole("slider", { name: /Resize Name/ });
  fireEvent.focus(slider); slider.focus();
  fireEvent.change(slider, { target: { value: "220" } });
  expect(widths).toHaveBeenLastCalledWith({ name: 190 });
  fireEvent.change(slider, { target: { value: "240" } });
  expect(widths).toHaveBeenLastCalledWith({ name: 200 });
});
it("forwards native container/table refs and applies locks, order and hidden fields", () => {
  const ref = createRef<HTMLDivElement>(); const tableRef = createRef<HTMLTableElement>();
  const action = { field: "actions", headerName: "Actions", cellType: "menu" as const, sortable: false };
  render(<OwnedGridInteraction {...props} columns={[...columns, action]} ref={ref} tableRef={tableRef}
    columnOrder={["actions", "score", "name"]} columnVisibilityModel={{ name: false, score: false, actions: false }} />);
  expect(ref.current?.tagName).toBe("DIV"); expect(tableRef.current?.tagName).toBe("TABLE");
  expect(screen.getAllByRole("columnheader").map(header => header.textContent)).toEqual(["Select page", "Name", "Actions"]);
});
it("remeasures flex allocation while preserving a committed width override", () => {
  const size = vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(1000);
  const observers: Array<{ callback: ResizeObserverCallback; target?: Element }> = [];
  vi.stubGlobal("ResizeObserver", class {
    entry: { callback: ResizeObserverCallback; target?: Element };
    constructor(callback: ResizeObserverCallback) { this.entry = { callback }; observers.push(this.entry); }
    observe(target: Element) { this.entry.target = target; }
    unobserve() {}
    disconnect() {}
  });
  try {
    const flexible = columns.map(column => ({ ...column, width: undefined, maxWidth: undefined, flex: 1 }));
    const { rerender } = render(<OwnedGridInteraction {...props} columns={flexible} />);
    expect(screen.getByRole("columnheader", { name: /Name/ }).style.width).toBe("460px");
    size.mockReturnValue(600);
    act(() => {
      for (const observer of observers.filter(entry => entry.target?.getAttribute("data-sgui-part") === "grid-container")) {
        observer.callback([{ target: observer.target, contentRect: { width: 600, height: 300 } } as ResizeObserverEntry], {} as ResizeObserver);
      }
    });
    expect(screen.getByRole("columnheader", { name: /Name/ }).style.width).toBe("260px");
    rerender(<OwnedGridInteraction {...props} columns={flexible} columnWidths={{ name: 300 }} />);
    expect(screen.getByRole("columnheader", { name: /Name/ }).style.width).toBe("300px");
    expect(screen.getByRole("columnheader", { name: /Score/ }).style.width).toBe("220px");
  } finally { cleanup(); size.mockRestore(); vi.unstubAllGlobals(); }
});
it("nested menu activation does not activate or select its row and restores trigger focus", async () => {
  const user = userEvent.setup(); const action = vi.fn(); const rowAction = vi.fn(); const select = vi.fn();
  const actionColumn: OwnedGridPresentationColumn<Item> = { field: "actions", headerName: "Actions", cellType: "menu", sortable: false,
    getMenuActions: () => [{ id: "edit", label: "Edit course", onPress: action }] };
  render(<OwnedGridInteraction {...props} columns={[...columns, actionColumn]} onRowAction={rowAction} onSelectedRowIdsChange={select} />);
  const trigger = screen.getByRole("button", { name: "Actions for Science" });
  await user.click(trigger); await user.click(screen.getByRole("menuitem", { name: "Edit course" }));
  expect(action).toHaveBeenCalledExactlyOnceWith(rows[0]);
  expect(rowAction).not.toHaveBeenCalled(); expect(select).not.toHaveBeenCalled();
  await waitFor(() => expect(document.activeElement).toBe(trigger));
});
it("keeps focused nested controls on stable rows and repairs deleted row focus in its own grid", async () => {
  const user = userEvent.setup();
  const links: OwnedGridPresentationColumn<Item>[] = [{ field: "name", headerName: "Name", cellType: "link", getLink: row => ({ href: `/courses/${row.id}`, label: row.name }) }];
  const { rerender } = render(<><OwnedGridInteraction {...props} columns={links} /><OwnedGridInteraction {...props} columns={links} label="Other courses" /></>);
  const first = screen.getByRole("grid", { name: "Courses" });
  const link = within(first).getByRole("link", { name: "Science" });
  link.focus();
  rerender(<><OwnedGridInteraction {...props} rows={[...rows].reverse()} columns={links} /><OwnedGridInteraction {...props} columns={links} label="Other courses" /></>);
  expect(document.activeElement).toBe(within(first).getByRole("link", { name: "Science" }));
  rerender(<><OwnedGridInteraction {...props} rows={rows.slice(1)} columns={links} /><OwnedGridInteraction {...props} columns={links} label="Other courses" /></>);
  expect(first.contains(document.activeElement)).toBe(true);
  await user.click(within(screen.getByRole("grid", { name: "Other courses" })).getByRole("checkbox", { name: "Select Science" }));
  rerender(<><OwnedGridInteraction {...props} rows={[]} columns={links} /><OwnedGridInteraction {...props} columns={links} label="Other courses" /></>);
  expect(screen.getByRole("grid", { name: "Other courses" }).contains(document.activeElement)).toBe(true);
});
it("retains rows during refresh/error and distinguishes empty versus filtered results", () => {
  const ref = createRef<HTMLDivElement>();
  const { rerender } = render(<OwnedGridInteraction {...props} ref={ref} refreshing />);
  expect(screen.getByText("Refreshing rows")).toBeTruthy(); expect(screen.getByText("Science")).toBeTruthy();
  expect(ref.current?.contains(screen.getByText("Refreshing rows"))).toBe(false);
  rerender(<OwnedGridInteraction {...props} errorMessage="Host request failed" onRetry={() => {}} />);
  expect(screen.getByRole("alert").textContent).toContain("Host request failed"); expect(screen.getByText("Science")).toBeTruthy();
  rerender(<OwnedGridInteraction {...props} rows={[]} />); expect(screen.getByText("No rows available")).toBeTruthy();
  rerender(<OwnedGridInteraction {...props} searchValue="missing" />); expect(screen.getByText("No results found")).toBeTruthy();
});
it("moves focus to the native grid entry when a requested page is still loading", () => {
  const { rerender } = render(<OwnedGridInteraction {...props} mode="server" paginationModel={{ page: 0, pageSize: 25 }} />);
  screen.getByRole("rowheader", { name: "Science" }).focus();
  rerender(<OwnedGridInteraction {...props} mode="server" rows={[]} loading paginationModel={{ page: 1, pageSize: 25 }} />);
  expect(document.activeElement).toBe(screen.getByRole("grid", { name: "Courses" }));
  expect(screen.getByText("Loading rows")).toBeTruthy();
});

it("omits drag hooks without reorder and preserves header focus when host toggles reorder", async () => {
  const warn = vi.spyOn(console, "warn");
  const containerRef = createRef<HTMLDivElement>(); const tableRef = createRef<HTMLTableElement>();
  const reorder = { onReorder: vi.fn() };
  try {
    const { rerender } = render(<OwnedGridInteraction {...props} ref={containerRef} tableRef={tableRef} />);
    const container = containerRef.current; const ordinaryTable = tableRef.current;
    const sortButton = screen.getByRole("button", { name: "Sort Score" });
    act(() => sortButton.focus());
    rerender(<OwnedGridInteraction {...props} ref={containerRef} tableRef={tableRef} rowDrag={reorder} />);
    expect(containerRef.current).toBe(container);
    expect(tableRef.current).not.toBe(ordinaryTable);
    // An unrelated host render before the collection settles must not cancel repair.
    const enabledTable = tableRef.current;
    rerender(<OwnedGridInteraction {...props} ref={containerRef} tableRef={tableRef} rowDrag={{ ...reorder }} />);
    expect(tableRef.current).toBe(enabledTable);
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Sort Score" })));
    expect(screen.getByRole("button", { name: "Reorder Science" })).toBeTruthy();
    const reorderTable = tableRef.current;
    rerender(<OwnedGridInteraction {...props} ref={containerRef} tableRef={tableRef} rowDrag={{ ...reorder }} />);
    expect(tableRef.current).toBe(reorderTable);
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Sort Score" })));
    rerender(<OwnedGridInteraction {...props} ref={containerRef} tableRef={tableRef} />);
    expect(containerRef.current).toBe(container);
    expect(screen.queryByRole("button", { name: "Reorder Science" })).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Sort Score" })));
    const outside = document.createElement("button"); outside.textContent = "Host action"; document.body.append(outside);
    try {
      rerender(<OwnedGridInteraction {...props} ref={containerRef} tableRef={tableRef} rowDrag={reorder} />);
      act(() => outside.focus());
      await act(async () => { await new Promise<void>(resolve => requestAnimationFrame(() => resolve())); });
      expect(document.activeElement).toBe(outside);
    } finally { outside.remove(); }
    expect(warn.mock.calls.filter(([message]) => /Drag hooks|Drop hooks|Draggable items/.test(String(message)))).toEqual([]);
  } finally { warn.mockRestore(); }
});

it("resets the page entry and both scroll axes for an accepted page-size change", () => {
  const ref = createRef<HTMLDivElement>();
  const { rerender } = render(<OwnedGridInteraction {...props} ref={ref} pageSizeOptions={[10, 25]} paginationModel={{ page: 0, pageSize: 25 }} />);
  act(() => screen.getByRole("gridcell", { name: "10" }).focus());
  ref.current!.scrollTop = 100; ref.current!.scrollLeft = 80;
  rerender(<OwnedGridInteraction {...props} ref={ref} pageSizeOptions={[10, 25]} paginationModel={{ page: 0, pageSize: 10 }} />);
  expect(document.activeElement).toBe(screen.getByRole("rowheader", { name: "Science" }));
  expect(ref.current!.scrollTop).toBe(0); expect(ref.current!.scrollLeft).toBe(0);
});

it("repairs a disappearing focused row to the same body field without pruning retained selection", () => {
  const retained = { defaultSelectedRowIds: new Set(["b"]) };
  const { rerender } = render(<OwnedGridInteraction {...props} {...retained} />);
  act(() => screen.getByRole("gridcell", { name: "10" }).focus());
  rerender(<OwnedGridInteraction {...props} {...retained} rows={[rows[0]!, rows[2]!]} />);
  expect(document.activeElement?.getAttribute("data-grid-field")).toBe("score");
  expect(document.activeElement?.closest("tbody")).not.toBeNull();
  expect(document.activeElement?.getAttribute("data-grid-row")).not.toBe("b");
  rerender(<OwnedGridInteraction {...props} {...retained} />);
  expect((screen.getByRole("checkbox", { name: "Select Mathematics" }) as HTMLInputElement).checked).toBe(true);
});

it("repairs a hidden focused field within its row and preserves the native scroll position", () => {
  const ref = createRef<HTMLDivElement>();
  const { rerender } = render(<OwnedGridInteraction {...props} ref={ref} />);
  act(() => screen.getByRole("gridcell", { name: "10" }).focus());
  ref.current!.scrollTop = 100; ref.current!.scrollLeft = 80;
  rerender(<OwnedGridInteraction {...props} ref={ref} columnVisibilityModel={{ score: false }} />);
  expect(screen.getByRole("row", { name: /Mathematics/ }).contains(document.activeElement)).toBe(true);
  expect(ref.current!.scrollTop).toBe(100); expect(ref.current!.scrollLeft).toBe(80);
});

it("does not revive stale grid focus after focus deliberately left for a host control", () => {
  const host = document.createElement("button"); document.body.append(host);
  try {
    const { rerender } = render(<OwnedGridInteraction {...props} mode="server" paginationModel={{ page: 0, pageSize: 25 }} />);
    act(() => screen.getByRole("rowheader", { name: "Science" }).focus());
    act(() => host.focus());
    host.remove();
    expect(document.activeElement).toBe(document.body);
    rerender(<OwnedGridInteraction {...props} mode="server" paginationModel={{ page: 1, pageSize: 25 }} />);
    expect(document.activeElement).toBe(document.body);
  } finally { host.remove(); }
});


it("exposes native busy state across pending, failure, retry and table replacement", () => {
  const tableRef = createRef<HTMLTableElement>();
  const { rerender } = render(<OwnedGridInteraction {...props} tableRef={tableRef} loading />);
  expect(tableRef.current).toBe(screen.getByRole("grid", { name: "Courses" }));
  expect(tableRef.current?.getAttribute("aria-busy")).toBe("true");
  rerender(<OwnedGridInteraction {...props} tableRef={tableRef} refreshing />);
  expect(tableRef.current?.getAttribute("aria-busy")).toBe("true");
  rerender(<OwnedGridInteraction {...props} tableRef={tableRef} errorMessage="Host request failed" />);
  expect(tableRef.current?.hasAttribute("aria-busy")).toBe(false);
  rerender(<OwnedGridInteraction {...props} tableRef={tableRef} loading rowDrag={{ onReorder: vi.fn() }} />);
  expect(tableRef.current?.getAttribute("aria-busy")).toBe("true");
  rerender(<OwnedGridInteraction {...props} tableRef={tableRef} />);
  expect(tableRef.current?.hasAttribute("aria-busy")).toBe(false);
});

it("keeps one retained-row announcement through failure and host retry without moving another grid's focus", async () => {
  const user = userEvent.setup(); const retry = vi.fn(); const ref = createRef<HTMLDivElement>();
  const view = (pending = false, errorMessage?: string) => <>
    <OwnedGridInteraction {...props} ref={ref} refreshing={pending} errorMessage={errorMessage} onRetry={retry} />
    <OwnedGridInteraction {...props} label="Independent courses" />
  </>;
  const { rerender } = render(view());
  const grid = screen.getByRole("grid", { name: "Courses" });
  const cell = within(grid).getByRole("rowheader", { name: "Science" });
  act(() => cell.focus());
  ref.current!.scrollTop = 100; ref.current!.scrollLeft = 80;
  rerender(view(true));
  const message = screen.getByText("Refreshing rows");
  const live = message.closest('[role="status"]')!;
  expect(live.getAttribute("aria-live")).toBe("polite");
  expect(live.getAttribute("aria-atomic")).toBe("true");
  expect(grid.contains(live)).toBe(false);
  const mutations: MutationRecord[] = [];
  const observer = new MutationObserver(records => mutations.push(...records));
  observer.observe(live, { subtree: true, childList: true, characterData: true });
  rerender(view(true));
  await act(async () => { await Promise.resolve(); });
  observer.disconnect();
  expect(mutations).toEqual([]);
  expect(screen.getAllByText("Refreshing rows")).toHaveLength(1);
  expect(document.activeElement).toBe(cell);
  expect([ref.current!.scrollTop, ref.current!.scrollLeft]).toEqual([100, 80]);
  rerender(view(false, "Host request failed"));
  expect(screen.getAllByRole("alert")).toHaveLength(1);
  expect(screen.getByRole("alert").getAttribute("aria-live")).toBe("assertive");
  expect(screen.queryByText("Refreshing rows")).toBeNull();
  expect(document.activeElement).toBe(cell);
  await user.click(screen.getByRole("button", { name: "Retry" }));
  expect(retry).toHaveBeenCalledExactlyOnceWith();
  // Retry is a request: only host state changes establish a new pending cycle.
  expect(grid.hasAttribute("aria-busy")).toBe(false);
  const other = screen.getByRole("grid", { name: "Independent courses" });
  const otherCell = within(other).getByRole("rowheader", { name: "Science" });
  act(() => otherCell.focus());
  rerender(view(true));
  expect(screen.queryByRole("alert")).toBeNull();
  expect(screen.getAllByText("Refreshing rows")).toHaveLength(1);
  expect(other.hasAttribute("aria-busy")).toBe(false);
  expect(document.activeElement).toBe(otherCell);
  rerender(view());
  expect(screen.queryByText("Refreshing rows")).toBeNull();
  expect(within(grid).getByRole("rowheader", { name: "Science" })).toBe(cell);
  expect(document.activeElement).toBe(otherCell);
  expect([ref.current!.scrollTop, ref.current!.scrollLeft]).toEqual([100, 80]);
});


it("initializes empty pending tables before forwarding their native ref and avoids duplicate busy mutations", async () => {
  const seen: string[] = [];
  const tableRef = (node: HTMLTableElement | null) => { if (node) seen.push(node.getAttribute("aria-busy") ?? "absent"); };
  const view = (pending: boolean) => <StrictMode><OwnedGridInteraction {...props} rows={[]} loading={pending} tableRef={tableRef} /></StrictMode>;
  const { rerender } = render(view(true));
  const table = screen.getByRole("grid", { name: "Courses" });
  expect(seen.length).toBeGreaterThan(0);
  expect(seen.every(value => value === "true")).toBe(true);
  expect(screen.getAllByText("Loading rows")).toHaveLength(1);
  const records: MutationRecord[] = [];
  const observer = new MutationObserver(mutations => records.push(...mutations));
  observer.observe(table, { attributes: true, attributeFilter: ["aria-busy"] });
  rerender(view(true));
  await act(async () => { await Promise.resolve(); });
  expect(records).toHaveLength(0);
  rerender(view(false));
  await act(async () => { await Promise.resolve(); });
  observer.disconnect();
  expect(records).toHaveLength(1);
  expect(table.hasAttribute("aria-busy")).toBe(false);
  expect(screen.getAllByText("No rows available")).toHaveLength(1);
});


it.each([false, true])("repairs disappearing Retry to its native grid entry with empty rows=%s", async (empty) => {
  const ref = createRef<HTMLDivElement>(); const retry = vi.fn(); const selection = vi.fn();
  const view = (error = true, pending = false, callback: (() => void) | null = retry) =>
    <OwnedGridInteraction {...props} rows={empty ? [] : rows} ref={ref}
      errorMessage={error ? "Host failed" : undefined} refreshing={pending} onRetry={callback ?? undefined}
      selectedRowIds={new Set(["a", "off-page"])} onSelectedRowIdsChange={selection} />;
  const { rerender } = render(view());
  const grid = screen.getByRole("grid", { name: "Courses" });
  const cell = empty ? null : within(grid).getByRole("rowheader", { name: "Science" });
  for (const transition of ["pending", "success", "callback removed"] as const) {
    rerender(view());
    act(() => screen.getByRole("button", { name: "Retry" }).focus());
    ref.current!.scrollTop = 100; ref.current!.scrollLeft = 80;
    const entry = cell ?? within(grid).getByRole("columnheader", { name: /Name/ });
    const nativeFocus = vi.spyOn(entry, "focus");
    rerender(view(transition === "callback removed", transition === "pending", transition === "callback removed" ? null : retry));
    await waitFor(() => expect(document.activeElement).toBe(entry));
    expect(nativeFocus).toHaveBeenLastCalledWith({ preventScroll: true });
    nativeFocus.mockRestore();
    expect([ref.current!.scrollTop, ref.current!.scrollLeft]).toEqual([100, 80]);
    if (cell) expect(within(grid).getByRole("rowheader", { name: "Science" })).toBe(cell);
  }
  expect(retry).not.toHaveBeenCalled();
  expect(selection).not.toHaveBeenCalled();
});

it.each([false, true])("ends Retry focus ownership on deliberate host/independent focus with empty rows=%s", (empty) => {
  const view = (error = true) => <>
    <button>Host action</button>
    <OwnedGridInteraction {...props} rows={empty ? [] : rows} errorMessage={error ? "Host failed" : undefined} onRetry={() => {}} />
    <OwnedGridInteraction {...props} label="Independent courses" />
  </>;
  const { rerender } = render(view());
  const other = within(screen.getByRole("grid", { name: "Independent courses" })).getByRole("rowheader", { name: "Science" });
  for (const target of [screen.getByRole("button", { name: "Host action" }), other]) {
    rerender(view());
    act(() => screen.getByRole("button", { name: "Retry" }).focus());
    act(() => target.focus());
    rerender(view(false));
    expect(document.activeElement).toBe(target);
    act(() => target.blur());
    rerender(view(false));
    expect(document.activeElement).toBe(document.body);
  }
});
