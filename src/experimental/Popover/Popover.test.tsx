// @vitest-environment jsdom
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Popover } from "./Popover";
import { Button } from "../Button/Button";
import { TextField } from "../TextField/TextField";
import { ThemeScope } from "../../foundation/ThemeScope";
import { Menu } from "../Menu/Menu";
import { Provider } from "../Provider/Provider";
import { SGTranslationProvider } from "../../i18n";
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("owned popover proof", () => {
  it("opens from its named trigger, focuses content and restores the trigger after Escape", async () => {
    const user = userEvent.setup(); const change = vi.fn(); const ref = createRef<HTMLInputElement>();
    render(<Popover title="Course note" trigger={<Button>Edit note</Button>} onOpenChange={change}>
      <TextField ref={ref} label="Note" autoFocus />
    </Popover>);
    const trigger = screen.getByRole("button", { name: "Edit note" });
    await user.click(trigger);
    expect(await screen.findByRole("dialog", { name: "Course note" })).toBeTruthy();
    await waitFor(() => expect(document.activeElement).toBe(ref.current));
    expect(change).toHaveBeenLastCalledWith(true);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(change).toHaveBeenLastCalledWith(false);
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
  it("inherits nested theme, density, direction and token overrides across its body portal", async () => {
    const user = userEvent.setup();
    render(<SGTranslationProvider value={{ locale: "ar-EG", t: (_key, options) => options.defaultMessage, useNamespace: () => {} }}>
      <Provider theme="dark" density="compact" style={{ "--sgui-surface": "#123456", margin: "99px" }}>
      <ThemeScope><Popover title="Course note" trigger={<Button>Edit note</Button>}><TextField label="Note" /></Popover></ThemeScope>
    </Provider></SGTranslationProvider>);
    const trigger = screen.getByRole("button", { name: "Edit note" });
    const inlineScope = trigger.closest('[data-sgui-scope]')!;
    await user.click(trigger);
    const scope = (await screen.findByRole("dialog")).closest('[data-sgui-scope]') as HTMLElement;
    expect(scope.getAttribute("data-sgui-theme")).toBe("dark");
    expect(scope.getAttribute("data-sgui-density")).toBe("compact");
    expect(scope.getAttribute("dir")).toBe("rtl"); expect(scope.getAttribute("lang")).toBe("ar-EG");
    expect(scope.style.getPropertyValue("--sgui-surface")).toBe("#123456"); expect(scope.style.margin).toBe("");
    expect(document.body.contains(scope)).toBe(true);
    expect(inlineScope.contains(scope)).toBe(false);
  });
  it("keeps controlled open state authoritative and requests dismissal once", async () => {
    const user = userEvent.setup(); const change = vi.fn();
    const { rerender } = render(<Popover title="Course note" open onOpenChange={change} trigger={<Button>Edit note</Button>}>Content</Popover>);
    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");
    expect(change).toHaveBeenCalledTimes(1); expect(change).toHaveBeenLastCalledWith(false);
    expect(screen.getByRole("dialog")).toBeTruthy();
    rerender(<Popover title="Course note" open={false} onOpenChange={change} trigger={<Button>Edit note</Button>}>Content</Popover>);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });
});

it("preserves explicit visual direction through a nested menu portal without replacing English locale", async () => {
  const user = userEvent.setup();
  const content = (dir?: "ltr" | "rtl") => <SGTranslationProvider value={{ locale: "en-US", t: (_key, options) => options.defaultMessage, useNamespace: () => {} }}>
    <Provider dir={dir} theme="dark" density="compact" style={{ "--sgui-surface": "#123456", margin: "99px" }}>
      <ThemeScope><Popover title="Settings" trigger={<Button>Settings</Button>}>
        <Menu label="Nested actions" trigger={<Button>Actions</Button>} items={[{ id: "review", label: "Review" }]} />
      </Popover></ThemeScope>
    </Provider>
  </SGTranslationProvider>;
  const { rerender } = render(content("rtl"));
  await user.click(screen.getByRole("button", { name: "Settings" }));
  const popover = screen.getByRole("dialog").closest("[data-sgui-scope]") as HTMLElement;
  expect(popover.getAttribute("dir")).toBe("rtl");
  await user.click(screen.getByRole("button", { name: "Actions" }));
  const menu = screen.getByRole("menu").closest("[data-sgui-scope]") as HTMLElement;
  expect(menu.getAttribute("dir")).toBe("rtl");
  for (const scope of [popover, menu]) {
    expect(scope.getAttribute("lang")).toBe("en-US");
    expect(scope.getAttribute("data-sgui-theme")).toBe("dark");
    expect(scope.getAttribute("data-sgui-density")).toBe("compact");
    expect(scope.style.getPropertyValue("--sgui-surface")).toBe("#123456");
    expect(scope.style.margin).toBe("");
  }
  rerender(content());
  expect(menu.getAttribute("dir")).toBe("ltr");
  expect(popover.getAttribute("dir")).toBe("ltr");
  await user.keyboard("{Escape}");
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Actions" })));
  expect(screen.getByRole("dialog")).toBeTruthy();
});


it("repositions on native ancestor scroll without losing the focused draft or requesting dismissal", async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  let anchorTop = 180;
  const rect = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function(this: HTMLElement) {
    return this.tagName === "BUTTON" && this.textContent === "Edit note"
      ? new DOMRect(100, anchorTop, 80, 30)
      : new DOMRect(0, 0, 160, 100);
  });
  render(<div data-testid="scroll-host"><Popover title="Course note" trigger={<Button>Edit note</Button>} onOpenChange={change}>
    <TextField label="Note" autoFocus />
    <div data-testid="inner-scroll">Long note</div>
  </Popover></div>);
  await user.click(screen.getByRole("button", { name: "Edit note" }));
  const dialog = screen.getByRole("dialog");
  const overlay = dialog.parentElement!;
  const note = screen.getByRole("textbox", { name: "Note" });
  await user.type(note, "Unsaved draft");
  const before = Number.parseFloat(overlay.style.top);
  expect(Number.isFinite(before)).toBe(true);
  anchorTop -= 32;
  fireEvent.scroll(screen.getByTestId("scroll-host"));
  await waitFor(() => expect(Number.parseFloat(overlay.style.top)).toBe(before - 32));
  expect(screen.getByRole("dialog")).toBe(dialog);
  expect(document.activeElement).toBe(note);
  expect((note as HTMLInputElement).value).toBe("Unsaved draft");
  expect(change.mock.calls).toEqual([[true]]);
  // Native viewport scroll also uses the live anchor, without changing state.
  anchorTop -= 16;
  fireEvent.scroll(document);
  await waitFor(() => expect(Number.parseFloat(overlay.style.top)).toBe(before - 48));
  rect.mockClear();
  fireEvent.scroll(screen.getByTestId("inner-scroll"));
  expect(rect).not.toHaveBeenCalled();
  await user.keyboard("{Escape}");
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  expect(change.mock.calls).toEqual([[true], [false]]);
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Edit note" })));
});

