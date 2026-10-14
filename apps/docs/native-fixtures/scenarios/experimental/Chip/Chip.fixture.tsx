import type { Meta, StoryObj } from "../../../types";
import { Chip } from "@structured-growth/sg-ui/experimental";
import { ThemeScope } from "@structured-growth/sg-ui/theme";
import { tokens } from "@structured-growth/sg-ui/tokens";
const meta = {
  title: "Migration proofs/Chip", component: Chip, tags: ["autodocs"], args: { children: "Published" },
  decorators: [(Story) => <ThemeScope style={{ background: tokens.surface, color: tokens.text, padding: tokens.space4 }}><Story /></ThemeScope>],
} satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const ThemesAndVariants: Story = { render: () => <div style={{ display: "grid", gap: tokens.space4 }}>
  {(["light", "dark"] as const).map(theme => <ThemeScope key={theme} theme={theme} style={{ background: tokens.surface, display: "flex", gap: tokens.space2, padding: tokens.space4 }}>
    <Chip>Draft</Chip><Chip tone="primary">Published</Chip><Chip variant="outlined">Archived</Chip><Chip tone="primary" variant="outlined">Featured</Chip>
  </ThemeScope>)}
</div> };
