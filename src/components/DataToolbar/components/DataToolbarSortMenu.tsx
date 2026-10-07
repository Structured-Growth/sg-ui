"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Button } from "../../../experimental/Button/Button";
import { Badge } from "../../../experimental/Badge/Badge";
import { IconButton } from "../../../experimental/IconButton/IconButton";
import { Popover } from "../../../experimental/Popover/Popover";
import { Select } from "../../../experimental/Select/Select";
import { AddIcon } from "../../../experimental/icons/AddIcon";
import { CloseIcon } from "../../../experimental/icons/CloseIcon";
import { DragIndicatorIcon } from "../../../experimental/icons/DragIndicatorIcon";
import { ExpandLessIcon } from "../../../experimental/icons/ExpandLessIcon";
import { ExpandMoreIcon } from "../../../experimental/icons/ExpandMoreIcon";
import { SortIcon } from "../../../experimental/icons/SortIcon";
import { useTranslation } from "../../../i18n";
import styles from "./DataToolbarSortMenu.module.css";

export type DataToolbarSortOption = { id: string; label: string };
export type DataToolbarSortDirection = "asc" | "desc";
export type DataToolbarSortRule = { field: string; direction: DataToolbarSortDirection | "" };
type DataToolbarSortMenuProps = {
  options: DataToolbarSortOption[];
  value: DataToolbarSortRule[];
  onApply: (nextRules: DataToolbarSortRule[]) => void;
};
type DraftRule = DataToolbarSortRule & { draftId: number };
type PointerMove = { sourceId: number; pointerId: number; x: number; y: number; moved: boolean; targetId: number | null; handle: HTMLSpanElement };

