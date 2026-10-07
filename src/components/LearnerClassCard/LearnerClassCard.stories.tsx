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
