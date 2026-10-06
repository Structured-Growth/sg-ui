import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppButton } from "../AppButton";
import { ImageUploadModal } from "./ImageUploadModal";

const meta = {
  title: "Editors/ImageUploadModal",
  component: ImageUploadModal,
  tags: ["autodocs"],
} satisfies Meta<typeof ImageUploadModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onClose: () => {},
    onSubmit: async () => {},
    open: false,
  },
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <AppButton onPress={() => setOpen(true)} density="compact" variant="outlined">
          Open Image Upload
        </AppButton>
        <ImageUploadModal
          onClose={() => setOpen(false)}
          onSubmit={async () => {
            setOpen(false);
          }}
          open={open}
        />
      </>
    );
  },
};
