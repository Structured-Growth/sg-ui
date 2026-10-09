import { expect, it } from "vitest";
import {
  dateTimeToInstant, isDateOnly, isDateRangeAllowed,
  type DateOnly, type DateRange, type DateAvailability, type DateRangePreset,
} from "../index";

it("keeps public civil values JSON serializable and utility calls deterministic across host policies", () => {
  const date: DateOnly = "2024-02-29";
  const range: DateRange = Object.freeze({ start: date, end: "2024-03-01" });
  const unavailable: readonly DateAvailability[] = Object.freeze([
    Object.freeze({ date, reason: "Host closure" }),
  ]);
  const preset: DateRangePreset = Object.freeze({ id: "spring", label: "Spring", value: range });
  const local = "2024-03-11T00:00:00";
  const snapshot = JSON.stringify({ date, range, unavailable, preset, local });

  for (let call = 0; call < 3; call++) {
    expect(isDateOnly(date)).toBe(true);
    expect(isDateRangeAllowed(range, { unavailable })).toBe(false);
    expect(isDateRangeAllowed(range, { min: date, max: range.end })).toBe(true);
    expect(dateTimeToInstant(local, "Asia/Tokyo")).toBe("2024-03-10T15:00:00.000Z");
    expect(dateTimeToInstant(local, "America/Chicago")).toBe("2024-03-11T05:00:00.000Z");
    expect(isDateRangeAllowed(null, { unavailable })).toBe(true);
    expect(JSON.stringify({ date, range, unavailable, preset, local })).toBe(snapshot);
  }
  const instant = dateTimeToInstant(local, "Asia/Tokyo");
  expect(JSON.parse(JSON.stringify({ date, range, preset, local, instant }))).toEqual({
    date: "2024-02-29", range: { start: "2024-02-29", end: "2024-03-01" },
    preset: { id: "spring", label: "Spring", value: { start: "2024-02-29", end: "2024-03-01" } },
    local: "2024-03-11T00:00:00", instant: "2024-03-10T15:00:00.000Z",
  });
});
