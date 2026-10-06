import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "./Pagination";
import { ThemeScope } from "../../foundation/ThemeScope";
import { tokens } from "../../foundation/tokens.generated";
const meta = {
  title: "Migration proofs/Pagination", component: Pagination, tags: ["autodocs"],
  args: { page: 0, pageCount: 4, onPageChange: () => {} },
  decorators: [(Story) => <ThemeScope style={{ background: tokens.surface, color: tokens.text, padding: tokens.space4 }}><Story /></ThemeScope>],
} satisfies Meta<typeof Pagination>;
export default meta;
type Story = StoryObj<typeof meta>;
function Pages({ unknown = false }: { unknown?: boolean }) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  return <Pagination page={page} pageCount={unknown ? undefined : 4} hasNextPage={page < 3}
    onPageChange={setPage} pageSize={pageSize} onPageSizeChange={setPageSize} />;
}
export const Default: Story = { render: () => <Pages /> };
export const UnknownTotal: Story = { render: () => <Pages unknown /> };
export const Empty: Story = { args: { pageCount: 0 } };
export const ThemesAndDensity: Story = { render: () => <div style={{ display: "grid", gap: tokens.space4 }}>
  {(["light", "dark"] as const).map(theme => <ThemeScope key={theme} theme={theme} style={{ background: tokens.surface, padding: tokens.space4 }}>
    {(["comfortable", "compact"] as const).map(density => <ThemeScope key={density} density={density} style={{ padding: tokens.space2 }}><Pages /></ThemeScope>)}
  </ThemeScope>)}
</div> };
export const NarrowAndRTL: Story = { render: () => <ThemeScope dir="rtl" style={{ maxWidth: "20rem" }}><Pages /></ThemeScope> };
