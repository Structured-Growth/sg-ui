import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./Select";
import { Provider } from "../Provider/Provider";
const meta = { title: "Migration proofs/Select", component: Select, tags: ["autodocs"], decorators: [(Story) => <Provider><Story /></Provider>], args: { label: "Status", options: [{ id: "draft", label: "Draft" }, { id: "locked", label: "Unavailable", disabled: true }, { id: "active", label: "Active" }], defaultValue: "draft" } } satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Empty: Story = { args: { options: [], defaultValue: null } };
export const Validation: Story = { args: { invalid: true, errorMessage: "Choose an available status", description: "The host owns available statuses" } };
