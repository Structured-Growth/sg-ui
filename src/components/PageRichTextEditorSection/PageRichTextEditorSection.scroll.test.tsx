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
  if (!readOnly) {
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Document" }));
  }
});
