import { useState } from "react";
import { SGNavigationProvider } from "../../adapters";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ApartmentIcon } from "../../experimental/icons";
import { AssignmentTurnedInIcon } from "../../experimental/icons";
import { BookIcon } from "../../experimental/icons";
import { BuildIcon } from "../../experimental/icons";
import { ClassIcon } from "../../experimental/icons";
import { DashboardIcon } from "../../experimental/icons";
import { DescriptionIcon } from "../../experimental/icons";
import { GroupIcon } from "../../experimental/icons";
import { PaidIcon } from "../../experimental/icons";
import { Box } from "../../experimental/Box/Box";
import { Typography as Text } from "../../experimental/Typography/Typography";
import { SideNavigation, type SideNavigationModel } from "./SideNavigation";

const model: SideNavigationModel = {
  user: {
    initials: "JD",
    name: "John Doe",
    organization: "Tulsa Public Schools",
    email: "john@example.com",
    defaultOrganizationId: "org-tulsa",
    organizations: [
      {
        id: "org-tulsa",
        name: "Tulsa Public Schools",
        role: "Member",
        billingScopeLabel: "Organization Billing Account",
      },
      {
        id: "org-charter",
        name: "Charter Network",
        role: "Member",
        billingScopeLabel: "Organization Billing Account",
      },
    ],
  },
  rootMenu: {
    id: "root",
    sections: [
      {
        id: "classes",
        title: "Classes",
        items: [
          { id: "my-classes", label: "My Classes", href: "/courses", icon: "class" },
          { id: "my-templates", label: "My Templates", href: "/templates", icon: "template" },
          {
            id: "class-tools",
            label: "Class Tools",
            icon: "tools",
            childBehavior: "expand",
            defaultExpanded: true,
            children: [
              { id: "attendance", label: "Attendance", icon: "checklist" },
              { id: "gradebook", label: "Gradebook", icon: "gradebook" },
            ],
          },
        ],
      },
    ],
    footerSections: [
      {
        id: "admin",
        title: "Admin",
        items: [
          { id: "admin-sites", label: "Sites", icon: "site" },
          {
            id: "org-settings",
            label: "Org Settings",
            icon: "settings",
            childBehavior: "drilldown",
            children: [
              { id: "org-dashboard", label: "Org Dashboard", icon: "dashboard" },
              { id: "org-people", label: "Org People", href: "/people", icon: "people", active: true },
              { id: "org-billing", label: "Billing", icon: "billing" },
            ],
          },
        ],
      },
    ],
  },
};

const iconMap = {
  billing: <PaidIcon />,
  checklist: <AssignmentTurnedInIcon />,
  class: <ClassIcon />,
  dashboard: <DashboardIcon />,
  gradebook: <BookIcon />,
  people: <GroupIcon />,
  settings: <BuildIcon />,
  site: <ApartmentIcon />,
  template: <DescriptionIcon />,
  tools: <BuildIcon />,
};

const resolveIcon = (iconKey: string) => iconMap[iconKey as keyof typeof iconMap] ?? null;

const meta = {
  title: "Navigation/SideNavigation",
  component: SideNavigation,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    model,
    resolveIcon,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SideNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Box style={{ display: "flex", height: "100dvh" }}>
      <SideNavigation {...args} />
      <Box style={{ padding: "var(--sgui-space4)" }}>
        <Text as="h1" variant="h4">Content Area</Text>
      </Box>
    </Box>
  ),
};

/** Demonstrates routing supplied by a host application without Next.js. */
export const HostRouting: Story = {
  render: (args) => <HostRoutingExample {...args} />,
};

function HostRoutingExample(args: React.ComponentProps<typeof SideNavigation>) {
  const [pathname, setPathname] = useState("/");
  return <SGNavigationProvider value={{ pathname, navigate: setPathname }}>
    <Box style={{ display: "flex", height: "100dvh" }}><SideNavigation {...args} /><Box style={{ padding: "var(--sgui-space4)" }}>
      <Text as="h1" variant="h4">Host application</Text>
      <Text>{pathname}</Text>
    </Box></Box>
  </SGNavigationProvider>;
}
