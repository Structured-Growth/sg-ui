import { describe, expect, it } from "vitest";
import { buildDataToolbarColumnOptions } from "./buildColumnOptions";

describe("buildDataToolbarColumnOptions", () => {
  it("keeps explicit options only and forces actions to be locked/visible/last", () => {
    const options = buildDataToolbarColumnOptions({
      baseOptions: [
        { id: "name", label: "Name", locked: true },
        { id: "actions", label: "Actions" },
        { id: "status", label: "Status" },
      ],
      columnVisibilityModel: { status: false },
      rows: [
        { name: "A", createdAt: "2026-01-01", section_id: "s1" },
      ],
    });

    expect(options.find((option) => option.id === "name")).toMatchObject({
      label: "Name",
      locked: true,
      visible: true,
    });
    expect(options.find((option) => option.id === "status")?.visible).toBe(false);
    expect(options.find((option) => option.id === "createdAt")).toBeUndefined();
    expect(options[options.length - 1]).toMatchObject({
      id: "actions",
      locked: true,
      visible: true,
    });
  });

  it("falls back to generated label when an explicit option label is missing at runtime", () => {
    const options = buildDataToolbarColumnOptions({
      baseOptions: [{ id: "archived_at", label: undefined } as any],
      columnVisibilityModel: {},
      rows: [],
    });
    expect(options[0]).toMatchObject({
      id: "archived_at",
      label: "Archived at",
      visible: true,
    });
  });

  it("can append inferred fields when explicitly enabled", () => {
    const options = buildDataToolbarColumnOptions({
      baseOptions: [{ id: "name", label: "Name" }],
      columnVisibilityModel: {},
      rows: [{ name: "A", createdAt: "2026-01-01", section_id: "s1" }],
      includeInferredFields: true,
    });

    expect(options.find((option) => option.id === "createdAt")?.label).toBe("Created At");
    expect(options.find((option) => option.id === "section_id")?.label).toBe("Section id");
  });
});
