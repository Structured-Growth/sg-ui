// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CopyableTableCell } from "./CopyableTableCell";
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
it("copies rendered text and announces clipboard failure", async () => {
 const user = userEvent.setup(); const writeText = vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("Unavailable"));
 render(<CopyableTableCell value={123} />); await user.click(screen.getByRole("button", { name: "Copy" }));
 expect(writeText).toHaveBeenCalledWith("123"); await waitFor(() => expect(screen.getByRole("status").textContent).toBe("Unable to copy"));
});
it("disables copying missing values", () => { render(<CopyableTableCell value={null} />); expect(screen.getByRole("button").hasAttribute("disabled")).toBe(true); });
