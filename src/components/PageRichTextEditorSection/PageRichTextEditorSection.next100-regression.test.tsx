// @vitest-environment jsdom
import { createRef } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "../../theme";
import { PageRichTextEditorSection } from "./PageRichTextEditorSection";

afterEach(() => { cleanup(); document.getSelection()?.removeAllRanges(); });

function documentValue(text: string) {
  return { root: { type: "root", version: 1, direction: null, format: "", indent: 0, children: [
    { type: "paragraph", version: 1, direction: null, format: "", indent: 0, children: [
      { type: "text", version: 1, text, detail: 0, format: 0, mode: "normal", style: "" },
    ] },
  ] } };
}

it("isolates read-only Select All across mounted documents, replacement and native ref cleanup", async () => {
  const firstRef = createRef<HTMLDivElement>();
  const secondRef = createRef<HTMLDivElement>();
  const firstChange = vi.fn();
  const secondChange = vi.fn();
  const view = (key: string, text: string) => <Provider>
    <p>Outside host text</p>
    <PageRichTextEditorSection ref={firstRef} editorKey={key} lexicalValue={documentValue(text)} readOnly aria-label="First document" onLexicalChange={firstChange} />
    <PageRichTextEditorSection ref={secondRef} editorKey="second" lexicalValue={documentValue("Second content")} readOnly aria-label="Second document" onLexicalChange={secondChange} />
  </Provider>;
  const rendered = render(view("first", "First content"));
  const first = screen.getByRole("textbox", { name: "First document" });
  const second = screen.getByRole("textbox", { name: "Second document" });
  await waitFor(() => expect(first.textContent).toBe("First content"));
  expect(first.tabIndex).toBe(0);
  expect(second.tabIndex).toBe(0);
  expect(firstRef.current?.contains(first)).toBe(true);
  expect(secondRef.current?.contains(second)).toBe(true);
  firstChange.mockClear(); secondChange.mockClear();
  first.focus();
  expect(fireEvent.keyDown(first, { key: "a", ctrlKey: true })).toBe(false);
  expect(document.getSelection()?.toString()).toBe("First content");
  expect(first.contains(document.getSelection()!.anchorNode)).toBe(true);
  second.focus();
  expect(fireEvent.keyDown(second, { key: "A", metaKey: true })).toBe(false);
  expect(document.getSelection()?.toString()).toBe("Second content");
  expect(second.contains(document.getSelection()!.anchorNode)).toBe(true);
  expect(firstChange).not.toHaveBeenCalled();
  expect(secondChange).not.toHaveBeenCalled();

  rendered.rerender(view("replacement", "Replacement content"));
  const replacement = screen.getByRole("textbox", { name: "First document" });
  await waitFor(() => expect(replacement.textContent).toBe("Replacement content"));
  expect(replacement).not.toBe(first);
  expect(screen.getByRole("textbox", { name: "Second document" })).toBe(second);
  expect(second.textContent).toBe("Second content");
  replacement.focus();
  expect(fireEvent.keyDown(replacement, { key: "a", ctrlKey: true })).toBe(false);
  expect(document.getSelection()?.toString()).toBe("Replacement content");
  expect(firstRef.current?.contains(replacement)).toBe(true);
  expect(secondRef.current?.contains(second)).toBe(true);
  rendered.unmount();
  expect(firstRef.current).toBeNull();
  expect(secondRef.current).toBeNull();
});
