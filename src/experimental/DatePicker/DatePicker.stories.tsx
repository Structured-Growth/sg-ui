import { StrictMode, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatePicker } from "./DatePicker";
import { Provider } from "../Provider/Provider";
const meta = { title: "Migration proofs/DatePicker", component: DatePicker, tags: ["autodocs"],
  decorators: [(Story) => <Provider><Story /></Provider>], args: { label: "Course date", defaultValue: "2024-02-28" },
} satisfies Meta<typeof DatePicker>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { parameters: { docs: { description: { story:
  "Open the calendar to select a date or Clear the optional date. Both actions close the popup and return focus to its trigger." } } } };
export const Availability: Story = { args: { unavailable: [{ date: "2024-02-29", reason: "No capacity" }] } };

function NativeResetExample() {
  const [prevent, setPrevent] = useState(false);
  const [changes, setChanges] = useState(0);
  const [controlledDate, setControlledDate] = useState<string | null>("2024-03-01");
  return <StrictMode><label><input type="checkbox" checked={prevent} onChange={event => setPrevent(event.target.checked)} />Prevent form reset</label>
    <form onReset={event => { if (prevent) event.preventDefault(); }}>
      <DatePicker label="Reset date" name="date" defaultValue="2024-02-28" onValueChange={() => setChanges(count => count + 1)} />
      <DatePicker label="Controlled date" name="controlledDate" value={controlledDate} defaultValue="2024-02-28"
        onValueChange={date => { setControlledDate(date); setChanges(count => count + 1); }} />
      <button type="reset">Reset dates</button>
    </form><output aria-label="Date changes">{changes}</output>
  </StrictMode>;
}
export const NativeFormReset: Story = { render: () => <NativeResetExample /> };
