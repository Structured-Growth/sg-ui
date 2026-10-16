import { describe, expect, it } from "vitest";
import { changeOwnedGridHeaderSort, createOwnedGridActionMenuColumn, createOwnedGridColumns, measureOwnedGridWidths, retainOwnedGridFlexColumn, normalizeOwnedGridLayout } from "./ownedGridColumns";
describe("owned catalog column contracts", () => {
  it("preserves generic accessors and does not infer host keys", () => {
    const columns = createOwnedGridColumns<{ title: string }>([{ field: "course", getCellValue: row => row.title }]);
    expect(columns[0]!.getCellValue!({ title: "Course" })).toBe("Course");
    expect(columns.map(column => column.field)).toEqual(["course"]);
  });
  it("rejects duplicate, reserved and invalid sizing definitions", () => {
    for (const columns of [[{ field: "a" }, { field: "a" }], [{ field: "__selection" }], [{ field: " " }], [{ field: "a", width: Infinity }], [{ field: "a", flex: 0 }], [{ field: "a", minWidth: 200, maxWidth: 100 }]]) expect(() => createOwnedGridColumns(columns)).toThrow();
  });
  it.each(["__selection", "__reorder", "__drag", "__select__", "__drag__"])("rejects utility or legacy field %s in presentation columns", field => {
    expect(() => createOwnedGridColumns([{ field: "name" }, { field }]))
      .toThrow(`AppDataGrid column field is invalid or duplicated: ${field}`);
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


it("retains a fill column when resizing all columns in turn, including fixed definitions", () => {
  const columns=[{field:"course",flex:1,minWidth:180},{field:"status",width:100,minWidth:80}];
  expect(measureOwnedGridWidths(columns,800,{course:300})).toEqual({course:300,status:500});
  const widths=retainOwnedGridFlexColumn(columns,{course:300,status:120},"status");
  expect(widths).toEqual({status:120});
  expect(measureOwnedGridWidths(columns,800,widths)).toEqual({status:120,course:680});
  expect(measureOwnedGridWidths(columns,950,widths)).toEqual({status:120,course:830});
  const next=retainOwnedGridFlexColumn(columns,{...widths,course:250},"course");
  expect(next).toEqual({course:250});
  expect(measureOwnedGridWidths(columns,800,next)).toEqual({course:250,status:550});
  expect(measureOwnedGridWidths(columns,200,next)).toEqual({course:250,status:80});
  expect(measureOwnedGridWidths([{field:"a",width:100},{field:"b",width:100}],600)).toEqual({a:100,b:500});
});


it("keeps fixed and capped action columns while uncapped data absorbs remaining space", () => {
  const columns = [{field:"course",flex:1}, {field:"status",width:120,minWidth:120,maxWidth:120}, {field:"actions",cellType:"menu" as const,width:90,maxWidth:110}];
  expect(measureOwnedGridWidths(columns,800)).toEqual({status:120,actions:90,course:590});
  expect(measureOwnedGridWidths(columns,1000,{course:250})).toEqual({status:120,actions:90,course:790});
  expect(retainOwnedGridFlexColumn(columns,{course:250,status:120,actions:100},"actions")).toEqual({status:120,actions:100});
  expect(measureOwnedGridWidths([{field:"course",flex:1},{field:"status",flex:1,maxWidth:150}],800,{course:250})).toEqual({course:650,status:150});
  expect(measureOwnedGridWidths([{field:"fixed",width:100,minWidth:100,maxWidth:100}],800)).toEqual({fixed:100});
});
