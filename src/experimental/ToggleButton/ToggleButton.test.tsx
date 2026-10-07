// @vitest-environment jsdom
import { createRef } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToggleButton, ToggleButtonGroup } from "./ToggleButton";
import { Provider } from "../Provider/Provider";
import { SGTranslationProvider } from "../../i18n";
afterEach(cleanup);
it("toggles once with Space and Enter, forwards its native ref and never submits", async () => {
  const user = userEvent.setup(); const change = vi.fn(); const submit = vi.fn(); const ref = createRef<HTMLButtonElement>();
  render(<form onSubmit={event => {event.preventDefault(); submit();}}><ToggleButton ref={ref} onSelectedChange={change}>Bold</ToggleButton></form>);
  const button = screen.getByRole("button", {name:"Bold"}); expect(ref.current).toBe(button);
  await user.tab(); await user.keyboard(" "); expect(change).toHaveBeenCalledExactlyOnceWith(true);
  expect(button.getAttribute("aria-pressed")).toBe("true");
  await user.keyboard("{Enter}"); expect(change).toHaveBeenLastCalledWith(false); expect(change).toHaveBeenCalledTimes(2);
  expect(submit).not.toHaveBeenCalled();
});
it("leaves controlled selection with the host and prevents disabled activation", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const {rerender} = render(<ToggleButton selected={false} onSelectedChange={change}>Bold</ToggleButton>);
  await user.click(screen.getByRole("button")); expect(change).toHaveBeenCalledExactlyOnceWith(true);
  expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("false");
  rerender(<ToggleButton disabled onSelectedChange={change}>Bold</ToggleButton>);
  await user.click(screen.getByRole("button")); expect(change).toHaveBeenCalledTimes(1);
});
const options = [{id:"grid",label:"Grid"},{id:"disabled",label:"Disabled",disabled:true},{id:"cards",label:"Cards"}];
it("uses arrow navigation skipping disabled options and enforces required single selection", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<ToggleButtonGroup label="View" options={options} defaultSelectedIds={["grid"]} allowEmpty={false} onSelectionChange={change} />);
  await user.tab(); expect(document.activeElement).toBe(screen.getByRole("radio", {name:"Grid"}));
  await user.keyboard("{ArrowRight}"); expect(document.activeElement).toBe(screen.getByRole("radio", {name:"Cards"}));
  await user.keyboard(" "); expect(change).toHaveBeenCalledExactlyOnceWith(["cards"]);
  await user.keyboard(" "); expect(screen.getByRole("radio", {name:"Cards"}).getAttribute("aria-checked")).toBe("true");
});
it("supports multiple selection and controlled group IDs", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const {unmount} = render(<ToggleButtonGroup label="Formatting" options={options} selectionMode="multiple" onSelectionChange={change} />);
  await user.click(screen.getByRole("button", {name:"Grid"})); await user.click(screen.getByRole("button", {name:"Cards"}));
  expect(change).toHaveBeenLastCalledWith(["grid","cards"]);
  unmount(); render(<ToggleButtonGroup label="Formatting" options={options} selectedIds={["grid"]} onSelectionChange={change} />);
  await user.click(screen.getByRole("radio", {name:"Cards"})); expect(change).toHaveBeenLastCalledWith(["cards"]);
  expect(screen.getByRole("radio", {name:"Grid"}).getAttribute("aria-checked")).toBe("true");
});
it("respects RTL arrows, vertical orientation and group disabled state", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const {unmount} = render(<SGTranslationProvider value={{locale:"ar"}}><Provider><ToggleButtonGroup label="View" options={options} /></Provider></SGTranslationProvider>);
  await user.tab(); await user.keyboard("{ArrowLeft}"); expect(document.activeElement).toBe(screen.getByRole("radio", {name:"Cards"}));
  unmount(); render(<ToggleButtonGroup label="View" options={options} orientation="vertical" onSelectionChange={change} />);
  await user.tab(); await user.keyboard("{ArrowDown}"); expect(document.activeElement).toBe(screen.getByRole("radio", {name:"Cards"}));
  cleanup(); render(<ToggleButtonGroup label="View" options={options} disabled onSelectionChange={change} />);
  await user.click(screen.getByRole("radio", {name:"Grid"})); expect(change).not.toHaveBeenCalled();
});
