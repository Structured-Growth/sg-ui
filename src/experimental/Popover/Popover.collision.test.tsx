// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CollisionFixture } from "./Popover.collision.stories";

afterEach(cleanup);
for (const placement of ["bottom start", "bottom end", "top start", "top end"] as const) {
  it(`${placement} composes named keyboard controls in the owned portal scope`, async () => {
    const user = userEvent.setup();
    render(<CollisionFixture placement={placement} theme="dark" dir="rtl" enlarged host />);
    const trigger = screen.getByRole("button", { name: "Open settings" });
    trigger.focus();
    await user.keyboard("{Enter}");
    const dialog = await screen.findByRole("dialog", { name: "Collision settings" });
    const scope = dialog.closest("[data-sgui-scope]")!;
    expect(scope.getAttribute("data-sgui-theme")).toBe("dark");
    expect(scope.getAttribute("dir")).toBe("rtl");
    expect((scope as HTMLElement).style.getPropertyValue("--sgui-body-size")).toBe("1.5rem");
    expect(screen.getByTestId("collision-host").contains(dialog)).toBe(false);
    await user.keyboard("{Tab}");
    expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Note" }));
    await user.type(screen.getByRole("textbox", { name: "Note" }), "Draft");
    await user.keyboard("{Tab}");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Review note" }));
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
}
