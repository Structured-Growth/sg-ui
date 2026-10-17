import { expect, it } from "vitest";
import { prepareEditorDocument, isSafeEditorClipboardJSON } from "./prepareEditorDocument";
import { SAVED_RICH_DOCUMENT } from "../PageRichTextEditorSection.native-fixtures";
const document = (style: unknown = "") => ({ root: { type: "root", version: 1, children: [
 { type: "paragraph", version: 1, direction: null, format: "", indent: 0, children: [
  { type: "text", version: 1, text: "Preserved course", detail: 0, format: 1, mode: "normal", style },
 ] },
], direction: null, format: "", indent: 0 } });
it("admits registered saved content without changing original author JSON or safe text styles", () => {
 const original = JSON.stringify(SAVED_RICH_DOCUMENT);
 expect(prepareEditorDocument(SAVED_RICH_DOCUMENT)).toBe(original);
 expect(JSON.stringify(SAVED_RICH_DOCUMENT)).toBe(original);
 const safe = document('font-family: \"Noto; Sans\"; font-style: italic; font-weight: 600; font-size: 18px; color: var(--sgui-action); background-color: #abcdef; --lp-text-variant: bodyAlt2;');
 expect(prepareEditorDocument(safe)).toBe(JSON.stringify(safe));
});
it.each([
 'background-image: url(https://rejected-editor-style.example/pixel);',
 'background-image: u/**/rl(https://rejected-editor-style.example/pixel);',
 'background-image: \\75rl(https://rejected-editor-style.example/pixel);',
 'background-image: image-set("https://rejected-editor-style.example/pixel" 1x);',
 '--resource: url(https://rejected-editor-style.example/pixel); color: var(--resource);',
 'position: fixed; inset: 0; z-index: 99999;',
 'transform: translate(-100vw, -100vh);',
 'margin-left: -200vw;',
 'display: contents;',
 '--position: fixed; position: var(--position);',
 't\\72 ansform: translateX(100vw);',
 'font-family: A\\22; transform: translateX(100vw);',
 'po/**/sition: fixed;',
 'color #123456;',
 'color: var(--value, {position: fixed});',

])("rejects an active text style before mounting any DOM: %s", style => {
 const input = document(style); const original = JSON.stringify(input);
 expect(prepareEditorDocument(input)).toBeNull(); expect(JSON.stringify(input)).toBe(original);
});
it("rejects a partial document containing an unregistered node and malformed image fields", () => {
 const input = structuredClone(SAVED_RICH_DOCUMENT) as any;
 input.root.children.push({ type: "unregistered-host-node", version: 1 });
 expect(prepareEditorDocument(input)).toBeNull();
 input.root.children.pop(); input.root.children[8].children[0].assetId = { unexpected: true };
 expect(prepareEditorDocument(input)).toBeNull();
 expect(input.root.children[8].children[0].assetId).toEqual({ unexpected: true });
});
it("rejects unserializable and malformed structures without substituting an empty document", () => {
 const cycle: Record<string, unknown> = {}; cycle.root = cycle;
 for (const input of [cycle, { root: { type: "root", children: {} } }, document({ unexpected: true }), { root: { type: "root", children: [] } }]) {
  expect(prepareEditorDocument(input)).toBeNull();
 }
});

it("rejects inherited empty-paragraph textStyle before it can become newly typed text CSS", () => {
 const input = document() as any;
 input.root.children[0].children = [];
 input.root.children[0].textStyle = "position: fixed; inset: 0; background-image: url(https://rejected-editor-style.example/pixel)";
 const original = JSON.stringify(input);
 expect(prepareEditorDocument(input)).toBeNull(); expect(JSON.stringify(input)).toBe(original);
 input.root.children[0].textStyle = { unexpected: true };
 expect(prepareEditorDocument(input)).toBeNull();
 input.root.children[0].textStyle = "font-family: Georgia; color: var(--sgui-action);";
 expect(prepareEditorDocument(input)).toBe(JSON.stringify(input));
});

it.each(["script", "style", "iframe", "img", "x-host-widget", "h7"])("rejects serialized heading DOM tag %s before the engine can mount it", tag => {
 const input=structuredClone(SAVED_RICH_DOCUMENT) as any;input.root.children[0].tag=tag;
 const original=JSON.stringify(input);expect(prepareEditorDocument(input)).toBeNull();expect(JSON.stringify(input)).toBe(original);
});
it("rejects malformed text/link runtime fields that headless import alone could defer to DOM rendering", () => {
 const input=structuredClone(SAVED_RICH_DOCUMENT) as any;input.root.children[1].children[0].text={unexpected:true};
 expect(prepareEditorDocument(input)).toBeNull();
 input.root.children[1].children[0].text="Bold";input.root.children[2].children[0].url={unexpected:true};
 expect(prepareEditorDocument(input)).toBeNull();
});

it("applies the same typed formatting admission to native JSON clipboard nodes without rejecting valid copied text", () => {
 const namespace="experience-native-content-page";
 expect(isSafeEditorClipboardJSON(JSON.stringify({namespace,nodes:document().root.children}),namespace)).toBe(true);
 const unsafe=document() as any;unsafe.root.children[0].textStyle="transform: translateX(-100vw)";
 expect(isSafeEditorClipboardJSON(JSON.stringify({namespace,nodes:unsafe.root.children}),namespace)).toBe(false);
 expect(isSafeEditorClipboardJSON(JSON.stringify({namespace,nodes:[{type:"heading",version:1,tag:"script",children:[]}]}),namespace)).toBe(false);
 expect(isSafeEditorClipboardJSON("not JSON",namespace)).toBe(false);
 expect(isSafeEditorClipboardJSON(JSON.stringify({namespace:"foreign",nodes:unsafe.root.children}),namespace)).toBe(true);
});

it("preserves the built-in TabNode in saved content and selected JSON clipboard data", () => {
 const tab={type:"tab",version:1,text:"\t",detail:2,format:0,mode:"normal",style:""};
 const input=document() as any;input.root.children[0].children.push(tab);
 expect(prepareEditorDocument(input)).toBe(JSON.stringify(input));
 const namespace="experience-native-content-page";
 expect(isSafeEditorClipboardJSON(JSON.stringify({namespace,nodes:[tab]}),namespace)).toBe(true);
});
