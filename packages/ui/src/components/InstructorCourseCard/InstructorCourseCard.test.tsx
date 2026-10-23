// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import { InstructorCourseCard } from "./InstructorCourseCard";
import { SGNavigationProvider } from "../../adapters/navigation";
import { SGTranslationProvider } from "../../i18n";
afterEach(cleanup);
const args = { courseName: "Defense", siteName: "Hogwarts", status: "active" as const,
  learnerCount: 30, lastLearnerActivityLabel: "Recent activity", actionLabel: "Open course", actionHref: "/sections/1" };
it("shows metadata and routes a keyboard-activated link through the host", async () => {
  const navigate = vi.fn();
  render(<SGNavigationProvider value={{ pathname: "/", navigate }}><InstructorCourseCard {...args} /></SGNavigationProvider>);
  expect(screen.getByRole("heading", { name: "Defense" })).toBeDefined();
  expect(screen.getByText("30 Learners")).toBeDefined();
  expect(screen.getByText("Last Learner Activity: Recent activity")).toBeDefined();
  const user = userEvent.setup(); await user.tab(); await user.keyboard("{Enter}");
  expect(navigate).toHaveBeenCalledOnce(); expect(navigate).toHaveBeenCalledWith("/sections/1", { replace: undefined });
});
it("hides learner metadata for archived cards and preserves custom host labels", () => {
  const { rerender } = render(<InstructorCourseCard {...args} status="archived" actionLabel="View course" />);
  expect(screen.getByText("Archived")).toBeDefined(); expect(screen.queryByText("30 Learners")).toBeNull();
  expect(screen.getByRole("link", { name: "View course" })).toBeDefined();
  rerender(<InstructorCourseCard {...args} status="closed" actionLabel="Continue" lastLearnerActivityLabel="Yesterday 9:00 AM" />);
  expect(screen.getByText("Closed")).toBeDefined(); expect(screen.getByRole("link", { name: "Continue" })).toBeDefined();
  expect(screen.getByText("Last Learner Activity: Yesterday 9:00 AM")).toBeDefined();
});
it("forwards translation namespace and interpolation values and supports SSR", () => {
  const t = vi.fn((_key: string, options?: { defaultMessage?: string }) => options?.defaultMessage ?? "");
  render(<SGTranslationProvider value={{ t, locale: "en-US", useNamespace: () => {} }}><InstructorCourseCard {...args} status="draft" actionLabel="Set Up Section" /></SGTranslationProvider>);
  expect(t).toHaveBeenCalledWith("card.learnersCount", expect.objectContaining({ namespace: "sections.instructor", values: { count: 30 } }));
  expect(screen.getByRole("link", { name: "Set Up Section" })).toBeDefined();
  expect(renderToString(<InstructorCourseCard {...args} />)).toContain('href="/sections/1"');
});

it.each([
  ["active", "Active", "action"], ["draft", "Draft", "action"],
  ["closed", "Closed", "default"], ["archived", "Archived", "muted"],
] as const)("preserves the %s status model and explicit label", (status, label, tone) => {
  const { container } = render(<InstructorCourseCard {...args} status={status} />);
  expect(screen.getByText(label)).toBeDefined();
  expect(container.querySelector('[data-status]')?.getAttribute('data-status')).toBe(status);
  expect(container.querySelector('[data-status] [aria-hidden="true"]')?.getAttribute('data-tone')).toBe(tone);
  expect(container.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(status === 'archived' ? 0 : 2);
  expect(screen.queryByRole('img')).toBeNull();
  expect(screen.getByText('HE')).toBeDefined();
  expect(screen.getAllByRole('link')).toHaveLength(1);
  expect(screen.queryByRole('button')).toBeNull();
});

it.each(['Open course', 'Set up course', 'View course', 'Open Class', 'Host custom action'])('preserves the host action label %s', actionLabel => {
  render(<InstructorCourseCard {...args} actionLabel={actionLabel} />);
  expect(screen.getByRole('link', { name: actionLabel }).getAttribute('href')).toBe('/sections/1');
});

it('uses host translations for status and interpolation while preserving host content and forwards complete interpolation', () => {
  const useNamespace = vi.fn();
  const t = vi.fn((key: string, options: { defaultMessage: string; values?: Record<string, unknown> }) => {
    const labels: Record<string, string> = { 'card.status.draft': 'Brouillon', 'card.action.setUpClass': 'Configurer',
      'card.lastLearnerActivity.noneRecent': 'Aucune activité récente' };
    if (key === 'card.learnersCount') return `${options.values?.count} personnes`;
    if (key === 'card.lastLearnerActivity.label') return `Activité : ${options.values?.value}`;
    return labels[key] ?? options.defaultMessage;
  });
  render(<SGTranslationProvider value={{ t, locale: 'fr-FR', useNamespace }}>
    <InstructorCourseCard {...args} status="draft" learnerCount={0} actionLabel="Configurer" lastLearnerActivityLabel="Aucune activité récente" />
  </SGTranslationProvider>);
  expect(useNamespace).toHaveBeenCalledWith('sections.instructor');
  expect(screen.getByText('Brouillon')).toBeDefined();
  expect(screen.getByRole('link', { name: 'Configurer' })).toBeDefined();
  expect(screen.getByText('0 personnes')).toBeDefined();
  expect(screen.getByText('Activité : Aucune activité récente')).toBeDefined();
  expect(t).toHaveBeenCalledWith('card.lastLearnerActivity.label', expect.objectContaining({ namespace: 'sections.instructor', values: { value: 'Aucune activité récente' } }));
});

it.each(['', 'Invalid Date', 'Date unavailable', 'No recent activity'])('preserves host activity presentation %j without parsing or throwing', label => {
  const { container } = render(<InstructorCourseCard {...args} lastLearnerActivityLabel={label} />);
  expect(container.textContent).toContain(`Last Learner Activity: ${label}`);
  expect(renderToString(<InstructorCourseCard {...args} lastLearnerActivityLabel={label} />)).toContain(`Last Learner Activity: ${label}`);
});

it('renders an explicit native Intl host date across locales without changing it', () => {
  // Neither current clock nor machine timezone participates in this presentation contract.
  for (const locale of ['en-US', 'de-DE', 'ar-EG']) {
    const label = new Intl.DateTimeFormat(locale, { timeZone: 'America/Chicago', dateStyle: 'medium', timeStyle: 'short' })
      .format(new Date('2026-01-01T15:05:00Z'));
    const view = render(<InstructorCourseCard {...args} lastLearnerActivityLabel={label} />);
    expect(view.container.textContent).toContain(`Last Learner Activity: ${label}`);
    view.unmount();
  }
});

it('falls back to English labels when the host lookup fails', () => {
  render(<SGTranslationProvider value={{ locale: 'de-DE', useNamespace: () => {}, t: () => { throw new Error('unavailable'); } }}>
    <InstructorCourseCard {...args} lastLearnerActivityLabel="No recent activity" />
  </SGTranslationProvider>);
  expect(screen.getByText('Active')).toBeDefined();
  expect(screen.getByText('30 Learners')).toBeDefined();
  expect(screen.getByText('Last Learner Activity: No recent activity')).toBeDefined();
  expect(screen.getByRole('link', { name: 'Open course' })).toBeDefined();
});
