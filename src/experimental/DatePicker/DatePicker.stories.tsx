import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatePicker } from "./DatePicker";
import { Provider } from "../Provider/Provider";
const meta = { title: "Migration proofs/DatePicker", component: DatePicker, tags: ["autodocs"],
  decorators: [(Story) => <Provider><Story /></Provider>], args: { label: "Course date", defaultValue: "2024-02-28" },
} satisfies Meta<typeof DatePicker>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Availability: Story = { args: { unavailable: [{ date: "2024-02-29", reason: "No capacity" }] } };
