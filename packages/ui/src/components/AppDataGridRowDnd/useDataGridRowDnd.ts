"use client";

import { useCallback, useEffect, useRef, type DragEvent, type RefObject } from "react";
import styles from "./DataGridDragHandle.module.css";

export interface UseDataGridRowDndOptions<RowModel> {
  rowsById: ReadonlyMap<string, RowModel>;
  rowSelector?: string;
  /** Restrict native target resolution to this grid instance. */
  rootRef?: RefObject<HTMLElement | null>;
}
export interface ResolvedGridRow<RowModel> {
  row: RowModel;
  rowElement: HTMLElement;
}

const DEFAULT_ROW_SELECTOR = "[data-sgui-part='grid-row'][data-grid-row]";

export function useDataGridRowDnd<RowModel>({ rowSelector = DEFAULT_ROW_SELECTOR, rowsById, rootRef }: UseDataGridRowDndOptions<RowModel>) {
  const dragPreviewRef = useRef<HTMLDivElement | null>(null);
  const dragEndDocumentRef = useRef<Document | null>(null);
  const cleanupDragPreview = useCallback(() => {
    dragEndDocumentRef.current?.removeEventListener("dragend", cleanupDragPreview, true);
    dragEndDocumentRef.current = null;
    dragPreviewRef.current?.remove();
    dragPreviewRef.current = null;
  }, []);
  useEffect(() => cleanupDragPreview, [cleanupDragPreview]);

  const resolveRowFromEvent = (event: Pick<DragEvent<HTMLElement>, "target" | "nativeEvent" | "clientX" | "clientY">): ResolvedGridRow<RowModel> | null => {
    if (typeof document === "undefined" || typeof HTMLElement === "undefined") return null;
    const candidates: EventTarget[] = [];
    if (event.target) candidates.push(event.target);
    if (typeof event.nativeEvent?.composedPath === "function") candidates.push(...event.nativeEvent.composedPath());
    if (typeof event.clientX === "number" && typeof event.clientY === "number" && typeof document.elementFromPoint === "function") {
      const hovered = document.elementFromPoint(event.clientX, event.clientY);
      if (hovered) candidates.push(hovered);
    }
    for (const candidate of candidates) {
      if (!(candidate instanceof HTMLElement)) continue;
      const element = candidate.closest<HTMLElement>(rowSelector);
      const id = element?.dataset.gridRow;
      if (!element || id === undefined || (rootRef && !rootRef.current?.contains(element)) || !rowsById.has(id)) continue;
      return { row: rowsById.get(id)!, rowElement: element };
    }
    return null;
  };
  const getDropPosition = (event: Pick<DragEvent<HTMLElement>, "clientY">, rowElement: HTMLElement): "before" | "after" => {
    const rect = rowElement.getBoundingClientRect();
    return event.clientY > rect.top + rect.height / 2 ? "after" : "before";
  };
  const setDragPreview = (event: Pick<DragEvent, "dataTransfer" | "currentTarget">, label: string) => {
    cleanupDragPreview();
    if (typeof document === "undefined" || !event.dataTransfer || typeof event.dataTransfer.setDragImage !== "function") return;
    const pill = document.createElement("div");
    pill.className = styles.preview;
    pill.textContent = label;
    pill.setAttribute("aria-hidden", "true");
    pill.setAttribute("data-sgui-part", "grid-drag-preview");
    // Keep the ghost inside its owned scope so native drag imagery uses host tokens.
    const scope = event.currentTarget?.closest("[data-sgui-theme]") ?? document.body;
    scope.appendChild(pill);
    dragPreviewRef.current = pill;
    // Native cancellation and drops both end with dragend, including outside
    // the grid. Attach only while a preview exists; explicit cleanup remains safe.
    dragEndDocumentRef.current = pill.ownerDocument;
    pill.ownerDocument.addEventListener("dragend", cleanupDragPreview, true);
    try {
      event.dataTransfer.setDragImage(pill, 16, 18);
    } catch (error) {
      cleanupDragPreview();
      throw error;
    }
  };
  return { cleanupDragPreview, getDropPosition, resolveRowFromEvent, setDragPreview };
}
