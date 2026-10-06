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
