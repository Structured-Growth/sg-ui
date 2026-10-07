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
it("preserves native link metadata and handles image failure", () => {
  render(<><TableCellLink href="/course" label="Course" target="_blank" /><ImageTableCell src="/broken.png" alt="Course image" fallbackText="No image" /></>);
  expect(screen.getByRole("link").getAttribute("href")).toBe("/course"); expect(screen.getByRole("link").getAttribute("rel")).toContain("noopener");
  fireEvent.error(screen.getByRole("img")); expect(screen.getByText("No image")).toBeTruthy();
});
it("announces loading and no results through owned status parts", () => {
  render(<><TableLoaderOverlay /><TableNoResults /></>);
  expect(screen.getByText("Loading rows")).toBeTruthy(); expect(screen.getByText("No results found")).toBeTruthy();
});
