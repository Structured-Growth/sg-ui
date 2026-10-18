import type { Meta, StoryObj } from "../../../types";
import { useCallback, useState } from "react";
import { DateRangeSelector, DateRangePicker, type DateRange } from "@structured-growth/sg-ui/experimental";
import { Button } from "@structured-growth/sg-ui/experimental";
import { Provider } from "@structured-growth/sg-ui/theme";
import { SGTranslationProvider } from "@structured-growth/sg-ui/i18n";
import { formatIcuMessage } from "@structured-growth/sg-ui/i18n";
const meta = { title: "Migration proofs/DateRangeSelector", component: DateRangeSelector, tags: ["autodocs"],
  decorators: [(Story) => <Provider><div style={{ maxWidth: "48rem" }}><Story /></div></Provider>],
  args: { entryMode: "segments", showFields: true, rangeClickBehavior: "restart", label: "Reporting dates", defaultFocusedDate: "2024-02-01", presets: [
    { id: "february", label: "February reporting period", description: "Gregorian calendar, inclusive endpoints, no timezone conversion.", value: { start: "2024-02-01", end: "2024-02-29" } },
    { id: "march", label: "March reporting period", value: { start: "2024-03-01", end: "2024-03-31" } },
  ] },
} satisfies Meta<typeof DateRangeSelector>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Reporting: Story = {};
function PointerRange({bounded=false}:{bounded?:boolean}) {
  const initial={start:'2026-10-07',end:'2026-10-09'};
  const [value,setValue]=useState<DateRange|null>(initial);
  const [requests,setRequests]=useState<DateRange[]>([]);
  return <form aria-label={bounded?'Rejected bounded range':'Required nearest range'}>
    <DateRangeSelector label={bounded?'Bounded trip':'Required trip'} months={1} name="trip" required value={bounded?initial:value}
      commitBehavior="immediate" rangeClickBehavior={bounded?'adjust-end':'adjust-nearest'}
      rangeLength={bounded?{mode:'bounded',min:3,max:3,unit:'days'}:undefined}
      min="2026-10-07" max={bounded?"2026-10-20":undefined} unavailable={bounded?undefined:[{date:'2026-10-10',reason:'No availability'}]}
      onValueChange={next=>{if(next)setRequests(current=>[...current,next]);if(!bounded)setValue(next);}}/>
    <output aria-label="Range requests">{JSON.stringify(requests)}</output>
  </form>;
}
export const PointerAlternatives: Story = {render:()=> <><PointerRange/><PointerRange bounded/><DateRangePicker label="Popup trip" months={1} required defaultValue={{start:"2026-10-07",end:"2026-10-09"}}/></>};
export const Availability: Story = { args: { entryMode: "segments", showFields: true, rangeClickBehavior: "restart", label: "Booking dates", defaultFocusedDate: "2024-02-14", presets: [
  { id: "february", label: "February reporting period", description: "Includes the unavailable capacity date.", value: { start: "2024-02-01", end: "2024-02-29" } },
  { id: "early", label: "Early February", description: "First two weeks, before capacity closes.", value: { start: "2024-02-01", end: "2024-02-14" } },
], unavailable: [{ date: "2024-02-15", reason: "No remaining capacity" }], required: true }, render: args => {
  const [value, setValue] = useState<import("@structured-growth/sg-ui/experimental").DateRange | null>(null);
  return <><DateRangeSelector {...args} value={value} onValueChange={setValue} /><output aria-label="Committed booking dates">{value ? `${value.start} – ${value.end}` : "No committed dates"}</output></>;
} };
export const LocaleAndTimezone: Story = { render: args => {
  const [locale, setLocale] = useState("ar-EG");
  return <><label>Host locale <select value={locale} onChange={event => setLocale(event.target.value)}><option value="ar-EG">Arabic</option><option value="de-DE">German</option><option value="en-US">English</option></select></label>
    <p>Date-only reporting uses the same YYYY-MM-DD values in America/Chicago and Asia/Tokyo. The host chooses a timezone only when converting to instants.</p>
    <SGTranslationProvider value={{ locale, t: (_key, options) => formatIcuMessage(options.defaultMessage, locale, options.values), useNamespace: () => {} }}><Provider><DateRangeSelector {...args} /></Provider></SGTranslationProvider></>;
} };
export const KeyboardRangePreview: Story = { args: { defaultValue: { start: "2024-02-28", end: "2024-02-29" }, defaultFocusedDate: "2024-02-28", name: "range" }, render: args => {
  const [submitted, setSubmitted] = useState("");
  const [preventReset, setPreventReset] = useState(false);
  return <form onReset={event => { if (preventReset) event.preventDefault(); }} onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); setSubmitted(`${data.get("range.start")} – ${data.get("range.end")}`); }}>
    <p>Focus February 28, press Enter, then use arrows across leap day. The preview stays separate until the end date is activated and Apply is pressed.</p>
    <DateRangeSelector {...args} />
    <label><input type="checkbox" checked={preventReset} onChange={event => setPreventReset(event.target.checked)} />Prevent form reset</label>
    <Button type="reset" variant="outlined" tone="neutral">Reset dates</Button>
    <Button type="submit" variant="outlined" tone="neutral">Read committed form dates</Button>
    <output aria-label="Submitted dates">{submitted}</output>
  </form>;
} };
export const FocusedEndpointPreview: Story = {
  args: { defaultFocusedDate: "2024-02-28", presets: [], months: 2,
    unavailable: [{ date: "2024-03-01", reason: "No remaining capacity" }], name: "range" },
  render: args => {
    const [value, setValue] = useState({ start: "2024-02-28", end: "2024-02-29" });
    const [commits, setCommits] = useState(0);
    return <form>
      <p>Use arrows to focus March 1 and read its availability. Return to February 28 and press Enter to anchor a range. The focused endpoint describes the preview, anchor and unchanged draft. The unavailable March 1 boundary stops the preview at February 29. Cancel discards it; choosing both endpoints still needs Apply.</p>
      <DateRangeSelector {...args} value={value} onValueChange={next => { if (next) setValue(next); setCommits(count => count + 1); }} />
      <Button variant="outlined" tone="neutral" onPress={() => setValue({ start: "2024-02-20", end: "2024-02-21" })}>Replace committed dates</Button>
      <output aria-label="Committed preview dates">{value.start} – {value.end}</output>
      <output aria-label="Range commit count">{commits}</output>
    </form>;
  },
};

