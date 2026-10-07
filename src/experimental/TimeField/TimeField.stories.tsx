import { useState } from "react";
import { Checkbox } from "../Checkbox/Checkbox";
import { Button } from "../Button/Button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimeField } from "./TimeField";
import { Provider } from "../Provider/Provider";
const meta = { title: "Migration proofs/TimeField", component: TimeField, tags: ["autodocs"],
  decorators: [(Story) => <Provider><Story /></Provider>], args: { label: "Start time", defaultValue: "09:30:00", description: "Local clock time, without a date or timezone." },
} satisfies Meta<typeof TimeField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Clock: Story = {};
export const TwentyFourHour: Story = { args: { hourCycle: 24 } };
export const ReadOnly: Story = { args: { readOnly: true } };

/** Invalid host defaults are not partial drafts accepted by the public API. */
export const InvalidDefaultReset: Story = {
  args: { label: "Imported clock", defaultValue: "23:59", hourCycle: 24, name: "clock" },
  render: args => <form><TimeField {...args} /><Button type="reset">Reset imported clock</Button></form>,
};

function HostReplacementExample() {
  const [value, setValue] = useState<string | null>(null);
  const [mode, setMode] = useState<"editable" | "readOnly" | "disabled">("editable");
  return <form>
    <TimeField label="Host clock" value={value} onValueChange={setValue} name="clock" hourCycle={24}
      readOnly={mode === "readOnly"} disabled={mode === "disabled"} />
    <output aria-label="Host clock value">{value ?? "empty"}</output>
    <Button onPress={() => setValue("00:00:00")}>Replace with midnight</Button>
    <Button onPress={() => setMode("readOnly")}>Make read only</Button>
    <Button onPress={() => setMode("disabled")}>Disable clock</Button>
  </form>;
}
export const HostReplacement: Story = { render: () => <HostReplacementExample /> };

function ResetTransactionExample({ mode }: { mode: "uncontrolled" | "controlled-null" | "complete" | "controlled" }) {
  const [prevent, setPrevent] = useState(true);
  const [defaultValue, setDefaultValue] = useState("09:30:00");
  const [callbacks, setCallbacks] = useState(0);
  const partial = mode === "uncontrolled" || mode === "controlled-null";
  return <div onReset={event => { if (prevent) event.preventDefault(); }}>
    <Checkbox label="Prevent clock reset" checked={prevent} onCheckedChange={setPrevent} />
    <form aria-label="Clock reset form">
      <TimeField label="Reset clock" hourCycle={24} name="clock" required errorMessage="Complete the clock"
        description="A reset is silent; the host can prevent it."
        value={mode === "controlled-null" ? null : mode === "controlled" ? "09:00:00" : undefined}
        defaultValue={partial ? null : defaultValue} onValueChange={() => setCallbacks(count => count + 1)} />
      <Button type="reset">Reset clock</Button>
      <Button type="submit">Validate clock</Button>
      {!partial && <Button onPress={() => setDefaultValue("12:45:59")}>Change reset default</Button>}
      <output aria-label="Clock change callbacks">{callbacks}</output>
    </form>
  </div>;
}
export const IncompletePreventedReset: Story = { render: () => <ResetTransactionExample mode="uncontrolled" /> };
export const ControlledNullReset: Story = { render: () => <ResetTransactionExample mode="controlled-null" /> };
export const CompleteResetTransaction: Story = { render: () => <ResetTransactionExample mode="complete" /> };
export const ControlledResetTransaction: Story = { render: () => <ResetTransactionExample mode="controlled" /> };
