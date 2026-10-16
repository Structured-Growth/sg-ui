// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StrictMode, useRef, useState } from "react";
import { useFormReset } from "../useFormReset";
import { DatePicker } from "./DatePicker";
afterEach(cleanup);
it("selects and clears the date, restores trigger focus and silently resets the native default", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<form data-testid="form"><DatePicker label="Course date" defaultValue="2024-02-28" name="date" onValueChange={change} /><button type="reset">Reset</button></form>);
  const trigger = screen.getByRole("button", { name: "Choose Course date" });
  await user.click(trigger); await user.click(screen.getByRole("button", { name: "Thursday, February 29, 2024" }));
  expect(change).toHaveBeenCalledExactlyOnceWith("2024-02-29"); expect(screen.queryByRole("dialog")).toBeNull();
  await waitFor(() => expect(document.activeElement).toBe(trigger));
  const form = screen.getByTestId("form") as HTMLFormElement;
  expect(new FormData(form).get("date")).toBe("2024-02-29");
  change.mockClear();
  await user.click(trigger); await user.click(screen.getByRole("button", { name: "Clear" }));
  expect(change).toHaveBeenCalledExactlyOnceWith(null);
  expect(new FormData(form).get("date")).toBe(""); expect(screen.queryByRole("dialog")).toBeNull();
  await waitFor(() => expect(document.activeElement).toBe(trigger));
  await user.click(screen.getByRole("button", { name: "Reset" })); expect(new FormData(form).get("date")).toBe("2024-02-28");
  expect(change).toHaveBeenCalledExactlyOnceWith(null);
});
it("preserves controlled authority on Clear and guards empty, required and read-only dates", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const { rerender } = render(<DatePicker label="Course date" name="date" value="2024-02-28" onValueChange={change} />);
  await user.click(screen.getByRole("button", { name: "Choose Course date" })); await user.keyboard("{Escape}"); expect(change).not.toHaveBeenCalled();
  const trigger = screen.getByRole("button", { name: "Choose Course date" });
  await user.click(trigger); await user.click(screen.getByRole("button", { name: "Clear" }));
  expect(change).toHaveBeenCalledExactlyOnceWith(null); expect(screen.queryByRole("dialog")).toBeNull();
  await waitFor(() => expect(document.activeElement).toBe(trigger));
  expect((document.querySelector('input[name="date"]') as HTMLInputElement).value).toBe("2024-02-28");
  rerender(<DatePicker label="Course date" value={null} onValueChange={change} />);
  await user.click(trigger); expect(screen.queryByRole("button", { name: "Clear" })).toBeNull(); await user.keyboard("{Escape}");
  rerender(<DatePicker label="Course date" value="2024-02-28" required onValueChange={change} />);
  await user.click(trigger); expect(screen.queryByRole("button", { name: "Clear" })).toBeNull(); await user.keyboard("{Escape}");
  rerender(<DatePicker label="Course date" value="2024-02-28" readOnly />);
  expect((screen.getByRole("button", { name: "Choose Course date" }) as HTMLButtonElement).disabled).toBe(true);
  rerender(<DatePicker label="Course date" value="2024-02-28" disabled />);
  expect((screen.getByRole("button", { name: "Choose Course date" }) as HTMLButtonElement).disabled).toBe(true);
});

for (const controlled of [false, true]) {
  it(`keeps ${controlled ? "controlled" : "uncontrolled"} dates on prevented reset and resets silently`, async () => {
    const user = userEvent.setup(); const change = vi.fn();
    const props = { label: "Course date", name: "date", defaultValue: "2024-02-28", onValueChange: change };
    const { rerender } = render(<StrictMode><form data-testid="reset-form" onReset={event => event.preventDefault()}>
      <DatePicker {...props} value={controlled ? "2024-02-29" : undefined} />
    </form></StrictMode>);
    const form = screen.getByTestId("reset-form") as HTMLFormElement;
    const trigger = screen.getByRole("button", { name: "Choose Course date" });
    if (!controlled) {
      await user.click(trigger); await user.click(screen.getByRole("button", { name: "Thursday, February 29, 2024" }));
    }
    change.mockClear(); await user.click(trigger);
    await act(async () => { form.reset(); await new Promise(resolve => setTimeout(resolve, 10)); });
    expect(new FormData(form).get("date")).toBe("2024-02-29");
    expect(screen.getByRole("dialog")).toBeTruthy(); expect(change).not.toHaveBeenCalled();
    rerender(<StrictMode><form data-testid="reset-form"><DatePicker {...props}
      defaultValue="2024-03-01" value={controlled ? "2024-02-29" : undefined} /></form></StrictMode>);
    await act(async () => { form.reset(); await new Promise(resolve => setTimeout(resolve, 10)); });
    expect(new FormData(form).get("date")).toBe(controlled ? "2024-02-29" : "2024-03-01");
    expect(screen.queryByRole("dialog")).toBeNull(); expect(change).not.toHaveBeenCalled();
  });
}

