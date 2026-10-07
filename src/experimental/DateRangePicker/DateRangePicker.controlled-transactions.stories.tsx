import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateRangePicker } from "./DateRangePicker";
import { Button } from "../Button/Button";
import { Provider } from "../Provider/Provider";
import type { DateRange } from "../DateRangeSelector/date-contract";

const initial = { start: "2024-02-28", end: "2024-02-29" };
const replacement = { start: "2024-02-20", end: "2024-02-21" };
function ControlledRangeForm() {
  const [committed, setCommitted] = useState<DateRange | null>(initial);
  const [requests, setRequests] = useState<(DateRange | null)[]>([]);
  const [accept, setAccept] = useState(false);
  const [preventReset, setPreventReset] = useState(false);
  const [resets, setResets] = useState<boolean[]>([]);
  const [submitted, setSubmitted] = useState("Not submitted");
  useEffect(() => {
    const hostShortcut = (event: KeyboardEvent) => {
      if (!event.altKey) return;
      if (event.code === "KeyH") { event.preventDefault(); setCommitted(replacement); }
      if (event.code === "KeyP") { event.preventDefault(); setPreventReset(value => !value); }
    };
    document.addEventListener("keydown", hostShortcut);
    return () => document.removeEventListener("keydown", hostShortcut);
  }, []);
  return <form aria-label="Controlled range form" onReset={event => {
    if (preventReset) event.preventDefault();
    setResets(values => [...values, event.defaultPrevented]);
  }} onSubmit={event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSubmitted(`${data.get("range.start")} – ${data.get("range.end")}`);
  }}>
    <DateRangePicker label="Reporting dates" name="range" value={committed} defaultValue={{ start: "2024-01-01", end: "2024-01-02" }}
      defaultFocusedDate="2024-02-28" months={2}
      presets={[{ id: "march", label: "March", value: { start: "2024-03-01", end: "2024-03-31" } }]}
      onValueChange={range => { setRequests(values => [...values, range]); if (accept) setCommitted(range); }} />
    <label><input type="checkbox" checked={accept} onChange={event => setAccept(event.target.checked)} />Accept range requests</label>
    <label><input type="checkbox" checked={preventReset} onChange={event => setPreventReset(event.target.checked)} />Prevent range reset</label>
    <Button onPress={() => setCommitted(replacement)}>Replace host endpoints</Button>
    <Button type="reset">Reset range</Button>
    <Button type="submit">Submit range</Button>
    <p>Host shortcuts: Alt+H replaces endpoints; Alt+P toggles reset prevention while calendar focus stays in place.</p>
    <output aria-label="Range requests">{JSON.stringify(requests)}</output>
    <output aria-label="Reset prevention ledger">{JSON.stringify(resets)}</output>
    <output aria-label="Submitted range">{submitted}</output>
  </form>;
}
const meta = { title: "Migration proofs/DateRangePicker controlled transactions", component: ControlledRangeForm,
  decorators: [(Story) => <Provider><Story /></Provider>],
} satisfies Meta<typeof ControlledRangeForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ControlledHost: Story = {};
