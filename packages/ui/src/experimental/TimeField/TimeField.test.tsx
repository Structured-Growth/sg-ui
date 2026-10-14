// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, type FormEvent } from "react";
import { Provider } from "../Provider/Provider";
import { SGTranslationProvider } from "../../i18n";
import { TimeField } from "./TimeField";
afterEach(cleanup);
it("edits clock segments, serializes seconds and resets the uncontrolled value", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<form data-testid="form"><TimeField label="Start time" defaultValue="23:59:00" hourCycle={24} name="time" onValueChange={change} /><button type="reset">Reset</button></form>);
  await user.click(screen.getByRole("spinbutton", { name: /second/ })); await user.keyboard("{ArrowUp}");
  expect(change).toHaveBeenLastCalledWith("23:59:01");
  const form = screen.getByTestId("form") as HTMLFormElement;
  expect(new FormData(form).get("time")).toBe("23:59:01");
  await user.click(screen.getByRole("button", { name: "Reset" })); expect(new FormData(form).get("time")).toBe("23:59:00");
});
it("preserves controlled values, descriptions/errors and disabled form semantics", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const { rerender } = render(<form data-testid="form"><TimeField label="Start time" value="09:00:00" name="time" onValueChange={change} invalid errorMessage="Outside hours" description="Local clock time" /></form>);
  await user.click(screen.getByRole("spinbutton", { name: /minute/ })); await user.keyboard("{ArrowUp}");
  expect(change).toHaveBeenLastCalledWith("09:01:00");
  expect(new FormData(screen.getByTestId("form") as HTMLFormElement).get("time")).toBe("09:00:00");
  expect(screen.getByText("Outside hours")).toBeTruthy();
  rerender(<form data-testid="form"><TimeField label="Start time" value="09:00:00" name="time" disabled /></form>);
  expect(new FormData(screen.getByTestId("form") as HTMLFormElement).has("time")).toBe(false);
});
it("marks invalid external time strings without throwing or reporting a valid value", () => {
 render(<TimeField label="Imported time" value="25:90:00" />);
 expect(screen.getByText("Enter a valid time.")).toBeDefined();
});
it("replaces a partial controlled edit with the host's midnight value", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const { rerender } = render(<TimeField label="Clock" value={null} hourCycle={24} onValueChange={change} />);
  await user.click(screen.getByRole("spinbutton", { name: /hour/ }));
  await user.keyboard("23{ArrowRight}59{ArrowRight}");
  expect(change).not.toHaveBeenCalled();
  rerender(<TimeField label="Clock" value="00:00:00" hourCycle={24} onValueChange={change} />);
  expect(screen.getByRole("spinbutton", { name: /hour/ }).getAttribute("aria-valuenow")).toBe("0");
  expect(screen.getByRole("spinbutton", { name: /minute/ }).getAttribute("aria-valuenow")).toBe("0");
  await user.click(screen.getByRole("spinbutton", { name: /second/ }));
  await user.keyboard("{ArrowDown}");
  expect(change).toHaveBeenLastCalledWith("00:00:59");
});
it("restores invalid default feedback when reset returns a corrected clock to its partial default", async () => {
  const user = userEvent.setup();
  render(<form><TimeField label="Clock" defaultValue="23:59" hourCycle={24} /><button type="reset">Reset</button></form>);
  expect(screen.getByText("Enter a valid time.")).toBeTruthy();
  for (const name of [/hour/, /minute/, /second/]) {
    await user.click(screen.getByRole("spinbutton", { name }));
    await user.keyboard("1{ArrowRight}");
  }
  expect(screen.queryByText("Enter a valid time.")).toBeNull();
  await user.click(screen.getByRole("button", { name: "Reset" }));
  expect(await screen.findByText("Enter a valid time.")).toBeTruthy();
});

