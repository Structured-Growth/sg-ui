"use client";

import type { ReactNode } from "react";
import { AppButton } from "../AppButton";
import { Menu } from "../../experimental/Menu/Menu";
import { ArrowDropDownIcon } from "../../experimental/icons/ArrowDropDownIcon";
import { FormatClearIcon } from "../../experimental/icons/FormatClearIcon";
import { FormatStrikethroughIcon } from "../../experimental/icons/FormatStrikethroughIcon";
import { HighlightIcon } from "../../experimental/icons/HighlightIcon";
import { SubscriptIcon } from "../../experimental/icons/SubscriptIcon";
import { SuperscriptIcon } from "../../experimental/icons/SuperscriptIcon";
import { useTranslation } from "../../i18n";
import styles from "./TextStyleMenuControl.module.css";

export type TextStyleId = "lowercase" | "uppercase" | "capitalize" | "strikethrough" | "subscript" | "superscript" | "highlight";
type TextStyleAction = { id: TextStyleId | "clear"; label: string; icon: ReactNode; shortcut?: string; onPress?: () => void };

export type TextStyleMenuControlProps = {
  onLowercase?: () => void;
  onUppercase?: () => void;
  onCapitalize?: () => void;
  onStrikethrough?: () => void;
  onSubscript?: () => void;
  onSuperscript?: () => void;
  onHighlight?: () => void;
  onClearFormatting?: () => void;
  /** Host-controlled formatting state. Omit to render ordinary action items. */
  activeStyles?: readonly TextStyleId[];
  disabled?: boolean;
};

/** Commands operate on the host's editor selection; this control does not own editor state. */
export function TextStyleMenuControl({ onLowercase, onUppercase, onCapitalize, onStrikethrough, onSubscript, onSuperscript, onHighlight, onClearFormatting, activeStyles, disabled = false }: TextStyleMenuControlProps) {
  const { t } = useTranslation();
  const label = t("common.ui.editor.textStyle", { defaultMessage: "Text style" });
  const actions: TextStyleAction[] = [
    { id: "lowercase", icon: <span className={styles.letters}>abc</span>, label: t("common.ui.editor.lowercase", { defaultMessage: "Lowercase" }), onPress: onLowercase, shortcut: "^+Shift+1" },
    { id: "uppercase", icon: <span className={styles.letters}>ABC</span>, label: t("common.ui.editor.uppercase", { defaultMessage: "Uppercase" }), onPress: onUppercase, shortcut: "^+Shift+2" },
    { id: "capitalize", icon: <span className={styles.letters}>Tt</span>, label: t("common.ui.editor.capitalize", { defaultMessage: "Capitalize" }), onPress: onCapitalize, shortcut: "^+Shift+3" },
    { id: "strikethrough", icon: <FormatStrikethroughIcon />, label: t("common.ui.editor.strikethrough", { defaultMessage: "Strikethrough" }), onPress: onStrikethrough, shortcut: "⌘+Shift+X" },
    { id: "subscript", icon: <SubscriptIcon />, label: t("common.ui.editor.subscript", { defaultMessage: "Subscript" }), onPress: onSubscript, shortcut: "⌘+," },
    { id: "superscript", icon: <SuperscriptIcon />, label: t("common.ui.editor.superscript", { defaultMessage: "Superscript" }), onPress: onSuperscript, shortcut: "⌘+." },
    { id: "highlight", icon: <HighlightIcon />, label: t("common.ui.editor.highlight", { defaultMessage: "Highlight" }), onPress: onHighlight },
    { id: "clear", icon: <FormatClearIcon />, label: t("common.ui.editor.clearFormatting", { defaultMessage: "Clear Formatting" }), onPress: onClearFormatting, shortcut: "⌘+\\" },
  ];
  return <Menu label={label} density="compact"
    items={actions.map(action => ({ id: action.id, label: action.label, icon: action.icon, shortcut: action.shortcut,
      disabled: !action.onPress, selected: activeStyles && action.id !== "clear" ? activeStyles.includes(action.id) : undefined,
      separatorBefore: action.id === "clear" }))}
    onAction={id => actions.find(action => action.id === id)?.onPress?.()}
    trigger={<AppButton aria-label={label} tone="neutral" variant="text" density="compact" disabled={disabled} className={styles.trigger} endIcon={<ArrowDropDownIcon />}><span aria-hidden="true">Aa</span></AppButton>} />;
}
