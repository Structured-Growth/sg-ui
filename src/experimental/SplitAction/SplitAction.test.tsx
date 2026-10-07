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
