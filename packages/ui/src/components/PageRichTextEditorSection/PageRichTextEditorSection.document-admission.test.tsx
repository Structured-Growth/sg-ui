// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "../../experimental/Provider/Provider";
import { PageRichTextEditorSection } from "./PageRichTextEditorSection.impl";
import { SAVED_RICH_DOCUMENT } from "./PageRichTextEditorSection.native-fixtures";
afterEach(cleanup);
it("never emits partial saved content for a rejected load and recovers only on a new document key", () => {
 const change = vi.fn();
 const bad = structuredClone(SAVED_RICH_DOCUMENT) as any;
 bad.root.children.push({ type: "unknown-host-widget", version: 1 });
 const original = JSON.stringify(bad);
 const view = (value: unknown, key: string) => <Provider><PageRichTextEditorSection lexicalValue={value} editorKey={key} onLexicalChange={change} /></Provider>;
 const rendered = render(view(bad, "rejected"));
 expect(screen.getByRole("alert").textContent).toBe("This document could not be loaded safely. The original content has not been changed.");
 expect(screen.queryByRole("textbox")).toBeNull();
 expect(screen.queryByRole("group", { name: "Text formatting" })).toBeNull();
 expect(change).not.toHaveBeenCalled(); expect(JSON.stringify(bad)).toBe(original);
 rendered.rerender(view(SAVED_RICH_DOCUMENT, "rejected"));
 expect(screen.getByRole("alert")).toBeTruthy(); expect(change).not.toHaveBeenCalled();
 rendered.rerender(view(SAVED_RICH_DOCUMENT, "recovered"));
 expect(screen.queryByRole("alert")).toBeNull();
 expect(screen.getByRole("textbox").textContent).toContain("Saved course guide");
 expect(change).not.toHaveBeenCalled(); expect(JSON.stringify(bad)).toBe(original);
});
it("does not fetch or mount resource-bearing saved text styles", () => {
 const change = vi.fn(); const bad = structuredClone(SAVED_RICH_DOCUMENT) as any;
 bad.root.children[1].children[0].style = 'background-image: url(https://rejected-editor-style.example/pixel)';
 render(<Provider><PageRichTextEditorSection lexicalValue={bad} editorKey="style-rejected" onLexicalChange={change} /></Provider>);
 expect(screen.getByRole("alert")).toBeTruthy(); expect(screen.queryByRole("textbox")).toBeNull();
 expect(document.querySelector('[style*="rejected-editor-style"]')).toBeNull(); expect(change).not.toHaveBeenCalled();
});

it("does not mount an empty paragraph whose inherited typing style would activate layout or resources", () => {
 const change=vi.fn();const input={root:{type:"root",version:1,direction:null,format:"",indent:0,children:[
  {type:"paragraph",version:1,direction:null,format:"",indent:0,children:[],textStyle:"position: fixed; background-image: url(https://rejected-editor-style.example/pixel)"},
 ]}};
 const original=JSON.stringify(input);
 render(<Provider><PageRichTextEditorSection lexicalValue={input} editorKey="typing-style" onLexicalChange={change}/></Provider>);
 expect(screen.getByRole("alert")).toBeTruthy();expect(screen.queryByRole("textbox")).toBeNull();
 expect(change).not.toHaveBeenCalled();expect(JSON.stringify(input)).toBe(original);
});
