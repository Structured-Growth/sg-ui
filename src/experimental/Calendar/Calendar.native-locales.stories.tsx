import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar } from "./Calendar";
import { Provider } from "../Provider/Provider";
import { SGTranslationProvider } from "../../i18n";
import type { DateOnly } from "../DateRangeSelector/date-contract";

export function NativeCalendarFixture({ locale = "en-US", firstDayOfWeek = "sun" }: {
  locale?: string; firstDayOfWeek?: "sun" | "mon";
}) {
  const [value, setValue] = useState<DateOnly[]>([]);
  const [focus, setFocus] = useState<DateOnly>("2024-02-28");
  const [commits, setCommits] = useState(0);
  return <SGTranslationProvider value={{ locale, t: (_key, options) => options.defaultMessage, useNamespace: () => {} }}>
    <Provider>
      <Calendar label="Native course dates" selection="multiple" months={2} firstDayOfWeek={firstDayOfWeek}
        defaultFocusedDate="2024-02-28" value={value} onFocusedDateChange={setFocus}
        unavailable={[{ date: "2024-03-01", reason: "No capacity" }]}
        onValueChange={dates => { setValue(dates); setCommits(count => count + 1); }} />
      <output aria-label="Selected civil dates">{JSON.stringify(value)}</output>
      <output aria-label="Focused civil date">{focus}</output>
      <output aria-label="Selection callback count">{commits}</output>
    </Provider>
  </SGTranslationProvider>;
}
const meta = { title: "Migration proofs/Calendar native locales", component: NativeCalendarFixture } satisfies Meta<typeof NativeCalendarFixture>;
export default meta;
type Story = StoryObj<typeof meta>;
export const SundayFirst: Story = {};
export const MondayFirst: Story = { args: { firstDayOfWeek: "mon" } };
export const ArabicTraversal: Story = { args: { locale: "ar-EG", firstDayOfWeek: "mon" } };
export const HebrewCalendar: Story = { args: { locale: "en-US-u-ca-hebrew", firstDayOfWeek: "mon" } };
