import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { AppDataGrid } from "./AppDataGrid";
import { createActionMenuColumn } from "./createActionMenuColumn";
import { Provider } from "../../experimental/Provider/Provider";
import { Button } from "../../experimental/Button/Button";

type Course = { id: string; name: string; score: number; status: string };
const rows: Course[] = Array.from({ length: 58 }, (_, index) => ({ id: `course-${index + 1}`, name: `Course ${index + 1}`, score: index % 11, status: index % 3 ? "Published" : "Draft" }));
const columns = [{ field: "name", headerName: "Course", flex: 2, minWidth: 180 },
  { field: "score", headerName: "Score", flex: 1, minWidth: 100 },
  { field: "status", headerName: "Status", width: 160 },
  createActionMenuColumn<Course>({ getMenuActions: row => [{ id: "open", label: `Open ${row.name}`, href: `/courses/${row.id}` }] })];
const meta = { title: "Data/AppDataGrid", component: AppDataGrid<Course>,
  args: { rows, columns, label: "Courses", getRowLabel: row => row.name, pageSizeOptions: [10, 25, 250], defaultPaginationModel: { page: 0, pageSize: 10 } },
  decorators: [Story => <Provider><div style={{ height: 480 }}><Story /></div></Provider>],
  tags: ["autodocs"] } satisfies Meta<typeof AppDataGrid<Course>>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const UnknownServerTotal: Story = { args: { mode: "server", rows: rows.slice(10, 20), defaultPaginationModel: { page: 1, pageSize: 10 }, hasNextPage: true } };
export const RetainedSelection: Story = { render: args => {
  const [selectedRowIds, onSelectedRowIdsChange] = useState(new Set(["course-55"]));
  return <AppDataGrid {...args} selection={{ selectedRowIds, onSelectedRowIdsChange, isRowSelectable: row => row.id !== "course-2" }} />;
} };
export const Loading: Story = { args: { loading: true, rows: [] } };
export const Refreshing: Story = { args: { refreshing: true } };
export const Error: Story = { args: { errorMessage: "The host could not load these courses.", onRetry: () => {} } };

/** Host-owned optimistic persistence and rollback; the grid only emits requests. */
function HostReorder() {
  const [courses, setCourses] = useState(rows.slice(0, 5));
  const [pending, setPending] = useState(false);
  const [failNext, setFailNext] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [reorderEnabled, setReorderEnabled] = useState(true);
  return <>
    <Button variant="outlined" tone="neutral" aria-pressed={reorderEnabled} onPress={() => setReorderEnabled(value => !value)}>Enable row reorder</Button>
    <button type="button" onClick={() => setFailNext(value => !value)} aria-pressed={failNext}>Reject next move</button>
    <p role="status">{status}</p>
    <AppDataGrid rows={courses} columns={columns} label="Reorder courses" getRowLabel={row => row.name}
      defaultPaginationModel={{ page: 0, pageSize: 10 }} pageSizeOptions={[10]} refreshing={pending}
      rowDrag={reorderEnabled ? { onReorder: ({ sourceRowId, targetRowId, position }) => {
        if (pending) return;
        const previous = courses;
        const source = previous.find(row => row.id === sourceRowId)!;
        const next = previous.filter(row => row.id !== sourceRowId);
        next.splice(next.findIndex(row => row.id === targetRowId) + (position === "after" ? 1 : 0), 0, source);
        setCourses(next); setPending(true); setStatus("Saving order…");
        // A real host substitutes its persistence adapter here. This fixture has
        // one outstanding request and restores its own snapshot on failure.
        window.setTimeout(() => {
          if (failNext) { setCourses(previous); setStatus("Save failed; previous order restored."); setFailNext(false); }
          else setStatus("Order saved.");
          setPending(false);
        }, 600);
      } } : undefined} />
  </>;
}
export const HostOwnedReorder: Story = { render: () => <HostReorder /> };
export const ReorderUnavailableWhileSorted: Story = { args: { rows: rows.slice(0, 5), sortRules: [{ field: "name", direction: "asc" }], rowDrag: { onReorder: () => {} } } };

/** Bounded browser smoke workload; timings are recorded, not a cross-hardware SLA. */
export const BrowserPerformance: Story = { args: {
  rows: Array.from({ length: 1000 }, (_, index) => ({ id: `course-${index + 1}`, name: `Course ${index + 1}`, score: index % 11, status: index % 3 ? "Published" : "Draft" })),
  defaultPaginationModel: { page: 0, pageSize: 250 },
} };
