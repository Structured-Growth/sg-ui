import { useRef, useState } from "react";
import { Button } from "../Button/Button";
import { Checkbox } from "../Checkbox/Checkbox";
import { Stack } from "../Stack/Stack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextArea } from "./TextArea";
import { Provider } from "../Provider/Provider";
const meta = { title: "Migration proofs/TextArea", component: TextArea, tags: ["autodocs"], decorators: [(Story) => <Provider><Story /></Provider>], args: { label: "Course description", description: "Provide a short summary", defaultValue: "Learn together.\nPractice at your own pace." } } satisfies Meta<typeof TextArea>;
export default meta;
// Storybook's inferred args intersect mutually exclusive naming branches.
// Keep the required label/aria-label union on the public component contract.
type Story = StoryObj;
export const Default: Story = {};
export const Validation: Story = { args: { required: true, invalid: true, errorMessage: "Add a description" } };

export const NativeReset: Story = { render: () => <NativeResetExample /> };
function NativeResetExample() {
  const [latestDefault, setLatestDefault] = useState("Original\nsummary");
  const [preventReset, setPreventReset] = useState(false);
  const [changes, setChanges] = useState(0);
  const [invalid, setInvalid] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  return <Stack gap={3}>
    <Checkbox label="Prevent reset" checked={preventReset} onCheckedChange={setPreventReset} />
    <form id="textarea-host-form" onReset={event => { if (preventReset) event.preventDefault(); }}>
      <Button type="reset">Reset summaries</Button>
    </form>
    <p id="textarea-host-help">Host guidance</p>
    <TextArea ref={ref} form="textarea-host-form" label="Draft summary" name="summary"
      defaultValue={latestDefault} onValueChange={() => setChanges(count => count + 1)}
      description="Multiline guidance" aria-describedby="textarea-host-help"
      invalid={invalid} errorMessage="Add a summary" required rows={5} autoComplete="off" />
    <TextArea form="textarea-host-form" label="Controlled summary" name="controlledSummary"
      value="Host-owned summary" onValueChange={() => setChanges(count => count + 1)} />
    <Button onPress={() => setLatestDefault("Latest\nsummary")}>Replace default</Button>
    <Button onPress={() => setInvalid(current => !current)}>Toggle validation</Button>
    <Button onPress={() => ref.current?.focus()}>Focus draft through ref</Button>
    <output aria-label="Value changes">{changes}</output>
  </Stack>;
}

/** The host changes form ownership while preserving the mounted fields. */
export const FormReassociation: Story = { render: () => <FormReassociationExample /> };
function FormReassociationExample() {
  const [owner, setOwner] = useState("textarea-original-owner");
  const [latestDefault, setLatestDefault] = useState("Original\nsummary");
  const [preventReset, setPreventReset] = useState(false);
  const [controlledValue, setControlledValue] = useState("Host-owned summary");
  const [changes, setChanges] = useState<string[]>([]);
  return <Stack gap={3}>
    <form id="textarea-original-owner" aria-label="Original summary form">
      <Button type="reset">Reset original form</Button>
    </form>
    <form id="textarea-current-owner" aria-label="Current summary form"
      onReset={event => { if (preventReset) event.preventDefault(); }}>
      <Button type="reset">Reset current form</Button>
    </form>
    <TextArea form={owner} label="Reassociated draft" name="summary" defaultValue={latestDefault}
      onValueChange={next => setChanges(previous => [...previous, `draft:${next}`])} />
    <TextArea form={owner} label="Reassociated controlled summary" name="controlledSummary"
      value={controlledValue}
      onValueChange={next => setChanges(previous => [...previous, `controlled:${next}`])} />
    <Button onPress={() => setOwner("textarea-current-owner")}>Move fields to current form</Button>
    <Button onPress={() => setLatestDefault("Latest\nsummary")}>Replace reassociated default</Button>
    <Button onPress={() => setControlledValue("Updated host summary")}>Replace controlled summary</Button>
    <Checkbox label="Cancel current form reset" checked={preventReset} onCheckedChange={setPreventReset} />
    <output aria-label="Reassociation change requests">{JSON.stringify(changes)}</output>
  </Stack>;
}
