import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "./TextField";
import { Button } from "../Button/Button";
import { ThemeScope } from "../../foundation/ThemeScope";
import { tokens } from "../../foundation/tokens.generated";

const meta = {
  title: "Migration proofs/TextField", component: TextField, tags: ["autodocs"],
  args: { label: "Course name", description: "This name is visible to learners.", name: "course" },
  decorators: [(Story) => <ThemeScope style={{ background: tokens.surface, color: tokens.text, padding: tokens.space4, maxWidth: "30rem" }}><Story /></ThemeScope>],
} satisfies Meta<typeof TextField>;
export default meta;
// Storybook cannot infer required args from the accessible-name union.
type Story = StoryObj<{ label: string; description?: string; name?: string }>;
export const Default: Story = {};
export const States: Story = {
  render: () => <ThemeScope theme="dark" density="compact" style={{ background: tokens.surface, padding: tokens.space4, display: "grid", gap: tokens.space3 }}>
    <TextField label="Course name" defaultValue="Introduction" />
    <TextField label="Read only" value="Published course" readOnly />
    <TextField label="Unavailable" disabled />
    <TextField label="Course name" invalid errorMessage="A course with this name already exists." />
  </ThemeScope>,
};
export const NativeForm: Story = {
  render: () => <form onSubmit={event => event.preventDefault()} style={{ display: "grid", gap: tokens.space4 }}>
    <TextField label="Contact email" name="email" type="email" required description="Enter an email address before saving." />
    <Button type="submit">Save</Button><Button type="reset" variant="outlined" tone="neutral">Reset</Button>
  </form>,
};
