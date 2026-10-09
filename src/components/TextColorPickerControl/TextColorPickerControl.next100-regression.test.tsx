// @vitest-environment jsdom
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextColorPickerControl, type TextColorPickerControlProps } from "./index";
import { ThemeScope } from "../../foundation/ThemeScope";

afterEach(cleanup);

describe("TextColorPickerControl next100 regressions", () => {
  it("labels each remaining semantic preset and moves its exclusive selected state", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ThemeScope><TextColorPickerControl value="var(--sgui-action)" onChange={onChange} /></ThemeScope>);
    await user.click(screen.getByRole("button", { name: "Text color" }));
    const group = within(await screen.findByRole("group", { name: "Theme colors" }));
    expect(group.getByRole("button", { name: "Primary", exact: true }).getAttribute("aria-pressed")).toBe("true");
    const presets = [
      ["Text", "var(--sgui-text)"], ["Muted text", "var(--sgui-text-muted)"],
      ["Primary emphasis", "var(--sgui-action-hover)"], ["Error", "var(--sgui-danger)"],
      ["Surface", "var(--sgui-surface)"], ["Subtle surface", "var(--sgui-surface-subtle)"],
    ] as const;
    for (const [label, value] of presets) {
      const swatch = group.getByRole("button", { name: label, exact: true });
      await user.click(swatch);
      expect(onChange).toHaveBeenLastCalledWith(value);
      expect(group.getAllByRole("button").filter(button => button.getAttribute("aria-pressed") === "true")).toEqual([swatch]);
      expect((screen.getByRole("textbox", { name: "Hex color" }) as HTMLInputElement).value).toBe(value);
    }
    expect(onChange).toHaveBeenCalledTimes(presets.length);
  });

  it("isolates controlled foreground/background values and discards an unmounted draft", async () => {
    const user = userEvent.setup();
    const foregroundChanged = vi.fn(); const backgroundChanged = vi.fn();
    function Host({ showForeground = true }: { showForeground?: boolean }) {
      const [foreground, setForeground] = useState("#112233");
      const [background, setBackground] = useState("#445566");
      const foregroundProps: TextColorPickerControlProps = {
        mode: "foreground", value: foreground,
        onChange: next => { foregroundChanged(next); setForeground(next); },
      };
      return <ThemeScope>
        {showForeground && <TextColorPickerControl {...foregroundProps} />}
        <TextColorPickerControl mode="background" value={background}
          onChange={next => { backgroundChanged(next); setBackground(next); }} />
      </ThemeScope>;
    }
    const { rerender } = render(<Host />);
    await user.click(screen.getByRole("button", { name: "Text color" }));
    let field = await screen.findByRole("textbox", { name: "Hex color" });
    await user.clear(field); await user.type(field, "#abcdef{Enter}");
    expect(foregroundChanged).toHaveBeenCalledExactlyOnceWith("#abcdef");
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: "Background color" }));
    field = await screen.findByRole("textbox", { name: "Hex color" });
    expect((field as HTMLInputElement).value).toBe("#445566");
    expect(backgroundChanged).not.toHaveBeenCalled();
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: "Text color" }));
    field = await screen.findByRole("textbox", { name: "Hex color" });
    await user.clear(field); await user.type(field, "#998877");
    rerender(<Host showForeground={false} />);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(foregroundChanged).toHaveBeenCalledTimes(1);
    rerender(<Host />);
    await user.click(screen.getByRole("button", { name: "Text color" }));
    expect((await screen.findByRole("textbox", { name: "Hex color" }) as HTMLInputElement).value).toBe("#abcdef");
    expect(backgroundChanged).not.toHaveBeenCalled();
  });
});
