import { expect, it } from "vitest";
import { createActionMenuColumn } from "./createActionMenuColumn";
import { measureOwnedGridWidths, normalizeOwnedGridLayout } from "./ownedGridColumns";
it("builds a locked owned action column placed last without retired metadata", () => {
  const column = createActionMenuColumn<{ id: string }>({ getMenuActions: row => [{ id: row.id, label: "Details" }] });
  expect(column).toMatchObject({ field: "actions", headerName: "Action", width: 110, minWidth: 110, maxWidth: 110, cellType: "menu", sortable: false, filterable: false, locked: true });
  expect(column).not.toHaveProperty("pinned"); expect(column).not.toHaveProperty("headerClassName");
  const layout = normalizeOwnedGridLayout([column, { field: "name" }], { order: ["actions", "name"], visibility: { actions: false } });
  expect(layout.order).toEqual(["name", "actions"]); expect(layout.visibility.actions).toBe(true);
  expect(column.getMenuActions?.({ id: "row" })).toEqual([{ id: "row", label: "Details" }]);
});
it("validates host width bounds", () => {
  expect(createActionMenuColumn({ headerName: "Actions", width: 160, minWidth: 120, maxWidth: 220, getMenuActions: () => [] })).toMatchObject({ headerName: "Actions", width: 160, minWidth: 160, maxWidth: 160 });
  expect(() => createActionMenuColumn({ minWidth: 200, maxWidth: 100, getMenuActions: () => [] })).toThrow();
});

it("keeps action widths fixed across container sizes and saved width overrides", () => {
  const column=createActionMenuColumn({width:96,getMenuActions:()=>[]});
  const columns=[{field:"name",flex:1},column];
  for(const width of [400,1200])expect(measureOwnedGridWidths(columns,width,{actions:240}).actions).toBe(96);
  expect(normalizeOwnedGridLayout(columns,{widths:{actions:240}}).widths.actions).toBe(96);
});
