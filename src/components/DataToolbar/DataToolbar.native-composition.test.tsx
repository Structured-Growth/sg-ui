// @vitest-environment jsdom
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it } from "vitest";
import { ContainerBoundaryPreview, NativeCompositionPreview } from "./DataToolbar.stories";
afterEach(cleanup);
const callbacks = () => JSON.parse(screen.getByLabelText("Host callbacks").textContent ?? "[]") as string[];

it("keeps independently hosted search and actions alive through an allocated host resize", async () => {
  const user = userEvent.setup(); render(<ContainerBoundaryPreview enlarged />);
  const narrow = within(screen.getByRole("group", { name: "Narrow container toolbar" }));
  const wide = within(screen.getByRole("group", { name: "Wide container toolbar" }));
  await user.click(narrow.getByRole("button", { name: "Search", exact: true }));
  await user.type(narrow.getByRole("searchbox"), "draft");
  await user.click(wide.getByRole("button", { name: "Search", exact: true }));
  await user.type(wide.getByRole("searchbox"), "published");
  await user.click(screen.getByRole("button", { name: "Resize narrow host" }));
  expect(narrow.getByRole("searchbox")).toHaveProperty("value", "draft");
  expect(wide.getByRole("searchbox")).toHaveProperty("value", "published");
  const trigger = narrow.getByRole("button", { name: "Narrow course actions" });
  await user.click(trigger);
  await user.click(screen.getByRole("menuitem", { name: "Import courses for review" }));
  await waitFor(() => expect(document.activeElement).toBe(trigger));
  expect(screen.getByLabelText("Container host callbacks").textContent).toContain("Narrow:import");
  await user.click(narrow.getByRole("searchbox"));
  await user.keyboard("{Escape}");
  expect(narrow.queryByRole("searchbox")).toBeNull();
  expect(document.activeElement).toBe(narrow.getByRole("button", { name: "Search", exact: true }));
  expect(wide.getByRole("searchbox")).toHaveProperty("value", "published");
});

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
