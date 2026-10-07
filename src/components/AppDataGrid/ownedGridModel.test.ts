import { describe, expect, it } from "vitest";
import { compareOwnedGridValues, normalizeGridFilterRules, normalizeGridPageSizeOptions, normalizeGridPagination, normalizeGridSortRules, processOwnedGridRows, type OwnedGridColumn } from "./ownedGridModel";
import type { DataToolbarFilterOperator } from "../DataToolbar/components/DataToolbarFilterMenu";

type Item = { id: string | number; name: string | null; score: unknown; date: unknown; status: string | null; group?: string };
const columns: OwnedGridColumn<Item>[] = [
  { field: "name" }, { field: "score", filterType: "number" }, { field: "date", filterType: "date" }, { field: "status", filterType: "enum" }, { field: "group" },
];
const rows: Item[] = [
  { id: "a", name: "Alpha", score: 2, date: "2024-02-29", status: "active", group: "x" },
  { id: "b", name: "beta", score: 10, date: "2024-03-01T20:30:00+14:00", status: "paused", group: "x" },
  { id: "c", name: null, score: null, date: "2024-02-30", status: null, group: "y" },
  { id: "d", name: "ALPHA", score: "2", date: "2024-02-28", status: "archived", group: "x" },
];
const process = (patch: Partial<Parameters<typeof processOwnedGridRows<Item>>[0]> = {}) => processOwnedGridRows({ rows, columns, paginationModel: { page: 0, pageSize: 25 }, ...patch });

