import { SelectorDirectionStory } from "../Select/SelectorDirectionFixture";
import type { Meta, StoryObj } from "../../../types";
import { useState } from "react";
import { ComboBox } from "@structured-growth/sg-ui/experimental";
import { Provider } from "@structured-growth/sg-ui/theme";
const meta = { title: "Migration proofs/ComboBox", component: ComboBox, tags: ["autodocs"],
  decorators: [(Story) => <Provider><Story /></Provider>],
  args: { label: "Category", description: "Search the host-supplied options.", options: [
    { id: "science", label: "Science" }, { id: "math", label: "Mathematics" },
    { id: "archived", label: "Archived", disabled: true },
  ] },
} satisfies Meta<typeof ComboBox>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Invalid: Story = { args: { invalid: true, errorMessage: "Choose an available category." } };
export const Disabled: Story = { args: { disabled: true } };

export const Empty: Story = { args: { options: [] } };
export const Independent: Story = { render: () => {
 const [value, setValue] = useState<string | null>("science");
 const options = [{ id: "science", label: "Science" }, { id: "archived", label: "Archived", disabled: true }, { id: "math", label: "Mathematics" }];
 return <form><ComboBox label="First category" name="first" options={options} defaultValue="science" /><ComboBox label="Second category" name="second" options={options} value={value} onValueChange={setValue} /></form>;
} };

export const ExplicitPortalDirections: Story = { render: () => <SelectorDirectionStory kind="combo" /> };


/** Private acceptance host: local filtering, duplicate labels and native reset. */
export const NativeContracts: Story = { render: () => { const [request, setRequest] = useState<string | null>(null); return <form aria-label="Category contract">
 <button type="button">Before category</button>
 <ComboBox label="Identity category" name="identity" description="Search stable category IDs" defaultValue="01" options={[
  { id: "01", label: "Same" }, { id: "blocked", label: "Unavailable", disabled: true },
  { id: "1", label: "Same" }, { id: "z", label: "Zulu" },
 ]} />
 <ComboBox label="Host category" name="host" value={null} onValueChange={setRequest} options={[{ id: "z", label: "Zulu" }]} />
 <button type="reset">Reset category</button>
 <output aria-label="Category request">{request}</output>
</form>; } };
