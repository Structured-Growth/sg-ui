// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TableHeaderSortMenu } from "./TableHeaderSortMenu";

afterEach(cleanup);
it("provides a named header sort control", () => {
  render(<TableHeaderSortMenu label="Score" onSortSelect={() => {}} />);
  expect(screen.getByRole("button", { name: "Sort Score" })).toBeTruthy();
});
it("clears a controlled direction by keyboard and leaves the indicator until the host updates", async () => {
  const user = userEvent.setup(); const onSortSelect = vi.fn();
  const { container, rerender } = render(<TableHeaderSortMenu label="Score" sortDirection="desc" onSortSelect={onSortSelect} />);
  await user.tab(); await user.keyboard("{ArrowDown}{End}{Enter}");
  expect(onSortSelect).toHaveBeenCalledExactlyOnceWith(undefined);
  expect(container.querySelector('[data-direction="desc"]')).toBeTruthy();
  rerender(<TableHeaderSortMenu label="Score" onSortSelect={onSortSelect} />);
  expect(container.querySelector('[data-direction]')).toBeNull();
});
