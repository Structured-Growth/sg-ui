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
