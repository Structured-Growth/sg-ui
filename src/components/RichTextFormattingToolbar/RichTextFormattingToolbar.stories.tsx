import { useState } from "react";
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
