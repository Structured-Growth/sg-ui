import { LinkNode, type SerializedLinkNode } from "@lexical/link";
import { $applyNodeReplacement } from "lexical";
import { normalizeLinkUrl } from "../../LinkUrlModal/linkUrlPolicy";

/** Keep the saved `link` schema while owning the browser destination policy. */
export class OwnedLinkNode extends LinkNode {
  static getType(): string { return "sgui-link"; }

  static clone(node: OwnedLinkNode): OwnedLinkNode {
    return new OwnedLinkNode(node.__url, { target: node.__target, rel: node.__rel, title: node.__title }, node.__key);
  }

  static importJSON(serialized: SerializedLinkNode): OwnedLinkNode {
    return $applyNodeReplacement(new OwnedLinkNode()).updateFromJSON(serialized);
  }

  sanitizeUrl(url: string): string {
    return normalizeLinkUrl(url) ?? "about:blank";
  }
}
