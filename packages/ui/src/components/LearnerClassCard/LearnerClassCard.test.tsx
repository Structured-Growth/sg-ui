// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import { LearnerClassCard } from "./LearnerClassCard";
import { SGNavigationProvider } from "../../adapters/navigation";
import { SGTranslationProvider } from "../../i18n";
afterEach(cleanup);
const args = { courseName: "Potions", instructorName: "Snape", progressPercent: 65,
  nextActivity: "Lab", dueAt: "2026-03-01T00:00:00.000Z", referenceNow: new Date("2026-02-28T00:00:00.000Z") };
it("uses normalized progress semantics, course heading and host translation values", () => {
  const t = vi.fn((_key: string, options?: { defaultMessage?: string; values?: Record<string, string | number> }) =>
    Object.entries(options?.values ?? {}).reduce((text, [key, value]) => text.replace("{" + key + "}", String(value)), options?.defaultMessage ?? ""));
  const { rerender } = render(<SGTranslationProvider value={{ t, locale: "en-US", useNamespace: () => {} }}><LearnerClassCard {...args} /></SGTranslationProvider>);
  expect(screen.getByRole("heading", { name: "Potions" })).toBeDefined();
  expect(screen.getByRole("progressbar", { name: "Course progress" }).getAttribute("aria-valuenow")).toBe("65");
  expect(screen.getByText("Up Next: Lab")).toBeDefined();
  expect(t).toHaveBeenCalledWith("card.upNext", expect.objectContaining({ namespace: "sections.learner", values: { activity: "Lab" } }));
  rerender(<LearnerClassCard {...args} progressPercent={120} />);
  expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("100");
  expect(screen.getByText("100%")).toBeDefined();
  rerender(<LearnerClassCard {...args} progressPercent={-10} />);
  expect(screen.getByText("0%")).toBeDefined();
  for (const progressPercent of [NaN, Infinity, -Infinity]) {
    rerender(<LearnerClassCard {...args} progressPercent={progressPercent} />);
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("0");
    expect(screen.getByText("0%")).toBeDefined();
  }
});
it("invokes continue once by keyboard when no destination is supplied", async () => {
  const onContinue = vi.fn(); render(<LearnerClassCard {...args} onContinue={onContinue} />);
  expect(screen.getByRole("button", { name: "Details" })).toBeDefined();
  const user = userEvent.setup(); await user.tab(); await user.tab(); await user.keyboard("{Enter}");
  expect(onContinue).toHaveBeenCalledOnce();
});
it("routes details, falls back to continueHref, and preserves native isolated continue links", async () => {
  const navigate = vi.fn(); const onContinue = vi.fn();
  const { rerender } = render(<SGNavigationProvider value={{ pathname: "/", navigate }}><LearnerClassCard {...args} detailsHref="/details" continueHref="/continue" onContinue={onContinue} /></SGNavigationProvider>);
  const user = userEvent.setup(); await user.click(screen.getByRole("link", { name: "Details" }));
  expect(navigate).toHaveBeenCalledWith("/details", { replace: undefined });
  const link = screen.getByRole("link", { name: "Continue" });
  expect(link.getAttribute("target")).toBe("_blank"); expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  link.addEventListener("click", (event) => event.preventDefault());
  await user.click(link); expect(onContinue).toHaveBeenCalledOnce(); expect(navigate).toHaveBeenCalledOnce();
  rerender(<LearnerClassCard {...args} continueHref="/fallback" />);
  expect(screen.getByRole("link", { name: "Details" }).getAttribute("href")).toBe("/fallback");
  expect(renderToString(<LearnerClassCard {...args} />)).toContain('aria-valuenow="65"');
});
