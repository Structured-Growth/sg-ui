import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { AppDataGrid } from "./AppDataGrid";
import { createActionMenuColumn } from "./createActionMenuColumn";
import { Provider } from "../../experimental/Provider/Provider";

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
