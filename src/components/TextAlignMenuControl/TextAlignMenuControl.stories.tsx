import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import { TextAlignMenuControl } from "./TextAlignMenuControl";

const meta = {
  title: "Editors/TextAlignMenuControl",
  component: TextAlignMenuControl,
  tags: ["autodocs"],
} satisfies Meta<typeof TextAlignMenuControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<"left" | "center" | "right" | "justify" | "start" | "end">("left");

    return (
      <Box sx={{ p: 2 }}>
        <TextAlignMenuControl onChange={setValue} value={value} />
      </Box>
    );
  },
};
