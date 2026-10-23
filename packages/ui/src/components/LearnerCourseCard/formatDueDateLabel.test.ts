import { describe, expect, it } from "vitest";
import { formatDueDateLabel } from "./formatDueDateLabel";
import { formatDueDateLabel as sharedFormatter } from "../../utils/formatDueDateLabel";
describe("formatDueDateLabel export", () => {
  it("formats an imminent date through the shared helper", () => {
    const now = new Date("2026-01-01T12:00:00Z");
    expect(formatDueDateLabel(new Date(now.getTime() + 60000), now)).toBe("Due today in 1 minute");
  });
  it("preserves the shared formatter and JSON due-date contract with English fallback", () => {
    expect(formatDueDateLabel).toBe(sharedFormatter);
    const due = new Date(2026, 0, 1, 9, 5);
    const reference = new Date(2026, 0, 2);
    const restored = JSON.parse(JSON.stringify({ due, reference }));
    expect(formatDueDateLabel(restored.due, restored.reference, { locale: "bad_locale" })).toBe("Due Jan 1 at 9:05 AM");
    expect(formatDueDateLabel(null, restored.reference)).toBe("Due date unavailable");
  });
});
