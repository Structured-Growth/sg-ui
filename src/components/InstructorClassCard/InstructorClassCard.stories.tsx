import { useState } from "react";
import { Button } from "../../experimental/Button/Button";
import { SGNavigationProvider } from "../../adapters/navigation";
import type { InstructorClassCardStatus } from "./InstructorClassCard";
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

/** Host date formatting and routing remain outside InstructorClassCard. */
function NativePresentationExample() {
  const [status, setStatus] = useState<InstructorClassCardStatus>('active');
  const [activity, setActivity] = useState('date');
  const [requests, setRequests] = useState<string[]>([]);
  const dateLabel = new Intl.DateTimeFormat('de-DE', {
    timeZone: 'America/Chicago', dateStyle: 'medium', timeStyle: 'short',
  }).format(new Date('2026-01-01T15:05:00Z'));
  const activityLabel = activity === 'date' ? dateLabel : activity === 'missing' ? 'No recent activity' : 'Date unavailable';
  const labels = { active: 'Open Class', draft: 'Set Up Section', closed: 'Host custom action', archived: 'View Class' };
  return <SGNavigationProvider value={{ pathname: '/', navigate: href => setRequests(previous => [...previous, href]) }}>
    <div style={{ display: 'grid', gap: 16, maxWidth: 260 }}>
      <Button onPress={() => setStatus(previous => previous === 'active' ? 'draft' : previous === 'draft' ? 'closed' : previous === 'closed' ? 'archived' : 'active')}>Next host status</Button>
      <Button onPress={() => setActivity(previous => previous === 'date' ? 'missing' : previous === 'missing' ? 'invalid' : 'date')}>Next host activity</Button>
      <InstructorClassCard
        className="Advanced Defense and Practical Collaboration Across Multiple Learning Environments"
        siteName="Host institution with a long name that wraps within the instructor card"
        status={status} learnerCount={0} lastLearnerActivityLabel={activityLabel}
        actionLabel={labels[status]} actionHref={`/host/course/${status}`}
      />
      <output aria-label="Host navigation requests">{requests.length ? requests.join(', ') : 'No requests'}</output>
    </div>
  </SGNavigationProvider>;
}

export const NativePresentation: Story = { render: () => <NativePresentationExample /> };
