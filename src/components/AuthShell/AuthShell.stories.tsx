import type { Meta, StoryObj } from "@storybook/react-vite";
import Link from "../../adapters/Link";
import { AuthShell } from "./AuthShell";
import { AppButton } from "../AppButton";
import { Stack, TextField, Typography } from "../primitives";

const meta = {
  title: "Layout/AuthShell",
  component: AuthShell,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AuthShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Login: Story = {
  args: {
    children: undefined,
    title: "Sign In",
  },
  render: () => (
    <AuthShell subtitle="Use your school email to continue." title="Sign In">
      <Stack spacing={2}>
        <TextField fullWidth label="Email Address" placeholder="name@school.org" />
        <AppButton size="large">Continue</AppButton>
        <Typography variant="body2">
          Need help? <Link href="/forgot-password">Reset your password</Link>
        </Typography>
      </Stack>
    </AuthShell>
  ),
};
