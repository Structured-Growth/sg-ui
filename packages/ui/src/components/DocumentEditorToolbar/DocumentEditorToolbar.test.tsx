// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DocumentEditorToolbar } from "./DocumentEditorToolbar";
import { SGTranslationProvider } from "../../i18n";

afterEach(cleanup);
const createProps = () => ({
  canEdit: true, headingValue: "normal" as const, onHeadingChange: vi.fn(),
  actions: { bold: {active:false,onClick:vi.fn()}, italic: {active:true,onClick:vi.fn()}, bulletList:{active:false,onClick:vi.fn()}, orderedList:{active:true,onClick:vi.fn()} },
});
describe("DocumentEditorToolbar", () => {
  it("names actions and activates once by pointer and keyboard with controlled pressed states", async () => {
    const user=userEvent.setup(); const props=createProps(); const zoomIn=vi.fn(); const zoomOut=vi.fn(); const submit=vi.fn();
    render(<form onSubmit={submit}><DocumentEditorToolbar {...props} onZoomIn={zoomIn} onZoomOut={zoomOut} zoomValue={125} /></form>);
    for (const name of ["Bold","Italic","Bulleted list","Numbered list","Zoom in","Zoom out"]) await user.click(screen.getByRole("button",{name}));
    Object.values(props.actions).forEach(action=>expect(action.onClick).toHaveBeenCalledTimes(1));
    expect(zoomIn).toHaveBeenCalledTimes(1); expect(zoomOut).toHaveBeenCalledTimes(1); expect(screen.getByLabelText("Zoom").textContent).toBe("125%");
    expect(screen.getByRole("button",{name:"Italic"}).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button",{name:"Bold"}).getAttribute("aria-pressed")).toBe("false");
    screen.getByRole("button",{name:"Bold"}).focus(); await user.keyboard(" "); expect(props.actions.bold.onClick).toHaveBeenCalledTimes(2);
    screen.getByRole("button",{name:"Italic"}).focus(); await user.keyboard("{Enter}"); expect(props.actions.italic.onClick).toHaveBeenCalledTimes(2);
    expect(submit).not.toHaveBeenCalled();
  });
  it("requests heading once while retaining the host's controlled value and select focus", async () => {
    const user=userEvent.setup(); const props=createProps(); render(<DocumentEditorToolbar {...props} />);
    const trigger=screen.getByRole("button",{name:/Text style heading/}); await user.click(trigger); await user.click(screen.getByRole("option",{name:"H2"}));
    await waitFor(()=>expect(props.onHeadingChange).toHaveBeenCalledExactlyOnceWith("h2"));
    expect(trigger.textContent).toContain("Normal"); await waitFor(()=>expect(document.activeElement).toBe(trigger));
  });
  it("finishes keyboard selection before the host refocuses contenteditable", async () => {
    const user=userEvent.setup(); const change=vi.fn(()=>screen.getByRole("textbox",{name:"Host editor"}).focus());
    render(<><DocumentEditorToolbar {...createProps()} onHeadingChange={change} /><div contentEditable role="textbox" aria-label="Host editor" suppressContentEditableWarning>Document text</div></>);
    await user.click(screen.getByRole("button",{name:/Text style heading/})); await user.keyboard("{ArrowDown}");
    const option=screen.getByRole("option",{name:"H1"}); fireEvent.keyDown(option,{key:"Enter",code:"Enter"}); expect(change).not.toHaveBeenCalled();
    fireEvent.keyUp(option,{key:"Enter",code:"Enter"}); await waitFor(()=>expect(change).toHaveBeenCalledExactlyOnceWith("h1"));
    expect(document.activeElement).toBe(screen.getByRole("textbox",{name:"Host editor"})); expect(screen.getByRole("textbox").textContent).toBe("Document text");
  });
  it("disables editing without disabling available zoom and retains unavailable placeholders", async () => {
    const user=userEvent.setup(); const props=createProps(); const zoom=vi.fn(); render(<DocumentEditorToolbar {...props} canEdit={false} onZoomIn={zoom} showCustomComponentAction />);
    for (const name of ["Bold","Italic","Bulleted list","Numbered list","Align left","Align center","Align right","Justify","Custom component","Zoom out"]) {
      const button=screen.getByRole("button",{name}) as HTMLButtonElement; expect(button.disabled).toBe(true); await user.click(button);
    }
    expect((screen.getByRole("button",{name:/Text style heading/}) as HTMLButtonElement).disabled).toBe(true);
    Object.values(props.actions).forEach(action=>expect(action.onClick).not.toHaveBeenCalled());
    await user.click(screen.getByRole("button",{name:"Zoom in"})); expect(zoom).toHaveBeenCalledTimes(1);
  });
  it("disables commands whose host callbacks are absent", () => {
    render(<DocumentEditorToolbar {...createProps()} onHeadingChange={undefined} actions={{bold:{active:true},italic:{active:false},bulletList:{active:false},orderedList:{active:false}}} />);
    for (const name of ["Bold","Italic","Bulleted list","Numbered list"]) expect((screen.getByRole("button",{name}) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole("button",{name:/Text style heading/}) as HTMLButtonElement).disabled).toBe(true);
  });
  it("honors optional groups, status color and right slot precedence", () => {
    const {rerender}=render(<DocumentEditorToolbar {...createProps()} showZoomControls={false} showAlignmentControls={false} statusLabel="Saved" statusColor="var(--sgui-action)" />);
    expect(screen.queryByRole("button",{name:"Zoom in"})).toBeNull(); expect(screen.queryByRole("button",{name:"Align left"})).toBeNull(); expect(screen.getByText("Saved").style.color).toBe("var(--sgui-action)");
    rerender(<DocumentEditorToolbar {...createProps()} statusLabel="Saved" rightSlot={<span>Host status</span>} />);
    expect(screen.queryByText("Saved")).toBeNull(); expect(screen.getByText("Host status")).toBeTruthy();
    rerender(<DocumentEditorToolbar {...createProps()} />); expect(screen.queryByText("Host status")).toBeNull();
  });
  it("forwards native root props and translates owned labels", () => {
    const ref=createRef<HTMLDivElement>(); const t=vi.fn((_key,options)=>`Translated ${options.defaultMessage}`);
    render(<SGTranslationProvider value={{t,useNamespace:()=>{}}}><DocumentEditorToolbar {...createProps()} ref={ref} className="host-toolbar" style={{marginInline:2}} /></SGTranslationProvider>);
    expect(ref.current).toBe(screen.getByRole("group",{name:"Translated Document editing"})); expect(ref.current?.classList.contains("host-toolbar")).toBe(true);
    expect(screen.getByRole("button",{name:"Translated Bold"})).toBeTruthy(); expect(ref.current?.style.marginInline).toBe("2px");
  });
  it("uses replacement host callbacks and controlled formatting across live read-only and unavailable states", async () => {
    const user = userEvent.setup(); const props = createProps(); const replacement = vi.fn();
    const { rerender } = render(<DocumentEditorToolbar {...props} />);
    const bold = screen.getByRole("button", { name: "Bold" });
    bold.focus();
    rerender(<DocumentEditorToolbar {...props} canEdit={false} actions={{ ...props.actions, bold: { active: true, onClick: replacement } }} />);
    expect(screen.getByRole("button", { name: "Bold" })).toBe(bold);
    expect(bold.getAttribute("aria-pressed")).toBe("true");
    await user.keyboard("{Enter} "); expect(replacement).not.toHaveBeenCalled();
    rerender(<DocumentEditorToolbar {...props} actions={{ ...props.actions, bold: { active: true } }} showZoomControls={false} showAlignmentControls={false} />);
    expect((bold as HTMLButtonElement).disabled).toBe(true);
    rerender(<DocumentEditorToolbar {...props} actions={{ ...props.actions, bold: { active: true, onClick: replacement } }} />);
    await user.click(bold); expect(replacement).toHaveBeenCalledTimes(1);
    expect(props.actions.bold.onClick).not.toHaveBeenCalled();
    expect(bold.getAttribute("aria-pressed")).toBe("true");
  });

});
