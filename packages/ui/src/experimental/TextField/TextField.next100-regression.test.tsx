// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { TextField } from "./TextField";
import { ThemeScope } from "../../foundation/ThemeScope";

afterEach(cleanup);

it("isolates field edits and form resets, and discards a pending reset on unmount", async () => {
  const user = userEvent.setup();
  const firstChange = vi.fn();
  const secondChange = vi.fn();
  const firstRef = createRef<HTMLInputElement>();
  const secondRef = createRef<HTMLInputElement>();
  const fields = (firstKey: string) => <ThemeScope>
    <form data-testid="first-form">
      <TextField key={firstKey} ref={firstRef} label="First course" name="course"
        defaultValue={firstKey === "original" ? "First" : "Replacement"} onValueChange={firstChange} />
    </form>
    <form data-testid="second-form">
      <TextField ref={secondRef} label="Second course" name="course" defaultValue="Second" onValueChange={secondChange} />
    </form>
  </ThemeScope>;
  const { rerender } = render(fields("original"));
  await user.type(screen.getByRole("textbox", { name: "First course" }), " edit");
  expect(firstChange).toHaveBeenLastCalledWith("First edit");
  expect(secondChange).not.toHaveBeenCalled();
  await user.type(screen.getByRole("textbox", { name: "Second course" }), " edit");
  expect(secondChange).toHaveBeenLastCalledWith("Second edit");
  firstChange.mockClear(); secondChange.mockClear();
  const firstForm = screen.getByTestId("first-form") as HTMLFormElement;
  const secondForm = screen.getByTestId("second-form") as HTMLFormElement;
  act(() => firstForm.reset());
  await waitFor(() => expect(firstRef.current?.value).toBe("First"));
  expect(new FormData(secondForm).get("course")).toBe("Second edit");
  expect(firstChange).not.toHaveBeenCalled(); expect(secondChange).not.toHaveBeenCalled();

  // A reset schedules deferred restoration. Replacing the field must dispose it,
  // while retaining the neighboring instance and its edited value.
  const oldInput = firstRef.current;
  const survivingInput = secondRef.current;
  act(() => { firstForm.reset(); rerender(fields("replacement")); });
  await act(async () => { await new Promise(resolve => setTimeout(resolve, 10)); });
  expect(oldInput?.isConnected).toBe(false);
  expect(firstRef.current).not.toBe(oldInput);
  expect(firstRef.current?.value).toBe("Replacement");
  expect(secondRef.current).toBe(survivingInput);
  expect(secondRef.current?.value).toBe("Second edit");
  expect(firstChange).not.toHaveBeenCalled(); expect(secondChange).not.toHaveBeenCalled();
  act(() => secondForm.reset());
  await waitFor(() => expect(secondRef.current?.value).toBe("Second"));
  expect(firstRef.current?.value).toBe("Replacement");
  expect(firstChange).not.toHaveBeenCalled(); expect(secondChange).not.toHaveBeenCalled();
});
