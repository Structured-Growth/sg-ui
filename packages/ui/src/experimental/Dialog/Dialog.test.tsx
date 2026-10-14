// @vitest-environment jsdom
import { useEffect, useRef, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dialog, type DialogDismissReason } from "./Dialog";
import { Button } from "../Button/Button";
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
