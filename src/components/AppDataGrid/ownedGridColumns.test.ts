import { describe, expect, it } from "vitest";
import { changeOwnedGridHeaderSort, createOwnedGridActionMenuColumn, createOwnedGridColumns, measureOwnedGridWidths, normalizeOwnedGridLayout } from "./ownedGridColumns";
describe("owned catalog column contracts", () => {
  it("preserves generic accessors and does not infer host keys", () => {
    const columns = createOwnedGridColumns<{ title: string }>([{ field: "course", getCellValue: row => row.title }]);
    expect(columns[0]!.getCellValue!({ title: "Course" })).toBe("Course");
    expect(columns.map(column => column.field)).toEqual(["course"]);
  });
  it("rejects duplicate, reserved and invalid sizing definitions", () => {
    for (const columns of [[{ field: "a" }, { field: "a" }], [{ field: "__selection" }], [{ field: " " }], [{ field: "a", width: Infinity }], [{ field: "a", flex: 0 }], [{ field: "a", minWidth: 200, maxWidth: 100 }]]) expect(() => createOwnedGridColumns(columns)).toThrow();
  });
  it("locks first text and action columns, drops stale fields, and places actions last", () => {
    const columns = [{ field: "score", cellType: "custom" as const }, { field: "name", cellType: "text" as const }, { field: "status" }, createOwnedGridActionMenuColumn({ getMenuActions: () => [] })];
    const result = normalizeOwnedGridLayout(columns, { visibility: { name: false, actions: false, status: false, stale: true }, order: ["actions", "status", "status", "stale"], widths: { score: 20, stale: 100, name: NaN } });
    expect(result).toEqual({ visibility: { score: true, name: true, status: false, actions: true }, order: ["status", "score", "name", "actions"], widths: { score: 80 }, lockedFields: ["name", "actions"] });
    expect(columns[3]).toMatchObject({ sortable: false, filterable: false, locked: true });
    expect(columns[3]).not.toHaveProperty("pinned");
  });
  it("shares ordered rules with header actions without mutating host input", () => {
    const rules = [{ field: "name", direction: "asc" as const }, { field: "score", direction: "desc" as const }];
    expect(changeOwnedGridHeaderSort(rules, "score", "asc")).toEqual([{ field: "score", direction: "asc" }, rules[0]]);
    expect(changeOwnedGridHeaderSort(rules, "name")).toEqual([rules[1]]);
    expect(rules[1]!.direction).toBe("desc");
  });
  it("allocates flex weights, clamps bounds and gives committed widths precedence", () => {
    const columns = [{ field: "fixed", width: 100 }, { field: "a", flex: 1, minWidth: 80, maxWidth: 120 }, { field: "b", flex: 2, minWidth: 80 }];
    expect(measureOwnedGridWidths(columns, 700)).toEqual({ fixed: 100, a: 120, b: 480 });
    expect(measureOwnedGridWidths(columns, 700, { a: 110 })).toEqual({ fixed: 100, a: 110, b: 490 });
    expect(measureOwnedGridWidths(columns, 100)).toEqual({ fixed: 100, a: 80, b: 80 });
    expect(measureOwnedGridWidths([{ field: "a", flex: 1, minWidth: 200 }, { field: "b", flex: 1, minWidth: 20, maxWidth: 50 }], 300)).toEqual({ a: 250, b: 50 });
    expect(measureOwnedGridWidths([{ field: "a", flex: 1 }, { field: "b", flex: 2 }], 600)).toEqual({ a: 200, b: 400 });
  });
});
