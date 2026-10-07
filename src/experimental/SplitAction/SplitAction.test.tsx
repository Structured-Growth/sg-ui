// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { SplitAction } from "./SplitAction";
afterEach(cleanup);
it("keeps primary and secondary commands independent in a neutral joined group", async () => {
 const primary = vi.fn(); const secondary = vi.fn(); const user = userEvent.setup();
 render(<SplitAction label="Create course" items={[{ id: "import", label: "Import courses" }]} onPress={primary} onAction={secondary} />);
 const group = screen.getByRole("group", { name: "Create course" }); expect(group.dataset.joined).toBe("true");
 const button = screen.getByRole("button", { name: "Create course" }); expect(button.dataset.tone).toBe("neutral"); expect(button.dataset.variant).toBe("text");
 await user.click(button); expect(primary).toHaveBeenCalledTimes(1);
 await user.click(screen.getByRole("button", { name: "More actions" })); await user.click(screen.getByRole("menuitem", { name: "Import courses" }));
 expect(secondary).toHaveBeenCalledExactlyOnceWith("import"); expect(primary).toHaveBeenCalledTimes(1);
});
it("blocks both action paths while loading", async () => {
 const action = vi.fn(); const user = userEvent.setup(); render(<SplitAction loading label="Create" items={[]} onPress={action} onAction={action} />);
 await user.click(screen.getByRole("button", { name: "Create" })); await user.click(screen.getByRole("button", { name: "More actions" })); expect(screen.queryByRole("menu")).toBeNull(); expect(action).not.toHaveBeenCalled();
});
it.each(["loading", "disabled"] as const)("dismisses an open menu when the host sets %s and does not reopen after recovery", async state => {
 const primary = vi.fn(); const secondary = vi.fn(); const user = userEvent.setup();
 const props = { label: "Create", items: [{ id: "import", label: "Import" }], onPress: primary, onAction: secondary };
 const { rerender } = render(<SplitAction {...props} />);
 await user.click(screen.getByRole("button", { name: "More actions" }));
 expect(screen.getByRole("menu")).toBeDefined();
 rerender(<SplitAction {...props} {...{ [state]: true }} />);
 expect(screen.queryByRole("menu")).toBeNull();
 rerender(<SplitAction {...props} />);
 expect(screen.queryByRole("menu")).toBeNull();
 expect(primary).not.toHaveBeenCalled(); expect(secondary).not.toHaveBeenCalled();
 await user.click(screen.getByRole("button", { name: "More actions" }));
 await user.click(screen.getByRole("menuitem", { name: "Import" }));
 expect(secondary).toHaveBeenCalledExactlyOnceWith("import");
});
it("uses replacement host items and callbacks in the existing open menu", async () => {
 const oldPrimary = vi.fn(); const oldSecondary = vi.fn(); const primary = vi.fn(); const secondary = vi.fn(); const user = userEvent.setup();
 const { rerender } = render(<SplitAction label="Create" items={[{ id: "old", label: "Old action" }]} onPress={oldPrimary} onAction={oldSecondary} />);
 const trigger = screen.getByRole("button", { name: "More actions" });
 await user.click(trigger);
 rerender(<SplitAction label="Create" items={[{ id: "new", label: "New action" }]} onPress={primary} onAction={secondary} />);
 expect(trigger.isConnected).toBe(true);
 expect(screen.queryByRole("menuitem", { name: "Old action" })).toBeNull();
 await user.click(screen.getByRole("menuitem", { name: "New action" }));
 await user.click(screen.getByRole("button", { name: "Create" }));
 expect(secondary).toHaveBeenCalledExactlyOnceWith("new"); expect(primary).toHaveBeenCalledTimes(1);
 expect(oldPrimary).not.toHaveBeenCalled(); expect(oldSecondary).not.toHaveBeenCalled();
});
it.each([
 { disabled: true, loading: false },
 { disabled: false, loading: true },
 { disabled: true, loading: true },
])("blocks primary and secondary pointer/keyboard activation for %j", async state => {
 const primary = vi.fn(); const secondary = vi.fn(); const user = userEvent.setup();
 render(<SplitAction {...state} label="Create" items={[{ id: "import", label: "Import" }]} onPress={primary} onAction={secondary} />);
 const primaryButton = screen.getByRole("button", { name: "Create" });
 const menuButton = screen.getByRole("button", { name: "More actions" });
 await user.click(primaryButton); await user.click(menuButton);
 primaryButton.focus(); await user.keyboard("{Enter} ");
 menuButton.focus(); await user.keyboard("{ArrowDown}{Enter}");
 expect(screen.queryByRole("menu")).toBeNull();
 expect(primary).not.toHaveBeenCalled(); expect(secondary).not.toHaveBeenCalled();
});
