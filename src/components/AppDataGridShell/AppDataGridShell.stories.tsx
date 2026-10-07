import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, useState } from "react";
import { AppDataGridShell } from "./AppDataGridShell";
import type { AppDataGridColumn } from "../AppDataGrid";
import type { OwnedGridCriteriaState } from "../AppDataGrid/ownedGridState";
import { Button } from "../../experimental/Button/Button";

type Course = { id: string; name: string; status: "active" | "archived"; score: number };
const rows: Course[] = Array.from({ length: 58 }, (_, index) => ({ id: `course-${index + 1}`, name: `Course ${index + 1}`,
  status: index % 3 ? "active" : "archived", score: 100 - index }));
const columns: AppDataGridColumn<Course>[] = [
  { field: "name", headerName: "Course", flex: 2, minWidth: 200 },
  { field: "status", headerName: "Status", width: 150, filterType: "enum" },
  { field: "score", headerName: "Score", flex: 1, minWidth: 100, filterType: "number" },
];
const meta = { title: "Data Display/AppDataGridShell", component: AppDataGridShell<Course>,
  decorators: [(Story) => <div style={{ height: 500 }}><Story /></div>],
  args: { label: "Courses", rows, columns, getRowLabel: (row: Course) => row.name,
    pageSizeOptions: [10, 25, 50, 250], defaultPaginationModel: { page: 0, pageSize: 10 },
    toolbar: { filterFields: [{ id: "status", label: "Status", type: "enum", enumOptions: [
      { id: "active", label: "Active" }, { id: "archived", label: "Archived" } ] }] } },
} satisfies Meta<typeof AppDataGridShell<Course>>;
export default meta;
type Story = StoryObj<typeof meta>;
export const SharedListAndCards: Story = { args: { view: { cards: { renderCard: row => <article>
  <h3>{row.name}</h3><p>{row.status} · {row.score}</p><Button onPress={() => {}}>Open {row.name}</Button>
</article> } } } };
export const IndependentInstances: Story = { render: args => <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", height: 500, gap: 16 }}>
  <AppDataGridShell {...args} label="First courses" /> <AppDataGridShell {...args} label="Second courses" />
</div> };

function ServerPreview() {
  const [request, setRequest] = useState<OwnedGridCriteriaState>({ paginationModel: { page: 0, pageSize: 10 }, sortRules: [],
    filterRules: [], searchValue: "", selectedRowIds: new Set() });
  const [loaded, setLoaded] = useState<Course[]>([]);
  const [pending, setPending] = useState(false);
  const latest = useRef(0);
  useEffect(() => {
    const identity = ++latest.current;
    setPending(true);
    // This simulates host work. A slower older request cannot replace new rows.
    const timer = window.setTimeout(() => {
      if (identity !== latest.current) return;
      const matching = rows.filter(row => row.name.toLowerCase().includes(request.searchValue.toLowerCase()));
      setLoaded(matching.slice(request.paginationModel.page * 10, request.paginationModel.page * 10 + 10));
      setPending(false);
    }, request.searchValue.length % 2 ? 600 : 150);
    return () => { window.clearTimeout(timer); };
  }, [request.paginationModel, request.searchValue]);
  return <AppDataGridShell label="Server courses" rows={loaded} columns={columns} getRowLabel={row => row.name}
    mode="server" paginationModel={request.paginationModel} searchValue={request.searchValue} pageSizeOptions={[10]}
    hasNextPage={loaded.length === 10} refreshing={pending} onStateChange={setRequest}
    view={{ cards: { renderCard: row => <article><h3>{row.name}</h3><p>{row.status}</p></article> } }}
    toolbar={{ showFilterButton: false, showSortButton: false }} />;
}
export const ServerLatestRequestWins: Story = { render: () => <ServerPreview /> };

/** Stored state seeds the view once. Reset restores these declared defaults live. */
export const ResetPersistedView: Story = { args: { ...SharedListAndCards.args, showResetView: true,
  persistence: { key: "storybook-course-reset" }, defaultColumnWidths: { status: 150 },
  defaultSortRules: [{ field: "name", direction: "asc" }] } };

