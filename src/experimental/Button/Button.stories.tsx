import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";
import { ThemeScope } from "../../foundation/ThemeScope";
import { tokens } from "../../foundation/tokens.generated";

const meta = {
  title: "Migration proofs/Button", component: Button, tags: ["autodocs"],
  args: { children: "Save course" },
  decorators: [(Story) => <ThemeScope style={{ background: tokens.surface, color: tokens.text, padding: tokens.space4 }}><Story /></ThemeScope>],
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const ThemesAndDensity: Story = {
  render: () => <div style={{ display: "grid", gap: tokens.space4 }}>
    {(["light", "dark"] as const).map(theme => <ThemeScope key={theme} theme={theme} style={{ background: tokens.surface, padding: tokens.space4 }}>
      {(["comfortable", "compact"] as const).map(density => <ThemeScope key={density} density={density} style={{ display: "flex", flexWrap: "wrap", gap: tokens.space2, padding: tokens.space2 }}>
        <Button>{theme} / {density}</Button><Button variant="outlined" tone="neutral">Cancel</Button><Button variant="text">Details</Button>
        <Button loading>Saving</Button><Button disabled>Unavailable</Button>
      </ThemeScope>)}
    </ThemeScope>)}
  </div>,
};
export const LongLabelAndRTL: Story = {
  render: () => <ThemeScope dir="rtl" style={{ maxWidth: "15rem" }}><Button>حفظ التغييرات في اسم الدورة التدريبية</Button></ThemeScope>,
};
