import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import { InstructorClassCard } from "./InstructorClassCard";

const meta = {
  title: "Components/InstructorClassCard",
  component: InstructorClassCard,
  args: {
    className: "Defense Against the Dark Arts I",
    siteName: "Hogwarts",
    learnerCount: 24,
    lastLearnerActivityLabel: "Recent activity",
    actionLabel: "Open Class",
    actionHref: "/sections/section-1/instructor/me",
    status: "active",
  },
  decorators: [
    (Story) => (
      <Box sx={{ p: 2 }}>
        <Story />
      </Box>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof InstructorClassCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {};

export const Draft: Story = {
  args: {
    status: "draft",
    actionLabel: "Set Up Class",
  },
};

export const Archived: Story = {
  args: {
    status: "archived",
    actionLabel: "View Class",
    lastLearnerActivityLabel: "No recent activity",
  },
};
