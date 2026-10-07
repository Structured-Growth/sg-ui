// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
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

it("honors delegated reset prevention and restores uncontrolled defaults without callbacks", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  let prevent = true;
  render(<div onReset={event => { if (prevent) event.preventDefault(); }}><form data-testid="reset-form">
    <TextField label="Reset field" name="field" defaultValue="Initial" onValueChange={change} />
    <button type="reset">Reset field</button>
  </form></div>);
  await user.clear(screen.getByRole("textbox")); await user.type(screen.getByRole("textbox"), "Changed");
  const form = screen.getByTestId("reset-form") as HTMLFormElement;
  change.mockClear();
  await user.click(screen.getByRole("button", { name: "Reset field" }));
  expect(new FormData(form).get("field")).toBe("Changed");
  expect(change).not.toHaveBeenCalled();
  prevent = false;
  await user.click(screen.getByRole("button", { name: "Reset field" }));
  await waitFor(() => expect(new FormData(form).get("field")).toBe("Initial"));
  expect(change).not.toHaveBeenCalled();
});
it("keeps controlled reset values authoritative without edit callbacks", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<form data-testid="controlled-reset-form"><TextField label="Reset field" name="field"
    value="Changed" defaultValue="Initial" onValueChange={change} /><button type="reset">Reset field</button></form>);
  await user.click(screen.getByRole("button", { name: "Reset field" }));
  expect(new FormData(screen.getByTestId("controlled-reset-form") as HTMLFormElement).get("field")).toBe("Changed");
  expect(change).not.toHaveBeenCalled();
});

it("resets an externally associated input programmatically with the current default", async () => {
  const user = userEvent.setup(); const change = vi.fn(); const ref = createRef<HTMLInputElement>();
  const { rerender } = render(<><form id="external-reset" data-testid="external-form" /><TextField ref={ref} label="External" form="external-reset" name="field" defaultValue="First" onValueChange={change} /></>);
  await user.type(screen.getByRole("textbox"), " edit");
  rerender(<><form id="external-reset" data-testid="external-form" /><TextField ref={ref} label="External" form="external-reset" name="field" defaultValue="Latest" onValueChange={change} /></>);
  change.mockClear();
  act(() => (screen.getByTestId("external-form") as HTMLFormElement).reset());
  await waitFor(() => expect(ref.current?.value).toBe("Latest"));
  expect(change).not.toHaveBeenCalled();
});

it("preserves displayed validation when delegated reset is prevented", async () => {
  const user = userEvent.setup();
  render(<div onReset={event => event.preventDefault()}><form onSubmit={event => event.preventDefault()}>
    <TextField label="Required course" required defaultValue="Initial" />
    <button type="submit">Validate</button><button type="reset">Prevented reset</button>
  </form></div>);
  const input = screen.getByRole("textbox");
  await user.clear(input); await user.click(screen.getByRole("button", { name: "Validate" }));
  await waitFor(() => expect(input.getAttribute("aria-invalid")).toBe("true"));
  await user.click(screen.getByRole("button", { name: "Prevented reset" }));
  expect(input.getAttribute("aria-invalid")).toBe("true");
});
