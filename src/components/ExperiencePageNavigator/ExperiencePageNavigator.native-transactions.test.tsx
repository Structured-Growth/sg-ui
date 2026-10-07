// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it } from "vitest";
import { Provider } from "../../experimental/Provider/Provider";
import { NativeTransactionsHost } from "./ExperiencePageNavigator.native-transactions.stories";
afterEach(cleanup);

it("keeps rejected host order authoritative and accepts the next adjacent request", async () => {
  const user = userEvent.setup(); render(<Provider><NativeTransactionsHost /></Provider>);
  await user.click(screen.getByRole("button", { name: "Reject next reorder" }));
  const move = async () => {
    await user.click(screen.getByRole("button", { name: "Actions for Introduction" }));
    await user.click(screen.getByRole("menuitem", { name: "Move down" }));
  };
  await move();
  expect(screen.getByLabelText("Host page order").textContent).toBe('["intro","lesson","summary"]');
  expect(screen.getByLabelText("Host requests").textContent).toBe('[["reorder","intro","lesson"]]');
  await move();
  expect(screen.getByLabelText("Host page order").textContent).toBe('["lesson","intro","summary"]');
  expect(screen.getByLabelText("Host requests").textContent).toBe('[["reorder","intro","lesson"],["reorder","intro","lesson"]]');
  expect(screen.getByRole("button", { name: "Introduction Page 2 • Active" }).getAttribute("aria-current")).toBe("page");
});

it("retains host changes to read-only during a portal edit, then permits selection", async () => {
  const user = userEvent.setup(); render(<Provider theme="dark"><NativeTransactionsHost /></Provider>);
  await user.click(screen.getByRole("button", { name: "Actions for Introduction" }));
  await user.click(screen.getByRole("menuitem", { name: "Edit Page Name" }));
  const field = screen.getByRole("textbox", { name: "Page Name" });
  await user.clear(field); await user.type(field, "Unsaved");
  await user.keyboard("{Alt>}r{/Alt}");
  expect(screen.getByLabelText("Host read-only").textContent).toBe("true");
  expect((field as HTMLInputElement).readOnly).toBe(true);
  expect((screen.getByRole("button", { name: "Save" }) as HTMLButtonElement).disabled).toBe(true);
  await user.keyboard("{Enter}"); expect(screen.getByLabelText("Host requests").textContent).toBe("[]");
  await user.keyboard("{Escape}");
  await user.click(screen.getByRole("button", { name: "Lesson Page 2" }));
  expect(screen.getByLabelText("Host requests").textContent).toBe('[["select","lesson"]]');
  expect(screen.getByRole("button", { name: "Lesson Page 2 • Active" }).getAttribute("aria-current")).toBe("page");
});

it("records removal separately from selection and focuses the adjacent survivor after host acceptance", async () => {
  const user = userEvent.setup(); render(<Provider><NativeTransactionsHost /></Provider>);
  await user.click(screen.getByRole("button", { name: "Actions for Lesson" }));
  await user.click(screen.getByRole("menuitem", { name: "Remove" }));
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Summary Page 2" })));
  expect(screen.getByLabelText("Host requests").textContent).toBe('[["remove","lesson"]]');
  expect(screen.getByLabelText("Host page order").textContent).toBe('["intro","summary"]');
  expect(screen.getByRole("button", { name: "Introduction Page 1 • Active" }).getAttribute("aria-current")).toBe("page");
});
