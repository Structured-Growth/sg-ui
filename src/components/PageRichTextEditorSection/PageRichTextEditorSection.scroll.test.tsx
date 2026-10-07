// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "../../experimental/Provider/Provider";
import { PageRichTextEditorSection } from "./PageRichTextEditorSection";

afterEach(cleanup);
it.each([false, true])("keeps the document scroll region named and keyboard focusable when readOnly=%s", async readOnly => {
  const user = userEvent.setup();
  render(<Provider><PageRichTextEditorSection editorKey="keyboard-scroll" lexicalValue={null} onLexicalChange={() => {}} readOnly={readOnly} /></Provider>);
  const viewport = screen.getByRole("region", { name: "Document scroll region" });
  expect(viewport.tabIndex).toBe(0);
  viewport.focus();
  expect(document.activeElement).toBe(viewport);
  await user.tab();
  expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Document" }));
});

it.each(['Control', 'Meta'])("scopes read-only %s+A selection to document content", async modifier => {
  const user = userEvent.setup();
  render(<Provider><p>Host content outside editor</p><PageRichTextEditorSection editorKey="read-only-copy" lexicalValue={{ root: {
    type: 'root', version: 1, children: [{ type: 'paragraph', version: 1, children: [{
      type: 'text', version: 1, text: 'Copy only this course', format: 0, detail: 0, mode: 'normal', style: '',
    }], direction: null, format: '', indent: 0 }], direction: null, format: '', indent: 0,
  } }} onLexicalChange={() => {}} readOnly /></Provider>);
  const editor = screen.getByRole('textbox', { name: 'Document' });
  editor.focus();
  await user.keyboard(`{${modifier}>}a{/${modifier}}`);
  expect(document.getSelection()?.toString()).toBe('Copy only this course');
  expect(editor.contains(document.getSelection()?.anchorNode ?? null)).toBe(true);
  expect(document.activeElement).toBe(editor);
  await user.keyboard('Rejected edit');
  expect(editor.textContent).toBe('Copy only this course');
});
