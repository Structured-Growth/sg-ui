import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar } from "./Calendar";
import { Provider } from "../Provider/Provider";
const meta = { title: "Migration proofs/Calendar", component: Calendar, tags: ["autodocs"],
  decorators: [(Story) => <Provider><div style={{ maxWidth: "48rem" }}><Story /></div></Provider>], args: { label: "Course date", defaultFocusedDate: "2024-02-01" },
} satisfies Meta<typeof Calendar>;
export default meta;
// Storybook intersects discriminated prop unions when inferring args; the component retains its owned union.
type Story = StoryObj;
export const Single: Story = {};
export const Multiple: Story = { args: { selection: "multiple", months: 2, label: "Course dates" } };
export const Unavailable: Story = { args: { unavailable: [{ date: "2024-02-15", reason: "Fully booked" }] } };
