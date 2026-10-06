import { describe, expect, it } from "vitest";
import { createActionMenuColumn } from "./createActionMenuColumn";

type Row = {
  id: string;
};

describe("createActionMenuColumn", () => {
  it("builds default action menu column settings", () => {
    const column = createActionMenuColumn<Row>({
      getMenuActions: (row) => [{ id: `details-${row.id}`, label: "Details" }],
    });

    expect(column.field).toBe("actions");
    expect(column.headerName).toBe("Action");
    expect(column.cellType).toBe("menu");
    expect(column.sortable).toBe(false);
    expect(column.filterable).toBe(false);
    expect(column.headerClassName).toBe("dg-last-col");
    expect(column.cellClassName).toBe("dg-last-col");
    expect(column.width).toBe(110);
    expect(column.pinned).toBe("right");
    expect(column.locked).toBe(true);
    expect(column.getMenuActions?.({ id: "r1" })).toEqual([{ id: "details-r1", label: "Details" }]);
  });

  it("supports overriding header and width options", () => {
    const column = createActionMenuColumn<Row>({
      headerName: "Actions",
      width: 160,
      minWidth: 120,
      maxWidth: 220,
      pinned: "left",
      locked: false,
      getMenuActions: () => [],
    });

    expect(column.headerName).toBe("Actions");
    expect(column.width).toBe(160);
    expect(column.minWidth).toBe(120);
    expect(column.maxWidth).toBe(220);
    expect(column.pinned).toBe("left");
    expect(column.locked).toBe(false);
  });
});
