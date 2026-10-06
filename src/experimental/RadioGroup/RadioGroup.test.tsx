// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { RadioGroup } from "./RadioGroup";
afterEach(cleanup);
const options = [{ value: "self", label: "Self paced" }, { value: "locked", label: "Unavailable", disabled: true }, { value: "live", label: "Live" }];
it("supports arrow selection, disabled skipping, native submission and reset", async () => {
 const change = vi.fn(); const user = userEvent.setup(); const { container } = render(<form><RadioGroup label="Delivery" name="delivery" options={options} defaultValue="self" onValueChange={change} /><button type="reset">Reset</button></form>);
 expect(screen.getByRole("radiogroup", { name: "Delivery" })).toBeDefined(); await user.tab(); await user.keyboard("{ArrowDown}");
 expect(document.activeElement).toBe(screen.getByRole("radio", { name: "Live" })); expect(change).toHaveBeenCalledExactlyOnceWith("live");
 expect(new FormData(container.querySelector('form')!).get("delivery")).toBe("live"); await user.click(screen.getByRole("button"));
 expect((screen.getByRole("radio", { name: "Self paced" }) as HTMLInputElement).checked).toBe(true);
});
it("preserves controlled/read-only state and associates descriptions and validation", async () => {
 const change = vi.fn(); const user = userEvent.setup(); const { rerender } = render(<RadioGroup label="Delivery" options={options} value="self" onValueChange={change} invalid description="Choose a format" errorMessage="Not available" />);
 const group = screen.getByRole("radiogroup"); expect(group.getAttribute("aria-describedby")).toBeTruthy(); expect(group.getAttribute("aria-invalid")).toBe("true"); expect(screen.getByText("Not available")).toBeDefined();
 await user.click(screen.getByRole("radio", { name: "Live" })); expect(change).toHaveBeenCalledWith("live"); expect((screen.getByRole("radio", { name: "Self paced" }) as HTMLInputElement).checked).toBe(true);
 change.mockClear(); rerender(<RadioGroup label="Delivery" options={options} value="self" readOnly onValueChange={change} />); await user.click(screen.getByRole("radio", { name: "Live" })); expect(change).not.toHaveBeenCalled();
});
