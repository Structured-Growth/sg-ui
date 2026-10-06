import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeScope } from "../../foundation/ThemeScope";
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
      <ThemeScope><div style={{ padding: 16 }}>
        <Story />
      </div></ThemeScope>
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

export const Closed: Story = { args: { status: "closed", actionLabel: "Continue", lastLearnerActivityLabel: "Yesterday 9:00 AM" } };

export const NarrowLongNames: Story = {
  args: {
    className: "Advanced Defense and Practical Collaboration Across Multiple Learning Environments",
    siteName: "A long host supplied institution name that wraps within the card",
  },
  decorators: [(Story) => <div style={{ width: 260 }}><Story /></div>],
};

export const Dark: Story = { render: args => <ThemeScope theme="dark"><InstructorClassCard {...args} /></ThemeScope> };
