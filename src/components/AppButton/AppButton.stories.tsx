import type { Meta, StoryObj } from "@storybook/react-vite";
import Stack from "@mui/material/Stack";
import { AppButton } from "./AppButton";

const meta = {
  title: "Components/AppButton",
  component: AppButton,
  args: {
    children: "Continue",
    variant: "contained",
    color: "primary",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AppButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <Stack direction="row" spacing={2}>
      <AppButton variant="contained">Contained</AppButton>
      <AppButton variant="outlined">Outlined</AppButton>
      <AppButton variant="text">Text</AppButton>
    </Stack>
  ),
};
