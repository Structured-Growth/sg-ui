import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./Switch";
import { Provider } from "../Provider/Provider";
const meta = { title: "Migration proofs/Switch", component: Switch, tags: ["autodocs"], decorators: [(Story) => <Provider><Story /></Provider>], args: { label: "Notifications", description: "Receive course updates" } } satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const ReadOnly: Story = { args: { readOnly: true } };
export const Disabled: Story = { args: { disabled: true } };
