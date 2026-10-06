import { useState } from "react";
import { AppModal } from "../AppModal";
import { Box, TextField } from "../primitives";

export type LinkUrlModalProps = {
  open: boolean;
  initialDisplayText?: string;
  initialUrl?: string;
  onClose: () => void;
  onSubmit: (payload: { displayText: string; url: string | null }) => void;
  title?: string;
};

export function LinkUrlModal({
  open,
  initialDisplayText = "",
  initialUrl = "",
  onClose,
  onSubmit,
  title = "Insert Link",
}: LinkUrlModalProps) {
  const [displayText, setDisplayText] = useState(initialDisplayText);
  const [url, setUrl] = useState(initialUrl);

  return (
    <AppModal
      fullWidth
      maxWidth="xs"
      onClose={() => onClose()}
      open={open}
      primaryAction={{
        label: "Apply",
        onClick: () => {
          const trimmed = url.trim();
          onSubmit({
            displayText: displayText.trim(),
            url: trimmed.length > 0 ? trimmed : null,
          });
        },
      }}
      secondaryAction={{
        color: "inherit",
        label: "Cancel",
        onClick: () => onClose(),
        variant: "text",
      }}
      title={title}
    >
      <Box sx={{ pt: 0.5 }}>
        <TextField
          autoFocus
          fullWidth
          label="Display Text"
          onChange={(event) => setDisplayText(event.target.value)}
          sx={{ mb: 1.5 }}
          value={displayText}
        />
        <TextField
          fullWidth
          label="URL"
          onChange={(event) => setUrl(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              const trimmed = url.trim();
              onSubmit({
                displayText: displayText.trim(),
                url: trimmed.length > 0 ? trimmed : null,
              });
            }
          }}
          placeholder="https://example.com"
          value={url}
        />
      </Box>
    </AppModal>
  );
}
