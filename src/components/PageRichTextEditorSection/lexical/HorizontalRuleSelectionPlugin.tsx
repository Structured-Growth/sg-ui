"use client";
import { $isHorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isNodeSelection,
  COMMAND_PRIORITY_EDITOR,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
} from "lexical";
import { useEffect } from "react";

function deleteSelectedHorizontalRules(): boolean {
  const selection = $getSelection();
  if (!$isNodeSelection(selection)) {
    return false;
  }

  const selectedNodes = selection.getNodes().filter((node) => $isHorizontalRuleNode(node));
  if (selectedNodes.length === 0) {
    return false;
  }

  for (const node of selectedNodes) {
    node.remove();
  }
  return true;
}

export function HorizontalRuleSelectionPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_BACKSPACE_COMMAND,
      () => deleteSelectedHorizontalRules(),
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      KEY_DELETE_COMMAND,
      () => deleteSelectedHorizontalRules(),
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
