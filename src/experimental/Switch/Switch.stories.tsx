import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./Switch";
import { Provider } from "../Provider/Provider";
import { useState } from "react";
import { Button } from "../Button/Button";
const meta = { title: "Migration proofs/Switch", component: Switch, tags: ["autodocs"], decorators: [(Story) => <Provider><Story /></Provider>], args: { label: "Notifications", description: "Receive course updates" } } satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const ReadOnly: Story = { args: { readOnly: true } };
export const Disabled: Story = { args: { disabled: true } };
export const NativeResetAuthority: Story = { render: () => <NativeResetForm /> };
function NativeResetForm() {
  const [preventReset, setPreventReset] = useState(true);
  const [fieldsetDisabled, setFieldsetDisabled] = useState(true);
  const [requests, setRequests] = useState(0);
  return <form aria-label="Switch preferences" onReset={event => { if (preventReset) event.preventDefault(); }}>
    <Switch label="Email updates" name="emailUpdates" value="email" defaultChecked />
    <Switch label="SMS updates" name="smsUpdates" value="sms" checked onCheckedChange={() => setRequests(count => count + 1)} />
    <fieldset disabled={fieldsetDisabled}>
      <legend>Paused preferences</legend>
      <Switch label="Paused updates" name="pausedUpdates" value="paused" defaultChecked onCheckedChange={() => setRequests(count => count + 1)} />
    </fieldset>
    <output aria-label="Change requests">{requests}</output>
    <Button onPress={() => setPreventReset(false)}>Allow reset</Button>
    <Button onPress={() => setFieldsetDisabled(value => !value)}>Toggle fieldset</Button>
    <Button type="reset">Reset preferences</Button>
  </form>;
}
