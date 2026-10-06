import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DataGridDragHandle } from "./DataGridDragHandle";

const meta = {
  title: "Data Display/DataGridDragHandle",
  component: DataGridDragHandle,
  decorators: [
    (Story) => (
      <Box sx={{ p: 3 }}>
        <Story />
      </Box>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof DataGridDragHandle>;

export default meta;

type Story = StoryObj<typeof meta>;

function PreviewHandle() {
  const [dragState, setDragState] = useState("Idle");

  return (
    <Box sx={{ alignItems: "center", display: "flex", gap: 2 }}>
      <DataGridDragHandle
        onDragEnd={() => {
          setDragState("Drag ended");
        }}
        onDragStart={(event) => {
          event.dataTransfer.setData("text/plain", "row-1");
          setDragState("Dragging");
        }}
      />
      <Typography variant="body2">{dragState}</Typography>
    </Box>
  );
}

export const Default: Story = {
  render: () => <PreviewHandle />,
};
