// @vitest-environment jsdom
import { createRef } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DateField } from "../index";
import { Provider } from "../Provider/Provider";

afterEach(cleanup);

it("isolates date drafts and form resets through sibling unmount and fresh remount", async () => {
  const user = userEvent.setup();
  const firstChange = vi.fn();
  const secondChange = vi.fn();
  const firstRef = createRef<HTMLDivElement>();
  const secondRef = createRef<HTMLDivElement>();
  const content = (showFirst: boolean) => <Provider>
    {showFirst && <form aria-label="First date form">
      <DateField ref={firstRef} label="First date" name="date" defaultValue="2024-02-28" onValueChange={firstChange} />
    </form>}
    <form aria-label="Second date form">
      <DateField ref={secondRef} label="Second date" name="date" defaultValue="2025-03-12" onValueChange={secondChange} />
    </form>
  </Provider>;
  const { rerender } = render(content(true));
  const firstForm = screen.getByRole("form", { name: "First date form" }) as HTMLFormElement;
  const secondForm = screen.getByRole("form", { name: "Second date form" }) as HTMLFormElement;
  const secondRoot = secondRef.current;
  const firstDay = within(firstForm).getByRole("spinbutton", { name: /day/ });
  const secondDay = within(secondForm).getByRole("spinbutton", { name: /day/ });
  await user.click(firstDay); await user.keyboard("{ArrowUp}");
  expect(firstChange).toHaveBeenLastCalledWith("2024-02-29");
  expect(new FormData(secondForm).get("date")).toBe("2025-03-12");
  expect(secondChange).not.toHaveBeenCalled();
  await user.click(secondDay); await user.keyboard("{ArrowUp}");
  expect(secondChange).toHaveBeenLastCalledWith("2025-03-13");
  firstChange.mockClear(); secondChange.mockClear();
  act(() => firstForm.reset());
  await waitFor(() => expect(new FormData(firstForm).get("date")).toBe("2024-02-28"));
  expect(new FormData(secondForm).get("date")).toBe("2025-03-13");
  rerender(content(false));
  expect(firstRef.current).toBeNull();
  act(() => firstForm.reset());
  expect(secondRef.current).toBe(secondRoot);
  expect(new FormData(secondForm).get("date")).toBe("2025-03-13");
  act(() => secondForm.reset());
  await waitFor(() => expect(new FormData(secondForm).get("date")).toBe("2025-03-12"));
  rerender(content(true));
  expect(new FormData(screen.getByRole("form", { name: "First date form" }) as HTMLFormElement).get("date")).toBe("2024-02-28");
  expect(firstChange).not.toHaveBeenCalled();
  expect(secondChange).not.toHaveBeenCalled();
});
