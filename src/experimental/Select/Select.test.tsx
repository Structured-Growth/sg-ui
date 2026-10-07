// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { Select } from "./Select";
afterEach(cleanup);
const options = [{ id: "draft", label: "Draft" }, { id: "locked", label: "Unavailable", disabled: true }, { id: "active", label: "Active" }];
it("selects string IDs by keyboard, skips disabled options, restores focus and resets native values", async () => {
 const ref = createRef<HTMLButtonElement>(); const change = vi.fn(); const user = userEvent.setup();
 const { container } = render(<form><Select ref={ref} label="Status" name="status" defaultValue="draft" options={options} onValueChange={change} /><button type="reset">Reset</button></form>);
 await user.tab(); expect(document.activeElement).toBe(ref.current); await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");
 expect(change).toHaveBeenLastCalledWith("active"); expect(new FormData(container.querySelector('form')!).get("status")).toBe("active");
 await waitFor(() => expect(document.activeElement).toBe(ref.current));
 await user.click(screen.getByRole("button", { name: "Reset" })); expect(new FormData(container.querySelector('form')!).get("status")).toBe("draft");
});
it("keeps controlled selection with the host and blocks read-only opening", async () => {
 const user = userEvent.setup(); const change = vi.fn(); const { rerender } = render(<Select label="Status" options={options} value="draft" onValueChange={change} />);
 await user.click(screen.getByRole("button")); await user.click(screen.getByRole("option", { name: "Active" })); expect(change).toHaveBeenCalledWith("active"); expect(screen.getByRole("button").textContent).toContain("Draft");
 rerender(<Select label="Status" options={options} value="draft" readOnly onValueChange={change} />); await user.click(screen.getByRole("button")); expect(screen.queryByRole("listbox")).toBeNull();
});
it("associates validation and descriptions and renders empty collections", async () => {
 const user = userEvent.setup(); render(<Select label="Status" options={[]} invalid description="Choose status" errorMessage="Required" />);
 expect(screen.getByText("Required")).toBeDefined(); expect(screen.getByRole("button").getAttribute("aria-describedby")).toBeTruthy();
 await user.click(screen.getByRole("button")); expect(screen.getByText("Choose status No options found")).toBeDefined();
 expect(screen.queryByRole("listbox")).toBeNull();
});
it("keeps duplicate labels distinct by string ID and isolates default/controlled selections", async () => {
 const user = userEvent.setup(); const change = vi.fn();
 const sameLabels = [{ id: "01", label: "Same" }, { id: "1", label: "Same" }];
 const { rerender } = render(<form data-testid="pair"><Select label="First" name="first" options={sameLabels} defaultValue="01" /><Select label="Second" name="second" options={sameLabels} value={null} onValueChange={change} /></form>);
 await user.click(screen.getByRole("button", { name: /First/ }));
 await user.click(screen.getAllByRole("option", { name: "Same" })[1]!);
 const form = screen.getByTestId("pair") as HTMLFormElement;
 expect(new FormData(form).get("first")).toBe("1"); expect(new FormData(form).get("second")).toBe("");
 await user.click(screen.getByRole("button", { name: /Second/ }));
 await user.click(screen.getAllByRole("option", { name: "Same" })[0]!);
 expect(change).toHaveBeenLastCalledWith("01"); expect(new FormData(form).get("second")).toBe("");
 rerender(<form data-testid="pair"><Select label="First" name="first" options={sameLabels} defaultValue="01" /><Select label="Second" name="second" options={[{ id: "01", label: "Renamed" }]} value="01" onValueChange={change} /></form>);
 expect(screen.getByRole("button", { name: /Second/ }).textContent).toContain("Renamed");
 expect(new FormData(form).get("second")).toBe("01");
});