/** G-05/H-16: the host holds requests until acceptance and owns response data. */
function ControlledHostResponsesPreview() {
  const [accepted, setAccepted] = useState<OwnedGridCriteriaState>({ paginationModel: { page: 1, pageSize: 10 },
    sortRules: [], filterRules: [], searchValue: "", selectedRowIds: new Set(["course-11", "course-12"]) });
  const [requested, setRequested] = useState<OwnedGridCriteriaState | null>(null);
  const [loaded, setLoaded] = useState(rows.slice(10, 20));
  const [response, setResponse] = useState<"ready" | "pending" | "error">("ready");
  const [hasNext, setHasNext] = useState(true);
  const callbackOrder = useRef<string[]>([]);
  const [lastOrder, setLastOrder] = useState("");
  const acceptRequest = () => {
    if (!requested) return;
    // Host application policy: accept the complete request, then replace rows.
    // Real hosts also discard stale responses before passing rows to the shell.
    const matching = rows.filter(row => row.name.toLowerCase().includes(requested.searchValue.toLowerCase()) &&
      requested.filterRules.every(rule => rule.field !== "name" || row.name.includes(rule.value)));
    matching.sort((left, right) => {
      for (const rule of requested.sortRules) {
        const field = rule.field as keyof Course;
        const a = left[field], b = right[field];
        const result = typeof a === "number" && typeof b === "number" ? a - b : String(a).localeCompare(String(b));
        if (result) return rule.direction === "desc" ? -result : result;
      }
      return 0;
    });
    const start = requested.paginationModel.page * requested.paginationModel.pageSize;
    setLoaded(matching.slice(start, start + requested.paginationModel.pageSize));
    setHasNext(start + requested.paginationModel.pageSize < matching.length);
    setAccepted(requested); setRequested(null); setResponse("ready");
  };
  const removeFocusedRow = (target: HTMLElement) => {
    const id = target.closest<HTMLElement>("[data-grid-row]")?.dataset.gridRow;
    if (id) setLoaded(current => current.filter(row => row.id !== id));
  };
  return <div style={{ height: 500, display: "flex", flexDirection: "column", gap: 8 }} onKeyDown={event => {
    if (event.altKey && event.key === "d") { event.preventDefault(); removeFocusedRow(event.target as HTMLElement); }
    if (event.altKey && event.key === "a") { event.preventDefault(); acceptRequest(); }
  }}>
    <div role="group" aria-label="Host responses">
      <Button onPress={() => setResponse("pending")}>Pending response</Button>
      <Button onPress={() => setResponse("error")}>Failed response</Button>
      <Button disabled={!requested} onPress={acceptRequest}>Accept request</Button>
      <Button onPress={() => { setLoaded([]); setHasNext(false); setResponse("ready"); }}>Empty terminal response</Button>
    </div>
    <output aria-label="Host callback order">{lastOrder || "No request"}</output>
    <output aria-label="Accepted host page">Page {accepted.paginationModel.page}, size {accepted.paginationModel.pageSize}</output>
    <AppDataGridShell label="Controlled host courses" rows={loaded} columns={columns} getRowLabel={row => row.name}
      mode="server" paginationModel={accepted.paginationModel} searchValue={accepted.searchValue}
      sortRules={accepted.sortRules} filterRules={accepted.filterRules} pageSizeOptions={[10, 25]}
      selection={{ selectedRowIds: accepted.selectedRowIds, onSelectedRowIdsChange: selectedRowIds => {
        setAccepted(current => ({ ...current, selectedRowIds }));
      } }} hasNextPage={hasNext} refreshing={response === "pending"}
      errorMessage={response === "error" ? "Host request failed" : undefined} onRetry={() => setResponse("pending")}
      toolbar={{ filterFields: [{ id: "name", label: "Course", type: "string" }] }}
      view={{ cards: { renderCard: row => <Button onPress={() => {}}>Open {row.name}</Button> } }}
      onPaginationModelChange={() => callbackOrder.current.push("page")}
      onFilterRulesChange={() => callbackOrder.current.push("filter")}
      onSortRulesChange={() => callbackOrder.current.push("sort")}
      onSearchChange={() => callbackOrder.current.push("search")}
      onStateChange={next => {
        callbackOrder.current.push("state"); setLastOrder(callbackOrder.current.join(" → "));
        callbackOrder.current = []; setRequested(next);
      }} />
  </div>;
}
export const ControlledHostResponses: Story = { render: () => <ControlledHostResponsesPreview /> };

/** H-17: unrelated grid/card pages persist to different host-selected keys. */
export const IndependentGridAndCards: Story = { render: args => <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", height: 500, gap: 16 }}>
  <section aria-label="Independent grid view" style={{ minWidth: 0, minHeight: 0 }}>
    <AppDataGridShell {...args} label="Grid courses" persistence={{ key: "batch05-independent-grid" }}
      view={{ cards: { renderCard: row => <span>{row.name}</span> } }} />
  </section>
  <section aria-label="Independent card view" style={{ minWidth: 0, minHeight: 0 }}>
    <AppDataGridShell {...args} label="Card courses" persistence={{ key: "batch05-independent-card" }}
      view={{ defaultMode: "cards", cards: { renderCard: row => <span>{row.name}</span> } }} />
  </section>
</div> };

