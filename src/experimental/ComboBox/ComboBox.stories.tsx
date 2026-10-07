import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComboBox } from "./ComboBox";
import { Provider } from "../Provider/Provider";
const meta = { title: "Migration proofs/ComboBox", component: ComboBox, tags: ["autodocs"],
  decorators: [(Story) => <Provider><Story /></Provider>],
  args: { label: "Category", description: "Search the host-supplied options.", options: [
    { id: "science", label: "Science" }, { id: "math", label: "Mathematics" },
    { id: "archived", label: "Archived", disabled: true },
  ] },
} satisfies Meta<typeof ComboBox>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Invalid: Story = { args: { invalid: true, errorMessage: "Choose an available category." } };
export const Disabled: Story = { args: { disabled: true } };
