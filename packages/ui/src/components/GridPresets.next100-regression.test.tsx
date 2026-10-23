// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { createAdminCourseGridOptions, createAdminPeopleGridOptions } from "./AdminDataGridOptions";
import { createInstructorCourseGridOptions, createInstructorCourseLearnersGridOptions } from "./InstructorDataGridOptions";
import { DataToolbar } from "./DataToolbar";
import { Provider } from "../theme";

afterEach(cleanup);

describe("public catalog preset factories", () => {
  it.each([createAdminCourseGridOptions, createAdminPeopleGridOptions, createInstructorCourseGridOptions, createInstructorCourseLearnersGridOptions])("returns independent translated defaults", factory => {
    const original = factory();
    const localized = factory((_key, { defaultMessage }) => `Host ${defaultMessage}`);
    localized.columnOptions[0].label = "Host edit";
    expect(factory()).toEqual(original);
    expect(factory().columnOptions).not.toBe(original.columnOptions);
    expect(original.columnOptions[0].locked).toBe(true);
    expect(original.columnOptions.at(-1)?.locked).toBe(true);
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