/** Dataset replacement changes display only; the host can accept or reject navigation. */
export const ClientDatasetShrink: Story = { render: args => {
  const [count, setCount] = useState(41);
  const [paginationModel, setPagination] = useState({ page: 3, pageSize: 10 });
  const [accept, setAccept] = useState(false);
  const [requests, setRequests] = useState(0);
  const [lastRequest, setLastRequest] = useState("No request");
  return <div style={{ display: "flex", flexDirection: "column", height: 480, gap: 8 }}>
    <div style={{ display: "flex", gap: 8 }}>
      <Button onPress={() => setCount(11)}>Shrink to 11 rows</Button>
      <Button onPress={() => setCount(0)}>Empty dataset</Button>
      <Button onPress={() => setCount(41)}>Restore 41 rows</Button>
      <Button aria-pressed={accept} onPress={() => setAccept(value => !value)}>Accept navigation</Button>
    </div>
    <span role="status" aria-label="Host pagination">Requested page {paginationModel.page}, requests {requests}</span>
    <span role="status" aria-label="Last pagination request">{lastRequest}</span>
    <div style={{ height: 240, minHeight: 0 }}>
      <AppDataGridShell {...args} rows={rows.slice(0, count)} paginationModel={paginationModel} pageSizeOptions={[10]}
        selection={{ defaultSelectedRowIds: new Set(["course-41"]) }} view={{ cards: { renderCard: row => <article><p>{row.name}</p><Button>Open {row.name}</Button></article> } }}
        onPaginationModelChange={value => { setLastRequest(`Page ${value.page}, size ${value.pageSize}`); if (accept) setPagination(value); }}
        onStateChange={() => setRequests(value => value + 1)} />
    </div>
  </div>;
} };

/** M-17/F3: a single host accepts footer requests in a resizable grid/card shell.
 * Alt+P/E/R changes host response state without moving focus into fixture actions.
 */
// The first focus target must fit the narrow host's padded viewport. Other
// columns still exercise the grid's supported horizontal overflow contract.
const responsiveColumns: AppDataGridColumn<Course>[] = columns.map(column => column.field === "name"
  ? { ...column, minWidth: 160, truncate: false } : column);
function NativeResponsivePreview() {
  const [state, setState] = useState<OwnedGridCriteriaState>({ paginationModel: { page: 0, pageSize: 2 },
    sortRules: [], filterRules: [], searchValue: "", selectedRowIds: new Set(["course-1"]) });
  const [viewMode, setViewMode] = useState<"list" | "cards">("list");
  const [response, setResponse] = useState<"ready" | "pending" | "error">("ready");
  const [requests, setRequests] = useState(0);
  const dataset = rows.slice(0, 4);
  const start = state.paginationModel.page * state.paginationModel.pageSize;
  return <section aria-label="Responsive grid host" style={{ height: 640, display: "flex", flexDirection: "column", minWidth: 0 }}
    onKeyDown={event => {
      if (!event.altKey) return;
      const next = { p: "pending", e: "error", r: "ready" }[event.key.toLowerCase()] as "pending" | "error" | "ready" | undefined;
      if (next) { event.preventDefault(); setResponse(next); }
    }}>
    <Button onPress={() => {}}>Host focus start</Button>
    <output aria-label="Responsive accepted state">Page {state.paginationModel.page}; requests {requests}; view {viewMode}</output>
    <div style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
      <AppDataGridShell label="Responsive courses" rows={dataset.slice(start, start + state.paginationModel.pageSize)}
        columns={responsiveColumns} getRowLabel={row => row.name} mode="server" rowCount={dataset.length}
        paginationModel={state.paginationModel} sortRules={state.sortRules} filterRules={state.filterRules}
        searchValue={state.searchValue} pageSizeOptions={[2]} selection={{ selectedRowIds: state.selectedRowIds,
          onSelectedRowIdsChange: selectedRowIds => setState(current => ({ ...current, selectedRowIds })) }}
        refreshing={response === "pending"} errorMessage={response === "error" ? "Responsive host failed" : undefined}
        onRetry={() => setResponse("pending")} onStateChange={next => { setState(next); setRequests(count => count + 1); }}
        view={{ mode: viewMode, onModeChange: setViewMode, cards: { renderCard: row => <article>
          <p>{row.name}</p><Button onPress={() => {}}>Open {row.name}</Button>
        </article> } }} toolbar={{ filterFields: [{ id: "status", label: "Status", type: "enum", enumOptions: [
          { id: "active", label: "Active" }, { id: "archived", label: "Archived" } ] }] }} />
    </div>
  </section>;
}
export const NativeResponsiveTransitions: Story = { render: () => <NativeResponsivePreview /> };
