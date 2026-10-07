import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { AppThemeProvider, ThemeScope } from "./index";
import { Button, TextField, Typography } from "../components/primitives";
import { AppModal } from "../components/AppModal";
import { tokens } from "../foundation/tokens.generated";
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
