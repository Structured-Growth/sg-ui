// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TextStyleMenuControl } from "./TextStyleMenuControl";

afterEach(cleanup);

describe("TextStyleMenuControl", () => {
  it("opens through the native ref and invokes each formatting callback once", async () => {
    const user = userEvent.setup();
    const handlers = {
      onLowercase: vi.fn(), onUppercase: vi.fn(), onCapitalize: vi.fn(), onStrikethrough: vi.fn(),
      onSubscript: vi.fn(), onSuperscript: vi.fn(), onHighlight: vi.fn(), onClearFormatting: vi.fn(),
    };
    render(<TextStyleMenuControl {...handlers} />);
    const trigger = screen.getByRole("button", { name: "Text style" });
    for (const label of ["Lowercase", "Uppercase", "Capitalize", "Strikethrough", "Subscript", "Superscript", "Highlight", "Clear Formatting"]) {
      await user.click(trigger);
      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      await user.click(screen.getByRole("menuitem", { name: new RegExp(label) }));
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    }
    Object.values(handlers).forEach((handler) => expect(handler).toHaveBeenCalledTimes(1));
  });

  it("prevents disabled activation", async () => {
    const user = userEvent.setup();
    render(<TextStyleMenuControl disabled />);
    await user.click(screen.getByRole("button", { name: "Text style" }));
    expect(screen.queryByRole("menu")).toBeNull();
  });
});

it("skips missing callbacks, selects by keyboard once and restores trigger focus", async () => {
  const user = userEvent.setup();
  const highlight = vi.fn(); const clear = vi.fn();
  render(<TextStyleMenuControl onHighlight={highlight} onClearFormatting={clear} />);
  const trigger = screen.getByRole("button", { name: "Text style" });
  await user.tab(); await user.keyboard("{ArrowDown}");
  expect(screen.getByRole("menuitem", { name: /^Lowercase/ }).getAttribute("aria-disabled")).toBe("true");
  expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Highlight" }));
  await user.keyboard("{Enter}");
  expect(highlight).toHaveBeenCalledTimes(1); expect(clear).not.toHaveBeenCalled();
  await waitFor(() => expect(document.activeElement).toBe(trigger));
  await user.keyboard("{ArrowDown}{ArrowDown}{Escape}");
  expect(screen.queryByRole("menu")).toBeNull(); expect(clear).not.toHaveBeenCalled();
  await waitFor(() => expect(document.activeElement).toBe(trigger));
});

it("keeps active styles under host control and clear formatting an ordinary command", async () => {
  const user = userEvent.setup(); const highlight = vi.fn();
  const { rerender } = render(<TextStyleMenuControl activeStyles={["highlight"]} onHighlight={highlight} onClearFormatting={() => {}} />);
  const trigger = screen.getByRole("button", { name: "Text style" });
  await user.click(trigger);
  expect(screen.getByRole("menuitemcheckbox", { name: "Highlight" }).getAttribute("aria-checked")).toBe("true");
  expect(screen.getByRole("menuitemcheckbox", { name: /^Strikethrough/ }).getAttribute("aria-checked")).toBe("false");
  expect(screen.getByRole("menuitem", { name: /^Clear Formatting/ })).toBeDefined();
  await user.click(screen.getByRole("menuitemcheckbox", { name: "Highlight" }));
  expect(highlight).toHaveBeenCalledTimes(1);
  await user.click(trigger);
  expect(screen.getByRole("menuitemcheckbox", { name: "Highlight" }).getAttribute("aria-checked")).toBe("true");
  rerender(<TextStyleMenuControl activeStyles={[]} onHighlight={highlight} onClearFormatting={() => {}} />);
  expect(screen.getByRole("menuitemcheckbox", { name: "Highlight" }).getAttribute("aria-checked")).toBe("false");
});

it("forwards labels and fallback messages to the host translation adapter in a scoped portal", async () => {
  const { SGTranslationProvider } = await import("../../i18n");
  const { Provider } = await import("../../experimental/Provider/Provider");
  const t = vi.fn((_key: string, options: { defaultMessage: string }) => `Translated ${options.defaultMessage}`);
  const user = userEvent.setup();
  render(<SGTranslationProvider value={{ locale: "en", t, useNamespace: () => {} }}><Provider theme="dark"><TextStyleMenuControl onHighlight={() => {}} /></Provider></SGTranslationProvider>);
  await user.click(screen.getByRole("button", { name: "Translated Text style" }));
  const menu = screen.getByRole("menu", { name: "Translated Text style" });
  expect(menu.closest('[data-sgui-theme="dark"]')).not.toBeNull();
  expect(screen.getByRole("menuitem", { name: "Translated Highlight" })).toBeDefined();
  expect(t).toHaveBeenCalledWith("common.ui.editor.clearFormatting", { defaultMessage: "Clear Formatting" });
});

it("uses replacement callbacks and controlled checked state in an already open menu", async () => {
  const user = userEvent.setup();
  const original = vi.fn(); const replacement = vi.fn();
  const { rerender } = render(<TextStyleMenuControl activeStyles={[]} onHighlight={original} />);
  await user.tab(); await user.keyboard("{ArrowDown}");
  const highlight = screen.getByRole("menuitemcheckbox", { name: "Highlight" });
  expect(document.activeElement).toBe(highlight);
  rerender(<TextStyleMenuControl activeStyles={["highlight"]} onHighlight={replacement} />);
  expect(highlight.getAttribute("aria-checked")).toBe("true");
  await user.keyboard("{Enter}");
  expect(original).not.toHaveBeenCalled();
  expect(replacement).toHaveBeenCalledTimes(1);
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Text style" })));
  await user.keyboard("{ArrowDown}");
  // A request does not change the checked state until the host accepts it.
  expect(screen.getByRole("menuitemcheckbox", { name: "Highlight" }).getAttribute("aria-checked")).toBe("true");
});

it("removes live callback availability and skips newly unavailable commands", async () => {
  const user = userEvent.setup();
  const highlight = vi.fn(); const clear = vi.fn(); const superscript = vi.fn();
  const { rerender } = render(<TextStyleMenuControl activeStyles={["highlight"]} onSuperscript={superscript} onHighlight={highlight} onClearFormatting={clear} />);
  await user.tab(); await user.keyboard("{ArrowDown}");
  rerender(<TextStyleMenuControl activeStyles={["superscript"]} onSuperscript={superscript} />);
  expect(screen.getByRole("menuitemcheckbox", { name: "Highlight" }).getAttribute("aria-disabled")).toBe("true");
  expect(screen.getByRole("menuitem", { name: "Clear Formatting" }).getAttribute("aria-disabled")).toBe("true");
  expect(screen.getByRole("menuitemcheckbox", { name: /^Superscript/ }).getAttribute("aria-checked")).toBe("true");
  await user.keyboard("{End}");
  expect(document.activeElement).toBe(screen.getByRole("menuitemcheckbox", { name: /^Superscript/ }));
  await user.keyboard("{Enter}");
  expect(superscript).toHaveBeenCalledTimes(1);
  expect(highlight).not.toHaveBeenCalled(); expect(clear).not.toHaveBeenCalled();
});
