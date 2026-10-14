// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { DocumentEditorToolbar, type DocumentEditorToolbarProps } from "./index";
import { Provider } from "../../theme";

const props = (): DocumentEditorToolbarProps => ({
  canEdit: true, headingValue: "normal", onHeadingChange: vi.fn(),
  actions: {
    bold: { active: false }, italic: { active: false },
    bulletList: { active: false }, orderedList: { active: false },
  },
});
afterEach(() => { cleanup(); vi.useRealTimers(); });

it("isolates a queued heading request from sibling availability changes and unmount", async () => {
  const first = props(); const second = props();
  const host = (showSecond: boolean, canEdit = true) => <Provider>
    <DocumentEditorToolbar key="first" {...first} aria-label="First editor" />
    {showSecond && <DocumentEditorToolbar key="second" {...second} canEdit={canEdit} aria-label="Second editor" />}
  </Provider>;
  const view = render(host(true));
  const user = userEvent.setup();
  await user.click(within(screen.getByRole("group", { name: "First editor" })).getByRole("button", { name: /Text style heading/ }));
  await user.keyboard("{ArrowDown}");
  const option = screen.getByRole("option", { name: "H1", exact: true });
  vi.useFakeTimers();
  fireEvent.keyDown(option, { key: "Enter", code: "Enter" });
  fireEvent.keyUp(option, { key: "Enter", code: "Enter" });
  expect(first.onHeadingChange).not.toHaveBeenCalled();
  view.rerender(host(true, false));
  expect((within(screen.getByRole("group", { name: "Second editor" })).getByRole("button", { name: /Text style heading/ }) as HTMLButtonElement).disabled).toBe(true);
  view.rerender(host(false));
  act(() => { vi.runAllTimers(); });
  expect(first.onHeadingChange).toHaveBeenCalledExactlyOnceWith("h1");
  expect(second.onHeadingChange).not.toHaveBeenCalled();
  expect(within(screen.getByRole("group", { name: "First editor" })).getByRole("button", { name: /Text style heading/ }).textContent).toContain("Normal");
  view.unmount();
  act(() => { vi.runAllTimers(); });
  expect(first.onHeadingChange).toHaveBeenCalledTimes(1);
});
