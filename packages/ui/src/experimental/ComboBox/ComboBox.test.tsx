// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SGTranslationProvider } from "../../i18n";
import { Provider } from "../Provider/Provider";
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
it("uses IDs rather than labels and accepts host updates including controlled null", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const sameLabels = [{ id: "01", label: "Same" }, { id: "1", label: "Same" }];
  const { rerender } = render(<form data-testid="identity"><ComboBox label="Identity" name="identity" options={sameLabels} value="01" onValueChange={change} /></form>);
  expect(new FormData(screen.getByTestId("identity") as HTMLFormElement).get("identity")).toBe("01");
  rerender(<form data-testid="identity"><ComboBox label="Identity" name="identity" options={[{ id: "01", label: "Renamed" }, sameLabels[1]!]} value="01" onValueChange={change} /></form>);
  expect((screen.getByRole("combobox") as HTMLInputElement).value).toBe("Renamed");
  rerender(<form data-testid="identity"><ComboBox label="Identity" name="identity" options={sameLabels} value={null} onValueChange={change} /></form>);
  expect((screen.getByRole("combobox") as HTMLInputElement).value).toBe("");
  await user.click(screen.getByRole("button"));
  await user.click(screen.getAllByRole("option", { name: "Same" })[1]!);
  expect(change).toHaveBeenLastCalledWith("1");
  expect(new FormData(screen.getByTestId("identity") as HTMLFormElement).get("identity")).toBe("");
});
it("isolates instances and resets an uncontrolled selection to its default", async () => {
  const user = userEvent.setup();
  render(<form data-testid="pair"><ComboBox label="First" options={options} name="first" defaultValue="science" /><ComboBox label="Second" options={options} name="second" defaultValue="math" /><button type="reset">Reset pair</button></form>);
  await user.click(screen.getByRole("button", { name: "Show options First" }));
  await user.click(screen.getByRole("option", { name: "Mathematics" }));
  const form = screen.getByTestId("pair") as HTMLFormElement;
  expect(new FormData(form).get("first")).toBe("math");
  expect(new FormData(form).get("second")).toBe("math");
  await user.click(screen.getByRole("button", { name: "Reset pair" }));
  await waitFor(() => expect(new FormData(form).get("first")).toBe("science"));
  expect(new FormData(form).get("second")).toBe("math");
  expect(screen.getByRole("combobox", { name: "First" }).id).not.toBe(screen.getByRole("combobox", { name: "Second" }).id);
});
it("keeps the controlled host label when the host declines a selection request", async () => {
 const user = userEvent.setup(); const change = vi.fn();
 render(<ComboBox label="Controlled" options={options} value="science" onValueChange={change} />);
 await user.click(screen.getByRole("button")); await user.click(screen.getByRole("option", { name: "Mathematics" }));
 expect(change).toHaveBeenLastCalledWith("math");
 expect((screen.getByRole("combobox") as HTMLInputElement).value).toBe("Science");
});

it("keeps Turkish locale filtering while its popup uses an RTL visual override", async () => {
  const user = userEvent.setup();
  render(<SGTranslationProvider value={{ locale: "tr-TR", t: (_key, options) => options.defaultMessage, useNamespace: () => {} }}>
    <Provider dir="rtl"><ComboBox label="City" options={[{ id: "isparta", label: "Isparta" }, { id: "istanbul", label: "İstanbul" }]} /></Provider>
  </SGTranslationProvider>);
  await user.type(screen.getByRole("combobox"), "ı");
  expect(await screen.findByRole("option", { name: "Isparta" })).toBeTruthy();
  expect(screen.queryByRole("option", { name: "İstanbul" })).toBeNull();
  expect(screen.getByRole("listbox").closest("[data-sgui-scope]")?.getAttribute("dir")).toBe("rtl");
  await user.keyboard("{ArrowDown}{Enter}");
  expect((screen.getByRole("combobox") as HTMLInputElement).value).toBe("Isparta");
});
