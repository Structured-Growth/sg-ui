import { useState } from "react";
import type { MouseEvent } from "react";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export type EditableTitleFieldProps = {
  title: string;
  placeholder?: string;
  onSave: (nextTitle: string) => Promise<void> | void;
  variant?: "h4" | "h5" | "h6";
  minWidth?: number;
  readOnly?: boolean;
};

export function EditableTitleField({
  title,
  placeholder = "Untitled document",
  onSave,
  variant = "h4",
  minWidth = 280,
  readOnly = false,
}: EditableTitleFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const [isSaving, setIsSaving] = useState(false);

  const enterEditMode = (event?: MouseEvent) => {
    event?.stopPropagation();
    if (isSaving || readOnly) {
      return;
    }
    setDraft(title);
    setIsEditing(true);
  };

  const save = async () => {
    const next = draft.trim();
    if (!next || next === title) {
      setDraft(title);
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(next);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box
      onClick={() => {
        if (!isEditing) {
          enterEditMode();
        }
      }}
      onDoubleClick={() => {
        enterEditMode();
      }}
      sx={{
        "& .editable-title-icon": { opacity: 0 },
        "&:hover .editable-title-icon": { opacity: 1 },
        alignItems: "center",
        cursor: readOnly ? "default" : "text",
        display: "inline-flex",
        minHeight: 44,
        minWidth,
        px: 1,
      }}
    >
      {isEditing ? (
        <TextField
          autoFocus
          onBlur={() => {
            if (!isSaving) {
              void save();
            }
          }}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (!isSaving) {
                void save();
              }
            }
            if (event.key === "Escape") {
              setDraft(title);
              setIsEditing(false);
            }
          }}
          size="small"
          sx={{ minWidth }}
          value={draft}
        />
      ) : (
        <>
          <Typography variant={variant}>{title || placeholder}</Typography>
          <IconButton className="editable-title-icon" disabled={readOnly} onClick={enterEditMode} size="small" sx={{ ml: 0.5 }}>
            <EditIcon fontSize="small" />
          </IconButton>
        </>
      )}
    </Box>
  );
}
