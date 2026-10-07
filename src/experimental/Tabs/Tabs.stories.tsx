import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs } from "./Tabs";
import { Provider } from "../Provider/Provider";
const meta = { title: "Migration proofs/Tabs", component: Tabs, tags: ["autodocs"],
  decorators: [(Story) => <Provider><Story /></Provider>],
  args: { label: "Course settings", items: [
    { id: "details", label: "Details", content: "Course details" },
    { id: "disabled", label: "Unavailable", disabled: true, content: "Unavailable" },
    { id: "access", label: "Access", content: "Course access" },
  ] },
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Automatic: Story = {};
export const Manual: Story = { args: { activation: "manual" } };

// U-09: native focus/overflow acceptance uses the same owned scope and tokens.
const overflowItems = [
  { id: "details", label: "Details", content: "Course details" },
  { id: "disabled", label: "Unavailable", disabled: true, content: "Unavailable" },
  { id: "access", label: "Access", content: "Course access" },
  { id: "content", label: "Content", content: "Course content" },
  { id: "publishing", label: "Publishing", content: "Course publishing" },
  { id: "history", label: "History", content: "Course history" },
];
export const NarrowOverflow: Story = {
  args: { items: overflowItems, style: { inlineSize: "min(100%, 18rem)" } },
};
export const ManualOverflow: Story = {
  args: { ...NarrowOverflow.args, activation: "manual" },
};
