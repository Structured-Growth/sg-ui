// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RichTextFormattingToolbar } from "./RichTextFormattingToolbar";
import { SGTranslationProvider } from "../../i18n";
import { Provider } from "../../experimental/Provider/Provider";
afterEach(cleanup);
describe("RichTextFormattingToolbar", () => {
  it("names actions, exposes controlled pressed states and activates once by pointer and keyboard without submitting", async () => {
    const user=userEvent.setup(); const submit=vi.fn(); const callbacks=Array.from({length:9},()=>vi.fn());
    render(<form onSubmit={submit}><RichTextFormattingToolbar onUndo={callbacks[0]} onRedo={callbacks[1]} onFontSizeDecrease={callbacks[2]} onFontSizeIncrease={callbacks[3]}
      onBold={callbacks[4]} onItalic={callbacks[5]} onUnderline={callbacks[6]} onCode={callbacks[7]} onLink={callbacks[8]} boldActive italicActive="mixed" /></form>);
    for (const name of ["Undo","Redo","Decrease font size","Increase font size","Bold","Italic","Underline","Inline code","Edit link"]) await user.click(screen.getByRole("button",{name}));
    callbacks.forEach(callback=>expect(callback).toHaveBeenCalledTimes(1)); expect(submit).not.toHaveBeenCalled();
    expect(screen.getByRole("button",{name:"Bold"}).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button",{name:"Italic"}).getAttribute("aria-pressed")).toBe("mixed");
    screen.getByRole("button",{name:"Bold"}).focus(); await user.keyboard(" "); expect(callbacks[4]).toHaveBeenCalledTimes(2);
    screen.getByRole("button",{name:"Edit link"}).focus(); await user.keyboard("{Enter}"); expect(callbacks[8]).toHaveBeenCalledTimes(2);
  });
  it("requests heading/font selections exactly once and preserves controlled values until the host updates", async () => {
    const user=userEvent.setup(); const heading=vi.fn(); const font=vi.fn();
    render(<RichTextFormattingToolbar onHeadingChange={heading} onFontFamilyChange={font} />);
    const trigger=screen.getByRole("button",{name:/Text style heading/}); await user.click(trigger);
    await user.click(screen.getByRole("option",{name:"Heading 3"})); expect(heading).toHaveBeenCalledExactlyOnceWith("Heading 3");
    await waitFor(()=>expect(document.activeElement).toBe(trigger)); expect(trigger.textContent).toContain("Normal");
    const fontTrigger=screen.getByRole("button",{name:/Font family/}); fontTrigger.focus(); await user.keyboard("{ArrowDown}{End}{Enter}");
    expect(font).toHaveBeenCalledExactlyOnceWith("Times New Roman"); await waitFor(()=>expect(document.activeElement).toBe(fontTrigger));
  });
  it("finishes keyboard selection before a host callback can move focus into its editor", async () => {
    const user=userEvent.setup(); const change=vi.fn(() => screen.getByRole("textbox",{name:"Host editor"}).focus());
    render(<><RichTextFormattingToolbar onFontFamilyChange={change} /><input aria-label="Host editor" defaultValue="Guide" /></>);
    await user.click(screen.getByRole("button",{name:/Font family/})); await user.keyboard("{ArrowDown}");
    const option=screen.getByRole("option",{name:"Georgia"});
    fireEvent.keyDown(option,{key:"Enter",code:"Enter"});
    expect(change).not.toHaveBeenCalled();
    fireEvent.keyUp(option,{key:"Enter",code:"Enter"});
    await waitFor(()=>expect(change).toHaveBeenCalledExactlyOnceWith("Georgia"));
    expect(document.activeElement).toBe(screen.getByRole("textbox",{name:"Host editor"}));
    expect((screen.getByRole("textbox",{name:"Host editor"}) as HTMLInputElement).value).toBe("Guide");
  });
  it("preserves pointer link preparation and makes keyboard activation independent of it", async () => {
    const user=userEvent.setup(); const prepare=vi.fn(); const link=vi.fn();
    render(<RichTextFormattingToolbar onLink={link} onLinkMouseDown={prepare} />);
    const trigger=screen.getByRole("button",{name:"Edit link"}); await user.click(trigger);
    expect(prepare).toHaveBeenCalledTimes(1); expect(link).toHaveBeenCalledTimes(1);
    trigger.focus(); await user.keyboard(" "); expect(link).toHaveBeenCalledTimes(2); expect(prepare).toHaveBeenCalledTimes(1);
  });
  it("honors hidden and disabled controls/sets and disables unavailable callbacks", async () => {
    const user=userEvent.setup(); const bold=vi.fn();
    render(<RichTextFormattingToolbar onBold={bold} disabledControls={{bold:true}} hiddenControlSets={{history:true,colors:true,insert:true}} showFontFamilySelector={false} showFontSizeControls={false} hiddenControls={{heading:true}} />);
    expect(screen.queryByRole("button",{name:"Undo"})).toBeNull(); expect(screen.queryByRole("button",{name:"Text color"})).toBeNull(); expect(screen.queryByRole("button",{name:/Font family/})).toBeNull();
    await user.click(screen.getByRole("button",{name:"Bold"})); expect(bold).not.toHaveBeenCalled();
    expect((screen.getByRole("button",{name:"Italic"}) as HTMLButtonElement).disabled).toBe(true);
  });
  it("composes checked styles, restricted indent and semantic color actions", async () => {
    const user=userEvent.setup(); const highlight=vi.fn(); const color=vi.fn(); const indent=vi.fn();
    render(<Provider theme="dark"><RichTextFormattingToolbar activeTextStyles={["highlight"]} onTextStyleHighlight={highlight} onIndent={indent} canIndent={false} onBackgroundColorChange={color} /></Provider>);
    await user.click(screen.getByRole("button",{name:"Text style"})); expect(screen.getByRole("menuitemcheckbox",{name:"Highlight"}).getAttribute("aria-checked")).toBe("true");
    await user.click(screen.getByRole("menuitemcheckbox",{name:"Highlight"})); expect(highlight).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole("button",{name:"Left Align"})); expect(screen.getByRole("menuitem",{name:/^Indent/}).getAttribute("aria-disabled")).toBe("true"); await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button",{name:"Background color"})); await user.click(screen.getByRole("button",{name:"Primary"})); expect(color).toHaveBeenCalledExactlyOnceWith("var(--sgui-action)");
  });
  it("forwards native root and slots and translates owned labels", () => {
    const ref=createRef<HTMLDivElement>(); const t=vi.fn((_key,options)=>`Translated ${options.defaultMessage}`);
    render(<SGTranslationProvider value={{t,useNamespace:()=>{}}}><RichTextFormattingToolbar ref={ref} className="host-toolbar" style={{marginInline:2}} leftSlot={<span>Left</span>} rightSlot={<span>Right</span>} /></SGTranslationProvider>);
    expect(ref.current).toBe(screen.getByRole("group",{name:"Translated Text formatting"})); expect(ref.current?.classList.contains("host-toolbar")).toBe(true);
    expect(screen.getByText("Left")).toBeTruthy(); expect(screen.getByText("Right")).toBeTruthy(); expect(screen.getByRole("button",{name:"Translated Undo"})).toBeTruthy();
  });
});
