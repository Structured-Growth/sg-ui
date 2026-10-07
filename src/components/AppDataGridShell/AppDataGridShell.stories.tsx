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
