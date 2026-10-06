import type { Meta, StoryObj } from "@storybook/react-vite";
import Typography from "@mui/material/Typography";
import { SideNavigation } from "../SideNavigation";
import { AppShell } from "./AppShell";
import { mainNavigation } from "../../fixtures/navigation";
import { resolveNavigationIcon } from "../../fixtures/navigation";

const meta = {
  title: "Layout/AppShell",
  component: AppShell,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: undefined,
    navigation: undefined,
  },
  render: () => (
    <AppShell navigation={<SideNavigation model={mainNavigation} resolveIcon={resolveNavigationIcon} />}>
      <Typography variant="h2">Main Area Placeholder</Typography>
    </AppShell>
  ),
};