it("cancels pending resets on unmount and keeps one StrictMode listener with the latest callback", async () => {
  vi.useFakeTimers();
  const first = vi.fn(); const latest = vi.fn();
  function Probe({ reset }: { reset: () => void }) {
    const ref = useRef<HTMLDivElement>(null); useFormReset(ref, reset);
    return <div ref={ref} />;
  }
  try {
    const { rerender, unmount } = render(<StrictMode><form data-testid="probe"><Probe reset={first} /></form></StrictMode>);
    const form = screen.getByTestId("probe") as HTMLFormElement;
    act(() => form.reset());
    rerender(<StrictMode><form data-testid="probe"><Probe reset={latest} /></form></StrictMode>);
    act(() => vi.runAllTimers());
    expect(first).not.toHaveBeenCalled(); expect(latest).toHaveBeenCalledOnce();
    act(() => { form.reset(); form.reset(); }); unmount();
    act(() => vi.runAllTimers()); expect(latest).toHaveBeenCalledOnce();
    act(() => form.reset()); act(() => vi.runAllTimers()); expect(latest).toHaveBeenCalledOnce();
  } finally { vi.useRealTimers(); }
});

it("keeps the popup named without duplicate titles and can display one optional title", async () => {
  const user = userEvent.setup();
  const {rerender} = render(<DatePicker label="Course date" defaultValue="2026-10-14"/>);
  await user.click(screen.getByRole("button", {name:"Choose Course date"}));
  expect(screen.getByRole("dialog", {name:"Course date"})).toBeTruthy();
  expect(screen.queryByRole("heading", {name:"Course date"})).toBeNull();
  expect(screen.getByText("October 2026", {exact:true})).toBeTruthy();
  await user.keyboard("{Escape}");
  rerender(<DatePicker label="Course date" defaultValue="2026-10-14" showTitle/>);
  await user.click(screen.getByRole("button", {name:"Choose Course date"}));
  expect(screen.getByRole("dialog", {name:"Course date"})).toBeTruthy();
  expect(screen.getAllByRole("heading", {name:"Course date"})).toHaveLength(1);
});

it("commits date and time together, discards Cancel and enforces boundary times", async () => {
 const user=userEvent.setup(),change=vi.fn();
 render(<form data-testid="appointment"><DatePicker label="Appointment" kind="datetime" hourCycle={24} defaultValue="2026-10-14T09:30:00"
  min="2026-10-14T08:00:00" max="2026-10-15T18:00:00" name="appointment" onValueChange={change}/></form>);
 const trigger=screen.getByRole("button",{name:"Choose Appointment"});
 await user.click(trigger);
 await user.click(screen.getByRole("button",{name:/Thursday, October 15, 2026/}));
 expect(change).not.toHaveBeenCalled();
 await user.click(screen.getByRole("button",{name:"Cancel",exact:true}));
 expect(change).not.toHaveBeenCalled();
 await user.click(trigger);
 await user.click(screen.getByRole("button",{name:/Thursday, October 15, 2026/}));
 await user.click(screen.getByRole("button",{name:"Apply",exact:true}));
 expect(change).toHaveBeenCalledExactlyOnceWith("2026-10-15T09:30:00");
 expect(new FormData(screen.getByTestId("appointment") as HTMLFormElement).get("appointment")).toBe("2026-10-15T09:30:00");
 await user.click(trigger);
 const dialog=screen.getByRole("dialog");
 const time=screen.getByRole("textbox",{name:"Time",exact:true});
 await user.clear(time);await user.type(time,"19:00");
 expect((screen.getByRole("button",{name:"Apply",exact:true}) as HTMLButtonElement).disabled).toBe(true);
});

it("defaults to flexible date entry without an entryMode prop",async()=>{
 const user=userEvent.setup(),change=vi.fn();
 render(<DatePicker label="Appointment date" defaultValue="2026-10-14" onValueChange={change}/>);
 const input=screen.getByRole("textbox",{name:"Appointment date"}) as HTMLInputElement;
 await user.clear(input);await user.type(input,"1/1/26{Enter}");
 expect(input.value).toBe("01/01/2026");expect(change).toHaveBeenCalledExactlyOnceWith("2026-01-01");
 await user.click(screen.getByRole("button",{name:"Choose Appointment date"}));
 expect(screen.getByRole("button",{name:/Thursday, January 1, 2026 selected/})).toBeTruthy();
});

