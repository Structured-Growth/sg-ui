import type { Meta, StoryObj } from "../../../types";
import { CourseGridHost } from "./CourseGridHost";

import { Provider } from "@structured-growth/sg-ui/theme";

const now = new Date("2026-02-17T09:00:00");
const hours = (value: number) => new Date(now.getTime() + value * 60 * 60 * 1000).toISOString();

const meta = {
  title: "Components/AppDataGridShell/Course collection",
  component: CourseGridHost,
  args: {
    persistence: { key: "native-fixture-learner-courses-grid" },
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
  decorators: [Story => <Provider><div style={{ height: 450 }}><Story /></div></Provider>],
  tags: ["autodocs"],
} satisfies Meta<typeof CourseGridHost>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
