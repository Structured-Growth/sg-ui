// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { Provider } from "../../experimental/Provider/Provider";
import { DataToolbar, type DataToolbarProps } from "./index";

afterEach(cleanup);

it("isolates sibling search state and callbacks, and resets only the replaced toolbar", async () => {
  const user = userEvent.setup();
  const firstSearch = vi.fn(), secondSearch = vi.fn(), firstView = vi.fn(), secondView = vi.fn();
  const bare: DataToolbarProps = { showColumnsButton: false, showSortButton: false, showFilterButton: false };
  const host = (firstKey: string) => <Provider>
    <DataToolbar key={firstKey} {...bare} aria-label="First courses" onSearchValueChange={firstSearch}
      viewMode="list" onViewModeChange={firstView} />
    <DataToolbar key="second" {...bare} aria-label="Second courses" onSearchValueChange={secondSearch}
      viewMode="cards" onViewModeChange={secondView} />
  </Provider>;
  const { rerender } = render(host("original"));
  const first = within(screen.getByRole("group", { name: "First courses" }));
  const second = within(screen.getByRole("group", { name: "Second courses" }));
  await user.click(first.getByRole("button", { name: "Search" }));
  await user.type(first.getByRole("searchbox"), "a");
  expect(second.queryByRole("searchbox")).toBeNull();
  expect(secondSearch).not.toHaveBeenCalled();
  await user.click(second.getByRole("button", { name: "Search" }));
  await user.type(second.getByRole("searchbox"), "b");
  expect(first.getByRole("searchbox")).toHaveProperty("value", "a");
  expect(firstSearch).toHaveBeenCalledExactlyOnceWith("a");
  expect(secondSearch).toHaveBeenCalledExactlyOnceWith("b");
  await user.click(first.getByRole("button", { name: "Cards" }));
  expect(firstView).toHaveBeenCalledExactlyOnceWith("cards");
  expect(secondView).not.toHaveBeenCalled();
  expect(first.getByRole("button", { name: "Cards" }).getAttribute("aria-pressed")).toBe("false");
  rerender(host("replacement"));
  const replacement = within(screen.getByRole("group", { name: "First courses" }));
  expect(replacement.queryByRole("searchbox")).toBeNull();
  expect(second.getByRole("searchbox")).toHaveProperty("value", "b");
  await user.click(replacement.getByRole("button", { name: "Search" }));
  expect(replacement.getByRole("searchbox")).toHaveProperty("value", "");
  expect(firstSearch).toHaveBeenCalledTimes(1);
  expect(secondSearch).toHaveBeenCalledTimes(1);
});
