// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Provider } from "../../theme";
import { AppOperationSteps, type AppOperationStepsProps } from "./index";

afterEach(cleanup);

it("preserves host label order and isolates replacement, removal and remount with shared step IDs", () => {
  const first: AppOperationStepsProps = { title: "First operation", steps: [
    { id: "shared", label: "First prepare", status: "in_progress" },
    { id: "last", label: "First publish", status: "pending" },
  ] };
  const second: AppOperationStepsProps = { title: "Second operation", steps: [
    { id: "shared", label: "Second prepare", status: "error" },
    { id: "last", label: "Second publish", status: "completed" },
  ] };
  const view = (left: AppOperationStepsProps | null) => <Provider>
    <section aria-label="First host">{left && <AppOperationSteps {...left} />}</section>
    <section aria-label="Second host"><AppOperationSteps {...second} /></section>
  </Provider>;
  const { rerender } = render(view(first));
  const leftHost = screen.getByRole("region", { name: "First host" });
  const rightHost = screen.getByRole("region", { name: "Second host" });
  const rightList = within(rightHost).getByRole("list");
  const rightItems = within(rightList).getAllByRole("listitem");
  const text = (host: HTMLElement) => within(host).getAllByRole("listitem").map(item => item.textContent);
  expect(text(leftHost)).toEqual(["First prepare: In progress", "First publish: Pending"]);
  expect(text(rightHost)).toEqual(["Second prepare: Error", "Second publish: Completed"]);
  rerender(view({ ...first, steps: [
    { ...first.steps[1], status: "completed" },
    { ...first.steps[0], status: "pending" },
  ] }));
  expect(text(leftHost)).toEqual(["First publish: Completed", "First prepare: Pending"]);
  expect(within(leftHost).queryByRole("progressbar")).toBeNull();
  expect(within(rightHost).getByRole("list")).toBe(rightList);
  expect(within(rightList).getAllByRole("listitem")).toEqual(rightItems);
  expect(text(rightHost)).toEqual(["Second prepare: Error", "Second publish: Completed"]);
  rerender(view(null));
  expect(within(leftHost).queryByRole("list")).toBeNull();
  expect(text(rightHost)).toEqual(["Second prepare: Error", "Second publish: Completed"]);
  rerender(view(first));
  expect(text(leftHost)).toEqual(["First prepare: In progress", "First publish: Pending"]);
  expect(within(leftHost).getByRole("progressbar", { name: "First prepare" })).toBeDefined();
  expect(within(rightHost).queryByRole("progressbar")).toBeNull();
  expect(within(rightHost).getByRole("list")).toBe(rightList);
});
