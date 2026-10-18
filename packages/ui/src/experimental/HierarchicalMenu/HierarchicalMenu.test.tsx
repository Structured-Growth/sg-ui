// @vitest-environment jsdom
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { HierarchicalMenu } from "./HierarchicalMenu";
import type { HierarchicalMenuLevel } from "./types";
import { Button } from "../../components/Button/Button";
import { Popover } from "../Popover/Popover";
import { useState } from "react";
import { resolvePath } from "./model";

afterEach(cleanup);
const model: HierarchicalMenuLevel = { title: "Course tools", sections: [{ id: "main", items: [
  { id: "settings", label: "Settings", children: { title: "Settings", sections: [{ id: "settings", items: [
    { id: "blocked", label: "Unavailable", disabled: true },
    { id: "people", label: "People", children: { sections: [{ id: "people", items: [{ id: "invite", label: "Invite" }] }] } },
  ] }] } },
  // IDs are local to a level. Inline descendants can reuse this root ID.
  { id: "reports", label: "Root reports" },
  { id: "inline", label: "More", childBehavior: "inline", children: { sections: [{ id: "more", items: [
    { id: "reports", label: "Reports", children: { sections: [{ id: "reports", items: [{ id: "export", label: "Export" }] }] } },
  ] }] } },
  { id: "home", label: "Home", href: "/home", current: true },
] }], footerItems: [{ id: "help", label: "Help", href: "https://example.org", target: "_blank" }] };

it("enters three levels, restores Back focus, preserves mixed inline expansion and isolates sibling panels", async () => {
  const user = userEvent.setup(); const action = vi.fn();
  render(<><HierarchicalMenu label="First" items={model} onAction={action} /><HierarchicalMenu label="Second" items={model} /></>);
  const first = () => within(screen.getByRole("navigation", { name: "First" }));
  await user.click(first().getByRole("button", { name: "Settings" }));
  await waitFor(() => expect(document.activeElement).toBe(first().getByRole("button", { name: "People" })));
  await user.keyboard("{Enter}");
  await waitFor(() => expect(document.activeElement).toBe(first().getByRole("button", { name: "Invite" })));
  await user.keyboard("{Enter}"); expect(action).toHaveBeenCalledExactlyOnceWith("invite");
  await user.click(first().getByRole("button", { name: "Back to People" }));
  await waitFor(() => expect(document.activeElement).toBe(first().getByRole("button", { name: "People" })));
  await user.click(first().getByRole("button", { name: "Back to Settings" }));
  await waitFor(() => expect(document.activeElement).toBe(first().getByRole("button", { name: "Settings" })));
  expect(first().getByRole("button", { name: "Root reports" })).toBeDefined();
  await user.click(first().getByRole("button", { name: "More" }));
  await user.click(first().getByRole("button", { name: "Reports" }));
  await waitFor(() => expect(document.activeElement).toBe(first().getByRole("button", { name: "Export" })));
  await user.click(first().getByRole("button", { name: "Back to Reports" }));
  await waitFor(() => expect(document.activeElement).toBe(first().getByRole("button", { name: "Reports" })));
  expect(first().getByRole("button", { name: "More" }).getAttribute("aria-expanded")).toBe("true");
  expect(within(screen.getByRole("navigation", { name: "Second" })).queryByRole("button", { name: "Back to Settings" })).toBeNull();
  const current=first().getByRole("link",{name:"Home"});
  current.focus();await user.tab();
  expect(document.activeElement).toBe(first().getByRole("link",{name:"Help"}));
  expect(current.getAttribute("aria-current")).toBe("page");
  expect(first().getByRole("link", { name: "Help" }).getAttribute("rel")).toContain("noopener");
});