for (const policy of ["callback", "array"] as const) {
 it(`rejects ${policy} unavailable text before native submit, retaining draft feedback and accepted data`, async () => {
  const user = userEvent.setup(), change = vi.fn(), validity = vi.fn(), submit = vi.fn();
  const availability = policy === "array" ? { unavailable: [{ date: "2026-10-16", reason: "No appointment capacity" }] }
   : { getDateUnavailableReason: (date: string) => date === "2026-10-16" ? "No appointment capacity" : undefined };
  render(<form data-testid="availability-form" onSubmit={event => { event.preventDefault(); submit(); }}>
   <DatePicker label="Appointment" name="appointment" defaultValue="2026-10-14" onValueChange={change} onValidityChange={validity} {...availability}/>
   <button type="submit">Book</button>
  </form>);
  const input = screen.getByRole("textbox", { name: "Appointment" }) as HTMLInputElement;
  const form = screen.getByTestId("availability-form") as HTMLFormElement;
  await user.clear(input); await user.type(input, "10/16/2026");
  expect(input.validity.valid).toBe(false); expect(validity).toHaveBeenLastCalledWith(false);
  expect(input.hasAttribute("aria-invalid")).toBe(false);
  await user.keyboard("{Enter}");
  expect(input.value).toBe("10/16/2026"); expect(input.getAttribute("aria-invalid")).toBe("true");
  expect(screen.getByText("No appointment capacity")).toBeTruthy(); expect(change).not.toHaveBeenCalled();
  expect(new FormData(form).get("appointment")).toBe("2026-10-14");
  await user.click(screen.getByRole("button", { name: "Book", exact: true })); expect(submit).not.toHaveBeenCalled();
  await user.clear(input); await user.type(input, "10/17/2026{Enter}");
  expect(change).toHaveBeenCalledExactlyOnceWith("2026-10-17"); expect(validity).toHaveBeenLastCalledWith(true);
  expect(new FormData(form).get("appointment")).toBe("2026-10-17");
 });
}

it("keeps controlled authority and revalidates host values when availability changes", async () => {
 const user = userEvent.setup(), change = vi.fn(), validity = vi.fn();
 const props = { label: "Appointment", name: "appointment", value: "2026-10-14", onValueChange: change, onValidityChange: validity };
 const { rerender } = render(<form data-testid="host-policy"><DatePicker {...props}/></form>);
 const input = screen.getByRole("textbox", { name: "Appointment" }) as HTMLInputElement;
 const form = screen.getByTestId("host-policy") as HTMLFormElement;
 await user.clear(input); await user.type(input, "10/17/2026{Enter}");
 expect(change).toHaveBeenCalledExactlyOnceWith("2026-10-17"); expect(input.value).toBe("10/14/2026");
 expect(new FormData(form).get("appointment")).toBe("2026-10-14");
 rerender(<form data-testid="host-policy"><DatePicker {...props} getDateUnavailableReason={() => "Capacity changed"}/></form>);
 expect(input.validity.valid).toBe(false); expect(validity).toHaveBeenLastCalledWith(false);
 expect(new FormData(form).get("appointment")).toBe(""); expect(change).toHaveBeenCalledTimes(1);
});

it.each(["date", "datetime"] as const)("validates unavailable %s segments without publishing the forbidden draft", async kind => {
 const user = userEvent.setup(), change = vi.fn(), validity = vi.fn();
 const suffix = kind === "datetime" ? "T09:30:00" : "";
 render(<form data-testid="segments-policy"><DatePicker label="Appointment" entryMode="segments" kind={kind}
  defaultValue={`2026-10-14${suffix}`} name="appointment" onValueChange={change} onValidityChange={validity}
  getDateUnavailableReason={date => date === "2026-10-16" ? "No appointment capacity" : undefined}/></form>);
 const day = screen.getByRole("spinbutton", { name: /day/ });
 await user.click(day); await user.keyboard("{ArrowUp}{ArrowUp}");
 const form = screen.getByTestId("segments-policy") as HTMLFormElement;
 expect(day.getAttribute("aria-valuenow")).toBe("16");
 expect(change).toHaveBeenCalledExactlyOnceWith(`2026-10-15${suffix}`);
 expect(new FormData(form).get("appointment")).toBe(`2026-10-15${suffix}`);
 expect(validity).toHaveBeenLastCalledWith(false);
 act(() => { expect(form.checkValidity()).toBe(false); });
 await screen.findByText("No appointment capacity");
 await user.keyboard("{ArrowDown}");
 expect(validity).toHaveBeenLastCalledWith(true);
 expect((form.elements.namedItem("appointment") as HTMLInputElement).validity.valid).toBe(true);
});

