// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { Provider } from "../../../experimental/Provider/Provider";
import { DataToolbarSelectionMenu } from "./DataToolbarSelectionMenu";
afterEach(cleanup);
const options = [{ id: "all", label: "All visible courses" }, { id: "none", label: "Clear selection" }];
it("exposes mixed selection and activates toggle once with Space while preserving host state", async () => {
  const user = userEvent.setup(); const toggle = vi.fn(); const action = vi.fn();
  const { rerender } = render(<Provider><DataToolbarSelectionMenu options={options} selectionState="some" onToggleSelection={toggle} onSelectOption={action} /></Provider>);
  const checkbox = screen.getByRole("checkbox", { name: "Select rows" }) as HTMLInputElement;
  expect(checkbox.indeterminate).toBe(true); expect(checkbox.checked).toBe(false);
  await user.tab(); await user.keyboard(" "); expect(toggle).toHaveBeenCalledTimes(1); expect(action).not.toHaveBeenCalled();
  rerender(<Provider><DataToolbarSelectionMenu options={options} selectionState="all" onToggleSelection={toggle} onSelectOption={action} /></Provider>);
  expect(checkbox.indeterminate).toBe(false); expect(checkbox.checked).toBe(true);
  rerender(<Provider><DataToolbarSelectionMenu options={options} selectionState="none" onToggleSelection={toggle} onSelectOption={action} /></Provider>);
  expect(checkbox.checked).toBe(false);
});
it("keeps literal option labels, normalizes keyboard actions, returns focus and never submits a form", async () => {
  const user = userEvent.setup(); const toggle = vi.fn(); const action = vi.fn(); const submit = vi.fn(event => event.preventDefault());
  render(<Provider theme="dark"><form onSubmit={submit}><DataToolbarSelectionMenu options={options} selectionState="none" onToggleSelection={toggle} onSelectOption={action} /></form></Provider>);
  await user.tab(); await user.tab(); await user.keyboard("{ArrowDown}");
  expect(screen.getByRole("menu", { name: "Selection options" }).closest('[data-sgui-theme="dark"]')).toBeTruthy();
  expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "All visible courses" }));
  await user.keyboard("{ArrowDown}{Enter}"); expect(action).toHaveBeenCalledExactlyOnceWith("none");
  expect(screen.queryByRole("menu")).toBeNull(); expect(toggle).not.toHaveBeenCalled(); expect(submit).not.toHaveBeenCalled();
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Selection options" })));
  await user.keyboard("{ArrowDown}{Escape}"); expect(action).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole("menu")).toBeNull();
});
