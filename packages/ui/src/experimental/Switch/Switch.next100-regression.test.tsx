// @vitest-environment jsdom
import { createRef, useState } from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { Switch, type SwitchProps } from "../../primitives";
import { Provider } from "../Provider/Provider";

afterEach(cleanup);

it("consumes the public label ref and boolean callback with associated description", async () => {
  const ref = createRef<HTMLLabelElement>();
  const change = vi.fn<(checked: boolean) => void>();
  const props: SwitchProps = {
    label: "Weekly digest", description: "News from your courses", name: "digest", value: "weekly",
    className: "host-switch", style: { marginInlineStart: 8 },
  };
  function Preferences() {
    const [checked, setChecked] = useState(false);
    return <Provider><form><Switch {...props} ref={ref} checked={checked} onCheckedChange={next => {
      change(next); setChecked(next);
    }} /></form></Provider>;
  }
  const { container } = render(<Preferences />);
  const control = screen.getByRole("switch", { name: "Weekly digest" }) as HTMLInputElement;
  expect(ref.current?.tagName).toBe("LABEL");
  expect(ref.current?.contains(control)).toBe(true);
  expect(ref.current?.classList.contains("host-switch")).toBe(true);
  expect(ref.current?.style.marginInlineStart).toBe("8px");
  expect(document.getElementById(control.getAttribute("aria-describedby")!)?.textContent).toBe("News from your courses");
  await userEvent.setup().click(screen.getByText("Weekly digest"));
  expect(change).toHaveBeenCalledExactlyOnceWith(true);
  expect(control.checked).toBe(true);
  expect(new FormData(container.querySelector("form")!).get("digest")).toBe("weekly");
});

it("isolates form resets and remounts defaults after unmounting with a reset pending", async () => {
  const change = vi.fn();
  const user = userEvent.setup();
  const mounted = render(<Provider>
    <form aria-label="Email preferences"><Switch label="Email digest" defaultChecked onCheckedChange={change} /></form>
    <form aria-label="SMS preferences"><Switch label="SMS digest" onCheckedChange={change} /></form>
  </Provider>);
  await user.click(screen.getByText("Email digest"));
  await user.click(screen.getByText("SMS digest"));
  change.mockClear();
  fireEvent.reset(screen.getByRole("form", { name: "Email preferences" }));
  await waitFor(() => expect((screen.getByRole("switch", { name: "Email digest" }) as HTMLInputElement).checked).toBe(true));
  expect((screen.getByRole("switch", { name: "SMS digest" }) as HTMLInputElement).checked).toBe(true);
  expect(change).not.toHaveBeenCalled();
  const oldForm = screen.getByRole("form", { name: "Email preferences" });
  const removeListener = vi.spyOn(oldForm, "removeEventListener");
  fireEvent.reset(oldForm);
  mounted.unmount();
  expect(removeListener).toHaveBeenCalledWith("reset", expect.any(Function), true);
  removeListener.mockRestore();
  const fresh = render(<Provider><form aria-label="New preferences"><Switch label="Email digest" onCheckedChange={change} /></form></Provider>);
  fireEvent.reset(oldForm);
  await new Promise(resolve => setTimeout(resolve, 10));
  expect((screen.getByRole("switch", { name: "Email digest" }) as HTMLInputElement).checked).toBe(false);
  expect(change).not.toHaveBeenCalled();
  await user.click(screen.getByText("Email digest"));
  expect(change).toHaveBeenCalledExactlyOnceWith(true);
  expect((screen.getByRole("switch", { name: "Email digest" }) as HTMLInputElement).checked).toBe(true);
  fresh.unmount();
});
