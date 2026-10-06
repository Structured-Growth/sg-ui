import { type DragEvent, useRef } from "react";

type UseDataGridRowDndOptions<RowModel> = {
  rowsById: Map<string, RowModel>;
  rowSelector?: string;
};

type ResolvedGridRow<RowModel> = {
  row: RowModel;
  rowElement: HTMLElement;
};

const DEFAULT_ROW_SELECTOR = ".MuiDataGrid-row[data-id]";

const setDragPillPreview = (event: DragEvent, label: string): HTMLDivElement | null => {
  if (!event.dataTransfer) {
    return null;
  }

  const pill = document.createElement("div");
  pill.textContent = label;
  pill.style.position = "absolute";
  pill.style.top = "-9999px";
  pill.style.left = "-9999px";
  pill.style.padding = "10px 18px";
  pill.style.borderRadius = "9999px";
  pill.style.background = "rgba(17,24,39,0.95)";
  pill.style.color = "#ffffff";
  pill.style.fontSize = "14px";
  pill.style.fontWeight = "600";
  pill.style.whiteSpace = "nowrap";
  pill.style.maxWidth = "520px";
  pill.style.overflow = "hidden";
  pill.style.textOverflow = "ellipsis";
  pill.style.boxShadow = "0 8px 20px rgba(15, 23, 42, 0.35)";
  pill.style.pointerEvents = "none";
  pill.style.zIndex = "2147483647";
  document.body.appendChild(pill);

  event.dataTransfer.setDragImage(pill, 16, 18);
  return pill;
};

export function useDataGridRowDnd<RowModel>({
  rowSelector = DEFAULT_ROW_SELECTOR,
  rowsById,
}: UseDataGridRowDndOptions<RowModel>) {
  const dragPreviewRef = useRef<HTMLDivElement | null>(null);

  const resolveFromElement = (element: HTMLElement): ResolvedGridRow<RowModel> | null => {
    const rowElement = element.closest<HTMLElement>(rowSelector);
    const rowId = rowElement?.dataset.id;
    if (!rowElement || !rowId) {
      return null;
    }

    const row = rowsById.get(rowId);
    if (!row) {
      return null;
    }

    return { row, rowElement };
  };

  const resolveRowFromEvent = (event: DragEvent<HTMLElement>): ResolvedGridRow<RowModel> | null => {
    const candidateElements: HTMLElement[] = [];
    const target = event.target;
    if (target instanceof HTMLElement) {
      candidateElements.push(target);
    }

    const path = typeof event.nativeEvent?.composedPath === "function" ? event.nativeEvent.composedPath() : [];
    for (const item of path) {
      if (item instanceof HTMLElement) {
        candidateElements.push(item);
      }
    }

    if (typeof event.clientX === "number" && typeof event.clientY === "number" && typeof document.elementFromPoint === "function") {
      const hoveredElement = document.elementFromPoint(event.clientX, event.clientY);
      if (hoveredElement instanceof HTMLElement) {
        candidateElements.push(hoveredElement);
      }
    }

    for (const candidate of candidateElements) {
      const resolved = resolveFromElement(candidate);
      if (resolved) {
        return resolved;
      }
    }

    return null;
  };

  const getDropPosition = (event: DragEvent<HTMLElement>, rowElement: HTMLElement): "before" | "after" => {
    const rect = rowElement.getBoundingClientRect();
    return event.clientY > rect.top + rect.height / 2 ? "after" : "before";
  };

  const cleanupDragPreview = () => {
    if (!dragPreviewRef.current) {
      return;
    }

    dragPreviewRef.current.remove();
    dragPreviewRef.current = null;
  };

  const setDragPreview = (event: DragEvent, label: string) => {
    cleanupDragPreview();
    dragPreviewRef.current = setDragPillPreview(event, label);
  };

  return {
    cleanupDragPreview,
    getDropPosition,
    resolveRowFromEvent,
    setDragPreview,
  };
}
