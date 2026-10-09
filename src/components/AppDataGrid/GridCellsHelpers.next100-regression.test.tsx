import { expect, it } from "vitest";
import { createActionMenuColumn, createDataGridColumns, type AppDataGridColumn } from "./index";
import { buildDataToolbarColumnOptions } from "../DataToolbar";

// T-S13-91: public pure builders must not share mutable results across callers.
it("repeats public helper calls deterministically after another consumer edits its results", () => {
  type Row = { title: string };
  const getCellValue = (row: Row) => row.title;
  const getMenuActions = (row: Row) => [{ id: row.title, label: row.title }];
  const definitions: readonly AppDataGridColumn<Row>[] = Object.freeze([
    Object.freeze({ field: "title", headerName: "Course", getCellValue }),
  ]);
  const actionOptions = Object.freeze({ headerName: "Course actions", getMenuActions });
  const toolbarOptions = Object.freeze({
    baseOptions: Object.freeze([
      Object.freeze({ id: "actions", label: "Actions" }),
      Object.freeze({ id: "title", label: "Course", locked: true }),
    ]),
    columnVisibilityModel: Object.freeze({ title: false, actions: false }),
    rows: Object.freeze([{ title: "First" }]),
  });
  const columns = createDataGridColumns(definitions);
  const actions = createActionMenuColumn(actionOptions);
  const toolbar = buildDataToolbarColumnOptions(toolbarOptions);
  const expectedColumns = createDataGridColumns(definitions);
  const expectedActions = createActionMenuColumn(actionOptions);
  const expectedToolbar = buildDataToolbarColumnOptions(toolbarOptions);

  columns[0]!.headerName = "Consumer override";
  columns.push({ field: "extra" });
  actions.headerName = "Other actions";
  toolbar[0]!.label = "Other course";
  toolbar.reverse();
  createDataGridColumns([{ field: "unrelated" }]);
  createActionMenuColumn({ getMenuActions: () => [] });
  buildDataToolbarColumnOptions({ baseOptions: [], columnVisibilityModel: {}, rows: [] });

  expect(createDataGridColumns(definitions)).toEqual(expectedColumns);
  expect(createActionMenuColumn(actionOptions)).toEqual(expectedActions);
  expect(buildDataToolbarColumnOptions(toolbarOptions)).toEqual(expectedToolbar);
  const row = { title: "Second" };
  expect(expectedColumns[0]!.getCellValue!(row)).toBe("Second");
  expect(expectedActions.getMenuActions!(row)).toEqual([{ id: "Second", label: "Second" }]);
  expect(expectedToolbar.map(option => option.id)).toEqual(["title", "actions"]);
  expect(definitions[0]!.headerName).toBe("Course");
  expect(actionOptions.headerName).toBe("Course actions");
  expect(toolbarOptions.baseOptions.map(option => option.id)).toEqual(["actions", "title"]);
});
