import type { Meta, StoryObj } from "../../types";
import { useState } from "react";
import { AppThemeProvider, ThemeScope } from "@structured-growth/sg-ui/theme";
import { Button, TextField, Typography } from "@structured-growth/sg-ui/primitives";
import { AppModal } from "@structured-growth/sg-ui/components";
import { tokens } from "@structured-growth/sg-ui/tokens";
const meta = { title: "Theme/Public scope", component: AppThemeProvider } satisfies Meta<typeof AppThemeProvider>;
export default meta;
type Story = StoryObj<typeof meta>;
export const NestedScopesAndPortal: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return <><Typography as="h1" variant="h3">Production theme globals</Typography>
      <Typography>Use the toolbar to change theme, density, locale and direction.</Typography>
      <Button onPress={() => setOpen(true)}>Open scoped dialog</Button>
      <AppModal open={open} title="Scoped settings" onClose={() => setOpen(false)}><TextField label="Course name" /></AppModal>
      <ThemeScope theme="dark" density="compact" style={{ background: tokens.surface, padding: tokens.space4 }}><Typography>Independent dark compact scope</Typography><TextField label="Nested course name" /></ThemeScope>
    </>;
  },
};
