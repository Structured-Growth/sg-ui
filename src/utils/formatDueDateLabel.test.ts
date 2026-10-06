import { describe, expect, it } from "vitest";
import { formatDueDateLabel, formatDueDateLabelTestUtils } from "./formatDueDateLabel";

const now = new Date("2026-02-26T12:00:00Z");

describe("formatDueDateLabel", () => {
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
    const result = formatDueDateLabel("2026-02-27T09:00:00Z", now);
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

  it("handles invalid now input by falling back to current time", () => {
    const label = formatDueDateLabel("2026-02-27T12:00:00Z", "not-a-date");
    expect(typeof label).toBe("string");
    expect(label.length > 0).toBe(true);
  });

  it("interpolates missing placeholders as empty strings", () => {
    expect(formatDueDateLabelTestUtils.interpolate("Due {date} ({count})", { date: "Mar 1" })).toBe("Due Mar 1 ()");
  });

});
