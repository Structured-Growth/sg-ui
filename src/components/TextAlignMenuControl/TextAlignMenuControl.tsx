"use client";

import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { AppButton } from "../AppButton";
import { Menu, type MenuItem } from "../../experimental/Menu/Menu";
import { ArrowDropDownIcon } from "../../experimental/icons/ArrowDropDownIcon";
import { FormatAlignCenterIcon } from "../../experimental/icons/FormatAlignCenterIcon";
import { FormatAlignJustifyIcon } from "../../experimental/icons/FormatAlignJustifyIcon";
import { FormatAlignLeftIcon } from "../../experimental/icons/FormatAlignLeftIcon";
import { FormatAlignRightIcon } from "../../experimental/icons/FormatAlignRightIcon";
import { FormatIndentDecreaseIcon } from "../../experimental/icons/FormatIndentDecreaseIcon";
import { FormatIndentIncreaseIcon } from "../../experimental/icons/FormatIndentIncreaseIcon";
import { useTranslation } from "../../i18n";
import styles from "./TextAlignMenuControl.module.css";

export type AlignOption = "left" | "center" | "right" | "justify" | "start" | "end";
export type TextAlignMenuControlProps = {
  value?: AlignOption;
  disabled?: boolean;
  onChange?: (next: AlignOption) => void;
  onOutdent?: () => void;
  onIndent?: () => void;
  /** Host editor restrictions. Missing callbacks also disable their commands. */
  canOutdent?: boolean;
  canIndent?: boolean;
  className?: string;
  style?: CSSProperties;
};

const ALIGNMENTS: readonly AlignOption[] = ["left", "center", "right", "justify", "start", "end"];
const DEFAULT_LABELS: Record<AlignOption, string> = {
  left: "Left Align", center: "Center Align", right: "Right Align", justify: "Justify Align", start: "Start Align", end: "End Align",
};
const SHORTCUTS: Partial<Record<AlignOption, string>> = { left: "⌘+Shift+L", center: "⌘+Shift+E", right: "⌘+Shift+R", justify: "⌘+Shift+J" };
function alignmentIcon(value: AlignOption): ReactNode {
  if (value === "center") return <FormatAlignCenterIcon />;
  if (value === "justify") return <FormatAlignJustifyIcon />;
  if (value === "right") return <FormatAlignRightIcon />;
  if (value === "start" || value === "end") return <span className={styles.logical} data-align={value}>
    <FormatAlignLeftIcon className={styles.left} /><FormatAlignRightIcon className={styles.right} />
  </span>;
  return <FormatAlignLeftIcon />;
}

/** Owned compact alignment commands; the host retains editor selection and command state. */
export const TextAlignMenuControl = forwardRef<HTMLButtonElement, TextAlignMenuControlProps>(function TextAlignMenuControl({
  value = "left", disabled = false, onChange, onOutdent, onIndent, canOutdent = true, canIndent = true, className, style,
}, ref) {
  const { t } = useTranslation();
  const current = ALIGNMENTS.includes(value) ? value : "left";
  const labels = Object.fromEntries(ALIGNMENTS.map(id => [id, t(`common.ui.editor.align.${id}`, { defaultMessage: DEFAULT_LABELS[id] })])) as Record<AlignOption, string>;
  const items: MenuItem[] = [
    ...ALIGNMENTS.map(id => ({ id, label: labels[id], icon: alignmentIcon(id), shortcut: SHORTCUTS[id], selected: id === current, disabled: !onChange })),
    { id: "outdent", label: t("common.ui.editor.outdent", { defaultMessage: "Outdent" }), icon: <FormatIndentDecreaseIcon />, shortcut: "⌘+[", disabled: !onOutdent || !canOutdent, separatorBefore: true },
    { id: "indent", label: t("common.ui.editor.indent", { defaultMessage: "Indent" }), icon: <FormatIndentIncreaseIcon />, shortcut: "⌘+]", disabled: !onIndent || !canIndent },
  ];
  return <Menu label={t("common.ui.editor.alignment", { defaultMessage: "Text alignment" })} density="compact" items={items} selectionMode="single"
    onAction={id => {
      if (ALIGNMENTS.includes(id as AlignOption)) onChange?.(id as AlignOption);
      else if (id === "outdent") onOutdent?.();
      else if (id === "indent") onIndent?.();
    }} trigger={<AppButton ref={ref} aria-label={labels[current]} disabled={disabled} tone="neutral" density="compact" variant="text"
      className={[styles.trigger, className].filter(Boolean).join(" ")} style={style} startIcon={alignmentIcon(current)}>
      <ArrowDropDownIcon />
    </AppButton>} />;
});
