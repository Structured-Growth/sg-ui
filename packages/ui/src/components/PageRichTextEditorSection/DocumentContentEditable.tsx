"use client";
import { useState } from "react";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { useFocusRing } from "react-aria/useFocusRing";
import styles from "./PageRichTextEditorSection.module.css";

/** Private document interaction boundary; ordinary typing is not focus navigation. */
export function DocumentContentEditable({ label, readOnly }: { label: string; readOnly: boolean }) {
  const { focusProps, isFocusVisible } = useFocusRing({ isTextInput: true });
  const [isEditing, setIsEditing] = useState(false);
  return <ContentEditable onFocus={event => { setIsEditing(false); focusProps.onFocus?.(event); }}
    onBlur={event => { setIsEditing(false); focusProps.onBlur?.(event); }}
    onBeforeInput={() => { if (!readOnly) setIsEditing(true); }}
    onCompositionStart={() => { if (!readOnly) setIsEditing(true); }}
    className={styles.editable} tabIndex={0} data-focus-visible={isFocusVisible && !isEditing || undefined} aria-label={label}
    onKeyDown={event => {
      // Keyboard restoration from a toolbar should mark entry, then yield to
      // ordinary editing. React Aria's text-input modality keeps the entry ring
      // until blur unless this document boundary tracks that transition.
      if (!readOnly && !event.ctrlKey && !event.metaKey && !event.altKey
        && (event.key.length === 1 || ["Backspace", "Delete", "Enter"].includes(event.key))) {
        setIsEditing(true);
      }
      // A non-editable div has no native scoped Select All behavior.
      // Keep copying local to the focused read-only document; Lexical retains
      // keyboard handling while the document is editable.
      if (!readOnly || event.target !== event.currentTarget || event.isDefaultPrevented()
        || event.nativeEvent.isComposing || event.altKey || event.shiftKey
        || !(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "a") return;
      const selection = event.currentTarget.ownerDocument.getSelection();
      if (!selection) return;
      const range = event.currentTarget.ownerDocument.createRange();
      range.selectNodeContents(event.currentTarget);
      selection.removeAllRanges();
      selection.addRange(range);
      event.preventDefault();
    }} />;
}
