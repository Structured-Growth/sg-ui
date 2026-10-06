// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { InsertContentMenuControl } from "./InsertContentMenuControl";

afterEach(cleanup);

describe("InsertContentMenuControl", () => {
  it("opens from the native trigger and invokes insertion callbacks", async () => {
    const user = userEvent.setup();
    const onInsertImage = vi.fn();
    const onInsertHorizontalRule = vi.fn();
    const onInsertColumnsLayout = vi.fn();
    render(<InsertContentMenuControl onInsertImage={onInsertImage} onInsertHorizontalRule={onInsertHorizontalRule} onInsertColumnsLayout={onInsertColumnsLayout} />);
    const trigger = screen.getByRole("button", { name: /Insert/ });
    trigger.focus();
    await user.keyboard(" ");
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    await user.click(screen.getByRole("menuitem", { name: "Image" }));
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    await user.click(trigger);
    await user.click(screen.getByRole("menuitem", { name: "Horizontal Rule" }));
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    await user.click(trigger);
    await user.click(screen.getByRole("menuitem", { name: "Columns Layout" }));
    expect(onInsertImage).toHaveBeenCalledTimes(1);
    expect(onInsertHorizontalRule).toHaveBeenCalledTimes(1);
    expect(onInsertColumnsLayout).toHaveBeenCalledTimes(1);
  });

  it("prevents disabled insertion menu activation", async () => {
    const user = userEvent.setup();
    render(<InsertContentMenuControl disabled />);
    await user.click(screen.getByRole("button", { name: /Insert/ }));
    expect(screen.queryByRole("menu")).toBeNull();
  });
});
