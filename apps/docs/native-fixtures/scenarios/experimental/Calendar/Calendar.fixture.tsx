import type { Meta, StoryObj } from "../../../types";
import { Calendar } from "@structured-growth/sg-ui/experimental";
import { Provider } from "@structured-growth/sg-ui/theme";
const meta = { title: "Migration proofs/Calendar", component: Calendar, tags: ["autodocs"],
  decorators: [(Story) => <Provider><div style={{ maxWidth: "48rem" }}><Story /></div></Provider>], args: { label: "Course date", defaultFocusedDate: "2024-02-01" },
} satisfies Meta<typeof Calendar>;
export default meta;
// native fixture host intersects discriminated prop unions when inferring args; the component retains its owned union.
type Story = StoryObj;
export const Single: Story = {};
export const Multiple: Story = { args: { selection: "multiple", months: 2, label: "Course dates" } };
export const Unavailable: Story = { args: { unavailable: [{ date: "2024-02-15", reason: "Fully booked" }] } };

// K05 targeted navigation/reflow host; selected civil date stays separate from focus.
export const NavigationReflow: Story = { render: (_args,{globals}) => <Provider theme={globals.theme} density={globals.density}><Calendar label="Birthday navigation" navigation="month-year" months={2} visibleYears={200} min="1900-01-01" max="2026-12-31" defaultValue="2000-01-31" defaultFocusedDate="2000-01-31" /></Provider> };
