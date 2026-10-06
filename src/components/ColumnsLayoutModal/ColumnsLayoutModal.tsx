import { useMemo, useState } from "react";
import { AppButton } from "../AppButton";
import { AppModal } from "../AppModal";
import { Box } from "../primitives";

export type ColumnsLayoutPreset =
  | "twoEqual"
  | "two2575"
  | "threeEqual"
  | "three255025"
  | "fourEqual";

const PRESET_LABELS: Record<ColumnsLayoutPreset, string> = {
  twoEqual: "2 columns (equal width)",
  two2575: "2 columns (25% - 75%)",
  threeEqual: "3 columns (equal width)",
  three255025: "3 columns (25% - 50% - 25%)",
  fourEqual: "4 columns (equal width)",
};

const PRESET_ORDER: ColumnsLayoutPreset[] = [
  "twoEqual",
  "two2575",
  "threeEqual",
  "three255025",
  "fourEqual",
];

export type ColumnsLayoutModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (preset: ColumnsLayoutPreset) => void;
  defaultPreset?: ColumnsLayoutPreset;
};

export function ColumnsLayoutModal({
  open,
  onClose,
  onSubmit,
  defaultPreset = "twoEqual",
}: ColumnsLayoutModalProps) {
  const [selectedPreset, setSelectedPreset] = useState<ColumnsLayoutPreset>(defaultPreset);

  const orderedOptions = useMemo(
    () => PRESET_ORDER.map((preset) => ({ label: PRESET_LABELS[preset], preset })),
    [],
  );

  return (
    <AppModal
      fullWidth={false}
      maxWidth={false}
      onClose={() => onClose()}
      open={open}
      paperSx={{ width: 460 }}
      primaryAction={{
        label: "Insert",
        onClick: () => onSubmit(selectedPreset),
      }}
      secondaryAction={{
        label: "Cancel",
        onClick: () => onClose(),
      }}
      showCloseButton
      title="Choose columns layout"
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
        {orderedOptions.map((option) => {
          const active = option.preset === selectedPreset;
          return (
            <AppButton
              color="inherit"
              key={option.preset}
              onClick={() => setSelectedPreset(option.preset)}
              size="large"
              sx={{
                borderColor: active ? "primary.main" : "transparent",
                borderRadius: 2,
                borderWidth: 2,
                justifyContent: "flex-start",
                px: 1.5,
              }}
              variant="outlined"
            >
              {option.label}
            </AppButton>
          );
        })}
      </Box>
    </AppModal>
  );
}
