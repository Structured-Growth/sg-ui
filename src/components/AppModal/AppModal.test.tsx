// @vitest-environment jsdom
import { createRef, useEffect, useRef, useState } from "react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppModal, type AppModalCloseReason } from "./AppModal";
import { AppButton } from "../AppButton";
import { AppPageTabs } from "../AppPageTabs";
import { TextField } from "../../experimental/TextField/TextField";
import { Popover } from "../../experimental/Popover/Popover";
import { Provider } from "../../experimental/Provider/Provider";
afterEach(cleanup);
function Fixture({ close, locked = false }: {close: (reason: AppModalCloseReason) => void; locked?: boolean}) {
  const [open,setOpen] = useState(false); const [tab,setTab] = useState("details");
  return <Provider theme="dark"><AppButton onPress={() => setOpen(true)}>Open</AppButton>
    <AppModal open={open} title="Settings" subtitle="Review settings" size="md" heightMode="md" showCloseButton
      disableBackdropClose={locked} disableEscapeKeyDown={locked} onClose={reason => {close(reason);setOpen(false);}}>
      <AppPageTabs value={tab} onChange={setTab} items={[{id:"details",label:"Details",content:<TextField label="Name" autoFocus />},
        {id:"access",label:"Access",content:<Popover title="Help" trigger={<AppButton>Help</AppButton>}><TextField label="Note" autoFocus /></Popover>}]} />
    </AppModal></Provider>;
}
function NestedModalFixture({ close }: { close: (reason: string) => void }) {
  const [open, setOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);
  return <Provider><AppButton onPress={() => setOpen(true)}>Open parent</AppButton>
    <AppModal open={open} title="Parent" onClose={reason => { close(`parent:${reason}`); setOpen(false); }}>
      <TextField label="Parent name" autoFocus />
      <AppButton onPress={() => setChildOpen(true)}>Open child</AppButton>
      <AppModal open={childOpen} title="Child" onClose={reason => { close(`child:${reason}`); setChildOpen(false); }}>
        <TextField label="Child name" autoFocus />
      </AppModal>
    </AppModal>
  </Provider>;
}
describe("AppModal owned contract", () => {
  it("preserves a host-selected parent destination when a removed child opener dismisses", async () => {
    function RemovedTriggerFixture() {
      const [open, setOpen] = useState(false);
      const [child, setChild] = useState(false);
      const [removed, setRemoved] = useState(false);
      const destination = useRef<HTMLInputElement>(null);
      useEffect(() => { if (removed && !child) destination.current?.focus(); }, [removed, child]);
      return <Provider><AppButton onPress={() => setOpen(true)}>Open recovery</AppButton>
        <AppModal open={open} title="Parent recovery" onClose={() => setOpen(false)}>
          <TextField label="Fallback" autoFocus /><TextField label="Destination" ref={destination} />
          {!removed && <AppButton onPress={() => setChild(true)}>Open removable</AppButton>}
          <AppModal open={child} title="Child recovery" onClose={() => setChild(false)}>
            <TextField label="Child" autoFocus /><AppButton onPress={() => setRemoved(true)}>Remove opener</AppButton>
          </AppModal>
        </AppModal></Provider>;
    }
    const user = userEvent.setup();
    render(<RemovedTriggerFixture />);
    await user.click(screen.getByRole("button", { name: "Open recovery", exact: true }));
    await user.click(screen.getByRole("button", { name: "Open removable", exact: true }));
    await user.click(screen.getByRole("button", { name: "Remove opener", exact: true }));
    expect(screen.queryByRole("button", { name: "Open removable", exact: true })).toBeNull();
    expect(screen.getByRole("dialog", { name: "Child recovery" })).toBeTruthy();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Destination" })));
    await user.tab();
    expect(screen.getByRole("dialog", { name: "Parent recovery" }).contains(document.activeElement)).toBe(true);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Open recovery", exact: true })));
  });
  it("dismisses the top modal once and restores each surviving trigger", async () => {
    const user = userEvent.setup(); const close = vi.fn();
    render(<NestedModalFixture close={close} />);
    const parentTrigger = screen.getByRole("button", { name: "Open parent" });
    await user.click(parentTrigger);
    const childTrigger = screen.getByRole("button", { name: "Open child" });
    await user.click(childTrigger);
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Child name" })));
    await user.keyboard("{Escape}");
    expect(close.mock.calls).toEqual([["child:escape"]]);
    await waitFor(() => expect(document.activeElement).toBe(childTrigger));
    expect(screen.getByRole("dialog", { name: "Parent" })).toBeTruthy();
    await user.keyboard("{Escape}");
    expect(close.mock.calls).toEqual([["child:escape"], ["parent:escape"]]);
    await waitFor(() => expect(document.activeElement).toBe(parentTrigger));
  });
  it("traps focus, labels its content, and restores the trigger with an owned Escape reason", async () => {
    const user=userEvent.setup();const close=vi.fn();render(<Fixture close={close} />);
    const trigger=screen.getByRole("button",{name:"Open"});await user.click(trigger);
    const dialog=await screen.findByRole("dialog",{name:"Settings"});
    await waitFor(()=>expect(document.activeElement).toBe(screen.getByRole("textbox",{name:"Name"})));
    expect(dialog.getAttribute("aria-describedby")).toBeTruthy();
    for(let index=0;index<6;index++){await user.tab();expect(dialog.contains(document.activeElement)).toBe(true);}
    await user.keyboard("{Escape}");expect(close).toHaveBeenLastCalledWith("escape");
    await waitFor(()=>expect(document.activeElement).toBe(trigger));
  });
  it("keeps nested tabs/popover dismissal local and copies the portal theme", async () => {
    const user=userEvent.setup();const close=vi.fn();render(<Fixture close={close} />);await user.click(screen.getByRole("button",{name:"Open"}));
    const dialog=await screen.findByRole("dialog",{name:"Settings"});expect(dialog.closest('[data-sgui-scope]')?.getAttribute("data-sgui-theme")).toBe("dark");
    await user.click(screen.getByRole("tab",{name:"Access"}));await user.click(screen.getByRole("button",{name:"Help"}));
    expect(await screen.findByRole("dialog",{name:"Help"})).toBeTruthy();await user.keyboard("{Escape}");
    await waitFor(()=>expect(screen.queryByRole("dialog",{name:"Help"})).toBeNull());expect(close).not.toHaveBeenCalled();
    await user.click(dialog.closest('[data-sgui-part="dialog-overlay"]')!);expect(close).toHaveBeenLastCalledWith("outside");
  });
  it("honors both dismissal locks and reports explicit close separately", async () => {
    const user=userEvent.setup();const close=vi.fn();render(<Fixture close={close} locked />);await user.click(screen.getByRole("button",{name:"Open"}));
    const dialog=await screen.findByRole("dialog",{name:"Settings"});await user.keyboard("{Escape}");await user.click(dialog.closest('[data-sgui-part="dialog-overlay"]')!);
    expect(close).not.toHaveBeenCalled();await user.click(screen.getByRole("button",{name:"Close"}));expect(close).toHaveBeenLastCalledWith("close-button");
  });
  it("has native refs/styles, form-safe actions, pending/disabled states and no single-step label", async () => {
    const user=userEvent.setup();const action=vi.fn();const submit=vi.fn();const ref=createRef<HTMLElement>();
    const {rerender}=render(<Provider><AppModal ref={ref} open title="Edit" size="xl" width={800} height="70vh" steps={{current:1,total:1,label:"Step one"}}
      primaryAction={{label:"Save",onPress:action}} secondaryAction={{label:"Cancel",disabled:true}}><form onSubmit={submit}><TextField label="Name" /></form></AppModal></Provider>);
    expect(ref.current?.getAttribute("role")).toBe("dialog");expect(ref.current?.closest('[data-sgui-part="dialog-surface"]')?.getAttribute("style")).toContain("width: 800px");
    expect(screen.queryByText("Step one")).toBeNull();await user.click(screen.getByRole("button",{name:"Save"}));expect(action).toHaveBeenCalledTimes(1);expect(submit).not.toHaveBeenCalled();
    rerender(<Provider><AppModal open title="Edit" steps={{current:2,total:3}} primaryAction={{label:"Save",loading:true,onPress:action}}>Content</AppModal></Provider>);
    expect(screen.getByText("Step 2 of 3")).toBeTruthy();await user.click(screen.getByRole("button",{name:"Save"}));expect(action).toHaveBeenCalledTimes(1);
  });
  it("keeps full viewport sizing independent of height presets", async () => {
    render(<Provider><AppModal open title="Full" size="full" heightMode="md">Content</AppModal></Provider>);
    const dialog=await screen.findByRole("dialog",{name:"Full"});
    const surface=dialog.closest('[data-sgui-part="dialog-surface"]') as HTMLElement;
    expect(surface.getAttribute("data-size")).toBe("full");expect(surface.style.height).toBe("");
    expect(dialog.closest('[data-sgui-part="dialog-overlay"]')?.getAttribute("data-size")).toBe("full");
  });
  it("names custom headers and server-renders a closed modal", async () => {
    render(<Provider><AppModal open aria-label="Custom settings" headerContent={<h2>Custom</h2>} footerContent={<AppButton>Done</AppButton>}>Content</AppModal></Provider>);
    expect(await screen.findByRole("dialog",{name:"Custom settings"})).toBeTruthy();expect(screen.getByRole("button",{name:"Done"})).toBeTruthy();
    expect(renderToString(<AppModal open={false} title="Closed">Content</AppModal>)).not.toContain('role="dialog"');
  });
});
