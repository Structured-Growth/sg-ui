import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AppDataGridShell } from "./AppDataGridShell";
import type { AppDataGridColumn } from "../AppDataGrid";
import type { OwnedGridCriteriaState } from "../AppDataGrid/ownedGridState";
import { Button } from "../../experimental/Button/Button";

type View = "First" | "Second";
type Course = { id: string; name: string };
type Request = { id: number; view: View; epoch: number; search: string; page: number; settled: boolean };
const columns: AppDataGridColumn<Course>[] = [{ field: "name", headerName: "Course", minWidth: 180 }];
const initialCriteria = (): OwnedGridCriteriaState => ({ paginationModel: { page: 0, pageSize: 10 },
  searchValue: "", sortRules: [], filterRules: [], selectedRowIds: new Set() });

/** Host-only fake transport: dispatch starts a real promise; disposal never cancels settlement. */
export function createResponseRaceTransport() {
  let snapshot: { requests: Request[]; trace: string[] } = { requests: [], trace: [] };
  const listeners = new Set<() => void>();
  const deferred = new Map<number, { resolve: (rows: Course[]) => void; reject: (error: Error) => void }>();
  const publish = () => listeners.forEach(listener => listener());
  const record = (event: string) => { snapshot = { ...snapshot, trace: [...snapshot.trace, event] }; publish(); };
  return {
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    getSnapshot: () => snapshot,
    record,
    dispatch(view: View, epoch: number, criteria: OwnedGridCriteriaState) {
      const id = snapshot.requests.length + 1;
      const request: Request = { id, view, epoch, search: criteria.searchValue, page: criteria.paginationModel.page, settled: false };
      const promise = new Promise<Course[]>((resolve, reject) => { deferred.set(id, { resolve, reject }); });
      snapshot = { ...snapshot, requests: [...snapshot.requests, request] };
      record(`${view}:${epoch}:dispatch:${id}:page=${request.page}:search=${request.search}`);
      return { id, promise };
    },
    settle(id: number, outcome: "success" | "error") {
      const pending = deferred.get(id);
      const request = snapshot.requests.find(request => request.id === id);
      if (!pending || !request) return;
      deferred.delete(id);
      snapshot = { ...snapshot, requests: snapshot.requests.map(request => request.id === id ? { ...request, settled: true } : request) };
      record(`${request.view}:${request.epoch}:settle:${id}:${outcome}`);
      if (outcome === "error") pending.reject(new Error(`Request ${id} failed`));
      else pending.resolve([{ id: `${request.view}-${id}`, name: `${request.view} response ${id}` }]);
    },
  };
}
export type ResponseRaceTransport = ReturnType<typeof createResponseRaceTransport>;

function RaceHost({ view, epoch, transport }: { view: View; epoch: number; transport: ResponseRaceTransport }) {
  const [criteria, setCriteria] = useState(initialCriteria);
  const [rows, setRows] = useState<Course[]>([{ id: `${view}-seed`, name: `${view} initial course` }]);
  const [status, setStatus] = useState("ready");
  const [error, setError] = useState<string>();
  const latest = useRef(0);
  const available = useRef(true);
  useEffect(() => {
    available.current = true;
    return () => { available.current = false; transport.record(`${view}:${epoch}:disposed`); };
  }, [epoch, transport, view]);
  const request = (next: OwnedGridCriteriaState) => {
    transport.record(`${view}:${epoch}:callback:state`);
    setCriteria(next); setStatus("pending"); setError(undefined);
    const { id, promise } = transport.dispatch(view, epoch, next);
    latest.current = id;
    const accept = (outcome: "success" | "error", result?: Course[], failure?: Error) => {
      if (!available.current || latest.current !== id) {
        transport.record(`${view}:${epoch}:discard:${id}:${outcome}`);
        return;
      }
      // Guard before every host state update, including pending/error updates.
      if (result) setRows(result);
      setError(failure?.message); setStatus(outcome === "success" ? "ready" : "error");
      transport.record(`${view}:${epoch}:commit:${id}:${outcome}`);
    };
    void promise.then(result => accept("success", result), failure => accept("error", undefined, failure));
  };
  return <>
    <output aria-label={`${view} host state`}>{JSON.stringify({ epoch, page: criteria.paginationModel.page,
      search: criteria.searchValue, status, error: error ?? null, rows: rows.map(row => row.name) })}</output>
    <AppDataGridShell label={`${view} courses`} mode="server" rows={rows} columns={columns}
      getRowLabel={row => row.name} paginationModel={criteria.paginationModel} searchValue={criteria.searchValue}
      sortRules={criteria.sortRules} filterRules={criteria.filterRules} hasNextPage pageSizeOptions={[10]}
      refreshing={status === "pending"} errorMessage={error} onStateChange={request}
      onPaginationModelChange={() => transport.record(`${view}:${epoch}:callback:page`)}
      onSearchChange={() => transport.record(`${view}:${epoch}:callback:search`)}
      toolbar={{ showFilterButton: false, showSortButton: false }} />
  </>;
}

export function ServerResponseRacesFixture({ transport: supplied }: { transport?: ResponseRaceTransport }) {
  const [transport] = useState(() => supplied ?? createResponseRaceTransport());
  const snapshot = useSyncExternalStore(transport.subscribe, transport.getSnapshot, transport.getSnapshot);
  const [hosts, setHosts] = useState({ First: { epoch: 1, mounted: true }, Second: { epoch: 1, mounted: true } });
  return <div>
    <p>Dispatch criteria in either view. Responses remain available after replacement or unmount.</p>
    <p>Within a view: Alt+1 resolves its oldest outstanding response; Alt+2 resolves its newest; Alt+E rejects its oldest.</p>
    <output aria-label="Request lifecycle">{snapshot.trace.join("\n")}</output>
    <div role="group" aria-label="Deferred responses">
      {snapshot.requests.map(request => <div key={request.id}>
        <span>{request.view} request {request.id}: page {request.page}, search {request.search || "(empty)"}</span>
        <Button disabled={request.settled} onPress={() => transport.settle(request.id, "success")}>Resolve {request.id}</Button>
        <Button disabled={request.settled} onPress={() => transport.settle(request.id, "error")}>Reject {request.id}</Button>
      </div>)}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {(["First", "Second"] as const).map(view => <section key={view} aria-label={`${view} view`} onKeyDown={event => {
        if (!event.altKey || !["1", "2", "e"].includes(event.key.toLowerCase())) return;
        const outstanding = snapshot.requests.filter(request => request.view === view && !request.settled);
        const target = event.key === "2" ? outstanding.at(-1) : outstanding[0];
        if (target) { event.preventDefault(); transport.settle(target.id, event.key.toLowerCase() === "e" ? "error" : "success"); }
      }}>
        <Button onPress={() => setHosts(current => ({ ...current, [view]: { epoch: current[view].epoch + 1, mounted: true } }))}>Replace {view} host</Button>
        <Button onPress={() => setHosts(current => ({ ...current, [view]: { ...current[view], mounted: false } }))}>Unmount {view} host</Button>
        <div style={{ height: 420 }}>{hosts[view].mounted && <RaceHost key={hosts[view].epoch} view={view} epoch={hosts[view].epoch} transport={transport} />}</div>
      </section>)}
    </div>
  </div>;
}
const meta = { title: "Data Display/AppDataGridShell/Server response races", component: ServerResponseRacesFixture } satisfies Meta<typeof ServerResponseRacesFixture>;
export default meta;
export const DeferredResponses: StoryObj<typeof meta> = {};
