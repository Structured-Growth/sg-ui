import { describe, expect, it, vi } from "vitest";

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useRef: <T,>(value: T) => ({ current: value }),
  };
});

describe("useDataGridRowDnd", () => {
  class FakeHTMLElement {
    className = "";
    dataset: Record<string, string> = {};
    parentElement: FakeHTMLElement | null = null;
    children: FakeHTMLElement[] = [];
    style: Record<string, string> = {};
    textContent = "";
    appendChild(child: FakeHTMLElement) {
      child.parentElement = this;
      this.children.push(child);
      return child;
    }
    closest(selector: string) {
      let current: FakeHTMLElement | null = this;
      while (current) {
        if (selector.includes(".MuiDataGrid-row") && current.className.includes("MuiDataGrid-row")) {
          return current;
        }
        current = current.parentElement;
      }
      return null;
    }
    getBoundingClientRect() {
      return { top: 10, height: 20, left: 0, right: 0, bottom: 30, width: 100, x: 0, y: 10, toJSON: () => ({}) } as DOMRect;
    }
    remove() {}
  }

  const elementFromPoint = vi.fn();

  vi.stubGlobal("HTMLElement", FakeHTMLElement as any);
  vi.stubGlobal("document", {
    body: {
      appendChild: vi.fn(),
    },
    createElement: vi.fn(() => new FakeHTMLElement()),
    elementFromPoint,
  });

  it("resolves row targets and calculates drop position", async () => {
    const { useDataGridRowDnd } = await import("./useDataGridRowDnd");
    const rowElement = (document as any).createElement("div");
    rowElement.className = "MuiDataGrid-row";
    rowElement.dataset.id = "row-1";

    const child = (document as any).createElement("span");
    rowElement.appendChild(child);

    const rowsById = new Map([["row-1", { id: "row-1", label: "Row 1" }]]);
    const dnd = useDataGridRowDnd({ rowsById });

    const resolved = dnd.resolveRowFromEvent({ target: child } as any);
    expect(resolved?.row).toMatchObject({ label: "Row 1" });
    expect(dnd.getDropPosition({ clientY: 29 } as any, rowElement)).toBe("after");
    expect(dnd.getDropPosition({ clientY: 11 } as any, rowElement)).toBe("before");
  });

  it("handles preview lifecycle and null/invalid event paths", async () => {
    const { useDataGridRowDnd } = await import("./useDataGridRowDnd");
    const rowsById = new Map([["row-1", { id: "row-1" }]]);
    const dnd = useDataGridRowDnd({ rowsById });

    expect(dnd.resolveRowFromEvent({ target: null } as any)).toBeNull();
    expect(dnd.resolveRowFromEvent({ target: (document as any).createElement("div") } as any)).toBeNull();
    const rowWithoutId = (document as any).createElement("div");
    rowWithoutId.className = "MuiDataGrid-row";
    expect(dnd.resolveRowFromEvent({ target: rowWithoutId } as any)).toBeNull();

    const unknownRow = (document as any).createElement("div");
    unknownRow.className = "MuiDataGrid-row";
    unknownRow.dataset.id = "missing-row";
    expect(dnd.resolveRowFromEvent({ target: unknownRow } as any)).toBeNull();

    const setDragImage = vi.fn();
    const event = {
      dataTransfer: { setDragImage },
    } as any;
    dnd.setDragPreview(event, "Module: Week 1");
    expect(setDragImage).toHaveBeenCalled();
    dnd.cleanupDragPreview();

    dnd.setDragPreview({ dataTransfer: null } as any, "no-op");
    dnd.cleanupDragPreview();
  });

  it("resolves row using composedPath and elementFromPoint fallbacks", async () => {
    const { useDataGridRowDnd } = await import("./useDataGridRowDnd");
    const rowElement = (document as any).createElement("div");
    rowElement.className = "MuiDataGrid-row";
    rowElement.dataset.id = "row-2";

    const nested = (document as any).createElement("span");
    rowElement.appendChild(nested);
    elementFromPoint.mockReturnValue(nested);

    const rowsById = new Map([["row-2", { id: "row-2", label: "Row 2" }]]);
    const dnd = useDataGridRowDnd({ rowsById });

    const fromPath = dnd.resolveRowFromEvent({
      target: null,
      nativeEvent: { composedPath: () => [nested] },
    } as any);
    if (!fromPath) {
      throw new Error("Expected composedPath fallback to resolve row target.");
    }
    expect((fromPath.row as any).id).toBe("row-2");

    const fromPoint = dnd.resolveRowFromEvent({
      target: null,
      nativeEvent: { composedPath: () => [] },
      clientX: 4,
      clientY: 8,
    } as any);
    if (!fromPoint) {
      throw new Error("Expected elementFromPoint fallback to resolve row target.");
    }
    expect((fromPoint.row as any).id).toBe("row-2");

    elementFromPoint.mockReturnValue(null);
    const unresolvedAfterPointMiss = dnd.resolveRowFromEvent({
      target: null,
      nativeEvent: { composedPath: () => [null, "not-an-element"] },
      clientX: 4,
      clientY: 8,
    } as any);
    expect(unresolvedAfterPointMiss).toBeNull();

    const unresolvedWithoutCoordinates = dnd.resolveRowFromEvent({
      target: null,
      nativeEvent: { composedPath: () => ["not-an-element"] },
    } as any);
    expect(unresolvedWithoutCoordinates).toBeNull();

    const originalElementFromPoint = (document as any).elementFromPoint;
    (document as any).elementFromPoint = undefined;
    const unresolvedWithoutElementFromPoint = dnd.resolveRowFromEvent({
      target: null,
      nativeEvent: { composedPath: () => ["not-an-element"] },
      clientX: 1,
      clientY: 2,
    } as any);
    expect(unresolvedWithoutElementFromPoint).toBeNull();
    (document as any).elementFromPoint = originalElementFromPoint;

    elementFromPoint.mockReturnValue(null);
    const resolvesAfterSkippingNonHTMLElementPathItem = dnd.resolveRowFromEvent({
      target: null,
      nativeEvent: { composedPath: () => ["not-an-element", nested] },
      clientX: 3,
      clientY: 4,
    } as any);
    expect((resolvesAfterSkippingNonHTMLElementPathItem?.row as any).id).toBe("row-2");
  });
});
