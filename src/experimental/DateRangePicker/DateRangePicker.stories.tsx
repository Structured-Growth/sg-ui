import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateRangePicker } from "./DateRangePicker";
import { Button } from "../Button/Button";
import { Provider } from "../Provider/Provider";
const meta = { title: "Migration proofs/DateRangePicker", component: DateRangePicker, tags: ["autodocs"],
  decorators: [(Story) => <Provider><Story /></Provider>], args: { label: "Reporting dates", defaultValue: { start: "2024-02-01", end: "2024-02-29" },
    presets: [{ id: "march", label: "March", value: { start: "2024-03-01", end: "2024-03-31" } }] },
} satisfies Meta<typeof DateRangePicker>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Required: Story = { args: { defaultValue: null, required: true } };
export const NativeFormReset: Story = { args: { name: "range" }, render: args => {
  const [submitted, setSubmitted] = useState("");
  const [preventReset, setPreventReset] = useState(false);
  return <form onReset={event => { if (preventReset) event.preventDefault(); }} onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); setSubmitted(`${data.get("range.start")} – ${data.get("range.end")}`); }}>
    <DateRangePicker {...args} />
    <label><input type="checkbox" checked={preventReset} onChange={event => setPreventReset(event.target.checked)} />Prevent form reset</label>
    <Button type="reset" variant="outlined" tone="neutral">Reset dates</Button>
    <Button type="submit" variant="outlined" tone="neutral">Read committed form dates</Button>
    <output aria-label="Submitted dates">{submitted}</output>
  </form>;
} };
