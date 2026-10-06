import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ImagePayload, SerializedImageNode } from "./ImageNode";

const { applyNodeReplacementMock } = vi.hoisted(() => ({
  applyNodeReplacementMock: vi.fn((node: unknown) => node),
}));

vi.mock("lexical", async () => {
  const actual = await vi.importActual<typeof import("lexical")>("lexical");
  class MockDecoratorNode<T> {
    __key?: string;
    constructor(key?: string) {
      this.__key = key;
      void (null as T | null);
    }
  }
  return {
    ...actual,
    DecoratorNode: MockDecoratorNode,
    $applyNodeReplacement: (node: unknown) => applyNodeReplacementMock(node),
  };
});

describe("ImageNode", () => {
  beforeEach(() => {
    applyNodeReplacementMock.mockClear();
  });

  it("exports and clones image node data", async () => {
    const { ImageNode } = await import("./ImageNode");
    const node = new ImageNode(
      "https://cdn/image.webp",
      "Hero",
      1200,
      800,
      "asset-1",
      "ver-1",
      "key-1",
    );

    expect(ImageNode.getType()).toBe("image");
    expect(node.exportJSON()).toEqual({
      type: "image",
      version: 1,
      src: "https://cdn/image.webp",
      altText: "Hero",
      width: 1200,
      height: 800,
      assetId: "asset-1",
      assetVersionId: "ver-1",
    });

    const cloned = ImageNode.clone(node);
    expect(cloned).toBeInstanceOf(ImageNode);
    expect(cloned.__src).toBe("https://cdn/image.webp");
    expect(cloned.__altText).toBe("Hero");
    expect(cloned.__width).toBe(1200);
    expect(cloned.__height).toBe(800);
    expect(cloned.__assetId).toBe("asset-1");
    expect(cloned.__assetVersionId).toBe("ver-1");
    expect(cloned.__key).toBe("key-1");
  });

  it("creates DOM and decorate output", async () => {
    const { ImageNode } = await import("./ImageNode");
    vi.stubGlobal("document", {
      createElement: vi.fn(() => ({ tagName: "SPAN" })),
    });
    const node = new ImageNode("src.png", "Alt", null, null, null, null);
    expect(node.createDOM()).toEqual({ tagName: "SPAN" });
    expect(node.updateDOM()).toBe(false);
    const decorated = node.decorate({} as never) as any;
    expect(decorated.props.src).toBe("src.png");
    expect(decorated.props.altText).toBe("Alt");
    const renderedImageComponent = decorated.type(decorated.props);
    expect(renderedImageComponent.props.children.props.component).toBe("img");
    expect(renderedImageComponent.props.children.props.alt).toBe("Alt");
    expect(renderedImageComponent.props.children.props.src).toBe("src.png");
  });

  it("creates, imports, and type-guards image nodes with defaults", async () => {
    const {
      $createImageNode,
      $isImageNode,
      ImageNode,
    } = await import("./ImageNode");

    const payload: ImagePayload = { src: "https://cdn/default.png" };
    const created = $createImageNode(payload);
    expect(applyNodeReplacementMock).toHaveBeenCalledTimes(1);
    expect(created).toBeInstanceOf(ImageNode);
    expect((created as InstanceType<typeof ImageNode>).__altText).toBe("");
    expect((created as InstanceType<typeof ImageNode>).__width).toBeNull();
    expect((created as InstanceType<typeof ImageNode>).__height).toBeNull();
    expect((created as InstanceType<typeof ImageNode>).__assetId).toBeNull();
    expect((created as InstanceType<typeof ImageNode>).__assetVersionId).toBeNull();
    expect($isImageNode(created)).toBe(true);
    expect($isImageNode({})).toBe(false);

    const serialized: SerializedImageNode = {
      type: "image",
      version: 1,
      src: "https://cdn/serialized.png",
      altText: "Serialized",
      width: 400,
      height: 300,
      assetId: "asset-2",
      assetVersionId: "ver-2",
    };
    const imported = ImageNode.importJSON(serialized) as InstanceType<typeof ImageNode>;
    expect(imported.__src).toBe("https://cdn/serialized.png");
    expect(imported.__altText).toBe("Serialized");
    expect(imported.__width).toBe(400);
    expect(imported.__height).toBe(300);
    expect(imported.__assetId).toBe("asset-2");
    expect(imported.__assetVersionId).toBe("ver-2");
  });
});
