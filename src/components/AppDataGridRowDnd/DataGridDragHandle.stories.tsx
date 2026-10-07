import type { Meta, StoryObj } from "@storybook/react-vite";
import { StrictMode, useEffect, useRef, useState } from "react";
import { AppDataGrid } from "../AppDataGrid/AppDataGrid";
import { Button } from "../../experimental/Button/Button";
import { DataGridDragHandle } from "./DataGridDragHandle";

const meta = {
  title: "Data Display/DataGridDragHandle",
  component: DataGridDragHandle,
  args: { label: "Move Introduction" },
  tags: ["autodocs"],
} satisfies Meta<typeof DataGridDragHandle>;
export default meta;
type Story = StoryObj<typeof meta>;
function PreviewHandle() {
  const [active, setActive] = useState(false);
  return <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
    <DataGridDragHandle label="Move Introduction" dragging={active} onPress={() => setActive(value => !value)} />
    <span role="status">{active ? "Move action activated" : "Activate with pointer, Enter or Space"}</span>
  </div>;
}
export const Default: Story = { render: () => <PreviewHandle /> };
export const Disabled: Story = { args: { disabled: true } };

/** G-17/G-28/X-08: one host request at a time with optimistic order and rollback. */
function ReorderAcceptance() {
  const [rows, setRows] = useState(() => Array.from({ length: 5 }, (_, i) => ({ id: `course-${i + 1}`, name: `Course ${i + 1}` })));
  const [pending, setPending] = useState(false);
  const [rejectNext, setRejectNext] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [requests, setRequests] = useState(0);
  const [mounted, setMounted] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return <>
    <Button variant="outlined" tone="neutral" disabled={pending} onPress={() => setRejectNext(value => !value)} aria-pressed={rejectNext}>Reject next move</Button>
    <Button variant="outlined" tone="neutral" disabled={pending} onPress={() => setMounted(value => !value)}>{mounted ? "Unmount grid" : "Mount grid"}</Button>
    <p role="status">{status}</p>
    <p role="status" aria-label="Host requests">{requests} requests</p>
    {mounted && <AppDataGrid rows={rows} columns={[{ field: "name", headerName: "Course", flex: 1 }]}
      label="Strict reorder courses" getRowLabel={row => row.name} refreshing={pending}
      defaultPaginationModel={{ page: 0, pageSize: 10 }} pageSizeOptions={[10]}
      rowDrag={{ onReorder: ({ sourceRowId, targetRowId, position }) => {
        if (pending) return;
        const previous = rows;
        const source = previous.find(row => row.id === sourceRowId)!;
        const next = previous.filter(row => row.id !== sourceRowId);
        next.splice(next.findIndex(row => row.id === targetRowId) + (position === "after" ? 1 : 0), 0, source);
        setRows(next); setPending(true); setRequests(value => value + 1); setStatus("Saving order…");
        timer.current = setTimeout(() => {
          if (rejectNext) { setRows(previous); setStatus("Save failed; previous order restored."); setRejectNext(false); }
          else setStatus("Order saved.");
          setPending(false);
        }, 600);
      } }} />}
  </>;
}
export const StrictModeReorder: Story = { render: () => <StrictMode><ReorderAcceptance /></StrictMode> };
