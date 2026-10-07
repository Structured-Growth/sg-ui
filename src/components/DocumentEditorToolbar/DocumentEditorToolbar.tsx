"use client";

import { forwardRef, useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { Button } from "../../experimental/Button/Button";
import { Select } from "../../experimental/Select/Select";
import { AddIcon } from "../../experimental/icons/AddIcon";
import { RemoveIcon } from "../../experimental/icons/RemoveIcon";
import { FormatBoldIcon } from "../../experimental/icons/FormatBoldIcon";
import { FormatItalicIcon } from "../../experimental/icons/FormatItalicIcon";
import { FormatListBulletedIcon } from "../../experimental/icons/FormatListBulletedIcon";
import { FormatListNumberedIcon } from "../../experimental/icons/FormatListNumberedIcon";
import { FormatAlignLeftIcon } from "../../experimental/icons/FormatAlignLeftIcon";
import { FormatAlignCenterIcon } from "../../experimental/icons/FormatAlignCenterIcon";
import { FormatAlignRightIcon } from "../../experimental/icons/FormatAlignRightIcon";
import { FormatAlignJustifyIcon } from "../../experimental/icons/FormatAlignJustifyIcon";
import { useTranslation } from "../../i18n";
import styles from "./DocumentEditorToolbar.module.css";

export type DocumentEditorToolbarProps = {
  canEdit: boolean;
  headingValue: "normal" | "h1" | "h2" | "h3" | "h4" | "h5";
  onHeadingChange?: (heading: "normal" | "h1" | "h2" | "h3" | "h4" | "h5") => void;
  zoomValue?: number;
  onZoomOut?: () => void;
  onZoomIn?: () => void;
  actions: {
    bold: { active: boolean; onClick?: () => void };
    italic: { active: boolean; onClick?: () => void };
    bulletList: { active: boolean; onClick?: () => void };
    orderedList: { active: boolean; onClick?: () => void };
  };
  statusLabel?: string;
  /** A native CSS color, including an owned token variable. */
  statusColor?: string;
  showZoomControls?: boolean;
  showAlignmentControls?: boolean;
  showCustomComponentAction?: boolean;
  rightSlot?: ReactNode;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
};
// Keep server rendering effect-free while updating delivery ownership at commit.
const useCommittedEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
const headings = ["normal", "h1", "h2", "h3", "h4", "h5"] as const;

export const DocumentEditorToolbar = forwardRef<HTMLDivElement, DocumentEditorToolbarProps>(function DocumentEditorToolbar({
  canEdit, headingValue, onHeadingChange, zoomValue = 100, onZoomOut, onZoomIn, actions,
  statusLabel, statusColor, showZoomControls = true, showAlignmentControls = true,
  showCustomComponentAction = false, rightSlot, className, style, "aria-label": ariaLabel,
}, ref) {
  const { t } = useTranslation();
  const pendingChanges = useRef(new Set<ReturnType<typeof setTimeout>>());
  const headingOwner = useRef({ canEdit, onHeadingChange });
  useCommittedEffect(() => {
    headingOwner.current = { canEdit, onHeadingChange };
    // Availability loss invalidates the original transaction, even if the host
    // re-enables editing or installs a callback before its delivery turn.
    if (!canEdit || !onHeadingChange) {
      pendingChanges.current.forEach(clearTimeout);
      pendingChanges.current.clear();
    }
  }, [canEdit, onHeadingChange]);
  useCommittedEffect(() => () => {
    pendingChanges.current.forEach(clearTimeout);
    pendingChanges.current.clear();
  }, []);
  const label = (id: string, fallback: string) => t(`common.ui.editor.${id}`, { defaultMessage: fallback });
  const action = (name: string, id: string, icon: ReactNode, callback?: () => void, disabled = false, active?: boolean) =>
    <Button aria-label={label(id, name)} aria-pressed={active} className={styles.action} variant="text" tone="neutral" density="compact" startIcon={icon} disabled={disabled || !callback} onPress={callback} />;
  return <div ref={ref} role="group" aria-label={ariaLabel ?? label("documentToolbar", "Document editing")}
    className={[styles.root, className].filter(Boolean).join(" ")} style={style} data-sgui-part="document-editor-toolbar">
    <div className={styles.controls}>
      {showZoomControls && <div className={styles.group}>
        {action("Zoom out", "zoomOut", <RemoveIcon />, onZoomOut)}
        <output className={styles.zoom} aria-label={label("zoom", "Zoom")}>{zoomValue}%</output>
        {action("Zoom in", "zoomIn", <AddIcon />, onZoomIn)}
      </div>}
      <Select className={styles.heading} label={label("heading", "Text style heading")} value={headingValue} disabled={!canEdit || !onHeadingChange}
        options={headings.map((id, index) => ({ id, label: label(`documentHeading${index}`, index === 0 ? "Normal" : `H${index}`) }))}
        onValueChange={value => {
          if (!headingOwner.current.canEdit || !headingOwner.current.onHeadingChange || value === null || !headings.includes(value as typeof headings[number])) return;
          // Let the select finish native Enter handling and restore focus before
          // host commands refocus contenteditable and edit its selection.
          const timer = setTimeout(() => {
            // A cleared transaction must never revive after availability returns.
            if (!pendingChanges.current.delete(timer)) return;
            const owner = headingOwner.current;
            if (owner.canEdit) owner.onHeadingChange?.(value as typeof headings[number]);
          }, 0);
          pendingChanges.current.add(timer);
        }} />
      <div className={styles.group}>
        {action("Bold", "bold", <FormatBoldIcon />, actions.bold.onClick, !canEdit, actions.bold.active)}
        {action("Italic", "italic", <FormatItalicIcon />, actions.italic.onClick, !canEdit, actions.italic.active)}
        {action("Bulleted list", "bulletList", <FormatListBulletedIcon />, actions.bulletList.onClick, !canEdit, actions.bulletList.active)}
        {action("Numbered list", "orderedList", <FormatListNumberedIcon />, actions.orderedList.onClick, !canEdit, actions.orderedList.active)}
      </div>
      {showAlignmentControls && <div className={styles.group}>
        {action("Align left", "alignLeft", <FormatAlignLeftIcon />)}
        {action("Align center", "alignCenter", <FormatAlignCenterIcon />)}
        {action("Align right", "alignRight", <FormatAlignRightIcon />)}
        {action("Justify", "alignJustify", <FormatAlignJustifyIcon />)}
      </div>}
      {showCustomComponentAction && <Button disabled variant="text" tone="neutral" density="compact" startIcon={<AddIcon />}>{label("customComponent", "Custom component")}</Button>}
    </div>
    {rightSlot != null ? <div className={styles.slot}>{rightSlot}</div> : statusLabel ?
      <span className={styles.status} style={statusColor ? { color: statusColor } : undefined}>{statusLabel}</span> : null}
  </div>;
});
