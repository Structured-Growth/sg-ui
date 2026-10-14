// @vitest-environment jsdom
import { StrictMode } from "react";
import userEvent from "@testing-library/user-event";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { OwnedGridInteraction } from "./ownedGridInteraction";

// Keep the real collection/controls. Expose only the interaction boundary so
// jsdom can reproduce the independently observed post-drag collection focus.
const drag = vi.hoisted(() => ({ current: null as null | {
  onDragStart: (event: { keys: Set<string> }) => void;
  onDragEnd: (event: { dropOperation: "move" | "cancel" }) => void;
  onReorder: (event: { keys: Set<string>; target: { key: string; dropPosition: "after" } }) => void;
} }));
vi.mock("react-aria-components/useDragAndDrop", async importOriginal => {
  type Options = { isDisabled?: boolean } & Partial<NonNullable<typeof drag.current>>;
  const original = await importOriginal<{ useDragAndDrop: (options: Options) => unknown }>();
  return { ...original, useDragAndDrop: (options: Options) => {
    if (!options.isDisabled) drag.current = options as unknown as NonNullable<typeof drag.current>;
    return original.useDragAndDrop(options);
  } };
});
afterEach(() => { cleanup(); drag.current = null; vi.restoreAllMocks(); });
const rows = [{ id: "a", name: "Science" }, { id: "b", name: "Mathematics" }, { id: "c", name: "History" }];
const getRowId = (row: typeof rows[number]) => row.id;
const props = { label: "Courses", rows, getRowId, getRowLabel: (row: typeof rows[number]) => row.name,
  columns: [{ field: "name", headerName: "Name" }], defaultPaginationModel: { page: 0, pageSize: 25 } };
