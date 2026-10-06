import type { Meta, StoryObj } from "@storybook/react-vite";
import GroupIcon from "@mui/icons-material/Group";
import SchoolIcon from "@mui/icons-material/School";
import { AppButton } from "../AppButton";
import { AppPageHeader } from "./AppPageHeader";

const meta = {
  title: "Layout/AppPageHeader",
  component: AppPageHeader,
  args: {
    title: "My Classes",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AppPageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Minimal: Story = {
  args: {
    title: "Biology 101",
  },
};

export const DetailStyle: Story = {
  args: {
    title: "Biology 101",
    breadcrumbs: [
      { href: "/sections/instructor", label: "Classes" },
      { label: "Section" },
    ],
    description: "Introductory section with mixed-ability learner groups.",
    metaItems: [
      { id: "learners", icon: <GroupIcon color="action" fontSize="medium" />, label: "28 Learners" },
      { id: "site", icon: <SchoolIcon color="action" fontSize="medium" />, label: "Hogwarts" },
    ],
    moreMenuItems: [
      { id: "edit", label: "Edit Section" },
      { id: "duplicate", label: "Duplicate" },
      { id: "archive", label: "Archive", danger: true },
    ],
  },
};

export const CondensedBreadcrumbs: Story = {
  args: {
    title: "Biology 101",
    breadcrumbs: [
      { href: "/org", label: "Organization" },
      { href: "/org/content", label: "Content Library" },
      { href: "/org/content/courses", label: "Courses" },
      { label: "Section" },
    ],
  },
};

export const MoreMenu: Story = {
  args: {
    title: "Biology 101",
    breadcrumbs: [
      { href: "/sections/instructor", label: "Classes" },
      { label: "Biology 101" },
    ],
    moreMenuItems: [
      { id: "edit", label: "Edit Section" },
      { id: "duplicate", label: "Duplicate" },
      { id: "open", label: "Open in New Tab", href: "/sections/biology-101/instructor/me" },
      { id: "archive", label: "Archive", danger: true },
    ],
  },
};

export const ActionButtons: Story = {
  args: {
    title: "Biology 101",
    breadcrumbs: [
      { href: "/sections/instructor", label: "Classes" },
      { label: "Biology 101" },
    ],
    actionButtons: <AppButton size="small" variant="outlined">Add Course to Section...</AppButton>,
  },
};
