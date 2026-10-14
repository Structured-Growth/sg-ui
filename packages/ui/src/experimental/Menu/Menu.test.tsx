// @vitest-environment jsdom
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { Menu } from "./Menu";
import { Button } from "../Button/Button";
import { Provider } from "../Provider/Provider";
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
const items = [{ id: "edit", label: "Edit" }, { id: "locked", label: "Unavailable", disabled: true }, { id: "delete", label: "Delete", tone: "danger" as const }];
it("gives the committed first enabled item native focus after programmatic Alt+ArrowDown entry", async () => {
  const user = userEvent.setup();
  render(<Menu label="Virtual entry" items={[{ id: "blocked", label: "Blocked first", disabled: true }, ...items]} trigger={<Button>Virtual actions</Button>} />);
  act(() => screen.getByRole("button", { name: "Virtual actions" }).focus());
  await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
  const first = screen.getByRole("menuitem", { name: "Edit" });
  await waitFor(() => expect(first.getAttribute("data-focused")).toBe("true"));
  await waitFor(() => expect(document.activeElement).toBe(first));
});
it.each(["ArrowDown", "ArrowUp"])("reconciles container focus to the committed %s strategy without choosing disabled endpoints", async key => {
  const user = userEvent.setup();
  render(<Menu label="Reconciled actions" items={[{ id: "blocked-first", label: "Blocked first", disabled: true }, ...items, { id: "blocked-last", label: "Blocked last", disabled: true }]} trigger={<Button>Reconcile</Button>} />);
  await user.tab(); await user.keyboard(`{${key}}`);
  const expected = screen.getByRole("menuitem", { name: key === "ArrowUp" ? "Delete" : "Edit" });
  await waitFor(() => expect(document.activeElement).toBe(expected));
  // Reproduce the native mismatch: the collection is focused after its item
  // has already committed focused state. jsdom's ordinary Alt entry misses it.
  act(() => screen.getByRole("menu").focus());
  expect(document.activeElement).toBe(screen.getByRole("menu"));
  expect(expected.getAttribute("data-focused")).toBe("true");
  await waitFor(() => expect(document.activeElement).toBe(expected));
});
it("does not reclaim focus moved outside the menu before deferred reconciliation", async () => {
  const user = userEvent.setup();
  render(<Menu label="Local actions" items={items} trigger={<Button>Local</Button>} />);
  await user.tab(); await user.keyboard("{ArrowDown}");
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Edit" })));
  // A focus stop elsewhere in this overlay stays inside upstream containment,
  // while being outside the owned menu collection's reconciliation boundary.
  const outside = document.createElement("button");
  outside.textContent = "Other overlay control";
  screen.getByRole("menu").parentElement!.append(outside);
  act(() => { screen.getByRole("menu").focus(); outside.focus(); });
  expect(document.activeElement).toBe(outside);
  await act(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  expect(document.activeElement).toBe(outside);
});
it("discards deferred reconciliation after the menu lifetime ends", async () => {
  const user = userEvent.setup();
  const { unmount } = render(<Menu label="Old actions" items={items} trigger={<Button>Old</Button>} />);
  await user.tab(); await user.keyboard("{ArrowDown}");
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Edit" })));
  act(() => screen.getByRole("menu").focus());
  unmount();
  render(<Menu label="New actions" items={items} trigger={<Button>New</Button>} />);
  const current = screen.getByRole("button", { name: "New" });
  act(() => current.focus());
  await act(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  expect(document.activeElement).toBe(current);
  expect(screen.queryByRole("menu")).toBeNull();
});
it.each([{ items: [] }, { items: [{ id: "blocked", label: "Blocked", disabled: true }] }])("keeps container focus when there is no enabled committed item: $items", async ({ items: unavailable }) => {
  const user = userEvent.setup();
  render(<Menu label="Unavailable actions" items={unavailable} trigger={<Button>Unavailable actions</Button>} />);
  await user.tab(); await user.keyboard("{ArrowDown}");
  const menu = screen.getByRole("menu");
  await act(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  expect(document.activeElement).toBe(menu);
  expect(menu.querySelector('[data-focused="true"]')).toBeNull();
});
it("skips disabled commands, activates once, closes and returns focus", async () => {
  const action = vi.fn(); const user = userEvent.setup();
  render(<Menu label="Course actions" items={items} onAction={action} trigger={<Button>Actions</Button>} />);
  await user.tab(); await user.keyboard("{ArrowDown}");
  expect(screen.getByRole("menu", { name: "Course actions" })).toBeDefined();
  expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Edit" }));
  await user.keyboard("{ArrowDown}"); expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Delete" }));
  await user.keyboard("{Enter}"); expect(action).toHaveBeenCalledExactlyOnceWith("delete");
  expect(screen.queryByRole("menu")).toBeNull();
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Actions" })));
});
it("preserves portal theme and dismisses with Escape without invoking a command", async () => {
  const action = vi.fn(); const user = userEvent.setup();
  render(<Provider theme="dark"><Menu label="Actions" items={items} onAction={action} trigger={<Button>Open</Button>} /></Provider>);
  await user.click(screen.getByRole("button", { name: "Open" }));
  expect(screen.getByRole("menu").closest('[data-sgui-theme="dark"]')).not.toBeNull();
  await user.keyboard("{Escape}"); expect(screen.queryByRole("menu")).toBeNull(); expect(action).not.toHaveBeenCalled();
});
it("keeps controlled open state under host authority", async () => {
  const change = vi.fn(); const user = userEvent.setup();
  const { rerender } = render(<Menu open={false} onOpenChange={change} label="Actions" items={items} trigger={<Button>Open</Button>} />);
  await user.click(screen.getByRole("button")); expect(change).toHaveBeenCalledWith(true); expect(screen.queryByRole("menu")).toBeNull();
  rerender(<Menu open onOpenChange={change} label="Actions" items={items} trigger={<Button>Open</Button>} />);
  expect(screen.getByRole("menu")).toBeDefined(); await user.keyboard("{Escape}"); expect(change).toHaveBeenLastCalledWith(false);
});
it("keeps link menuitems native while routing unmodified and keyboard activation through the host", async () => {
  const { SGNavigationProvider } = await import("../../adapters/navigation");
  const { fireEvent } = await import("@testing-library/react");
  const navigate = vi.fn(); const action = vi.fn(); const user = userEvent.setup();
  render(<SGNavigationProvider value={{ pathname: "/", navigate }}><Menu label="Routes" items={[{ id: "courses", label: "Courses", href: "/courses", replace: true }, { id: "external", label: "Reference", href: "https://example.com" }, { id: "locked", label: "Locked", href: "/locked", disabled: true }]} onAction={action} trigger={<Button>Routes</Button>} /></SGNavigationProvider>);
  await user.click(screen.getByRole("button", { name: "Routes" }));
  const link = screen.getByRole("menuitem", { name: "Courses" });
  expect(link.tagName).toBe("A"); expect(link.getAttribute("href")).toBe("/courses");
  fireEvent.click(link, { ctrlKey: true }); expect(navigate).not.toHaveBeenCalled();
  if (!screen.queryByRole("menu")) await user.click(screen.getByRole("button", { name: "Routes" }));
  await user.click(screen.getByRole("menuitem", { name: "Locked" })); expect(navigate).not.toHaveBeenCalled();
  await user.click(screen.getByRole("menuitem", { name: "Courses" })); expect(navigate).toHaveBeenCalledExactlyOnceWith("/courses", { replace: true });
  navigate.mockClear(); action.mockClear();
  await user.click(screen.getByRole("button", { name: "Routes" })); await user.keyboard("{ArrowDown}{Enter}");
  expect(navigate).toHaveBeenCalledExactlyOnceWith("/courses", { replace: true }); expect(action).toHaveBeenCalledExactlyOnceWith("courses");
});
it("keeps host action errors within the accessible menu scope", async () => {
  const user = userEvent.setup(); render(<Provider theme="dark"><Menu label="Retry actions" errorMessage="Unable to save. Try again." items={items} trigger={<Button>Retry</Button>} /></Provider>);
  await user.click(screen.getByRole("button", { name: "Retry" })); const alert = screen.getByRole("alert"); const menu = screen.getByRole("menu", { name: "Retry actions" }); expect(menu.getAttribute("aria-describedby")).toBe(alert.id); expect(alert.closest('[data-sgui-theme="dark"]')).toBeTruthy();
});
it("exposes host-controlled selected choices alongside plain commands", async () => {
  const user = userEvent.setup(); const action = vi.fn();
  render(<Menu label="Formatting" selectionMode="single" items={[{ id:"left", label:"Left", selected:true }, { id:"right", label:"Right", selected:false }, { id:"indent", label:"Indent", separatorBefore:true }]} trigger={<Button>Format</Button>} onAction={action} />);
  await user.click(screen.getByRole("button", {name:"Format"}));
  expect(screen.getByRole("menuitemradio", {name:"Left"}).getAttribute("aria-checked")).toBe("true");
  expect(screen.getByRole("menuitemradio", {name:"Right"}).getAttribute("aria-checked")).toBe("false");
  expect(screen.getByRole("menuitem", {name:"Indent"})).toBeTruthy();
  await user.click(screen.getByRole("menuitemradio", {name:"Right"})); expect(action).toHaveBeenCalledExactlyOnceWith("right");
  expect(screen.queryByRole("menu")).toBeNull();
});
it("preserves target and rel for native link actions without routing other browsing contexts", async () => {
  const { SGNavigationProvider } = await import("../../adapters/navigation");
  const { fireEvent } = await import("@testing-library/react");
  const navigate = vi.fn(); const user = userEvent.setup();
  render(<SGNavigationProvider value={{ pathname: "/", navigate }}><Menu label="Link targets" items={[{ id: "new", label: "New tab", href: "/course", target: "_blank", rel: "author" }, { id: "parent", label: "Parent", href: "#parent", target: "_parent", rel: "help" }]} trigger={<Button>Targets</Button>} /></SGNavigationProvider>);
  await user.click(screen.getByRole("button", { name: "Targets" }));
  const link = screen.getByRole("menuitem", { name: "New tab" });
  expect(link.getAttribute("target")).toBe("_blank"); expect(link.getAttribute("rel")).toBe("author noopener noreferrer");
  fireEvent.click(link); expect(navigate).not.toHaveBeenCalled();
  if (!screen.queryByRole("menu")) await user.click(screen.getByRole("button", { name: "Targets" }));
  const parent = screen.getByRole("menuitem", { name: "Parent" });
  expect(parent.getAttribute("rel")).toBe("help"); fireEvent.click(parent); expect(navigate).not.toHaveBeenCalled();
});
