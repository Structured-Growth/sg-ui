import { expect, it } from "vitest";
import { parseDateRangeText } from "./parseDateRangeText";
it("parses mixed centuries, locale order and unambiguous ISO endpoints", () => {
  expect(parseDateRangeText("1/1/2026 - 1/3/26", "en-US")).toEqual({ start: "2026-01-01", end: "2026-01-03" });
  expect(parseDateRangeText("2026-01-01 – 2026-01-03", "en-US")).toEqual({ start: "2026-01-01", end: "2026-01-03" });
  expect(parseDateRangeText("1.2.26 to 3.2.26", "en-GB")).toEqual({ start: "2026-02-01", end: "2026-02-03" });
});
it("resolves complete relative periods against an explicit reference and week start", () => {
  expect(parseDateRangeText("last week", "en-US", "2026-10-16")).toEqual({ start: "2026-10-05", end: "2026-10-11" });
  expect(parseDateRangeText("last week", "en-US", "2026-10-16", 0)).toEqual({ start: "2026-10-04", end: "2026-10-10" });
  expect(parseDateRangeText("this month", "en-US", "2026-10-16")).toEqual({ start: "2026-10-01", end: "2026-10-31" });
  expect(parseDateRangeText("next year", "en-US", "2026-10-16")).toEqual({ start: "2027-01-01", end: "2027-12-31" });
});
it("rejects missing anchors, impossible dates, reversed ranges and unrecognized prose", () => {
  for (const text of ["last week", "2/30/26 - 3/1/26", "1/3/26 - 1/1/26", "last business week", "1/1/26", "1/1/26 - 1/2/26 - 1/3/26"]) expect(parseDateRangeText(text, "en-US")).toBeNull();
});

it("uses conversational relative text for either explicit range endpoint", () => {
 expect(parseDateRangeText("today - a week from today","en-US","2026-10-16")).toEqual({start:"2026-10-16",end:"2026-10-23"});
 expect(parseDateRangeText("a week ago to two weeks from today","en-US","2026-10-16")).toEqual({start:"2026-10-09",end:"2026-10-30"});
 expect(parseDateRangeText("today - a week from today","en-US")).toBeNull();
});
