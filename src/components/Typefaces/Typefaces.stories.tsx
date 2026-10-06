import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

const sample = "The quick brown fox jumps over the lazy dog.";

function TypefacesPreview() {
  const theme = useTheme();

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h5">Default Typeface</Typography>
        <Typography variant="body2">{theme.typography.fontFamily}</Typography>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="h5">Typography Variants</Typography>

        <Stack spacing={1}>
          <Box>
            <Typography variant="h1">h1</Typography>
            <Typography variant="body2">{sample}</Typography>
          </Box>
          <Box>
            <Typography variant="h2">h2</Typography>
            <Typography variant="body2">{sample}</Typography>
          </Box>
          <Box>
            <Typography variant="h3">h3</Typography>
            <Typography variant="body2">{sample}</Typography>
          </Box>
          <Box>
            <Typography variant="h4">h4</Typography>
            <Typography variant="body2">{sample}</Typography>
          </Box>
          <Box>
            <Typography variant="h5">h5</Typography>
            <Typography variant="body2">{sample}</Typography>
          </Box>
          <Box>
            <Typography variant="h6">h6</Typography>
            <Typography variant="body2">{sample}</Typography>
          </Box>
          <Box>
            <Typography variant="body1">body1</Typography>
            <Typography variant="body1">{sample}</Typography>
          </Box>
          <Box>
            <Typography variant="body2">body2</Typography>
            <Typography variant="body2">{sample}</Typography>
          </Box>
          <Box>
            <Typography variant="bodyAlt2">bodyAlt2</Typography>
            <Typography variant="bodyAlt2">{sample}</Typography>
          </Box>
          <Box>
            <Typography variant="button">button</Typography>
            <Typography variant="button">{sample}</Typography>
          </Box>
          <Box>
            <Typography variant="caption">caption</Typography>
            <Typography variant="caption">{sample}</Typography>
          </Box>
          <Box>
            <Typography variant="overline">overline</Typography>
            <Typography variant="overline">{sample}</Typography>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}

const meta = {
  title: "Foundations/Typefaces",
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaults: Story = {
  render: () => <TypefacesPreview />,
};
