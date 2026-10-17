// @vitest-environment jsdom
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { HierarchicalMenu } from "./HierarchicalMenu";
import type { HierarchicalMenuLevel } from "./types";
import { Button } from "../../components/Button/Button";
import { Popover } from "../Popover/Popover";
import { useState } from "react";

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
  expect(first().getByRole("link", { name: "Home" }).getAttribute("aria-current")).toBe("page");
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