it("rechecks datetime Apply against current availability and disabled/readOnly host rules", async () => {
 const user = userEvent.setup(), change = vi.fn();
 const props = { label: "Appointment", kind: "datetime" as const, defaultValue: "2026-10-14T09:30:00", name: "appointment", onValueChange: change };
 const { rerender } = render(<form data-testid="datetime-policy"><DatePicker {...props}/></form>);
 await user.click(screen.getByRole("button", { name: "Choose Appointment" }));
 await user.click(screen.getByRole("button", { name: /Thursday, October 15, 2026/ }));
 const apply = () => screen.getByRole("button", { name: "Apply", exact: true }) as HTMLButtonElement;
 expect(apply().disabled).toBe(false);
 rerender(<form data-testid="datetime-policy"><DatePicker {...props} getDateUnavailableReason={date => date === "2026-10-15" ? "New restriction" : undefined}/></form>);
 expect(apply().disabled).toBe(true); await user.click(apply()); expect(change).not.toHaveBeenCalled();
 for (const rule of [{ disabled: true }, { readOnly: true }]) {
  rerender(<form data-testid="datetime-policy"><DatePicker {...props} {...rule}/></form>);
  expect(apply().disabled).toBe(true); await user.click(apply()); expect(change).not.toHaveBeenCalled();
 }
 rerender(<form data-testid="datetime-policy"><DatePicker {...props} unavailable={[{ date: "2026-10-15", reason: "" }]}/></form>);
 expect(apply().disabled).toBe(true);
 rerender(<form data-testid="datetime-policy"><DatePicker {...props}/></form>);
 await user.click(apply()); expect(change).toHaveBeenCalledExactlyOnceWith("2026-10-15T09:30:00");
 expect(new FormData(screen.getByTestId("datetime-policy") as HTMLFormElement).get("appointment")).toBe("2026-10-15T09:30:00");
});

it.each(["date", "datetime"] as const)("preserves controlled %s segment authority and clears rejected drafts on host replacement", async kind => {
 const user = userEvent.setup(), change = vi.fn(), validity = vi.fn();
 const suffix = kind === "datetime" ? "T09:30:00" : "";
 const props = { label: "Appointment", kind, entryMode: "segments" as const, name: "appointment", onValueChange: change,
  onValidityChange: validity, unavailable: [{ date: "2026-10-16", reason: "No capacity" }] };
 const { rerender } = render(<form data-testid="controlled-segments"><DatePicker {...props} value={`2026-10-15${suffix}`}/></form>);
 await user.click(screen.getByRole("spinbutton", { name: /day/ })); await user.keyboard("{ArrowUp}");
 const form = screen.getByTestId("controlled-segments") as HTMLFormElement;
 expect(change).not.toHaveBeenCalled(); expect(validity).toHaveBeenLastCalledWith(false);
 expect(new FormData(form).get("appointment")).toBe(`2026-10-15${suffix}`);
 expect((form.elements.namedItem("appointment") as HTMLInputElement).validity.valid).toBe(false);
 rerender(<form data-testid="controlled-segments"><DatePicker {...props} value={`2026-10-17${suffix}`}/></form>);
 expect(screen.getByRole("spinbutton", { name: /day/ }).getAttribute("aria-valuenow")).toBe("17");
 expect(validity).toHaveBeenLastCalledWith(true); expect(change).not.toHaveBeenCalled();
 expect(new FormData(form).get("appointment")).toBe(`2026-10-17${suffix}`);
});

it("blocks a host Apply through live entry validity before text feedback is shown", async () => {
 const user = userEvent.setup();
 function Host() {
  const [valid, setValid] = useState(true);
  return <><DatePicker label="Appointment" defaultValue="2026-10-14" onValidityChange={setValid}
   getDateUnavailableReason={date => date === "2026-10-16" ? "No capacity" : undefined}/>
   <button disabled={!valid}>Apply booking</button></>;
 }
 render(<Host/>);
 const input = screen.getByRole("textbox", { name: "Appointment" });
 await user.clear(input); await user.type(input, "10/16/2026");
 expect(input.hasAttribute("aria-invalid")).toBe(false);
 expect((screen.getByRole("button", { name: "Apply booking" }) as HTMLButtonElement).disabled).toBe(true);
 await user.keyboard("{Enter}"); expect(screen.getByText("No capacity")).toBeTruthy();
 await user.clear(input); await user.type(input, "10/17/2026{Enter}");
 expect((screen.getByRole("button", { name: "Apply booking" }) as HTMLButtonElement).disabled).toBe(false);
});
