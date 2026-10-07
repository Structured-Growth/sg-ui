// @vitest-environment jsdom
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it } from "vitest";
import { NativeCompositionPreview } from "./DataToolbar.stories";
afterEach(cleanup);
const callbacks = () => JSON.parse(screen.getByLabelText("Host callbacks").textContent ?? "[]") as string[];

it("composes mixed selection, menu requests and controlled view rejection without form submission", async () => {
  const user = userEvent.setup(); render(<NativeCompositionPreview />);
  expect(screen.getByText("2 selected")).toBeTruthy();
  expect(screen.getByRole("checkbox", { name: "Select rows" })).toHaveProperty("indeterminate", true);
  await user.tab(); await user.keyboard(" ");
  expect(screen.getByText("5 selected")).toBeTruthy();
  await user.tab(); await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Selection options" })));
  expect(screen.queryByText("5 selected")).toBeNull();
  expect(screen.getByRole("checkbox", { name: "Select rows" })).toHaveProperty("checked", false);
  await user.click(screen.getByRole("button", { name: "List" }));
  expect(screen.getByRole("button", { name: "List" }).getAttribute("aria-pressed")).toBe("false");
  expect(screen.getByRole("button", { name: "Cards" }).getAttribute("aria-pressed")).toBe("true");
  expect(callbacks()).toEqual(["toggle", "selection:none", "view:list"]);
});

it("keeps toolbar search through column navigation and resets only column query on dismissal", async () => {
  const user = userEvent.setup(); render(<NativeCompositionPreview rtl />);
  await user.click(screen.getByRole("button", { name: "Search", exact: true }));
  await user.type(screen.getByRole("searchbox"), "a");
  await user.click(screen.getByRole("button", { name: "Columns" }));
  const dialog = screen.getByRole("dialog");
  expect(within(dialog).getByRole("checkbox", { name: "Course" })).toHaveProperty("disabled", true);
  expect(within(dialog).getByRole("checkbox", { name: "Actions" })).toHaveProperty("disabled", true);
  await user.click(within(dialog).getByRole("checkbox", { name: "Status" }));
  await user.type(within(dialog).getByRole("searchbox"), "Status");
  await user.keyboard("{Escape}");
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Columns" })));
  expect(screen.getByRole("searchbox")).toHaveProperty("value", "a");
  await user.click(screen.getByRole("button", { name: "Columns" }));
  expect(within(screen.getByRole("dialog")).getByRole("searchbox")).toHaveProperty("value", "");
  await user.click(screen.getByRole("button", { name: "Reset" }));
  await user.keyboard("{Escape}");
  await user.click(screen.getByRole("button", { name: "Clear and close search" }));
  expect(screen.queryByRole("searchbox")).toBeNull();
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Search", exact: true }));
  expect(callbacks()).toEqual(["search:a", "columns:course,actions", "columns:course,status,actions", "search:"]);
});
