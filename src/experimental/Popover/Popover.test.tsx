// @vitest-environment jsdom
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Popover } from "./Popover";
import { Button } from "../Button/Button";
import { TextField } from "../TextField/TextField";
import { ThemeScope } from "../../foundation/ThemeScope";
import { Menu } from "../Menu/Menu";
import { Provider } from "../Provider/Provider";
import { SGTranslationProvider } from "../../i18n";
afterEach(cleanup);

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
