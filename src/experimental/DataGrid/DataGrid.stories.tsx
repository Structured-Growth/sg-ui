import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DataGrid } from "./DataGrid";
import { Provider } from "../Provider/Provider";
import { Button } from "../Button/Button";
import { defaultGridState, type GridState } from "./types";
const records = Array.from({ length: 60 }, (_, i) => ({ id: String(i), name: `Course ${i + 1}`, score: (i * 7) % 100 }));
const meta = { title: "Migration proofs/DataGrid", component: DataGrid<typeof records[number]>,
  decorators: [(Story) => <Provider><Story /></Provider>],
  args: { label: "Courses", rows: records, columns: [
    { id: "name", label: "Name", getValue: row => row.name }, { id: "score", label: "Score", getValue: row => row.score },
  ], getRowId: row => row.id, getRowLabel: row => row.name },
} satisfies Meta<typeof DataGrid<typeof records[number]>>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Client: Story = { args: { onRefresh: () => {}, renderActions: row => <Button variant="text" tone="neutral" onPress={() => {}}>Edit {row.name}</Button> } };
export const Reordering: Story = { render: args => {
  const [rows, setRows] = useState(records.slice(0, 8));
  return <><p>Reordering is available only for an unfiltered, unsorted dataset on one page. The host commits the order.</p>
    <DataGrid {...args} rows={rows} onReorder={(source, target, position) => setRows(previous => {
      const next = previous.filter(row => row.id !== source);
      const record = previous.find(row => row.id === source)!;
      next.splice(next.findIndex(row => row.id === target) + (position === "after" ? 1 : 0), 0, record); return next;
    })} /></>;
} };
export const Server: Story = { render: args => {
  const [state, setState] = useState<GridState>(defaultGridState);
  return <><p>Host-owned loaded page. Callbacks are shown below; this proof does not fetch or simulate server-side sorting.</p>
    <DataGrid {...args} mode="server" rows={records.slice(state.page * state.pageSize, (state.page + 1) * state.pageSize)}
      total={60} state={state} onStateChange={setState} /><pre>{JSON.stringify(state, null, 2)}</pre></>;
} };
export const Empty: Story = { args: { rows: [] } };
export const FailedLoad: Story = { args: { rows: [], errorMessage: "Host request failed. Refresh to retry.", onRefresh: () => {} } };
