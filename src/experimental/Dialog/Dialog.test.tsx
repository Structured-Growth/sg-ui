// @vitest-environment jsdom
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
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
