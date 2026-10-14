// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, expect, it } from "vitest";
import { Status } from "../../experimental/Status/Status";
import { AppInlineProgress } from "../AppInlineProgress/AppInlineProgress";
import { SGTranslationProvider } from "../../i18n";
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

it("keeps host-owned milestone announcements separate from quiet step and percentage updates", () => {
  const view = (status: "pending" | "in_progress" | "completed" | "error", value: number, message = "") => <>
    <AppOperationSteps steps={[{ id: "save", label: "Save draft", status }]} />
    <AppInlineProgress value={value} />
    <Status announcement="polite">{message}</Status>
  </>;
  const { rerender } = render(view("pending", 0));
  const item = screen.getByRole("listitem");
  const region = screen.getByRole("status");
  rerender(view("in_progress", 50));
  expect(screen.getByRole("listitem")).toBe(item);
  expect(item.textContent).toBe("Save draft: In progress");
  expect(screen.getAllByRole("progressbar")).toHaveLength(2);
  expect(region.textContent).toBe("");
  rerender(view("completed", 100, "Draft saved"));
  expect(item.getAttribute("data-status")).toBe("completed");
  expect(item.textContent).toBe("Save draft: Completed");
  expect(within(item).queryByRole("progressbar")).toBeNull();
  expect(screen.getByRole("status")).toBe(region);
  expect(region.textContent).toBe("Draft saved");
  rerender(view("error", 0, "Draft save failed"));
  expect(item.getAttribute("data-status")).toBe("error");
  expect(item.textContent).toBe("Save draft: Error");
  expect(item.querySelector('[data-tone="danger"]')).not.toBeNull();
  expect(region.textContent).toBe("Draft save failed");
  rerender(view("pending", 0));
  expect(item.textContent).toBe("Save draft: Pending");
  expect(region.textContent).toBe("");
});
it("translates error status without a library live region or numbering", () => {
  render(<SGTranslationProvider value={{ t: (_key, options) => options?.defaultMessage === "Error" ? "Erreur" : options?.defaultMessage ?? "" }}>
    <AppOperationSteps steps={[{ id: "save", label: "Enregistrer", status: "error" }]} />
  </SGTranslationProvider>);
  expect(screen.getByRole("listitem").textContent).toBe("Enregistrer: Erreur");
  expect(screen.queryByRole("status")).toBeNull();
  expect(screen.queryByRole("alert")).toBeNull();
  expect(screen.queryByRole("progressbar")).toBeNull();
  expect(screen.getByRole("listitem").querySelector('[aria-hidden="true"]')).not.toBeNull();
});
