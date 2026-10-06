import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box } from "@mui/material";
import { HeadingNode } from "@lexical/rich-text";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { FloatingTextSelectionToolbar } from "./FloatingTextSelectionToolbar";

const meta = {
  title: "Editors/FloatingTextSelectionToolbar",
  component: FloatingTextSelectionToolbar,
  tags: ["autodocs"],
} satisfies Meta<typeof FloatingTextSelectionToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Box sx={{ height: 300, p: 2 }}>
      <LexicalComposer
        initialConfig={{
          namespace: "floating-toolbar-story",
          nodes: [HeadingNode],
          onError: () => {},
          theme: {},
        }}
      >
        <FloatingTextSelectionToolbar />
        <RichTextPlugin
          ErrorBoundary={LexicalErrorBoundary}
          contentEditable={(
            <ContentEditable
              style={{
                border: "1px solid #ddd",
                minHeight: 200,
                outline: "none",
                padding: 12,
              }}
            />
          )}
          placeholder={<Box sx={{ color: "text.secondary", p: 1 }}>Highlight text to see menu</Box>}
        />
      </LexicalComposer>
    </Box>
  ),
};
