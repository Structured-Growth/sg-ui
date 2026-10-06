import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import { InsertContentMenuControl } from "./InsertContentMenuControl";

const meta = {
  title: "Editors/InsertContentMenuControl",
  component: InsertContentMenuControl,
  tags: ["autodocs"],
} satisfies Meta<typeof InsertContentMenuControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Box sx={{ p: 2 }}>
      <InsertContentMenuControl />
    </Box>
  ),
};
