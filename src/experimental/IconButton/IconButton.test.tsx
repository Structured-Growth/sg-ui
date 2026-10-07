// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { IconButton } from "./IconButton";
import { AddIcon } from "../icons/AddIcon";
afterEach(cleanup);
it("requires an accessible action name and forwards a native ref with normalized activation", async () => {
  const ref = createRef<HTMLButtonElement>(); const action = vi.fn(); const user = userEvent.setup();
  render(<IconButton ref={ref} label="Add course" onPress={action}><AddIcon label="Plus symbol" /></IconButton>);
  const button = screen.getByRole("button", { name: "Add course" }); expect(ref.current).toBe(button);
  expect(screen.queryByRole("img")).toBeNull();
  await user.tab(); await user.keyboard("{Enter} "); await user.click(button); expect(action).toHaveBeenCalledTimes(3);
});
it("includes its action name in the pending announcement and prevents activation", async () => {
  const action = vi.fn(); const user = userEvent.setup(); render(<IconButton loading label="Save" onPress={action}><AddIcon /></IconButton>);
  await user.click(screen.getByRole("button", { name: "Save Pending" })); expect(action).not.toHaveBeenCalled(); expect(screen.getByRole("progressbar")).toBeDefined();
});
it("preserves host descriptions and the decorative icon boundary when its label and pending state change", () => {
  const content = (loading: boolean, label: string) => <>
    <p id="action-help">Changes the current course.</p>
    <IconButton label={label} loading={loading} aria-describedby="action-help">
      <AddIcon label="Unrelated icon name" />
    </IconButton>
  </>;
  const { rerender } = render(content(false, "Save course"));
  const button = screen.getByRole("button", { name: "Save course" });
  expect(screen.getByRole("button", { description: "Changes the current course." })).toBe(button);
  rerender(content(true, "Save draft"));
  expect(screen.getByRole("button", { name: "Save draft Pending" })).toBe(button);
  expect(screen.getByRole("button", { description: /Changes the current course\./ })).toBe(button);
  expect(screen.queryByRole("img")).toBeNull();
  rerender(content(false, "Save draft"));
  expect(screen.getByRole("button", { name: "Save draft" })).toBe(button);
  expect(screen.getByRole("button", { description: "Changes the current course." })).toBe(button);
});
it("preserves explicit native form types and external form ownership", () => {
  render(<>
    <form id="course-form" />
    <IconButton label="More" form="course-form"><AddIcon /></IconButton>
    <IconButton label="Save" type="submit" form="course-form" name="action" value="save"><AddIcon /></IconButton>
    <IconButton label="Reset" type="reset" form="course-form"><AddIcon /></IconButton>
  </>);
  for (const [label, type] of [["More", "button"], ["Save", "submit"], ["Reset", "reset"]]) {
    const button = screen.getByRole("button", { name: label }) as HTMLButtonElement;
    expect(button.type).toBe(type);
    expect(button.form).toBe(document.getElementById("course-form"));
  }
  const submit = screen.getByRole("button", { name: "Save" }) as HTMLButtonElement;
  expect(submit.name).toBe("action");
  expect(submit.value).toBe("save");
});
