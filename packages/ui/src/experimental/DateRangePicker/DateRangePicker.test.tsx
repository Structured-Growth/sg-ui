// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DateRangePicker } from "./DateRangePicker";
afterEach(cleanup);
const initial = { start: "2024-02-01", end: "2024-02-29" };
const preset = { id: "march", label: "March", value: { start: "2024-03-01", end: "2024-03-31" } };
it("cancels drafts, applies once, returns focus and resets native defaults", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<form data-testid="form"><DateRangePicker label="Reporting" name="range" defaultValue={initial} presets={[preset]} onValueChange={change} /><button type="reset">Reset</button></form>);
  const trigger = screen.getByRole("button", { name: "Choose Reporting" });
  await user.click(trigger); await user.click(screen.getByRole("option", { name: "March" })); await user.click(screen.getByRole("button", { name: "Cancel" }));
  expect(change).not.toHaveBeenCalled(); await waitFor(() => expect(document.activeElement).toBe(trigger));
  await user.click(trigger); expect(screen.getByRole("status").textContent).toContain(initial.start);
  await user.click(screen.getByRole("option", { name: "March" })); await user.click(screen.getByRole("button", { name: "Apply" }));
  expect(change).toHaveBeenCalledExactlyOnceWith(preset.value);
  const form = screen.getByTestId("form") as HTMLFormElement;
  expect(new FormData(form).get("range.start")).toBe(preset.value.start);
  await user.click(screen.getByRole("button", { name: "Reset" })); expect(new FormData(form).get("range.start")).toBe(initial.start);
});
it("respects a host-prevented reset of uncontrolled committed state", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<form data-testid="form" onReset={event => event.preventDefault()}><DateRangePicker label="Reporting" defaultValue={initial} presets={[preset]} name="range" onValueChange={change} /><button type="reset">Reset</button></form>);
  await user.click(screen.getByRole("button", { name: "Choose Reporting" })); await user.click(screen.getByRole("option", { name: "March" })); await user.click(screen.getByRole("button", { name: "Apply" }));
  expect(change).toHaveBeenCalledExactlyOnceWith(preset.value);
  await user.click(screen.getByRole("button", { name: "Reset" }));
  expect(new FormData(screen.getByTestId("form") as HTMLFormElement).get("range.start")).toBe(preset.value.start);
});
it("keeps host-owned outside focus after an accepted reset closes a focused calendar", async () => {
  const user = userEvent.setup();
  render(<form data-testid="form">
    <DateRangePicker label="Reporting" defaultValue={initial} presets={[preset]} />
    <button type="button">Outside action</button>
  </form>);
  const outside = screen.getByRole("button", {name:"Outside action"});
  await user.click(screen.getByRole("button", {name:"Choose Reporting"}));
  await user.click(screen.getByRole("option", {name:"March"}));
  act(() => (screen.getByTestId("form") as HTMLFormElement).reset());
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  act(() => outside.focus());
  await act(async () => { await new Promise<void>(resolve => requestAnimationFrame(() => resolve())); });
  expect(document.activeElement).toBe(outside);
});

