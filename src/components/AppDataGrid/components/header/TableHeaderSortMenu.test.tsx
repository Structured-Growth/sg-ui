// @vitest-environment jsdom
import { expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TableHeaderSortMenu } from "./TableHeaderSortMenu";
it("provides a named header sort control", () => {
  render(<TableHeaderSortMenu label="Score" onSortSelect={() => {}} />);
  expect(screen.getByRole("button", { name: "Sort Score" })).toBeTruthy();
});
