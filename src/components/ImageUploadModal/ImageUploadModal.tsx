import { useRef, useState } from "react";
import type { DragEvent } from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { AppButton } from "../AppButton";
import { AppModal } from "../AppModal";
import { Box, Stack, Typography } from "../primitives";

export type ImageUploadModalProps = {
  open: boolean;
  uploading?: boolean;
  errorMessage?: string | null;
  title?: string;
  onClose: () => void;
  onSubmit: (file: File) => Promise<void> | void;
};

export function ImageUploadModal({
  open,
  uploading = false,
  errorMessage = null,
  title = "Insert Image",
  onClose,
  onSubmit,
}: ImageUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const pickFile = () => {
    inputRef.current?.click();
  };

  const onDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0] ?? null;
    if (file) {
      setSelectedFile(file);
    }
  };

  const onDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
  };

  return (
    <AppModal
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      open={open}
      primaryAction={{
        disabled: uploading || !selectedFile,
        label: uploading ? "Uploading..." : "Insert",
        onClick: async () => {
          if (!selectedFile) {
            return;
          }
          await onSubmit(selectedFile);
          setSelectedFile(null);
        },
      }}
      secondaryAction={{
        color: "inherit",
        label: "Cancel",
        onClick: () => {
          setSelectedFile(null);
          onClose();
        },
        variant: "text",
      }}
      title={title}
    >
      <Stack spacing={1.5}>
        <Box
          onDrop={onDrop}
          onDragOver={onDragOver}
          sx={{
            alignItems: "center",
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            p: 3,
          }}
        >
          <UploadFileIcon color="action" fontSize="large" />
          <Typography variant="body2">Drag and drop an image here</Typography>
          <AppButton onClick={pickFile} size="small" variant="outlined">
            Search Files
          </AppButton>
          <Typography color="text.secondary" variant="caption">
            JPG, PNG, WEBP, AVIF, or GIF
          </Typography>
          <input
            accept="image/*"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              setSelectedFile(file);
            }}
            ref={inputRef}
            type="file"
          />
        </Box>

        {selectedFile ? (
          <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 1 }}>
            <Typography variant="body2">{selectedFile.name}</Typography>
            <Typography color="text.secondary" variant="caption">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </Typography>
          </Box>
        ) : null}

        {errorMessage ? (
          <Typography color="error" variant="body2">
            {errorMessage}
          </Typography>
        ) : null}
      </Stack>
    </AppModal>
  );
}
