import { describe, expect, it } from "vitest";
import { baseGridSx } from "./baseGridSx";

describe("baseGridSx", () => {
  it("defines the grid baseline style rules", () => {
    const sx = baseGridSx as Record<string, unknown>;
    expect(sx.border).toBe(0);
    expect(sx["& .MuiDataGrid-main"]).toMatchObject({ borderRadius: 0 });
    expect(sx["& .MuiDataGrid-footerContainer"]).toMatchObject({ bgcolor: "action.hover" });
    expect(sx["& .app-grid-row-subheader"]).toMatchObject({ backgroundColor: "action.selected" });
    expect(sx["& .app-grid-sortable-header-open .app-grid-sort-trigger"]).toMatchObject({ opacity: 1 });
  });
});
