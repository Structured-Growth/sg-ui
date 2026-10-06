import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateRangePicker } from "./DateRangePicker";
import { Provider } from "../Provider/Provider";
const meta = { title: "Migration proofs/DateRangePicker", component: DateRangePicker, tags: ["autodocs"],
  decorators: [(Story) => <Provider><Story /></Provider>], args: { label: "Reporting dates", defaultValue: { start: "2024-02-01", end: "2024-02-29" },
    presets: [{ id: "march", label: "March", value: { start: "2024-03-01", end: "2024-03-31" } }] },
} satisfies Meta<typeof DateRangePicker>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Required: Story = { args: { defaultValue: null, required: true } };
