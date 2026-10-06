import type { Meta, StoryObj } from "@storybook/react-vite";
import { LearnerClassesDataGrid } from "./LearnerClassesDataGrid";

const now = new Date("2026-02-17T09:00:00");
const hours = (value: number) => new Date(now.getTime() + value * 60 * 60 * 1000).toISOString();

const meta = {
  title: "Classes/LearnerClassesDataGrid",
  component: LearnerClassesDataGrid,
  args: {
    storageKey: "storybook-learner-classes-grid",
    rows: [
      {
        id: "123",
        courseName: "Defense Against the Dark Arts",
        instructorName: "Professor Lupin",
        siteName: "Hogwarts Castle",
        progressPercent: 62,
        nextActivity: "Patronus Practice",
        dueAt: hours(5),
      },
      {
        id: "124",
        courseName: "Potions for Advanced Beginners",
        instructorName: "Professor Snape",
        siteName: "Hogwarts Dungeons",
        progressPercent: 41,
        nextActivity: "Polyjuice Lab",
        dueAt: hours(30),
      },
    ],
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LearnerClassesDataGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
