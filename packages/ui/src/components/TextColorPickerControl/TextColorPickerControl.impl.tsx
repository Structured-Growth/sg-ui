"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "../../experimental/Button/Button";
import { Popover } from "../../experimental/Popover/Popover";
import { TextField } from "../../experimental/TextField/TextField";
import { FormatColorTextIcon } from "../../experimental/icons/FormatColorTextIcon";
import { FormatColorFillIcon } from "../../experimental/icons/FormatColorFillIcon";
import { ArrowDropDownIcon } from "../../experimental/icons/ArrowDropDownIcon";
import { tokens } from "../../foundation/tokens.generated";
import { useTranslation } from "../../i18n";
import styles from "./TextColorPickerControl.module.css";

const presetDefinitions = [
  ["text", "Text"], ["textMuted", "Muted text"], ["action", "Primary"],
  ["actionHover", "Primary emphasis"], ["danger", "Error"],
  ["surface", "Surface"], ["surfaceSubtle", "Subtle surface"],
] as const;

function normalizeHex(value: string) {
  return /^#[\da-f]{6}$/i.test(value.trim()) ? value.trim().toLowerCase() : null;
}

export type TextColorPickerControlProps = {
  value?: string;
  onChange?: (nextColor: string) => void;
  triggerIcon?: ReactNode;
  disabled?: boolean;
  /** Chooses the accessible name and reset value. Clear emits an empty string. */
  mode?: "foreground" | "background";
};

export function TextColorPickerControl({ value = "#000000", onChange, triggerIcon,
  disabled = false, mode = "foreground" }: TextColorPickerControlProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const [invalid, setInvalid] = useState(false);
  const [nativeColor, setNativeColor] = useState(normalizeHex(value) ?? "#000000");
  const field = useRef<HTMLInputElement>(null);
  const sample = useRef<HTMLSpanElement>(null);
  const lastCommitted = useRef(value);
  const resetValue = mode === "background" ? "#ffffff" : "#000000";
  const title = mode === "background"
    ? t("common.ui.editor.backgroundColor", { defaultMessage: "Background color" })
    : t("common.ui.editor.textColor", { defaultMessage: "Text color" });
  const isDisabled = disabled || !onChange;

  useEffect(() => {
    setDraft(value); setInvalid(false); lastCommitted.current = value;
  }, [value]);

  useEffect(() => {
    if (isDisabled) setOpen(false);
  }, [isDisabled]);

  useEffect(() => {
    const hex = normalizeHex(draft);
    if (hex) { setNativeColor(hex); return; }
    if (!open || !sample.current) return;
    // Resolve inherited theme tokens only after mount; SSR never reads browser globals.
    const resolved = getComputedStyle(sample.current).backgroundColor;
    const channels = /^rgba?\(\s*(\d+)[, ]+\s*(\d+)[, ]+\s*(\d+)/.exec(resolved);
    if (channels) setNativeColor(`#${channels.slice(1, 4).map(channel => Number(channel).toString(16).padStart(2, "0")).join("")}`);
  }, [draft, open]);

  const commit = (next: string) => {
    if (isDisabled) return;
    setDraft(next); setInvalid(false);
    if (lastCommitted.current === next) return;
    lastCommitted.current = next;
    onChange?.(next);
  };
  const commitDraft = () => {
    if (draft === lastCommitted.current) return;
    const hex = normalizeHex(draft);
    if (!hex) { setInvalid(true); return; }
    commit(hex);
  };

  return <Popover title={title} open={open} onOpenChange={next => {
    if (next && isDisabled) return;
    setOpen(next);
    if (next) { setDraft(value); setInvalid(false); lastCommitted.current = value; }
  }} trigger={<Button variant="text" tone="neutral" density="compact" disabled={isDisabled}
    aria-label={title} className={styles.trigger} startIcon={triggerIcon ?? (mode === "background" ? <FormatColorFillIcon /> : <FormatColorTextIcon />)}
    endIcon={<ArrowDropDownIcon />}><span aria-hidden="true" className={styles.indicator} style={{ backgroundColor: value || "transparent" }} /></Button>}>
    <div className={styles.content} data-sgui-part="color-picker">
      <form onKeyDown={event => { if (event.key === "Enter" && event.nativeEvent.isComposing) event.preventDefault(); }} onSubmit={event => { event.preventDefault(); event.stopPropagation(); commitDraft(); if (!normalizeHex(draft) && draft !== lastCommitted.current) field.current?.focus(); }}>
        <TextField ref={field} label={t("common.ui.editor.hexColor", { defaultMessage: "Hex color" })}
          autoFocus density="compact" value={draft} onValueChange={next => { setDraft(next); setInvalid(false); }}
          invalid={invalid} errorMessage={t("common.ui.editor.invalidHexColor", { defaultMessage: "Enter a six-digit hex color, such as #336699." })}
          onBlur={commitDraft} />
      </form>
      <div className={styles.swatches} role="group" aria-label={t("common.ui.editor.themeColors", { defaultMessage: "Theme colors" })}>
        {presetDefinitions.map(([key, fallback]) => <Button key={key} variant="outlined" tone="neutral" density="compact"
          className={styles.swatch} aria-label={t(`common.ui.editor.color.${key}`, { defaultMessage: fallback })}
          aria-pressed={draft === tokens[key]} style={{ backgroundColor: tokens[key] }} onPress={() => commit(tokens[key])} />)}
      </div>
      <label className={styles.nativeLabel}>{t("common.ui.editor.customColor", { defaultMessage: "Custom color" })}
        <input className={styles.native} type="color" value={nativeColor} onChange={event => commit(event.target.value)} />
      </label>
      <span ref={sample} className={styles.sample} aria-hidden="true" style={{ backgroundColor: draft }} />
      <div className={styles.actions}>
        <Button variant="text" tone="neutral" density="compact" onPress={() => commit("")}>{t("common.ui.clear", { defaultMessage: "Clear" })}</Button>
        <Button variant="text" tone="neutral" density="compact" onPress={() => commit(resetValue)}>{t("common.ui.reset", { defaultMessage: "Reset" })}</Button>
      </div>
    </div>
  </Popover>;
}
