import { expect, it, vi } from "vitest";
import { createDataGridColumns } from "./createDataGridColumns";
it("returns owned definitions with original-row accessors and no engine rendering", () => {
  const accessor = vi.fn((row: { title: string }) => row.title);
  const input = [{ field: "title", cellType: "text" as const, getCellValue: accessor, flex: 1 }];
  const columns = createDataGridColumns(input);
  expect(columns).toEqual(input); expect(columns[0]).not.toBe(input[0]);
  const row = { title: "Course" }; expect(columns[0]?.getCellValue?.(row)).toBe("Course");
  expect(accessor).toHaveBeenCalledWith(row); expect(columns[0]).not.toHaveProperty("renderCell");
});
it("rejects duplicate/reserved fields and invalid sizing", () => {
  for (const columns of [[{ field: "title" }, { field: "title" }], [{ field: "__selection" }], [{ field: "title", width: NaN }]]) {
    expect(() => createDataGridColumns(columns)).toThrow();
  }
});
