"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../components/Button/Button";
import { TextField } from "../TextField/TextField";
import { Popover } from "../Popover/Popover";
import { useTranslation } from "../../i18n";

/** Private shared pointer alternative. Width requests remain owned by the grid host. */
export function GridColumnWidthControl({ label, width, minWidth, maxWidth, onWidthChange }: {
  label: string; width: () => number; minWidth: number; maxWidth?: number;
  onWidthChange: (width: number) => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  useEffect(() => {
    if (open || !restoreFocus.current) return;
    restoreFocus.current = false;
    const trigger = triggerRef.current;
    const view = trigger?.ownerDocument.defaultView;
    if (!trigger || !view) return;
    // Grid header focus restoration may choose its first action (sorting).
    // Repair this action only after the overlay's own restoration has settled,
    // and never move focus away from an unrelated host control.
    const frame = view.requestAnimationFrame(() => {
      const active = trigger.ownerDocument.activeElement;
      if (trigger.isConnected && !trigger.disabled && !trigger.closest('[inert], [hidden], [aria-hidden="true"]')
        && (active === trigger.ownerDocument.body || trigger.closest('[role="columnheader"]')?.contains(active))) {
        trigger.focus({ preventScroll: true });
      }
    });
    return () => view.cancelAnimationFrame(frame);
  }, [open]);
  const [draft, setDraft] = useState("");
  const [effectiveWidth, setEffectiveWidth] = useState(0);
  const value = Number(draft);
  const valid = draft.trim() !== "" && Number.isFinite(value) && value >= minWidth && value <= (maxWidth ?? Infinity);
  const fixed = minWidth === maxWidth;
  const title = t("common.ui.grid.columnWidth", { defaultMessage: "Width of {label}", values: { label } });
  const request = (next: number) => {
    onWidthChange(next);
    // Closing ends the request. Reopening reads the effective host width again,
    // including host rejection, flex-column allocation and external replacement.
    restoreFocus.current = true;
    setOpen(false);
  };
  return <Popover title={title} size="content" open={open} onOpenChange={next => {
    if (next) {
      const current = width(); setDraft(String(current)); setEffectiveWidth(current);
    }
    if (!next) restoreFocus.current = true;
    setOpen(next);
  }} trigger={<Button ref={triggerRef} variant="text" tone="neutral" aria-label={title} disabled={fixed}>↔</Button>}>
    <div style={{ display: "grid", gap: "var(--sgui-space2)" }}>
      <TextField label={t("common.ui.grid.widthPixels", { defaultMessage: "Width in CSS pixels" })}
        inputMode="decimal" value={draft} onValueChange={setDraft} invalid={!valid}
        errorMessage={t("common.ui.grid.widthBounds", { defaultMessage: "Enter a finite width within the column limits." })} />
      <Button variant="outlined" tone="neutral" disabled={effectiveWidth <= minWidth}
        onPress={() => request(Math.max(minWidth, effectiveWidth - 1))}>{t("common.ui.grid.narrower", { defaultMessage: "Narrower by 1 pixel" })}</Button>
      <Button variant="outlined" tone="neutral" disabled={effectiveWidth >= (maxWidth ?? Infinity)}
        onPress={() => request(Math.min(maxWidth ?? Infinity, effectiveWidth + 1))}>{t("common.ui.grid.wider", { defaultMessage: "Wider by 1 pixel" })}</Button>
      <Button disabled={!valid || value === effectiveWidth} onPress={() => request(value)}>{t("common.ui.apply", { defaultMessage: "Apply" })}</Button>
    </div>
  </Popover>;
}
