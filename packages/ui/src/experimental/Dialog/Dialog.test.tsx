// @vitest-environment jsdom
import { StrictMode, useEffect, useRef, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dialog, type DialogDismissReason } from "./Dialog";
import { Button } from "../../components/Button/Button";
import { TextField } from "../TextField/TextField";
import { Popover } from "../Popover/Popover";
import { Provider } from "../Provider/Provider";
afterEach(cleanup);

function Fixture({ dismissed, locked = false }: { dismissed: (reason: DialogDismissReason) => void; locked?: boolean }) {
  const [open, setOpen] = useState(false);
  return <Provider theme="dark" density="compact" style={{ "--sgui-focus": "#abcdef", padding: "99px" }}>
    <Button onPress={() => setOpen(true)}>Open form</Button>
    <Dialog open={open} title="Course settings" description="Review before saving" dismissOnEscape={!locked} dismissOnOutside={!locked}
      onDismiss={reason => { dismissed(reason); setOpen(false); }}>
      <TextField label="Course" autoFocus />
      <Popover title="Help" trigger={<Button>Open help</Button>}><TextField label="Note" autoFocus /></Popover>
    </Dialog>
  </Provider>;
}
describe("owned nested dialog proof", () => {
  it("keeps custom heading and actions in the header with the owned Close action", async () => {
    const user = userEvent.setup(); const dismissed = vi.fn(); const help = vi.fn();
    render(<Provider><Dialog open aria-label="Custom settings" onDismiss={dismissed}
      header={<><h2>Host settings heading</h2><Button onPress={help}>Header help</Button></>}
      footer={<Button>Save settings</Button>}><TextField label="Setting" autoFocus /></Dialog></Provider>);
    const dialog = screen.getByRole("dialog", { name: "Custom settings" });
    const heading = screen.getByRole("heading", { name: "Host settings heading" });
    const action = screen.getByRole("button", { name: "Header help" });
    const close = screen.getByRole("button", { name: "Close" });
    expect(heading.closest("header")).toBe(action.closest("header"));
    expect(close.closest("header")).toBe(action.closest("header"));
    expect(dialog.contains(heading)).toBe(true);
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Setting" })));
    await user.tab({ shift: true }); expect(document.activeElement).toBe(close);
    await user.tab({ shift: true }); expect(document.activeElement).toBe(action);
    await user.keyboard("{Enter}"); expect(help).toHaveBeenCalledOnce();
    expect(dismissed).not.toHaveBeenCalled();
    await user.tab(); await user.keyboard("{Enter}");
    expect(dismissed).toHaveBeenLastCalledWith("close-button");
  });
  it("moves focus into the dialog, traps it and restores the trigger on Escape", async () => {
    const user = userEvent.setup(); const dismissed = vi.fn();
    render(<Fixture dismissed={dismissed} />);
    const trigger = screen.getByRole("button", { name: "Open form" });
    await user.click(trigger);
    const dialog = await screen.findByRole("dialog", { name: "Course settings" });
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Course" })));
    for (let index = 0; index < 5; index++) { await user.tab(); expect(dialog.contains(document.activeElement)).toBe(true); }
    await user.keyboard("{Escape}");
    expect(dismissed).toHaveBeenLastCalledWith("escape");
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
  it("preserves portal settings, keeps nested Escape local, and distinguishes later outside dismissal", async () => {
    const user = userEvent.setup(); const dismissed = vi.fn();
    render(<Fixture dismissed={dismissed} />);
    await user.click(screen.getByRole("button", { name: "Open form" }));
    const dialog = await screen.findByRole("dialog", { name: "Course settings" });
    const scope = dialog.closest('[data-sgui-scope]') as HTMLElement;
    expect(scope.getAttribute("data-sgui-theme")).toBe("dark"); expect(scope.getAttribute("data-sgui-density")).toBe("compact");
    expect(scope.style.getPropertyValue("--sgui-focus")).toBe("#abcdef"); expect(scope.style.padding).toBe("");
    await user.click(screen.getByRole("button", { name: "Open help" }));
    expect(await screen.findByRole("dialog", { name: "Help" })).toBeTruthy();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Help" })).toBeNull());
    expect(dismissed).not.toHaveBeenCalled();
    await user.click(scope);
    await waitFor(() => expect(dismissed).toHaveBeenLastCalledWith("outside"));
  });
  it("honors dismissal locks while retaining an explicit close action", async () => {
    const user = userEvent.setup(); const dismissed = vi.fn();
    render(<Fixture dismissed={dismissed} locked />);
    await user.click(screen.getByRole("button", { name: "Open form" }));
    const dialog = await screen.findByRole("dialog", { name: "Course settings" });
    await user.keyboard("{Escape}"); await user.click(dialog.closest('[data-sgui-scope]')!);
    expect(dismissed).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(dismissed).toHaveBeenLastCalledWith("close-button");
  });
  it("reports generic assistive dismissal separately from pointer outside dismissal", async () => {
    const user = userEvent.setup(); const dismissed = vi.fn();
    render(<Fixture dismissed={dismissed} />);
    await user.click(screen.getByRole("button", { name: "Open form" }));
    const dialog = await screen.findByRole("dialog", { name: "Course settings" });
    fireEvent.click(dialog.parentElement!.querySelector('button[aria-label="Dismiss"]')!);
    expect(dismissed).toHaveBeenLastCalledWith("dismiss");
  });
});

function RecoveryFixture({ hostFocus = false, remove = true, removePreferred = false, handoff = false }: { hostFocus?: boolean; remove?: boolean; removePreferred?: boolean; handoff?: boolean }) {
  const [open, setOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);
  const [present, setPresent] = useState(true);
  const [otherOpen, setOtherOpen] = useState(false);
  const destination = useRef<HTMLInputElement>(null);
  const chooseHost = useRef(false);
  useEffect(() => {
    if (!childOpen && chooseHost.current) destination.current?.focus();
  }, [childOpen]);
  return <Provider>
    <Button onPress={() => setOpen(true)}>Open parent</Button>
    <Dialog open={open} title="Parent" onDismiss={() => setOpen(false)}>
      {(present || !removePreferred) && <TextField label="Parent fallback" autoFocus />}
      <TextField label="Host destination" ref={destination} />
      {present && <Button onPress={() => setChildOpen(true)}>Open child</Button>}
      <Dialog open={childOpen} title="Child" onDismiss={() => { setChildOpen(false); if (handoff) setOtherOpen(true); }}>
        <TextField label="Child input" autoFocus />
        <Button onPress={() => { if (remove) setPresent(false); chooseHost.current = hostFocus; }}>Prepare dismissal</Button>
      </Dialog>
    </Dialog>
    <Dialog open={otherOpen} title="Other modal" onDismiss={() => setOtherOpen(false)}>
      <TextField label="Other modal destination" autoFocus />
    </Dialog>
  </Provider>;
}

describe("removed child opener recovery", () => {
  for (const dismissal of ["escape", "outside", "close-button"] as const) {
    for (const hostFocus of [false, true]) {
      it(`${dismissal}: ${hostFocus ? "preserves host focus" : "returns to the parent's initial focus"}`, async () => {
        const user = userEvent.setup();
        render(<RecoveryFixture hostFocus={hostFocus} />);
        const outer = screen.getByRole("button", { name: "Open parent" });
        await user.click(outer);
        await user.click(screen.getByRole("button", { name: "Open child" }));
        await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Child input" })));
        await user.click(screen.getByRole("button", { name: "Prepare dismissal" }));
        const child = screen.getByRole("dialog", { name: "Child" });
        if (dismissal === "escape") await user.keyboard("{Escape}");
        else if (dismissal === "outside") await user.click(child.closest('[data-sgui-part="dialog-overlay"]')!);
        else await user.click(within(child).getByRole("button", { name: "Close" }));
        await waitFor(() => expect(screen.queryByRole("dialog", { name: "Child" })).toBeNull());
        const destination = screen.getByRole("textbox", { name: hostFocus ? "Host destination" : "Parent fallback" });
        await waitFor(() => expect(document.activeElement).toBe(destination));
        await act(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
        expect(document.activeElement).toBe(destination);
        await user.tab();
        expect(screen.getByRole("dialog", { name: "Parent" }).contains(document.activeElement)).toBe(true);
        await user.keyboard("{Escape}");
        await waitFor(() => expect(document.activeElement).toBe(outer));
      });
    }
  }
  it("preserves focus in another modal opened by the host during dismissal", async () => {
    const user = userEvent.setup();
    render(<RecoveryFixture handoff />);
    await user.click(screen.getByRole("button", { name: "Open parent" }));
    await user.click(screen.getByRole("button", { name: "Open child" }));
    await user.click(screen.getByRole("button", { name: "Prepare dismissal" }));
    await user.keyboard("{Escape}");
    const destination = screen.getByRole("textbox", { name: "Other modal destination" });
    await waitFor(() => expect(document.activeElement).toBe(destination));
    await act(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    expect(document.activeElement).toBe(destination);
  });
  it("uses the parent's first tabbable control when its initial destination was also removed", async () => {
    const user = userEvent.setup();
    render(<RecoveryFixture removePreferred />);
    await user.click(screen.getByRole("button", { name: "Open parent" }));
    await user.click(screen.getByRole("button", { name: "Open child" }));
    await user.click(screen.getByRole("button", { name: "Prepare dismissal" }));
    await user.keyboard("{Escape}");
    const parent = screen.getByRole("dialog", { name: "Parent" });
    await waitFor(() => expect(document.activeElement).toBe(within(parent).getByRole("button", { name: "Close" })));
  });
  it("retains the surviving child opener and then the outer opener", async () => {
    const user = userEvent.setup();
    render(<RecoveryFixture remove={false} />);
    const outer = screen.getByRole("button", { name: "Open parent" });
    await user.click(outer);
    const childTrigger = screen.getByRole("button", { name: "Open child" });
    await user.click(childTrigger);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(document.activeElement).toBe(childTrigger));
    await user.keyboard("{Escape}");
    await waitFor(() => expect(document.activeElement).toBe(outer));
  });
});


it("releases resize observers/listeners/queued work and keeps nested focus owned by its dialog", async () => {
  // This double exposes observer lifetime only. Real focus/resize geometry remains
  // covered by the native modal case; React Aria and focus scopes are not mocked.
  const observers: ResizeObserverDouble[] = [];
  class ResizeObserverDouble implements ResizeObserver {
    readonly targets = new Set<Element>();
    disconnected = false;
    constructor(readonly callback: ResizeObserverCallback) { observers.push(this); }
    observe = vi.fn((target: Element) => { this.targets.add(target); });
    unobserve = vi.fn((target: Element) => { this.targets.delete(target); });
    disconnect = vi.fn(() => { this.disconnected = true; });
    notify() { this.callback([], this); }
  }
  vi.stubGlobal("ResizeObserver", ResizeObserverDouble);
  const added = vi.spyOn(window, "addEventListener");
  const removed = vi.spyOn(window, "removeEventListener");
  function NestedResizeFixture() {
    const [parentOpen, setParentOpen] = useState(false);
    const [childOpen, setChildOpen] = useState(false);
    return <Provider>
      <Button onPress={() => setParentOpen(true)}>Open resize parent</Button>
      <Dialog open={parentOpen} title="Resize parent" onDismiss={() => setParentOpen(false)}>
        <TextField label="Parent resize field" autoFocus />
        <Button onPress={() => setChildOpen(true)}>Open resize child</Button>
        <Dialog open={childOpen} title="Resize child" onDismiss={() => setChildOpen(false)}>
          <TextField label="Nested resize field" autoFocus />
        </Dialog>
      </Dialog>
    </Provider>;
  }
  const user = userEvent.setup();
  const view = render(<StrictMode><NestedResizeFixture /></StrictMode>);
  try {
    await user.click(screen.getByRole("button", { name: "Open resize parent" }));
    const parent = await screen.findByRole("dialog", { name: "Resize parent" });
    await waitFor(() => expect(document.activeElement).toBe(within(parent).getByRole("textbox", { name: "Parent resize field" })));
    await user.click(within(parent).getByRole("button", { name: "Open resize child" }));
    const child = await screen.findByRole("dialog", { name: "Resize child" });
    const field = await within(child).findByRole("textbox", { name: "Nested resize field" });
    await waitFor(() => expect(document.activeElement).toBe(field));
    await act(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    const parentBody = parent.querySelector(':scope > [data-sgui-part="dialog-body"]')!;
    const childBody = child.querySelector(':scope > [data-sgui-part="dialog-body"]')!;
    const parentObserver = observers.find(observer => !observer.disconnected && observer.targets.has(parent) && observer.targets.has(parentBody))!;
    const childObserver = observers.find(observer => !observer.disconnected && observer.targets.has(child) && observer.targets.has(childBody))!;
    expect(parentObserver).toBeDefined(); expect(childObserver).toBeDefined();
    expect(added).toHaveBeenCalledWith("resize", parentObserver.callback);
    expect(added).toHaveBeenCalledWith("resize", childObserver.callback);

    const frames = new Map<number, FrameRequestCallback>();
    let nextFrame = 900_000;
    const scheduled = vi.spyOn(window, "requestAnimationFrame").mockImplementation(callback => {
      const id = ++nextFrame; frames.set(id, callback); return id;
    });
    const cancelled = vi.spyOn(window, "cancelAnimationFrame").mockImplementation(id => { frames.delete(id); });
    const flushFrame = () => {
      const callbacks = [...frames.entries()]; frames.clear();
      act(() => { for (const [, callback] of callbacks) callback(0); });
    };
    // Geometry is a lifecycle probe: force a reveal only if the proper owner
    // reaches its measurement. Parent callbacks must not even measure the child.
    const measured = vi.spyOn(field, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 1000, 100, 40));
    const scrolled = vi.fn();
    Object.defineProperty(field, "scrollIntoView", { configurable: true, value: scrolled });
    parentObserver.notify(); flushFrame(); flushFrame();
    expect(measured).not.toHaveBeenCalled(); expect(scrolled).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(field);
    childObserver.notify(); flushFrame(); flushFrame();
    expect(scrolled).toHaveBeenCalledExactlyOnceWith({ block: "nearest", inline: "nearest" });
    expect(document.activeElement).toBe(field);

    // Schedule both owners, then remove the tree before either callback runs.
    parentObserver.notify(); const parentPending = nextFrame;
    childObserver.notify(); const childPending = nextFrame;
    expect(scheduled).toHaveBeenCalled();
    view.unmount();
    expect(parentObserver.disconnect).toHaveBeenCalledOnce();
    expect(childObserver.disconnect).toHaveBeenCalledOnce();
    expect(removed).toHaveBeenCalledWith("resize", parentObserver.callback);
    expect(removed).toHaveBeenCalledWith("resize", childObserver.callback);
    expect(cancelled).toHaveBeenCalledWith(parentPending);
    expect(cancelled).toHaveBeenCalledWith(childPending);
    expect(frames.has(parentPending)).toBe(false); expect(frames.has(childPending)).toBe(false);
    flushFrame(); expect(scrolled).toHaveBeenCalledTimes(1);
    // StrictMode's discarded effect observers must also have been disconnected.
    expect(observers.filter(observer => observer.targets.has(parent) || observer.targets.has(child)).every(observer => observer.disconnected)).toBe(true);
  } finally {
    view.unmount(); vi.restoreAllMocks(); vi.unstubAllGlobals();
  }
});
