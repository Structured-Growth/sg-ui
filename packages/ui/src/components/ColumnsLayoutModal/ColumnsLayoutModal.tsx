"use client";
import { useEffect, useState } from "react";
import { AppModal } from "../AppModal";
import { RadioGroup } from "../../experimental/RadioGroup/RadioGroup";
import { useTranslation } from "../../i18n";

export type ColumnsLayoutPreset = "twoEqual" | "two2575" | "threeEqual" | "three255025" | "fourEqual";
const PRESETS: readonly { value: ColumnsLayoutPreset; label: string }[] = [
  { value: "twoEqual", label: "2 columns (equal width)" },
  { value: "two2575", label: "2 columns (25% - 75%)" },
  { value: "threeEqual", label: "3 columns (equal width)" },
  { value: "three255025", label: "3 columns (25% - 50% - 25%)" },
  { value: "fourEqual", label: "4 columns (equal width)" },
];
export type ColumnsLayoutModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (preset: ColumnsLayoutPreset) => void;
  /** Initial selection for each opening; changes while open begin a new draft. */
  defaultPreset?: ColumnsLayoutPreset;
};
const normalizePreset = (value: ColumnsLayoutPreset): ColumnsLayoutPreset =>
  PRESETS.some(option => option.value === value) ? value : "twoEqual";

export function ColumnsLayoutModal({ open, onClose, onSubmit, defaultPreset = "twoEqual" }: ColumnsLayoutModalProps) {
  const { t } = useTranslation();
  const [selectedPreset, setSelectedPreset] = useState(() => normalizePreset(defaultPreset));
  useEffect(() => { if (open) setSelectedPreset(normalizePreset(defaultPreset)); }, [open, defaultPreset]);
  return <AppModal open={open} onClose={onClose} width={460} showCloseButton
    title={t("common.ui.columnsLayoutTitle", { defaultMessage: "Choose columns layout" })}
    primaryAction={{ label: t("common.ui.insert", { defaultMessage: "Insert" }), onPress: () => onSubmit(selectedPreset) }}
    secondaryAction={{ label: t("common.ui.cancel", { defaultMessage: "Cancel" }), onPress: onClose }}>
    <RadioGroup label={t("common.ui.columnsLayoutPreset", { defaultMessage: "Columns layout" })}
      value={selectedPreset} onValueChange={value => {
        const preset = PRESETS.find(option => option.value === value)?.value;
        if (preset) setSelectedPreset(preset);
      }} options={PRESETS.map(option => ({ value: option.value,
        label: t(`common.ui.columnsLayout.${option.value}`, { defaultMessage: option.label }) }))} />
  </AppModal>;
}
