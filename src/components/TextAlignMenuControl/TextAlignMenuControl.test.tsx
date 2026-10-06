// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TextAlignMenuControl } from "./TextAlignMenuControl";

afterEach(cleanup);

describe("TextAlignMenuControl", () => {
  it("anchors the menu to the trigger and applies each alignment and indent action", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onOutdent = vi.fn();
    const onIndent = vi.fn();
    render(<TextAlignMenuControl value="justify" onChange={onChange} onOutdent={onOutdent} onIndent={onIndent} />);
    const trigger = screen.getByRole("button", { name: "Justify Align" });
    for (const label of ["Left Align", "Center Align", "Right Align", "Justify Align", "Start Align", "End Align", "Outdent", "Indent"]) {
      await user.click(trigger);
      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      await user.click(screen.getByRole("menuitem", { name: new RegExp(`^${label}`) }));
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
    }
    expect(onChange.mock.calls.map(([value]) => value)).toEqual(["left", "center", "right", "justify", "start", "end"]);
    expect(onOutdent).toHaveBeenCalledTimes(1);
    expect(onIndent).toHaveBeenCalledTimes(1);
  });

  it("opens with the keyboard and restores trigger focus on Escape", async () => {
    const user = userEvent.setup();
    render(<TextAlignMenuControl />);
    const trigger = screen.getByRole("button", { name: "Left Align" });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("menu")).toBeTruthy();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it("prevents disabled activation", async () => {
    const user = userEvent.setup();
    render(<TextAlignMenuControl disabled />);
    await user.click(screen.getByRole("button", { name: "Left Align" }));
    expect(screen.queryByRole("menu")).toBeNull();
  });
});
