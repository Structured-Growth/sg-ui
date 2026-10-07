// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NativeTransactionForm } from "./DatePicker.native-transactions.stories";

afterEach(cleanup);
const data = () => new FormData(screen.getByRole("form", { name: "Date transaction form" }) as HTMLFormElement).get("date");

it("keeps a partial keyboard draft out of civil callbacks and form data until all segments are complete", async () => {
  const user = userEvent.setup();
  render(<NativeTransactionForm empty />);
  await user.click(screen.getByRole("spinbutton", { name: /day/ }));
  await user.keyboard("29");
  await user.click(screen.getByRole("button", { name: "Leave date field" }));
  expect(data()).toBe("");
  expect(screen.getByLabelText("Date requests").textContent).toBe("[]");
  for (const [name, text] of [[/month/, "02"], [/year/, "2024"]] as const) {
    await user.click(screen.getByRole("spinbutton", { name }));
    await user.keyboard(text);
  }
  expect(data()).toBe("2024-02-29");
  expect(screen.getByLabelText("Date requests").textContent).toBe('["0020-02-29","2024-02-29"]');
});

it("reopens the calendar at the typed leap day then commits a cross-month date to the segments", async () => {
  const user = userEvent.setup();
  render(<NativeTransactionForm />);
  await user.click(screen.getByRole("spinbutton", { name: /day/ }));
  await user.keyboard("29");
  await user.click(screen.getByRole("button", { name: "Choose Course date" }));
  const leap = screen.getByRole("button", { name: /Thursday, February 29, 2024/ });
  expect(leap.closest("[role=gridcell]")?.getAttribute("aria-selected")).toBe("true");
  await user.keyboard("{Escape}");
  await user.click(screen.getByRole("button", { name: "Choose Course date" }));
  expect(screen.getByRole("button", { name: /Thursday, February 29, 2024/ }).closest("[role=gridcell]")?.getAttribute("aria-selected")).toBe("true");
  await user.click(screen.getByRole("button", { name: "Next month" }));
  await user.click(screen.getByRole("button", { name: /Friday, March 1, 2024/ }));
  expect(data()).toBe("2024-03-01");
  expect(screen.getByRole("spinbutton", { name: /month/ }).getAttribute("aria-valuenow")).toBe("3");
  expect(screen.getByRole("spinbutton", { name: /day/ }).getAttribute("aria-valuenow")).toBe("1");
  expect(screen.getByLabelText("Date requests").textContent).toBe('["2024-02-02","2024-02-29","2024-03-01"]');
});

it("requests edits without replacing a controlled host value when the host rejects field and calendar changes", async () => {
  const user = userEvent.setup();
  render(<NativeTransactionForm reject />);
  await user.click(screen.getByRole("spinbutton", { name: /day/ }));
  await user.keyboard("{ArrowUp}");
  await user.click(screen.getByRole("button", { name: "Leave date field" }));
  await waitFor(() => expect(screen.getByRole("spinbutton", { name: /day/ }).getAttribute("aria-valuenow")).toBe("28"));
  expect(data()).toBe("2024-02-28");
  await user.click(screen.getByRole("button", { name: "Choose Course date" }));
  await user.click(screen.getByRole("button", { name: /Thursday, February 29, 2024/ }));
  expect(data()).toBe("2024-02-28");
  expect(screen.getByLabelText("Date requests").textContent).toBe('["2024-02-29","2024-02-29"]');
  await user.click(screen.getByRole("button", { name: "Choose Course date" }));
  expect(screen.getByRole("button", { name: /Wednesday, February 28, 2024/ }).closest("[role=gridcell]")?.getAttribute("aria-selected")).toBe("true");
});
