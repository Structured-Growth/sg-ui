// @vitest-environment jsdom
import {afterEach,expect,it} from "vitest";
import {cleanup,fireEvent,render,screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {$createParagraphNode,$createTextNode,$getRoot} from "lexical";
import {LexicalComposer} from "@lexical/react/LexicalComposer";
import {DocumentContentEditable} from "./DocumentContentEditable";

afterEach(cleanup);
it("distinguishes pointer editing from keyboard navigation into the document",async()=>{
  const user=userEvent.setup();
  render(<><button>Before document</button><LexicalComposer initialConfig={{namespace:"document-focus",onError:error=>{throw error;}}}>
    <DocumentContentEditable label="Course document" readOnly={false}/>
  </LexicalComposer></>);
  const editor=screen.getByRole("textbox",{name:"Course document"});
  await user.click(editor);await user.keyboard("Editing text");
  expect(editor.hasAttribute("data-focus-visible")).toBe(false);
  await user.click(screen.getByRole("button",{name:"Before document"}));await user.tab();
  expect(document.activeElement).toBe(editor);expect(editor.getAttribute("data-focus-visible")).toBe("true");
  await user.keyboard("Typed after keyboard entry");
  expect(editor.hasAttribute("data-focus-visible")).toBe(false);
  await user.click(screen.getByRole("button",{name:"Before document"}));await user.tab();
  expect(editor.getAttribute("data-focus-visible")).toBe("true");
  await user.click(editor);expect(editor.hasAttribute("data-focus-visible")).toBe(false);
});

it("read-only local Select All yields to composition and ordinary editing keys",()=>{
  render(<LexicalComposer initialConfig={{namespace:"readonly-composition-boundary",editable:false,
    editorState:()=>{$getRoot().append($createParagraphNode().append($createTextNode("Copy this course text")));},
    onError:error=>{throw error;}}}>
    <DocumentContentEditable label="Read-only course document" readOnly/>
  </LexicalComposer>);
  const editor=screen.getByRole("textbox",{name:"Read-only course document"});
  editor.focus(); document.getSelection()?.removeAllRanges();
  // Synthetic boundary evidence only: this does not model OS conversion/candidate UI.
  expect(fireEvent.keyDown(editor,{key:"a",ctrlKey:true,isComposing:true})).toBe(true);
  expect(fireEvent.keyDown(editor,{key:"a",ctrlKey:true,keyCode:229})).toBe(true);
  expect(document.getSelection()?.toString()).toBe("");
  for(const key of ["Enter","Escape","Backspace","Delete","x"]){
    expect(fireEvent.keyDown(editor,{key,isComposing:true})).toBe(true);
  }
  expect(editor.textContent).toBe("Copy this course text");
  expect(fireEvent.keyDown(editor,{key:"a",ctrlKey:true})).toBe(false);
  expect(document.getSelection()?.toString()).toBe("Copy this course text");
  document.getSelection()?.removeAllRanges();
});
