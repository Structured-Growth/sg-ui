import type { Meta, StoryObj } from "../../../types";
import { useState } from "react";
import { Disclosure } from "@structured-growth/sg-ui/experimental";
import { Provider } from "@structured-growth/sg-ui/theme";
import { TextField } from "@structured-growth/sg-ui/experimental";
import { Button } from "@structured-growth/sg-ui/experimental";
const meta = { title: "Migration proofs/Disclosure", component: Disclosure, tags: ["autodocs"], decorators: [(Story) => <Provider><Story /></Provider>], args: { label: "Course notes", children: <TextField label="Note" defaultValue="Draft retained when collapsed" /> } } satisfies Meta<typeof Disclosure>;
export default meta;
type Story = StoryObj<typeof meta>;
export const RetainedContent: Story = {};
export const Disabled: Story = { args: { disabled: true } };
function ControlledExample() {
 const [expanded, setExpanded] = useState(true);
 return <><Button onPress={() => setExpanded(!expanded)}>Toggle details from host</Button><Disclosure label="Details" expanded={expanded} onExpandedChange={setExpanded} unmountOnCollapse><TextField label="Temporary note" /></Disclosure></>;
}
export const ControlledUnmounting: Story = { render: () => <ControlledExample /> };
function RemovedDraftExample() {
 const [expanded, setExpanded] = useState(true);
 const [showDraft, setShowDraft] = useState(true);
 return <><Button onPress={() => setExpanded(!expanded)}>Toggle details from host</Button><Disclosure label="Details" expanded={expanded} onExpandedChange={setExpanded} unmountOnCollapse onKeyDown={(event) => { if (event.key === "Escape") setShowDraft(false); }}>{showDraft && <TextField label="Temporary draft" description="Press Escape to discard the draft." />}</Disclosure></>;
}
export const RemovedFocusedDraft: Story = { render: () => <RemovedDraftExample /> };
