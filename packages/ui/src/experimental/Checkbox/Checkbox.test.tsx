// @vitest-environment jsdom
import { createRef, useState } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "./Checkbox";
afterEach(cleanup);
it("toggles by Space, submits checked values and restores native defaults on reset", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<form data-testid="form"><Checkbox label="Available" name="available" value="yes" onCheckedChange={change} /><button type="reset">Reset</button></form>);
  await user.tab(); await user.keyboard(" "); expect(change).toHaveBeenCalledExactlyOnceWith(true);
  const form = screen.getByTestId("form") as HTMLFormElement;
  expect(new FormData(form).get("available")).toBe("yes");
  await user.click(screen.getByRole("button")); expect(new FormData(form).has("available")).toBe(false);
  expect(change).toHaveBeenCalledExactlyOnceWith(true);
});
it("exposes mixed state and leaves controlled state with the host", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<Checkbox label="All rows" checked={false} mixed onCheckedChange={change} />);
  const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
  expect(checkbox.indeterminate).toBe(true);
  await user.click(checkbox); expect(change).toHaveBeenCalledExactlyOnceWith(true); expect(checkbox.checked).toBe(false); expect(checkbox.indeterminate).toBe(true);
});
it("prevents disabled and read-only edits", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const { rerender } = render(<Checkbox label="Available" disabled onCheckedChange={change} />);
  await user.click(screen.getByRole("checkbox")); expect(change).not.toHaveBeenCalled();
  rerender(<Checkbox label="Available" readOnly onCheckedChange={change} />);
  await user.click(screen.getByRole("checkbox")); expect(change).not.toHaveBeenCalled();
});
it("associates its description and validation error without changing its name", async () => {
  const user = userEvent.setup();
  render(<form onSubmit={event => event.preventDefault()}>
    <Checkbox label="Accept terms" name="terms" required description="Required to register" errorMessage="Accept before submitting" />
    <button type="submit">Submit</button><button type="reset">Reset</button>
  </form>);
  const checkbox = screen.getByRole("checkbox", { name: "Accept terms" }) as HTMLInputElement;
  const description = () => (checkbox.getAttribute("aria-describedby") ?? "").split(/\s+/).map(id => document.getElementById(id)?.textContent).join(" ");
  expect(checkbox.required).toBe(true);
  expect(description()).toContain("Required to register");
  await user.click(screen.getByText("Submit"));
  expect(checkbox.getAttribute("aria-invalid")).toBe("true");
  expect(description()).toContain("Accept before submitting");
  await user.click(screen.getByText("Reset"));
  expect(checkbox.getAttribute("aria-invalid")).not.toBe("true");
  expect(description()).not.toContain("Accept before submitting");
});
it("omits disabled checked values and serializes mixed state by checked value", () => {
  const { container } = render(<form>
    <Checkbox label="Mixed checked" name="mixedChecked" value="yes" mixed defaultChecked />
    <Checkbox label="Mixed unchecked" name="mixedUnchecked" mixed />
    <Checkbox label="Disabled" name="disabled" defaultChecked disabled />
  </form>);
  const values = new FormData(container.querySelector("form")!);
  expect(values.get("mixedChecked")).toBe("yes");
  expect(values.has("mixedUnchecked")).toBe(false);
  expect(values.has("disabled")).toBe(false);
});

it("honors disabled fieldset inheritance for label requests and required validation", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const { rerender } = render(<form data-testid="fieldset-form"><fieldset disabled>
    <Checkbox label="Required approval" name="approval" required mixed onCheckedChange={change} />
  </fieldset></form>);
  const form = screen.getByTestId("fieldset-form") as HTMLFormElement;
  const input = screen.getByRole("checkbox") as HTMLInputElement;
  await user.click(screen.getByText("Required approval"));
  expect(change).not.toHaveBeenCalled();
  expect(input.checked).toBe(false);
  expect(form.checkValidity()).toBe(true);
  expect(new FormData(form).has("approval")).toBe(false);
  rerender(<form data-testid="fieldset-form"><fieldset>
    <Checkbox label="Required approval" name="approval" required mixed onCheckedChange={change} />
  </fieldset></form>);
  expect(form.checkValidity()).toBe(false);
  await user.click(screen.getByText("Required approval"));
  expect(change).toHaveBeenCalledExactlyOnceWith(true);
  expect(form.checkValidity()).toBe(true);
  expect(new FormData(form).get("approval")).toBe("on");
});
it("forwards the label ref while the nested native input owns form validation", () => {
  const ref = createRef<HTMLLabelElement>();
  render(<Checkbox ref={ref} label="Approval" required />);
  expect(ref.current?.tagName).toBe("LABEL");
  expect(ref.current?.control).toBe(screen.getByRole("checkbox"));
  expect(ref.current?.control).toBeInstanceOf(HTMLInputElement);
});

