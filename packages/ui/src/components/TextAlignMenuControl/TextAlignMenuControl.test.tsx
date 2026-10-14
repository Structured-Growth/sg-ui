// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TextAlignMenuControl } from "./TextAlignMenuControl";
import { Provider } from "../../experimental/Provider/Provider";
import { SGTranslationProvider } from "../../i18n";
afterEach(cleanup);
describe("TextAlignMenuControl", () => {
  it("applies all six alignments and indent commands once, then restores focus", async () => {
    const user = userEvent.setup(); const onChange = vi.fn(); const onOutdent = vi.fn(); const onIndent = vi.fn();
    render(<TextAlignMenuControl value="justify" onChange={onChange} onOutdent={onOutdent} onIndent={onIndent} />);
    const trigger = screen.getByRole("button", { name: "Justify Align" });
    for (const label of ["Left Align", "Center Align", "Right Align", "Justify Align", "Start Align", "End Align", "Outdent", "Indent"]) {
      await user.click(trigger);
      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      await user.click(screen.getByRole(label.endsWith("Align") ? "menuitemradio" : "menuitem", { name: new RegExp(`^${label}`) }));
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
      await waitFor(() => expect(document.activeElement).toBe(trigger));
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
    }
    expect(onChange.mock.calls.map(([value]) => value)).toEqual(["left", "center", "right", "justify", "start", "end"]);
    expect(onOutdent).toHaveBeenCalledTimes(1); expect(onIndent).toHaveBeenCalledTimes(1);
  });
  it("keeps the active alignment under host control and exposes one selected option", async () => {
    const user = userEvent.setup(); const onChange = vi.fn();
    const { rerender } = render(<TextAlignMenuControl value="center" onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: "Center Align" }));
    expect(screen.getByRole("menuitemradio", { name: /^Center Align/ }).getAttribute("aria-checked")).toBe("true");
    expect(screen.getAllByRole("menuitemradio").filter(item => item.getAttribute("aria-checked") === "true")).toHaveLength(1);
    await user.click(screen.getByRole("menuitemradio", { name: /^Start Align/ }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith("start");
    expect(screen.getByRole("button", { name: "Center Align" })).toBeTruthy();
    rerender(<TextAlignMenuControl value="start" onChange={onChange} />);
    expect(screen.getByRole("button", { name: "Start Align" })).toBeTruthy();
  });
  it("disables missing callbacks and host-restricted indent commands", async () => {
    const user = userEvent.setup(); const onIndent = vi.fn();
    render(<TextAlignMenuControl onIndent={onIndent} canIndent={false} />);
    await user.click(screen.getByRole("button", { name: "Left Align" }));
    for (const item of [...screen.getAllByRole("menuitemradio"), ...screen.getAllByRole("menuitem")]) expect(item.getAttribute("aria-disabled")).toBe("true");
    await user.click(screen.getByRole("menuitem", { name: /^Indent/ })); expect(onIndent).not.toHaveBeenCalled();
  });
  it("opens by keyboard, skips unavailable indentation, and returns focus on Escape", async () => {
    const user = userEvent.setup(); render(<TextAlignMenuControl onChange={() => {}} onIndent={() => {}} />);
    const trigger = screen.getByRole("button", { name: "Left Align" }); trigger.focus();
    await user.keyboard("{ArrowDown}"); expect(screen.getByRole("menu")).toBeTruthy();
    await user.keyboard("{End}"); expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: /^Indent/ }));
    await user.keyboard("{Escape}"); await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
  it("prevents disabled activation and forwards native trigger refs/styles", async () => {
    const user = userEvent.setup(); const ref = createRef<HTMLButtonElement>();
    render(<TextAlignMenuControl ref={ref} disabled className="host-align" style={{ marginInline: 2 }} />);
    const trigger = screen.getByRole("button", { name: "Left Align" });
    expect(ref.current).toBe(trigger); expect(trigger.classList.contains("host-align")).toBe(true);
    await user.click(trigger); expect(screen.queryByRole("menu")).toBeNull();
  });
  it("uses translated labels and preserves the RTL dark scope in the portaled menu", async () => {
    const user = userEvent.setup(); const t = vi.fn((_key, options) => `Translated ${options.defaultMessage}`);
    render(<SGTranslationProvider value={{ locale: "ar", t, useNamespace: () => {} }}><Provider theme="dark">
      <TextAlignMenuControl value="start" onChange={() => {}} />
    </Provider></SGTranslationProvider>);
    await user.click(screen.getByRole("button", { name: "Translated Start Align" }));
    const menu = screen.getByRole("menu", { name: "Translated Text alignment" });
    expect(menu.closest('[dir="rtl"]')).toBeTruthy(); expect(menu.closest('[data-sgui-theme="dark"]')).toBeTruthy();
    expect(screen.getByRole("menuitemradio", { name: "Translated Start Align" }).querySelector('[data-align="start"]')).toBeTruthy();
    expect(t).toHaveBeenCalledWith("common.ui.editor.align.start", { defaultMessage: "Start Align" });
  });
  for (const dir of ["ltr", "rtl"] as const) {
    it(`${dir} replaces the checked host value while open without issuing a command`, async () => {
      const user = userEvent.setup(); const onChange = vi.fn(); const onOutdent = vi.fn();
      const control = (value: "start" | "end") => <Provider dir={dir}>
        <TextAlignMenuControl value={value} onChange={onChange} onOutdent={onOutdent} canOutdent={false} />
      </Provider>;
      const { rerender } = render(control("start"));
      const trigger = screen.getByRole("button", { name: "Start Align" });
      trigger.focus(); await user.keyboard("{ArrowDown}");
      rerender(control("end"));
      expect(screen.getByRole("menuitemradio", { name: "Start Align" }).getAttribute("aria-checked")).toBe("false");
      const end = screen.getByRole("menuitemradio", { name: "End Align" });
      expect(end.getAttribute("aria-checked")).toBe("true");
      expect(screen.getAllByRole("menuitemradio").filter(item => item.getAttribute("aria-checked") === "true")).toHaveLength(1);
      await user.keyboard("{End}"); expect(document.activeElement).toBe(end);
      await user.keyboard("{ArrowDown}"); expect(document.activeElement).toBe(screen.getByRole("menuitemradio", { name: "Left Align" }));
      await user.keyboard("{ArrowUp}"); expect(document.activeElement).toBe(end);
      await user.keyboard("{Escape}"); await waitFor(() => expect(document.activeElement).toBe(trigger));
      expect(trigger.getAttribute("aria-label")).toBe("End Align");
      expect(onChange).not.toHaveBeenCalled(); expect(onOutdent).not.toHaveBeenCalled();
    });
  }

});
