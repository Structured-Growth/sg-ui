import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DocumentEditorLayout } from "./DocumentEditorLayout";

const meta = {
  title: "Layout/DocumentEditorLayout",
  component: DocumentEditorLayout,
  tags: ["autodocs"],
} satisfies Meta<typeof DocumentEditorLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Document",
    headerRight: <Button size="small" variant="outlined">Save</Button>,
    menuBar: <Typography variant="body2">File  Edit  View</Typography>,
    toolbar: (
      <Stack direction="row" spacing={1}>
        <Button size="small" variant="outlined">Bold</Button>
        <Button size="small" variant="outlined">Italic</Button>
      </Stack>
    ),
    children: <Box sx={{ p: 2 }}><Typography variant="body1">Editor content area.</Typography></Box>,
  },
  decorators: [
    (Story) => (
      <Box sx={{ border: 1, borderColor: "divider", height: 420 }}>
        <Story />
      </Box>
    ),
  ],
};