it("keeps prevented native reset silent and preserves edited uncontrolled state", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<form onReset={event => event.preventDefault()}>
    <Checkbox label="Prevented approval" name="approval" onCheckedChange={change} />
    <button type="reset">Reset</button>
  </form>);
  await user.click(screen.getByText("Prevented approval"));
  expect(change).toHaveBeenCalledExactlyOnceWith(true);
  change.mockClear();
  await user.click(screen.getByText("Reset"));
  await new Promise(resolve => setTimeout(resolve, 20));
  expect(change).not.toHaveBeenCalled();
  expect((screen.getByRole("checkbox") as HTMLInputElement).checked).toBe(true);
});
it("leaves controlled reset policy to delegated host onReset without value requests", async () => {
  const user = userEvent.setup(); const events: string[] = [];
  function Host() {
    const [checked, setChecked] = useState(false);
    return <form onReset={event => { events.push("reset"); event.preventDefault(); }}>
      <Checkbox label="Controlled reset policy" checked={checked} onCheckedChange={value => {
        events.push(`change:${value}`); setChecked(value);
      }} /><button type="reset">Reset</button>
    </form>;
  }
  render(<Host />);
  await user.click(screen.getByText("Controlled reset policy"));
  expect(events).toEqual(["change:true"]);
  events.length = 0;
  await user.click(screen.getByText("Reset"));
  await new Promise(resolve => setTimeout(resolve, 20));
  expect(events).toEqual(["reset"]);
  expect((screen.getByRole("checkbox") as HTMLInputElement).checked).toBe(true);
});

it("keeps accepted controlled reset silent unless the host restores its draft", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const { rerender } = render(<form><Checkbox label="Host approval" checked defaultChecked={false} onCheckedChange={change} /><button type="reset">Reset</button></form>);
  await user.click(screen.getByText("Reset"));
  await new Promise(resolve => setTimeout(resolve, 20));
  expect(change).not.toHaveBeenCalled();
  expect((screen.getByRole("checkbox") as HTMLInputElement).checked).toBe(true);
  rerender(<form><Checkbox label="Host approval" checked={false} onCheckedChange={change} /><button type="reset">Reset</button></form>);
  expect((screen.getByRole("checkbox") as HTMLInputElement).checked).toBe(false);
});
it("restores latest uncontrolled defaults on accepted reset without edit callbacks", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const { rerender } = render(<form><Checkbox label="Latest approval" defaultChecked={false} onCheckedChange={change} /><button type="reset">Reset</button></form>);
  rerender(<form><Checkbox label="Latest approval" defaultChecked onCheckedChange={change} /><button type="reset">Reset</button></form>);
  await user.click(screen.getByText("Reset"));
  await new Promise(resolve => setTimeout(resolve, 20));
  expect(change).not.toHaveBeenCalled();
  expect((screen.getByRole("checkbox") as HTMLInputElement).checked).toBe(true);
});

it("rejects label press requests inherited from a disabled fieldset but permits its first legend", () => {
  const disabledChange = vi.fn(); const legendChange = vi.fn();
  render(<form><fieldset disabled>
    <legend><Checkbox label="Legend exemption" onCheckedChange={legendChange} /></legend>
    <Checkbox label="Inherited disabled approval" name="disabled" onCheckedChange={disabledChange} />
  </fieldset></form>);
  // user-event skips the disabled ancestor before dispatch. Exercise the label
  // press handler directly here; the separate browser regression uses physical mouse.
  function press(label: string) {
    const target = screen.getByText(label);
    fireEvent.mouseDown(target, { button: 0, detail: 1 });
    fireEvent.mouseUp(target, { button: 0, detail: 1 });
    fireEvent.click(target, { button: 0, detail: 1 });
  }
  press("Inherited disabled approval");
  expect(disabledChange).not.toHaveBeenCalled();
  expect((screen.getByRole("checkbox", { name: "Inherited disabled approval" }) as HTMLInputElement).checked).toBe(false);
  press("Legend exemption");
  expect(legendChange).toHaveBeenCalledExactlyOnceWith(true);
  expect((screen.getByRole("checkbox", { name: "Legend exemption" }) as HTMLInputElement).checked).toBe(true);
});
