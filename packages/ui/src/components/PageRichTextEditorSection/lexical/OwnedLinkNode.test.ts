// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { $createLinkNode, $isLinkNode } from "@lexical/link";
import { $createParagraphNode, $createTextNode, $getRoot, createEditor } from "lexical";
import { EXPERIENCE_EDITOR_NODES } from "./editorConfig";
import { serializeEditorDocument } from "./serializeEditorDocument";
import { OwnedLinkNode } from "./OwnedLinkNode";

const config = { namespace: "owned-link-test", nodes: EXPERIENCE_EDITOR_NODES, onError: (error: Error) => { throw error; } };
describe("owned link destinations", () => {
  it("updates the existing anchor through accepted, rejected and normalized destinations without changing rich children", () => {
    const root = document.createElement("div");
    const editor = createEditor(config);
    editor.setRootElement(root);
    editor.update(() => {
      $getRoot().append($createParagraphNode().append(
        $createLinkNode("/guide", { title: "Guide", target: "_blank", rel: "author" })
          .append($createTextNode("Rich guide").setFormat("bold"))));
    }, { discrete: true });
    const anchor = root.querySelector("a")!;
    const richChild = anchor.firstChild;
    for (const [url, destination] of [["javascript:alert(1)", "about:blank"], ["www.example.org/guide", "https://www.example.org/guide"], ["/restored", "/restored"]]) {
      editor.update(() => {
        $getRoot().getFirstChildOrThrow<import("lexical").ElementNode>().getFirstChild<OwnedLinkNode>()!.setURL(url);
      }, { discrete: true });
      expect(root.querySelector("a")).toBe(anchor);
      expect(anchor.firstChild).toBe(richChild);
      expect(anchor.getAttribute("href")).toBe(destination);
      expect(anchor.getAttribute("target")).toBe("_blank");
      expect(anchor.getAttribute("rel")).toBe("author");
      expect(anchor.getAttribute("title")).toBe("Guide");
      expect(serializeEditorDocument(editor.getEditorState().toJSON()).root.children[0]).toMatchObject({
        children: [expect.objectContaining({ type: "link", url, children: [expect.objectContaining({ text: "Rich guide", format: 1 })] })],
      });
    }
    editor.setRootElement(null);
  });

  it.each([['courses/guide', 'courses/guide'], ['?view=details', '?view=details'], ['#section', '#section'], ['/guide', '/guide'],
    ['www.example.org', 'https://www.example.org'], ['https://example.org', 'https://example.org'],
    ['mailto:teacher@example.org', 'mailto:teacher@example.org'], ['tel:+15551234567', 'tel:+15551234567'],
    ['javascript:alert(1)', 'about:blank'], ['sms:+15551234567', 'about:blank'], ['//example.org', 'about:blank'],
    ['java\nscript:alert(1)', 'about:blank'], ['https:\\example.org', 'about:blank']])("preserves saved children/metadata and governs rendered %s", (url, destination) => {
    const editor = createEditor(config);
    editor.update(() => {
      const link = $createLinkNode(url, { title: 'Guide', target: '_blank', rel: 'author' });
      expect(link).toBeInstanceOf(OwnedLinkNode);
      expect($isLinkNode(link)).toBe(true);
      link.append($createTextNode('Rich guide').setFormat('bold').setStyle('color: #123456;'));
      $getRoot().append($createParagraphNode().append(link));
    }, { discrete: true });
    const saved = serializeEditorDocument(editor.getEditorState().toJSON());
    expect(saved.root.children[0]).toMatchObject({ children: [expect.objectContaining({ children: [expect.objectContaining({ text: "Rich guide", format: 1, style: "color: #123456;" })] })] });
    const restored = editor.parseEditorState(JSON.stringify(saved));
    expect(serializeEditorDocument(restored.toJSON())).toEqual(saved);
    restored.read(() => {
      const link = $getRoot().getFirstChildOrThrow<import("lexical").ElementNode>().getFirstChild<OwnedLinkNode>()!;
      expect(link).toBeInstanceOf(OwnedLinkNode);
      expect(link.createDOM({ namespace: 'test', theme: {} }).getAttribute('href')).toBe(destination);
      expect(serializeEditorDocument(link.exportJSON())).toMatchObject({ type: 'link', url, target: '_blank', rel: 'author', title: 'Guide',
 });
    });
  });

});
