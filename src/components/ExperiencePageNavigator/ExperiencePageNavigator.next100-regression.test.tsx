// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { ExperiencePageNavigator, type ExperiencePageNavigatorProps } from "./index";
import { Provider } from "../../theme";
import { formatIcuMessage, SGTranslationProvider } from "../../i18n";

afterEach(cleanup);
const pages = [{ key: "a", title: "Intro" }, { key: "b", title: "Lesson" }];
function props(overrides: Partial<ExperiencePageNavigatorProps> = {}): ExperiencePageNavigatorProps {
  return { pages, activePageKey: "a", onSelectPage: vi.fn(), onAddPage: vi.fn(),
    onRemovePage: vi.fn(), onRenamePage: vi.fn(), onReorderPages: vi.fn(), ...overrides };
}

it("disables the last-row downward request and requests its preceding page without selecting", async () => {
  const p = props(); const user = userEvent.setup();
  render(<Provider><ExperiencePageNavigator {...p} /></Provider>);
  await user.click(screen.getByRole("button", { name: "Actions for Lesson" }));
  const down = screen.getByRole("menuitem", { name: "Move down" });
  expect(down.getAttribute("aria-disabled")).toBe("true");
  await user.click(down);
  expect(p.onReorderPages).not.toHaveBeenCalled();
  await user.click(screen.getByRole("menuitem", { name: "Move up" }));
  expect(p.onReorderPages).toHaveBeenCalledExactlyOnceWith("b", "a");
  expect(p.onSelectPage).not.toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Intro Page 1 • Active" }).getAttribute("aria-current")).toBe("page");
});

it("translates library labels with interpolation while preserving host titles and explicit heading", async () => {
  const p = props(); const user = userEvent.setup();
  const t = vi.fn((_key: string, options: { defaultMessage: string; values?: Parameters<typeof formatIcuMessage>[2] }) =>
    `Localized ${formatIcuMessage(options.defaultMessage, "en-US", options.values)}`);
  const view = (title?: string) => <SGTranslationProvider value={{ locale: "en-US", t, useNamespace: () => {} }}>
    <Provider><ExperiencePageNavigator {...p} title={title} /></Provider>
  </SGTranslationProvider>;
  const { rerender } = render(view());
  expect(screen.getByRole("region", { name: "Localized Pages" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Intro Localized Page 1 • Localized Active" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Localized Add" })).toBeTruthy();
  expect(t).toHaveBeenCalledWith("experience.pages.position", { defaultMessage: "Page {number}", values: { number: 2 } });
  expect(t).toHaveBeenCalledWith("experience.pages.actions", { defaultMessage: "Actions for {title}", values: { title: "Intro" } });
  await user.click(screen.getByRole("button", { name: "Localized Actions for Intro" }));
  for (const name of ["Localized Remove", "Localized Move up", "Localized Move down"]) {
    expect(screen.getByRole("menuitem", { name })).toBeTruthy();
  }
  await user.click(screen.getByRole("menuitem", { name: "Localized Edit Page Name" }));
  expect(screen.getByRole("dialog", { name: "Localized Edit Page Name" })).toBeTruthy();
  expect((screen.getByRole("textbox", { name: "Localized Page Name" }) as HTMLInputElement).value).toBe("Intro");
  await user.click(screen.getByRole("button", { name: "Localized Cancel" }));
  rerender(view("Host heading"));
  expect(screen.getByRole("region", { name: "Host heading" })).toBeTruthy();
  expect(p.onRenamePage).not.toHaveBeenCalled();
});

it("isolates overlapping page keys, callbacks and rename drafts across instances and remount", async () => {
  const left = props({ title: "Left pages" }); const right = props({ title: "Right pages" });
  const user = userEvent.setup();
  const view = (showLeft: boolean) => <Provider>
    {showLeft && <ExperiencePageNavigator {...left} />}
    <ExperiencePageNavigator {...right} />
  </Provider>;
  const { rerender } = render(view(true));
  const leftRegion = screen.getByRole("region", { name: "Left pages" });
  const rightRegion = screen.getByRole("region", { name: "Right pages" });
  expect(leftRegion.getAttribute("aria-labelledby")).not.toBe(rightRegion.getAttribute("aria-labelledby"));
  await user.click(within(rightRegion).getByRole("button", { name: "Lesson Page 2" }));
  expect(right.onSelectPage).toHaveBeenCalledExactlyOnceWith("b");
  expect(left.onSelectPage).not.toHaveBeenCalled();
  await user.click(within(leftRegion).getByRole("button", { name: "Actions for Intro" }));
  await user.click(screen.getByRole("menuitem", { name: "Edit Page Name" }));
  await user.clear(screen.getByRole("textbox", { name: "Page Name" }));
  await user.type(screen.getByRole("textbox", { name: "Page Name" }), "Left draft");
  rerender(view(false));
  expect(screen.queryByRole("dialog")).toBeNull();
  rerender(view(true));
  await user.click(within(screen.getByRole("region", { name: "Right pages" })).getByRole("button", { name: "Actions for Intro" }));
  await user.click(screen.getByRole("menuitem", { name: "Edit Page Name" }));
  expect((screen.getByRole("textbox", { name: "Page Name" }) as HTMLInputElement).value).toBe("Intro");
  await user.clear(screen.getByRole("textbox", { name: "Page Name" }));
  await user.type(screen.getByRole("textbox", { name: "Page Name" }), "  Right title  {Enter}");
  expect(right.onRenamePage).toHaveBeenCalledExactlyOnceWith("a", "Right title");
  expect(left.onRenamePage).not.toHaveBeenCalled();
});
