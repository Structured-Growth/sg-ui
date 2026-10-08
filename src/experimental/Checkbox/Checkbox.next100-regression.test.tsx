// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox, Provider } from "../index";

afterEach(cleanup);

it("isolates independent form resets and releases pending reset state on remount", async () => {
  const user = userEvent.setup();
  const firstChange = vi.fn();
  const secondChange = vi.fn();
  const view = render(<Provider>
    <form><Checkbox label="First approval" defaultChecked onCheckedChange={firstChange} /><button type="reset">Reset first</button></form>
    <form><Checkbox label="Second approval" onCheckedChange={secondChange} /><button type="reset">Reset second</button></form>
  </Provider>);
  const first = screen.getByRole("checkbox", { name: "First approval" }) as HTMLInputElement;
  const second = screen.getByRole("checkbox", { name: "Second approval" }) as HTMLInputElement;
  await user.click(first);
  await user.click(second);
  expect(first.checked).toBe(false);
  expect(second.checked).toBe(true);
  expect(firstChange).toHaveBeenCalledExactlyOnceWith(false);
  expect(secondChange).toHaveBeenCalledExactlyOnceWith(true);
  await user.click(screen.getByRole("button", { name: "Reset first" }));
  await waitFor(() => expect(first.checked).toBe(true));
  expect(second.checked).toBe(true);
  expect(firstChange).toHaveBeenCalledTimes(1);
  expect(secondChange).toHaveBeenCalledTimes(1);

  // Native reset schedules deferred state repair. Unmount before that task runs.
  second.form!.reset();
  view.unmount();
  const replacementChange = vi.fn();
  render(<Provider><form><Checkbox label="Second approval" onCheckedChange={replacementChange} /></form></Provider>);
  const replacement = screen.getByRole("checkbox", { name: "Second approval" }) as HTMLInputElement;
  await waitFor(() => expect(replacement.checked).toBe(false));
  await user.click(replacement);
  expect(replacement.checked).toBe(true);
  expect(replacementChange).toHaveBeenCalledExactlyOnceWith(true);
  expect(secondChange).toHaveBeenCalledTimes(1);
});
