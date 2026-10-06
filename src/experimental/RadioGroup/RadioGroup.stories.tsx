import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup } from "./RadioGroup";
import { Provider } from "../Provider/Provider";
const meta = { title: "Migration proofs/RadioGroup", component: RadioGroup, tags: ["autodocs"], decorators: [(Story) => <Provider><Story /></Provider>], args: { label: "Delivery", options: [{ value: "self", label: "Self paced" }, { value: "live", label: "Live" }, { value: "locked", label: "Unavailable", disabled: true }], defaultValue: "self" } } satisfies Meta<typeof RadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const ReadOnly: Story = { args: { readOnly: true } };
export const Disabled: Story = { args: { disabled: true } };
