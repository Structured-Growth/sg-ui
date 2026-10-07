// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "../../experimental/Provider/Provider";
import { Button } from "../../experimental/Button/Button";
import { SGNavigationProvider } from "../../adapters/navigation";
import { AppDataGrid } from "./AppDataGrid";
import { createDataGridColumns } from "./createDataGridColumns";
import { createActionMenuColumn } from "./createActionMenuColumn";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

it("composes every owned public cell with safe content and independent nested actions", async () => {
  const user = userEvent.setup();
  const navigate = vi.fn(); const edit = vi.fn(); const preview = vi.fn(); const select = vi.fn();
  const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
  const row = { key: "one", title: "<b>Course</b>", date: "2026-10-06", timestamp: "2026-10-06T02:00:00Z",
    code: "COURSE-001", json: { title: "<img src=x>" }, missing: null };
  const columns = createDataGridColumns<typeof row>([
    { field: "title", headerName: "Course", truncate: false },
    { field: "date", cellType: "date" }, { field: "timestamp", cellType: "dateTime" },
    { field: "link", cellType: "link", getLink: value => ({ href: `/courses/${value.key}`, label: "Open course", abbr: "Course details" }) },
    { field: "code", cellType: "copyable" }, { field: "json", cellType: "json" },
    { field: "image", cellType: "image", getImageSrc: () => "/broken.png", fallbackText: "No cover" },
    { field: "custom", cellType: "custom", renderCustomCell: value => <Button onPress={() => preview(value)}>Preview course</Button> },
    { field: "missing", fallbackText: "Missing value" },
    createActionMenuColumn({ getMenuActions: () => [{ id: "edit", label: "Edit course", onPress: edit }] }),
  ]);
  render(<Provider><SGNavigationProvider value={{ pathname: "/", navigate }}>
    <AppDataGrid rows={[row]} columns={columns} label="Cell acceptance" getRowId={value => value.key}
      getRowLabel={value => value.title} locale="en-US" timeZone="America/Los_Angeles"
      selection={{ onSelectedRowIdsChange: select }} />
  </SGNavigationProvider></Provider>);
  expect(screen.getByText("<b>Course</b>").getAttribute("title")).toBe(row.title);
  expect(screen.getByText("<b>Course</b>").parentElement?.dataset.truncate).toBe("false");
  expect(screen.getByText(JSON.stringify(row.json))).toBeTruthy();
  expect(screen.getByText("Oct 6, 2026")).toBeTruthy();
  expect(screen.getByText("Oct 5, 2026, 7:00 PM")).toBeTruthy();
  expect(screen.getByText("Missing value")).toBeTruthy();
  expect(screen.getByRole("link", { name: "Open course" }).title).toBe("Course details");
  fireEvent.error(screen.getByRole("img", { name: row.title }));
  expect(screen.getByText("No cover")).toBeTruthy();
  await user.click(screen.getByRole("link", { name: "Open course" }));
  expect(navigate).toHaveBeenCalledExactlyOnceWith("/courses/one", { replace: undefined });
  await user.click(screen.getByRole("button", { name: "Copy" }));
  await waitFor(() => expect(screen.getByText("Copied")).toBeTruthy());
  expect(writeText).toHaveBeenCalledExactlyOnceWith(row.code);
  await user.click(screen.getByRole("button", { name: "Preview course" }));
  expect(preview).toHaveBeenCalledExactlyOnceWith(row);
  const trigger = screen.getByRole("button", { name: `Actions for ${row.title}` });
  await user.click(trigger); await user.click(screen.getByRole("menuitem", { name: "Edit course" }));
  expect(edit).toHaveBeenCalledExactlyOnceWith(row);
  await waitFor(() => expect(document.activeElement).toBe(trigger));
  expect(select).not.toHaveBeenCalled();
  expect((screen.getByRole("checkbox", { name: `Select ${row.title}` }) as HTMLInputElement).checked).toBe(false);
});

it("keeps raw accessor sorting separate from display formatting and passes original rows", () => {
  const low = { key: "low", rank: 2 }; const high = { key: "high", rank: 10 };
  const accessor = vi.fn((row: typeof low) => row.rank);
  const format = vi.fn((value: unknown, row: typeof low) => `${row.key}: display ${100 - Number(value)}`);
  render(<Provider><AppDataGrid rows={[high, low]} label="Raw sorting" getRowId={row => row.key}
    getRowLabel={row => row.key} selection={false} defaultSortRules={[{ field: "rank", direction: "asc" }]}
    columns={createDataGridColumns([{ field: "rank", getCellValue: accessor, formatValue: format }])} /></Provider>);
  const rendered = screen.getAllByRole("row").slice(1).map(row => row.textContent);
  expect(rendered).toEqual(["low: display 98", "high: display 90"]);
  expect(accessor).toHaveBeenCalledWith(low); expect(accessor).toHaveBeenCalledWith(high);
  expect(format).toHaveBeenCalledWith(2, low); expect(format).toHaveBeenCalledWith(10, high);
});
