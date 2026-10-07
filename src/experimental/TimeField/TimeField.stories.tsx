import { useState } from "react";
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
