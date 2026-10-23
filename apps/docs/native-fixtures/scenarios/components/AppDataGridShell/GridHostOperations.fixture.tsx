import type { Meta, StoryObj } from "../../../types";
import { useEffect, useState, useSyncExternalStore } from "react";
import { AppDataGrid, Button, type AppDataGridColumn, type AppDataGridRowDragReorderParams } from "@structured-growth/sg-ui/components";
import { Provider } from "@structured-growth/sg-ui/theme";
import { createResponseRaceTransport } from "./AppDataGridShell.server-response-races.fixture";
import { createGridHostOperation } from "./gridHostOperation";

type Course = { id: string; name: string };
const seed: Course[] = [{ id: "a", name: "Alpha" }, { id: "b", name: "Beta" }, { id: "c", name: "Gamma" }];
function OperationHost({ view, transport }: { view: "First" | "Second"; transport: ReturnType<typeof createResponseRaceTransport> }) {
  const [host] = useState(() => createGridHostOperation(seed, async (rows, operation) => {
    // Reuse the existing deliberately uncancelable deferred transport to prove the guard.
    const { id, promise } = transport.dispatch(view, 1, { paginationModel: { page: 0, pageSize: 10 },
      searchValue: `operation=${operation.id}`, sortRules: [], filterRules: [], selectedRowIds: new Set() });
    operation.signal.addEventListener("abort", () => transport.record(`${view}:abort:${id}`), { once: true });
    await promise;
    return rows;
  }));
  const state = useSyncExternalStore(host.subscribe, host.getSnapshot, host.getSnapshot);
  // Cancel invalidates before settlement; also works through Strict Mode effect replay.
  useEffect(() => () => host.cancel(), [host]);
  const columns: AppDataGridColumn<Course>[] = [
    { field: "name", headerName: "Course", minWidth: 180 },
    { field: "actions", headerName: "Actions", cellType: "menu", sortable: false, getMenuActions: () => [
      { id: "rename", label: "Rename course", onPress: row => { void host.request(state.rows.map(item => item.id === row.id ? { ...item, name: `${item.name} revised` } : item)); } },
    ] },
  ];
  const reorder = ({ sourceRowIds, targetRowId, position }: AppDataGridRowDragReorderParams<Course>) => {
    const source = state.rows.filter(row => sourceRowIds.includes(row.id));
    if (!source.length || sourceRowIds.includes(targetRowId)) return;
    const next = state.rows.filter(row => !sourceRowIds.includes(row.id));
    const target = next.findIndex(row => row.id === targetRowId);
    if (target < 0) return;
    next.splice(target + (position === "after" ? 1 : 0), 0, ...source);
    void host.request(next);
  };
  return <section aria-label={`${view} operation host`}>
    <p role={state.phase === "error" ? "alert" : "status"}>{state.phase === "error" ? `Save failed: ${state.error}` : state.phase === "pending" ? "Saving changes" : state.phase === "saved" ? "Changes saved" : state.phase === "canceled" ? "Changes canceled" : "Ready"}</p>
    <Button disabled={state.phase !== "pending"} onPress={() => host.cancel()}>Cancel {view}</Button>
    <Button disabled={state.phase !== "error"} onPress={() => { void host.retry(); }}>Retry {view}</Button>
    <Button onPress={() => host.replace(seed)}>Replace {view} data</Button>
    <AppDataGrid label={`${view} optimistic courses`} rows={state.rows} columns={columns} getRowLabel={row => row.name}
      rowDrag={{ showMoveButtons: true, onReorder: reorder }} hideFooter />
  </section>;
}
function GridHostOperations() {
  const [transport] = useState(createResponseRaceTransport);
  const snapshot = useSyncExternalStore(transport.subscribe, transport.getSnapshot, transport.getSnapshot);
  const [mounted, setMounted] = useState(true);
  return <>
    <p>Row menu and Move requests optimistically update one view. Deferred responses ignore abort to exercise stale settlement.</p>
    <Button onPress={() => setMounted(value => !value)}>Toggle First host</Button>
    <div role="group" aria-label="Operation responses">{snapshot.requests.map(request => <div key={request.id}>
      <Button disabled={request.settled} onPress={() => transport.settle(request.id, "success")}>Resolve {request.id}</Button>
      <Button disabled={request.settled} onPress={() => transport.settle(request.id, "error")}>Reject {request.id}</Button>
    </div>)}</div>
    {mounted && <OperationHost view="First" transport={transport} />}
    <OperationHost view="Second" transport={transport} />
  </>;
}
const meta = { title: "Data Display/AppDataGridShell/Host operations", component: GridHostOperations,
  decorators: [(Story) => <Provider><Story /></Provider>] } satisfies Meta<typeof GridHostOperations>;
export default meta;
export const OptimisticActions: StoryObj<typeof meta> = {};
