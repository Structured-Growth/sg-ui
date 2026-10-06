import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import { TextStyleMenuControl } from "./TextStyleMenuControl";

const meta = {
  title: "Editors/TextStyleMenuControl",
  component: TextStyleMenuControl,
  tags: ["autodocs"],
} satisfies Meta<typeof TextStyleMenuControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Box sx={{ p: 2 }}>
      <TextStyleMenuControl />
    </Box>
  ),
};

export const ToolbarDensity: Story = {
  render: () => (
    <Box sx={{ p: 2 }}>
      <Box sx={{ alignItems: "center", border: 1, borderColor: "divider", borderRadius: 1, display: "inline-flex", p: 0.5 }}>
        <TextStyleMenuControl />
      </Box>
    </Box>
  ),
};
