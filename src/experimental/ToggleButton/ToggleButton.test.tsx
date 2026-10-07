// @vitest-environment jsdom
import { createRef } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
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
it("cancels a held Space when the parent fieldset becomes disabled", async () => {
  const user = userEvent.setup(); const change = vi.fn(); const press = vi.fn();
  const view = (disabled: boolean) => <fieldset disabled={disabled}><ToggleButton selected={false} onSelectedChange={change} onPress={press}>Bold</ToggleButton></fieldset>;
  const {rerender} = render(view(false));
  await user.tab();
  await user.keyboard("[Space>]");
  rerender(view(true));
  await user.keyboard("[/Space]");
  expect(change).not.toHaveBeenCalled();
  expect(press).not.toHaveBeenCalled();
  expect(screen.getByRole("button", {name: "Bold"}).getAttribute("aria-pressed")).toBe("false");
});
it("keeps repeated option IDs independent across controlled and uncontrolled groups", async () => {
  const user = userEvent.setup(); const leftChange = vi.fn(); const rightChange = vi.fn();
  const view = (ids: string[]) => <><ToggleButtonGroup label="Primary view" options={options} selectedIds={ids} onSelectionChange={leftChange} /><ToggleButtonGroup label="Secondary view" options={options} defaultSelectedIds={["grid"]} onSelectionChange={rightChange} /></>;
  const {rerender} = render(view(["grid"]));
  const left = within(screen.getByRole("radiogroup", {name: "Primary view"})).getAllByRole("radio") as HTMLButtonElement[];
  const right = within(screen.getByRole("radiogroup", {name: "Secondary view"})).getAllByRole("radio") as HTMLButtonElement[];
  await user.click(left[2]);
  expect(leftChange).toHaveBeenCalledExactlyOnceWith(["cards"]);
  expect(left[0].getAttribute("aria-checked")).toBe("true");
  expect(rightChange).not.toHaveBeenCalled();
  rerender(view(["cards"]));
  expect(left[2].getAttribute("aria-checked")).toBe("true");
  expect(right[0].getAttribute("aria-checked")).toBe("true");
  await user.click(right[2]);
  expect(rightChange).toHaveBeenCalledExactlyOnceWith(["cards"]);
  expect(leftChange).toHaveBeenCalledTimes(1);
  expect(right[2].getAttribute("aria-checked")).toBe("true");
  expect([...left, ...right].every(button => button.type === "button")).toBe(true);
});
it("honors disabled fieldsets while preserving the first legend's enabled action", async () => {
  const user = userEvent.setup(); const blocked = vi.fn(); const legendChange = vi.fn();
  render(<fieldset disabled><legend><ToggleButton onSelectedChange={legendChange}>Legend action</ToggleButton></legend><ToggleButton onSelectedChange={blocked}>Disabled action</ToggleButton><ToggleButtonGroup label="Disabled view" options={options} onSelectionChange={blocked} /></fieldset>);
  await user.click(screen.getByRole("button", {name:"Disabled action"}));
  await user.click(screen.getByRole("radio", {name:"Cards"}));
  expect(blocked).not.toHaveBeenCalled();
  await user.click(screen.getByRole("button", {name:"Legend action"}));
  expect(legendChange).toHaveBeenCalledExactlyOnceWith(true);
});