/** New range layout/animation acceptance scenario; no historical Storybook provenance. */
export const CompactNavigation: Story = { render: (_args,{globals}) =>
  <Provider density={globals.density} theme={globals.theme} interactionMode="pointer">
    <DateRangeSelector label="Travel dates" months={1} defaultFocusedDate="2026-10-14" defaultValue={{start:"2026-10-07",end:"2026-10-16"}} />
  </Provider>
};

// Adds only the missing typed-draft/controlled-endpoint navigation edge to the
// accepted independent From/To configuration. Diagnostics are private-host only.
function IndependentPeriodDraftHost() {
  const [value, setValue] = useState<DateRange | null>({start:"2026-10-07",end:"2026-10-16"});
  const [activeEndpoint, setActiveEndpoint] = useState<"start" | "end">("end");
  const [draftRequests, setDraftRequests] = useState<(DateRange | null)[]>([]);
  const [endpointRequests, setEndpointRequests] = useState<("start" | "end")[]>([]);
  const [valueRequests, setValueRequests] = useState<(DateRange | null)[]>([]);
  const recordDraft = useCallback((next: DateRange | null) => setDraftRequests(current => [...current, next]), []);
  const recordEndpoint = useCallback((next: "start" | "end") => {
    setActiveEndpoint(next); setEndpointRequests(current => [...current, next]);
  }, []);
  const recordValue = useCallback((next: DateRange | null) => {
    setValue(next); setValueRequests(current => [...current, next]);
  }, []);
  return <form aria-label="Independent period draft form">
    <DateRangeSelector label="Period draft dates" name="period" entryMode="text" showFields
      months={2} navigation="period" calendarNavigation="independent" calendarEndpoints={["start","end"]}
      rangeClickBehavior="active-endpoint" activeEndpoint={activeEndpoint} onActiveEndpointChange={recordEndpoint}
      defaultFocusedDate="2026-10-07" min="2026-01-01" max="2027-12-31" presets={[]}
      getDateUnavailableReason={(date,context) => context.endpoint === "start" && date.startsWith("2027") ? "No arrivals in 2027." : undefined}
      value={value} onValueChange={recordValue} onDraftChange={recordDraft}/>
    <output aria-label="Period draft requests">{JSON.stringify(draftRequests)}</output>
    <output aria-label="Period endpoint requests">{JSON.stringify(endpointRequests)}</output>
    <output aria-label="Period value requests">{JSON.stringify(valueRequests)}</output>
  </form>;
}
export const IndependentPeriodDraft: Story = { render: (_args,{globals}) =>
  <Provider theme={globals.theme} density="compact" interactionMode="pointer"><IndependentPeriodDraftHost/></Provider>
};
