// @vitest-environment jsdom
import { createRef } from "react";
import { renderToString } from "react-dom/server";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Progress } from "./Progress";
afterEach(cleanup);
it("exposes bounded determinate progress with host names and value text", () => {
  const ref = createRef<HTMLDivElement>();
  const { rerender } = render(<Progress ref={ref} label="Uploading" minValue={0} maxValue={10} value={3} valueText="3 of 10 files" />);
  const progress = screen.getByRole("progressbar", { name: "Uploading" });
  expect(ref.current).toBe(progress);
  expect(progress.getAttribute("aria-valuenow")).toBe("3");
  expect(progress.getAttribute("aria-valuetext")).toBe("3 of 10 files");
  expect(progress.querySelector("[aria-hidden] span")?.getAttribute("style")).toContain("30%");
  rerender(<Progress label="Uploading" maxValue={10} value={15} />);
  expect(progress.getAttribute("aria-valuenow")).toBe("10");
  expect(progress.getAttribute("aria-live")).toBeNull();
});
it("distinguishes loading from measurable progress and invalid values", () => {
  const { rerender } = render(<Progress aria-label="Loading courses" />);
  const progress = screen.getByRole("progressbar", { name: "Loading courses" });
  expect(progress.getAttribute("aria-valuenow")).toBeNull();
  expect(progress.hasAttribute("data-indeterminate")).toBe(true);
  rerender(<Progress aria-label="Loading courses" value={0} />);
  expect(progress.getAttribute("aria-valuenow")).toBe("0");
  rerender(<Progress aria-label="Loading courses" value={NaN} />);
  expect(progress.getAttribute("aria-valuenow")).toBeNull();
});
it("supports an external label and SSR without a provider", () => {
  render(<><span id="title">Import</span><Progress aria-labelledby="title" value={25} /></>);
  expect(screen.getByRole("progressbar", { name: "Import" })).toBeDefined();
  expect(renderToString(<Progress label="Import" value={25} />)).toContain('aria-valuenow="25"');
});
it("keeps circular progress semantics and handles invalid bounds without non-finite markup", () => {
  const { rerender } = render(<Progress label="Processing" variant="circular" value={40} minValue={10} maxValue={10} />);
  const progress = screen.getByRole("progressbar", { name: "Processing" });
  expect(progress.getAttribute("aria-valuemin")).toBe("10");
  expect(progress.getAttribute("aria-valuemax")).toBe("110");
  expect(progress.getAttribute("aria-valuenow")).toBe("40");
  expect(progress.querySelector("circle[pathLength]")?.getAttribute("stroke-dasharray")).toBe("30 100");
  rerender(<Progress label="Processing" variant="circular" />);
  expect(progress.getAttribute("aria-valuenow")).toBeNull();
  expect(progress.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
});

it.each(["linear", "circular"] as const)("recovers an increasing range after loading with unrepresentable %s bounds", (variant) => {
  const { rerender } = render(<Progress label="Import" variant={variant} />);
  const progress = screen.getByRole("progressbar", { name: "Import" });
  for (const minimum of [Number.MAX_VALUE, -Number.MAX_VALUE]) {
    rerender(<Progress label="Import" variant={variant} minValue={minimum} maxValue={minimum} value={50} valueText="Half complete" />);
    expect(progress.getAttribute("aria-valuemin")).toBe("0");
    expect(progress.getAttribute("aria-valuemax")).toBe("100");
    expect(progress.getAttribute("aria-valuenow")).toBe("50");
    expect(progress.getAttribute("aria-valuetext")).toBe("Half complete");
    expect(progress.hasAttribute("data-indeterminate")).toBe(false);
    if (variant === "circular") {
      expect(progress.querySelector("circle[pathLength]")?.getAttribute("stroke-dasharray")).toBe("50 100");
    } else {
      expect((progress.querySelector("[aria-hidden] span") as HTMLElement).style.inlineSize).toBe("50%");
    }
    rerender(<Progress label="Import" variant={variant} />);
    expect(progress.getAttribute("aria-valuenow")).toBeNull();
    expect(progress.hasAttribute("data-indeterminate")).toBe(true);
  }
});