describe("owned catalog row processing", () => {
  it.each<[string, DataToolbarFilterOperator, string, string[]]>([
    ["name", "contains", "ALP", ["a", "d"]], ["name", "equals", "alpha", ["a", "d"]],
    ["name", "starts_with", "be", ["b"]], ["name", "ends_with", "TA", ["b"]],
    ["name", "is_empty", "ignored", ["c"]], ["name", "is_not_empty", "", ["a", "b", "d"]],
    ["score", "eq", "2", ["a", "d"]], ["score", "neq", "2", ["b"]], ["score", "gt", "2", ["b"]],
    ["score", "gte", "2", ["a", "b", "d"]], ["score", "lt", "10", ["a", "d"]], ["score", "lte", "2", ["a", "d"]],
    ["date", "on", "2024-02-29", ["a"]], ["date", "before", "2024-02-29", ["d"]], ["date", "after", "2024-02-29", ["b"]],
    ["date", "on_or_before", "2024-02-29", ["a", "d"]], ["date", "on_or_after", "2024-02-29", ["a", "b"]],
    ["status", "is", "active|||paused", ["a", "b"]], ["status", "is_not", "active|||paused", ["c", "d"]],
  ])("applies %s %s with %s", (field, operator, value, expected) => {
    expect(process({ filterRules: [{ field, operator, value }] }).rowIds).toEqual(expected);
  });
  it("runs search and every filter before ordered stable sorting and paging", () => {
    const result = process({ searchValue: "X", filterRules: [{ field: "score", operator: "gte", value: "2" }],
      sortRules: [{ field: "group", direction: "asc" }, { field: "score", direction: "desc" }], paginationModel: { page: 1, pageSize: 1 } });
    expect(result.rowIds).toEqual(["a"]);
    expect(result.processedRows.map(row => row.id)).toEqual(["b", "a", "d"]);
    expect(result.rowCount).toBe(3); expect(result.canNextPage).toBe(true);
    expect(rows.map(row => row.id)).toEqual(["a", "b", "c", "d"]);
    expect(result.rows[0]).toBe(rows[0]);
  });
  it("ignores incomplete, missing-field and incompatible operator rules; All has no rule", () => {
    expect(process({ filterRules: [
      { field: "missing", operator: "contains", value: "none" }, { field: "name", operator: "gt", value: "5" },
      { field: "name", operator: "contains", value: " " }, { field: "status", operator: "is", value: "|||" },
    ] }).rowIds).toEqual(["a", "b", "c", "d"]);
  });
  it("uses declared filter field types and accessors rather than formatted field values", () => {
    expect(process({ columns: [{ field: "score", getCellValue: row => Number(row.score) * 2 }],
      filterFields: [{ id: "score", label: "Score", type: "number" }], filterRules: [{ field: "score", operator: "gt", value: "4" }] }).rowIds).toEqual(["b"]);
  });
  it("does not match null, boolean, blank or nonfinite values as numbers", () => {
    const input = [null, undefined, "", " ", true, false, NaN, Infinity, "bad", 0].map((score, id) => ({ ...rows[0]!, id, score }));
    expect(process({ rows: input, filterRules: [{ field: "score", operator: "eq", value: "0" }] }).rowIds).toEqual(["9"]);
    expect(normalizeGridFilterRules([{ field: "score", operator: "neq", value: "bad" }], columns)).toEqual([]);
  });
  it("rejects invalid calendar operands and uses UTC for instants", () => {
    const instant = new Date("2024-03-01T00:30:00+14:00");
    expect(process({ rows: [{ ...rows[0]!, date: instant }], filterRules: [{ field: "date", operator: "on", value: "2024-02-29" }] }).rowIds).toEqual(["a"]);
    expect(normalizeGridFilterRules([{ field: "date", operator: "on", value: "2024-02-30" }], columns)).toEqual([]);
    for (const date of ["2024-02-30T12:00:00Z", "2024-02-29T25:00:00Z", "2024-02-29T12:00:00", "2024-02-29Tgarbage"])
      expect(process({ rows: [{ ...rows[0]!, date }], filterRules: [{ field: "date", operator: "on", value: "2024-02-29" }] }).rows).toEqual([]);
  });
  it("handles cyclic search values without throwing and excludes nonfilterable columns", () => {
    const value: { self?: unknown } = {}; value.self = value;
    expect(process({ columns: [{ field: "score" }], rows: [{ ...rows[0]!, score: value }], searchValue: "object" }).rowIds).toEqual(["a"]);
    expect(process({ columns: [{ field: "name", filterable: false }], searchValue: "alpha" }).rows).toEqual([]);
  });
  it("renders server input in host order without criteria or a second page slice", () => {
    const result = process({ mode: "server", searchValue: "none", filterRules: [{ field: "score", operator: "gt", value: "99" }],
      sortRules: [{ field: "name", direction: "desc" }], paginationModel: { page: 3, pageSize: 1 }, hasNextPage: true });
    expect(result.rows).toEqual(rows); expect(result.rowCount).toBeUndefined(); expect(result.canNextPage).toBe(true);
    expect(process({ mode: "server", rowCount: 4, hasNextPage: true, paginationModel: { page: 3, pageSize: 1 } }).canNextPage).toBe(false);
    expect(process({ mode: "server", rowCount: -1 }).rowCount).toBeUndefined();
  });
  it("uses the one supplied identity function and normalizes default numeric IDs", () => {
    expect(process({ getRowId: row => `custom:${row.id}` }).rowIds).toEqual(["custom:a", "custom:b", "custom:c", "custom:d"]);
    expect(process({ rows: [{ ...rows[0]!, id: 7 }] }).rowIds).toEqual(["7"]);
    expect(() => process({ rows: [rows[0]!, rows[0]!] })).toThrow("duplicated");
    expect(() => process({ getRowId: () => " " })).toThrow("stable nonempty");
    expect(() => processOwnedGridRows({ rows: [{}], columns: [], paginationModel: { page: 0, pageSize: 1 } })).toThrow("stable nonempty");
  });
  it("rejects duplicate, empty and reserved fields before invoking the engine", () => {
    for (const fields of [["name", "name"], [" "], ["__selection"], ["__select__"], ["__drag"], ["__drag__"]])
      expect(() => process({ columns: fields.map(field => ({ field })) })).toThrow("column field");
  });
  it("allows any positive safe page size and rejects malformed page requests", () => {
    expect(process({ paginationModel: { page: 0, pageSize: 150 } }).rows).toEqual(rows);
    for (const paginationModel of [{ page: -1, pageSize: 10 }, { page: 0.5, pageSize: 10 }, { page: 0, pageSize: 0 }, { page: 0, pageSize: Infinity }])
      expect(() => process({ paginationModel })).toThrow("pagination");
  });
  it("normalizes size options in host order without the retired community limit", () => {
    expect(normalizeGridPageSizeOptions([10, { value: 150, label: "Large" }, 10, 0, -1, 1.5, Infinity])).toEqual([{ value: 10, label: "10" }, { value: 150, label: "Large" }]);
    expect(normalizeGridPagination({ page: 5, pageSize: 50 }, [10, 150])).toEqual({ page: 0, pageSize: 10 });
    expect(normalizeGridPagination({ page: 5, pageSize: 150 }, [10, 150])).toEqual({ page: 5, pageSize: 150 });
    expect(normalizeGridPageSizeOptions([0]).map(option => option.value)).toEqual([25, 50, 100]);
  });
  it("drops unavailable and duplicate sort rules while retaining declared priority", () => {
    expect(normalizeGridSortRules([{ field: "score", direction: "desc" }, { field: "score", direction: "asc" }, { field: "name", direction: "asc" }, { field: "missing", direction: "asc" }],
      [{ field: "score" }, { field: "name", sortable: false }])).toEqual([{ field: "score", direction: "desc" }]);
  });
  it("defines null and invalid sorting, natural text order and stable equality", () => {
    expect(compareOwnedGridValues(NaN, null)).toBe(0); expect(compareOwnedGridValues(new Date("bad"), 1)).toBe(-1);
    expect(compareOwnedGridValues("item 2", "item 10")).toBeLessThan(0); expect(compareOwnedGridValues("ALPHA", "alpha")).toBe(0);
    expect(process({ sortRules: [{ field: "name", direction: "asc" }] }).rowIds).toEqual(["c", "a", "d", "b"]);
  });
  it("sorts numeric strings and valid date instants by declared value type", () => {
    const input = ["10", "-2", "-10", null, "bad"].map((score, id) => ({ ...rows[0]!, id, score }));
    expect(process({ rows: input, sortRules: [{ field: "score", direction: "asc" }] }).rowIds).toEqual(["3", "4", "2", "1", "0"]);
    expect(process({ sortRules: [{ field: "date", direction: "asc" }] }).rowIds).toEqual(["c", "d", "a", "b"]);
    expect(compareOwnedGridValues("2024-03-01T00:30:00+14:00", "2024-02-29T20:00:00Z", "date")).toBeLessThan(0);
  });
  it("normalizes filters for shared client and server transactions", () => {
    expect(normalizeGridFilterRules([{ field: "name", operator: "is_empty", value: "discard" }, { field: "status", operator: "is", value: "" },
      { field: "date", operator: "on", value: "2024-02-30" }, { field: "name", operator: "eq", value: "2" }], columns)).toEqual([{ field: "name", operator: "is_empty", value: "" }]);
  });
});
