import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Stack } from "../../experimental/Stack/Stack";
import { ThemeScope } from "../../foundation/ThemeScope";
import { AppButton } from "./AppButton";

const meta = {
  title: "Components/AppButton", component: AppButton,
  args: { children: "Continue", variant: "filled", tone: "primary" },
  tags: ["autodocs"],
} satisfies Meta<typeof AppButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Variants: Story = {
  render: () => <Stack direction="row" gap={2}><AppButton>Filled</AppButton>
    <AppButton variant="outlined" tone="neutral">Outlined</AppButton>
    <AppButton variant="text" tone="neutral">Text</AppButton></Stack>,
};
export const PendingAndDisabled: Story = {
  render: () => <ThemeScope theme="dark"><Stack direction="row" gap={2}>
    <AppButton loading>Saving</AppButton><AppButton disabled>Unavailable</AppButton>
    <AppButton density="compact" variant="outlined">Compact</AppButton>
  </Stack></ThemeScope>,
};
export const NativeForm: Story = {
  render: function FormExample() {
    const [count, setCount] = useState(0);
    return <form onSubmit={event => { event.preventDefault(); setCount(value => value + 1); }}>
      <Stack direction="row" gap={2}><AppButton>Cancel</AppButton>
        <AppButton type="submit">Save</AppButton><output aria-live="polite">Saved {count} times</output></Stack>
    </form>;
  },
};
