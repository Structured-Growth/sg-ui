// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DateRangeSelector, Provider, type DateRange } from "../index";

afterEach(cleanup);

it("isolates sibling drafts and Cancel callbacks and preserves the survivor after unmount", async () => {
  const user = userEvent.setup();
  const initial: DateRange = { start: "2024-02-28", end: "2024-02-29" };
  const march: DateRange = { start: "2024-03-01", end: "2024-03-31" };
  const changeA = vi.fn(); const changeB = vi.fn(); const cancelA = vi.fn(); const cancelB = vi.fn();
  const composition = (showA: boolean) => <Provider>
    {showA && <section key="a" data-testid="a"><DateRangeSelector label="First range" months={1}
      defaultValue={initial} presets={[{ id: "march", label: "March", value: march }]}
      onValueChange={changeA} onCancel={cancelA} /></section>}
    <form key="b" data-testid="b"><DateRangeSelector label="Second range" months={1}
      defaultValue={initial} name="second" presets={[{ id: "march", label: "March", value: march }]}
      onValueChange={changeB} onCancel={cancelB} /></form>
  </Provider>;
  const { rerender } = render(composition(true));
  const a = within(screen.getByTestId("a")); const b = within(screen.getByTestId("b"));
  await user.click(a.getByRole("button", { name: "March", exact: true }));
  expect(a.getByRole("status").textContent).toBe("2024-03-01 – 2024-03-31");
  expect(b.getByRole("status").textContent).toBe("2024-02-28 – 2024-02-29");
  await user.click(b.getByRole("button", { name: "March", exact: true }));
  await user.click(a.getByRole("button", { name: "Cancel", exact: true }));
  expect(cancelA).toHaveBeenCalledOnce(); expect(cancelB).not.toHaveBeenCalled();
  expect(a.getByRole("status").textContent).toBe("2024-02-28 – 2024-02-29");
  expect(b.getByRole("status").textContent).toBe("2024-03-01 – 2024-03-31");
  expect(changeA).not.toHaveBeenCalled(); expect(changeB).not.toHaveBeenCalled();
  const form = screen.getByTestId("b") as HTMLFormElement;
  expect(new FormData(form).get("second.start")).toBe(initial.start);
  rerender(composition(false));
  expect(screen.getByTestId("b")).toBe(form);
  expect(within(form).getByRole("status").textContent).toBe("2024-03-01 – 2024-03-31");
  await user.click(within(form).getByRole("button", { name: "Apply", exact: true }));
  expect(changeB).toHaveBeenCalledExactlyOnceWith(march);
  expect(new FormData(form).get("second.end")).toBe(march.end);
  expect(changeA).not.toHaveBeenCalled(); expect(cancelB).not.toHaveBeenCalled();
});
