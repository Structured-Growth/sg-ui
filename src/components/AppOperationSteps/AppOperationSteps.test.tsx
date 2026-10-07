// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, expect, it } from "vitest";
import { AppOperationSteps } from "./AppOperationSteps";
afterEach(cleanup);
it("renders ordered steps with accessible status text and a named loading indicator", () => {
  const { rerender } = render(<AppOperationSteps title="Publishing" subtitle="Running checks" steps={[
    { id: "1", label: "Queued", status: "pending" },
    { id: "2", label: "Deploying", status: "in_progress" },
    { id: "3", label: "Published", status: "completed" },
  ]} />);
  expect(screen.getByText("Publishing")).toBeDefined();
  expect(screen.getByText("Running checks")).toBeDefined();
  expect(within(screen.getByRole("list")).getAllByRole("listitem")).toHaveLength(3);
  expect(screen.getByText(": Pending")).toBeDefined();
  expect(screen.getByText(": Completed")).toBeDefined();
  expect(screen.getByRole("progressbar", { name: "Deploying" }).getAttribute("aria-valuenow")).toBeNull();
  expect(screen.queryByRole("status")).toBeNull();
  rerender(<AppOperationSteps steps={[{ id: "2", label: "Deploying", status: "completed" }]} />);
  expect(screen.queryByRole("progressbar")).toBeNull();
  expect(screen.getByText(": Completed")).toBeDefined();
});
it("preserves a single operation without step-count labels and supports empty/SSR states", () => {
  const { rerender } = render(<AppOperationSteps steps={[{ id: "1", label: "Preparing", status: "pending" }]} />);
  expect(screen.getAllByRole("listitem")).toHaveLength(1);
  expect(screen.queryByText("Step 1 of 1")).toBeNull();
  rerender(<AppOperationSteps steps={[]} />);
  expect(screen.queryByRole("listitem")).toBeNull();
  expect(renderToString(<AppOperationSteps steps={[]} />)).toContain('data-sgui-part="operation-steps"');
});
