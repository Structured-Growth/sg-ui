import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import { RichTextFormattingToolbar } from "./RichTextFormattingToolbar";

const meta = {
  title: "Editors/RichTextFormattingToolbar",
  component: RichTextFormattingToolbar,
  tags: ["autodocs"],
} satisfies Meta<typeof RichTextFormattingToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Box sx={{ width: "100%" }}>
      <RichTextFormattingToolbar />
    </Box>
  ),
};

export const DisabledControls: Story = {
  render: () => (
    <Box sx={{ width: "100%" }}>
      <RichTextFormattingToolbar
        disabledControls={{ bold: true, italic: true, textColor: true }}
        disabledControlSets={{ history: true, insert: true }}
      />
    </Box>
  ),
};

export const NoFontSelectors: Story = {
  render: () => (
    <Box sx={{ width: "100%" }}>
      <RichTextFormattingToolbar showFontFamilySelector={false} showFontSizeControls={false} />
    </Box>
  ),
};
