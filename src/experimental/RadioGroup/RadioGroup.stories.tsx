import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { RadioGroup } from "./RadioGroup";
import { Provider } from "../Provider/Provider";
import { Button } from "../Button/Button";
const meta = { title: "Migration proofs/RadioGroup", component: RadioGroup, tags: ["autodocs"], decorators: [(Story) => <Provider><Story /></Provider>], args: { label: "Delivery", options: [{ value: "self", label: "Self paced" }, { value: "live", label: "Live" }, { value: "locked", label: "Unavailable", disabled: true }], defaultValue: "self" } } satisfies Meta<typeof RadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const ReadOnly: Story = { args: { readOnly: true } };
export const Disabled: Story = { args: { disabled: true } };

function DynamicOptionsExample() {
  const [mode, setMode] = useState("available");
  const [value, setValue] = useState<string | null>("self");
  const [requests, setRequests] = useState(0);
  const [submitted, setSubmitted] = useState("No submission");
  const options = [{ value: "self", label: "Self paced", disabled: mode === "disabled" }, { value: "live", label: "Live" }, { value: "review", label: "Review" }].filter(option => mode !== "removed" || option.value !== "self");
  return <form aria-label="Dynamic radio form" onSubmit={event => {
    event.preventDefault(); setSubmitted(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));
  }} onReset={() => { setValue(null); }}>
    <Button onPress={() => setMode("removed")}>Remove selected option</Button>
    <Button onPress={() => setMode("disabled")}>Disable selected option</Button>
    <Button onPress={() => setMode("available")}>Restore options</Button>
    <Button>Before delivery</Button>
    <RadioGroup label="Delivery" name="delivery" options={options} value={value} onValueChange={next => { setRequests(count => count + 1); setValue(next); }} required description="Choose an available delivery format." errorMessage="Choose a delivery format." />
    <Button>After delivery</Button>
    <RadioGroup label="Backup delivery" name="backupDelivery" options={[{ value: "self", label: "Backup self paced" }, { value: "live", label: "Backup live" }]} defaultValue="self" />
    <Button type="submit">Submit formats</Button><Button type="reset">Reset formats</Button>
    <output aria-label="Host delivery value">{value ?? "empty"}</output>
    <output aria-label="Delivery requests">{requests}</output>
    <output aria-label="Submitted formats">{submitted}</output>
  </form>;
}
export const DynamicOptions: Story = { render: () => <DynamicOptionsExample /> };
