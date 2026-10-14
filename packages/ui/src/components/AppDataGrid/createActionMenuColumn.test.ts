import { expect, it } from "vitest";
import { createActionMenuColumn } from "./createActionMenuColumn";
import { normalizeOwnedGridLayout } from "./ownedGridColumns";
it("builds a locked owned action column placed last without retired metadata", () => {
  const column = createActionMenuColumn<{ id: string }>({ getMenuActions: row => [{ id: row.id, label: "Details" }] });
  expect(column).toMatchObject({ field: "actions", headerName: "Action", width: 110, cellType: "menu", sortable: false, filterable: false, locked: true });
  expect(column).not.toHaveProperty("pinned"); expect(column).not.toHaveProperty("headerClassName");
  const layout = normalizeOwnedGridLayout([column, { field: "name" }], { order: ["actions", "name"], visibility: { actions: false } });
  expect(layout.order).toEqual(["name", "actions"]); expect(layout.visibility.actions).toBe(true);
  expect(column.getMenuActions?.({ id: "row" })).toEqual([{ id: "row", label: "Details" }]);
});
it("validates host width bounds", () => {
  expect(createActionMenuColumn({ headerName: "Actions", width: 160, minWidth: 120, maxWidth: 220, getMenuActions: () => [] })).toMatchObject({ headerName: "Actions", width: 160, minWidth: 120, maxWidth: 220 });
  expect(() => createActionMenuColumn({ minWidth: 200, maxWidth: 100, getMenuActions: () => [] })).toThrow();
});
