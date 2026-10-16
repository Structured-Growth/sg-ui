import { expect, it, vi } from "vitest";
import { getRelativeDateRange, isCivilDate, parseRelativeDateRangeText, parseRelativeDateText } from "./relative-dates";

it("validates proleptic Gregorian civil dates, including century and supported-year edges", () => {
  for (const date of ["0001-01-01", "0099-12-31", "1900-02-28", "2000-02-29", "2400-02-29", "9999-12-31"]) expect(isCivilDate(date), date).toBe(true);
  for (const date of ["0000-01-01", "10000-01-01", "1900-02-29", "2100-02-29", "2026-02-30", "2026-04-31", "2026-13-01", "2026-01-00", "2026-1-1", "2026-01-01T00:00:00Z"]) expect(isCivilDate(date), date).toBe(false);
});

it("shares bounded grammar and rejects overflow independently of clocks and timezones", () => {
  const now = vi.spyOn(Date, "now").mockImplementation(() => { throw new Error("Relative dates must never read the clock"); });
  try {
    expect(parseRelativeDateText("  IN   ٢   DAYS ", "2026-12-31", "ar-EG")).toBe("2027-01-02");
    expect(parseRelativeDateText("next month", "0099-12-31", "en-US")).toBe("0100-01-31");
    expect(parseRelativeDateText("next year", "2000-02-29", "en-US")).toBe("2001-02-28");
    expect(parseRelativeDateText("last Monday", "0001-01-01", "en-US")).toBeNull();
    expect(parseRelativeDateRangeText(" LAST   WEEK ", "2026-01-01", "en-US")).toEqual({start:"2025-12-22",end:"2025-12-28"});
    expect(parseRelativeDateRangeText("last business week", "2026-10-16", "en-US")).toBeNull();
    expect(parseRelativeDateRangeText("last week", undefined, "en-US")).toBeNull();
    for (const unit of ["week", "month", "year"] as const) for (const offset of [-Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Infinity, NaN, 1.5]) expect(() => getRelativeDateRange("2026-10-16", {unit,offset})).toThrow(RangeError);
    expect(() => getRelativeDateRange("0001-01-01", {unit:"week",weekStartsOn:0})).toThrow(RangeError);
    expect(() => getRelativeDateRange("9999-12-31", {unit:"week"})).toThrow(RangeError);
    for (const phrase of ["tomorrow", "next week", "next month", "next year", "in 99999999999999999999 days"]) expect(parseRelativeDateText(phrase,"9999-12-31","en-US")).toBeNull();
    expect(() => getRelativeDateRange("2026-01-01", {unit:"day" as "week"})).toThrow(RangeError);
  } finally { now.mockRestore(); }
});

it("matches an independent UTC oracle through a full 400-year Gregorian cycle and all week starts", () => {
  for (let year=2000;year<2400;year++) for (let month=1;month<=12;month++) {
    const first = new Date(Date.UTC(year,month-1,1));
    const last = new Date(Date.UTC(year,month,0));
    const iso = (date:Date) => date.toISOString().slice(0,10);
    expect(getRelativeDateRange(iso(last),{unit:"month"})).toEqual({start:iso(first),end:iso(last)});
    // Different offsets on month-end anchors must still select a complete destination month.
    expect(getRelativeDateRange(iso(last),{unit:"month",offset:1})).toEqual({start:iso(new Date(Date.UTC(year,month,1))),end:iso(new Date(Date.UTC(year,month+1,0)))});
  }
  for (let day=1;day<=366;day+=1) for (let weekStartsOn=0;weekStartsOn<7;weekStartsOn++) {
    const reference = new Date(Date.UTC(2024,0,day)), start = new Date(reference);
    start.setUTCDate(start.getUTCDate()-(start.getUTCDay()-weekStartsOn+7)%7-7);
    const end = new Date(start); end.setUTCDate(end.getUTCDate()+6);
    expect(getRelativeDateRange(reference.toISOString().slice(0,10),{unit:"week",offset:-1,weekStartsOn:weekStartsOn as 0})).toEqual({start:start.toISOString().slice(0,10),end:end.toISOString().slice(0,10)});
  }
});


it("resolves conversational offsets with bounded word quantities and the explicit civil anchor", () => {
  for (const phrase of ["a week from today", "one week from today", "1 week from today", "A WEEK FROM NOW", "in a week"]) expect(parseRelativeDateText(phrase,"2026-10-16","en-US"),phrase).toBe("2026-10-23");
  for (const phrase of ["two weeks from today", "in two weeks", "٢ weeks from today"]) expect(parseRelativeDateText(phrase,"2026-10-16","ar-EG"),phrase).toBe("2026-10-30");
  expect(parseRelativeDateText("a week ago","2026-10-16","en-US")).toBe("2026-10-09");
  expect(parseRelativeDateText("one year from today","2024-02-29","en-US")).toBe("2025-02-28");
  expect(parseRelativeDateText("a month from today","2024-01-31","en-US")).toBe("2024-02-29");
  expect(parseRelativeDateText("twelve months from today","2026-10-16","en-US")).toBe("2027-10-16");
  for (const phrase of ["a week from today", "in a week", "one year ago"]) expect(parseRelativeDateText(phrase,undefined,"en-US")).toBeNull();
  expect(parseRelativeDateText("a week from today","9999-12-31","en-US")).toBeNull();
  for (const phrase of ["half a week from today", "a business week from today", "a week from tomorrow", "a few days from today", "1.5 weeks from today", "-1 week from today"]) expect(parseRelativeDateText(phrase,"2026-10-16","en-US"),phrase).toBeNull();
});
