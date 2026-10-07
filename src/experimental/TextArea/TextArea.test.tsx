// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { TextArea } from "./TextArea";
afterEach(cleanup);
it("preserves multiline values, native refs/submission and reset", async () => {
 const ref = createRef<HTMLTextAreaElement>(); const user = userEvent.setup(); const change = vi.fn(); const { container } = render(<form><TextArea ref={ref} label="Description" name="description" defaultValue="First line" onValueChange={change} rows={6} /><button type="reset">Reset</button></form>);
 const input = screen.getByRole("textbox", { name: "Description" }); expect(ref.current).toBe(input); expect(ref.current?.rows).toBe(6);
 await user.click(input); await user.keyboard("{End}{Enter}Second line"); expect(change).toHaveBeenLastCalledWith("First line\nSecond line");
 expect(new FormData(container.querySelector('form')!).get("description")).toBe("First line\nSecond line"); await user.click(screen.getByRole("button")); expect(ref.current?.value).toBe("First line");
});
it("keeps controlled values and names/descriptions/errors associated", async () => {
 const change = vi.fn(); const user = userEvent.setup(); const { rerender } = render(<TextArea aria-label="Description" value="Host" onValueChange={change} invalid description="Course summary" errorMessage="Too short" />);
 const input = screen.getByRole("textbox", { name: "Description" }) as HTMLTextAreaElement; await user.click(input); await user.keyboard("{End}!"); expect(change).toHaveBeenCalledWith("Host!"); expect(input.value).toBe("Host");
 const text = input.getAttribute('aria-describedby')!.split(' ').map(id => document.getElementById(id)?.textContent).join(' '); expect(text).toContain("Course summary"); expect(text).toContain("Too short");
 change.mockClear(); rerender(<TextArea label="Description" value="Host" readOnly onValueChange={change} />); await user.keyboard("!"); expect(change).not.toHaveBeenCalled();
});
it("participates in native required validation and disabled submission", () => {
 const { container, rerender } = render(<form><TextArea label="Summary" name="summary" required /></form>);
 const form = container.querySelector('form')!; expect(form.checkValidity()).toBe(false);
 rerender(<form><TextArea label="Summary" name="summary" defaultValue="Saved" disabled /></form>); expect(new FormData(container.querySelector('form')!).has("summary")).toBe(false);
});
it("restores the latest uncontrolled default without notifying the host", async () => {
 const user = userEvent.setup(); const change = vi.fn();
 const view = (defaultValue: string) => <form><TextArea label="Summary" name="summary" defaultValue={defaultValue} onValueChange={change} /><button type="reset">Reset</button></form>;
 const { rerender, container } = render(view("Original"));
 const input = screen.getByRole("textbox", { name: "Summary" });
 await user.clear(input); await user.type(input, "Draft\nsecond line");
 rerender(view("Latest\ndefault"));
 expect(input).toHaveProperty("value", "Draft\nsecond line");
 change.mockClear(); await user.click(screen.getByRole("button", { name: "Reset" }));
 await vi.waitFor(() => expect(input).toHaveProperty("value", "Latest\ndefault"));
 expect(new FormData(container.querySelector("form")!).get("summary")).toBe("Latest\ndefault");
 expect(change).not.toHaveBeenCalled();
});
it("honors delegated host reset prevention without notifying the host", async () => {
 const user = userEvent.setup(); const change = vi.fn();
 render(<form onReset={event => event.preventDefault()}><TextArea label="Summary" defaultValue="Original" onValueChange={change} /><button type="reset">Reset</button></form>);
 const input = screen.getByRole("textbox", { name: "Summary" });
 await user.clear(input); await user.type(input, "Keep my draft"); change.mockClear();
 await user.click(screen.getByRole("button", { name: "Reset" }));
 await new Promise(resolve => setTimeout(resolve, 20));
 expect(input).toHaveProperty("value", "Keep my draft"); expect(change).not.toHaveBeenCalled();
});
it("retains controlled authority during reset on an externally associated form", async () => {
 const user = userEvent.setup(); const change = vi.fn(); const ref = createRef<HTMLTextAreaElement>();
 render(<><form id="host-form"><button type="reset">Reset</button></form><TextArea ref={ref} form="host-form" label="Host summary" name="summary" value={"Host\nvalue"} onValueChange={change} autoComplete="off" inputMode="text" rows={7} minLength={2} maxLength={80} /></>);
 expect(ref.current?.form?.id).toBe("host-form"); expect(ref.current?.rows).toBe(7);
 expect(ref.current?.getAttribute("autocomplete")).toBe("off"); expect(ref.current?.inputMode).toBe("text");
 expect(ref.current?.minLength).toBe(2); expect(ref.current?.maxLength).toBe(80);
 await user.click(screen.getByRole("button", { name: "Reset" }));
 await new Promise(resolve => setTimeout(resolve, 20));
 expect(ref.current?.value).toBe("Host\nvalue"); expect(change).not.toHaveBeenCalled();
 expect(new FormData(document.getElementById("host-form") as HTMLFormElement).get("summary")).toBe("Host\nvalue");
});
it("keeps external and field descriptions while validation changes", () => {
 const view = (invalid: boolean) => <><p id="host-help">Host guidance</p><TextArea label="Summary" description="Multiline guidance" aria-describedby="host-help" invalid={invalid} errorMessage="Add a summary" /></>;
 const { rerender } = render(view(true)); const input = screen.getByRole("textbox", { name: "Summary" });
 const described = () => input.getAttribute("aria-describedby")!.split(" ").map(id => document.getElementById(id)?.textContent).join(" ");
 expect(described()).toContain("Host guidance"); expect(described()).toContain("Multiline guidance"); expect(described()).toContain("Add a summary");
 rerender(view(false)); expect(described()).toContain("Host guidance"); expect(described()).toContain("Multiline guidance"); expect(described()).not.toContain("Add a summary");
 expect(input.getAttribute("aria-invalid")).not.toBe("true");
});
