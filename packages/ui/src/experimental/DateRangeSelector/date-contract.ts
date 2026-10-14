import { parseDate, parseDateTime, toZoned } from "@internationalized/date";

/** Gregorian ISO date-only value (YYYY-MM-DD). No local midnight or implicit timezone. */
export type DateOnly = string;
/** Both endpoints are inclusive. */
export interface DateRange { start: DateOnly; end: DateOnly }
export interface DateAvailability { date: DateOnly; reason: string }
export interface DateRangePreset { id: string; label: string; value: DateRange; description?: string }

/** Resolve a host-supplied local datetime in an explicit timezone. Reject gaps/overlaps by default. */
export function dateTimeToInstant(value: string, timeZone: string, disambiguation: "earlier" | "later" | "reject" = "reject"): string {
  return toZoned(parseDateTime(value), timeZone, disambiguation).toAbsoluteString();
}

export function isDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  try { return parseDate(value).toString() === value; } catch { return false; }
}
export function isDateRangeAllowed(value: DateRange | null, { min, max, unavailable = [] }:
  { min?: DateOnly; max?: DateOnly; unavailable?: readonly DateAvailability[] } = {}): boolean {
  if (value === null) return true;
  return isDateOnly(value.start) && isDateOnly(value.end) && value.start <= value.end &&
    (!min || isDateOnly(min)) && (!max || isDateOnly(max)) &&
    (!min || value.start >= min) && (!max || value.end <= max) &&
    !unavailable.some(day => day.date >= value.start && day.date <= value.end);
}
