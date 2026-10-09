// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import {
  adminClassesColumnOptions, adminClassesFilterFields, adminClassesSortOptions,
  adminPeopleColumnOptions, adminPeopleSortOptions,
  createAdminCourseGridOptions, createAdminPeopleGridOptions,
  createInstructorCourseGridOptions, createInstructorCourseLearnersGridOptions,
  DataToolbar, instructorClassesColumnOptions, instructorClassesFilterFields,
  instructorClassesSortOptions, instructorClassLearnersColumnOptions,
  instructorClassLearnersFilterFields, instructorClassLearnersSortOptions,
} from "../index";
import { Provider } from "../theme";

describe("public catalog preset compatibility", () => {
  it("preserves admin Class and people English defaults through the root entry", () => {
    const course = createAdminCourseGridOptions();
    const people = createAdminPeopleGridOptions();
    expect(adminClassesColumnOptions).toEqual(course.columnOptions);
    expect(adminClassesSortOptions).toEqual(course.sortOptions);
    expect(adminClassesFilterFields).toEqual(course.filterFields);
    expect(adminPeopleColumnOptions).toEqual(people.columnOptions);
    expect(adminPeopleSortOptions).toEqual(people.sortOptions);
    const localized = createAdminCourseGridOptions((_key, { defaultMessage }) => `Host ${defaultMessage}`);
    localized.columnOptions[0].label = "Host edit";
    expect(adminClassesColumnOptions[0]).toMatchObject({ id: "className", label: "Section Name" });
    expect(createAdminCourseGridOptions()).toEqual(course);
  });

  it("preserves instructor Class and ClassLearners English defaults through the root entry", () => {
    const course = createInstructorCourseGridOptions();
    const learners = createInstructorCourseLearnersGridOptions();
    expect(instructorClassesColumnOptions).toEqual(course.columnOptions);
    expect(instructorClassesSortOptions).toEqual(course.sortOptions);
    expect(instructorClassesFilterFields).toEqual(course.filterFields);
    expect(instructorClassLearnersColumnOptions).toEqual(learners.columnOptions);
    expect(instructorClassLearnersSortOptions).toEqual(learners.sortOptions);
    expect(instructorClassLearnersFilterFields).toEqual(learners.filterFields);
    const localized = createInstructorCourseLearnersGridOptions((_key, { defaultMessage }) => `Host ${defaultMessage}`);
    localized.filterFields.find(field => field.id === "status")!.enumOptions![0].label = "Host edit";
    expect(instructorClassLearnersFilterFields.find(field => field.id === "status")!.enumOptions![0].label).toBe("Active");
    expect(instructorClassesColumnOptions[0]).toMatchObject({ id: "className", label: "Section Name" });
    expect(createInstructorCourseLearnersGridOptions()).toEqual(learners);
  });

  it.each([
    ["course", createInstructorCourseGridOptions, "Section Name"],
    ["learners", createInstructorCourseLearnersGridOptions, "Learner"],
  ] as const)("consumes instructor %s columns through host-owned toolbar state", async (_name, factory, firstLabel) => {
    function Harness() {
      const [columns, setColumns] = useState(() => factory().columnOptions);
      return <Provider><DataToolbar columnOptions={columns} onColumnOptionsChange={setColumns} showViewModeToggle={false} />
        <output aria-label="Host columns">{columns.filter(column => column.visible).map(column => column.id).join(",")}</output>
      </Provider>;
    }
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Columns" }));
    expect((screen.getByRole("checkbox", { name: firstLabel }) as HTMLInputElement).disabled).toBe(true);
    expect((screen.getByRole("checkbox", { name: "Action" }) as HTMLInputElement).disabled).toBe(true);
    await user.click(screen.getByRole("checkbox", { name: "Status" }));
    expect(screen.getByLabelText("Host columns").textContent).toBe(factory().columnOptions.filter(column => column.id !== "status").map(column => column.id).join(","));
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByLabelText("Host columns").textContent).toBe(factory().columnOptions.map(column => column.id).join(","));
  });
});
