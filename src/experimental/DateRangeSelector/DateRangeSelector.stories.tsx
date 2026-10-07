import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DateRangeSelector } from "./DateRangeSelector";
import { Button } from "../Button/Button";
import { Provider } from "../Provider/Provider";
import { SGTranslationProvider } from "../../i18n";
import { formatIcuMessage } from "../../i18n/icu";
const meta = { title: "Migration proofs/DateRangeSelector", component: DateRangeSelector, tags: ["autodocs"],
  decorators: [(Story) => <Provider><div style={{ maxWidth: "48rem" }}><Story /></div></Provider>],
  args: { label: "Reporting dates", defaultFocusedDate: "2024-02-01", presets: [
    { id: "february", label: "February reporting period", description: "Gregorian calendar, inclusive endpoints, no timezone conversion.", value: { start: "2024-02-01", end: "2024-02-29" } },
    { id: "march", label: "March reporting period", value: { start: "2024-03-01", end: "2024-03-31" } },
  ] },
} satisfies Meta<typeof DateRangeSelector>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Reporting: Story = {};
export const Availability: Story = { args: { label: "Booking dates", defaultFocusedDate: "2024-02-14", presets: [
  { id: "february", label: "February reporting period", description: "Includes the unavailable capacity date.", value: { start: "2024-02-01", end: "2024-02-29" } },
  { id: "early", label: "Early February", description: "First two weeks, before capacity closes.", value: { start: "2024-02-01", end: "2024-02-14" } },
], unavailable: [{ date: "2024-02-15", reason: "No remaining capacity" }], required: true }, render: args => {
  const [value, setValue] = useState<import("./date-contract").DateRange | null>(null);
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
