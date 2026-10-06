import { useState } from "react";
import { SGNavigationProvider } from "../../adapters";
import type { Meta, StoryObj } from "@storybook/react-vite";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import BookIcon from "@mui/icons-material/Book";
import BuildIcon from "@mui/icons-material/Build";
import ClassIcon from "@mui/icons-material/Class";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import GroupIcon from "@mui/icons-material/Group";
import PaidIcon from "@mui/icons-material/Paid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
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
          { id: "my-classes", label: "My Classes", icon: "class" },
          { id: "my-templates", label: "My Templates", icon: "template" },
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
              { id: "org-people", label: "Org People", icon: "people", active: true },
              { id: "org-billing", label: "Billing", icon: "billing" },
            ],
          },
        ],
      },
    ],
  },
};

const iconMap = {
  billing: <PaidIcon fontSize="small" />,
  checklist: <AssignmentTurnedInIcon fontSize="small" />,
  class: <ClassIcon fontSize="small" />,
  dashboard: <DashboardIcon fontSize="small" />,
  gradebook: <BookIcon fontSize="small" />,
  people: <GroupIcon fontSize="small" />,
  settings: <BuildIcon fontSize="small" />,
  site: <ApartmentIcon fontSize="small" />,
  template: <DescriptionIcon fontSize="small" />,
  tools: <BuildIcon fontSize="small" />,
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
    <Box sx={{ bgcolor: "background.default", display: "flex", minHeight: "100vh" }}>
      <SideNavigation {...args} />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4">Content Area</Typography>
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
    <Box sx={{ display: "flex" }}><SideNavigation {...args} /><Box sx={{ p: 4 }}>
      <Typography variant="h4">Host application</Typography>
      <Typography>{pathname}</Typography>
    </Box></Box>
  </SGNavigationProvider>;
}