it("normalizes range text and complete relative periods, preserving invalid drafts and native values", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<form data-testid="form"><DateRangePicker label="Reporting" name="range" defaultValue={initial} referenceDate="2026-10-16" onValueChange={change} /><button type="reset">Reset</button></form>);
  const input = screen.getByRole("textbox", { name: "Reporting" }) as HTMLInputElement;
  await user.clear(input); await user.type(input, "1/1/2026 - 1/3/26{Enter}");
  expect(input.value).toBe("01/01/2026 – 01/03/2026");
  expect(change).toHaveBeenLastCalledWith({start:"2026-01-01",end:"2026-01-03"});
  await user.clear(input); await user.type(input, "last week"); await user.tab();
  expect(input.value).toBe("10/05/2026 – 10/11/2026");
  const form = screen.getByTestId("form") as HTMLFormElement;
  expect(new FormData(form).get("range.start")).toBe("2026-10-05");
  const count=change.mock.calls.length;
  await user.clear(input); await user.type(input,"1/3/26 - 1/1/26{Enter}");
  expect(input.validity.valid).toBe(false); expect(input.value).toBe("1/3/26 - 1/1/26"); expect(change).toHaveBeenCalledTimes(count);
  expect(new FormData(form).get("range.start")).toBe("2026-10-05");
  await user.click(screen.getByRole("button",{name:"Reset"}));
  await waitFor(()=>expect(input.value).toBe("02/01/2024 – 02/29/2024"));
});
it("enforces full-range availability and controlled authority, and permits clearing optional input", async () => {
  const user=userEvent.setup(),change=vi.fn();
  const {rerender}=render(<DateRangePicker label="Range" value={initial} onValueChange={change} min="2024-02-01" max="2024-02-29" unavailable={[{date:"2024-02-15",reason:"Closed"}]}/>);
  const input=screen.getByRole("textbox",{name:"Range"}) as HTMLInputElement;
  await user.clear(input);await user.type(input,"2/14/24 - 2/16/24{Enter}");expect(input.validity.valid).toBe(false);expect(change).not.toHaveBeenCalled();
  await user.clear(input);await user.type(input,"2/1/24 - 2/3/24{Enter}");expect(change).toHaveBeenLastCalledWith({start:"2024-02-01",end:"2024-02-03"});
  expect(input.value).toBe("02/01/2024 – 02/29/2024");
  rerender(<DateRangePicker label="Range" value={{start:"2024-02-01",end:"2024-02-03"}} onValueChange={change}/>);
  expect(input.value).toBe("02/01/2024 – 02/03/2024");
  await user.clear(input);await user.tab();expect(change).toHaveBeenLastCalledWith(null);
});
it("hides repeated endpoint fields by default and enables freehand endpoint editing explicitly", async () => {
  const user=userEvent.setup(),change=vi.fn();
  const {rerender}=render(<DateRangePicker label="Trip" defaultValue={initial} onValueChange={change}/>);
  await user.click(screen.getByRole('button',{name:'Choose Trip'}));
  expect(screen.queryByRole('textbox',{name:'Start date',exact:true})).toBeNull();
  rerender(<DateRangePicker label="Trip" defaultValue={initial} showFields onValueChange={change}/>);
  const start=screen.getByRole('textbox',{name:'Start date',exact:true});
  expect(screen.queryByRole('spinbutton')).toBeNull();
  await user.clear(start);await user.type(start,'2/3/24');await user.tab();
  expect((start as HTMLInputElement).value).toBe('02/03/2024');
  await user.click(screen.getByRole('button',{name:'Apply',exact:true}));
  expect(change).toHaveBeenCalledExactlyOnceWith({start:'2024-02-03',end:'2024-02-29'});
});

it("keeps default fields clean and associates only explicit descriptions or errors", async () => {
 const user=userEvent.setup();const {rerender}=render(<DateRangePicker label="Range" referenceDate="2026-10-16"/>);
 const input=screen.getByRole("textbox",{name:"Range"});expect(input.getAttribute("aria-describedby")).toBeNull();expect(screen.queryByText(/Weeks start|Enter two dates|reference date/)).toBeNull();
 rerender(<DateRangePicker label="Range" referenceDate="2026-10-16" description="Choose a reporting period."/>);
 const descriptionId=input.getAttribute("aria-describedby")!;expect(document.getElementById(descriptionId)?.textContent).toBe("Choose a reporting period.");
 rerender(<DateRangePicker label="Range" referenceDate="2026-10-16"/>);await user.type(input,"invalid{Enter}");
 expect(input.getAttribute("aria-invalid")).toBe("true");const errorId=input.getAttribute("aria-describedby")!;expect(document.getElementById(errorId)?.textContent).toContain("Enter a valid date range");
});
