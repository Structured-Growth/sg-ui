"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { Button } from "../../../components/Button/Button";
import { Checkbox } from "../../../experimental/Checkbox/Checkbox";
import { Popover } from "../../../experimental/Popover/Popover";
import { TextField } from "../../../experimental/TextField/TextField";
import { DragIndicatorIcon } from "../../../experimental/icons/DragIndicatorIcon";
import { ExpandLessIcon } from "../../../experimental/icons/ExpandLessIcon";
import { ExpandMoreIcon } from "../../../experimental/icons/ExpandMoreIcon";
import { ViewColumnIcon } from "../../../experimental/icons/ViewColumnIcon";
import { useTranslation } from "../../../i18n";
import styles from "./DataToolbarColumnsMenu.module.css";

export type DataToolbarColumnOption = {
  id: string;
  label: string;
  /** Prevent hiding; independent of column order. */
  locked?: boolean;
  /** False fixes this option in its current position and removes reorder controls. */
  reorderable?: boolean;
  visible: boolean;
};

type DataToolbarColumnsMenuProps = {
  options: DataToolbarColumnOption[];
  onChange: (nextOptions: DataToolbarColumnOption[]) => void;
};

export function DataToolbarColumnsMenu({ options, onChange }: DataToolbarColumnsMenuProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rows = useRef(new Map<string, HTMLDivElement>());
  const pointer = useRef<{ sourceId: string; pointerId: number; x: number; y: number; moved: boolean; targetId: string | null; handle: HTMLSpanElement } | null>(null);
  const [drag, setDrag] = useState<{ sourceId: string; x: number; y: number; targetId: string | null } | null>(null);
  const clearPointer = () => {
    const current = pointer.current;
    pointer.current = null;
    setDrag(null);
    if (current?.handle.hasPointerCapture?.(current.pointerId)) current.handle.releasePointerCapture(current.pointerId);
  };
  useEffect(() => { clearPointer(); }, [options, query, open]);
  useEffect(() => () => clearPointer(), []);
  const { t, useNamespace } = useTranslation();
  useNamespace("common.ui");
  const tr = (key: string, defaultMessage: string) => t(key, { defaultMessage, namespace: "common.ui" });
  const columnsLabel = tr("common.ui.toolbar.columns", "Columns");
  const searchLabel = tr("common.ui.toolbar.search", "Search");
  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return normalizedQuery ? options.filter(option => option.label.toLowerCase().includes(normalizedQuery)) : options;
  }, [options, query]);

  const canMoveTo = (source: number, target: number) => source >= 0 && target >= 0 && target < options.length &&
    options.slice(Math.min(source, target), Math.max(source, target) + 1).every(option => option.reorderable !== false);
  const moveColumn = (id: string, offset: -1 | 1) => {
    const index = options.findIndex(option => option.id === id);
    const target = index + offset;
    if (!canMoveTo(index, target)) return;
    const next = [...options];
    [next[index], next[target]] = [next[target]!, next[index]!];
    onChange(next);
  };
  const reorderColumn = (sourceId: string, targetId: string) => {
    const source = options.findIndex(option => option.id === sourceId);
    const target = options.findIndex(option => option.id === targetId);
    if (!canMoveTo(source, target) || source === target) return;
    const next = [...options];
    const [moved] = next.splice(source, 1);
    next.splice(target, 0, moved!);
    onChange(next);
  };
  const trackPointer = (event: PointerEvent<HTMLSpanElement>) => {
    const current = pointer.current;
    if (!current || current.pointerId !== event.pointerId) return;
    if (!current.moved && Math.hypot(event.clientX - current.x, event.clientY - current.y) < 4) return;
    current.moved = true;
    event.preventDefault();
    current.targetId = null;
    const sourceIndex = options.findIndex(option => option.id === current.sourceId);
    for (const [id, row] of rows.current) {
      const rect = row.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) continue;
      const targetIndex = options.findIndex(option => option.id === id);
      if (!canMoveTo(sourceIndex, targetIndex)) break;
      const midpoint = rect.top + rect.height / 2;
      if ((targetIndex < sourceIndex && event.clientY <= midpoint) || (targetIndex > sourceIndex && event.clientY >= midpoint)) current.targetId = id;
      break;
    }
    setDrag({ sourceId: current.sourceId, x: event.clientX, y: event.clientY, targetId: current.targetId });
  };
  const moveLabel = (label: string, direction: "up" | "down") => t(`common.ui.columns.move.${direction}`, {
    defaultMessage: direction === "up" ? "Move {column} up" : "Move {column} down",
    namespace: "common.ui", values: { column: label },
  });

  return <Popover title={columnsLabel} open={open} onOpenChange={next => {
    clearPointer();
    setOpen(next);
    if (!next) setQuery("");
  }} trigger={<Button variant="outlined" tone="neutral" density="compact" startIcon={<ViewColumnIcon />}>{columnsLabel}</Button>}>
    <div className={styles.body} data-sgui-density="compact">
      <TextField type="search" aria-label={searchLabel} placeholder={searchLabel} value={query} onValueChange={setQuery} density="compact" />
      <div className={styles.options}>
        {filteredOptions.map(option => {
          const index = options.findIndex(item => item.id === option.id);
          return <div key={option.id} ref={row => { if (row) rows.current.set(option.id, row); else rows.current.delete(option.id); }}
            className={styles.option} data-sgui-part="column-option" data-column-id={option.id}
            data-dragging={drag?.sourceId === option.id || undefined}
            data-drop-target={drag?.targetId === option.id ? (options.findIndex(item => item.id === drag.sourceId) < index ? "after" : "before") : undefined}>
            {option.reorderable !== false ? <span className={styles.handle} aria-hidden="true" data-sgui-part="column-option-handle" data-reorderable={filteredOptions.length > 1 || undefined}
              onPointerDown={event => {
                if (option.reorderable === false || filteredOptions.length < 2 || event.button !== 0 || pointer.current) return;
                event.preventDefault();
                pointer.current = { sourceId: option.id, pointerId: event.pointerId, x: event.clientX, y: event.clientY, moved: false, targetId: null, handle: event.currentTarget };
                event.currentTarget.setPointerCapture?.(event.pointerId);
              }} onPointerMove={trackPointer} onPointerUp={event => {
                const current = pointer.current;
                if (!current || current.pointerId !== event.pointerId) return;
                trackPointer(event);
                clearPointer();
                if (current.moved && current.targetId !== null) reorderColumn(current.sourceId, current.targetId);
              }} onPointerCancel={event => {
                if (pointer.current?.pointerId === event.pointerId) clearPointer();
              }} onLostPointerCapture={() => { if (pointer.current) clearPointer(); }}><DragIndicatorIcon /></span> : <span className={styles.handleSpace} aria-hidden="true" />}
            <div className={styles.visibility}><Checkbox label={option.label} checked={option.visible} disabled={option.locked}
              onCheckedChange={visible => onChange(options.map(item => item.id === option.id ? { ...item, visible: item.locked ? true : visible } : item))} /></div>
            {option.reorderable !== false && <div className={styles.moves}>
              <Button variant="text" tone="neutral" density="compact" aria-label={moveLabel(option.label, "up")}
                disabled={!canMoveTo(index, index - 1)} onPress={() => moveColumn(option.id, -1)}><ExpandLessIcon /></Button>
              <Button variant="text" tone="neutral" density="compact" aria-label={moveLabel(option.label, "down")}
                disabled={!canMoveTo(index, index + 1)} onPress={() => moveColumn(option.id, 1)}><ExpandMoreIcon /></Button>
            </div>}
          </div>;
        })}
        {filteredOptions.length === 0 && <p className={styles.empty}>{tr("common.ui.columns.noMatching", "No matching columns")}</p>}
      </div>
      {drag && <div aria-hidden="true" data-sgui-part="column-drag-preview" className={styles.dragPreview}
        style={{ left: drag.x + 4, top: drag.y, "--drag-x": `${drag.x}px`, "--drag-y": `${drag.y}px` } as CSSProperties}>
        <DragIndicatorIcon /><span>{options.find(option => option.id === drag.sourceId)?.label}</span>
      </div>}
      <Button variant="outlined" tone="neutral" density="compact" className={styles.reset}
        onPress={() => onChange(options.map(option => ({ ...option, visible: true })))}>{tr("common.ui.common.reset", "Reset")}</Button>
    </div>
  </Popover>;
}
