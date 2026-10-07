import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Provider } from "../../experimental/Provider/Provider";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeaderCell, TableRow } from "../../experimental/Table/Table";
import { DataToolbar, type DataToolbarFilterField } from "../DataToolbar/DataToolbar";
import { AppPaginationFooter } from "../CardPaginationFooter/CardPaginationFooter";
import { processOwnedGridRows, type OwnedGridColumn } from "./ownedGridModel";
import { notifyOwnedGridTransition, transitionOwnedGridState, type OwnedGridCriteriaState, type OwnedGridTransition } from "./ownedGridState";

const records = Array.from({ length: 67 }, (_, index) => ({ id: String(index), name: `Course ${index + 1}`, score: (index * 7) % 100, status: index % 3 ? "active" : "paused", due: `2026-10-${String(index % 28 + 1).padStart(2, "0")}` }));
const columns: OwnedGridColumn<typeof records[number]>[] = [{ field: "name" }, { field: "score", filterType: "number" }, { field: "status", filterType: "enum" }, { field: "due", filterType: "date" }];
const filterFields: DataToolbarFilterField[] = [{ id: "name", label: "Course", type: "string" }, { id: "score", label: "Score", type: "number" }, { id: "status", label: "Status", type: "enum", enumOptions: [{ id: "active", label: "Active" }, { id: "paused", label: "Paused" }] }, { id: "due", label: "Due date", type: "date" }];

export function ProcessingExample({ server = false }: { server?: boolean }) {
  const [state, setState] = useState<OwnedGridCriteriaState>({ paginationModel: { page: 2, pageSize: 10 }, sortRules: [], filterRules: [], searchValue: "", selectedRowIds: new Set() });
  const [notification, setNotification] = useState<string[]>([]);
  const apply = (action: OwnedGridTransition) => {
    const next = transitionOwnedGridState(state, action, { columns, filterFields, pageSizeOptions: [10, 25, 250] });
    const order: string[] = [];
    notifyOwnedGridTransition(state, next, action, {
      onPaginationModelChange: () => order.push("pagination"),
      onSearchChange: () => order.push("search"), onSortRulesChange: () => order.push("sort"), onFilterRulesChange: () => order.push("filter"),
      onStateChange: () => order.push("combined snapshot"),
    });
    setState(next); setNotification(order);
  };
  const result = processOwnedGridRows({ rows: server ? records.slice(20, 30) : records, columns, ...state, filterFields, mode: server ? "server" : "client", hasNextPage: true });
  return <>
    <p>{server ? "Server processing preserves this supplied page and its order; criteria request a host update. The total is unknown." : "Shared processing applies search and filters, then ordered sorting and pagination. Changing criteria resets page three to page one."}</p>
    <DataToolbar searchValue={state.searchValue} onSearchValueChange={value => apply({ type: "search", value })}
      filterFields={filterFields} filterRules={state.filterRules} onFilterRulesChange={value => apply({ type: "filter", value })}
      sortOptions={filterFields.map(field => ({ id: field.id, label: field.label }))} sortRules={state.sortRules} onSortRulesChange={value => apply({ type: "sort", value: value.filter(rule => rule.direction !== "") as OwnedGridCriteriaState["sortRules"] })}
      showRefreshButton={false} showColumnsButton={false} />
    <Table><TableCaption>Processing results</TableCaption><TableHead><TableRow>{filterFields.map(field => <TableHeaderCell key={field.id}>{field.label}</TableHeaderCell>)}</TableRow></TableHead>
      <TableBody>{result.rows.map(row => <TableRow key={row.id}><TableCell>{row.name}</TableCell><TableCell>{row.score}</TableCell><TableCell>{row.status}</TableCell><TableCell>{row.due}</TableCell></TableRow>)}</TableBody>
    </Table>
    <AppPaginationFooter page={state.paginationModel.page} pageSize={state.paginationModel.pageSize} pageSizeOptions={[10, 25, 250]} totalCount={result.rowCount} hasNextPage={result.canNextPage}
      onPaginationModelChange={model => apply(model.pageSize !== state.paginationModel.pageSize ? { type: "pageSize", value: model.pageSize } : { type: "page", value: model.page })}
      onPageChange={value => apply({ type: "page", value })} onPageSizeChange={value => apply({ type: "pageSize", value })} />
    <p role="status">Notifications: {notification.join(" → ") || "No changes"}</p>
    <p>This is a processing integration proof. The catalog grid interaction and cells remain in the next M-16 batches.</p>
  </>;
}
const meta = { title: "Migration proofs/Catalog grid processing", excludeStories: ["ProcessingExample"], decorators: [(Story) => <Provider><Story /></Provider>] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Client: Story = { render: () => <ProcessingExample /> };
export const Server: Story = { render: () => <ProcessingExample server /> };
