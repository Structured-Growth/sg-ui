import type { Meta, StoryObj } from "@storybook/react-vite";
import Stack from "@mui/material/Stack";
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
} satisfies Meta<typeof LearnerClassCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TimeVariants: Story = {
  args: {
    ...baseArgs,
    dueAt: offsetDays(5),
  },
  render: () => (
    <Stack spacing={2}>
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
