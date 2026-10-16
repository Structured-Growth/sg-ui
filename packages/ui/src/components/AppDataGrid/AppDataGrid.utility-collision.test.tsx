import { expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { AppDataGrid } from "./AppDataGrid";

it("rejects the reorder utility field in a public rowDrag composition before collection construction", () => {
  const onReorder = vi.fn();
  const getCellValue = vi.fn(() => "Host reorder content");
  expect(() => renderToString(<AppDataGrid label="Courses" rows={[{ id: "a", name: "Science" }]}
    columns={[{ field: "name", headerName: "Course" }, { field: "__reorder", getCellValue }]}
    getRowLabel={row => row.name} rowDrag={{ onReorder }} />))
    .toThrow("AppDataGrid column field is invalid or duplicated: __reorder");
  expect(getCellValue).not.toHaveBeenCalled();
  expect(onReorder).not.toHaveBeenCalled();
});
