// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { ThemeScope } from "../../foundation/ThemeScope";
import { LearnerClassCard, type LearnerClassCardProps } from "./index";

afterEach(cleanup);

it("isolates sibling card values and current host callbacks across replacement and unmount", async () => {
  const firstContinue = vi.fn();
  const secondContinue = vi.fn();
  const replacementContinue = vi.fn();
  const shared = { instructorName: "Host instructor", nextActivity: "Host activity",
    referenceNow: new Date("2026-01-01T12:00:00Z") };
  const first: LearnerClassCardProps = { ...shared, courseName: "First course",
    progressPercent: 20, dueAt: "invalid", onContinue: firstContinue };
  const second: LearnerClassCardProps = { ...shared, courseName: "Second course",
    progressPercent: 100, dueAt: "2026-01-01T12:01:00Z", onContinue: secondContinue };
  const view = (showFirst: boolean, currentSecond: LearnerClassCardProps) => <ThemeScope>
    {showFirst && <section aria-label="First card"><LearnerClassCard {...first} /></section>}
    <section aria-label="Second card"><LearnerClassCard {...currentSecond} /></section>
  </ThemeScope>;
  const { rerender, unmount } = render(view(true, second));
  const firstCard = within(screen.getByRole("region", { name: "First card" }));
  const secondRegion = screen.getByRole("region", { name: "Second card" });
  const secondCard = within(secondRegion);
  const heading = secondCard.getByRole("heading", { name: "Second course" });
  expect(firstCard.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("20");
  expect(firstCard.getByText("Due date unavailable")).toBeDefined();
  expect(secondCard.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("100");
  expect(secondCard.getByText("Due today in 1 minute")).toBeDefined();
  const user = userEvent.setup();
  await user.click(firstCard.getByRole("button", { name: "Continue" }));
  expect(firstContinue).toHaveBeenCalledOnce();
  expect(secondContinue).not.toHaveBeenCalled();
  rerender(view(false, { ...second, progressPercent: 45, onContinue: replacementContinue }));
  expect(screen.queryByRole("region", { name: "First card" })).toBeNull();
  expect(secondCard.getByRole("heading", { name: "Second course" })).toBe(heading);
  expect(secondCard.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("45");
  expect(secondCard.getByText("Due today in 1 minute")).toBeDefined();
  await user.click(secondCard.getByRole("button", { name: "Continue" }));
  expect(replacementContinue).toHaveBeenCalledOnce();
  expect(secondContinue).not.toHaveBeenCalled();
  expect(firstContinue).toHaveBeenCalledOnce();
  unmount();
  render(view(false, second));
  await user.click(screen.getByRole("button", { name: "Continue" }));
  expect(secondContinue).toHaveBeenCalledOnce();
  expect(replacementContinue).toHaveBeenCalledOnce();
});
