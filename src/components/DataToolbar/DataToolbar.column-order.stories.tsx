import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Provider } from "../../experimental/Provider/Provider";
import { AppDataGridShell } from "../AppDataGridShell/AppDataGridShell";
import type { AppDataGridColumn } from "../AppDataGrid";

type Course = { id: string; name: string; site: string; score: number; notes: string };
const columns: AppDataGridColumn<Course>[] = [
  { field: "name", headerName: "Course", locked: true },
  { field: "site", headerName: "Site" },
  { field: "score", headerName: "Score" },
  { field: "notes", headerName: "Notes" },
  { field: "actions", headerName: "Actions", cellType: "menu", getMenuActions: () => [{ id: "open", label: "Open course", onPress: () => {} }] },
];

/** The host accepts owned order/visibility requests; the catalog normalizes actions last. */
function ControlledColumnOrderPreview() {
  const [order, setOrder] = useState(columns.map(column => column.field));
  const [visibility, setVisibility] = useState<Record<string, boolean>>({ notes: false });
  return <Provider>
    <AppDataGridShell label="Course column order" columns={columns}
      rows={[{ id: "science", name: "Science", site: "North campus", score: 20, notes: "Host notes" }]}
      getRowLabel={row => row.name} columnOrder={order} onColumnOrderChange={setOrder}
      columnVisibilityModel={visibility} onColumnVisibilityModelChange={setVisibility}
      toolbar={{ showSearchButton: false, showSortButton: false, showFilterButton: false, showRefreshButton: false }} />
    <output aria-label="Host column order">{order.join(",")}</output>
    <output aria-label="Host column visibility">{JSON.stringify(visibility)}</output>
  </Provider>;
}
const meta = { title: "Data Display/DataToolbar/Column Order", component: ControlledColumnOrderPreview } satisfies Meta<typeof ControlledColumnOrderPreview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ControlledHostOrder: Story = { render: () => <ControlledColumnOrderPreview /> };
