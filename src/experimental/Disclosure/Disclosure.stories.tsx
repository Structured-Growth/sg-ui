import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Disclosure } from "./Disclosure";
import { Provider } from "../Provider/Provider";
import { TextField } from "../TextField/TextField";
import { Button } from "../Button/Button";
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