export function DataToolbarSortMenu({ options, value, onApply }: DataToolbarSortMenuProps) {
  const [open, setOpen] = useState(false);
  const [draftRules, setDraftRules] = useState<DraftRule[]>([]);
  const nextId = useRef(0);
  const columnTriggers = useRef(new Map<number, HTMLButtonElement>());
  const rows = useRef(new Map<number, HTMLDivElement>());
  const pointerMove = useRef<PointerMove | null>(null);
  const pendingFocus = useRef<number | null>(null);
  useEffect(() => {
    const draftId = pendingFocus.current;
    pendingFocus.current = null;
    if (!open || draftId === null) return;
    // React Aria completes press focus handling before the newly committed row receives focus.
    const timer = setTimeout(() => columnTriggers.current.get(draftId)?.focus(), 0);
    return () => clearTimeout(timer);
  }, [draftRules, open]);
  const [dropId, setDropId] = useState<number | null>(null);
  const clearPointer = () => {
    const current = pointerMove.current;
    pointerMove.current = null;
    if (current?.handle.hasPointerCapture?.(current.pointerId)) current.handle.releasePointerCapture(current.pointerId);
  };
  useEffect(() => () => clearPointer(), []);
  const { t, useNamespace } = useTranslation();
  useNamespace("common.ui");
  const tr = (key: string, defaultMessage: string) => t(key, { defaultMessage, namespace: "common.ui" });
  const sortLabel = tr("common.ui.toolbar.sort", "Sort");
  const validRules = (rules: DataToolbarSortRule[]) => {
    const fields = new Set(options.map(option => option.id));
    const seen = new Set<string>();
    return rules.filter(rule => {
      if (!rule.field || !fields.has(rule.field) || (rule.direction !== "asc" && rule.direction !== "desc") || seen.has(rule.field)) return false;
      seen.add(rule.field); return true;
    }).map(({ field, direction }) => ({ field, direction }));
  };
  const activeCount = validRules(value).length;
  const usedFields = draftRules.map(rule => rule.field).filter(Boolean);
  const availableField = options.find(option => !usedFields.includes(option.id));
  const makeDraft = (rule: DataToolbarSortRule): DraftRule => ({ ...rule, draftId: nextId.current++ });
  const resetDraft = () => {
    const rule = makeDraft({ field: "", direction: "" });
    pendingFocus.current = rule.draftId;
    setDraftRules([rule]);
  };
  const changeOpen = (nextOpen: boolean) => {
    clearPointer();
    pendingFocus.current = null;
    if (nextOpen) {
      const rules: DataToolbarSortRule[] = value.length ? value : [{ field: "", direction: "" }];
      setDraftRules(rules.map(makeDraft));
    }
    setDropId(null); setOpen(nextOpen);
  };
  const updateRule = (draftId: number, patch: Partial<DataToolbarSortRule>) =>
    setDraftRules(rules => rules.map(rule => rule.draftId === draftId ? { ...rule, ...patch } : rule));
  const moveRule = (sourceId: number, targetId: number) => {
    if (sourceId === targetId) return;
    pendingFocus.current = sourceId;
    setDraftRules(rules => {
      const source = rules.findIndex(rule => rule.draftId === sourceId);
      const target = rules.findIndex(rule => rule.draftId === targetId);
      if (source < 0 || target < 0 || source === target) return rules;
      const next = [...rules]; const [moved] = next.splice(source, 1); next.splice(target, 0, moved); return next;
    });
  };
  const trackPointer = (event: PointerEvent<HTMLSpanElement>) => {
    const current = pointerMove.current;
    if (!current || current.pointerId !== event.pointerId) return;
    if (!current.moved && Math.hypot(event.clientX - current.x, event.clientY - current.y) < 4) return;
    current.moved = true;
    event.preventDefault();
    current.targetId = null;
    for (const [id, row] of rows.current) {
      const rect = row.getBoundingClientRect();
      if (event.clientY >= rect.top && event.clientY <= rect.bottom && event.clientX >= rect.left && event.clientX <= rect.right) {
        current.targetId = id; break;
      }
    }
    setDropId(current.targetId !== current.sourceId ? current.targetId : null);
  };
  const trigger = <Button density="compact" variant="outlined" tone="neutral" startIcon={<SortIcon />}>
    {sortLabel}{activeCount > 0 && <Badge content={activeCount} className={styles.badge} />}
  </Button>;
  return <Popover trigger={trigger} title={sortLabel} size="lg" open={open} onOpenChange={changeOpen}>
    <div className={styles.body} data-sgui-density="compact">
      {draftRules.map((rule, index) => <div key={rule.draftId} ref={row => {
        if (row) rows.current.set(rule.draftId, row); else rows.current.delete(rule.draftId);
      }} className={styles.row} data-sgui-part="sort-rule" data-drop-target={dropId === rule.draftId || undefined}>
        <span className={styles.handle} aria-hidden="true" data-sgui-part="sort-rule-handle" data-reorderable={draftRules.length > 1 || undefined}
          onPointerDown={event => {
            if (draftRules.length < 2 || event.button !== 0 || pointerMove.current) return;
            event.preventDefault();
            pointerMove.current = { sourceId: rule.draftId, pointerId: event.pointerId, x: event.clientX, y: event.clientY, moved: false, targetId: null, handle: event.currentTarget };
            event.currentTarget.setPointerCapture?.(event.pointerId);
          }} onPointerMove={trackPointer} onPointerUp={event => {
            const current = pointerMove.current;
            if (!current || current.pointerId !== event.pointerId) return;
            trackPointer(event);
            clearPointer(); setDropId(null);
            if (current.moved && current.targetId !== null) moveRule(current.sourceId, current.targetId);
          }} onPointerCancel={event => {
            if (pointerMove.current?.pointerId !== event.pointerId) return;
            clearPointer(); setDropId(null);
          }} onLostPointerCapture={() => { clearPointer(); setDropId(null); }}><DragIndicatorIcon /></span>
        <Select ref={trigger => {
          if (trigger) columnTriggers.current.set(rule.draftId, trigger);
          else columnTriggers.current.delete(rule.draftId);
        }} className={styles.field} label={`${tr("common.ui.sort.column", "Column")} ${index + 1}`}
          placeholder={tr("common.ui.sort.selectColumn", "Select column")} value={rule.field || null}
          options={options.filter(option => option.id === rule.field || !usedFields.includes(option.id))}
          onValueChange={field => updateRule(rule.draftId, { field: field ?? "" })} />
        <Select className={styles.field} label={`${tr("common.ui.sort.order", "Order")} ${index + 1}`}
          placeholder={tr("common.ui.sort.selectOrder", "Select order")} value={rule.direction || null}
          options={[
            { id: "asc", label: tr("common.ui.sort.order.ascending", "Ascending") },
            { id: "desc", label: tr("common.ui.sort.order.descending", "Descending") },
          ]} onValueChange={direction => updateRule(rule.draftId, { direction: (direction ?? "") as DataToolbarSortDirection | "" })} />
        <div className={styles.rowActions}>
          <IconButton density="compact" label={`${tr("common.ui.sort.moveUp", "Move sort rule up")} ${index + 1}`} disabled={index === 0}
            onPress={() => moveRule(rule.draftId, draftRules[index - 1].draftId)}><ExpandLessIcon /></IconButton>
          <IconButton density="compact" label={`${tr("common.ui.sort.moveDown", "Move sort rule down")} ${index + 1}`} disabled={index === draftRules.length - 1}
            onPress={() => moveRule(rule.draftId, draftRules[index + 1].draftId)}><ExpandMoreIcon /></IconButton>
          <IconButton density="compact" label={`${tr("common.ui.sort.remove", "Remove sort rule")} ${index + 1}`} disabled={draftRules.length === 1}
            onPress={() => {
              pendingFocus.current = (draftRules[index + 1] ?? draftRules[index - 1]).draftId;
              setDraftRules(rules => rules.filter(current => current.draftId !== rule.draftId));
            }}><CloseIcon /></IconButton>
        </div>
      </div>)}
      <div className={styles.footer}>
        <IconButton density="compact" variant="outlined" label={tr("common.ui.sort.add", "Add sort rule")} disabled={!availableField}
          onPress={() => {
            if (!availableField) return;
            const rule = makeDraft({ field: availableField.id, direction: "asc" });
            pendingFocus.current = rule.draftId;
            setDraftRules(rules => [...rules, rule]);
          }}><AddIcon /></IconButton>
        <div className={styles.actions}>
          <Button density="compact" variant="outlined" tone="neutral" onPress={resetDraft}>{tr("common.ui.common.reset", "Reset")}</Button>
          <Button density="compact" variant="text" tone="neutral" onPress={() => changeOpen(false)}>{tr("common.ui.common.cancel", "Cancel")}</Button>
          <Button density="compact" onPress={() => {
            onApply(validRules(draftRules));
            changeOpen(false);
          }}>{tr("common.ui.common.apply", "Apply")}</Button>
        </div>
      </div>
    </div>
  </Popover>;
}
