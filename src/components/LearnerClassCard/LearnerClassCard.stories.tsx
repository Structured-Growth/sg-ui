import { useState } from "react";
import { Button } from "../../experimental/Button/Button";
import { SGNavigationProvider } from "../../adapters/navigation";
import { SGTranslationProvider, formatIcuMessage } from "../../i18n";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../experimental/Stack/Stack";
import { ThemeScope } from "../../foundation/ThemeScope";
import { LearnerClassCard } from "./LearnerClassCard";

const referenceNow = new Date("2026-02-17T09:00:00");
const offsetMinutes = (minutes: number) => new Date(referenceNow.getTime() + minutes * 60 * 1000).toISOString();
const offsetHours = (hours: number) => new Date(referenceNow.getTime() + hours * 60 * 60 * 1000).toISOString();
const offsetDays = (days: number) => new Date(referenceNow.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

const baseArgs = {
  courseName: "Defense Against the Dark Arts",
  instructorName: "Professor Lupin",
  progressPercent: 62,
  nextActivity: "Patronus Practice",
  referenceNow,
};

const meta = {
  title: "Classes/LearnerClassCard",
  component: LearnerClassCard,
  tags: ["autodocs"],
  decorators: [(Story) => <ThemeScope><Story /></ThemeScope>],
} satisfies Meta<typeof LearnerClassCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TimeVariants: Story = {
  args: {
    ...baseArgs,
    dueAt: offsetDays(5),
  },
  render: () => (
    <Stack gap={4}>
      <LearnerClassCard {...baseArgs} dueAt={offsetMinutes(25)} />
      <LearnerClassCard {...baseArgs} dueAt={offsetHours(6)} />
      <LearnerClassCard {...baseArgs} dueAt={offsetHours(27)} />
      <LearnerClassCard {...baseArgs} dueAt={offsetHours(40)} />
      <LearnerClassCard {...baseArgs} dueAt={offsetDays(5)} />
      <LearnerClassCard {...baseArgs} dueAt={offsetDays(28)} />
    </Stack>
  ),
};

export const SingleCard: Story = {
  args: {
    ...baseArgs,
    dueAt: offsetDays(5),
  },
};

export const NavigationActions: Story = { args: { ...baseArgs, dueAt: offsetDays(5), detailsHref: "/course/details", continueHref: "/course/continue" } };

export const NarrowLongNames: Story = {
  args: {
    ...baseArgs,
    courseName: "An advanced course with a long uninterrupted title Supercalifragilisticexpialidocious",
    instructorName: "An instructor with a long host supplied name",
    dueAt: offsetDays(5),
  },
  decorators: [(Story) => <div style={{ width: 260 }}><Story /></div>],
};

export const Dark: Story = { args: { ...baseArgs, dueAt: offsetDays(5) }, render: args => <ThemeScope theme="dark"><LearnerClassCard {...args} /></ThemeScope> };

// Explicit UTC instants; the native test declares the browser timezone and clock.
const nativeNow = new Date("2026-01-02T18:00:00Z");
function NativeDueActionsExample() {
  const [locale, setLocale] = useState("en-US");
  const [translation, setTranslation] = useState("first");
  const [dueAt, setDueAt] = useState("2026-01-01T15:05:00Z");
  const [destinations, setDestinations] = useState("both");
  const [requests, setRequests] = useState<string[]>([]);
  const [continues, setContinues] = useState(0);
  return <Stack gap={4}>
    <label>Host locale <select value={locale} onChange={event => setLocale(event.target.value)}>
      {["en-US", "de-DE", "ar-EG", "bad_locale"].map(value => <option key={value}>{value}</option>)}
    </select></label>
    <label>Host destinations <select value={destinations} onChange={event => setDestinations(event.target.value)}>
      {["both", "continue only", "none"].map(value => <option key={value}>{value}</option>)}
    </select></label>
    <Button onPress={() => setTranslation("replacement")}>Replace translation</Button>
    <Button onPress={() => setTranslation("fallback")}>Use lookup fallback</Button>
    <Button onPress={() => setDueAt("invalid")}>Use invalid due date</Button>
    <Button onPress={() => setDueAt("2026-01-02T18:25:00Z")}>Use imminent due date</Button>
    <SGNavigationProvider value={{ pathname: "/", navigate: href => setRequests(previous => [...previous, href]) }}>
      <SGTranslationProvider value={{ locale, useNamespace: () => {}, t: (key, options) => {
        if (translation === "fallback") return "[[missing_translation]]";
        const message = key.startsWith("due.") ? `${translation === "first" ? "First" : "Replacement"}: ${options.defaultMessage}` : options.defaultMessage;
        return formatIcuMessage(message, locale === "bad_locale" ? "en-US" : locale, options.values);
      } }}>
        <LearnerClassCard {...baseArgs} referenceNow={nativeNow} dueAt={dueAt}
          detailsHref={destinations === "both" ? "/course/details" : undefined}
          continueHref={destinations !== "none" ? "/course/continue" : undefined}
          onContinue={() => setContinues(previous => previous + 1)} />
      </SGTranslationProvider>
    </SGNavigationProvider>
    <output aria-label="Details requests">{requests.join(" → ") || "No request"}</output>
    <output aria-label="Continue requests">{continues}</output>
  </Stack>;
}
export const NativeDueActions: Story = { args: { ...baseArgs, dueAt: "2026-01-01T15:05:00Z", referenceNow: nativeNow }, render: () => <NativeDueActionsExample /> };