it("keeps rejecting controlled paths authoritative and repairs a removed ancestor once without stealing host focus", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const { rerender } = render(<><HierarchicalMenu label="Controlled" items={model} path={[]} onPathChange={change} /><button>Host</button></>);
  await user.click(screen.getByRole("button", { name: "Settings" }));
  expect(change).toHaveBeenCalledExactlyOnceWith(["settings"]);
  expect(screen.queryByRole("button", { name: "Back to Settings" })).toBeNull();
  rerender(<><HierarchicalMenu label="Controlled" items={model} path={["settings"]} onPathChange={change} /><button>Host</button></>);
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "People" })));
  await user.click(screen.getByRole("button", { name: "Host" }));
  const removed = { ...model, sections: [] };
  rerender(<><HierarchicalMenu label="Controlled" items={removed} path={["settings"]} onPathChange={change} /><button>Host</button></>);
  await waitFor(() => expect(change).toHaveBeenLastCalledWith([]));
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Host" }));
  expect(change).toHaveBeenCalledTimes(2);
});

it("command host skips disabled items, unwinds Escape before closing, and reopens at root", async () => {
  const user = userEvent.setup(); const action = vi.fn();
  function Host() {
    const [open, setOpen] = useState(false);
    return <Popover title="Commands popup" open={open} onOpenChange={setOpen} trigger={<Button>Open commands</Button>}>
      <HierarchicalMenu presentation="commands" label="Commands" items={model} onAction={action} onDismiss={() => setOpen(false)} />
    </Popover>;
  }
  render(<Host />);
  await user.click(screen.getByRole("button", { name: "Open commands" }));
  await user.click(screen.getByRole("menuitem", { name: "Settings" }));
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "People" })));
  await user.keyboard("{Enter}");
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Invite" })));
  await user.keyboard("{Enter}"); expect(action).toHaveBeenCalledExactlyOnceWith("invite");
  await user.keyboard("{Escape}");
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "People" })));
  expect(screen.getByRole("dialog", { name: "Commands popup" })).toBeDefined();
  await user.keyboard("{Escape}");
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Settings" })));
  await user.keyboard("{Escape}");
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Open commands" })));
  await user.click(screen.getByRole("button", { name: "Open commands" }));
  expect(screen.queryByRole("menuitem", { name: "Back to Settings" })).toBeNull();
});

it("resolves only usable ancestry across missing, disabled, leaf, inline, footer and cyclic branches", () => {
  const child: HierarchicalMenuLevel = { sections: [{ id: "child", items: [
    { id: "leaf", label: "Leaf" },
    { id: "disabled", label: "Disabled", disabled: true, children: model },
  ] }] };
  const root: HierarchicalMenuLevel = { sections: [{ id: "root", items: [
    { id: "branch", label: "Branch", children: child },
    { id: "inline", label: "Inline", childBehavior: "inline", children: child },
  ] }], footerItems: [{ id: "footer", label: "Footer", children: child }] };
  // A real object cycle must stop before re-entering the root.
  const cyclic: HierarchicalMenuLevel = { sections: [] };
  const cyclicRoot = { ...root, footerItems: [{ id: "cycle", label: "Cycle", children: cyclic }] };
  // Mutate only this local fixture to close the cycle.
  cyclic.sections = [{ id: "cycle", items: [{ id: "root", label: "Root", children: cyclicRoot }] }];
  for (const tail of ["missing", "disabled", "leaf"]) {
    const result = resolvePath(root, ["branch", tail], false);
    expect(result.path).toEqual(["branch"]);
    expect(result.level).toBe(child);
    expect(result.ancestors.map(item => item.id)).toEqual(["branch"]);
  }
  expect(resolvePath(root, ["inline"], false).level).toBe(root);
  expect(resolvePath(root, ["inline"], true).path).toEqual(["inline"]);
  expect(resolvePath(root, ["footer"], false).level).toBe(child);
  expect(resolvePath(cyclicRoot, ["cycle", "root", "cycle"], false).path).toEqual(["cycle"]);
});

