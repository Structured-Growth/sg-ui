// @vitest-environment jsdom
import { act, cleanup, render, screen } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import { ThemeScope } from "../../foundation/ThemeScope";
import { SGTranslationProvider, type SGTranslationAdapter } from "../../i18n";
import { LearnerClassCard } from "./LearnerClassCard";

afterEach(() => { cleanup(); vi.useRealTimers(); });
// Local calendar fixtures deliberately use the same execution timezone on both sides.
const referenceNow = new Date(2026, 0, 2, 12);
const dueAt = new Date(2026, 0, 1, 9, 5);
const args = { courseName: "Potions", instructorName: "Snape", progressPercent: 65,
  nextActivity: "Lab", dueAt, referenceNow };
const absoluteLabel = (locale: string) => `Due ${new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(dueAt)} at ${new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }).format(dueAt)}`;
const adapter = (locale: string, prefix: string): SGTranslationAdapter => ({
  locale, useNamespace: vi.fn(), t: vi.fn((key, options) => key.startsWith("due.")
    ? `${prefix} ${Object.values(options.values ?? {}).join(" | ")}` : options.defaultMessage),
});
const view = (value: SGTranslationAdapter, props = args) => <ThemeScope>
  <SGTranslationProvider value={value}><LearnerClassCard {...props} /></SGTranslationProvider>
</ThemeScope>;

it("replaces locale and translator independently while preserving the card and host callback contract", () => {
  const first = adapter("en-US", "First");
  const { rerender } = render(view(first));
  const heading = screen.getByRole("heading", { name: "Potions" });
  expect(screen.getByText("First Jan 1 | 9:05 AM")).toBeDefined();
  const german = { ...first, locale: "de-DE" };
  rerender(view(german));
  expect(screen.getByText("First 1. Jan. | 9:05")).toBeDefined();
  const replacement = adapter("de-DE", "Replacement");
  rerender(view(replacement));
  expect(screen.getByText("Replacement 1. Jan. | 9:05")).toBeDefined();
  expect(screen.getByRole("heading", { name: "Potions" })).toBe(heading);
  expect(replacement.useNamespace).toHaveBeenCalledWith("sections.learner");
  expect(replacement.t).toHaveBeenCalledWith("due.absoluteWithTime", {
    defaultMessage: "Due {date} at {time}", namespace: "sections.learner",
    values: { date: "1. Jan.", time: "9:05" },
  });
  rerender(view(replacement, { ...args, dueAt: new Date(referenceNow.getTime() + 25 * 60000) }));
  expect(screen.getByText("Replacement 25")).toBeDefined();
  expect(replacement.t).toHaveBeenCalledWith("due.todayInMinutes", {
    defaultMessage: "Due today in {count} minutes", namespace: "sections.learner", values: { count: 25 },
  });
});

it.each(["bad_locale", "", "zz-ZZ"])("keeps explicit English date formatting for locale %j when the host lookup fails", locale => {
  const value = { ...adapter(locale, "unused"), t: vi.fn(() => { throw new Error("host lookup failed"); }) };
  const { rerender } = render(view(value));
  expect(screen.getByText("Due Jan 1 at 9:05 AM")).toBeDefined();
  for (const dueAt of ["", "invalid", new Date(NaN)]) {
    rerender(view(value, { ...args, dueAt }));
    expect(screen.getByText("Due date unavailable")).toBeDefined();
    expect(value.t).toHaveBeenCalledWith("due.unavailable", {
      defaultMessage: "Due date unavailable", namespace: "sections.learner", values: undefined,
    });
  }
});

it("replaces a translated unavailable label and restores the provider-free fallback", () => {
  const { rerender } = render(view(adapter("de-DE", "Unavailable A"), { ...args, dueAt: "invalid" }));
  expect(screen.getByText("Unavailable A")).toBeDefined();
  rerender(view(adapter("ar-EG", "Unavailable B"), { ...args, dueAt: "invalid" }));
  expect(screen.getByText("Unavailable B")).toBeDefined();
  rerender(<ThemeScope><LearnerClassCard {...args} dueAt="invalid" /></ThemeScope>);
  expect(screen.getByText("Due date unavailable")).toBeDefined();
});

it.each(["en-US", "de-DE", "ar-EG", "bad_locale"])("hydrates the JSON due instant in %s with the same reference instant and timezone", async locale => {
  const value: SGTranslationAdapter = { locale, useNamespace: vi.fn(), t: (_key, options) =>
    Object.entries(options.values ?? {}).reduce((label, [key, val]) => label.replace(`{${key}}`, String(val)), options.defaultMessage) };
  const restored = JSON.parse(JSON.stringify({ dueAt, referenceNow }));
  const clientProps = { ...args, dueAt: restored.dueAt, referenceNow: new Date(restored.referenceNow) };
  const container = document.createElement("div");
  document.body.append(container);
  container.innerHTML = renderToString(view(value));
  const label = absoluteLabel(locale === "bad_locale" ? "en-US" : locale);
  expect(container.textContent).toContain(label);
  const recoverable = vi.fn();
  let root: ReturnType<typeof hydrateRoot> | undefined;
  try {
    await act(async () => { root = hydrateRoot(container, view(value, clientProps), { onRecoverableError: recoverable }); });
    expect(container.textContent).toContain(label);
    expect(recoverable).not.toHaveBeenCalled();
    await act(async () => { root!.render(view(adapter(locale, "After hydration"), clientProps)); });
    expect(container.textContent).toContain("After hydration");
  } finally {
    await act(async () => root?.unmount());
    container.remove();
  }
});

it("uses the declared current clock for an invalid reference without treating it as a due-date failure", () => {
  vi.useFakeTimers(); vi.setSystemTime(referenceNow);
  render(<ThemeScope><LearnerClassCard {...args} dueAt={new Date(referenceNow.getTime() + 25 * 60000)} referenceNow={new Date(NaN)} /></ThemeScope>);
  expect(screen.getByText("Due today in 25 minutes")).toBeDefined();
});

it.each(["invalid due", "invalid reference"])("hydrates %s fallback with the same declared clock and timezone", async scenario => {
  vi.useFakeTimers(); vi.setSystemTime(referenceNow);
  const props = scenario === "invalid due" ? { ...args, dueAt: "invalid" }
    : { ...args, dueAt: new Date(referenceNow.getTime() + 25 * 60000), referenceNow: new Date(NaN) };
  const value = { ...adapter("bad_locale", "unused"), t: vi.fn(() => "[[missing_translation]]") };
  const element = view(value, props);
  const label = scenario === "invalid due" ? "Due date unavailable" : "Due today in 25 minutes";
  const container = document.createElement("div");
  document.body.append(container);
  container.innerHTML = renderToString(element);
  expect(container.textContent).toContain(label);
  const recoverable = vi.fn();
  let root: ReturnType<typeof hydrateRoot> | undefined;
  try {
    await act(async () => { root = hydrateRoot(container, element, { onRecoverableError: recoverable }); });
    expect(container.textContent).toContain(label);
    expect(recoverable).not.toHaveBeenCalled();
  } finally {
    await act(async () => root?.unmount());
    container.remove();
  }
});
