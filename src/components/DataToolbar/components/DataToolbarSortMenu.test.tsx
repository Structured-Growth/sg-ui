// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "../../../experimental/Provider/Provider";
import { DataToolbarSortMenu, type DataToolbarSortRule } from "./DataToolbarSortMenu";

afterEach(cleanup);
const options = [{ id: "name", label: "Course name" }, { id: "status", label: "Status" }, { id: "date", label: "Created" }];
const initial: DataToolbarSortRule[] = [{ field: "name", direction: "asc" }];
function menu(value: DataToolbarSortRule[], onApply = vi.fn()) {
  return <Provider><DataToolbarSortMenu options={options} value={value} onApply={onApply} /></Provider>;
}
async function open(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: /^Sort/ }));
  await screen.findByRole("dialog", { name: "Sort" });
}
function pointer(handle: HTMLElement, type: string, clientX: number, clientY: number, pointerType = "mouse") {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, button: 0, clientX, clientY });
  Object.defineProperties(event, { pointerId: { value: 7 }, pointerType: { value: pointerType } });
  fireEvent(handle, event);
}
function mockRows() {
  return Array.from(screen.getByRole("dialog").querySelectorAll<HTMLDivElement>('[data-sgui-part="sort-rule"]'), (row, index) =>
    vi.spyOn(row, "getBoundingClientRect").mockReturnValue({
      left: 0, right: 600, top: index * 60, bottom: index * 60 + 50, width: 600, height: 50, x: 0, y: index * 60, toJSON: () => ({}),
    }));
}

