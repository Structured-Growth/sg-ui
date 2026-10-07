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

it.each([
  ["active", "Active", "action"], ["draft", "Draft", "action"],
  ["closed", "Closed", "default"], ["archived", "Archived", "muted"],
] as const)("preserves the %s status model and explicit label", (status, label, tone) => {
  const { container } = render(<InstructorClassCard {...args} status={status} />);
  expect(screen.getByText(label)).toBeDefined();
  expect(container.querySelector('[data-status]')?.getAttribute('data-status')).toBe(status);
  expect(container.querySelector('[data-status] [aria-hidden="true"]')?.getAttribute('data-tone')).toBe(tone);
  expect(container.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(status === 'archived' ? 0 : 2);
  expect(screen.queryByRole('img')).toBeNull();
  expect(screen.getByText('HE')).toBeDefined();
  expect(screen.getAllByRole('link')).toHaveLength(1);
  expect(screen.queryByRole('button')).toBeNull();
});

it.each([
  ['Open Class', 'Open Section'], ['Open Section', 'Open Section'],
  ['Set Up Class', 'Set Up Section'], ['Set Up Section', 'Set Up Section'],
  ['View Class', 'View Section'], ['View Section', 'View Section'],
  ['Host custom action', 'Host custom action'],
])('maps the preserved action label %s', (actionLabel, expected) => {
  render(<InstructorClassCard {...args} actionLabel={actionLabel} />);
  expect(screen.getByRole('link', { name: expected }).getAttribute('href')).toBe('/sections/1');
});

it('uses host translations for status/activity/action and forwards complete interpolation', () => {
  const useNamespace = vi.fn();
  const t = vi.fn((key: string, options: { defaultMessage: string; values?: Record<string, unknown> }) => {
    const labels: Record<string, string> = { 'card.status.draft': 'Brouillon', 'card.action.setUpClass': 'Configurer',
      'card.lastLearnerActivity.noneRecent': 'Aucune activité récente' };
    if (key === 'card.learnersCount') return `${options.values?.count} personnes`;
    if (key === 'card.lastLearnerActivity.label') return `Activité : ${options.values?.value}`;
    return labels[key] ?? options.defaultMessage;
  });
  render(<SGTranslationProvider value={{ t, locale: 'fr-FR', useNamespace }}>
    <InstructorClassCard {...args} status="draft" learnerCount={0} actionLabel="Set Up Class" lastLearnerActivityLabel="No recent activity" />
  </SGTranslationProvider>);
  expect(useNamespace).toHaveBeenCalledWith('sections.instructor');
  expect(screen.getByText('Brouillon')).toBeDefined();
  expect(screen.getByRole('link', { name: 'Configurer' })).toBeDefined();
  expect(screen.getByText('0 personnes')).toBeDefined();
  expect(screen.getByText('Activité : Aucune activité récente')).toBeDefined();
  expect(t).toHaveBeenCalledWith('card.lastLearnerActivity.label', expect.objectContaining({ namespace: 'sections.instructor', values: { value: 'Aucune activité récente' } }));
});

it.each(['', 'Invalid Date', 'Date unavailable', 'No recent activity'])('preserves host activity presentation %j without parsing or throwing', label => {
  const { container } = render(<InstructorClassCard {...args} lastLearnerActivityLabel={label} />);
  expect(container.textContent).toContain(`Last Learner Activity: ${label}`);
  expect(renderToString(<InstructorClassCard {...args} lastLearnerActivityLabel={label} />)).toContain(`Last Learner Activity: ${label}`);
});

it('renders an explicit native Intl host date across locales without changing it', () => {
  // Neither current clock nor machine timezone participates in this presentation contract.
  for (const locale of ['en-US', 'de-DE', 'ar-EG']) {
    const label = new Intl.DateTimeFormat(locale, { timeZone: 'America/Chicago', dateStyle: 'medium', timeStyle: 'short' })
      .format(new Date('2026-01-01T15:05:00Z'));
    const view = render(<InstructorClassCard {...args} lastLearnerActivityLabel={label} />);
    expect(view.container.textContent).toContain(`Last Learner Activity: ${label}`);
    view.unmount();
  }
});

it('falls back to English labels when the host lookup fails', () => {
  render(<SGTranslationProvider value={{ locale: 'de-DE', useNamespace: () => {}, t: () => { throw new Error('unavailable'); } }}>
    <InstructorClassCard {...args} lastLearnerActivityLabel="No recent activity" />
  </SGTranslationProvider>);
  expect(screen.getByText('Active')).toBeDefined();
  expect(screen.getByText('30 Learners')).toBeDefined();
  expect(screen.getByText('Last Learner Activity: No recent activity')).toBeDefined();
  expect(screen.getByRole('link', { name: 'Open Section' })).toBeDefined();
});
