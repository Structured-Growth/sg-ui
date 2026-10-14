// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { AppInlineProgress, type AppInlineProgressProps } from "./index";
import { Provider } from "../../theme";

afterEach(cleanup);

it("isolates public progress values and widths through sibling updates and remounts", () => {
  function Host({ first, showFirst = true }: { first: AppInlineProgressProps; showFirst?: boolean }) {
    return <Provider>
      {showFirst && <section aria-label="First upload"><AppInlineProgress {...first} /></section>}
      <section aria-label="Second upload"><AppInlineProgress value={73} barWidth="50%" /></section>
    </Provider>;
  }
  const { rerender } = render(<Host first={{ value: 12, barWidth: 120 }} />);
  const second = screen.getByRole("region", { name: "Second upload" });
  const secondBar = within(second).getByRole("progressbar", { name: "Progress" });
  rerender(<Host first={{ value: 48, barWidth: 240 }} />);
  const first = screen.getByRole("region", { name: "First upload" });
  expect(within(first).getByRole("progressbar").getAttribute("aria-valuenow")).toBe("48");
  expect(within(first).getByRole("progressbar").style.inlineSize).toBe("240px");
  expect(within(first).getByText("48%")).toBeDefined();
  rerender(<Host first={{ value: 48 }} showFirst={false} />);
  expect(screen.queryByRole("region", { name: "First upload" })).toBeNull();
  expect(within(second).getByRole("progressbar")).toBe(secondBar);
  expect(secondBar.getAttribute("aria-valuenow")).toBe("73");
  expect(secondBar.style.inlineSize).toBe("50%");
  expect(within(second).getByText("73%")).toBeDefined();
  rerender(<Host first={{ value: 9 }} />);
  const remounted = screen.getByRole("region", { name: "First upload" });
  expect(within(remounted).getByRole("progressbar").getAttribute("aria-valuenow")).toBe("9");
  expect(within(remounted).getByRole("progressbar").style.inlineSize).toBe("");
  expect(within(remounted).getByText("9%")).toBeDefined();
  expect(within(second).getByRole("progressbar")).toBe(secondBar);
});
