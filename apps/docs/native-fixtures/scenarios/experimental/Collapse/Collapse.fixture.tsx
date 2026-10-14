import type { Meta, StoryObj } from "../../../types";
import { useState } from "react";
import { Collapse } from "@structured-growth/sg-ui/experimental";
import { Button } from "@structured-growth/sg-ui/experimental";
import { Provider } from "@structured-growth/sg-ui/theme";
const meta = { title: "Migration proofs/Collapse", component: Collapse, tags: ["autodocs"], decorators: [(Story) => <Provider><Story /></Provider>], args: { expanded: true, children: "Collapsible presentation content" } } satisfies Meta<typeof Collapse>;
export default meta;
type Story = StoryObj<typeof meta>;
function Example() { const [expanded, setExpanded] = useState(true); return <><Button aria-expanded={expanded} aria-controls="collapse-example" onPress={() => setExpanded(!expanded)}>Toggle content</Button><Collapse id="collapse-example" expanded={expanded}>Collapsible presentation content</Collapse></>; }
export const HostControlled: Story = { render: () => <Example /> };
