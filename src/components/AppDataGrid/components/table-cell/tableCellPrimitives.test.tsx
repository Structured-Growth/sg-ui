// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { CellFallback } from "./CellFallback";
import { CustomTableCell } from "./CustomTableCell";
import { DateTableCell } from "./DateTableCell";
import { DateTimeTableCell } from "./DateTimeTableCell";
import { ImageTableCell } from "./ImageTableCell";
import { JsonTableCell } from "./JsonTableCell";
import { TableCellLink } from "./TableCellLink";
import { TextTableCell } from "./TextTableCell";
import { TableLoaderOverlay } from "../TableLoaderOverlay";
import { TableNoResults } from "../TableNoResults";
afterEach(cleanup);
it("renders escaped text, custom content and safe cyclic JSON fallback", () => {
  const cyclic: Record<string, unknown> = {}; cyclic.self = cyclic;
  render(<><CellFallback value={null} fallbackText="Fallback" /><TextTableCell value="<b>text</b>" /><CustomTableCell><strong>Custom</strong></CustomTableCell><JsonTableCell value={cyclic} fallbackText="Invalid JSON" /></>);
  expect(screen.getByText("Fallback")).toBeTruthy(); expect(screen.getByText("<b>text</b>").tagName).toBe("SPAN");
  expect(screen.getByText("Custom").tagName).toBe("STRONG"); expect(screen.getByText("Invalid JSON")).toBeTruthy();
});
it("uses host locale and timezone while preserving a serialized calendar date", () => {
  render(<><DateTableCell value="2026-10-06" locale="en-US" timeZone="America/Los_Angeles" /><DateTimeTableCell value="bad" fallbackText="Invalid date" /></>);
  expect(screen.getByText("Oct 6, 2026")).toBeTruthy(); expect(screen.getByText("Invalid date")).toBeTruthy();
});
it("preserves complete escaped text and host titles while allowing multiline display", () => {
  const value = "First line\n<script>long unbroken content</script>";
  const { rerender } = render(<TextTableCell value={value} title="Host description" />);
  const fullText = () => screen.getByTitle(value, { normalizer: text => text });
  const text = fullText();
  const truncatedClass = text.className;
  expect(text.textContent).toBe(value);
  expect(screen.getByTitle("Host description").contains(text)).toBe(true);
  expect(text.parentElement?.dataset.truncate).toBe("true");
  rerender(<TextTableCell value={value} truncate={false} title="Host description" />);
  expect(fullText().textContent).toBe(value);
  expect(fullText().className).not.toBe(truncatedClass);
  expect(fullText().parentElement?.dataset.truncate).toBe("false");
  expect(document.querySelector("script")).toBeNull();
});
it("formats a real instant through the host formatter and keeps date-only context stable", () => {
  const formats: unknown[] = [];
  render(<><DateTimeTableCell value="2026-10-06T02:00:00Z" locale="de-DE" timeZone="America/Los_Angeles"
    formatDate={(date, context) => { formats.push([date.toISOString(), context]); return "Host timestamp"; }} />
    <DateTableCell value="2026-10-06" timeZone="Pacific/Kiritimati"
      formatDate={(_date, context) => { formats.push(context); return "Host calendar day"; }} /></>);
  expect(screen.getByText("Host timestamp")).toBeTruthy();
  expect(screen.getByText("Host calendar day")).toBeTruthy();
  expect(formats[0]).toEqual(["2026-10-06T02:00:00.000Z", { locale: "de-DE", timeZone: "America/Los_Angeles", dateOnly: false, cellType: "dateTime" }]);
  expect(formats[1]).toMatchObject({ timeZone: "UTC", dateOnly: true, cellType: "date" });
});
it("preserves native link metadata and handles image failure", () => {
  render(<><TableCellLink href="/course" label="Course" target="_blank" /><ImageTableCell src="/broken.png" alt="Course image" fallbackText="No image" /></>);
  expect(screen.getByRole("link").getAttribute("href")).toBe("/course"); expect(screen.getByRole("link").getAttribute("rel")).toContain("noopener");
  fireEvent.error(screen.getByRole("img")); expect(screen.getByText("No image")).toBeTruthy();
});
it("announces loading and no results through owned status parts", () => {
  render(<><TableLoaderOverlay /><TableNoResults /></>);
  expect(screen.getByText("Loading rows")).toBeTruthy(); expect(screen.getByText("No results found")).toBeTruthy();
});
