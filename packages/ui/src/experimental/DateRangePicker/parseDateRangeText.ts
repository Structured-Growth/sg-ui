import { parseDateText } from "../DateField/parseDateText";
import { type DateRange } from "../DateRangeSelector/date-contract";
import { parseRelativeDateRangeText } from "../../utils/relative-dates";

/** Bounded civil range grammar; never reads the clock or guesses a timezone. */
export function parseDateRangeText(text: string, locale: string, referenceDate?: string, weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 1): DateRange | null {
  const raw = text.trim().replace(/[\u200e\u200f\u061c]/g, "");
  const relative = parseRelativeDateRangeText(raw, referenceDate, locale, weekStartsOn);
  if (relative) return relative;
  const endpoints = raw.split(/\s+[–—-]\s+|\s*[–—]\s*|\s+to\s+/i);
  if (endpoints.length !== 2) return null;
  const start = parseDateText(endpoints[0], locale, referenceDate);
  const end = parseDateText(endpoints[1], locale, referenceDate);
  return start && end && start <= end ? { start, end } : null;
}
