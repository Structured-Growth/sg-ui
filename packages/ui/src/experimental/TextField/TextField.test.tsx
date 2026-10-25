// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { TextField } from "./TextField";

afterEach(cleanup);
describe("owned field proof", () => {
  it.each([["above","above"],["above","below"],["below","above"],["below","below"]] as const)("associates description %s and error %s with the input and forwards its ref", (descriptionPlacement,errorPlacement) => {
    const ref = createRef<HTMLInputElement>();
    render(<TextField ref={ref} label="Course" description="A public name" descriptionPlacement={descriptionPlacement} errorPlacement={errorPlacement} invalid errorMessage="Name already used" />);
    const input = screen.getByRole("textbox", { name: "Course" });
    expect(ref.current).toBe(input);
    expect(input.getAttribute("aria-invalid")).toBe("true");
    const descriptions = input.getAttribute("aria-describedby")!.split(" ").map(id => document.getElementById(id)?.textContent).join(" ");
    expect(descriptions).toContain("A public name");
    expect(descriptions).toContain("Name already used");
    const label = screen.getByText("Course"), description = screen.getByText("A public name"), error = screen.getByText("Name already used");
    expect(label.compareDocumentPosition(description) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(description.compareDocumentPosition(input) & (descriptionPlacement === "above" ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)).toBeTruthy();
    expect(input.compareDocumentPosition(error) & (errorPlacement === "below" ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)).toBeTruthy();
  });
  it("defaults to placing the description between the label and decorated input", () => {
    render(<TextField label="Course" description="A public name" invalid errorMessage="Name already used" startIcon={<span>Icon</span>} />);
    const input = screen.getByRole("textbox", {name:"Course"});
    expect(screen.getByText("A public name").compareDocumentPosition(input) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(input.compareDocumentPosition(screen.getByText("Name already used")) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
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

it("moves reset ownership from form A to B without stale resets or callbacks", async () => {
  const user = userEvent.setup(); const change = vi.fn(); const ref = createRef<HTMLInputElement>();
  let prevent = false;
  const field = (form: string) => <div onReset={event => { if (prevent) event.preventDefault(); }}><form id="form-a" data-testid="form-a"><button type="reset">Reset A</button></form>
    <form id="form-b" data-testid="form-b"><button type="reset">Reset B</button></form>
    <TextField ref={ref} label="Reassociated" form={form} name="field" defaultValue="Initial" onValueChange={change} /></div>;
  const { rerender } = render(field("form-a"));
  const input = screen.getByRole("textbox") as HTMLInputElement;
  await user.clear(input); await user.type(input, "Edited");
  rerender(field("form-b"));
  expect(ref.current).toBe(input); expect(input.form?.id).toBe("form-b");
  change.mockClear();
  await user.click(screen.getByRole("button", { name: "Reset A" }));
  expect(input.value).toBe("Edited"); expect(change).not.toHaveBeenCalled();
  prevent = true;
  await user.click(screen.getByRole("button", { name: "Reset B" }));
  expect(input.value).toBe("Edited"); expect(change).not.toHaveBeenCalled();
  prevent = false;
  await user.click(screen.getByRole("button", { name: "Reset B" }));
  await waitFor(() => expect(input.value).toBe("Initial")); expect(change).not.toHaveBeenCalled();
});
it("cancels the old form's pending reset when the input is reassociated", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const field = (form: string) => <><form id="pending-a" data-testid="pending-a" /><form id="pending-b" />
    <TextField label="Pending association" form={form} defaultValue="Initial" onValueChange={change} /></>;
  const { rerender } = render(field("pending-a")); const input = screen.getByRole("textbox") as HTMLInputElement;
  await user.type(input, " edit"); change.mockClear();
  act(() => { (screen.getByTestId("pending-a") as HTMLFormElement).reset(); rerender(field("pending-b")); });
  await act(async () => { await new Promise(resolve => setTimeout(resolve, 10)); });
  expect(input.value).toBe("Initial edit"); expect(change).not.toHaveBeenCalled();
});

it("keeps reassociated controlled values and native edit callbacks host-owned", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const field = (form: string) => <><form id="controlled-a"><button type="reset">Controlled A</button></form>
    <form id="controlled-b"><button type="reset">Controlled B</button></form>
    <TextField label="Controlled reassociation" form={form} value="Host" defaultValue="Default" onValueChange={change} /></>;
  const { rerender } = render(field("controlled-a")); const input = screen.getByRole("textbox") as HTMLInputElement;
  rerender(field("controlled-b"));
  await user.click(screen.getByRole("button", { name: "Controlled A" }));
  await user.click(screen.getByRole("button", { name: "Controlled B" }));
  expect(input.value).toBe("Host"); expect(change).not.toHaveBeenCalled();
  await user.type(input, "X"); expect(change).toHaveBeenLastCalledWith("HostX"); expect(input.value).toBe("Host");
});

it("keeps placeholder, native edits and reset with decorative icons outside the accessible name", async () => {
 const user=userEvent.setup(),change=vi.fn();
 render(<form data-testid="icons"><TextField label="Search courses" placeholder="Find a course" name="query" startIcon={<svg role="img" aria-label="Leading decoration"/>} endIcon={<svg role="img" aria-label="Trailing decoration"/>} onValueChange={change}/><button type="reset">Reset</button></form>);
 const input=screen.getByRole("textbox",{name:"Search courses"}) as HTMLInputElement;
 expect(input.placeholder).toBe("Find a course");expect(screen.queryByRole("img")).toBeNull();
 await user.type(input,"Design");expect(change).toHaveBeenLastCalledWith("Design");
 expect(new FormData(screen.getByTestId("icons") as HTMLFormElement).get("query")).toBe("Design");
 await user.tab();expect(document.activeElement).toBe(screen.getByRole("button",{name:"Reset"}));
 await user.click(screen.getByRole("button",{name:"Reset"}));await waitFor(()=>expect(input.value).toBe(""));
});

it("keeps fixed currency affixes outside edits, accessible naming, native data and reset",async()=>{
 const user=userEvent.setup(),change=vi.fn();
 render(<form data-testid="affixes"><TextField label="Amount in whole US dollars" name="amount" prefix="$" suffix=".00" affixAppearance="subtle" inputMode="numeric" pattern="[0-9]+" description="Enter whole dollars, without cents." defaultValue="25" onValueChange={change}/><button type="reset">Reset amount</button></form>);
 const input=screen.getByRole('textbox',{name:'Amount in whole US dollars'}) as HTMLInputElement;
 expect(input.value).toBe('25');expect(input.inputMode).toBe('numeric');
 expect(screen.getByText('$').getAttribute('aria-hidden')).toBe('true');
 expect(screen.getByText('.00').getAttribute('aria-hidden')).toBe('true');
 await user.type(input,'0');expect(change).toHaveBeenLastCalledWith('250');
 expect(new FormData(screen.getByTestId('affixes') as HTMLFormElement).get('amount')).toBe('250');
 await user.tab();expect(document.activeElement).toBe(screen.getByRole('button'));
 change.mockClear();await user.click(screen.getByRole('button'));
 await waitFor(()=>expect(input.value).toBe('25'));expect(change).not.toHaveBeenCalled();
});
it("accepts icon affixes and zero text while preserving controlled values and blocked states",async()=>{
 const user=userEvent.setup(),change=vi.fn();
 const {rerender}=render(<TextField label="Distance in km" prefix={<svg role="img" aria-label="Location"/>} suffix="km" value="40" onValueChange={change} invalid errorMessage="Review the distance"/>);
 const input=screen.getByRole('textbox',{name:'Distance in km'}) as HTMLInputElement;
 expect(screen.queryByRole('img')).toBeNull();
 expect(input.getAttribute('aria-invalid')).toBe('true');
 expect(document.getElementById(input.getAttribute('aria-describedby')!)?.textContent).toContain('Review the distance');
 await user.type(input,'5');expect(change).toHaveBeenLastCalledWith('405');expect(input.value).toBe('40');change.mockClear();
 rerender(<TextField label="Distance in km" prefix={0} suffix="km" value="40" onValueChange={change} readOnly/>);
 expect(screen.getByText('0').getAttribute('aria-hidden')).toBe('true');
 await user.type(input,'1');expect(change).not.toHaveBeenCalled();
 rerender(<TextField label="Distance in km" prefix="$" suffix=".00" value="40" onValueChange={change} disabled/>);
 await user.click(input);expect(change).not.toHaveBeenCalled();expect(input.disabled).toBe(true);
});
