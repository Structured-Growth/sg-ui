import type { Meta, StoryObj } from "@storybook/react-vite";
import { Typography } from "../../experimental/Typography/Typography";
import { SideNavigation, type SideNavigationModel } from "../SideNavigation";
import { AppShell } from "./AppShell";
import { AppButton } from "../AppButton";
import { TextField } from "../../experimental/TextField/TextField";
import { tokens } from "../../foundation/tokens.generated";
import { useState } from "react";
const model: SideNavigationModel = { user: { initials: "TH", name: "Thomas Hall", organization: "Structured Growth" }, rootMenu: { id: "root", sections: [{ id: "courses", title: "Workspace", items: [{ id: "overview", label: "Overview", href: "/", active: true }, { id: "courses", label: "Courses", children: [{ id: "course", label: "Sample course", href: "/course" }] }] }] } };
const meta = { title: "Layout/AppShell", component: AppShell, parameters: { layout: "fullscreen" }, tags: ["autodocs"] } satisfies Meta<typeof AppShell>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { children: undefined, navigation: undefined }, render: () => <AppShell mainLabel="Workspace" navigation={<SideNavigation model={model} />}><Typography as="h1" variant="h2">Main Area Placeholder</Typography></AppShell> };
export const IndependentScrollAndReflow: Story = { args: { children: undefined, navigation: undefined }, render: () => <AppShell mainLabel="Long workspace" navigation={<SideNavigation model={{ ...model, rootMenu: { id: "long", sections: [{ id: "courses", title: "Courses", items: Array.from({ length: 35 }, (_, i) => ({ id: `course-${i}`, label: `Course ${i + 1}`, href: `/course/${i}` })) }] } }} />}><Typography as="h1" variant="h2">Responsive workspace</Typography>{Array.from({ length: 45 }, (_, i) => <Typography key={i}>Learning content section {i + 1}</Typography>)}</AppShell> };

// A fullscreen host removes the preview decorator's page gutters from viewport
// measurements. The production theme/density scope still comes from that decorator.
export const NativeResponsiveWorkspace: Story = {
  args: { children: undefined, navigation: undefined },
  render: () => <AppShell mainLabel="Responsive host workspace" style={{ position: "fixed", inset: 0 }}
    navigation={<SideNavigation model={{ ...model, rootMenu: { id: "native", sections: [{ id: "courses", title: "Courses", items: Array.from({ length: 35 }, (_, i) => ({ id: `course-${i}`, label: `Course ${i + 1}`, href: `#course-${i}` })) }] } }} />}>
    <div style={{ padding: tokens.space4, display: "flex", flexDirection: "column", gap: tokens.space4 }}>
      <Typography as="h1" variant="h2">Responsive host workspace</Typography>
      <TextField label="Host workspace title" defaultValue="Learning plan" />
      {Array.from({ length: 12 }, (_, i) => <section key={i} aria-label={`Host section ${i + 1}`}>
        <Typography as="h2" variant="h3">Learning content section {i + 1}</Typography>
        <Typography>Host-owned course content wraps within the available main area as navigation changes between a side rail and a stacked region.</Typography>
        <AppButton variant="outlined">Host action {i + 1}</AppButton>
      </section>)}
    </div>
  </AppShell>,
};

function ContainerWorkspaces() {
  const [width, setWidth] = useState("20rem");
  const longModel: SideNavigationModel = { ...model, rootMenu: { id: "container", sections: [{ id: "courses", title: "Courses", items: Array.from({ length: 35 }, (_, i) => ({ id: `course-${i}`, label: `Course ${i + 1}`, href: `#course-${i}` })) }] } };
  return <div style={{ padding: tokens.space4, display: "flex", flexDirection: "column", gap: tokens.space4 }}>
    <AppButton onPress={() => setWidth(value => value === "20rem" ? "56rem" : "20rem")}>Resize first shell</AppButton>
    {(["First", "Second"] as const).map((name, index) => <AppShell key={name}
      style={{ inlineSize: index === 0 ? width : "56rem", maxInlineSize: "100%", blockSize: "36rem" }}
      mainId={`container-main-${index}`} mainLabel={`${name} container workspace`}
      navigation={<SideNavigation model={longModel} aria-label={`${name} container navigation`} />}>
      <div style={{ padding: tokens.space4, display: "flex", flexDirection: "column", gap: tokens.space4 }}>
        <Typography as="h1" variant="h2">{name} workspace</Typography>
        <TextField label={`${name} host title`} defaultValue="Learning plan" />
        {Array.from({ length: 12 }, (_, i) => <section key={i}>
          <Typography as="h2" variant="h3">Course section {i + 1}</Typography>
          <Typography>Host content remains available as its container width changes.</Typography>
          <AppButton variant="outlined">{name} host action {i + 1}</AppButton>
        </section>)}
      </div>
    </AppShell>)}
  </div>;
}

export const IndependentContainers: Story = {
  args: { children: undefined, navigation: undefined },
  render: () => <ContainerWorkspaces />,
};
