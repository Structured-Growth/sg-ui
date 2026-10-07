import type { Meta, StoryObj } from "@storybook/react-vite";
import { GroupIcon } from "../../experimental/icons/GroupIcon";
import { SchoolIcon } from "../../experimental/icons/SchoolIcon";
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
      { id: "learners", icon: <GroupIcon />, label: "28 Learners" },
      { id: "site", icon: <SchoolIcon />, label: "Hogwarts" },
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
    actionButtons: <AppButton density="compact" tone="neutral" variant="outlined">Add Course to Section...</AppButton>,
  },
};

export const Primary: Story = { args: { title: "Courses", hierarchy: "primary" } };
export const Narrow: Story = { ...DetailStyle, decorators: [(Story) => <div style={{ width: 260 }}><Story /></div>] };


// Host labels deliberately include long words and several independently focusable actions.
export const ReflowActions: Story = {
  args: {
    title: "International interdisciplinary course planning and learner collaboration",
    description: "Plan accessible learning experiences across organizations and teaching teams.",
    breadcrumbs: [
      { label: "InternationalOrganizationWithAnUnbrokenHostLabel", href: "#organization" },
      { label: "Shared content library", href: "#library" },
      { label: "Professional development courses", href: "#courses" },
      { label: "Current interdisciplinary course planning workspace" },
    ],
    metaItems: [
      { icon: <GroupIcon />, label: "InternationalLearnerCollaborationNetworkWithAnUnbrokenHostLabel" },
      { icon: <SchoolIcon />, label: "North campus teaching and learning community" },
    ],
    actionButtons: <><AppButton tone="neutral" variant="outlined">AddCourseToAnotherSectionWithAnUnbrokenHostLabel</AppButton><AppButton tone="neutral" variant="outlined">Review learner participation</AppButton></>,
  },
};
export const ReflowMenu: Story = {
  args: {
    ...ReflowActions.args,
    actionButtons: undefined,
    moreMenuItems: [{ label: "Unavailable action", disabled: true }, { label: "Review course details" }, { label: "Archive course", danger: true }],
  },
};
