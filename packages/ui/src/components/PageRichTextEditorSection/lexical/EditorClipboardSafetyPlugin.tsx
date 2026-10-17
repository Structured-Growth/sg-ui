import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { COMMAND_PRIORITY_HIGH, PASTE_COMMAND } from "lexical";
import { isSafeEditorClipboardJSON } from "./prepareEditorDocument";

export function EditorClipboardSafetyPlugin({ namespace, onRejectionChange }: {
  namespace: string;
  onRejectionChange: (rejected: boolean) => void;
}) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => editor.registerCommand(PASTE_COMMAND, event => {
    if (!editor.isEditable() || !event || !("clipboardData" in event) || !event.clipboardData) return false;
    const rejected = !isSafeEditorClipboardJSON(event.clipboardData.getData("application/x-lexical-editor"), namespace);
    onRejectionChange(rejected);
    if (!rejected) return false;
    event.preventDefault(); return true;
  }, COMMAND_PRIORITY_HIGH), [editor, namespace, onRejectionChange]);
  return null;
}
