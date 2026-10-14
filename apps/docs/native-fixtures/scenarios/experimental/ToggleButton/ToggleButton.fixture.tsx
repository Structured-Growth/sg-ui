import type { Meta, StoryObj } from "../../../types";
import { ToggleButton, ToggleButtonGroup } from "@structured-growth/sg-ui/experimental";
import { Provider } from "@structured-growth/sg-ui/theme";
const meta = { title: "Migration proofs/ToggleButton", component: ToggleButton, tags: ["autodocs"],
  decorators: [(Story) => <Provider><Story /></Provider>], args: { children: "Bold" },
} satisfies Meta<typeof ToggleButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Pressed: Story = { args: { defaultSelected: true } };
export const Disabled: Story = { args: { disabled: true } };
export const SingleSelection: Story = { render: () => <ToggleButtonGroup label="View" allowEmpty={false}
  defaultSelectedIds={["grid"]} options={[{id:"grid",label:"Grid"},{id:"cards",label:"Cards"},{id:"list",label:"List",disabled:true}]} /> };
export const MultipleSelection: Story = { render: () => <ToggleButtonGroup label="Formatting" selectionMode="multiple"
  options={[{id:"bold",label:"Bold"},{id:"italic",label:"Italic"},{id:"underline",label:"Underline"}]} /> };
