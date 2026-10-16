import { useState } from "react";
import type { Meta, StoryObj } from "../../../types";
import { TagGroup, type TagItem } from "@structured-growth/sg-ui/experimental";
import { ThemeScope } from "@structured-growth/sg-ui/theme";
import { tokens } from "@structured-growth/sg-ui/tokens";
import { Button } from "@structured-growth/sg-ui/experimental";
import { Checkbox, Switch, IconButton, Menu } from "@structured-growth/sg-ui/experimental";
const items: TagItem[] = [{ id: "react", label: "React" }, { id: "design", label: "Design" }, { id: "required", label: "Required topic", disabled: true }];
const meta = {
  title: "Migration proofs/TagGroup", component: TagGroup, tags: ["autodocs"],
  args: { label: "Course topics", items },
  decorators: [(Story) => <ThemeScope style={{ background: tokens.surface, color: tokens.text, padding: tokens.space4 }}><Story /></ThemeScope>],
} satisfies Meta<typeof TagGroup>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
function RemovableTags() {
  const [tags, setTags] = useState(items);
  return <TagGroup label="Course topics" items={tags} onRemove={ids => setTags(current => current.filter(item => !ids.includes(item.id)))} />;
}
export const Removable: Story = { render: () => <RemovableTags /> };
function HostRemovalChanges() {
  const [tags, setTags] = useState(items);
  const [removable, setRemovable] = useState(false);
  const [accept, setAccept] = useState(false);
  const [requests, setRequests] = useState<string[]>([]);
  return <div style={{ display: "grid", gap: tokens.space4 }}>
    <Button onPress={() => setRemovable(value => !value)}>{removable ? "Disable removal" : "Enable removal"}</Button>
    <Button onPress={() => setAccept(value => !value)}>{accept ? "Reject removals" : "Accept removals"}</Button>
    <TagGroup label="Editable topics" items={tags} onRemove={removable ? ids => {
      setRequests(current => [...current, ids.join(",")]);
      if (accept) setTags(current => current.filter(item => !ids.includes(item.id)));
    } : undefined} />
    <TagGroup label="Reference topics" items={items} />
    <output aria-label="Removal requests">{requests.join("; ") || "None"}</output>
  </div>;
}
export const HostControlledRemoval: Story = { render: () => <HostRemovalChanges /> };
export const ThemesAndDensity: Story = {
  render: () => <div style={{ display: "grid", gap: tokens.space4 }}>
    {(["light", "dark"] as const).map(theme => <ThemeScope key={theme} theme={theme} style={{ background: tokens.surface, padding: tokens.space4 }}>
      {(["comfortable", "compact"] as const).map(density => <ThemeScope key={density} density={density} style={{ padding: tokens.space2 }}><RemovableTags /></ThemeScope>)}
    </ThemeScope>)}
  </div>,
};
export const EmptyAndRTL: Story = { render: () => <ThemeScope dir="rtl"><TagGroup label="Topics" items={[]} /></ThemeScope> };

// Coarse-pointer emulation and explicit-touch geometry share production tokens.
// Each scope owns its own interaction state; this private fixture has no docs source panel.
function TargetSizingScope({ density, interactionMode }: { density: "compact" | "comfortable"; interactionMode: "auto" | "touch" }) {
  const [tags, setTags] = useState(items);
  return <ThemeScope density={density} interactionMode={interactionMode} data-testid={`${density}-${interactionMode}`}>
    <Button onPress={() => setTags(current => current.some(item => item.id === "new") ? current : [...current, { id: "new", label: "New topic" }])}>Add topic</Button>
    <IconButton label="Remove added topic" onPress={() => setTags(current => current.filter(item => item.id !== "new"))}>×</IconButton>
    <Checkbox label="Include archived" />
    <Switch label="Enable reminders" />
    <Menu label="Topic actions" trigger={<Button>Actions</Button>}
      items={[{ id: "clear", label: "Clear topics" }]} onAction={() => setTags([])} />
    <TagGroup label="Touch topics" items={tags} onRemove={ids => setTags(current => current.filter(item => !ids.includes(item.id)))} />
  </ThemeScope>;
}
export const TargetSizing: Story = { render: () => <div style={{ display: "grid", gap: tokens.space4 }}>
  {(["compact", "comfortable"] as const).flatMap(density => (["auto", "touch"] as const).map(interactionMode =>
    <TargetSizingScope key={`${density}-${interactionMode}`} density={density} interactionMode={interactionMode} />))}
</div> };
