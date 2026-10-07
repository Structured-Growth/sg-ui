// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, renderHook } from "@testing-library/react";
import type { DragEvent } from "react";
import { useDataGridRowDnd } from "./useDataGridRowDnd";
afterEach(() => { cleanup(); document.body.innerHTML = ""; vi.restoreAllMocks(); });
function grid() {
  const root = document.createElement("div");
  root.setAttribute("data-sgui-theme", "dark");
  const row = document.createElement("div"); row.dataset.sguiPart = "grid-row"; row.dataset.gridRow = "a";
  const child = document.createElement("button"); row.appendChild(child); root.appendChild(row); document.body.appendChild(root);
  return { root, row, child };
}
function event(target: EventTarget | null, extra = {}) {
  return { target, nativeEvent: { composedPath: () => [] }, ...extra } as unknown as DragEvent<HTMLElement>;
}
it("resolves owned row hooks and before/after positions while isolating grid instances", () => {
  const first = grid(); const second = grid(); const item = { id: "a", name: "History" };
  const { result } = renderHook(() => useDataGridRowDnd({ rowsById: new Map([["a", item]]), rootRef: { current: first.root } }));
  expect(result.current.resolveRowFromEvent(event(first.child))).toEqual({ row: item, rowElement: first.row });
  expect(result.current.resolveRowFromEvent(event(second.child))).toBeNull();
  vi.spyOn(first.row, "getBoundingClientRect").mockReturnValue({ top: 10, height: 20 } as DOMRect);
  expect(result.current.getDropPosition({ clientY: 11 }, first.row)).toBe("before");
  expect(result.current.getDropPosition({ clientY: 29 }, first.row)).toBe("after");
  first.row.dataset.gridRow = "unknown";
  expect(result.current.resolveRowFromEvent(event(first.child))).toBeNull();
  expect(result.current.resolveRowFromEvent(event(null))).toBeNull();
});
it("handles composed paths and native coordinate fallback", () => {
  const { row, child } = grid();
  const { result } = renderHook(() => useDataGridRowDnd({ rowsById: new Map([["a", "History"]]) }));
  expect(result.current.resolveRowFromEvent(event(null, { nativeEvent: { composedPath: () => ["ignore", child] } }))?.rowElement).toBe(row);
  Object.defineProperty(document, "elementFromPoint", { configurable: true, value: vi.fn(() => child) });
  expect(result.current.resolveRowFromEvent(event(null, { clientX: 1, clientY: 2 }))?.row).toBe("History");
  Object.defineProperty(document, "elementFromPoint", { configurable: true, value: undefined });
});
it("keeps previews in the owned theme scope and removes them on replacement and unmount", () => {
  const { root, child } = grid(); const setDragImage = vi.fn();
  const { result, unmount } = renderHook(() => useDataGridRowDnd({ rowsById: new Map() }));
  const drag = { currentTarget: child, dataTransfer: { setDragImage } } as unknown as DragEvent;
  result.current.setDragPreview(drag, "History");
  const preview = root.querySelector("[data-sgui-part='grid-drag-preview']");
  expect(preview?.textContent).toBe("History"); expect(setDragImage).toHaveBeenCalledWith(preview, 16, 18);
  result.current.setDragPreview(drag, "Science"); expect(preview?.isConnected).toBe(false);
  expect(root.querySelectorAll("[data-sgui-part='grid-drag-preview']")).toHaveLength(1);
  unmount(); expect(root.querySelector("[data-sgui-part='grid-drag-preview']")).toBeNull();
});
it("cleans existing preview when drag imagery is unavailable", () => {
  const { child } = grid();
  const { result } = renderHook(() => useDataGridRowDnd({ rowsById: new Map() }));
  result.current.setDragPreview({ currentTarget: child, dataTransfer: { setDragImage: vi.fn() } } as unknown as DragEvent, "History");
  result.current.setDragPreview({ currentTarget: child, dataTransfer: null }, "Ignored");
  expect(document.querySelector("[data-sgui-part='grid-drag-preview']")).toBeNull();
});
