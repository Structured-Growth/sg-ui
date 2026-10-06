import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import DescriptionIcon from "@mui/icons-material/Description";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { ContentEditorChrome } from "./ContentEditorChrome";

const meta = {
  title: "Editors/ContentEditorChrome",
  component: ContentEditorChrome,
  tags: ["autodocs"],
  args: { icon: null, title: "Untitled document", onTitleSave: () => {}, menuItems: [] },
} satisfies Meta<typeof ContentEditorChrome>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [title, setTitle] = useState("Untitled document");

    return (
      <Box sx={{ maxWidth: 1100 }}>
        <ContentEditorChrome
          icon={<DescriptionIcon sx={{ fontSize: 40 }} />}
          menuItems={[
            { id: "file", label: "File", onClick: () => {} },
            { id: "edit", label: "Edit", onClick: () => {} },
            { id: "view", label: "View", onClick: () => {} },
            { id: "settings", label: "Settings", onClick: () => {} },
          ]}
          onTitleSave={async (nextTitle) => {
            setTitle(nextTitle);
          }}
          rightSlot={<Chip color="warning" label="Draft" size="small" />}
          title={title}
        />
      </Box>
    );
  },
};

export const ExtendedMenu: Story = {
  render: () => {
    const [title, setTitle] = useState("Biology Lesson");

    return (
      <Box sx={{ maxWidth: 1100 }}>
        <ContentEditorChrome
          icon={<DescriptionIcon sx={{ fontSize: 40 }} />}
          menuItems={[
            { id: "file", label: "File", onClick: () => {} },
            { id: "edit", label: "Edit", onClick: () => {} },
            { id: "view", label: "View", onClick: () => {} },
            { id: "insert", label: "Insert", onClick: () => {} },
            { id: "format", label: "Format", onClick: () => {} },
            { id: "tools", label: "Tools", onClick: () => {} },
          ]}
          onTitleSave={async (nextTitle) => {
            setTitle(nextTitle);
          }}
          rightSlot={<Chip color="warning" label="Draft" size="small" />}
          title={title}
        />
      </Box>
    );
  },
};
