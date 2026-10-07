// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { $createParagraphNode, $getRoot, createEditor } from "lexical";
import { $createImageNode, $isImageNode, ImageNode, type SerializedImageNode } from "./ImageNode";

const makeEditor = () => createEditor({ namespace: "image-node-test", nodes: [ImageNode], onError: error => { throw error; } });

describe("ImageNode in a real Lexical editor", () => {
  it("exports image metadata and preserves it when Lexical clones the node", () => {
    const editor = makeEditor();
    editor.update(() => {
      const node = $createImageNode({ src: "https://cdn/image.webp", altText: "Hero", width: 1200, height: 800, assetId: "asset-1", assetVersionId: "ver-1" });
      $getRoot().append($createParagraphNode().append(node));
      expect(ImageNode.getType()).toBe("image");
      expect(node.exportJSON()).toEqual({ type: "image", version: 1, src: "https://cdn/image.webp", altText: "Hero", width: 1200, height: 800, assetId: "asset-1", assetVersionId: "ver-1" });
      const cloned = ImageNode.clone(node);
      expect(cloned.exportJSON()).toEqual(node.exportJSON());
      expect(cloned.getKey()).toBe(node.getKey());
    }, { discrete: true });
    expect(editor.getEditorState().toJSON().root.children[0].children).toHaveLength(1);
  });

  it("creates a native DOM placeholder and an accessible owned image decoration", () => {
    const editor = makeEditor();
    editor.update(() => {
      const node = $createImageNode({ src: "/cover.png", altText: "Course cover", width: 800, height: 600, assetId: "asset", assetVersionId: "v1" });
      $getRoot().append($createParagraphNode().append(node));
      expect(node.createDOM()).toBeInstanceOf(HTMLSpanElement);
      expect(node.updateDOM()).toBe(false);
      const markup = renderToStaticMarkup(node.decorate(editor));
      expect(markup).toContain('data-sgui-part="editor-image"');
      expect(markup).toContain('<img alt="Course cover" src="/cover.png" class=');
      expect(markup).not.toContain("<style");
      // Stored metadata does not override responsive image sizing.
      expect(markup).not.toContain('width="800"');
      expect(markup).not.toContain('height="600"');
    }, { discrete: true });
  });

  it("creates defaults and imports serialized data through the registered node factory", () => {
    const editor = makeEditor();
    const serialized: SerializedImageNode = { type: "image", version: 1, src: "https://cdn/serialized.png", altText: "Serialized", width: 400, height: 300, assetId: "asset-2", assetVersionId: "ver-2" };
    editor.update(() => {
      const created = $createImageNode({ src: "https://cdn/default.png" });
      expect(created.exportJSON()).toEqual({ type: "image", version: 1, src: "https://cdn/default.png", altText: "", width: null, height: null, assetId: null, assetVersionId: null });
      expect($isImageNode(created)).toBe(true);
      expect($isImageNode($createParagraphNode())).toBe(false);
      expect($isImageNode(null)).toBe(false);
      const imported = ImageNode.importJSON(serialized);
      expect(imported.exportJSON()).toEqual(serialized);
      $getRoot().append($createParagraphNode().append(created, imported));
    }, { discrete: true });
    // Roundtrip invokes the real registered Lexical import path, preserving host metadata.
    const restored = editor.parseEditorState(JSON.stringify(editor.getEditorState().toJSON()));
    restored.read(() => {
      const nodes = $getRoot().getFirstChildOrThrow().getChildren();
      expect(nodes).toHaveLength(2);
      expect($isImageNode(nodes[1])).toBe(true);
      expect(nodes[1].exportJSON()).toEqual(serialized);
    });
  });
});
