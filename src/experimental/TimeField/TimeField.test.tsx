// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
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
