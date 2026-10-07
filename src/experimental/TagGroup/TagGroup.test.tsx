// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { TagGroup, type TagItem } from "./TagGroup";
import { SGTranslationProvider } from "../../i18n";

afterEach(cleanup);
const items: TagItem[] = [{ id: "a", label: "Alpha" }, { id: "b", label: "Beta" }, { id: "c", label: "Gamma" }];
function Removable() {
  const [tags, setTags] = useState(items);
  return <TagGroup label="Topics" items={tags} onRemove={ids => setTags(current => current.filter(item => !ids.includes(item.id)))} />;
}
describe("owned tag group", () => {
  it("updates removal availability without replacing host items", async () => {
    const onRemove = vi.fn();
    const { rerender } = render(<TagGroup label="Topics" items={items} />);
    expect(screen.queryByRole("button")).toBeNull();
    rerender(<TagGroup label="Topics" items={items} onRemove={onRemove} />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Remove Beta" }));
    expect(onRemove).toHaveBeenCalledExactlyOnceWith(["b"]);
    expect(screen.getByText("Beta")).toBeTruthy();
    rerender(<TagGroup label="Topics" items={items} />);
    expect(screen.queryByRole("button")).toBeNull();
  });
  it("keeps rejected keyboard removals focused and scoped to their collection", async () => {
    const onRemove = vi.fn();
    render(<><TagGroup label="Editable topics" items={items} onRemove={onRemove} />
      <TagGroup label="Reference topics" items={items} /></>);
    const editable = within(screen.getByRole("grid", { name: "Editable topics" }));
    const reference = within(screen.getByRole("grid", { name: "Reference topics" }));
    const user = userEvent.setup();
    await user.tab();
    await user.keyboard("{ArrowRight}{Delete}{Backspace}");
    expect(onRemove.mock.calls).toEqual([[["b"]], [["b"]]]);
    expect(document.activeElement).toBe(editable.getByRole("row", { name: "Beta" }));
    expect(reference.getAllByRole("row")).toHaveLength(3);
    expect(reference.queryByRole("button")).toBeNull();
  });
  it("removes tokens by keyboard and focuses the next, previous, then empty list", async () => {
    const user = userEvent.setup();
    render(<Removable />);
    await user.tab();
    expect(document.activeElement?.textContent).toContain("Alpha");
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement?.textContent).toContain("Beta");
    await user.keyboard("{Delete}");
    expect(screen.queryByText("Beta")).toBeNull();
    expect(document.activeElement?.textContent).toContain("Gamma");
    await user.keyboard("{Backspace}");
    expect(document.activeElement?.textContent).toContain("Alpha");
    await user.keyboard("{Delete}");
    expect(screen.getByText("No tags")).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole("group", { name: "Topics" }));
  });
  it("uses named remove actions, leaves controlled items authoritative, and forwards a native ref", async () => {
    const onRemove = vi.fn();
    const ref = createRef<HTMLDivElement>();
    render(<TagGroup ref={ref} label="Topics" items={items} onRemove={onRemove} />);
    expect(ref.current?.getAttribute("data-sgui-part")).toBe("tag-group");
    await userEvent.setup().click(screen.getByRole("button", { name: "Remove Beta" }));
    expect(onRemove).toHaveBeenCalledWith(["b"]);
    expect(screen.getByText("Beta")).toBeTruthy();
  });
  it("returns pointer removal focus to the next tag", async () => {
    render(<Removable />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Remove Beta" }));
    expect(screen.queryByText("Beta")).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole("row", { name: "Gamma" }));
  });
  it("blocks disabled removal and omits actions for read-only token lists", async () => {
    const onRemove = vi.fn();
    const { rerender } = render(<TagGroup label="Topics" items={[{ id: "a", label: "Alpha", disabled: true }]} onRemove={onRemove} />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Remove Alpha" }));
    expect(onRemove).not.toHaveBeenCalled();
    rerender(<TagGroup label="Topics" items={items} />);
    expect(screen.queryByRole("button")).toBeNull();
  });
  it("blocks every removal action when the group is disabled", async () => {
    const onRemove = vi.fn();
    render(<TagGroup label="Topics" items={items} disabled onRemove={onRemove} />);
    const user = userEvent.setup();
    for (const button of screen.getAllByRole("button")) {
      expect((button as HTMLButtonElement).disabled).toBe(true);
      await user.click(button);
    }
    await user.tab();
    await user.keyboard("{Delete}");
    expect(onRemove).not.toHaveBeenCalled();
  });
  it("forwards interpolation values to host translations and honors host action labels", () => {
    const t = vi.fn((_key, options) => `Delete ${options.values?.label ?? ""}`);
    render(<SGTranslationProvider value={{ locale: "en", t, useNamespace: () => {} }}>
      <TagGroup label="Topics" items={[items[0]!, { id: "b", label: "Beta", removeLabel: "Clear Beta filter" }]} onRemove={() => {}} />
    </SGTranslationProvider>);
    expect(screen.getByRole("button", { name: "Delete Alpha" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Clear Beta filter" })).toBeTruthy();
    expect(t).toHaveBeenCalledWith("common.ui.removeTag", { defaultMessage: "Remove {label}", values: { label: "Alpha" } });
  });
});
