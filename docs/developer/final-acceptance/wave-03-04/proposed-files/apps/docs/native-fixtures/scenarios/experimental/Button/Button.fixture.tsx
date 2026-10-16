import { useState } from "react";
import type { Meta, StoryObj } from "../../../types";
import { Button, ToggleButton } from "@structured-growth/sg-ui/experimental";
import { ContentEditorChrome, DataGridDragHandle } from "@structured-growth/sg-ui/components";
import { ThemeScope } from "@structured-growth/sg-ui/theme";
import { tokens } from "@structured-growth/sg-ui/tokens";

const meta = {
  title: "Migration proofs/Button", component: Button, tags: ["autodocs"],
  args: { children: "Save course" },
  decorators: [(Story) => <ThemeScope style={{ background: tokens.surface, color: tokens.text, padding: tokens.space4 }}><Story /></ThemeScope>],
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const ThemesAndDensity: Story = {
  render: () => <div style={{ display: "grid", gap: tokens.space4 }}>
    {(["light", "dark"] as const).map(theme => <ThemeScope key={theme} theme={theme} style={{ background: tokens.surface, padding: tokens.space4 }}>
      {(["comfortable", "compact"] as const).map(density => <ThemeScope key={density} density={density} style={{ display: "flex", flexWrap: "wrap", gap: tokens.space2, padding: tokens.space2 }}>
        <Button>{theme} / {density}</Button><Button variant="outlined" tone="neutral">Cancel</Button><Button variant="text">Details</Button>
        <Button loading>Saving</Button><Button disabled>Unavailable</Button>
      </ThemeScope>)}
    </ThemeScope>)}
  </div>,
};
export const LongLabelAndRTL: Story = {
  render: () => <ThemeScope dir="rtl" style={{ maxWidth: "15rem" }}><Button>حفظ التغييرات في اسم الدورة التدريبية</Button></ThemeScope>,
};

/** Host-owned pending/disabled transitions and native form event ordering. */
export const NativeFormTransitions: Story = {
  render: () => <NativeFormTransitionsExample />,
};

function NativeFormTransitionsExample() {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [revision, setRevision] = useState(1);
  const [events, setEvents] = useState<string[]>([]);
  const record = (event: string) => setEvents(previous => [...previous, event]);
  return <div style={{ display: "grid", gap: tokens.space2 }}>
    <div style={{ display: "flex", gap: tokens.space2 }}>
      <Button onPress={() => setLoading(value => !value)}>Toggle pending</Button>
      <Button onPress={() => setDisabled(value => !value)}>Toggle disabled</Button>
      <Button onPress={() => setRevision(value => value + 1)}>Replace host press</Button>
    </div>
    <form aria-label="Button native form" onSubmit={event => {
      event.preventDefault(); record("submit");
    }} onReset={() => record("reset")}>
      <label>Course title <input name="title" defaultValue="Original course" /></label>
      <Button type="submit" loading={loading} disabled={disabled}
        onPress={() => record(`submit press ${revision}`)}>Submit course</Button>
      <Button type="reset" loading={loading} disabled={disabled}
        onPress={() => record(`reset press ${revision}`)}>Reset course</Button>
    </form>
    <output aria-label="Button events">{events.join(" | ") || "No events"}</output>
  </div>;
}

/** Reports the host-observed callback shape for native activation. */
export const OwnedPressArguments: Story = {
  render: () => <OwnedPressArgumentsExample />,
};
function OwnedPressArgumentsExample() {
  const [argumentCounts, setArgumentCounts] = useState<number[]>([]);
  return <div>
    <Button onPress={(...args: unknown[]) => setArgumentCounts(previous => [...previous, args.length])}>
      Record owned press
    </Button>
    <output aria-label="Press argument counts">{JSON.stringify(argumentCounts)}</output>
  </div>;
}

/** Private acceptance instrumentation; not a catalog example or persistence API. */
export const ActivationNotifications: Story = { render: () => <ActivationNotificationsExample /> };
function ActivationNotificationsExample() {
  const [events, setEvents] = useState<string[]>([]);
  const record = (event: string) => setEvents(previous => [...previous, event]);
  return <form onSubmit={event => { event.preventDefault(); record("submit"); }} onReset={() => record("reset")}>
    <Button onPress={(...args: unknown[]) => record(`action:${args.length}`)}>Ordinary action</Button>
    <Button type="submit" onPress={(...args: unknown[]) => record(`submit press:${args.length}`)}>Submit action</Button>
    <Button type="reset" onPress={(...args: unknown[]) => record(`reset press:${args.length}`)}>Reset action</Button>
    <DataGridDragHandle label="Reorder action" onPress={(...args: unknown[]) => record(`reorder:${args.length}`)} />
    <ToggleButton onSelectedChange={selected => record(`selection:${selected}`)}
      onPress={(...args: unknown[]) => record(`toggle press:${args.length}`)}>Toggle action</ToggleButton>
    <ContentEditorChrome icon={null} title="Activation document" titleReadOnly onTitleSave={() => {}}
      menuItems={[{ id: "anchor", label: "Anchor action", onPress: anchor => record(`anchor:${anchor.tagName}:${anchor.textContent}`) }]} />
    <output aria-label="Activation notifications">{JSON.stringify(events)}</output>
  </form>;
}
