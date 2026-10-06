import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import { EditableTitleField } from "./EditableTitleField";

const meta = {
  title: "Editors/EditableTitleField",
  component: EditableTitleField,
  tags: ["autodocs"],
  args: { title: "Page title", onSave: () => {} },
} satisfies Meta<typeof EditableTitleField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [title, setTitle] = useState("Page title");
    return (
      <Box sx={{ p: 2 }}>
        <EditableTitleField
          onSave={async (nextTitle) => {
            setTitle(nextTitle);
          }}
          title={title}
          variant="h5"
        />
      </Box>
    );
  },
};
