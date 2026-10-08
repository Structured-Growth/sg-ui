// @vitest-environment jsdom
import { createRef, useState } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs, type TabsProps } from "./Tabs";
import { Provider } from "../Provider/Provider";

afterEach(cleanup);

it("associates panels locally and isolates controlled selection through rerender and remount", async () => {
  const user = userEvent.setup();
  const request = vi.fn<(value: string) => void>();
  const ref = createRef<HTMLDivElement>();
  const items: TabsProps["items"] = [
    { id: "details", label: "Details", content: "Course details" },
    { id: "access", label: "Access", content: "Course access" },
  ];
  function Host({ showFirst, revision }: { showFirst: boolean; revision: string }) {
    const [value, setValue] = useState("details");
    return <Provider>
      {showFirst && <Tabs ref={ref} label="First course" items={items} value={value}
        onValueChange={next => { request(next); setValue(next); }} />}
      <Tabs label={`Other course ${revision}`} items={items} defaultValue="details" />
    </Provider>;
  }
  function assertAssociation(label: string, selected: string) {
    const list = screen.getByRole("tablist", { name: label });
    const tab = within(list).getByRole("tab", { name: selected });
    expect(tab.getAttribute("aria-selected")).toBe("true");
    // Both instances may name a panel alike, so resolve the ID owned by this tab.
    const associated = document.getElementById(tab.getAttribute("aria-controls")!);
    expect(tab.id).not.toBe("");
    expect(associated?.getAttribute("role")).toBe("tabpanel");
    expect(list.parentElement?.parentElement?.contains(associated)).toBe(true);
    expect(associated?.getAttribute("aria-labelledby")).toBe(tab.id);
    expect(associated?.textContent).toBe(`Course ${selected.toLowerCase()}`);
    return { list, tab, panel: associated };
  }
  const { rerender, unmount } = render(<Host showFirst revision="one" />);
  // Initial panels have the same accessible name but unique DOM associations.
  const lists = screen.getAllByRole("tablist");
  const initialTabs = lists.map(list => within(list).getByRole("tab", { name: "Details" }));
  expect(new Set(initialTabs.map(tab => tab.id)).size).toBe(2);
  expect(new Set(initialTabs.map(tab => tab.getAttribute("aria-controls"))).size).toBe(2);
  for (const tab of initialTabs) {
    expect(document.getElementById(tab.getAttribute("aria-controls")!)?.getAttribute("aria-labelledby")).toBe(tab.id);
  }
  const firstRoot = ref.current;
  expect(firstRoot).toBeInstanceOf(HTMLDivElement);
  await user.click(within(lists[0]).getByRole("tab", { name: "Access" }));
  expect(request.mock.calls).toEqual([["access"]]);
  assertAssociation("First course", "Access");
  const other = assertAssociation("Other course one", "Details");
  rerender(<Host showFirst revision="two" />);
  expect(ref.current).toBe(firstRoot);
  assertAssociation("First course", "Access");
  expect(assertAssociation("Other course two", "Details").tab.id).toBe(other.tab.id);
  rerender(<Host showFirst={false} revision="two" />);
  expect(ref.current).toBeNull();
  expect(screen.queryByRole("tablist", { name: "First course" })).toBeNull();
  expect(assertAssociation("Other course two", "Details").panel).toBe(other.panel);
  unmount();
  render(<Host showFirst revision="fresh" />);
  const freshFirst = assertAssociation("First course", "Details");
  const freshOther = assertAssociation("Other course fresh", "Details");
  expect(freshFirst.panel).not.toBe(freshOther.panel);
  expect(request.mock.calls).toEqual([["access"]]);
});