const settle = () => act(async () => { await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
async function start() {
  const handle = screen.getByRole("button", { name: "Reorder Mathematics" });
  const row = handle.closest("tr")!;
  await userEvent.click(handle);
  expect(document.activeElement).toBe(handle);
  act(() => drag.current!.onDragStart({ keys: new Set(["b"]) }));
  return { handle, row };
}
function end() { act(() => drag.current!.onDragEnd({ dropOperation: "move" })); }

it.each(["dataset", "identity"])("restores the preserved source handle after late collection focus for a stale %s drop", async replacement => {
  const onReorder = vi.fn();
  const view = (changed: boolean) => <OwnedGridInteraction {...props} rowDrag={{ onReorder }}
    rows={changed && replacement === "dataset" ? rows.map(row => ({ ...row })) : rows}
    getRowId={changed && replacement === "identity" ? row => row.id : getRowId} />;
  const { rerender } = render(view(false));
  const { handle, row } = await start();
  rerender(view(true));
  act(() => drag.current!.onReorder({ keys: new Set(["b"]), target: { key: "c", dropPosition: "after" } }));
  end();
  await settle();
  expect(document.activeElement).toBe(handle);
  // The native red showed the source TR replacing handle focus after the first
  // repair. This is an explicit collection-boundary regression, not native proof.
  act(() => row.focus());
  await settle();
  expect(document.activeElement).toBe(handle);
  expect(onReorder).not.toHaveBeenCalled();
  expect([...document.querySelectorAll("tbody tr[data-grid-row]")].map(row => (row as HTMLElement).dataset.gridRow)).toEqual(["a", "b", "c"]);
});

it("preserves successful requests and cancellation while repairing late source-row focus", async () => {
  const onReorder = vi.fn(); render(<OwnedGridInteraction {...props} rowDrag={{ onReorder }} />);
  const { handle, row } = await start();
  act(() => drag.current!.onReorder({ keys: new Set(["b"]), target: { key: "c", dropPosition: "after" } }));
  end(); await settle(); act(() => row.focus()); await settle();
  expect(document.activeElement).toBe(handle);
  expect(onReorder).toHaveBeenCalledOnce();
  await start(); end(); await settle();
  expect(document.activeElement).toBe(handle);
  expect(onReorder).toHaveBeenCalledOnce();
});

it.each(["external focus", "independent grid", "pointer", "keyboard"])("ends drop focus ownership after %s even if collection focus subsequently returns", async reason => {
  render(<><button>Host action</button><OwnedGridInteraction {...props} label="Independent courses" /><OwnedGridInteraction {...props} rowDrag={{ onReorder: vi.fn() }} /></>);
  const { row } = await start(); end(); await settle();
  if (reason === "external focus" || reason === "independent grid") {
    const outside = reason === "external focus" ? screen.getByRole("button", { name: "Host action" }) : screen.getByRole("grid", { name: "Independent courses" });
    act(() => { outside.focus(); outside.blur(); });
  } else if (reason === "pointer") fireEvent.pointerDown(row);
  else fireEvent.keyDown(row, { key: "ArrowDown" });
  act(() => row.focus()); await settle();
  expect(document.activeElement).toBe(row);
});

it.each(["rows", "identity", "disabled", "removed"])("does not run a stale repair after post-drop %s change", async change => {
  const onReorder = vi.fn();
  const view = (changed: boolean) => <OwnedGridInteraction {...props} rowDrag={{ onReorder }}
    rows={changed && change === "removed" ? rows.filter(row => row.id !== "b") : changed && change === "rows" ? rows.map(row => ({ ...row })) : rows}
    getRowId={changed && change === "identity" ? row => row.id : getRowId} refreshing={changed && change === "disabled"} />;
  const { rerender } = render(view(false));
  const { handle, row } = await start(); end(); await settle();
  rerender(view(true));
  const focusHandle = vi.spyOn(handle, "focus");
  if (row.isConnected) act(() => row.focus());
  await settle();
  expect(focusHandle).not.toHaveBeenCalled();
});

it("cancels owned pending work on Strict Mode unmount", async () => {
  const { unmount } = render(<StrictMode><OwnedGridInteraction {...props} rowDrag={{ onReorder: vi.fn() }} /></StrictMode>);
  const { handle } = await start(); end();
  const focusHandle = vi.spyOn(handle, "focus");
  const cancel = vi.spyOn(window, "cancelAnimationFrame");
  unmount(); await settle();
  expect(cancel).toHaveBeenCalled();
  expect(focusHandle).not.toHaveBeenCalled();
});

it("does not revive ownership when host focus leaves during the drag and is then removed", async () => {
  const outside = document.createElement("button"); document.body.append(outside);
  try {
    render(<OwnedGridInteraction {...props} rowDrag={{ onReorder: vi.fn() }} />);
    const { handle } = await start();
    act(() => { outside.focus(); outside.remove(); });
    const focusHandle = vi.spyOn(handle, "focus");
    end(); await settle();
    expect(focusHandle).not.toHaveBeenCalled();
  } finally { outside.remove(); }
});

it.each(["checkbox", "button", "cell"])("preserves a deliberate same-grid %s focus transfer before the first drop frame", async kind => {
  render(<OwnedGridInteraction {...props} rowDrag={{ onReorder: vi.fn() }} />);
  const { handle } = await start(); end();
  const target = kind === "checkbox" ? screen.getByRole("checkbox", { name: "Select History" }) :
    kind === "button" ? screen.getByRole("button", { name: "Move History up" }) : screen.getByRole("rowheader", { name: "History" });
  act(() => target.focus());
  expect(document.activeElement).toBe(target);
  const focusHandle = vi.spyOn(handle, "focus");
  await settle();
  expect(document.activeElement).toBe(target);
  expect(focusHandle).not.toHaveBeenCalled();
});

it("does not revive drop focus after another same-grid control is focused then removed before the first frame", async () => {
  render(<OwnedGridInteraction {...props} rowDrag={{ onReorder: vi.fn() }} />);
  const { handle } = await start();
  const target = screen.getByRole("button", { name: "Move History up" });
  const parent = target.parentNode!; const next = target.nextSibling;
  try {
    end();
    act(() => target.focus());
    expect(document.activeElement).toBe(target);
    target.remove();
    expect(document.activeElement).toBe(document.body);
    const focusHandle = vi.spyOn(handle, "focus");
    await settle();
    expect(focusHandle).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(document.body);
  } finally {
    // Restore React's node before its cleanup; removal is the ownership oracle.
    parent.insertBefore(target, next);
  }
});

it.each(["row", "cell"])("retains source %s cancellation repair before the first frame", async kind => {
  render(<OwnedGridInteraction {...props} rowDrag={{ onReorder: vi.fn() }} />);
  const { handle, row } = await start(); end();
  const entry = kind === "row" ? row : handle.closest<HTMLElement>("[data-grid-field]")!;
  act(() => entry.focus()); await settle();
  expect(document.activeElement).toBe(handle);
});

it("does not arm drop recovery when another same-grid control already owns focus at drag end", async () => {
  render(<OwnedGridInteraction {...props} rowDrag={{ onReorder: vi.fn() }} />);
  const { handle } = await start();
  const target = screen.getByRole("button", { name: "Move History up" });
  const parent = target.parentNode!; const next = target.nextSibling;
  try {
    act(() => target.focus());
    expect(document.activeElement).toBe(target);
    end(); target.remove();
    expect(document.activeElement).toBe(document.body);
    const focusHandle = vi.spyOn(handle, "focus");
    await settle();
    expect(focusHandle).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(document.body);
  } finally { parent.insertBefore(target, next); }
});

it("returns Strict Mode keyboard cancellation to the source after entering through a selected checkbox", async () => {
  const onReorder = vi.fn();
  render(<StrictMode><OwnedGridInteraction {...props} rowDrag={{ onReorder }} /></StrictMode>);
  const checkbox = screen.getByRole("checkbox", { name: "Select Science" }) as HTMLInputElement;
  await userEvent.click(checkbox.closest("label")!);
  expect(checkbox.checked).toBe(true);
  // Native automation focus is keyboard-visible: nested child focus must not
  // be assumed to update the collection's remembered selection-cell key.
  await userEvent.keyboard("{F6}");
  const handle = screen.getByRole("button", { name: "Reorder Mathematics" });
  await act(async () => handle.focus());
  expect(document.activeElement).toBe(handle);
  await userEvent.keyboard("{Enter}{ArrowDown}{Escape}");
  await settle();
  expect(document.activeElement).toBe(handle);
  expect(checkbox.checked).toBe(true);
  expect(onReorder).not.toHaveBeenCalled();
  expect(document.querySelectorAll('[aria-roledescription="drop indicator"]')).toHaveLength(0);
});


it.each([false, true])("keeps deliberate selected-checkbox ownership after cancellation handle replay, removed=%s", async removed => {
  render(<OwnedGridInteraction {...props} defaultSelectedRowIds={new Set(["a"])} rowDrag={{ onReorder: vi.fn() }} />);
  const { handle } = await start();
  const indicator = document.createElement("div");
  indicator.tabIndex = -1; indicator.setAttribute("aria-roledescription", "drop indicator");
  handle.closest('[data-sgui-part="grid-container"]')!.append(indicator);
  const checkbox = screen.getByRole("checkbox", { name: "Select Science" });
  const parent = checkbox.parentNode!; const next = checkbox.nextSibling;
  try {
    act(() => indicator.focus());
    expect(document.activeElement).toBe(indicator);
    act(() => {
      drag.current!.onDragEnd({ dropOperation: "cancel" });
      // Reproduce DragManager's admitted source-handle restoration, then a
      // genuine host focus choice, before any owned repair frame can run.
      handle.focus();
    });
    act(() => checkbox.focus());
    expect(document.activeElement).toBe(checkbox);
    if (removed) checkbox.remove();
    const focusHandle = vi.spyOn(handle, "focus");
    await settle();
    expect(document.activeElement).toBe(removed ? document.body : checkbox);
    expect(focusHandle).not.toHaveBeenCalled();
  } finally {
    indicator.remove();
    if (removed) parent.insertBefore(checkbox, next);
  }
});

it("preserves a host-selected checkbox focus move during cancellation handle restoration", async () => {
  render(<OwnedGridInteraction {...props} defaultSelectedRowIds={new Set(["a"])} rowDrag={{ onReorder: vi.fn() }} />);
  const { handle } = await start();
  const checkbox = screen.getByRole("checkbox", { name: "Select Science" });
  const indicator = document.createElement("div");
  indicator.tabIndex = -1; indicator.setAttribute("aria-roledescription", "drop indicator");
  handle.closest('[data-sgui-part="grid-container"]')!.append(indicator);
  const hostFocus = () => checkbox.focus();
  try {
    act(() => indicator.focus());
    expect(document.activeElement).toBe(indicator);
    act(() => drag.current!.onDragEnd({ dropOperation: "cancel" }));
    handle.addEventListener("focus", hostFocus);
    act(() => handle.focus());
    await settle();
    expect(document.activeElement).toBe(checkbox);
  } finally { handle.removeEventListener("focus", hostFocus); indicator.remove(); }
});
