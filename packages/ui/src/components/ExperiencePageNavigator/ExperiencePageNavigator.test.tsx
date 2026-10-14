// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { ExperiencePageNavigator, type ExperiencePageNavigatorProps } from "./ExperiencePageNavigator";
import { Provider } from "../../experimental/Provider/Provider";
afterEach(cleanup);
const pages = [{ key: "a", title: "Intro" }, { key: "b", title: "Lesson" }];
function props(overrides: Partial<ExperiencePageNavigatorProps> = {}): ExperiencePageNavigatorProps {
  return { pages, activePageKey: "a", onSelectPage: vi.fn(), onAddPage: vi.fn(), onRemovePage: vi.fn(), onRenamePage: vi.fn(), onReorderPages: vi.fn(), ...overrides };
}
it("selects and adds once while commands remain separate from selection", async () => {
  const p = props(); const user = userEvent.setup(); render(<ExperiencePageNavigator {...p} />);
  expect(screen.getByRole("button", { name: "Intro Page 1 • Active" }).getAttribute("aria-current")).toBe("page");
  await user.click(screen.getByRole("button", { name: "Lesson Page 2" })); expect(p.onSelectPage).toHaveBeenCalledExactlyOnceWith("b");
  await user.click(screen.getByRole("button", { name: "Add" })); expect(p.onAddPage).toHaveBeenCalledTimes(1);
  await user.click(screen.getByRole("button", { name: "Actions for Lesson" }));
  expect(p.onSelectPage).toHaveBeenCalledTimes(1);
  await user.click(screen.getByRole("menuitem", { name: "Remove" })); expect(p.onRemovePage).toHaveBeenCalledExactlyOnceWith("b");
});
it("renames with a trimmed title on Enter and restores focus after dismissal", async () => {
  const p = props(); const user = userEvent.setup(); render(<Provider theme="dark"><ExperiencePageNavigator {...p} /></Provider>);
  await user.click(screen.getByRole("button", { name: "Actions for Intro" }));
  await user.click(screen.getByRole("menuitem", { name: "Edit Page Name" }));
  const input = screen.getByRole("textbox", { name: "Page Name" });
  await waitFor(() => expect(document.activeElement).toBe(input));
  expect(screen.getByRole("dialog").closest('[data-sgui-theme="dark"]')).not.toBeNull();
  await user.clear(input); await user.type(input, "  New intro  {Enter}");
  expect(p.onRenamePage).toHaveBeenCalledExactlyOnceWith("a", "New intro");
  expect(screen.queryByRole("dialog")).toBeNull();
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Actions for Intro" })));
});
it("cancels with Escape and ignores unchanged or blank titles", async () => {
  const p = props(); const user = userEvent.setup(); render(<ExperiencePageNavigator {...p} />);
  const open = async () => { await user.click(screen.getByRole("button", { name: "Actions for Intro" })); await user.click(screen.getByRole("menuitem", { name: "Edit Page Name" })); };
  await open(); await user.keyboard("{Escape}"); expect(screen.queryByRole("dialog")).toBeNull();
  await open(); await user.click(screen.getByRole("button", { name: "Save" }));
  await open(); await user.clear(screen.getByRole("textbox")); await user.type(screen.getByRole("textbox"), "   {Enter}");
  expect(p.onRenamePage).not.toHaveBeenCalled();
});
it("offers keyboard reorder commands with boundary commands disabled", async () => {
  const p = props(); const user = userEvent.setup(); render(<ExperiencePageNavigator {...p} />);
  const trigger = screen.getByRole("button", { name: "Actions for Intro" }); trigger.focus(); await user.keyboard("{ArrowDown}");
  expect(screen.getByRole("menuitem", { name: "Move up" }).getAttribute("aria-disabled")).toBe("true");
  await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");
  expect(p.onReorderPages).toHaveBeenCalledExactlyOnceWith("a", "b");
  expect(p.onSelectPage).not.toHaveBeenCalled();
});
it("validates drag sources and prevents self or read-only reorder", () => {
  const p = props(); const { rerender } = render(<ExperiencePageNavigator {...p} />);
  const row = screen.getByRole("button", { name: "Lesson Page 2" }).closest("li")!;
  const dataTransfer = { getData: vi.fn(() => "a"), setData: vi.fn() };
  fireEvent.drop(row, { dataTransfer }); expect(p.onReorderPages).toHaveBeenCalledExactlyOnceWith("a", "b");
  dataTransfer.getData.mockReturnValue("unknown"); fireEvent.drop(row, { dataTransfer });
  dataTransfer.getData.mockReturnValue("b"); fireEvent.drop(row, { dataTransfer }); expect(p.onReorderPages).toHaveBeenCalledTimes(1);
  rerender(<ExperiencePageNavigator {...p} readOnly />); dataTransfer.getData.mockReturnValue("a"); fireEvent.drop(row, { dataTransfer });
  expect(p.onReorderPages).toHaveBeenCalledTimes(1); expect(row.draggable).toBe(false);
});
it("read-only permits selection and disables mutation; the last page cannot be removed", async () => {
  const p = props({ pages: pages.slice(0, 1) }); const user = userEvent.setup(); const { rerender } = render(<ExperiencePageNavigator {...p} />);
  await user.click(screen.getByRole("button", { name: "Actions for Intro" }));
  expect(screen.getByRole("menuitem", { name: "Remove" }).getAttribute("aria-disabled")).toBe("true"); await user.keyboard("{Escape}");
  rerender(<ExperiencePageNavigator {...p} readOnly />);
  await user.click(screen.getByRole("button", { name: "Add" })); await user.click(screen.getByRole("button", { name: "Actions for Intro" }));
  expect(screen.queryByRole("menu")).toBeNull(); expect(p.onAddPage).not.toHaveBeenCalled();
  await user.click(screen.getByRole("button", { name: "Intro Page 1 • Active" })); expect(p.onSelectPage).toHaveBeenCalledExactlyOnceWith("a");
});
it("does not rename a page removed by the host while the dialog is open", async () => {
  const p = props(); const user = userEvent.setup(); const { rerender } = render(<ExperiencePageNavigator {...p} />);
  await user.click(screen.getByRole("button", { name: "Actions for Intro" })); await user.click(screen.getByRole("menuitem", { name: "Edit Page Name" }));
  rerender(<ExperiencePageNavigator {...p} pages={pages.slice(1)} />);
  await user.clear(screen.getByRole("textbox")); await user.type(screen.getByRole("textbox"), "Changed{Enter}"); expect(p.onRenamePage).not.toHaveBeenCalled();
});
it("moves focus to an adjacent selection when the host removes the focused row", async () => {
  const p = props(); const user = userEvent.setup(); const { rerender } = render(<ExperiencePageNavigator {...p} />);
  await user.click(screen.getByRole("button", { name: "Actions for Intro" })); await user.click(screen.getByRole("menuitem", { name: "Remove" }));
  rerender(<ExperiencePageNavigator {...p} pages={pages.slice(1)} activePageKey="b" />);
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Lesson Page 1 • Active" })));
});
it("blocks rename if the host changes to read-only during editing", async () => {
  const p = props(); const user = userEvent.setup(); const { rerender } = render(<ExperiencePageNavigator {...p} />);
  await user.click(screen.getByRole("button", { name: "Actions for Intro" })); await user.click(screen.getByRole("menuitem", { name: "Edit Page Name" }));
  await user.clear(screen.getByRole("textbox")); await user.type(screen.getByRole("textbox"), "Changed");
  rerender(<ExperiencePageNavigator {...p} readOnly />); await user.keyboard("{Enter}");
  expect(p.onRenamePage).not.toHaveBeenCalled();
});
