import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatePicker } from "./DatePicker";

const meta = {
  title: "Migration proofs/DatePicker native transactions",
  component: DatePicker,
  args: { label: "Course date" },
} satisfies Meta<typeof DatePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

// Host diagnostics deliberately report raw civil values; no reset or synthetic
// input/paste handlers participate in the picker transaction.
export function NativeTransactionForm({ empty = false, reject = false }: { empty?: boolean; reject?: boolean }) {
  const [requests, setRequests] = useState<(string | null)[]>([]);
  const [submitted, setSubmitted] = useState("Not submitted");
  return <>
    <form aria-label="Date transaction form" onSubmit={event => {
      event.preventDefault();
      setSubmitted(String(new FormData(event.currentTarget).get("date")));
    }}>
      <DatePicker label="Course date" name="date" required min="2024-02-28" max="2024-03-31"
        defaultFocusedDate="2024-02-28" defaultValue={empty ? null : "2024-02-28"}
        value={reject ? "2024-02-28" : undefined}
        errorMessage="Enter a complete course date within the booking window"
        onValueChange={next => setRequests(previous => [...previous, next])} />
      <button type="button">Leave date field</button>
      <button type="submit">Submit course date</button>
    </form>
    <output aria-label="Date requests">{JSON.stringify(requests)}</output>
    <output aria-label="Submitted course date">{submitted}</output>
    <label>Clipboard date source<input readOnly value="02/29/2024" /></label>
  </>;
}

export const CompleteCivilEdit: Story = { render: () => <NativeTransactionForm /> };
export const PartialRequiredEdit: Story = { render: () => <NativeTransactionForm empty /> };
export const ControlledHostReject: Story = { render: () => <NativeTransactionForm reject /> };
