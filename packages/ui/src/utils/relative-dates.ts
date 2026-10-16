/** Owned Gregorian civil-date rules. No dependencies, clock reads, Date.parse or local-time arithmetic. */
interface CivilDate { year: number; month: number; day: number }
type Unit = "day" | "week" | "month" | "year";
type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export interface RelativeDateRangeOptions {
  unit: "week" | "month" | "year";
  /** Zero is the containing period; negative values select earlier full periods. */
  offset?: number;
  /** Sunday = 0, Monday = 1. Defaults to Monday; independent of the browser locale. */
  weekStartsOn?: WeekStart;
}
const leapYear = (year: number) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
const daysInMonth = (year: number, month: number) => month === 2 ? (leapYear(year) ? 29 : 28) : [4, 6, 9, 11].includes(month) ? 30 : 31;
function readDate(value: string): CivilDate | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  return year >= 1 && year <= 9999 && month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth(year, month) ? { year, month, day } : null;
}
export const isCivilDate = (value: string): boolean => readDate(value) !== null;
const format = ({ year, month, day }: CivilDate) => `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
function daysBeforeYear(year: number) {
  const previous = year - 1;
  return previous * 365 + Math.floor(previous / 4) - Math.floor(previous / 100) + Math.floor(previous / 400);
}
/** Zero-based day number; 0001-01-01 is Monday in the proleptic Gregorian calendar. */
function dayNumber(date: CivilDate) {
  let days = daysBeforeYear(date.year) + date.day - 1;
  for (let month = 1; month < date.month; month++) days += daysInMonth(date.year, month);
  return days;
}
const lastDayNumber = daysBeforeYear(10000) - 1;
function fromDayNumber(days: number): CivilDate | null {
  if (!Number.isSafeInteger(days) || days < 0 || days > lastDayNumber) return null;
  let lower = 1, upper = 9999;
  while (lower < upper) {
    const middle = Math.ceil((lower + upper) / 2);
    if (daysBeforeYear(middle) <= days) lower = middle;
    else upper = middle - 1;
  }
  const year = lower;
  let remainder = days - daysBeforeYear(year), month = 1;
  while (remainder >= daysInMonth(year, month)) remainder -= daysInMonth(year, month++);
  return { year, month, day: remainder + 1 };
}
function shift(date: CivilDate, amount: number, unit: Unit): CivilDate | null {
  if (!Number.isSafeInteger(amount)) return null;
  if (unit === "day" || unit === "week") return fromDayNumber(dayNumber(date) + amount * (unit === "week" ? 7 : 1));
  const total = (date.year - 1) * 12 + date.month - 1 + amount * (unit === "year" ? 12 : 1);
  if (!Number.isSafeInteger(total) || total < 0 || total >= 9999 * 12) return null;
  const year = Math.floor(total / 12) + 1, month = total % 12 + 1;
  return { year, month, day: Math.min(date.day, daysInMonth(year, month)) };
}
function normalize(text: string, locale: string) {
  let raw = text.trim().toLocaleLowerCase(locale).replace(/[\u200e\u200f\u061c]/g, "").replace(/\s+/g, " ");
  const digits = new Intl.NumberFormat(locale, { useGrouping: false });
  for (let digit = 0; digit < 10; digit++) raw = raw.split(digits.format(digit)).join(String(digit));
  return raw;
}
/** Single dates: next month preserves the day, clamping at month end. Unknown grammar returns null. */
export function parseRelativeDateText(text: string, referenceDate: string | undefined, locale: string): string | null {
  const reference = referenceDate ? readDate(referenceDate) : null;
  if (!reference) return null;
  const raw = normalize(text, locale);
  const resolve = (amount: number, unit: Unit) => {
    const result = shift(reference, amount, unit);
    return result ? format(result) : null;
  };
  const aliases: Record<string, number> = { today: 0, tomorrow: 1, yesterday: -1 };
  if (Object.hasOwn(aliases, raw)) return resolve(aliases[raw], "day");
  // Keep all quantity spellings and relative offset forms in this shared grammar.
  const quantities: Record<string, number> = { a: 1, zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 };
  const quantity = `(\\d+|${Object.keys(quantities).join("|")})`;
  const unit = "(day|week|month|year)s?";
  const amount = (value: string) => Object.hasOwn(quantities, value) ? quantities[value] : Number(value);
  const offset = new RegExp(`^in ${quantity} ${unit}$`).exec(raw);
  if (offset) return resolve(amount(offset[1]), offset[2] as Unit);
  const anchored = new RegExp(`^${quantity} ${unit} (ago|from today|from now)$`).exec(raw);
  if (anchored) return resolve(amount(anchored[1]) * (anchored[3] === "ago" ? -1 : 1), anchored[2] as Unit);
  const adjacent = /^(next|last) (day|week|month|year)$/.exec(raw);
  if (adjacent) return resolve(adjacent[1] === "next" ? 1 : -1, adjacent[2] as Unit);
  const weekday = /^(next|last) (.+)$/.exec(raw);
  if (weekday) {
    const clean = (value: string) => value.toLocaleLowerCase(locale).replace(/\./g, "");
    const current = (dayNumber(reference) + 1) % 7;
    // Intl supplies display names only; arithmetic is owned and independent of the locale/timezone.
    for (const language of new Set([locale, "en-US"])) for (const width of ["long", "short"] as const) {
      const formatter = new Intl.DateTimeFormat(language, { weekday: width, timeZone: "UTC" });
      for (let target = 0; target < 7; target++) {
        if (clean(weekday[2]) !== clean(formatter.format(new Date(Date.UTC(2026, 0, 4 + target))))) continue;
        return resolve(weekday[1] === "next" ? (target - current + 7) % 7 || 7 : -((current - target + 7) % 7 || 7), "day");
      }
    }
  }
  return null;
}
/** Full inclusive periods. Invalid options or any endpoint outside years 0001–9999 throw RangeError. */
export function getRelativeDateRange(referenceDate: string, { unit, offset = 0, weekStartsOn = 1 }: RelativeDateRangeOptions): { start: string; end: string } {
  const reference = readDate(referenceDate);
  if (!reference || !Number.isSafeInteger(offset) || !Number.isInteger(weekStartsOn) || weekStartsOn < 0 || weekStartsOn > 6 || !["week", "month", "year"].includes(unit)) {
    throw new RangeError("Provide an ISO civil reference date, a week/month/year unit, an integer offset and a week start from 0 to 6.");
  }
  let start: CivilDate | null, end: CivilDate | null;
  if (unit === "week") {
    const anchorDay = dayNumber(reference);
    const first = anchorDay - (((anchorDay + 1) % 7 - weekStartsOn + 7) % 7) + offset * 7;
    start = fromDayNumber(first); end = fromDayNumber(first + 6);
  } else {
    const target = shift(reference, offset, unit);
    start = target ? { year: target.year, month: unit === "year" ? 1 : target.month, day: 1 } : null;
    end = target ? { year: target.year, month: unit === "year" ? 12 : target.month, day: unit === "year" ? 31 : daysInMonth(target.year, target.month) } : null;
  }
  if (!start || !end) throw new RangeError("Relative range exceeds supported civil dates.");
  return { start: format(start), end: format(end) };
}
/** Range phrases select complete periods, unlike the day-preserving single-date grammar. */
export function parseRelativeDateRangeText(text: string, referenceDate: string | undefined, locale: string, weekStartsOn: WeekStart = 1): { start: string; end: string } | null {
  const period = /^(last|this|next) (week|month|year)$/.exec(normalize(text, locale));
  if (!period || !referenceDate) return null;
  try {
    return getRelativeDateRange(referenceDate, {
      unit: period[2] as RelativeDateRangeOptions["unit"],
      offset: ({ last: -1, this: 0, next: 1 })[period[1] as "last" | "this" | "next"], weekStartsOn,
    });
  } catch { return null; }
}

/** Civil arithmetic shared by calendar interactions; returns null outside 0001–9999. */
export function addCivilDays(value: string, days: number): string | null {
  const date = readDate(value); const result = date ? shift(date, days, "day") : null;
  return result ? format(result) : null;
}
export function differenceInCivilDays(start: string, end: string): number {
  const a = readDate(start), b = readDate(end);
  return a && b ? dayNumber(b) - dayNumber(a) : NaN;
}
/** Whole Gregorian periods, shared by period pickers and calendar activation. */
export function getCivilPeriod(date: string, unit: "week"|"month"|"quarter"|"year", weekStartsOn: WeekStart = 1): {start:string;end:string}|null {
 if(!isCivilDate(date))return null;
 try {
  if(unit!=="quarter")return getRelativeDateRange(date,{unit,weekStartsOn});
  const year=date.slice(0,4),month=Math.floor((Number(date.slice(5,7))-1)/3)*3+1;
  const start=`${year}-${String(month).padStart(2,'0')}-01`;
  const lastMonth=`${year}-${String(month+2).padStart(2,'0')}-01`;
  const last=readDate(lastMonth)!;
  return {start,end:format({...last,day:daysInMonth(last.year,last.month)})};
 }catch{return null;}
}
