import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box } from "../../experimental/Box/Box";
import { Stack } from "../../experimental/Stack/Stack";
import { Typography, type TypographyVariant } from "../../experimental/Typography/Typography";
import { Provider } from "../../experimental/Provider/Provider";
import tokenSource from "../../foundation/tokens.json";

const sample = "The quick brown fox jumps over the lazy dog.";
const variants: readonly TypographyVariant[] = ["h1", "h2", "h3", "h4", "h5", "h6", "body1", "body2", "bodyAlt2", "subtitle1", "subtitle2", "button", "caption", "overline", "code"];

function TypefacesPreview() {
  return <Stack gap={3}>
    <Stack gap={1}>
      <Typography as="h2" variant="h5">Default Typeface</Typography>
      <Typography variant="body2">{tokenSource.shared.fontFamily.$value}</Typography>
    </Stack>
    <Stack gap={1}>
      <Typography as="h2" variant="h5">Typography Variants</Typography>
      {variants.map(variant => <Box key={variant}>
        <Typography as="h3" variant="body2" tone="muted">{variant}</Typography>
        <Typography as={variant === "code" ? "code" : "p"} variant={variant}>{sample}</Typography>
      </Box>)}
    </Stack>
  </Stack>;
}

const meta = {
  title: "Foundations/Typefaces",
  parameters: { layout: "padded" },
  decorators: [(Story) => <Provider><Story /></Provider>],
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Defaults: Story = { render: () => <TypefacesPreview /> };
export const Dark: Story = { render: () => <Provider theme="dark"><TypefacesPreview /></Provider> };
