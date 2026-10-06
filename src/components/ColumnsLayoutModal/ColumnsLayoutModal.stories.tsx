import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColumnsLayoutModal } from "./ColumnsLayoutModal";

const meta = {
  title: "Editors/ColumnsLayoutModal",
  component: ColumnsLayoutModal,
  tags: ["autodocs"],
} satisfies Meta<typeof ColumnsLayoutModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultPreset: "twoEqual",
    onClose: () => undefined,
    onSubmit: () => undefined,
    open: true,
  },
  render: (args) => {
    const [open, setOpen] = useState(true);
    return (
      <ColumnsLayoutModal
        {...args}
        onClose={() => setOpen(false)}
        onSubmit={() => setOpen(false)}
        open={open}
      />
    );
  },
};
