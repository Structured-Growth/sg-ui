import { afterEach, describe, expect, it, vi } from "vitest";
import { formatDueDateLabel, formatDueDateLabelTestUtils } from "./formatDueDateLabel";

const now = new Date("2026-02-26T12:00:00Z");

describe("formatDueDateLabel", () => {
  afterEach(() => vi.useRealTimers());

  it.each([undefined, null, "", false, [], NaN, Infinity, -Infinity])("returns unavailable for missing/invalid input %s", input => {
    expect(formatDueDateLabel(input, now)).toBe("Due date unavailable");
  });

  it.each(["bad_locale", "", "zz-ZZ"])("uses deterministic English date/time fallback for locale %s", locale => {
    const due = new Date(2026, 0, 1, 9, 5);
    expect(formatDueDateLabel(due, new Date(2026, 0, 2), { locale })).toBe("Due Jan 1 at 9:05 AM");
  });

  it("preserves localized date/time and serializable translator values", () => {
    const t = vi.fn((_key, _message, values) => JSON.stringify(values));
    const due = new Date(2026, 0, 1, 9, 5);
    expect(formatDueDateLabel(due, new Date(2026, 0, 2), { locale: "de-DE", t })).toBe('{"date":"1. Jan.","time":"9:05"}');
    expect(t).toHaveBeenCalledWith("due.absoluteWithTime", "Due {date} at {time}", { date: "1. Jan.", time: "9:05" });
    expect(formatDueDateLabel(due, new Date(2026, 0, 2), { locale: "ar-EG" })).toBe(
      `Due ${new Intl.DateTimeFormat("ar-EG", { month: "short", day: "numeric" }).format(due)} at ${new Intl.DateTimeFormat("ar-EG", { hour: "numeric", minute: "2-digit" }).format(due)}`,
    );
  });

  it("preserves instants through ISO JSON roundtrips, epoch numbers and equivalent offsets without mutation", () => {
    const reference = new Date("2026-03-08T06:59:00Z");
    const due = new Date("2026-03-08T07:01:00Z");
    const serialized = JSON.stringify({ due, reference });
    const restored = JSON.parse(serialized);
    const expected = formatDueDateLabel(due, reference);
    expect(formatDueDateLabel(restored.due, restored.reference)).toBe(expected);
    expect(formatDueDateLabel(due.getTime(), reference.getTime())).toBe(expected);
    expect(formatDueDateLabel("2026-03-08T03:01:00-04:00", "2026-03-08T01:59:00-05:00")).toBe(expected);
    expect(JSON.stringify({ due, reference })).toBe(serialized);
  });

  it("switches from tomorrow to today at local midnight and uses absolute time at the deadline", () => {
    const due = new Date(2026, 0, 2, 0, 1);
    expect(formatDueDateLabel(due, new Date(2026, 0, 1, 23, 59))).toBe("Due tomorrow at 12:01 AM");
    expect(formatDueDateLabel(due, new Date(2026, 0, 2))).toBe("Due today in 1 minute");
    expect(formatDueDateLabel(due, due)).toBe("Due Jan 2 at 12:01 AM");
    expect(formatDueDateLabel(due, new Date(due.getTime() + 1))).toBe("Due Jan 2 at 12:01 AM");
  });

  it.each([
    [1, "1 minute"], [60000, "1 minute"], [60001, "2 minutes"],
    [59 * 60000, "59 minutes"], [59 * 60000 + 1, "1 hour"],
    [60 * 60000, "1 hour"], [60 * 60000 + 1, "2 hours"],
  ])("rounds a same-day duration of %s milliseconds upward", (duration, label) => {
    const reference = new Date(2026, 0, 1, 9);
    expect(formatDueDateLabel(new Date(reference.getTime() + duration), reference)).toBe(`Due today in ${label}`);
  });

  it.each([[0, 31], [1, 28], [9, 31], [11, 31]])("uses tomorrow across month/year boundary %s/%s", (month, day) => {
    const reference = new Date(2026, month, day, 23, 59);
    const due = new Date(2026, month, day + 1, 0, 1);
    expect(formatDueDateLabel(due, reference)).toBe("Due tomorrow at 12:01 AM");
  });

  it("uses tomorrow from leap day to March", () => {
    expect(formatDueDateLabel(new Date(2028, 2, 1, 0, 1), new Date(2028, 1, 29, 23, 59))).toBe("Due tomorrow at 12:01 AM");
  });

  it.each([[2, 7], [9, 31]])("uses calendar tomorrow across a DST transition from month %s day %s", (month, day) => {
    const reference = new Date(2026, month, day, 12);
    const due = new Date(2026, month, day + 1, 12);
    expect(formatDueDateLabel(due, reference)).toBe("Due tomorrow at 12:00 PM");
    if (process.env.TZ === "America/New_York") {
      expect((due.getTime() - reference.getTime()) / 3600000).toBe(month === 2 ? 23 : 25);
    }
  });

  it("counts elapsed time through the spring gap and autumn repeated hour", () => {
    expect(formatDueDateLabel("2026-03-08T03:01:00-04:00", "2026-03-08T01:59:00-05:00")).toBe("Due today in 2 minutes");
    expect(formatDueDateLabel("2026-11-01T01:30:00-05:00", "2026-11-01T01:30:00-04:00")).toBe("Due today in 1 hour");
  });

  it("keeps elapsed-day/week thresholds across daylight saving changes", () => {
    const reference = new Date(2026, 1, 20, 12);
    const due = new Date(reference.getTime() + 21 * 86400000);
    expect(formatDueDateLabel(due, reference)).toContain("(21 days)");
    expect(formatDueDateLabel(new Date(due.getTime() + 1), reference)).toContain("(4 weeks)");
  });

  it.each([undefined, null, "invalid", NaN, new Date(NaN)])("uses the current instant for missing/invalid reference %s", reference => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 9));
    expect(formatDueDateLabel(new Date(2026, 0, 1, 9, 1), reference)).toBe("Due today in 1 minute");
  });
  it("returns unavailable for invalid due date", () => {
    expect(formatDueDateLabel("bad-date", now)).toBe("Due date unavailable");
    expect(formatDueDateLabel({} as unknown, now)).toBe("Due date unavailable");
    expect(formatDueDateLabel(new Date(Number.NaN), now)).toBe("Due date unavailable");
  });

  it("returns absolute label for past date", () => {
    const result = formatDueDateLabel("2026-02-25T12:00:00Z", now);
    expect(result.startsWith("Due")).toBe(true);
    expect(result.includes("at")).toBe(true);
  });

  it("returns minute and hour labels for same-day due dates", () => {
    expect(formatDueDateLabel("2026-02-26T12:01:00Z", now)).toContain("1 minute");
    expect(formatDueDateLabel("2026-02-26T12:10:00Z", now)).toContain("10 minutes");
    expect(formatDueDateLabel("2026-02-26T13:00:00Z", now)).toContain("1 hour");
    expect(formatDueDateLabel("2026-02-26T15:00:00Z", now)).toContain("3 hours");
  });

  it("returns tomorrow label when due next day", () => {
    const result = formatDueDateLabel(new Date(2026, 1, 27, 9), new Date(2026, 1, 26, 12));
    expect(result.toLowerCase()).toContain("tomorrow");
  });

  it("returns day and week labels for future due dates", () => {
    expect(formatDueDateLabel("2026-02-28T12:00:00Z", now)).toContain("(2 days)");
    expect(formatDueDateLabel("2026-03-20T12:00:00Z", now)).toContain("weeks");
  });

  it("handles less-than-48-hours that crosses two calendar days", () => {
    const result = formatDueDateLabel(
      "2026-01-03T00:30:00Z",
      "2026-01-01T23:00:00Z",
    );
    expect(result).toContain("Due");
    expect(result).toContain("at");
  });

  it("uses absolute-with-time branch for <2 days across two calendar days", () => {
    const nowLocal = new Date(2026, 0, 1, 23, 30, 0);
    const dueLocal = new Date(2026, 0, 3, 0, 0, 0);
    let receivedKey = "";
    const result = formatDueDateLabel(dueLocal, nowLocal, {
      t: (key, defaultMessage) => {
        receivedKey = key;
        return defaultMessage;
      },
    });
    expect(receivedKey).toBe("due.absoluteWithTime");
    expect(result).toContain("Due");
    expect(result).toContain("at");
  });

  it("supports translator interpolation", () => {
    const label = formatDueDateLabel("2026-02-26T12:10:00Z", now, {
      t: (_key, defaultMessage, values) => `X:${defaultMessage.replace("{count}", String(values?.count ?? ""))}`,
    });
    expect(label.startsWith("X:Due today in")).toBe(true);
  });

  it("interpolates missing placeholders as empty strings", () => {
    expect(formatDueDateLabelTestUtils.interpolate("Due {date} ({count})", { date: "Mar 1" })).toBe("Due Mar 1 ()");
  });

});
