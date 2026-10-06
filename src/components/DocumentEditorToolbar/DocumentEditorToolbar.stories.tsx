import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import Box from "@mui/material/Box";
import { DocumentEditorToolbar } from "./DocumentEditorToolbar";

const meta = {
  title: "Components/DocumentEditorToolbar",
  component: DocumentEditorToolbar,
  args: {
    canEdit: true,
    headingValue: "normal",
    onHeadingChange: () => undefined,
    actions: {
      bold: { active: false, onClick: () => undefined },
      italic: { active: false, onClick: () => undefined },
      bulletList: { active: false, onClick: () => undefined },
      orderedList: { active: false, onClick: () => undefined },
    },
  },
  decorators: [
    (Story) => (
      <Box sx={{ p: 2 }}>
        <Story />
      </Box>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof DocumentEditorToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractivePreview() {
  const [heading, setHeading] = useState<"normal" | "h1" | "h2" | "h3" | "h4" | "h5">("normal");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [bulletList, setBulletList] = useState(false);
  const [orderedList, setOrderedList] = useState(false);
  const [zoom, setZoom] = useState(100);

  return (
    <DocumentEditorToolbar
      actions={{
        bold: { active: bold, onClick: () => setBold((value) => !value) },
        italic: { active: italic, onClick: () => setItalic((value) => !value) },
        bulletList: { active: bulletList, onClick: () => setBulletList((value) => !value) },
        orderedList: { active: orderedList, onClick: () => setOrderedList((value) => !value) },
      }}
      canEdit
      headingValue={heading}
      onHeadingChange={setHeading}
      onZoomIn={() => setZoom((value) => value + 10)}
      onZoomOut={() => setZoom((value) => Math.max(50, value - 10))}
      statusLabel="Last saved 2 minutes ago"
      zoomValue={zoom}
    />
  );
}

export const Interactive: Story = {
  render: () => <InteractivePreview />,
};

export const ReadOnly: Story = {
  args: {
    canEdit: false,
    headingValue: "normal",
    onHeadingChange: () => undefined,
    actions: {
      bold: { active: false, onClick: () => undefined },
      italic: { active: false, onClick: () => undefined },
      bulletList: { active: false, onClick: () => undefined },
      orderedList: { active: false, onClick: () => undefined },
    },
    statusLabel: "Read-only",
  },
};
