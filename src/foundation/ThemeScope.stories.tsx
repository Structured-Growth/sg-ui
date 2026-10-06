import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeScope } from "./ThemeScope";
import { tokens } from "./tokens.generated";
import { Typography } from "../experimental/Typography/Typography";
const meta = { title: "Foundations/ThemeScope", component: ThemeScope, tags: ["autodocs"],
  args: { theme: "dark", style: { background: tokens.surface, padding: tokens.space4 }, children: "Plain host text inherits the scoped text color." },
} satisfies Meta<typeof ThemeScope>;
export default meta;
type Story = StoryObj<typeof meta>;
export const InheritedText: Story = {};
export const NestedText: Story = { render: () => <ThemeScope theme="dark" style={{background:tokens.surface,padding:tokens.space4}}>
  <Typography>Dark scope text</Typography>
  <ThemeScope theme="light" style={{background:tokens.surface,padding:tokens.space4}}><Typography>Nested light scope text</Typography></ThemeScope>
  <ThemeScope style={{color:"var(--sgui-action)",padding:tokens.space4}}>Host color override</ThemeScope>
</ThemeScope> };
