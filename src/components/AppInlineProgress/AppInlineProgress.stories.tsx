import type { Meta, StoryObj } from "@storybook/react-vite";
import Stack from "@mui/material/Stack";
import { AppInlineProgress } from "./AppInlineProgress";

const meta = {
  title: "Components/AppInlineProgress",
  component: AppInlineProgress,
  tags: ["autodocs"],
  args: { value: 62 },
} satisfies Meta<typeof AppInlineProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 62,
  },
};

export const Variants: Story = {
  render: () => (
    <Stack spacing={2}>
      <AppInlineProgress value={0} />
      <AppInlineProgress value={24} />
      <AppInlineProgress value={62} />
      <AppInlineProgress value={100} />
    </Stack>
  ),
};