describe("owned sort rule menu", () => {
  it("adds unused fields, edits direction, removes a rule and applies only complete rules", async () => {
    const user = userEvent.setup(); const onApply = vi.fn();
    render(menu(initial, onApply)); await open(user);
    await user.click(screen.getByRole("button", { name: "Add sort rule" }));
    await user.click(screen.getByRole("button", { name: /Order 2/ }));
    await user.click(await screen.findByRole("option", { name: "Descending" }));
    await user.click(screen.getByRole("button", { name: "Remove sort rule 1" }));
    await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(onApply).toHaveBeenCalledExactlyOnceWith([{ field: "status", direction: "desc" }]);
    await open(user);
    await user.click(screen.getByRole("button", { name: "Reset" }));
    await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(onApply).toHaveBeenLastCalledWith([]);
  });
  it("cancels edits and reloads the latest controlled value on reopening", async () => {
    const user = userEvent.setup(); const onApply = vi.fn();
    const { rerender } = render(menu(initial, onApply)); await open(user);
    await user.click(screen.getByRole("button", { name: "Reset" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onApply).not.toHaveBeenCalled();
    rerender(menu([{ field: "date", direction: "desc" }], onApply)); await open(user);
    expect(screen.getByRole("button", { name: /Column 1/ }).textContent).toContain("Created");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(document.activeElement?.textContent).toContain("Sort"));
    await open(user); await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(onApply).toHaveBeenCalledExactlyOnceWith([{ field: "date", direction: "desc" }]);
  });
  it("supports keyboard/non-drag priority changes and keeps rule identity through moves", async () => {
    const user = userEvent.setup(); const onApply = vi.fn();
    render(menu([...initial, { field: "status", direction: "desc" }, { field: "date", direction: "asc" }], onApply));
    await open(user);
    expect((screen.getByRole("button", { name: "Move sort rule up 1" }) as HTMLButtonElement).disabled).toBe(true);
    const up = screen.getByRole("button", { name: "Move sort rule up 3" }); up.focus();
    await user.keyboard("{Enter}");
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: /Column 2/ })));
    screen.getByRole("button", { name: "Move sort rule up 2" }).focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: /Column 1/ }).textContent).toContain("Created");
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: /Column 1/ })));
    await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(onApply).toHaveBeenCalledExactlyOnceWith([
      { field: "date", direction: "asc" }, ...initial, { field: "status", direction: "desc" },
    ]);
  });
  it("commits captured pointer reorder only on release and focuses the moved rule", async () => {
    const user = userEvent.setup(); const onApply = vi.fn();
    render(menu([...initial, { field: "status", direction: "desc" }], onApply)); await open(user);
    const handles = screen.getByRole("dialog").querySelectorAll<HTMLSpanElement>('[data-sgui-part="sort-rule-handle"]');
    const rects = mockRows();
    const setCapture = vi.fn(); const releaseCapture = vi.fn();
    handles[1].setPointerCapture = setCapture; handles[1].releasePointerCapture = releaseCapture; handles[1].hasPointerCapture = () => true;
    try {
      pointer(handles[1], "pointerdown", 10, 80);
      pointer(handles[1], "pointermove", 10, 20);
      expect(setCapture).toHaveBeenCalledWith(7);
      expect(screen.getByRole("button", { name: /Column 1/ }).textContent).toContain("Course name");
      expect(onApply).not.toHaveBeenCalled();
      pointer(handles[1], "pointerup", 10, 20);
      expect(releaseCapture).toHaveBeenCalledWith(7);
      await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: /Column 1/ })));
      expect(screen.getByRole("button", { name: /Column 1/ }).textContent).toContain("Status");
      await user.click(screen.getByRole("button", { name: "Apply" }));
      expect(onApply).toHaveBeenCalledExactlyOnceWith([{ field: "status", direction: "desc" }, ...initial]);
    } finally { rects.forEach(spy => spy.mockRestore()); }
  });
  it("cancels pointer/touch movement and ignores a tap below the movement threshold", async () => {
    const user = userEvent.setup(); const onApply = vi.fn();
    render(menu([...initial, { field: "status", direction: "desc" }], onApply)); await open(user);
    const handles = screen.getByRole("dialog").querySelectorAll<HTMLSpanElement>('[data-sgui-part="sort-rule-handle"]');
    const rects = mockRows();
    try {
      pointer(handles[1], "pointerdown", 10, 80, "touch");
      pointer(handles[1], "pointermove", 10, 20, "touch");
      pointer(handles[1], "pointercancel", 10, 20, "touch");
      pointer(handles[1], "pointerup", 10, 20, "touch");
      expect(screen.getByRole("dialog").querySelector('[data-drop-target]')).toBeNull();
      pointer(handles[1], "pointerdown", 10, 80);
      pointer(handles[1], "pointerup", 11, 81);
      expect(screen.getByRole("button", { name: /Column 1/ }).textContent).toContain("Course name");
      await user.click(screen.getByRole("button", { name: "Apply" }));
      expect(onApply).toHaveBeenCalledExactlyOnceWith([...initial, { field: "status", direction: "desc" }]);
    } finally { rects.forEach(spy => spy.mockRestore()); }
  });
  it("keeps placeholder rules incomplete and prevents duplicate fields", async () => {
    const user = userEvent.setup(); const onApply = vi.fn();
    render(menu([], onApply)); await open(user);
    await user.click(screen.getByRole("button", { name: /Column 1/ }));
    await user.click(await screen.findByRole("option", { name: "Course name" }));
    await user.click(screen.getByRole("button", { name: "Add sort rule" }));
    await user.click(screen.getByRole("button", { name: /Column 2/ }));
    expect(screen.queryByRole("option", { name: "Course name" })).toBeNull();
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(onApply).toHaveBeenCalledExactlyOnceWith([{ field: "status", direction: "asc" }]);
  });
  it("disables Add with exhausted options and all controls avoid host submission", async () => {
    const user = userEvent.setup(); const submit = vi.fn();
    render(<Provider><form onSubmit={submit}><DataToolbarSortMenu options={options} value={[
      ...initial, { field: "status", direction: "asc" }, { field: "date", direction: "asc" },
    ]} onApply={vi.fn()} /></form></Provider>); await open(user);
    expect((screen.getByRole("button", { name: "Add sort rule" }) as HTMLButtonElement).disabled).toBe(true);
    await user.click(screen.getByRole("button", { name: "Apply" })); expect(submit).not.toHaveBeenCalled();
  });
  it("focuses the added rule when Add disables, then a survivor on remove and the blank rule on reset", async () => {
    const user = userEvent.setup();
    const { unmount } = render(menu([...initial, { field: "status", direction: "asc" }]));
    await open(user);
    screen.getByRole("button", { name: "Add sort rule" }).focus();
    await user.keyboard("{Enter}");
    expect((screen.getByRole("button", { name: "Add sort rule" }) as HTMLButtonElement).disabled).toBe(true);
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: /Column 3/ })));
    await user.click(screen.getByRole("button", { name: "Remove sort rule 3" }));
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: /Column 2/ })));
    await user.click(screen.getByRole("button", { name: "Reset" }));
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: /Column 1/ })));
    expect(screen.getByRole("button", { name: /Column 1/ }).textContent).toContain("Select column");
    unmount();
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  it("counts and applies only current fields, valid directions and the first rule for each field", async () => {
    const user = userEvent.setup(); const onApply = vi.fn();
    const { rerender } = render(menu([
      ...initial, { field: "name", direction: "desc" }, { field: "removed", direction: "asc" },
      { field: "status", direction: "sideways" as DataToolbarSortRule["direction"] },
    ], onApply));
    expect(screen.getByRole("button", { name: /^Sort/ }).textContent).toBe("Sort1");
    await open(user); await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(onApply).toHaveBeenCalledExactlyOnceWith(initial);
    // An option can disappear while the draft is open; Apply uses current metadata.
    await open(user);
    rerender(<Provider><DataToolbarSortMenu options={options.filter(option => option.id !== "name")} value={initial} onApply={onApply} /></Provider>);
    await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(onApply).toHaveBeenLastCalledWith([]);
    expect(screen.getByRole("button", { name: /^Sort/ }).textContent).toBe("Sort");
  });
});
