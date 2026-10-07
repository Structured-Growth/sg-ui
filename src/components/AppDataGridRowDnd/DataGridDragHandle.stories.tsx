import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
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
