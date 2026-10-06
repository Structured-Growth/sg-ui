// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { Menu } from "./Menu";
import { Button } from "../Button/Button";
import { Provider } from "../Provider/Provider";
afterEach(cleanup);
const items = [{ id: "edit", label: "Edit" }, { id: "locked", label: "Unavailable", disabled: true }, { id: "delete", label: "Delete", tone: "danger" as const }];
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
