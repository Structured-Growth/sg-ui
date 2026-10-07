import { useState } from "react";
import { Checkbox } from "../Checkbox/Checkbox";
import { Switch } from "../Switch/Switch";
import { RadioGroup } from "../RadioGroup/RadioGroup";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "./TextField";
import { Button } from "../Button/Button";
import { ThemeScope } from "../../foundation/ThemeScope";
import { tokens } from "../../foundation/tokens.generated";

const meta = {
  title: "Migration proofs/TextField", component: TextField, tags: ["autodocs"],
  args: { label: "Course name", description: "This name is visible to learners.", name: "course" },
  decorators: [(Story) => <ThemeScope style={{ background: tokens.surface, color: tokens.text, padding: tokens.space4, maxWidth: "30rem" }}><Story /></ThemeScope>],
} satisfies Meta<typeof TextField>;
export default meta;
// Storybook cannot infer required args from the accessible-name union.
type Story = StoryObj<{ label: string; description?: string; name?: string }>;
export const Default: Story = {};
export const States: Story = {
  render: () => <ThemeScope theme="dark" density="compact" style={{ background: tokens.surface, padding: tokens.space4, display: "grid", gap: tokens.space3 }}>
    <TextField label="Course name" defaultValue="Introduction" />
    <TextField label="Read only" value="Published course" readOnly />
    <TextField label="Unavailable" disabled />
    <TextField label="Course name" invalid errorMessage="A course with this name already exists." />
  </ThemeScope>,
};
export const NativeForm: Story = {
  render: () => <form onSubmit={event => event.preventDefault()} style={{ display: "grid", gap: tokens.space4 }}>
    <TextField label="Contact email" name="email" type="email" required description="Enter an email address before saving." />
    <Button type="submit">Save</Button><Button type="reset" variant="outlined" tone="neutral">Reset</Button>
  </form>,
};

// A host-owned draft alongside native uncontrolled controls. Reset explicitly
// restores the controlled draft; the browser/interaction engine resets defaults.
function NativeAcceptanceForm({ acceptChanges = true }: { acceptChanges?: boolean }) {
  const [title, setTitle] = useState("Controlled course");
  const [approved, setApproved] = useState(true);
  const [updates, setUpdates] = useState(true);
  const [format, setFormat] = useState("self");
  const [submitted, setSubmitted] = useState("No submission");
  const options = [{ value: "self", label: "Self paced" }, { value: "locked", label: "Unavailable", disabled: true }, { value: "live", label: "Live" }];
  return <form aria-label="Native course form" style={{ display: "grid", gap: tokens.space4 }}
    onSubmit={event => {
      event.preventDefault();
      setSubmitted(JSON.stringify(Array.from(new FormData(event.currentTarget).entries())));
    }} onReset={() => {
      setTitle("Controlled course"); setApproved(true); setUpdates(true); setFormat("self"); setSubmitted("No submission");
    }}>
    <TextField label="Contact email" name="email" type="email" autoComplete="email" defaultValue="learner@example.com" required description="Use your course contact address." errorMessage="Enter a valid contact email." />
    <Checkbox label="Accept terms" name="terms" value="accepted" required description="Required to register." errorMessage="Accept the terms before submitting." />
    <Switch label="Course notifications" name="notifications" value="enabled" defaultChecked description="Receive course updates." />
    <RadioGroup label="Delivery" name="delivery" options={options} required description="Choose a course format." errorMessage="Choose a delivery format." />
    <Checkbox label="Mixed selection" name="mixed" value="selected" mixed defaultChecked />
    <Checkbox label="Read only consent" name="readonlyConsent" value="accepted" checked readOnly />
    <Switch label="Read only notifications" name="readonlyNotifications" value="enabled" checked readOnly />
    <RadioGroup label="Read only delivery" name="readonlyDelivery" options={options.map(option => ({ ...option, label: `Read only ${option.label}` }))} value="self" readOnly />
    <Checkbox label="Disabled consent" name="disabledConsent" defaultChecked disabled />
    <Switch label="Disabled notifications" name="disabledNotifications" defaultChecked disabled />
    <TextField label="Read only reference" name="reference" value="COURSE-42" readOnly />
    <TextField label="Disabled reference" name="disabledReference" defaultValue="excluded" disabled />
    <RadioGroup label="Disabled delivery" name="disabledDelivery" options={options} defaultValue="self" disabled />
    <TextField label="Controlled title" name="controlledTitle" value={title} onValueChange={value => { if (acceptChanges) setTitle(value); }} />
    <Checkbox label="Controlled approval" name="controlledApproval" value="approved" checked={approved} onCheckedChange={value => { if (acceptChanges) setApproved(value); }} />
    <Switch label="Controlled updates" name="controlledUpdates" value="enabled" checked={updates} onCheckedChange={value => { if (acceptChanges) setUpdates(value); }} />
    <RadioGroup label="Controlled delivery" name="controlledDelivery" options={options.map(option => ({ ...option, label: `Controlled ${option.label}` }))} value={format} onValueChange={value => { if (acceptChanges) setFormat(value); }} />
    <Button type="submit">Submit course</Button>
    <Button type="reset" variant="outlined" tone="neutral">Reset course</Button>
    <output aria-label="Submitted form values">{submitted}</output>
  </form>;
}
export const NativeAcceptance: Story = { render: () => <NativeAcceptanceForm /> };
export const ControlledAuthority: Story = { render: () => <NativeAcceptanceForm acceptChanges={false} /> };

