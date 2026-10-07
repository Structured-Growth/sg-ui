import { useRef, useState, type SyntheticEvent } from "react";
import { flushSync } from "react-dom";
import { Button } from "../../experimental/Button/Button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { tokens } from "../../foundation/tokens.generated";
import { Provider } from "../../experimental/Provider/Provider";
import { RichTextFormattingToolbar, type RichTextHeadingValue } from "./RichTextFormattingToolbar";
const meta = { title: "Editors/RichTextFormattingToolbar", component: RichTextFormattingToolbar, tags: ["autodocs"],
  decorators: [Story => <Provider><Story /></Provider>],
} satisfies Meta<typeof RichTextFormattingToolbar>;
export default meta;
type Story = StoryObj<typeof meta>;
function InteractiveToolbar() {
  const [heading, setHeading] = useState<RichTextHeadingValue>("Normal"); const [font, setFont] = useState("Arial");
  const [size, setSize] = useState(15); const [bold, setBold] = useState(false); const [result, setResult] = useState("");
  return <><RichTextFormattingToolbar headingValue={heading} onHeadingChange={setHeading} fontFamilyValue={font} onFontFamilyChange={setFont}
    fontSizeValue={size} onFontSizeDecrease={()=>setSize(value=>value-1)} onFontSizeIncrease={()=>setSize(value=>value+1)}
    boldActive={bold} onBold={()=>setBold(value=>!value)} italicActive="mixed" onItalic={()=>setResult("Italic")}
    onUndo={()=>setResult("Undo")} onRedo={()=>setResult("Redo")} onUnderline={()=>setResult("Underline")} onCode={()=>setResult("Code")}
    onLink={()=>setResult("Link")} onTextColorChange={setResult} onBackgroundColorChange={setResult} onAlignmentChange={setResult}
    activeTextStyles={["highlight"]} onTextStyleHighlight={()=>setResult("Highlight")} onTextStyleClearFormatting={()=>setResult("Clear")}
    onInsertImage={()=>setResult("Image")} /><p role="status">{result || `${heading}, ${font}, ${size}`}</p></>;
}
export const Default: Story = { render: () => <InteractiveToolbar /> };
export const UnavailableCommands: Story = { render: () => <RichTextFormattingToolbar /> };
export const DisabledControls: Story = { render: () => <RichTextFormattingToolbar onBold={()=>{}} onItalic={()=>{}} disabledControls={{ bold:true, italic:true, textColor:true }} disabledControlSets={{history:true,insert:true}} /> };
export const NoFontSelectors: Story = { render: () => <RichTextFormattingToolbar showFontFamilySelector={false} showFontSizeControls={false} /> };
export const NarrowDark: Story = { render: () => <Provider theme="dark"><div style={{maxWidth:260,background:tokens.surface,color:tokens.text}}><InteractiveToolbar /></div></Provider> };

// The host replaces its command owner after chooser commit, before deferred delivery.
function ReplacedCommandOwner() {
  const [mode, setMode] = useState<"replace" | "remove" | "disable">("replace");
  const [replaced, setReplaced] = useState(false);
  const [result, setResult] = useState("Waiting for a request");
  const editor = useRef<HTMLDivElement>(null);
  const replaceAfterCommit = (event: SyntheticEvent) => {
    if (!(event.target instanceof Element) || !event.target.closest('[role="option"]')) return;
    queueMicrotask(() => flushSync(() => setReplaced(true)));
  };
  const request = (value: string) => {
    setResult(`${replaced ? "Current" : "Previous"} owner: ${value}`);
    editor.current?.focus();
  };
  return <div onPointerUpCapture={replaceAfterCommit} onKeyDownCapture={event => { if (event.key === "Enter") replaceAfterCommit(event); }}>
    <div>{(["replace", "remove", "disable"] as const).map(value => <Button key={value} onPress={() => { setMode(value); setReplaced(false); setResult("Waiting for a request"); }}>
      {value === "replace" ? "Replace callback" : value === "remove" ? "Remove callback" : "Disable controls"}
    </Button>)}</div>
    <RichTextFormattingToolbar onHeadingChange={replaced && mode === "remove" ? undefined : request}
      onFontFamilyChange={replaced && mode === "remove" ? undefined : request}
      disabledControlSets={{ heading: replaced && mode === "disable", fontFamily: replaced && mode === "disable" }} />
    <p aria-label="Command owner">{replaced ? "Current owner" : "Previous owner"}</p>
    <p role="status">{result}</p>
    <div ref={editor} role="textbox" aria-label="Host editor" contentEditable suppressContentEditableWarning>Guide</div>
  </div>;
}
export const CallbackReplacement: Story = { render: () => <ReplacedCommandOwner /> };
