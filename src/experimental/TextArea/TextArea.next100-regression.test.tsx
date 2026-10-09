// @vitest-environment jsdom
import { createRef } from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { Provider, TextArea, type TextAreaProps } from "../index";

afterEach(() => { cleanup(); vi.useRealTimers(); });

it("isolates multiline drafts, callbacks and resets across consuming forms", async () => {
  const user = userEvent.setup();
  const firstChange = vi.fn(); const secondChange = vi.fn();
  const ref = createRef<HTMLTextAreaElement>();
  const first: TextAreaProps = { label: "First summary", name: "summary", defaultValue: "First\ndefault", onValueChange: firstChange };
  const second: TextAreaProps = { label: "Second summary", name: "summary", defaultValue: "Second\ndefault", onValueChange: secondChange };
  const { container } = render(<Provider>
    <form><TextArea {...first} ref={ref} /><button type="reset">Reset first</button></form>
    <form><TextArea {...second} /><button type="reset">Reset second</button></form>
  </Provider>);
  const a = screen.getByRole("textbox", { name: "First summary" });
  const b = screen.getByRole("textbox", { name: "Second summary" });
  expect(ref.current).toBe(a);
  await user.clear(a); await user.type(a, "First\ndraft");
  expect(firstChange).toHaveBeenLastCalledWith("First\ndraft");
  expect(secondChange).not.toHaveBeenCalled();
  await user.clear(b); await user.type(b, "Second\ndraft");
  expect(secondChange).toHaveBeenLastCalledWith("Second\ndraft");
  firstChange.mockClear(); secondChange.mockClear();
  await user.click(screen.getByRole("button", { name: "Reset first" }));
  await vi.waitFor(() => expect(a).toHaveProperty("value", "First\ndefault"));
  expect(b).toHaveProperty("value", "Second\ndraft");
  const forms = container.querySelectorAll("form");
  expect(new FormData(forms[0]).get("summary")).toBe("First\ndefault");
  expect(new FormData(forms[1]).get("summary")).toBe("Second\ndraft");
  expect(firstChange).not.toHaveBeenCalled(); expect(secondChange).not.toHaveBeenCalled();
});

it("follows form reassociation without allowing the old form to reset its draft", () => {
  vi.useFakeTimers();
  const change = vi.fn(); const ref = createRef<HTMLTextAreaElement>();
  const view = (form: string, mounted = true) => <Provider>
    <form id="old-owner" /><form id="new-owner" />
    {mounted && <TextArea ref={ref} label="Summary" form={form} defaultValue={"Saved\nsummary"} onValueChange={change} />}
  </Provider>;
  const { rerender } = render(view("old-owner"));
  fireEvent.change(ref.current!, { target: { value: "Draft\nsummary" } });
  expect(change).toHaveBeenLastCalledWith("Draft\nsummary");
  rerender(view("new-owner"));
  expect(ref.current?.form?.id).toBe("new-owner");
  change.mockClear();
  act(() => { (document.getElementById("old-owner") as HTMLFormElement).reset(); vi.runOnlyPendingTimers(); });
  expect(ref.current?.value).toBe("Draft\nsummary");
  act(() => { (document.getElementById("new-owner") as HTMLFormElement).reset(); vi.runOnlyPendingTimers(); });
  expect(ref.current?.value).toBe("Saved\nsummary");
  expect(change).not.toHaveBeenCalled();
});

it("discards a queued reset across unmount/remount", () => {
  vi.useFakeTimers();
  const change = vi.fn(); const ref = createRef<HTMLTextAreaElement>();
  const view = (mounted = true) => <Provider>
    <form id="new-owner" />
    {mounted && <TextArea ref={ref} label="Summary" form="new-owner" defaultValue={"Saved\nsummary"} onValueChange={change} />}
  </Provider>;
  const { rerender } = render(view());
  fireEvent.change(ref.current!, { target: { value: "Discarded draft" } });
  change.mockClear();
  act(() => { (document.getElementById("new-owner") as HTMLFormElement).reset(); });
  rerender(view(false));
  expect(ref.current).toBeNull();
  rerender(view());
  fireEvent.change(ref.current!, { target: { value: "Fresh\ndraft" } });
  change.mockClear();
  act(() => { vi.runOnlyPendingTimers(); });
  expect(ref.current?.value).toBe("Fresh\ndraft");
  expect(change).not.toHaveBeenCalled();
});
