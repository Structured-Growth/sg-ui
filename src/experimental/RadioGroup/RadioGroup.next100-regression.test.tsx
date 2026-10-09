// @vitest-environment jsdom
import { createRef, useState } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { RadioGroup, Provider, type RadioGroupProps } from "../index";

afterEach(cleanup);

it("wires the public native ref and controlled string callback in a scoped host form", async () => {
  const ref = createRef<HTMLDivElement>();
  const change = vi.fn();
  const options: RadioGroupProps["options"] = [
    { value: "course/self", label: "Self paced" },
    { value: "course/live", label: "Live" },
  ];
  function Host() {
    const [value, setValue] = useState("course/self");
    const onValueChange: NonNullable<RadioGroupProps["onValueChange"]> = next => {
      change(next);
      setValue(next);
    };
    return <Provider><form><RadioGroup ref={ref} label="Delivery" name="delivery"
      options={options} value={value} onValueChange={onValueChange}
      className="host-delivery" style={{ marginTop: 8 }} /></form></Provider>;
  }
  const user = userEvent.setup();
  const { container, unmount } = render(<Host />);
  expect(ref.current).toBe(screen.getByRole("radiogroup", { name: "Delivery" }));
  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(ref.current?.classList.contains("host-delivery")).toBe(true);
  expect(ref.current?.style.marginTop).toBe("8px");
  await user.click(screen.getByRole("radio", { name: "Live" }));
  expect(change).toHaveBeenCalledExactlyOnceWith("course/live");
  expect((screen.getByRole("radio", { name: "Live" }) as HTMLInputElement).checked).toBe(true);
  expect(new FormData(container.querySelector("form")!).get("delivery")).toBe("course/live");
  unmount();
  expect(ref.current).toBeNull();
});
