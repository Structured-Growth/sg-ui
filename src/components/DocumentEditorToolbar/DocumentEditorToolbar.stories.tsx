import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Provider } from "../../experimental/Provider/Provider";
import { tokens } from "../../foundation/tokens.generated";
import { DocumentEditorToolbar } from "./DocumentEditorToolbar";

const meta = {
  title: "Components/DocumentEditorToolbar", component: DocumentEditorToolbar,
  args: {
    canEdit: true, headingValue: "normal", onHeadingChange: () => undefined,
    actions: {bold:{active:false,onClick:()=>undefined},italic:{active:false,onClick:()=>undefined},bulletList:{active:false,onClick:()=>undefined},orderedList:{active:false,onClick:()=>undefined}},
  },
  decorators: [(Story)=><Provider><div style={{padding:tokens.space2}}><Story /></div></Provider>],
  tags:["autodocs"],
} satisfies Meta<typeof DocumentEditorToolbar>;
export default meta;
type Story = StoryObj<typeof meta>;
function InteractivePreview() {
  const [heading,setHeading]=useState<"normal"|"h1"|"h2"|"h3"|"h4"|"h5">("normal");
  const [bold,setBold]=useState(false); const [italic,setItalic]=useState(false);
  const [bulletList,setBulletList]=useState(false); const [orderedList,setOrderedList]=useState(false); const [zoom,setZoom]=useState(100);
  return <DocumentEditorToolbar canEdit headingValue={heading} onHeadingChange={setHeading}
    actions={{bold:{active:bold,onClick:()=>setBold(value=>!value)},italic:{active:italic,onClick:()=>setItalic(value=>!value)},bulletList:{active:bulletList,onClick:()=>setBulletList(value=>!value)},orderedList:{active:orderedList,onClick:()=>setOrderedList(value=>!value)}}}
    onZoomIn={()=>setZoom(value=>value+10)} onZoomOut={()=>setZoom(value=>Math.max(50,value-10))} zoomValue={zoom} statusLabel="Last saved 2 minutes ago" />;
}
export const Interactive:Story={render:()=> <InteractivePreview />};
export const ReadOnly:Story={args:{canEdit:false,statusLabel:"Read-only"}};
export const UnavailableCommands:Story={args:{onHeadingChange:undefined,actions:{bold:{active:true},italic:{active:false},bulletList:{active:false},orderedList:{active:false}},showCustomComponentAction:true}};
export const CompactGroups:Story={args:{showZoomControls:false,showAlignmentControls:false,rightSlot:<span>Host status</span>}};
export const NarrowDark:Story={render:()=> <Provider theme="dark"><div style={{maxWidth:260,background:tokens.surface,color:tokens.text}}><InteractivePreview /></div></Provider>};
