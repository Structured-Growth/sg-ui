import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "../../experimental/Link/Link";
import { Stack } from "../../experimental/Stack/Stack";
import { TextField } from "../../experimental/TextField/TextField";
import { Typography } from "../../experimental/Typography/Typography";
import { AuthShell } from "./AuthShell";
import { AppButton } from "../AppButton";

const meta = {
  title: "Layout/AuthShell",
  component: AuthShell,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof AuthShell>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Login: Story = {
  args: { children: undefined, title: "Sign In" },
  render: () => (
    <AuthShell subtitle="Use your school email to continue." title="Sign In">
      <form onSubmit={event => event.preventDefault()}>
        <Stack gap={4}>
          <TextField label="Email Address" name="email" type="email" autoComplete="email" placeholder="name@school.org" required />
          <AppButton type="submit">Continue</AppButton>
          <Typography variant="body2">Need help? <Link href="/forgot-password">Reset your password</Link></Typography>
        </Stack>
      </form>
    </AuthShell>
  ),
};

export const LongContent: Story = {
  args: {
    title: "A longer school sign in heading that wraps on narrow screens",
    subtitle: "The host supplies the form and any account or navigation callbacks.",
    footerContent: <><Link href="/help">Contact your school administrator</Link><Link href="/privacy">Privacy policy</Link></>,
    children: <Stack gap={4}>{Array.from({ length: 12 }, (_, index) => <TextField key={index} label={`Host form field ${index + 1}`} />)}</Stack>,
  },
};
