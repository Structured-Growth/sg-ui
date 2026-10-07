import { useRef, useState } from "react";
import { Button } from "../Button/Button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./Checkbox";
import { Provider } from "../Provider/Provider";
const meta = { title: "Migration proofs/Checkbox", component: Checkbox, tags: ["autodocs"],
  decorators: [(Story) => <Provider><Story /></Provider>], args: { label: "Available" },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Mixed: Story = { args: { mixed: true } };
export const Disabled: Story = { args: { disabled: true } };

export const Invalid: Story = { args: { required: true, invalid: true, description: "Required to register.", errorMessage: "Accept the terms before submitting." } };

// Required validation and submission follow checked, including while mixed.
// The ref is the label; label.control is the browser-owned form input.
function FieldsetAcceptanceForm() {
  const [disabled, setDisabled] = useState(true);
  const [submitted, setSubmitted] = useState("No submission");
  const [requests, setRequests] = useState(0);
  const [refTarget, setRefTarget] = useState("");
  const labelRef = useRef<HTMLLabelElement>(null);
  return <form aria-label="Checkbox fieldset form" onSubmit={event => {
    event.preventDefault();
    setSubmitted(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));
  }}>
    <fieldset disabled={disabled}>
      <legend>Required approvals</legend>
      <Checkbox ref={labelRef} label="Mixed required approval" name="approval" value="yes" required mixed
        description="Mixed presentation does not grant approval." errorMessage="Check approval to submit." />
      <Checkbox label="Mixed granted approval" name="granted" value="yes" required mixed defaultChecked />
      <Checkbox label="Host rejected approval" name="rejected" value="yes" checked={false} mixed
        onCheckedChange={() => setRequests(count => count + 1)} />
    </fieldset>
    <Button onPress={() => setDisabled(value => !value)}>{disabled ? "Enable approvals" : "Disable approvals"}</Button>
    <Button onPress={() => setRefTarget(`${labelRef.current?.tagName}/${labelRef.current?.control?.tagName}`)}>Inspect ref</Button>
    <Button type="submit">Submit approvals</Button>
    <Button type="reset" variant="outlined" tone="neutral">Reset approvals</Button>
    <output aria-label="Submitted approvals">{submitted}</output>
    <output aria-label="Rejected requests">{requests}</output>
    <output aria-label="Ref targets">{refTarget}</output>
  </form>;
}
export const FieldsetAcceptance: Story = { render: () => <FieldsetAcceptanceForm /> };

function ResetAuthorityForm() {
  const [preventReset, setPreventReset] = useState(false);
  const [controlled, setControlled] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const record = (value: string) => setEvents(previous => [...previous, value]);
  return <form aria-label="Checkbox reset authority" onReset={event => {
    record(preventReset ? "reset:prevented" : "reset:accepted");
    if (preventReset) event.preventDefault();
    else setControlled(false);
  }}>
    <Checkbox label="Prevent checkbox reset" name="prevent" checked={preventReset} onCheckedChange={next => {
      record(`policy:${next}`); setPreventReset(next);
    }} />
    <Checkbox label="Uncontrolled reset approval" name="uncontrolled" onCheckedChange={next => record(`uncontrolled:${next}`)} />
    <Checkbox label="Controlled reset approval" name="controlled" checked={controlled} onCheckedChange={next => {
      record(`controlled:${next}`); setControlled(next);
    }} />
    <Button onPress={() => setEvents([])}>Clear reset events</Button>
    <Button type="reset">Reset checkboxes</Button>
    <output aria-label="Checkbox reset events">{JSON.stringify(events)}</output>
  </form>;
}
export const ResetAuthority: Story = { render: () => <ResetAuthorityForm /> };
