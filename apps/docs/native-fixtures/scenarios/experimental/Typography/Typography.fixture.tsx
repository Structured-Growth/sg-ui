import type { Meta, StoryObj } from "../../../types";
import { Typography, type TypographyVariant } from "@structured-growth/sg-ui/experimental";
import { Provider } from "@structured-growth/sg-ui/theme";
const meta = { title: "Migration proofs/Typography", component: Typography, tags: ["autodocs"],
  decorators: [(Story) => <Provider><Story /></Provider>], args: { children: "Course details", variant: "bodyAlt2" },
} satisfies Meta<typeof Typography>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Roles: Story = { render: () => <>{(["h1", "h2", "h3", "h4", "h5", "h6", "body1", "body2", "bodyAlt2", "subtitle1", "subtitle2", "caption", "overline", "button", "code"] as TypographyVariant[])
  .map(variant => <Typography key={variant} variant={variant}>{variant}: The quick brown fox jumps over the lazy dog.</Typography>)}</> };
export const SemanticHeading: Story = { args: { variant: "h1", as: "h2" } };
