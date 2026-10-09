// @vitest-environment jsdom
import { useState } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataGrid } from "./DataGrid";
import { defaultGridState, type DataGridProps, type GridState } from "./types";
import { ThemeScope } from "../../foundation/ThemeScope";

afterEach(cleanup);

it("accepts complete controlled host snapshots and starts a fresh state on remount", async () => {
  const user = userEvent.setup();
  type Course = { key: string; title: string; score: number };
  const props: DataGridProps<Course> = {
    label: "Host courses",
    rows: [
      { key: "a", title: "Alpha", score: 30 },
      { key: "b", title: "Beta", score: 20 },
      { key: "c", title: "Gamma", score: 10 },
      { key: "d", title: "Delta", score: 0 },
    ],
    columns: [
      { id: "title", label: "Title", getValue: row => row.title },
      { id: "score", label: "Score", getValue: row => row.score },
    ],
    getRowId: row => row.key,
    getRowLabel: row => row.title,
  };
  const requested = vi.fn<(state: GridState) => void>();
  function Host() {
    const [state, setState] = useState<GridState>({
      ...defaultGridState, pageSize: 2, page: 1,
      filters: [{ column: "score", operator: "gte", value: "10" }],
    });
    return <ThemeScope>
      <button onClick={() => setState(previous => ({ ...previous, page: 0, filters: [{ column: "score", operator: "lte", value: "20" }] }))}>Host filter</button>
      <DataGrid {...props} state={state} onStateChange={next => { requested(next); setState(next); }} />
    </ThemeScope>;
  }
  const mounted = render(<Host />);
  const visibleTitles = () => screen.getAllByRole("row").slice(1).map(row => within(row).getByRole("rowheader").textContent);
  expect(visibleTitles()).toEqual(["Gamma"]);
  await user.click(screen.getByRole("button", { name: "Sort Score" }));
  expect(requested.mock.calls.at(-1)?.[0]).toEqual({
    ...defaultGridState, pageSize: 2,
    filters: [{ column: "score", operator: "gte", value: "10" }],
    sort: [{ column: "score", direction: "asc" }],
  });
  expect(visibleTitles()).toEqual(["Gamma", "Beta"]);
  await user.click(screen.getByRole("checkbox", { name: "Select Gamma" }));
  expect(requested.mock.calls.at(-1)?.[0].selectedIds).toEqual(["c"]);
  expect((screen.getByRole("checkbox", { name: "Select Gamma" }) as HTMLInputElement).checked).toBe(true);
  await user.click(screen.getByRole("button", { name: "Host filter" }));
  expect(visibleTitles()).toEqual(["Delta", "Gamma"]);
  await user.click(screen.getByRole("button", { name: "Next page" }));
  expect(requested.mock.calls.at(-1)?.[0]).toEqual({
    ...defaultGridState, page: 1, pageSize: 2, selectedIds: ["c"],
    filters: [{ column: "score", operator: "lte", value: "20" }],
    sort: [{ column: "score", direction: "asc" }],
  });
  expect(visibleTitles()).toEqual(["Beta"]);
  mounted.unmount();
  requested.mockClear();
  render(<Host />);
  expect(visibleTitles()).toEqual(["Gamma"]);
  expect(screen.getByRole("status").textContent).toBe("0 selected");
  expect((screen.getByRole("checkbox", { name: "Select Gamma" }) as HTMLInputElement).checked).toBe(false);
  expect(requested).not.toHaveBeenCalled();
});
