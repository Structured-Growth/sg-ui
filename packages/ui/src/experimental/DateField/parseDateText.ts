import { isCivilDate as isDateOnly, parseRelativeDateText } from "../../utils/relative-dates";

/** Explicit civil-date grammar: no Date.parse, rollover or timezone. Two-digit years use a fixed 1950–2049 window. */
export function parseDateText(text: string, locale: string, referenceDate?: string): string | null {
  const digits = new Intl.NumberFormat(locale, { useGrouping: false });
  let raw = text.trim().toLocaleLowerCase(locale).replace(/[\u200e\u200f\u061c]/g, "");
  for (let digit = 0; digit < 10; digit++) raw = raw.split(digits.format(digit)).join(String(digit));
  const relative = parseRelativeDateText(raw, referenceDate, locale);
  if (relative) return relative;
  const date = (year: string, month: string, day: string) => {
    const fullYear = year.length === 2 ? String(Number(year) < 50 ? 2000 + Number(year) : 1900 + Number(year)) : year;
    const iso = `${fullYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    return isDateOnly(iso) ? iso : null;
  };
  const iso = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/.exec(raw) ?? /^(\d{4})(\d{2})(\d{2})$/.exec(raw);
  if (iso) return date(iso[1], iso[2], iso[3]);
  const numeric = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4}|\d{2})$/.exec(raw);
  if (numeric) {
    const order = new Intl.DateTimeFormat(locale, { calendar: "gregory", year: "numeric", month: "numeric", day: "numeric", timeZone: "UTC" })
      .formatToParts(new Date(Date.UTC(2026, 9, 14))).filter(part => ["month", "day", "year"].includes(part.type)).map(part => part.type);
    return order.indexOf("day") < order.indexOf("month") ? date(numeric[3], numeric[2], numeric[1]) : date(numeric[3], numeric[1], numeric[2]);
  }
  const clean = (value: string) => value.toLocaleLowerCase(locale).replace(/[.,]/g, "").replace(/\s+/g, " ").trim();
  raw = clean(raw);
  // Accept both the active locale's names and English month names, including abbreviations.
  for (const language of new Set([locale, "en-US"])) {
    for (const width of ["long", "short"] as const) {
      const formatter = new Intl.DateTimeFormat(language, { calendar: "gregory", month: width, timeZone: "UTC" });
      for (let month = 1; month <= 12; month++) {
        const name = clean(formatter.format(new Date(Date.UTC(2026, month - 1, 14))));
        const words = raw.startsWith(`${name} `) ? raw.slice(name.length + 1).match(/^(\d{1,2}) (\d{4}|\d{2})$/)
          : raw.match(/^(\d{1,2}) (.+) (\d{4}|\d{2})$/);
        if (words && (words.length === 3 || words[2] === name)) return date(words[words.length - 1], String(month), words[1]);
      }
    }
  }
  return null;
}

export function formatDateText(value: string | null | undefined, locale: string): string {
  if (!value || !isDateOnly(value)) return value ?? "";
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(0); date.setUTCFullYear(year, month - 1, day);
  return new Intl.DateTimeFormat(locale, { calendar: "gregory", year: "numeric", month: "2-digit", day: "2-digit", timeZone: "UTC" }).format(date);
}