it("keeps German read-only midnight segments focusable, serialized and forwarded to the native ref", async () => {
  const user = userEvent.setup(); const change = vi.fn(); const ref = createRef<HTMLDivElement>();
  render(<SGTranslationProvider value={{ locale: "de-DE", t: (_key, options) => options.defaultMessage, useNamespace: () => {} }}>
    <Provider><form data-testid="form"><TimeField ref={ref} label="Uhrzeit" value="00:00:00" hourCycle={24} readOnly name="clock" onValueChange={change} /></form></Provider>
  </SGTranslationProvider>);
  const hour = ref.current!.querySelector('[data-type="hour"]') as HTMLElement;
  await user.click(hour); await user.keyboard("{ArrowDown}1");
  expect(document.activeElement).toBe(hour);
  expect(hour.getAttribute("aria-readonly")).toBe("true");
  expect(hour.getAttribute("aria-valuenow")).toBe("0");
  expect(change).not.toHaveBeenCalled();
  expect(new FormData(screen.getByTestId("form") as HTMLFormElement).get("clock")).toBe("00:00:00");
});
it("wraps individual clock segments without inventing a date or carrying into adjacent segments", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<TimeField label="Clock" defaultValue="23:59:59" hourCycle={24} onValueChange={change} />);
  await user.click(screen.getByRole("spinbutton", { name: /second/ })); await user.keyboard("{ArrowUp}");
  expect(change).toHaveBeenLastCalledWith("23:59:00");
  await user.click(screen.getByRole("spinbutton", { name: /hour/ })); await user.keyboard("{ArrowUp}");
  expect(change).toHaveBeenLastCalledWith("00:59:00");
});

for (const controlled of [false, true]) {
  it(`preserves ${controlled ? "controlled null" : "uncontrolled"} incomplete segments and focus across prevented reset, then silently clears on acceptance`, async () => {
    const user = userEvent.setup(); const change = vi.fn(); let prevent = true;
    render(<div onReset={event => { if (prevent) event.preventDefault(); }}><form data-testid="form">
      <TimeField label="Draft clock" value={controlled ? null : undefined} hourCycle={24} name="clock" required onValueChange={change} />
    </form></div>);
    const hour = screen.getByRole("spinbutton", { name: /hour/ });
    await user.click(hour); await user.keyboard("23");
    hour.focus();
    const form = screen.getByTestId("form") as HTMLFormElement;
    act(() => form.reset());
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(hour.getAttribute("aria-valuenow")).toBe("23");
    expect(document.activeElement).toBe(hour);
    expect(screen.getByRole("spinbutton", { name: /minute/ }).hasAttribute("aria-valuenow")).toBe(false);
    expect(new FormData(form).get("clock")).toBe("");
    expect((form.elements.namedItem("clock") as HTMLInputElement).validity.valueMissing).toBe(true);
    expect(change).not.toHaveBeenCalled();
    prevent = false;
    act(() => form.reset());
    await waitFor(() => expect(hour.hasAttribute("aria-valuenow")).toBe(false));
    expect(document.activeElement).toBe(hour);
    expect(change).not.toHaveBeenCalled();
  });
}
it("preserves a complete edit on delegated prevention and silently resets to the latest default", async () => {
  const user = userEvent.setup(); const change = vi.fn(); let prevent = true;
  const view = (defaultValue: string) => <div onReset={(event: FormEvent) => { if (prevent) event.preventDefault(); }}><form data-testid="form">
    <TimeField label="Clock" defaultValue={defaultValue} hourCycle={24} name="clock" onValueChange={change} />
  </form></div>;
  const { rerender } = render(view("09:30:00"));
  const second = screen.getByRole("spinbutton", { name: /second/ });
  await user.click(second); await user.keyboard("{ArrowUp}");
  change.mockClear();
  const form = screen.getByTestId("form") as HTMLFormElement;
  act(() => form.reset());
  await new Promise(resolve => setTimeout(resolve, 10));
  expect(new FormData(form).get("clock")).toBe("09:30:01");
  expect(second.getAttribute("aria-valuenow")).toBe("1");
  expect(document.activeElement).toBe(second);
  expect(change).not.toHaveBeenCalled();
  rerender(view("12:45:59"));
  expect(new FormData(form).get("clock")).toBe("09:30:01");
  prevent = false; act(() => form.reset());
  await waitFor(() => expect(new FormData(form).get("clock")).toBe("12:45:59"));
  expect(second.getAttribute("aria-valuenow")).toBe("59");
  expect(change).not.toHaveBeenCalled();
});
it("keeps the controlled host authoritative and reset callbacks silent", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<form data-testid="form"><TimeField label="Clock" value="09:00:00" defaultValue="12:00:00" hourCycle={24} name="clock" onValueChange={change} /></form>);
  await user.click(screen.getByRole("spinbutton", { name: /minute/ })); await user.keyboard("{ArrowUp}");
  expect(change).toHaveBeenLastCalledWith("09:01:00"); change.mockClear();
  const form = screen.getByTestId("form") as HTMLFormElement;
  act(() => form.reset()); await new Promise(resolve => setTimeout(resolve, 10));
  expect(new FormData(form).get("clock")).toBe("09:00:00");
  expect(change).not.toHaveBeenCalled();
});

