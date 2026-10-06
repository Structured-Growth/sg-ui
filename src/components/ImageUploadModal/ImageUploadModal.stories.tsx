import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppButton } from "../AppButton";
import { Typography } from "../../experimental/Typography/Typography";
import { ImageUploadModal } from "./ImageUploadModal";

const meta = {
  title: "Editors/ImageUploadModal",
  component: ImageUploadModal,
  tags: ["autodocs"],
} satisfies Meta<typeof ImageUploadModal>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { onClose: () => {}, onSubmit: async () => {}, open: false },
  render: () => {
    const [open, setOpen] = useState(false);
    return <>
      <AppButton onPress={() => setOpen(true)} density="compact" variant="outlined">Open Image Upload</AppButton>
      <ImageUploadModal open={open} onClose={() => setOpen(false)} onSubmit={() => setOpen(false)} />
    </>;
  },
};

export const HostUploadAndDescription: Story = {
  args: { open: false, enableAltText: true, onClose: () => {}, onSubmit: () => {} },
  render: () => {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [attempt, setAttempt] = useState(0);
    const [result, setResult] = useState("");
    return <>
      <AppButton onPress={() => { setAttempt(0); setError(null); setOpen(true); }} variant="outlined">Insert image with description</AppButton>
      <Typography variant="body2">The host rejects the first attempt. Retry to insert the same file and description.</Typography>
      {result && <Typography role="status" variant="body2">{result}</Typography>}
      <ImageUploadModal open={open} enableAltText errorMessage={error} onClose={() => { setOpen(false); setError(null); }}
        onSubmit={async (file, altText) => {
          setError(null);
          await new Promise(resolve => setTimeout(resolve, 500));
          if (attempt === 0) { setAttempt(1); setError("Upload failed. The host asks you to retry."); return; }
          setResult(`Host received ${file.name}; description: ${altText || "decorative image"}`);
          setOpen(false);
        }} />
    </>;
  },
};

export const HostUploadingError: Story = {
  args: { open: true, uploading: true, errorMessage: "The host could not upload this image.", onClose: () => {}, onSubmit: () => {} },
};
