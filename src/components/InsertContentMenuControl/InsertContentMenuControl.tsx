"use client";
import { forwardRef, type CSSProperties } from "react";
import { Button } from "../../experimental/Button/Button";
import { Menu } from "../../experimental/Menu/Menu";
import { AddIcon } from "../../experimental/icons/AddIcon";
import { ArrowDropDownIcon } from "../../experimental/icons/ArrowDropDownIcon";
import { ImageIcon } from "../../experimental/icons/ImageIcon";
import { HorizontalRuleIcon } from "../../experimental/icons/HorizontalRuleIcon";
import { ViewWeekIcon } from "../../experimental/icons/ViewWeekIcon";
import { useTranslation } from "../../i18n";

export type InsertContentMenuControlProps = {
  disabled?: boolean;
  onInsertImage?: () => void;
  onInsertHorizontalRule?: () => void;
  onInsertColumnsLayout?: () => void;
  className?: string;
  style?: CSSProperties;
};

/** Host callbacks own insertion, announcements and subsequent editor/dialog focus. */
export const InsertContentMenuControl = forwardRef<HTMLButtonElement, InsertContentMenuControlProps>(function InsertContentMenuControl({
  disabled = false, onInsertImage, onInsertHorizontalRule, onInsertColumnsLayout, className, style,
}, ref) {
  const { t } = useTranslation();
  const label = t("editor.insert.menu", { defaultMessage: "Insert" });
  const actions = [
    { id: "image", label: t("editor.insert.image", { defaultMessage: "Image" }), icon: <ImageIcon />, callback: onInsertImage },
    { id: "horizontalRule", label: t("editor.insert.horizontalRule", { defaultMessage: "Horizontal Rule" }), icon: <HorizontalRuleIcon />, callback: onInsertHorizontalRule },
    { id: "columnsLayout", label: t("editor.insert.columnsLayout", { defaultMessage: "Columns Layout" }), icon: <ViewWeekIcon />, callback: onInsertColumnsLayout },
  ];
  return <Menu label={label} density="compact" items={actions.map(action => ({ ...action, disabled: !action.callback }))}
    onAction={id => actions.find(action => action.id === id)?.callback?.()}
    trigger={<Button ref={ref} disabled={disabled} className={className} style={style} density="compact" variant="text" tone="neutral" startIcon={<AddIcon />} endIcon={<ArrowDropDownIcon />}>{label}</Button>} />;
});
