import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { MenuBookIcon as BookIcon } from "../../experimental/icons/MenuBookIcon";
import { PeopleIcon } from "../../experimental/icons/PeopleIcon";
import { BuildIcon as TuneIcon } from "../../experimental/icons/BuildIcon";

import { AppPageTabs } from "./AppPageTabs";

const items = [
  { id: "activities", label: "Activities", href: "/sections/1/instructor/me", icon: <BookIcon /> },
  { id: "learners", label: "Learners", href: "/sections/1/instructor/me/learners", icon: <PeopleIcon /> },
  { id: "preferences", label: "Preferences", href: "/sections/1/instructor/me/preferences", icon: <TuneIcon /> },
];

const meta = {
  title: "Layout/AppPageTabs",
  component: AppPageTabs,
  args: {
    value: "activities",
    items,
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof AppPageTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LinkTabs: Story = {};

function ControlledTabsPreview() {
  const [value, setValue] = useState("activities");
  return <AppPageTabs items={items.map(item => ({ ...item, content: `${item.label} content` }))} onChange={setValue} value={value} />;
}

export const Controlled: Story = {
  render: () => <ControlledTabsPreview />,
};

export const Compact: Story = {
  args: {
    density: "compact",
  },
};

export const Overflow: Story = { decorators: [(Story) => <div style={{ width: 260 }}><Story /></div>] };
export const Disabled: Story = { args: { items: items.map(item => ({ ...item, disabled: item.id === "learners" })) } };
