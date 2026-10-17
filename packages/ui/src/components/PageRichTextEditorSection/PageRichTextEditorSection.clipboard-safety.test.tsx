// @vitest-environment jsdom
import { useEffect } from "react";
import { afterAll, afterEach, beforeAll, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { $getRoot, $getSelection, $isRangeSelection, PASTE_COMMAND, type LexicalEditor } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Provider } from "../../experimental/Provider/Provider";
import { PageRichTextEditorSection } from "./PageRichTextEditorSection.impl";
import { serializeEditorDocument } from "./lexical/serializeEditorDocument";
let editor:LexicalEditor|undefined;
function Capture(){const[current]=useLexicalComposerContext();useEffect(()=>{editor=current;},[current]);return null;}
vi.mock("./lexical/ExperienceEditorPlugins",async()=>{const actual=await vi.importActual<typeof import("./lexical/ExperienceEditorPlugins")>("./lexical/ExperienceEditorPlugins");return{ExperienceEditorPlugins:(props:{onChange:(value:unknown)=>void})=><><Capture/><actual.ExperienceEditorPlugins {...props}/></>};});
vi.mock("../FloatingTextSelectionToolbar",()=>({FloatingTextSelectionToolbar:()=>null}));
const original=Range.prototype.getBoundingClientRect;
beforeAll(()=>{
 Range.prototype.getBoundingClientRect=()=>new DOMRect(0,0,0,0);
 // jsdom omits these constructors used by the real engine's clipboard dispatch.
 if(typeof DragEvent==="undefined")vi.stubGlobal("DragEvent",class DragEvent extends Event{});
 if(typeof ClipboardEvent==="undefined")vi.stubGlobal("ClipboardEvent",class ClipboardEvent extends Event{});
});
afterAll(()=>{vi.unstubAllGlobals();if(original)Range.prototype.getBoundingClientRect=original;else delete(Range.prototype as Partial<Range>).getBoundingClientRect;});
afterEach(()=>{cleanup();editor=undefined;});
const paragraph=(text:string)=>({type:"paragraph",version:1,direction:null,format:"",indent:0,children:[{type:"text",version:1,text,detail:0,format:0,mode:"normal",style:""}]});
it("rejects unsafe same-namespace clipboard JSON atomically, then allows an ordinary safe paste",async()=>{
 const change=vi.fn();const input={root:{type:"root",version:1,direction:null,format:"",indent:0,children:[paragraph("Course")]}};
 render(<Provider><PageRichTextEditorSection lexicalValue={input} editorKey="clipboard" onLexicalChange={change}/></Provider>);
 await waitFor(()=>expect(editor).toBeTruthy());await act(async()=>{editor!.getRootElement()!.focus();editor!.update(()=>{$getRoot().selectEnd();},{discrete:true});});
 const selection=()=>editor!.getEditorState().read(()=>{const value=$getSelection();return $isRangeSelection(value)?{anchor:value.anchor.key,anchorOffset:value.anchor.offset,focus:value.focus.key,focusOffset:value.focus.offset}:null;});
 const selected=selection();expect(selected).not.toBeNull();
 const saved=()=>serializeEditorDocument(editor!.getEditorState().toJSON());const before=saved();change.mockClear();
 const unsafe={...paragraph("Blocked"),textStyle:"position:fixed;background-image:url(https://rejected-editor-style.example/pixel)"};
 const event=(nodes:unknown[])=>({clipboardData:{getData:(type:string)=>type==="application/x-lexical-editor"?JSON.stringify({namespace:"experience-native-content-page",nodes}):""},preventDefault:vi.fn()}) as unknown as ClipboardEvent;
 const blocked=event([unsafe]);await act(async()=>{expect(editor!.dispatchCommand(PASTE_COMMAND,blocked)).toBe(true);});
 expect(selection()).toEqual(selected);
 expect(blocked.preventDefault).toHaveBeenCalledTimes(1);expect(saved()).toEqual(before);expect(change).not.toHaveBeenCalled();
 expect(screen.getByRole("alert").textContent).toBe("This pasted content could not be inserted safely. The document has not been changed.");
 expect(screen.getByRole("textbox").textContent).toBe("Course");
 const accepted=event([paragraph(" Safe pasted")]);await act(async()=>{expect(editor!.dispatchCommand(PASTE_COMMAND,accepted)).toBe(true);});
 await waitFor(()=>expect(screen.queryByRole("alert")).toBeNull());expect(screen.getByRole("textbox").textContent).toContain("Safe pasted");
 expect(change).toHaveBeenLastCalledWith(saved());
});
