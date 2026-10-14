// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Provider } from "../experimental/Provider/Provider";
import { DataToolbar } from "./DataToolbar";
import { adminCourseStatuses, createAdminCourseGridOptions, createAdminPeopleGridOptions } from "./AdminDataGridOptions";
import { instructorCourseStatuses, instructorCourseLearnerStatuses, createInstructorCourseGridOptions, createInstructorCourseLearnersGridOptions } from "./InstructorDataGridOptions";

const factories = [createAdminCourseGridOptions, createAdminPeopleGridOptions, createInstructorCourseGridOptions, createInstructorCourseLearnersGridOptions];

describe("owned catalog grid presets", () => {
  it.each(factories)("provides fresh visible columns and neutral filter/sort defaults for %s", factory => {
    const first = factory();
    const second = factory();
    expect(first.columnOptions.every(option => option.visible)).toBe(true);
    expect(first.columnOptions.filter(option => option.locked).map(option => option.id)).toEqual([first.columnOptions[0].id, "actions"]);
    expect(first.columnOptions.at(-1)?.id).toBe("actions");
    expect(first.sortOptions.some(option => option.id === "actions")).toBe(false);
    expect(first.defaultFilterRules).toEqual([]);
    expect(first.defaultSortRules).toEqual([]);
    first.columnOptions[0].label = "Changed";
    first.defaultSortRules.push({ field: first.columnOptions[0].id, direction: "desc" });
    first.defaultFilterRules.push({ field: "status", operator: "is", value: "active" });
    const enumOptions = first.filterFields.find(field => field.id === "status")?.enumOptions;
    if (enumOptions) enumOptions[0].label = "Changed status";
    expect(second).toEqual(factory());
  });

  it.each(factories)("translates all column/sort/filter/enum labels with fallback and namespace for %s", factory => {
    const t = vi.fn((key: string, options: { defaultMessage: string }) => `Translated ${options.defaultMessage}`);
    const localized = factory(t);
    expect(t.mock.calls.every(([key, options]) => key.startsWith("common.ui.grid.") && options.defaultMessage.length > 0 && "namespace" in options && options.namespace === "common.ui")).toBe(true);
    expect(localized.columnOptions.every(option => option.label.startsWith("Translated "))).toBe(true);
    expect(localized.sortOptions.every(option => option.label.startsWith("Translated "))).toBe(true);
    expect(localized.filterFields.every(field => field.label.startsWith("Translated ") && (!field.enumOptions || field.enumOptions.every(option => option.label.startsWith("Translated "))))).toBe(true);
  });

  it("uses immutable canonical static statuses without a fabricated All/empty enum value", () => {
    const pairs = [
      [createAdminCourseGridOptions(), adminCourseStatuses],
      [createInstructorCourseGridOptions(), instructorCourseStatuses],
      [createInstructorCourseLearnersGridOptions(), instructorCourseLearnerStatuses],
    ] as const;
    for (const [preset, statuses] of pairs) {
      expect(preset.filterFields.find(field => field.id === "status")?.enumOptions?.map(option => option.id)).toEqual(statuses.map(status => status.id));
      expect(statuses.every(status => status.id.length > 0 && Object.isFrozen(status))).toBe(true);
      expect(Object.isFrozen(statuses)).toBe(true);
    }
    expect(createAdminPeopleGridOptions().sortOptions.map(option => option.id)).toEqual(["name"]);
  });

  it("locks the first text and action columns while letting hosts hide and reset another column", async () => {
    function Harness() {
      const [preset] = useState(createAdminCourseGridOptions);
      const [columns, setColumns] = useState(preset.columnOptions);
      return <Provider><DataToolbar columnOptions={columns} onColumnOptionsChange={setColumns} showViewModeToggle={false} />
        <output aria-label="Visible columns">{columns.filter(column => column.visible).map(column => column.id).join(",")}</output></Provider>;
    }
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Columns" }));
    expect((screen.getByRole("checkbox", { name: "Section Name" }) as HTMLInputElement).disabled).toBe(true);
    expect((screen.getByRole("checkbox", { name: "Action" }) as HTMLInputElement).disabled).toBe(true);
    await user.click(screen.getByRole("checkbox", { name: "Site" }));
    expect(screen.getByLabelText("Visible columns").textContent).toBe("className,learnerCount,leadInstructor,status,actions");
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByLabelText("Visible columns").textContent).toBe("className,siteName,learnerCount,leadInstructor,status,actions");
  });
});
