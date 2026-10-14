import { describe, expect, it } from "vitest";
import { serializeEditorDocument } from "./serializeEditorDocument";

function freezeDocument<T>(value: T): T {
  if (value && typeof value === "object") {
    Object.values(value).forEach(freezeDocument);
    Object.freeze(value);
  }
  return value;
}

const text = { type: "text", version: 1, text: "Rich guide", format: 3, style: "color: #123456;" };
const link = { type: "sgui-link", version: 1, url: "javascript:alert(1)", target: "_blank", rel: "author", title: "Guide", children: [text] };

describe("saved document serialization", () => {
  it("converts nested owned links along root/children while preserving saved fields", () => {
    const input = { root: { type: "root", version: 1, children: [
      { type: "table", children: [{ type: "tablerow", children: [
        { type: "tablecell", children: [{ type: "paragraph", children: [link] }] },
      ] }] },
      { type: "list", children: [{ type: "listitem", children: [link] }] },
      { type: "paragraph", children: [{ ...link, type: "link" }, { type: "autolink", url: "/guide", children: [text] }] },
    ] } };
    const expected = JSON.parse(JSON.stringify(input));
    expected.root.children[0].children[0].children[0].children[0].children[0].type = "link";
    expected.root.children[1].children[0].children[0].type = "link";

    expect(serializeEditorDocument(input)).toEqual(expected);
    expect(serializeEditorDocument(link)).toEqual({ ...link, type: "link" });
  });

  it("accepts deeply frozen host JSON without mutating nodes or children arrays", () => {
    const input = freezeDocument({ root: { type: "root", children: [{ type: "paragraph", children: [link] }] } });
    const before = JSON.stringify(input);
    const output = serializeEditorDocument(input);

    expect(JSON.stringify(input)).toBe(before);
    expect(input.root.children[0].children[0].type).toBe("sgui-link");
    expect(output.root.children[0].children[0]).toEqual({ ...link, type: "link" });
    expect(output).not.toBe(input);
    expect(output.root).not.toBe(input.root);
    expect(output.root.children).not.toBe(input.root.children);
    expect(output.root.children[0].children).not.toBe(input.root.children[0].children);
    expect(output.root.children[0].children[0]).not.toBe(link);
  });

  it("preserves opaque asset metadata even when it resembles a document", () => {
    const asset = freezeDocument({
      type: "sgui-link",
      root: { type: "sgui-link", children: [link] },
      children: [link, { type: "image", root: { children: [link] } }],
      nested: { type: "sgui-link", children: [link] },
      assetId: "asset-42", assetVersionId: "version-7", dimensions: { width: 640, height: 480 },
    });
    const input = freezeDocument({
      metadata: asset,
      root: { type: "root", metadata: asset, children: [
        { type: "image", src: "/cover.png", altText: "Course cover", asset, assetId: "asset-42" },
        { ...link, asset, extra: { type: "sgui-link", root: asset, children: [link] } },
      ] },
    });
    const output = serializeEditorDocument(input);

    expect(output).toEqual({ ...input, root: { ...input.root, children: [
      input.root.children[0], { ...input.root.children[1], type: "link" },
    ] } });
    expect(output.metadata).toBe(asset);
    expect(output.root.metadata).toBe(asset);
    expect(output.root.children[0].asset).toBe(asset);
    expect(output.root.children[1].extra).toBe(input.root.children[1].extra);
  });

  it("retains arrays, unknown node types, primitive values and non-array children", () => {
    const input = freezeDocument([
      null, false, 0, "sgui-link", undefined,
      { type: "host-widget", version: 9, children: [link, null, [link]], custom: { type: "sgui-link" } },
      { type: "host-leaf", children: { type: "sgui-link" } },
      { type: "future-link", children: [] },
    ]);
    expect(serializeEditorDocument(input)).toEqual([
      null, false, 0, "sgui-link", undefined,
      { type: "host-widget", version: 9, children: [{ ...link, type: "link" }, null, [{ ...link, type: "link" }]], custom: { type: "sgui-link" } },
      { type: "host-leaf", children: { type: "sgui-link" } },
      { type: "future-link", children: [] },
    ]);
    expect(serializeEditorDocument({ root: null, children: null })).toEqual({ root: null, children: null });
  });

  it("keeps the public schema and opaque metadata stable after a JSON roundtrip", () => {
    const input = freezeDocument({ root: { type: "root", version: 1, children: [
      { type: "paragraph", children: [link] },
      { type: "image", src: "/cover.png", asset: { type: "sgui-link", root: { children: [link] } } },
    ] } });
    const serialized = serializeEditorDocument(input);
    const restored = JSON.parse(JSON.stringify(serialized));

    expect(restored.root.children[0].children[0]).toEqual({ ...link, type: "link" });
    expect(restored.root.children[1]).toEqual(input.root.children[1]);
    expect(serializeEditorDocument(restored)).toEqual(serialized);
    expect(JSON.stringify(serializeEditorDocument(restored))).toBe(JSON.stringify(serialized));
  });
});
