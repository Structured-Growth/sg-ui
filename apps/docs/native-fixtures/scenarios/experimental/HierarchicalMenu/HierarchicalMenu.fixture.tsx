import { useState } from "react";
import { Button, Checkbox, HierarchicalMenu, Popover, Stack, TextField, type HierarchicalMenuLevel } from "@structured-growth/sg-ui/experimental";
import { ThemeScope } from "@structured-growth/sg-ui/theme";
import type { Meta, StoryObj } from "../../../types";

const fixtureItems: HierarchicalMenuLevel = { title: "Course workspace", sections: [{ id: "main", label: "Workspace", items: [
  { id: "settings", label: "Course settings", children: { title: "Course settings", sections: [{ id: "settings", items: [
    { id: "disabled", label: "Unavailable", disabled: true },
    { id: "people", label: "People", children: { title: "People", sections: [{ id: "people", items: [
      { id: "invite", label: "Invite learner" },
      ...Array.from({ length: 15 }, (_, i) => ({ id: `person-${i}`, label: `Learner ${i + 1}` })),
    ] }] } },
  ] }], footerItems: [{ id: "settings-help", label: "Settings help", href: "https://example.org/settings", target: "_blank" }] } },
  { id: "reports", label: "Root reports" },
  { id: "resources", label: "Resources", childBehavior: "inline", children: { sections: [{ id: "resources", items: [
    { id: "reports", label: "Reports", children: { title: "Reports", sections: [{ id: "reports", items: [{ id: "export", label: "Export report" }] }] } },
  ] }] } },
  { id: "overview", label: "Overview", href: "#overview", current: true },
] }], footerItems: [{ id: "support", label: "Support", href: "https://example.org", target: "_blank" }] };
const meta = { title: "Migration proofs/HierarchicalMenu", component: HierarchicalMenu, args: { label: "Course navigation", items: fixtureItems } } satisfies Meta<typeof HierarchicalMenu>;
export default meta;
type Story = StoryObj<typeof meta>;
function IndependentHost() {
  const [result, setResult] = useState("");
  return <Stack direction="row" wrap gap={4}>
    <ThemeScope density="compact"><HierarchicalMenu label="First navigation" items={fixtureItems} onAction={id => setResult(id)} style={{ width: "18rem", height: "18rem", maxWidth: "100%" }} /></ThemeScope>
    <ThemeScope density="comfortable"><HierarchicalMenu label="Second navigation" items={fixtureItems} style={{ width: "18rem", height: "18rem", maxWidth: "100%" }} /></ThemeScope>
    {result && <output role="status" aria-label="Local action result">{result === "invite" ? "Invitation draft opened locally" : "Local action completed"}</output>}
  </Stack>;
}
export const Independent: Story = { render: () => <IndependentHost /> };
function ControlledHost() {
  const [path, setPath] = useState<string[]>([]);
  const [accept, setAccept] = useState(false);
  const [remove, setRemove] = useState(false);
  return <Stack gap={3}>
    <Checkbox label="Accept path requests" checked={accept} onCheckedChange={setAccept} />
    <Button onPress={() => setRemove(true)}>Remove settings</Button>
    <TextField label="Host destination" />
    <HierarchicalMenu label="Controlled navigation" items={remove ? { ...fixtureItems, sections: [] } : fixtureItems} path={path} onPathChange={next => { if (accept) setPath(next); }} style={{ width: "18rem", height: "18rem", maxWidth: "100%" }} />
  </Stack>;
}
export const Controlled: Story = { render: () => <ControlledHost /> };
function CommandHost() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState("");
  return <Stack gap={3}>
    <Popover title="Course command popup" size="content" open={open} onOpenChange={setOpen} trigger={<Button>Open course commands</Button>}>
      <HierarchicalMenu label="Course commands" presentation="commands" items={fixtureItems} onDismiss={() => setOpen(false)}
        onAction={id => { setResult(id); setOpen(false); }} style={{ width: "18rem", height: "18rem", maxWidth: "100%" }} />
    </Popover>
    {result && <output role="status">Local command completed</output>}
  </Stack>;
}
export const Commands: Story = { render: () => <CommandHost /> };