it("applies controlled paths only after host acceptance, including Back and external root changes", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const { rerender } = render(<HierarchicalMenu label="Controlled" items={model} path={["settings"]} onPathChange={change} />);
  await user.click(screen.getByRole("button", { name: "People" }));
  expect(change).toHaveBeenCalledExactlyOnceWith(["settings", "people"]);
  expect(screen.queryByRole("button", { name: "Invite" })).toBeNull();
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "People" }));
  rerender(<HierarchicalMenu label="Controlled" items={model} path={["settings", "people"]} onPathChange={change} />);
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Invite" })));
  await user.click(screen.getByRole("button", { name: "Back to People" }));
  expect(change).toHaveBeenLastCalledWith(["settings"]);
  expect(screen.getByRole("button", { name: "Invite" })).toBeDefined();
  rerender(<HierarchicalMenu label="Controlled" items={model} path={["settings"]} onPathChange={change} />);
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "People" })));
  rerender(<HierarchicalMenu label="Controlled" items={model} path={[]} onPathChange={change} />);
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Settings" })));
  expect(change).toHaveBeenCalledTimes(2);
});

it("repairs a disabled deep ancestor once, retains valid ancestry and restores focus to its usable level", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const { rerender } = render(<HierarchicalMenu label="Local" items={model} defaultPath={["settings", "people"]} onPathChange={change} />);
  await user.click(screen.getByRole("button", { name: "Invite" }));
  const settings = model.sections[0].items[0];
  const updated: HierarchicalMenuLevel = { ...model, sections: [{ ...model.sections[0], items: [
    { ...settings, children: { ...settings.children!, sections: [{ id: "settings", items: [
      { id: "people", label: "People", disabled: true, children: settings.children!.sections[0].items[1].children },
      { id: "fallback", label: "Manage settings" },
    ] }] } },
  ] }] };
  rerender(<HierarchicalMenu label="Local" items={updated} defaultPath={[]} onPathChange={change} />);
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Manage settings" })));
  expect(change).toHaveBeenCalledExactlyOnceWith(["settings"]);
  expect(screen.queryByRole("button", { name: "Invite" })).toBeNull();
  expect(screen.getByRole("button", { name: "People" }).hasAttribute("disabled")).toBe(true);
  rerender(<HierarchicalMenu label="Local" items={{ ...updated }} defaultPath={[]} onPathChange={change} />);
  expect(change).toHaveBeenCalledTimes(1);
  await user.click(screen.getByRole("button", { name: "Back to Settings" }));
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Settings" })));
  expect(change).toHaveBeenLastCalledWith([]);
});

it("keeps two active panels' paths, callbacks and inline disclosures independent", async () => {
  const user = userEvent.setup(); const firstChange = vi.fn(); const secondChange = vi.fn();
  const firstAction = vi.fn(); const secondAction = vi.fn();
  render(<>
    <HierarchicalMenu label="First" items={model} onPathChange={firstChange} onAction={firstAction} />
    <HierarchicalMenu label="Second" items={model} onPathChange={secondChange} onAction={secondAction} />
  </>);
  const first = () => within(screen.getByRole("navigation", { name: "First" }));
  const second = () => within(screen.getByRole("navigation", { name: "Second" }));
  await user.click(first().getByRole("button", { name: "More" }));
  await user.click(first().getByRole("button", { name: "Reports" }));
  await user.click(second().getByRole("button", { name: "Settings" }));
  await user.click(second().getByRole("button", { name: "People" }));
  await user.click(first().getByRole("button", { name: "Export" }));
  expect(firstAction).toHaveBeenCalledExactlyOnceWith("export");
  expect(secondAction).not.toHaveBeenCalled();
  await user.click(first().getByRole("button", { name: "Back to Reports" }));
  expect(first().getByRole("button", { name: "More" }).getAttribute("aria-expanded")).toBe("true");
  expect(second().getByRole("button", { name: "Invite" })).toBeDefined();
  await user.click(second().getByRole("button", { name: "Invite" }));
  expect(secondAction).toHaveBeenCalledExactlyOnceWith("invite");
  expect(firstChange.mock.calls).toEqual([[["inline", "reports"]], [[]]]);
  expect(secondChange.mock.calls).toEqual([[["settings"]], [["settings", "people"]]]);
});
