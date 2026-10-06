// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { TextField } from "./TextField";

afterEach(cleanup);
describe("owned field proof", () => {
  it("associates label, description and errors with the input and forwards its ref", () => {
    const ref = createRef<HTMLInputElement>();
    render(<TextField ref={ref} label="Course" description="A public name" invalid errorMessage="Name already used" />);
    const input = screen.getByRole("textbox", { name: "Course" });
    expect(ref.current).toBe(input);
    expect(input.getAttribute("aria-invalid")).toBe("true");
    const descriptions = input.getAttribute("aria-describedby")!.split(" ").map(id => document.getElementById(id)?.textContent).join(" ");
    expect(descriptions).toContain("A public name");
    expect(descriptions).toContain("Name already used");
  });
  it("supports string callbacks, uncontrolled values and native form serialization", async () => {
    const change = vi.fn();
    const user = userEvent.setup();
    render(<form data-testid="form"><TextField label="Course" name="course" defaultValue="A" onValueChange={change} /></form>);
    await user.type(screen.getByRole("textbox"), "B");
    expect(change).toHaveBeenLastCalledWith("AB");
    expect(new FormData(screen.getByTestId("form") as HTMLFormElement).get("course")).toBe("AB");
  });
  it("keeps controlled values authoritative and supports read-only, disabled and required state", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const { rerender } = render(<TextField aria-label="Course" value="Fixed" onValueChange={change} />);
    await user.type(screen.getByRole("textbox"), "A");
    expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("Fixed");
    rerender(<TextField aria-label="Course" value="Fixed" readOnly onValueChange={change} />);
    change.mockClear();
    await user.type(screen.getByRole("textbox"), "B");
    expect(change).not.toHaveBeenCalled();
    rerender(<TextField aria-label="Course" disabled required />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(input.required).toBe(true);
  });
  it("resets uncontrolled input and displayed native validation with a reset button", async () => {
    const user = userEvent.setup();
    render(<form onSubmit={event => event.preventDefault()}>
      <TextField label="Course" name="course" defaultValue="Initial" required />
      <button type="submit">Save</button><button type="reset">Reset</button>
    </form>);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    await user.clear(input);
    await user.click(screen.getByText("Save"));
    await waitFor(() => expect(input.getAttribute("aria-invalid")).toBe("true"));
    await user.click(screen.getByText("Reset"));
    await waitFor(() => expect(input.value).toBe("Initial"));
    expect(input.getAttribute("aria-invalid")).not.toBe("true");
  });
});
