import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeaderCell, TableRow } from "./Table";
import { ThemeScope } from "../../foundation/ThemeScope";
import { tokens } from "../../foundation/tokens.generated";
const meta = {
  title: "Migration proofs/Table", component: Table, tags: ["autodocs"],
  decorators: [(Story) => <ThemeScope style={{ background: tokens.surface, color: tokens.text, padding: tokens.space4 }}><Story /></ThemeScope>],
} satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;
function Courses() {
  return <Table><TableCaption>Course enrollment</TableCaption>
    <TableHead><TableRow><TableHeaderCell>Course</TableHeaderCell><TableHeaderCell align="end">Learners</TableHeaderCell></TableRow></TableHead>
    <TableBody><TableRow><TableHeaderCell scope="row">React fundamentals</TableHeaderCell><TableCell align="end">12</TableCell></TableRow>
      <TableRow><TableHeaderCell scope="row">Accessible design</TableHeaderCell><TableCell align="end">24</TableCell></TableRow></TableBody>
  </Table>;
}
export const Default: Story = { render: () => <Courses /> };
export const ThemesAndDensity: Story = { render: () => <div style={{ display: "grid", gap: tokens.space4 }}>
  {(["light", "dark"] as const).map(theme => <ThemeScope key={theme} theme={theme} style={{ background: tokens.surface, padding: tokens.space4 }}>
    {(["comfortable", "compact"] as const).map(density => <ThemeScope key={density} density={density}><Courses /></ThemeScope>)}
  </ThemeScope>)}
</div> };
