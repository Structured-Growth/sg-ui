import { useEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppButton } from "../AppButton";
import { Typography } from "../../primitives";
import { TextStyleMenuControl, type TextStyleId } from "./TextStyleMenuControl";
import styles from "./NativeSelection.module.css";

const meta = { title: "Editors/TextStyleMenuControl", component: TextStyleMenuControl } satisfies Meta<typeof TextStyleMenuControl>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Example host adapter, intentionally independent of Lexical and editor internals. */
function NativeSelectionHost() {
  const editor = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);
  const restoreFrame = useRef<number | null>(null);
  const [activeStyles, setActiveStyles] = useState<TextStyleId[]>([]);
  const [requests, setRequests] = useState<string[]>([]);
  const [replacement, setReplacement] = useState(false);
  const [limited, setLimited] = useState(false);
  const [accept, setAccept] = useState(true);

  useEffect(() => {
    const capture = () => {
      const selection = window.getSelection();
      if (selection?.rangeCount && !selection.isCollapsed && editor.current?.contains(selection.anchorNode) && editor.current.contains(selection.focusNode)) {
        savedRange.current = selection.getRangeAt(0).cloneRange();
      }
    };
    const replace = (event: KeyboardEvent) => {
      if (event.key === "F2") {
        event.preventDefault();
        setReplacement(current => !current);
        setActiveStyles(["highlight"]);
      }
      if (event.key === "F3") {
        event.preventDefault();
        setLimited(current => !current);
      }
    };
    document.addEventListener("selectionchange", capture);
    document.addEventListener("keydown", replace);
    return () => {
      document.removeEventListener("selectionchange", capture);
      document.removeEventListener("keydown", replace);
      if (restoreFrame.current !== null) cancelAnimationFrame(restoreFrame.current);
    };
  }, []);

  const restore = () => {
    if (restoreFrame.current !== null) cancelAnimationFrame(restoreFrame.current);
    // The host restores only after the command's menu dismissal has committed.
    // Escape leaves focus on the trigger; the explicit Return action restores it.
    restoreFrame.current = requestAnimationFrame(() => {
      restoreFrame.current = null;
      if (!editor.current || !savedRange.current) return;
      editor.current.focus();
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(savedRange.current);
    });
  };
  const command = (id: TextStyleId | "clear") => {
    const range = savedRange.current;
    if (!range || !editor.current?.contains(range.commonAncestorContainer) || range.toString() !== editor.current.textContent) return;
    setRequests(current => [...current, `${replacement ? "replacement" : "original"}:${id}:${range.toString()}`]);
    if (accept) {
      const next = id === "clear" ? [] : activeStyles.includes(id) ? activeStyles.filter(value => value !== id) : [
        ...activeStyles.filter(value => !(["lowercase", "uppercase", "capitalize"].includes(id) && ["lowercase", "uppercase", "capitalize"].includes(value)) && !(["subscript", "superscript"].includes(id) && ["subscript", "superscript"].includes(value))), id,
      ];
      let text = range.toString();
      if (id === "lowercase") text = text.toLowerCase();
      if (id === "uppercase") text = text.toUpperCase();
      if (id === "capitalize") text = text.toLowerCase().replace(/\b\w/g, character => character.toUpperCase());
      const fragment = document.createElement("span");
      fragment.dataset.hostStyles = next.join(" ");
      fragment.textContent = text;
      // This bounded host edits the selected single-line sample only. The menu
      // neither changes the document nor manufactures an editor selection.
      editor.current.replaceChildren(fragment);
      range.selectNodeContents(fragment);
      savedRange.current = range.cloneRange();
      setActiveStyles(next);
    }
    restore();
  };
  return <div className={styles.host}>
    <Typography>Use Home then Shift+End to select the editable sample, and Tab to enter Text style. F2 replaces callbacks and checked state while open; F3 removes Highlight and Clear Formatting callbacks.</Typography>
    <div ref={editor} role="textbox" aria-label="Native style document" contentEditable suppressContentEditableWarning className={styles.editor}>MiXeD text</div>
    <TextStyleMenuControl activeStyles={activeStyles}
      onLowercase={() => command("lowercase")} onUppercase={() => command("uppercase")} onCapitalize={() => command("capitalize")}
      onStrikethrough={() => command("strikethrough")} onSubscript={() => command("subscript")} onSuperscript={() => command("superscript")}
      onHighlight={limited ? undefined : () => command("highlight")} onClearFormatting={limited ? undefined : () => command("clear")} />
    <AppButton onPress={restore}>Return to selection</AppButton>
    <AppButton onPress={() => setAccept(current => !current)}>{accept ? "Reject host changes" : "Accept host changes"}</AppButton>
    <output aria-label="Host style requests">{JSON.stringify(requests)}</output>
    <output aria-label="Host active styles">{JSON.stringify(activeStyles)}</output>
    <output aria-label="Host callback generation">{replacement ? "replacement" : "original"}</output>
  </div>;
}

export const NativeSelection: Story = { render: () => <NativeSelectionHost /> };
