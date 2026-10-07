// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it } from "vitest";
import { Provider } from "../../experimental/Provider/Provider";
import { NativeInsertionHost } from "./NativeInsertionHost";

afterEach(cleanup);

it("uses current host callbacks while open, hands focus to the host dialog and returns after dismissal", async () => {
  const user = userEvent.setup();
  render(<Provider><NativeInsertionHost /></Provider>);
  const trigger = screen.getByRole("button", { name: "Insert", exact: true });
  const requests = screen.getByRole("status", { name: "Host insertion requests" });
  trigger.focus();
  await user.keyboard("{ArrowDown}{F2}{Enter}");
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Host insertion description" })));
  expect(requests.textContent).toBe("Replacement host: Image");
  expect(screen.queryByRole("menu")).toBeNull();
  await user.keyboard("{Escape}");
  await waitFor(() => expect(document.activeElement).toBe(trigger));
  await user.keyboard("{ArrowDown}{F3}{End}");
  for (const name of ["Image", "Columns Layout"]) {
    expect(screen.getByRole("menuitem", { name, exact: true }).getAttribute("aria-disabled")).toBe("true");
  }
  expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Horizontal Rule" }));
  await user.keyboard("{Enter}");
  await waitFor(() => expect(document.activeElement).toBe(trigger));
  expect(requests.textContent).toBe("Replacement host: Image; Replacement host: Horizontal Rule");
  expect(screen.getByRole("status", { name: "Host form submissions" }).textContent).toBe("0");
});
