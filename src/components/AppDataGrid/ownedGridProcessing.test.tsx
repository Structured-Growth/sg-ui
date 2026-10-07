// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "../../experimental/Provider/Provider";
import { ProcessingExample } from "./ownedGridProcessing.stories";
afterEach(cleanup);

it("commits a custom page size as one pagination transaction with one combined request", async () => {
  const user = userEvent.setup();
  render(<Provider><ProcessingExample /></Provider>);
  await user.selectOptions(screen.getByRole("combobox", { name: "Rows per page" }), "250");
  expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(68);
  expect(screen.getByText("1-67 of 67")).toBeTruthy();
  expect(screen.getByRole("status").textContent).toBe("Notifications: pagination → combined snapshot");
});

it("composes actual toolbar search, processing and footer page reset", async () => {
  const user = userEvent.setup();
  render(<Provider><ProcessingExample /></Provider>);
  expect(screen.getByText("21-30 of 67")).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Search" }));
  await user.type(screen.getByRole("searchbox", { name: "Search" }), "Course 67");
  const table = screen.getByRole("table");
  expect(within(table).getByText("Course 67")).toBeTruthy();
  expect(within(table).queryByText("Course 21")).toBeNull();
  expect(screen.getByText("1-1 of 1")).toBeTruthy();
  await user.keyboard("{Escape}");
  expect(screen.getByText("1-10 of 67")).toBeTruthy();
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Search" }));
});

it("keeps supplied server rows while requesting new criteria and unknown-total navigation", async () => {
  const user = userEvent.setup();
  render(<Provider><ProcessingExample server /></Provider>);
  await user.click(screen.getByRole("button", { name: "Search" }));
  await user.type(screen.getByRole("searchbox"), "missing");
  expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(11);
  expect(screen.getByText("Course 21")).toBeTruthy();
  expect(screen.getByText("Total unknown")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Next page" })).toHaveProperty("disabled", false);
});

it("uses applied toolbar filter and sort rules to compute the visible page", async () => {
  const user = userEvent.setup();
  render(<Provider><ProcessingExample /></Provider>);
  await user.click(screen.getByRole("button", { name: "Filter" }));
  await user.click(screen.getByRole("button", { name: /Columns 1/ }));
  await user.click(screen.getByRole("option", { name: "Score" }));
  await user.click(screen.getByRole("button", { name: /Operator 1/ }));
  await user.click(screen.getByRole("option", { name: ">=" }));
  await user.type(screen.getByLabelText("Value 1"), "90");
  await user.click(screen.getByRole("button", { name: "Apply" }));
  let cells = within(screen.getByRole("table")).getAllByRole("row").slice(1);
  expect(cells.length).toBeGreaterThan(0);
  expect(cells.every(row => Number(within(row).getAllByRole("cell")[1].textContent) >= 90)).toBe(true);
  expect(screen.getByRole("status").textContent).toBe("Notifications: pagination → filter → combined snapshot");
  await user.click(screen.getByRole("button", { name: "Sort" }));
  await user.click(screen.getByRole("button", { name: /Column 1/ }));
  await user.click(screen.getByRole("option", { name: "Score" }));
  await user.click(screen.getByRole("button", { name: /Order 1/ }));
  await user.click(screen.getByRole("option", { name: "Descending" }));
  await user.click(screen.getByRole("button", { name: "Apply" }));
  cells = within(screen.getByRole("table")).getAllByRole("row").slice(1);
  const scores = cells.map(row => Number(within(row).getAllByRole("cell")[1].textContent));
  expect(scores).toEqual([...scores].sort((a, b) => b - a));
});