it("subscribes only while open and removes the exact capture listener on close, reopen and unmount", async () => {
  const user = userEvent.setup();
  const add = vi.spyOn(document, "addEventListener");
  const remove = vi.spyOn(document, "removeEventListener");
  const ownedListeners = () => add.mock.calls.filter(([type, , options]) => type === "scroll"
    && typeof options === "object" && options.capture === true && options.passive === true);
  const activeListeners = () => ownedListeners().filter(([, callback]) =>
    !remove.mock.calls.some(([type, removed, capture]) => type === "scroll" && removed === callback && capture === true));
  const { unmount } = render(<Popover title="Course note" trigger={<Button>Edit note</Button>}>Content</Popover>);
  expect(ownedListeners()).toHaveLength(0);
  await user.click(screen.getByRole("button", { name: "Edit note" }));
  const first = activeListeners()[0][1];
  expect(activeListeners()).toHaveLength(1);
  await user.keyboard("{Escape}");
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  expect(remove.mock.calls).toContainEqual(["scroll", first, true]);
  await user.click(screen.getByRole("button", { name: "Edit note" }));
  expect(activeListeners()).toHaveLength(1);
  const second = activeListeners()[0][1];
  expect(second).not.toBe(first);
  unmount();
  expect(remove.mock.calls).toContainEqual(["scroll", second, true]);
  expect(activeListeners()).toHaveLength(0);
  for (const [, callback] of ownedListeners()) expect(remove.mock.calls).toContainEqual(["scroll", callback, true]);
});


it("contains Tab focus and dismisses once on native outside interaction", async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(<><Button>Outside</Button><Popover title="Course note" trigger={<Button>Edit note</Button>} onOpenChange={change}>
    <TextField label="Note" autoFocus /><Button>Done</Button>
  </Popover></>);
  const trigger = screen.getByRole("button", { name: "Edit note" });
  await user.click(trigger);
  const dialog = screen.getByRole("dialog");
  await user.tab();
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Done" }));
  await user.tab();
  expect(dialog.contains(document.activeElement)).toBe(true);
  const underlay = dialog.parentElement!.parentElement!.previousElementSibling!;
  await user.click(underlay);
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  expect(change.mock.calls).toEqual([[true], [false]]);
  await waitFor(() => expect(document.activeElement).toBe(trigger));
});
