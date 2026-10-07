"use client";
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createParagraphNode, $getSelection, $isRangeSelection, COMMAND_PRIORITY_EDITOR, createCommand } from "lexical";
import { $createImageNode, type ImagePayload } from "./ImageNode";

export const INSERT_IMAGE_COMMAND = createCommand<ImagePayload>("INSERT_IMAGE_COMMAND");

export function ImageInsertPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) {
            return;
          }
          const imageNode = $createImageNode(payload);
          selection.insertNodes([imageNode, $createParagraphNode()]);
        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
