import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress } from "./Progress";
import { Provider } from "../Provider/Provider";
const meta = { title: "Migration proofs/Progress", component: Progress, tags: ["autodocs"],
  decorators: [(Story) => <Provider><Story /></Provider>], args: { label: "Course import", value: 35 },
} satisfies Meta<typeof Progress>;
export default meta;
type Story = StoryObj<typeof Progress>;
export const Determinate: Story = {};
export const Loading: Story = { args: { value: undefined, label: "Loading courses" } };
export const FileCount: Story = { args: { value: 3, maxValue: 10, valueText: "3 of 10 files" } };
export const CircularLoading: Story = { args: { value: undefined, label: "Loading courses", variant: "circular" } };
