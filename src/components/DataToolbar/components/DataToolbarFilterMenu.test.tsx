// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { Provider } from "../../../experimental/Provider/Provider";
import { DataToolbarFilterMenu, type DataToolbarFilterField, type DataToolbarFilterRule } from "./DataToolbarFilterMenu";
afterEach(cleanup);
const fields: DataToolbarFilterField[] = [
  { id: "name", label: "Host name", type: "string" },
  { id: "status", label: "Host status", type: "enum", enumOptions: [{ id: "active", label: "Host active" }, { id: "inactive", label: "Host inactive" }] },
  { id: "score", label: "Score", type: "number" },
  { id: "created", label: "Created", type: "date" },
];
const mount = (value: DataToolbarFilterRule[] = []) => {
  const onApply = vi.fn(); const submit = vi.fn(event => event.preventDefault());
  render(<Provider><form onSubmit={submit}><DataToolbarFilterMenu fields={fields} value={value} onApply={onApply} /></form></Provider>);
  return { onApply, submit };
};
it("edits nested field/operator selections, applies only valid rules and never submits a host form", async () => {
  const user = userEvent.setup(); const { onApply, submit } = mount();
  const trigger = screen.getByRole("button", { name: "Filter" }); await user.click(trigger);
  await user.click(screen.getByRole("button", { name: /Columns 1/ }));
  await user.click(screen.getByRole("option", { name: "Host name" }));
  expect(screen.getByRole("dialog", { name: "Filter" })).toBeDefined();
  await user.type(screen.getByLabelText("Value 1"), "harry");
  await user.click(screen.getByRole("button", { name: /Operator 1/ }));
  await user.click(screen.getByRole("option", { name: "starts with" }));
  expect((screen.getByLabelText("Value 1") as HTMLInputElement).value).toBe("");
  await user.type(screen.getByLabelText("Value 1"), "potter");
  await user.click(screen.getByRole("button", { name: "Add filter" }));
  await user.click(screen.getByRole("button", { name: "Apply" }));
  expect(onApply).toHaveBeenCalledWith([{ field: "name", operator: "starts_with", value: "potter" }]);
  expect(submit).not.toHaveBeenCalled();
  await waitFor(() => expect(document.activeElement).toBe(trigger));
});
it("supports enum multi-selection, nested Escape and All as no active rule", async () => {
  const user = userEvent.setup(); const { onApply } = mount([{ field: "status", operator: "is", value: "active" }]);
  await user.click(screen.getByRole("button", { name: "Filter 1" }));
  await user.click(screen.getByRole("button", { name: "Value 1" }));
  await user.click(screen.getByRole("checkbox", { name: "Host inactive" }));
  expect((screen.getByRole("checkbox", { name: "Host active" }) as HTMLInputElement).checked).toBe(true);
  await user.keyboard("{Escape}");
  expect(screen.getByRole("dialog", { name: "Filter" })).toBeDefined();
  await user.click(screen.getByRole("button", { name: "Apply" }));
  expect(onApply).toHaveBeenLastCalledWith([{ field: "status", operator: "is", value: "active|||inactive" }]);
  await user.click(screen.getByRole("button", { name: "Filter 1" }));
  await user.click(screen.getByRole("button", { name: "Value 1" }));
  await user.click(screen.getByRole("checkbox", { name: "All" }));
  await user.keyboard("{Escape}");
  await user.click(screen.getByRole("button", { name: "Apply" }));
  expect(onApply).toHaveBeenLastCalledWith([]);
});
it("cancels drafts, resets only drafts, sanitizes unknown fields/operators and clears valueless operators", async () => {
  const user = userEvent.setup(); const { onApply } = mount([
    { field: "name", operator: "contains", value: "seed" },
    { field: "missing", operator: "contains", value: "x" },
    { field: "name", operator: "eq", value: "2" },
    { field: "name", operator: "is_empty", value: "stale" },
  ]);
  await user.click(screen.getByRole("button", { name: "Filter 2" }));
  await user.clear(screen.getByLabelText("Value 1"));
  await user.click(screen.getByRole("button", { name: "Cancel" }));
  expect(onApply).not.toHaveBeenCalled();
  await user.click(screen.getByRole("button", { name: "Filter 2" }));
  expect((screen.getByLabelText("Value 1") as HTMLInputElement).value).toBe("seed");
  await user.click(screen.getByRole("button", { name: "Apply" }));
  expect(onApply).toHaveBeenLastCalledWith([{ field: "name", operator: "contains", value: "seed" }, { field: "name", operator: "is_empty", value: "" }]);
  await user.click(screen.getByRole("button", { name: "Filter 2" }));
  await user.click(screen.getByRole("button", { name: "Reset" }));
  expect(onApply).toHaveBeenCalledTimes(1);
  await user.click(screen.getByRole("button", { name: "Apply" }));
  expect(onApply).toHaveBeenLastCalledWith([]);
});
it("retains labelled native number/date values and removes rules", async () => {
  const user = userEvent.setup(); const { onApply } = mount([{ field: "score", operator: "gte", value: "10" }, { field: "created", operator: "on", value: "2026-01-01" }]);
  await user.click(screen.getByRole("button", { name: "Filter 2" }));
  expect(screen.getByLabelText("Value 1").getAttribute("type")).toBe("number");
  expect(screen.getByLabelText("Value 2").getAttribute("type")).toBe("date");
  fireEvent.change(screen.getByLabelText("Value 2"), { target: { value: "2026-10-06" } });
  await user.click(screen.getByRole("button", { name: "Remove filter 1" }));
  await user.click(screen.getByRole("button", { name: "Apply" }));
  expect(onApply).toHaveBeenCalledWith([{ field: "created", operator: "on", value: "2026-10-06" }]);
});
it("preserves surviving row identity and draft values, then focuses its field after removing the final row", async () => {
  const user = userEvent.setup(); const { onApply } = mount([
    { field: "name", operator: "contains", value: "seed" },
    { field: "score", operator: "gte", value: "10" },
    { field: "created", operator: "on", value: "2026-01-01" },
  ]);
  await user.click(screen.getByRole("button", { name: "Filter 3" }));
  const scoreField = screen.getByRole("button", { name: /Columns 2/ });
  const scoreInput = screen.getByLabelText("Value 2");
  fireEvent.change(scoreInput, { target: { value: "42" } });
  await user.click(screen.getByRole("button", { name: "Remove filter 1" }));
  expect(screen.getByRole("button", { name: /Columns 1/ })).toBe(scoreField);
  expect(screen.getByLabelText("Value 1")).toBe(scoreInput);
  await waitFor(() => expect(document.activeElement).toBe(scoreField));
  await user.click(screen.getByRole("button", { name: "Remove filter 2" }));
  await waitFor(() => expect(document.activeElement).toBe(scoreField));
  expect((screen.getByLabelText("Value 1") as HTMLInputElement).value).toBe("42");
  await user.click(screen.getByRole("button", { name: "Apply" }));
  expect(onApply).toHaveBeenCalledWith([{ field: "score", operator: "gte", value: "42" }]);
});
