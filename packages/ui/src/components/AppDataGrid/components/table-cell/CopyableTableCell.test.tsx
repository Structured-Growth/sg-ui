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


it.each(["{Enter}", " "])("copies escaped text with %s and preserves keyboard focus", async key => {
 const user = userEvent.setup();
 const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
 const value = '<img src=x onerror="alert(1)"> & "quoted"\nSecond line';
 const { container } = render(<CopyableTableCell value={value} truncate={false} />);
 const button = screen.getByRole("button", { name: "Copy" });
 await user.tab();
 expect(document.activeElement).toBe(button);
 await user.keyboard(key);
 expect(writeText).toHaveBeenCalledExactlyOnceWith(value);
 await waitFor(() => expect(screen.getByRole("status").textContent).toBe("Copied"));
 expect(document.activeElement).toBe(button);
 expect(container.querySelector("img")).toBeNull();
 expect(screen.getByTitle(value, { normalizer: value => value }).textContent).toBe(value);
});
