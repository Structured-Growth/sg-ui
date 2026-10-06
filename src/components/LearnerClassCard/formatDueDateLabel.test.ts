import { describe, expect, it } from "vitest";
import { formatDueDateLabel } from "./formatDueDateLabel";
describe("formatDueDateLabel export", () => {
  it("formats an imminent date through the shared helper", () => {
    const now = new Date("2026-01-01T12:00:00Z");
    expect(formatDueDateLabel(new Date(now.getTime() + 60000), now)).toBe("Due today in 1 minute");
  });
});
