// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { RadioGroup } from "./RadioGroup";
afterEach(cleanup);
it("requires an enabled choice when the host selection is disabled and restores the latest form name on enabling", () => {
 const change = vi.fn();
 const view = (disabled: boolean, name: string) => <form><RadioGroup label="Delivery" name={name} value="self" required onValueChange={change}
  options={[{ value: "self", label: "Self paced", disabled }, { value: "live", label: "Live" }]} /></form>;
 const { container, rerender } = render(view(true, "delivery"));
 const form = container.querySelector("form")!;
 expect((screen.getByRole("radio", { name: "Self paced" }) as HTMLInputElement).checked).toBe(true);
 expect(form.checkValidity()).toBe(false);
 expect(new FormData(form).has("delivery")).toBe(false);
 rerender(view(true, "currentDelivery"));
 rerender(view(false, "currentDelivery"));
 expect(form.checkValidity()).toBe(true);
 expect(Object.fromEntries(new FormData(form))).toEqual({ currentDelivery: "self" });
 expect(change).not.toHaveBeenCalled();
});
it("keeps generated names independent and stable through option changes", () => {
 const view = (disabled: boolean) => <form>
  <RadioGroup label="First" value="self" options={[{ value: "self", label: "First self", disabled }, { value: "live", label: "First live" }]} />
  <RadioGroup label="Second" value="self" options={[{ value: "self", label: "Second self" }, { value: "live", label: "Second live" }]} />
 </form>;
 const { container, rerender } = render(view(false));
 const first = screen.getByRole("radio", { name: "First self" }) as HTMLInputElement;
 const second = screen.getByRole("radio", { name: "Second self" }) as HTMLInputElement;
 const names = [first.name, second.name];
 expect(names[0]).toBeTruthy(); expect(names[1]).toBeTruthy(); expect(names[0]).not.toBe(names[1]);
 rerender(view(true));
 expect(Object.fromEntries(new FormData(container.querySelector("form")!))).toEqual({ [names[1]]: "self" });
 rerender(view(false));
 expect([first.name, second.name]).toEqual(names);
 expect(Object.fromEntries(new FormData(container.querySelector("form")!))).toEqual({ [names[0]]: "self", [names[1]]: "self" });
});
it.each(["removed", "disabled"])("keeps an enabled Tab entry after the selected option is %s without requesting a host change", async transition => {
 const change = vi.fn(); const user = userEvent.setup();
 const available = [{ value: "self", label: "Self paced" }, { value: "live", label: "Live" }];
 const view = (items: typeof available) => <><button>Before group</button><RadioGroup label="Delivery" name="delivery" options={items} value="self" onValueChange={change} required /><button>After group</button></>;
 const { rerender } = render(view(available));
 rerender(view(transition === "removed" ? available.slice(1) : available.map(option => ({ ...option, disabled: option.value === "self" }))));
 await user.click(screen.getByRole("button", { name: "Before group" })); await user.tab();
 expect(document.activeElement).toBe(screen.getByRole("radio", { name: "Live" }));
 expect(change).not.toHaveBeenCalled();
 await user.keyboard(" "); expect(change).toHaveBeenCalledExactlyOnceWith("live");
});
it("retains an uncontrolled removed selection for restoration and keeps group names independent", async () => {
 const change = vi.fn(); const user = userEvent.setup();
 const view = (remove: boolean) => <form><button type="button">Before delivery</button>
  <RadioGroup label="Delivery" name="delivery" options={remove ? options.slice(2) : options} defaultValue="self" onValueChange={change} required />
  <RadioGroup label="Backup" name="backup" options={[{ value: "self", label: "Backup self" }, { value: "live", label: "Backup live" }]} defaultValue="self" />
 </form>;
 const { rerender, container } = render(view(false)); rerender(view(true));
 expect(new FormData(container.querySelector("form")!).get("delivery")).toBeNull();
 expect(new FormData(container.querySelector("form")!).get("backup")).toBe("self");
 await user.click(screen.getByRole("button", { name: "Before delivery" })); await user.tab();
 expect(document.activeElement).toBe(screen.getByRole("radio", { name: "Live" }));
 rerender(view(false));
 expect((screen.getByRole("radio", { name: "Self paced" }) as HTMLInputElement).checked).toBe(true);
 expect(new FormData(container.querySelector("form")!).get("delivery")).toBe("self");
 expect(change).not.toHaveBeenCalled();
});
it("honors an explicit controlled empty value after reset and leaves required validity native", async () => {
 const user = userEvent.setup(); const change = vi.fn();
 const view = (value: string | null) => <form><RadioGroup label="Delivery" name="delivery" options={options} value={value} onValueChange={change} required /><button type="reset">Reset</button></form>;
 const { rerender, container } = render(view("live")); await user.click(screen.getByRole("button"));
 expect((screen.getByRole("radio", { name: "Live" }) as HTMLInputElement).checked).toBe(true);
 rerender(view(null));
 expect(container.querySelector("form")!.checkValidity()).toBe(false);
 expect(new FormData(container.querySelector("form")!).has("delivery")).toBe(false);
 rerender(view("self"));
 expect(container.querySelector("form")!.checkValidity()).toBe(true);
});
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
