import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import BookIcon from "@mui/icons-material/MenuBook";
import PeopleIcon from "@mui/icons-material/People";
import TuneIcon from "@mui/icons-material/Tune";
import Box from "@mui/material/Box";
import { AppPageTabs } from "./AppPageTabs";

const items = [
  { id: "activities", label: "Activities", href: "/sections/1/instructor/me", icon: <BookIcon fontSize="small" /> },
  { id: "learners", label: "Learners", href: "/sections/1/instructor/me/learners", icon: <PeopleIcon fontSize="small" /> },
  { id: "preferences", label: "Preferences", href: "/sections/1/instructor/me/preferences", icon: <TuneIcon fontSize="small" /> },
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
      <Box sx={{ bgcolor: "background.default" }}>
        <Story />
      </Box>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof AppPageTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LinkTabs: Story = {};

function ControlledTabsPreview() {
  const [value, setValue] = useState("activities");
  return <AppPageTabs items={items} onChange={setValue} value={value} />;
}

export const Controlled: Story = {
  render: () => <ControlledTabsPreview />,
};

export const Compact: Story = {
  args: {
    density: "compact",
  },
};
