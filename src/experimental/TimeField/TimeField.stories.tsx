import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimeField } from "./TimeField";
import { Provider } from "../Provider/Provider";
const meta = { title: "Migration proofs/TimeField", component: TimeField, tags: ["autodocs"],
  decorators: [(Story) => <Provider><Story /></Provider>], args: { label: "Start time", defaultValue: "09:30:00", description: "Local clock time, without a date or timezone." },
} satisfies Meta<typeof TimeField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Clock: Story = {};
export const TwentyFourHour: Story = { args: { hourCycle: 24 } };
export const ReadOnly: Story = { args: { readOnly: true } };
