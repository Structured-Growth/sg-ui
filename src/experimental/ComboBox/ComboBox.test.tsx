// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComboBox } from "./ComboBox";
afterEach(cleanup);
const options = [{ id: "science", label: "Science" }, { id: "math", label: "Mathematics" }, { id: "archived", label: "Archived", disabled: true }];
describe("owned combobox proof", () => {
  it("filters options and commits the owned string ID with keyboard selection", async () => {
    const user = userEvent.setup(); const change = vi.fn();
    render(<form data-testid="form"><ComboBox label="Category" options={options} name="category" onValueChange={change} /></form>);
    const input = screen.getByRole("combobox", { name: "Category" });
    await user.type(input, "Sci");
    expect(await screen.findByRole("option", { name: "Science" })).toBeTruthy();
    expect(screen.queryByRole("option", { name: "Mathematics" })).toBeNull();
    await user.keyboard("{ArrowDown}{Enter}");
    await waitFor(() => expect(change).toHaveBeenLastCalledWith("science"));
    expect((input as HTMLInputElement).value).toBe("Science");
    expect(new FormData(screen.getByTestId("form") as HTMLFormElement).get("category")).toBe("science");
  });
  it("prevents choosing disabled options and exposes descriptions and validation", async () => {
    const user = userEvent.setup(); const change = vi.fn();
    render(<ComboBox label="Category" options={options} invalid errorMessage="Choose a category" description="Host options" onValueChange={change} />);
    await user.click(screen.getByRole("button", { name: "Show options Category" }));
    const disabled = await screen.findByRole("option", { name: "Archived" });
    expect(disabled.getAttribute("aria-disabled")).toBe("true");
    await user.click(disabled);
    expect(change).not.toHaveBeenCalled();
    const input = screen.getByRole("combobox");
    const text = input.getAttribute("aria-describedby")!.split(" ").map(id => document.getElementById(id)?.textContent).join(" ");
    expect(text).toContain("Host options"); expect(text).toContain("Choose a category");
  });
  it("shows a translated empty state and prevents editing disabled or read-only fields", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<ComboBox label="Category" options={[]} />);
    await user.click(screen.getByRole("button", { name: "Show options Category" }));
    expect(await screen.findByText("No options found")).toBeTruthy();
    await user.keyboard("{Escape}");
    rerender(<ComboBox label="Category" options={options} disabled />);
    expect((screen.getByRole("combobox") as HTMLInputElement).disabled).toBe(true);
    rerender(<ComboBox label="Category" options={options} readOnly defaultValue="science" />);
    const input = screen.getByRole("combobox") as HTMLInputElement;
    expect(input.readOnly).toBe(true);
    const previous = input.value;
    await user.type(input, "Changed"); expect(input.value).toBe(previous);
  });
});
