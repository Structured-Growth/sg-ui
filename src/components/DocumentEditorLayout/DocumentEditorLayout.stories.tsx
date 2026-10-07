import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../experimental/Button/Button";
import { Typography } from "../../experimental/Typography/Typography";
import { ThemeScope } from "../../foundation/ThemeScope";
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
    style: { height: 420, border: "1px solid var(--sgui-divider)" },
    headerRight: <Button density="compact" variant="outlined">Save</Button>,
    menuBar: <Typography variant="body2">File · Edit · View</Typography>,
    toolbar: <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--sgui-space2)" }}>
      <Button density="compact" variant="outlined">Bold</Button><Button density="compact" variant="outlined">Italic</Button>
    </div>,
    children: <div style={{ padding: "var(--sgui-space4)", flex: 1, minHeight: 0, overflow: "auto" }}>
      {Array.from({ length: 20 }, (_, i) => <Typography key={i}>Editor content paragraph {i + 1}. The document scrolls while its header and tools remain visible.</Typography>)}
      <Button variant="outlined">End of document action</Button>
    </div>,
  },
};
export const CustomTitle: Story = {
  args: { ...Default.args, titleNode: <Typography as="h2" variant="h6">Host document heading</Typography>, menuBar: undefined },
};
export const NarrowDark: Story = {
  args: { ...Default.args, title: "A document with a long translated title that wraps within the available width" },
  decorators: [(Story) => <ThemeScope theme="dark" style={{ width: 260, maxWidth: "100%" }}><Story /></ThemeScope>],
};
