import type { JSX } from "react";
import type { LexicalEditor, NodeKey, SerializedLexicalNode, Spread } from "lexical";
import { DecoratorNode, $applyNodeReplacement } from "lexical";
import { Box } from "../../primitives";

export type SerializedImageNode = Spread<{
  type: "image";
  version: 1;
  src: string;
  altText: string;
  width: number | null;
  height: number | null;
  assetId: string | null;
  assetVersionId: string | null;
}, SerializedLexicalNode>;

export type ImagePayload = {
  src: string;
  altText?: string;
  width?: number | null;
  height?: number | null;
  assetId?: string | null;
  assetVersionId?: string | null;
};

type ImageComponentProps = {
  altText: string;
  src: string;
};

function ImageComponent({ altText, src }: ImageComponentProps) {
  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        my: 1,
      }}
    >
      <Box
        alt={altText}
        component="img"
        src={src}
        sx={{
          borderRadius: 1,
          display: "block",
          height: "auto",
          maxWidth: "100%",
        }}
      />
    </Box>
  );
}

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __width: number | null;
  __height: number | null;
  __assetId: string | null;
  __assetVersionId: string | null;

  static getType() {
    return "image";
  }

  static clone(node: ImageNode) {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__width,
      node.__height,
      node.__assetId,
      node.__assetVersionId,
      node.__key,
    );
  }

  static importJSON(serializedNode: SerializedImageNode) {
    return $createImageNode({
      src: serializedNode.src,
      altText: serializedNode.altText,
      width: serializedNode.width,
      height: serializedNode.height,
      assetId: serializedNode.assetId,
      assetVersionId: serializedNode.assetVersionId,
    });
  }

  constructor(
    src: string,
    altText: string,
    width: number | null,
    height: number | null,
    assetId: string | null,
    assetVersionId: string | null,
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width;
    this.__height = height;
    this.__assetId = assetId;
    this.__assetVersionId = assetVersionId;
  }

  exportJSON(): SerializedImageNode {
    return {
      type: "image",
      version: 1,
      src: this.__src,
      altText: this.__altText,
      width: this.__width,
      height: this.__height,
      assetId: this.__assetId,
      assetVersionId: this.__assetVersionId,
    };
  }

  createDOM(): HTMLElement {
    return document.createElement("span");
  }

  updateDOM(): false {
    return false;
  }

  decorate(editor: LexicalEditor): JSX.Element {
    void editor;
    return <ImageComponent altText={this.__altText} src={this.__src} />;
  }
}

export function $createImageNode(payload: ImagePayload) {
  const imageNode = new ImageNode(
    payload.src,
    payload.altText ?? "",
    payload.width ?? null,
    payload.height ?? null,
    payload.assetId ?? null,
    payload.assetVersionId ?? null,
  );
  return $applyNodeReplacement(imageNode);
}

export function $isImageNode(node: unknown): node is ImageNode {
  return node instanceof ImageNode;
}