it("preserves submitted required validation on prevention and clears displayed validation on accepted reset", async () => {
  const user = userEvent.setup(); const change = vi.fn(); let prevent = true;
  render(<div onReset={event => { if (prevent) event.preventDefault(); }}><form data-testid="form">
    <TimeField label="Required clock" hourCycle={24} name="clock" required errorMessage="Complete clock" onValueChange={change} />
    <button type="submit">Validate</button>
  </form></div>);
  const hour = screen.getByRole("spinbutton", { name: /hour/ });
  await user.click(hour); await user.keyboard("23");
  await user.click(screen.getByRole("button", { name: "Validate" }));
  expect(await screen.findByText("Complete clock")).toBeTruthy();
  const form = screen.getByTestId("form") as HTMLFormElement;
  hour.focus(); act(() => form.reset()); await new Promise(resolve => setTimeout(resolve, 10));
  expect(hour.getAttribute("aria-invalid")).toBe("true");
  expect(screen.getByText("Complete clock")).toBeTruthy();
  prevent = false; act(() => form.reset());
  await waitFor(() => expect(screen.queryByText("Complete clock")).toBeNull());
  expect((form.elements.namedItem("clock") as HTMLInputElement).validity.valueMissing).toBe(true);
  expect(document.activeElement).toBe(hour); expect(change).not.toHaveBeenCalled();
});
it("keeps a partial draft across unrelated host renders and completes it once", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const { rerender } = render(<TimeField label="Draft" hourCycle={24} onValueChange={change} />);
  await user.click(screen.getByRole("spinbutton", { name: /hour/ })); await user.keyboard("23");
  rerender(<TimeField label="Draft" hourCycle={24} description="Updated host description" onValueChange={change} />);
  expect(screen.getByRole("spinbutton", { name: /hour/ }).getAttribute("aria-valuenow")).toBe("23");
  await user.click(screen.getByRole("spinbutton", { name: /minute/ })); await user.keyboard("59");
  await user.click(screen.getByRole("spinbutton", { name: /second/ })); await user.keyboard("8");
  expect(change).toHaveBeenCalledExactlyOnceWith("23:59:08");
});
it("preserves twelve-hour day periods, clock bounds and associated descriptions", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<TimeField label="Afternoon" defaultValue="13:00:00" min="12:00:00" max="14:00:00" hourCycle={12}
    description="Local afternoon hours" onValueChange={change} />);
  const hour = screen.getByRole("spinbutton", { name: /hour/ });
  expect(hour.getAttribute("aria-valuenow")).toBe("1");
  expect(screen.getByRole("spinbutton", { name: /AM\/PM/ }).textContent).toBe("PM");
  expect(hour.getAttribute("aria-describedby")).toContain(screen.getByText("Local afternoon hours").id);
  await user.click(hour); await user.keyboard("{ArrowDown}");
  expect(change).toHaveBeenLastCalledWith("12:00:00");
});
it("uses a changed uncontrolled default only on accepted reset without an edit request", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const view = (defaultValue: string) => <form data-testid="form"><TimeField label="Clock" hourCycle={24} defaultValue={defaultValue} name="clock" onValueChange={change} /></form>;
  const { rerender } = render(view("09:30:00"));
  await user.click(screen.getByRole("spinbutton", { name: /second/ })); await user.keyboard("{ArrowUp}");
  change.mockClear(); rerender(view("12:45:59"));
  const form = screen.getByTestId("form") as HTMLFormElement;
  expect(new FormData(form).get("clock")).toBe("09:30:01");
  act(() => form.reset());
  await waitFor(() => expect(new FormData(form).get("clock")).toBe("12:45:59"));
  expect(change).not.toHaveBeenCalled();
});
