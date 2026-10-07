import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";
import { Button } from "../Button/Button";
import { ThemeScope } from "../../foundation/ThemeScope";
import { tokens } from "../../foundation/tokens.generated";
const meta = {
  title: "Migration proofs/Badge", component: Badge, tags: ["autodocs"], args: { content: 4 },
  decorators: [(Story) => <ThemeScope style={{ background: tokens.surface, color: tokens.text, padding: tokens.space4 }}><Story /></ThemeScope>],
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const HostLabelsAndDecorativeContent: Story = { render: () => <div style={{ display: "flex", alignItems: "center", gap: tokens.space4 }}>
  <Badge content={0} aria-label="No unread messages" />
  <Badge content={99} aria-label="99 unread messages" />
  <Badge content="99+" aria-label="123 unread messages"><Button aria-label="Open inbox">Inbox</Button></Badge>
  <Button aria-label="Open alerts, 4 unread messages"><Badge content={4} aria-hidden>Alerts</Badge></Button>
</div> };
export const ThemesAndAnchors: Story = { render: () => <div style={{ display: "grid", gap: tokens.space4 }}>
  {(["light", "dark"] as const).map(theme => <ThemeScope key={theme} theme={theme} style={{ background: tokens.surface, display: "flex", alignItems: "center", gap: tokens.space4, padding: tokens.space4 }}>
    <Badge content="New" /><Badge tone="neutral" content={0} /><Badge content="99+"><Button aria-label="Inbox, more than 99 unread messages">Inbox</Button></Badge>
  </ThemeScope>)}
</div> };
