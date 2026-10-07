import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Provider } from "../../experimental/Provider/Provider";
import { AppDataGridShell } from "../AppDataGridShell/AppDataGridShell";
import type { OwnedGridCriteriaState } from "./ownedGridState";

const rows = [
  { id: "a", name: "Alpha", score: 2, group: "B" },
  { id: "b", name: "Beta", score: 1, group: "A" },
  { id: "c", name: "Gamma", score: 2, group: "A" },
  { id: "d", name: "Delta", score: 1, group: "B" },
];
const columns = [{ field: "name", headerName: "Course", sortable: false },
  { field: "score", headerName: "Score", filterType: "number" as const },
  { field: "group", headerName: "Group" }];

/** The public shell requests one snapshot; only the host accepts controlled state. */
export function SortAcceptanceExample({ accept = true }: { accept?: boolean }) {
  const [state, setState] = useState<OwnedGridCriteriaState>({
    paginationModel: { page: 1, pageSize: 2 },
    sortRules: [{ field: "score", direction: "asc" }, { field: "group", direction: "asc" }],
    filterRules: [], searchValue: "", selectedRowIds: new Set(),
  });
  const [requests, setRequests] = useState<OwnedGridCriteriaState[]>([]);
  return <>
    <AppDataGridShell rows={rows} columns={columns} label="Sort acceptance courses" getRowLabel={row => row.name}
      {...state} selection={false} pageSizeOptions={[2, 4]} onStateChange={next => {
        setRequests(previous => [...previous, next]);
        if (accept) setState(next);
      }} toolbar={{ showRefreshButton: false, showColumnsButton: false, showSearchButton: false, showFilterButton: false }} />
    <output aria-label="Accepted sorting">{JSON.stringify(state.sortRules)}</output>
    <output aria-label="Sort requests">{JSON.stringify(requests.map(({ paginationModel, sortRules }) => ({ paginationModel, sortRules })))}</output>
  </>;
}
const meta = { title: "Migration proofs/Catalog grid sort acceptance", excludeStories: ["SortAcceptanceExample"],
  decorators: [Story => <Provider><Story /></Provider>] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const ControlledMultiSort: Story = { render: () => <SortAcceptanceExample /> };
export const PendingHostAcceptance: Story = { render: () => <SortAcceptanceExample accept={false} /> };
