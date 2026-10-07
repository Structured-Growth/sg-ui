import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateField } from "./DateField";
import { Provider } from "../Provider/Provider";
import { Button } from "../Button/Button";
import { dateTimeToInstant } from "../DateRangeSelector/date-contract";
const meta = { title: "Migration proofs/DateField", component: DateField, tags: ["autodocs"],
  decorators: [(Story) => <Provider><Story /></Provider>], args: { label: "Course date", defaultValue: "2024-02-28", description: "Gregorian ISO values; localized display." },
} satisfies Meta<typeof DateField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const DateOnly: Story = {};
export const Validation: Story = { args: { invalid: true, errorMessage: "Choose an available date." } };
export const TimezoneResolution: Story = { render: () => {
  const [value, setValue] = useState<string | null>("2024-11-03T01:30:00");
  const [zone, setZone] = useState("America/Chicago");
  const [resolution, setResolution] = useState<"reject" | "earlier" | "later">("reject");
  const [result, setResult] = useState("");
  return <><DateField label="Local start" kind="datetime" value={value} onValueChange={setValue} />
    <label>Host timezone <select value={zone} onChange={event => setZone(event.target.value)}><option>America/Chicago</option><option>Asia/Tokyo</option></select></label>
    <label>Ambiguous time <select value={resolution} onChange={event => setResolution(event.target.value as typeof resolution)}><option>reject</option><option>earlier</option><option>later</option></select></label>
    <Button onPress={() => { try { setResult(value ? dateTimeToInstant(value, zone, resolution) : "Choose a complete datetime."); }
      catch { setResult("This local time is ambiguous or unavailable. Choose a resolution or another time."); } }}>Resolve instant</Button><p role="status">{result}</p></>;
} };

function StandaloneResetForm() {
  const [prevent, setPrevent] = useState(false);
  const [changes, setChanges] = useState(0);
  return <div onReset={event => { if (prevent) event.preventDefault(); }}>
    <label><input type="checkbox" checked={prevent} onChange={event => setPrevent(event.target.checked)} />Prevent form reset</label>
    <form aria-label="Standalone reset form">
      <DateField label="Uncontrolled field" name="uncontrolled" defaultValue="2024-02-28" onValueChange={() => setChanges(count => count + 1)} />
      <DateField label="Controlled field" name="controlled" value="2024-03-10" defaultValue="2024-02-28" onValueChange={() => setChanges(count => count + 1)} />
      <Button type="reset">Reset fields</Button>
      <output aria-label="Change callbacks">{changes}</output>
    </form>
  </div>;
}
export const StandaloneReset: Story = { render: () => <StandaloneResetForm /> };
