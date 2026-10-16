// @vitest-environment jsdom
import {afterEach,expect,it} from "vitest";
import {cleanup,render,screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
