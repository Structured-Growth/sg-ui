import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../experimental/Stack/Stack";
import { Provider } from "../../experimental/Provider/Provider";
import { AppInlineProgress } from "./AppInlineProgress";

const meta = {
  title: "Components/AppInlineProgress",
  component: AppInlineProgress,
  tags: ["autodocs"],
  decorators: [(Story) => <Provider><Story /></Provider>],
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
    <Stack gap={2}>
      <AppInlineProgress value={0} />
      <AppInlineProgress value={24} />
      <AppInlineProgress value={62} />
      <AppInlineProgress value={100} />
    </Stack>
  ),
};

/** Native percentage widths remain relative to the host's available width. */
export const LayoutStates: Story = {
  render: () => <Stack gap={2}>
    <AppInlineProgress value={0} />
    <AppInlineProgress value={24.6} barWidth={120} />
    <AppInlineProgress value={100} barWidth="50%" />
    <AppInlineProgress value={NaN} />
  </Stack>,
};
