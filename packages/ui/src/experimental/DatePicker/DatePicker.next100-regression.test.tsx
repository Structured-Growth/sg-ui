// @vitest-environment jsdom
import { StrictMode } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "../Provider/Provider";
import { DatePicker } from "./DatePicker";

afterEach(cleanup);

it("isolates sibling dates and form resets while an edited picker unmounts", async () => {
  const user = userEvent.setup();
  const first = vi.fn();
  const second = vi.fn();
  function Host({ showFirst = true }: { showFirst?: boolean }) {
    return <StrictMode><Provider>
      <form aria-label="First booking">
        {showFirst && <DatePicker label="First date" name="date" defaultValue="2024-02-28" onValueChange={first} />}
      </form>
      <form aria-label="Second booking">
        <DatePicker label="Second date" name="date" defaultValue="2024-03-01" onValueChange={second} />
      </form>
    </Provider></StrictMode>;
  }
  const { rerender } = render(<Host />);
  const firstForm = screen.getByRole("form", { name: "First booking" }) as HTMLFormElement;
  const secondForm = screen.getByRole("form", { name: "Second booking" }) as HTMLFormElement;
  const date = (form: HTMLFormElement) => new FormData(form).get("date");

  await user.click(screen.getByRole("button", { name: "Choose First date" }));
  await user.click(screen.getByRole("button", { name: "Thursday, February 29, 2024" }));
  expect(first).toHaveBeenCalledExactlyOnceWith("2024-02-29");
  expect(second).not.toHaveBeenCalled();
  expect(date(firstForm)).toBe("2024-02-29");
  expect(date(secondForm)).toBe("2024-03-01");

  await user.click(screen.getByRole("button", { name: "Choose Second date" }));
  await user.click(screen.getByRole("button", { name: "Saturday, March 2, 2024" }));
  expect(second).toHaveBeenCalledExactlyOnceWith("2024-03-02");
  first.mockClear(); second.mockClear();
  await act(async () => { firstForm.reset(); await new Promise(resolve => setTimeout(resolve, 10)); });
  expect(date(firstForm)).toBe("2024-02-28");
  expect(date(secondForm)).toBe("2024-03-02");
  expect(first).not.toHaveBeenCalled(); expect(second).not.toHaveBeenCalled();

  act(() => firstForm.reset());
  rerender(<Host showFirst={false} />);
  await waitFor(() => expect(screen.queryByRole("button", { name: "Choose First date" })).toBeNull());
  expect(date(secondForm)).toBe("2024-03-02");
  await user.click(screen.getByRole("button", { name: "Choose Second date" }));
  expect(screen.getByRole("button", { name: /Saturday, March 2, 2024/ }).closest("[role=gridcell]")?.getAttribute("aria-selected")).toBe("true");
  await user.click(screen.getByRole("button", { name: "Clear" }));
  expect(second).toHaveBeenCalledExactlyOnceWith(null);
  expect(first).not.toHaveBeenCalled();
  expect(date(secondForm)).toBe("");
});
