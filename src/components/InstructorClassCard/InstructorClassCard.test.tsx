// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import { InstructorClassCard } from "./InstructorClassCard";
import { SGNavigationProvider } from "../../adapters/navigation";
import { SGTranslationProvider } from "../../i18n";
afterEach(cleanup);
const args = { className: "Defense", siteName: "Hogwarts", status: "active" as const,
  learnerCount: 30, lastLearnerActivityLabel: "Recent activity", actionLabel: "Open Class", actionHref: "/sections/1" };
it("shows metadata and routes a keyboard-activated link through the host", async () => {
  const navigate = vi.fn();
  render(<SGNavigationProvider value={{ pathname: "/", navigate }}><InstructorClassCard {...args} /></SGNavigationProvider>);
  expect(screen.getByRole("heading", { name: "Defense" })).toBeDefined();
  expect(screen.getByText("30 Learners")).toBeDefined();
  expect(screen.getByText("Last Learner Activity: Recent activity")).toBeDefined();
  const user = userEvent.setup(); await user.tab(); await user.keyboard("{Enter}");
  expect(navigate).toHaveBeenCalledOnce(); expect(navigate).toHaveBeenCalledWith("/sections/1", { replace: undefined });
});
it("hides learner metadata for archived cards and preserves custom host labels", () => {
  const { rerender } = render(<InstructorClassCard {...args} status="archived" actionLabel="View Class" />);
  expect(screen.getByText("Archived")).toBeDefined(); expect(screen.queryByText("30 Learners")).toBeNull();
  expect(screen.getByRole("link", { name: "View Section" })).toBeDefined();
  rerender(<InstructorClassCard {...args} status="closed" actionLabel="Continue" lastLearnerActivityLabel="Yesterday 9:00 AM" />);
  expect(screen.getByText("Closed")).toBeDefined(); expect(screen.getByRole("link", { name: "Continue" })).toBeDefined();
  expect(screen.getByText("Last Learner Activity: Yesterday 9:00 AM")).toBeDefined();
});
it("forwards translation namespace and interpolation values and supports SSR", () => {
  const t = vi.fn((_key: string, options?: { defaultMessage?: string }) => options?.defaultMessage ?? "");
  render(<SGTranslationProvider value={{ t, locale: "en-US", useNamespace: () => {} }}><InstructorClassCard {...args} status="draft" actionLabel="Set Up Section" /></SGTranslationProvider>);
  expect(t).toHaveBeenCalledWith("card.learnersCount", expect.objectContaining({ namespace: "sections.instructor", values: { count: 30 } }));
  expect(screen.getByRole("link", { name: "Set Up Section" })).toBeDefined();
  expect(renderToString(<InstructorClassCard {...args} />)).toContain('href="/sections/1"');
});
