// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataGrid } from "../../experimental/DataGrid/DataGrid";
import { OwnedGridInteraction } from "./ownedGridInteraction";
import { defaultGridState } from "../../experimental/DataGrid/types";
afterEach(cleanup);
for (const kind of ["DataGrid", "AppDataGrid"] as const) it(`${kind} pointer width alternative preserves sibling widths and rejecting host control`, async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const widths = { name: 180, score: 140 }; const rows = [{ id: "a", name: "Course", score: 20 }];
  const common = { label: "Courses", rows, getRowId: (row: typeof rows[number]) => row.id, getRowLabel: (row: typeof rows[number]) => row.name };
  render(kind === "DataGrid" ? <DataGrid {...common} state={{ ...defaultGridState, widths }} onStateChange={state => change(state.widths)}
    columns={[{ id: "name", label: "Name", width: 180, minWidth: 120, maxWidth: 300, getValue: row => row.name }, { id: "score", label: "Score", getValue: row => row.score }, { id: "flex", label: "Flexible", getValue: row => row.name }]} /> :
    <OwnedGridInteraction {...common} columnWidths={widths} onColumnWidthsChange={change} selection={false}
      columns={[{ field: "name", headerName: "Name", width: 180, minWidth: 120, maxWidth: 300 }, { field: "score", headerName: "Score" }, { field: "flex", headerName: "Flexible", flex: 1 }]} />);
  await user.click(screen.getByRole("button", { name: "Width of Name", exact: true }));
  await user.click(screen.getByRole("button", { name: "Wider by 1 pixel" }));
  expect(change).toHaveBeenCalledExactlyOnceWith({ name: 181, score: 140 });
  await user.click(screen.getByRole("button", { name: "Width of Name", exact: true }));
  expect((screen.getByRole("textbox", { name: "Width in CSS pixels" }) as HTMLInputElement).value).toBe("180");
  await user.keyboard("{Escape}"); expect(change).toHaveBeenCalledTimes(1);
});
