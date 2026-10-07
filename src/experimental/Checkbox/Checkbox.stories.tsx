import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./Checkbox";
import { Provider } from "../Provider/Provider";
const meta = { title: "Migration proofs/Checkbox", component: Checkbox, tags: ["autodocs"],
  decorators: [(Story) => <Provider><Story /></Provider>], args: { label: "Available" },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Mixed: Story = { args: { mixed: true } };
export const Disabled: Story = { args: { disabled: true } };

export const Invalid: Story = { args: { required: true, invalid: true, description: "Required to register.", errorMessage: "Accept the terms before submitting." } };
