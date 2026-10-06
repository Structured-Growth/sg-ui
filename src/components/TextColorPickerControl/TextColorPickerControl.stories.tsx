import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { TextColorPickerControl } from "./TextColorPickerControl";

const meta = {
  title: "Editors/TextColorPickerControl",
  component: TextColorPickerControl,
  tags: ["autodocs"],
} satisfies Meta<typeof TextColorPickerControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [color, setColor] = useState("#000000");

    return (
      <Box sx={{ p: 2 }}>
        <TextColorPickerControl onChange={setColor} value={color} />
        <Typography sx={{ mt: 1 }} variant="body2">
          Selected: {color}
        </Typography>
      </Box>
    );
  },
};
