import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TagGroup, type TagItem } from "./TagGroup";
import { ThemeScope } from "../../foundation/ThemeScope";
import { tokens } from "../../foundation/tokens.generated";
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
export const ThemesAndDensity: Story = {
  render: () => <div style={{ display: "grid", gap: tokens.space4 }}>
    {(["light", "dark"] as const).map(theme => <ThemeScope key={theme} theme={theme} style={{ background: tokens.surface, padding: tokens.space4 }}>
      {(["comfortable", "compact"] as const).map(density => <ThemeScope key={density} density={density} style={{ padding: tokens.space2 }}><RemovableTags /></ThemeScope>)}
    </ThemeScope>)}
  </div>,
};
export const EmptyAndRTL: Story = { render: () => <ThemeScope dir="rtl"><TagGroup label="Topics" items={[]} /></ThemeScope> };