function StandaloneResetForm() {
  const [prevent, setPrevent] = useState(false);
  const [changes, setChanges] = useState(0);
  return <div onReset={event => { if (prevent) event.preventDefault(); }}>
    <label><input type="checkbox" checked={prevent} onChange={event => setPrevent(event.target.checked)} />Prevent form reset</label>
    <form aria-label="Standalone reset form">
      <TextField label="Uncontrolled field" name="uncontrolled" defaultValue="Initial" onValueChange={() => setChanges(count => count + 1)} />
      <TextField label="Controlled field" name="controlled" value="Host title" defaultValue="Initial" onValueChange={() => setChanges(count => count + 1)} />
      <Button type="reset">Reset fields</Button>
      <output aria-label="Change callbacks">{changes}</output>
    </form>
  </div>;
}
export const StandaloneReset: Story = { render: () => <StandaloneResetForm /> };

export const PreventedValidationReset: Story = { render: () => {
  const [prevent, setPrevent] = useState(true);
  return <div onReset={event => { if (prevent) event.preventDefault(); }}>
    <label><input type="checkbox" checked={prevent} onChange={event => setPrevent(event.target.checked)} />Prevent form reset</label>
    <form onSubmit={event => event.preventDefault()}>
      <TextField label="Required course" defaultValue="Initial" required errorMessage="Enter a course name." />
      <Button type="submit">Validate</Button><Button type="reset">Reset validation</Button>
    </form>
  </div>;
} };

export const LiveFormAssociation: Story = { render: () => {
  const [form, setForm] = useState("reset-owner-a");
  const [changes, setChanges] = useState(0);
  const [prevent, setPrevent] = useState(false);
  return <div onReset={event => { if (prevent) event.preventDefault(); }}>
    <Button onPress={() => setForm("reset-owner-b")}>Associate with B</Button>
    <label><input type="checkbox" checked={prevent} onChange={event => setPrevent(event.target.checked)} />Prevent form reset</label>
    <form id="reset-owner-a" aria-label="Form A"><Button type="reset">Reset A</Button></form>
    <form id="reset-owner-b" aria-label="Form B"><Button type="reset">Reset B</Button></form>
    <TextField label="Reassociated field" form={form} name="field" defaultValue="Initial" onValueChange={() => setChanges(count => count + 1)} />
    <output aria-label="Associated form">{form}</output><output aria-label="Change callbacks">{changes}</output>
  </div>;
} };
