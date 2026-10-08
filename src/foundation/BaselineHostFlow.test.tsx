// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BaselineHostFlow } from "./BaselineHostFlow.stories";

afterEach(cleanup);

it("connects section navigation, native form submission and the created course action to the editor", async () => {
  const user = userEvent.setup();
  render(<BaselineHostFlow />);
  await user.click(screen.getByRole("tab", { name: "Courses", exact: true }));
  expect(screen.getByLabelText("Host navigation").textContent).toBe("courses");
  await user.click(screen.getByRole("button", { name: "Create course", exact: true }));
  const dialog = screen.getByRole("dialog", { name: "Create course", exact: true });
  await user.type(within(dialog).getByRole("textbox", { name: "Course title" }), "Course basics");
  await user.click(within(dialog).getByRole("button", { name: "Save course", exact: true }));
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  expect(screen.getByLabelText("Host course submissions").textContent).toBe("1");
  expect(screen.getByRole("heading", { name: "Course basics", exact: true })).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Edit introduction", exact: true }));
  expect(screen.getByLabelText("Host opened course").textContent).toBe("Course basics");
  expect(screen.getByLabelText("Host navigation").textContent).toBe("editor");
  expect(screen.getByRole("tab", { name: "Introduction" }).getAttribute("aria-selected")).toBe("true");
  expect(screen.getByRole("textbox", { name: "Course introduction", exact: true }).getAttribute("contenteditable")).toBe("true");
});
