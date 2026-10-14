// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TableCellMenu } from "./TableCellMenu";
afterEach(cleanup);
it("invokes one owned action with the original unconstrained row", async () => {
 const user = userEvent.setup(); const onPress = vi.fn(); const row = { title: "Course" };
 render(<TableCellMenu row={row} actions={[{ id: "edit", label: "Edit", onPress }]} />);
 await user.click(screen.getByRole("button")); await user.click(screen.getByRole("menuitem", { name: "Edit" }));
 expect(onPress).toHaveBeenCalledExactlyOnceWith(row);
});
