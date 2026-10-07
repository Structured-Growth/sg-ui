import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Provider } from "../../experimental/Provider/Provider";
import { Button } from "../../experimental/Button/Button";
import { SGNavigationProvider } from "../../adapters/navigation";
import { DataToolbar } from "../DataToolbar/DataToolbar";
import { AppPaginationFooter } from "../CardPaginationFooter/CardPaginationFooter";
import { OwnedGridInteraction } from "./ownedGridInteraction";
import { useOwnedGridController } from "./ownedGridController";
import { useOwnedGridLayoutController } from "./ownedGridLayoutController";
import { processOwnedGridRows, type OwnedGridSortRule } from "./ownedGridModel";
import type { OwnedGridPresentationColumn } from "./ownedGridColumns";

const records = Array.from({ length: 67 }, (_, index) => ({ id: String(index), name: `Course ${index + 1}`, score: (index * 7) % 100, status: index % 3 ? "active" : "paused", due: `2026-10-${String(index % 28 + 1).padStart(2, "0")}` }));
type RecordRow = typeof records[number];
const filterFields = [{ id: "name", label: "Course", type: "string" as const }, { id: "score", label: "Score", type: "number" as const }];
export function InteractionExample({ server = false }: { server?: boolean }) {
  const [message, setMessage] = useState("No host actions");
  const [refreshing, setRefreshing] = useState(false);
  const [reverse, setReverse] = useState(false);
  const [removed, setRemoved] = useState<string>();
  const columns: OwnedGridPresentationColumn<RecordRow>[] = [
    { field: "name", headerName: "Course", cellType: "link", minWidth: 200, maxWidth: 500, flex: 2, getLink: row => ({ href: `/courses/${row.id}`, label: row.name }) },
    { field: "score", headerName: "Score", filterType: "number", minWidth: 100, maxWidth: 240, flex: 1 },
    { field: "status", headerName: "Status", width: 160 }, { field: "due", headerName: "Due date", cellType: "date", width: 180 },
    { field: "actions", headerName: "Actions", cellType: "menu", sortable: false, width: 120, getMenuActions: () => [
      { id: "edit", label: "Edit course", onPress: row => setMessage(`Edit ${row.id}`) },
      { id: "remove", label: "Remove course", onPress: row => { setRemoved(row.id); setMessage(`Removed ${row.id}`); } },
    ] },
  ];
  const { state, dispatch } = useOwnedGridController({ columns, filterFields, pageSizeOptions: [10, 25, 250], defaultPaginationModel: { page: 0, pageSize: 10 } });
  const { layout, setVisibility, setOrder, setWidths } = useOwnedGridLayoutController({ columns });
  const source = records.filter(row => row.id !== removed);
  const rows = reverse ? [...source].reverse() : source;
  const mode = server ? "server" : "client";
  const supplied = server ? rows.slice(20, 30) : rows;
  const result = processOwnedGridRows({ rows: supplied, columns, ...state, mode, filterFields, hasNextPage: true });
  return <SGNavigationProvider value={{ pathname: "/", navigate: href => setMessage(`Navigate ${href}`) }}>
    <DataToolbar searchValue={state.searchValue} onSearchValueChange={value => dispatch({ type: "search", value })}
      filterFields={filterFields} filterRules={state.filterRules} onFilterRulesChange={value => dispatch({ type: "filter", value })}
      sortOptions={columns.filter(column => column.sortable !== false).map(column => ({ id: column.field, label: column.headerName ?? column.field }))}
      sortRules={state.sortRules} onSortRulesChange={value => dispatch({ type: "sort", value: value.filter(rule => rule.direction !== "") as OwnedGridSortRule[] })}
      columnOptions={columns.map(column => ({ id: column.field, label: column.headerName ?? column.field, locked: layout.lockedFields.includes(column.field), visible: layout.visibility[column.field]! }))}
      onColumnOptionsChange={options => setVisibility(Object.fromEntries(options.map(option => [option.id, option.visible])))}
      selectedCount={state.selectedRowIds.size} leftContent={<Button variant="text" tone="neutral" onPress={() => dispatch({ type: "selection", value: new Set() })}>Select none</Button>}
      onRefresh={() => setRefreshing(value => !value)} />
    <OwnedGridInteraction label={server ? "Server courses" : "Courses"} rows={supplied} columns={columns} getRowLabel={row => row.name} mode={mode}
      {...state} filterFields={filterFields} pageSizeOptions={[10, 25, 250]} hasNextPage
      onSortRulesChange={value => dispatch({ type: "sort", value })} onSelectedRowIdsChange={value => dispatch({ type: "selection", value })}
      columnVisibilityModel={layout.visibility} columnOrder={layout.order} columnWidths={layout.widths} onColumnWidthsChange={setWidths}
      refreshing={refreshing} onRowAction={row => setMessage(`Open ${row.id}`)} style={{ maxHeight: 320 }} />
    <AppPaginationFooter page={state.paginationModel.page} pageSize={state.paginationModel.pageSize} pageSizeOptions={[10, 25, 250]}
      totalCount={result.rowCount} hasNextPage={result.canNextPage} onPaginationModelChange={value => dispatch({ type: "pagination", value })}
      onPageChange={() => {}} onPageSizeChange={() => {}} />
    <Button variant="outlined" tone="neutral" onPress={() => setOrder(["score", "name", "status", "due", "actions"])}>Put score first</Button>
    <Button variant="outlined" tone="neutral" onPress={() => setReverse(value => !value)}>Reverse host rows</Button>
    <p role="status">Host action: {message}. Committed widths: {JSON.stringify(layout.widths)}</p>
    <p>Internal M-16 interaction proof. Server rows remain host supplied. Public catalog integration and persistence are pending.</p>
  </SGNavigationProvider>;
}
const meta = { title: "Migration proofs/Catalog grid interaction", excludeStories: ["InteractionExample"], decorators: [(Story) => <Provider><Story /></Provider>] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Client: Story = { render: () => <InteractionExample /> };
export const Server: Story = { render: () => <InteractionExample server /> };
export const Independent: Story = { render: () => <><InteractionExample /><InteractionExample /></> };
