import { useState } from "react";
import type { Meta, StoryObj } from "../../../types";
import { DatePicker, DateRangePicker, TimeField } from "@structured-growth/sg-ui/experimental";

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
      <DatePicker entryMode="segments" label="Course date" name="date" required min="2024-02-28" max="2024-03-31"
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

// A clipboard-capable coordinator host runs these with real copy/paste gestures.
// These diagnostics belong to the private fixture, never the public docs preview.
function ClipboardTransactionForm({kind}: {kind: "date" | "time" | "range"}) {
  const [requests,setRequests]=useState<unknown[]>([]);
  const [submitted,setSubmitted]=useState("Not submitted");
  const request=(next:unknown)=>setRequests(previous=>[...previous,next]);
  const [preventReset,setPreventReset]=useState(true);
  return <>
    <label>Clipboard text<textarea defaultValue="20261016" /></label>
    <label><input type="checkbox" checked={preventReset} onChange={event=>setPreventReset(event.currentTarget.checked)}/>Prevent entry reset</label>
    <form aria-label="Clipboard transaction form" onReset={event=>{if(preventReset)event.preventDefault();}}
      onSubmit={event=>{event.preventDefault();setSubmitted(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));}}>
      {kind==="date"?<DatePicker label="Entry" name="entry" defaultValue="2026-10-14" min="2026-10-14" max="2026-10-31" required onValueChange={request}/>:
        kind==="time"?<TimeField label="Entry" name="entry" defaultValue="09:30:00" hourCycle={24} required onValueChange={request}/>:
        <DateRangePicker label="Entry" name="entry" defaultValue={{start:"2026-10-12",end:"2026-10-14"}} required onValueChange={request}/>}
      <button type="button">Leave entry</button><button type="submit">Submit entry</button><button type="reset">Reset entry</button>
    </form>
    <output aria-label="Clipboard requests">{JSON.stringify(requests)}</output>
    <output aria-label="Clipboard submitted">{submitted}</output>
  </>;
}
export const DateTextPaste: Story = {render:()=> <ClipboardTransactionForm kind="date"/>};
export const TimeTextPaste: Story = {render:()=> <ClipboardTransactionForm kind="time"/>};
export const RangeTextPaste: Story = {render:()=> <ClipboardTransactionForm kind="range"/>};
