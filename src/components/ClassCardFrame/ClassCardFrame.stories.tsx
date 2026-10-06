import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ClassCardFrame } from "./ClassCardFrame";

const meta = {
  title: "Components/ClassCardFrame",
  component: ClassCardFrame,
  args: {
    header: <Typography variant="h5">Week 1 Module</Typography>,
    body: <Typography variant="body1">This section covers baseline practical defense skills.</Typography>,
    footer: <Button size="small" variant="contained">Open</Button>,
  },
  decorators: [
    (Story) => (
      <Box sx={{ p: 2 }}>
        <Story />
      </Box>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof ClassCardFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutFooter: Story = {
  args: {
    footer: undefined,
  },
};
