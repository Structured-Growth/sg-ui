import { isCivilDate as isDateOnly } from "../../utils/relative-dates";
export { isDateOnly };
import { addCivilDays, differenceInCivilDays } from "../../utils/relative-dates";
import { parseDateTime, toZoned } from "@internationalized/date";

/** Gregorian ISO date-only value (YYYY-MM-DD). No local midnight or implicit timezone. */
export type DateOnly = string;
/** Both endpoints are inclusive. */
export interface DateRange { start: DateOnly; end: DateOnly }
export interface DateAvailability { date: DateOnly; reason: string }
export interface DateRangePresetGroup { id:string; label:string; presets:readonly DateRangePreset[]; children?:readonly DateRangePresetGroup[] }
export interface DateRangePreset { id: string; label: string; value: DateRange; description?: string }

/** Days count inclusive dates; nights count the gap between endpoints. Fixed length disables endpoint resizing. */
export type DateRangeLength =
  | { mode: "fixed"; value: number; unit: "days" | "nights" }
  | { mode: "bounded"; min?: number; max?: number; unit: "days" | "nights" };
export interface DateAvailabilityContext { range: DateRange | null; endpoint: "start" | "end" | null }
/** Return a translated reason when unavailable, otherwise undefined. No data fetching in this callback. */
export type DateAvailabilityRule = (date: DateOnly, context: DateAvailabilityContext) => string | undefined;
export interface DateRangeConstraints {
  min?: DateOnly; max?: DateOnly; unavailable?: readonly DateAvailability[];
  rangeLength?: DateRangeLength; getDateUnavailableReason?: DateAvailabilityRule;
}
/** Inclusive days versus overnight intervals; returns NaN for malformed or reversed ranges. */
export function getDateRangeLength(value: DateRange, unit: "days" | "nights" = "days"): number {
  return isDateOnly(value.start)&&isDateOnly(value.end)&&value.start<=value.end?differenceInCivilDays(value.start,value.end)+(unit==="days"?1:0):NaN;
}
export function fixedRangeFromStart(start: DateOnly, length: DateRangeLength): DateRange | null {
  if (length.mode !== "fixed" || !Number.isSafeInteger(length.value) || length.value < 1) return null;
  const end = addCivilDays(start, length.value - (length.unit === "days" ? 1 : 0));
  return end ? { start, end } : null;
}

/** Resolve a host-supplied local datetime in an explicit timezone. Reject gaps/overlaps by default. */
export function dateTimeToInstant(value: string, timeZone: string, disambiguation: "earlier" | "later" | "reject" = "reject"): string {
  return toZoned(parseDateTime(value), timeZone, disambiguation).toAbsoluteString();
}

export function isDateRangeAllowed(value: DateRange | null, { min, max, unavailable = [], rangeLength, getDateUnavailableReason }: DateRangeConstraints = {}): boolean {
  if (value === null) return true;
  if (!isDateOnly(value.start) || !isDateOnly(value.end) || value.start > value.end ||
    (min && (!isDateOnly(min) || value.start < min)) || (max && (!isDateOnly(max) || value.end > max)) ||
    unavailable.some(day => day.date >= value.start && day.date <= value.end)) return false;
  if (rangeLength) {
    const count = differenceInCivilDays(value.start, value.end) + (rangeLength.unit === "days" ? 1 : 0);
    const bounds = rangeLength.mode === "fixed" ? [rangeLength.value, rangeLength.value] : [rangeLength.min ?? 0, rangeLength.max ?? Infinity];
    if (!Number.isSafeInteger(bounds[0]) || bounds[0] < 0 || (bounds[1] !== Infinity && !Number.isSafeInteger(bounds[1])) || bounds[1] < bounds[0] ||
      (rangeLength.mode === "fixed" && rangeLength.value < 1) || count < bounds[0] || count > bounds[1]) return false;
  }
  if (getDateUnavailableReason) {
    for (let date: string | null = value.start; date && date <= value.end; date = addCivilDays(date, 1)) {
      if (getDateUnavailableReason(date, {range: value, endpoint: date === value.start ? "start" : date === value.end ? "end" : null})) return false;
      // A one-day interval occupies both boundaries and must satisfy both rules.
      if (date === value.start && date === value.end && getDateUnavailableReason(date, {range: value, endpoint: "end"})) return false;
    }
  }
  return true;
}
