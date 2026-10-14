// @vitest-environment jsdom
import { useState } from "react";
import { renderToString } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SGTranslationProvider } from "../../i18n";
import { Provider } from "../../experimental/Provider/Provider";
import { ColumnsLayoutModal, type ColumnsLayoutPreset } from "./ColumnsLayoutModal";
afterEach(cleanup);

it("selects exactly one preset with arrows, inserts once and returns focus", async () => {
  const user = userEvent.setup(); const submit = vi.fn(); const outer = vi.fn();
  function Host() {
    const [open, setOpen] = useState(false);
    return <Provider><form onSubmit={event => { event.preventDefault(); outer(); }}>
      <button type="button" onClick={() => setOpen(true)}>Columns</button>
      <ColumnsLayoutModal open={open} onClose={() => setOpen(false)} onSubmit={preset => { submit(preset); setOpen(false); }} />
    </form></Provider>;
  }
  render(<Host />); await user.click(screen.getByRole("button", { name: "Columns" }));
  expect(screen.getAllByRole("radio")).toHaveLength(5);
  await user.click(screen.getByRole("radio", { name: "2 columns (equal width)" }));
  await user.keyboard("{ArrowDown}{ArrowDown}");
  expect((screen.getByRole("radio", { name: "3 columns (equal width)" }) as HTMLInputElement).checked).toBe(true);
  expect(screen.getAllByRole("radio").filter(radio => (radio as HTMLInputElement).checked)).toHaveLength(1);
  await user.tab(); await user.tab();
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Insert" }));
  await user.keyboard(" "); expect(submit).toHaveBeenCalledExactlyOnceWith("threeEqual"); expect(outer).not.toHaveBeenCalled();
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Columns" })));
});

it("discards cancelled drafts and reloads the host default on reopening", async () => {
  const user = userEvent.setup(); const submit = vi.fn();
  const { rerender } = render(<Provider><ColumnsLayoutModal open defaultPreset="three255025" onClose={vi.fn()} onSubmit={submit} /></Provider>);
  await user.click(screen.getByRole("radio", { name: "4 columns (equal width)" }));
  await user.click(screen.getByRole("button", { name: "Cancel" })); expect(submit).not.toHaveBeenCalled();
  rerender(<Provider><ColumnsLayoutModal open={false} defaultPreset="two2575" onClose={vi.fn()} onSubmit={submit} /></Provider>);
  rerender(<Provider><ColumnsLayoutModal open defaultPreset="two2575" onClose={vi.fn()} onSubmit={submit} /></Provider>);
  expect((screen.getByRole("radio", { name: "2 columns (25% - 75%)" }) as HTMLInputElement).checked).toBe(true);
  await user.click(screen.getByRole("button", { name: "Insert" })); expect(submit).toHaveBeenCalledExactlyOnceWith("two2575");
});

it("normalizes an invalid runtime preset and dismisses Escape without persistence", async () => {
  const user = userEvent.setup(); const submit = vi.fn(); const close = vi.fn();
  render(<Provider><ColumnsLayoutModal open defaultPreset={"invalid" as ColumnsLayoutPreset} onClose={close} onSubmit={submit} /></Provider>);
  expect((screen.getByRole("radio", { name: "2 columns (equal width)" }) as HTMLInputElement).checked).toBe(true);
  await user.keyboard("{Escape}"); expect(close).toHaveBeenCalledTimes(1); expect(submit).not.toHaveBeenCalled();
});
it("server renders closed without browser-dependent modal state", () => {
  expect(renderToString(<ColumnsLayoutModal open={false} onClose={() => {}} onSubmit={() => {}} />)).not.toContain('role="dialog"');
});

it("forwards translation defaults for the title, group and every preset", () => {
 const t = vi.fn((_key: string, options: {defaultMessage:string}) => options.defaultMessage);
 render(<SGTranslationProvider value={{locale:'en-US',t,useNamespace:()=>{}}}><Provider><ColumnsLayoutModal open onClose={()=>{}} onSubmit={()=>{}} /></Provider></SGTranslationProvider>);
 expect(t).toHaveBeenCalledWith('common.ui.columnsLayout.two2575', {defaultMessage:'2 columns (25% - 75%)'});
 expect(t).toHaveBeenCalledWith('common.ui.columnsLayoutPreset', {defaultMessage:'Columns layout'});
});
