// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, expect, it } from "vitest";
import { AppInlineProgress } from "./AppInlineProgress";
import { SGTranslationProvider } from "../../i18n";
afterEach(cleanup);
it("clamps and rounds progress, preserving the percentage display", () => {
  const { rerender } = render(<AppInlineProgress value={110.6} />);
  expect(screen.getByRole("progressbar", { name: "Progress" }).getAttribute("aria-valuenow")).toBe("100");
  expect(screen.getByText("100%")).toBeDefined();
  rerender(<AppInlineProgress value={24.6} />);
  expect(screen.getByText("25%")).toBeDefined();
  rerender(<AppInlineProgress value={-8.2} />);
  expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("0");
  rerender(<AppInlineProgress value={NaN} />);
  expect(screen.getByText("0%")).toBeDefined();
});
it("preserves numeric pixel and CSS bar widths", () => {
  const { rerender } = render(<AppInlineProgress value={40} barWidth={240} />);
  expect(screen.getByRole("progressbar").style.inlineSize).toBe("240px");
  rerender(<AppInlineProgress value={40} barWidth="50%" />);
  expect(screen.getByRole("progressbar").style.inlineSize).toBe("50%");
});
it("uses the host translation adapter for progress names and renders on the server", () => {
  render(<SGTranslationProvider value={{ t: (_key, options) => options?.defaultMessage === "Progress" ? "Progrès" : options?.defaultMessage ?? "" }}><AppInlineProgress value={50} /></SGTranslationProvider>);
  expect(screen.getByRole("progressbar", { name: "Progrès" })).toBeDefined();
  expect(renderToString(<AppInlineProgress value={50} />)).toContain('aria-valuenow="50"');
});
