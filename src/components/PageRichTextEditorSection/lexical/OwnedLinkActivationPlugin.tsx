"use client";
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isLinkNode } from "@lexical/link";
import { $findMatchingParent } from "@lexical/utils";
import { $getNearestNodeFromDOMNode, $getSelection, $isRangeSelection, getNearestEditorFromDOMNode, type LexicalEditor } from "lexical";
import { normalizeLinkUrl } from "../../LinkUrlModal/linkUrlPolicy";

/** Preserve the editor's new-tab activation while isolating the opened document. */
export function registerOwnedLinkActivation(editor: LexicalEditor) {
  const activate = (event: MouseEvent) => {
    if (event.defaultPrevented || (event.type === "click" ? event.button !== 0 : event.button !== 1)) return;
    const target = event.target;
    const root = editor.getRootElement();
    const view = root?.ownerDocument.defaultView;
    if (!view || !(target instanceof view.Node) || getNearestEditorFromDOMNode(target) !== editor) return;
    const result = editor.read(() => {
      const node = $getNearestNodeFromDOMNode(target);
      const link = node && $findMatchingParent(node, $isLinkNode);
      if (!$isLinkNode(link)) return null;
      const selection = $getSelection();
      return { url: normalizeLinkUrl(link.getURL()), selected: $isRangeSelection(selection) && !selection.isCollapsed() };
    });
    if (!result) return;
    // Selection gestures and rejected saved URLs must never fall through to native navigation.
    event.preventDefault();
    if (result.selected || !result.url) return;
    view.open(result.url, "_blank", "noopener,noreferrer");
  };
  return editor.registerRootListener((root, previous) => {
    previous?.removeEventListener("click", activate);
    previous?.removeEventListener("auxclick", activate);
    root?.addEventListener("click", activate);
    root?.addEventListener("auxclick", activate);
  });
}

export function OwnedLinkActivationPlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => registerOwnedLinkActivation(editor), [editor]);
  return null;
}
