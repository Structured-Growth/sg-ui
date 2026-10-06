import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DateRangeSelector } from "./DateRangeSelector";
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
export const Availability: Story = { args: { label: "Booking dates", unavailable: [{ date: "2024-02-15", reason: "No remaining capacity" }], required: true } };
export const LocaleAndTimezone: Story = { render: args => {
  const [locale, setLocale] = useState("ar-EG");
  return <><label>Host locale <select value={locale} onChange={event => setLocale(event.target.value)}><option value="ar-EG">Arabic</option><option value="de-DE">German</option><option value="en-US">English</option></select></label>
    <p>Date-only reporting uses the same YYYY-MM-DD values in America/Chicago and Asia/Tokyo. The host chooses a timezone only when converting to instants.</p>
    <SGTranslationProvider value={{ locale, t: (_key, options) => formatIcuMessage(options.defaultMessage, locale, options.values), useNamespace: () => {} }}><Provider><DateRangeSelector {...args} /></Provider></SGTranslationProvider></>;
} };
