import { SelectorDirectionStory } from "./SelectorDirectionFixture";
import type { Meta, StoryObj } from "../../../types";
import { useState } from "react";
import { Select } from "@structured-growth/sg-ui/experimental";
import { Provider } from "@structured-growth/sg-ui/theme";
const meta = { title: "Migration proofs/Select", component: Select, tags: ["autodocs"], decorators: [(Story) => <Provider><Story /></Provider>], args: { label: "Status", options: [{ id: "draft", label: "Draft" }, { id: "locked", label: "Unavailable", disabled: true }, { id: "active", label: "Active" }], defaultValue: "draft" } } satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Empty: Story = { args: { options: [], defaultValue: null } };
export const Validation: Story = { args: { invalid: true, errorMessage: "Choose an available status", description: "The host owns available statuses" } };

export const Independent: Story = { render: () => {
 const [value, setValue] = useState<string | null>("draft");
 const options = [{ id: "draft", label: "Draft" }, { id: "locked", label: "Unavailable", disabled: true }, { id: "active", label: "Active" }];
 return <form><Select label="First status" name="first" options={options} defaultValue="draft" /><Select label="Second status" name="second" options={options} value={value} onValueChange={setValue} /></form>;
} };

export const ExplicitPortalDirections: Story = { render: () => <SelectorDirectionStory kind="select" /> };


/** Private acceptance host: ID serialization and controlled authority, no persistence. */
export const NativeContracts: Story = { render: () => { const [request, setRequest] = useState<string | null>(null); return <form aria-label="Status contract">
 <button type="button">Before status</button>
 <Select label="Identity status" name="identity" description="Choose a stable status ID" defaultValue="01" options={[
  { id: "01", label: "Same" }, { id: "blocked", label: "Unavailable", disabled: true },
  { id: "1", label: "Same" }, { id: "z", label: "Zulu" },
 ]} />
 <Select label="Host status" name="host" value={null} onValueChange={setRequest} options={[{ id: "01", label: "Same" }, { id: "1", label: "Same" }]} />
 <button type="reset">Reset status</button>
 <output aria-label="Status request">{request}</output>
</form>; } };
