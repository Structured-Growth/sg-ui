"use client";

import { forwardRef, useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { $getSelection, $getNodeByKey, $isRangeSelection, $setSelection, FORMAT_TEXT_COMMAND, SELECTION_CHANGE_COMMAND, type RangeSelection, type TextFormatType } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { Button } from "../../experimental/Button/Button";
import { FormatBoldIcon } from "../../experimental/icons/FormatBoldIcon";
import { FormatItalicIcon } from "../../experimental/icons/FormatItalicIcon";
import { FormatUnderlinedIcon } from "../../experimental/icons/FormatUnderlinedIcon";
import { SubscriptIcon } from "../../experimental/icons/SubscriptIcon";
import { SuperscriptIcon } from "../../experimental/icons/SuperscriptIcon";
import { LinkIcon } from "../../experimental/icons/LinkIcon";
import { useTranslation } from "../../i18n";
import styles from "./FloatingTextSelectionToolbar.module.css";

const formats = ["bold", "italic", "underline", "subscript", "superscript"] as const;
type Formats = Record<typeof formats[number], boolean>;
const emptyFormats: Formats = { bold: false, italic: false, underline: false, subscript: false, superscript: false };
export type FloatingTextSelectionToolbarProps = {
  boundaryRef?: RefObject<HTMLElement | null>;
  onRequestLink?: () => void;
  onRequestLinkMouseDown?: () => void;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
};

// WebKit can reveal a retained contenteditable selection during native focus even
// with preventScroll. Preserve the host's exact offsets across that synchronous
// call; never clear/recreate its range or chase later host scroll events.
function focusEditorWithoutScroll(root: HTMLElement | null) {
  if (!root) return;
  const offsets: { element: HTMLElement; top: number; left: number }[] = [];
  for (let element: HTMLElement | null = root; element; element = element.parentElement) {
    offsets.push({ element, top: element.scrollTop, left: element.scrollLeft });
  }
  root.focus({ preventScroll: true });
  for (const { element, top, left } of offsets) {
    if (element.scrollTop !== top) element.scrollTop = top;
    if (element.scrollLeft !== left) element.scrollLeft = left;
  }
}

/** Lexical owns document state; this overlay only requests commands for its saved selection. */
export const FloatingTextSelectionToolbar = forwardRef<HTMLDivElement, FloatingTextSelectionToolbarProps>(function FloatingTextSelectionToolbar({
  boundaryRef, onRequestLink, onRequestLinkMouseDown, className, style, "aria-label": ariaLabel,
}, ref) {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const savedSelection = useRef<RangeSelection | null>(null);
  const savedRange = useRef<Range | null>(null);
  const dismissedSelection = useRef<RangeSelection | null>(null);
  const pending = useRef(new Set<ReturnType<typeof setTimeout>>());
  const [active, setActive] = useState<Formats>(emptyFormats);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ left: 12, top: 12, maxWidth: 240 });
  const [size, setSize] = useState({ width: 240, height: 44 });
  const label = (id: string, fallback: string) => t(`common.ui.editor.${id}`, { defaultMessage: fallback });
  useEffect(() => () => { pending.current.forEach(clearTimeout); pending.current.clear(); }, []);
  const afterEvent = (callback: () => void) => {
    const timer = setTimeout(() => { pending.current.delete(timer); callback(); }, 0);
    pending.current.add(timer);
  };
  useEffect(() => {
    const element = toolbarRef.current;
    if (!element || !visible) return;
    const measure = () => {
      const rect = element.getBoundingClientRect();
      if (rect.width && rect.height) setSize(previous => previous.width === rect.width && previous.height === rect.height ? previous : { width: rect.width, height: rect.height });
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [visible]);

  useEffect(() => {
    const update = () => {
      // Focusing an owned control must not discard the editor selection or hide its keyboard path.
      const focused = toolbarRef.current?.contains(document.activeElement);
      editor.getEditorState().read(() => {
        const selection = focused ? savedSelection.current : $getSelection();
        const dom = window.getSelection();
        const root = editor.getRootElement();
        const range = focused ? savedRange.current : dom?.rangeCount ? dom.getRangeAt(0) : null;
        if (!editor.isEditable() || !$isRangeSelection(selection) || selection.isCollapsed() || !$getNodeByKey(selection.anchor.key) || !$getNodeByKey(selection.focus.key) || !root || !range ||
          !root.contains(range.startContainer) || !root.contains(range.endContainer)) {
          setVisible(false); savedSelection.current = null; return;
        }
        if (dismissedSelection.current?.is(selection)) { setVisible(false); return; }
        dismissedSelection.current = null;
        savedRange.current = range.cloneRange();
        const rects = range.getClientRects();
        const rect = rects.length ? rects[0] : range.getBoundingClientRect();
        const boundary = boundaryRef?.current?.getBoundingClientRect();
        const bounds = {
          left: Math.max(12, boundary?.left ?? 12), right: Math.min(window.innerWidth - 12, boundary?.right ?? window.innerWidth - 12),
          top: Math.max(12, boundary?.top ?? 12), bottom: Math.min(window.innerHeight - 12, boundary?.bottom ?? window.innerHeight - 12),
        };
        if ((!rect.width && !rect.height) || bounds.right <= bounds.left || bounds.bottom <= bounds.top ||
          rect.bottom < bounds.top || rect.top > bounds.bottom || rect.right < bounds.left || rect.left > bounds.right) {
          setVisible(false);
          if (focused) { dismissedSelection.current = selection.clone(); focusEditorWithoutScroll(root); }
          return;
        }
        savedSelection.current = selection.clone();
        setActive(Object.fromEntries(formats.map(format => [format, selection.hasFormat(format)])) as Formats);
        const width = Math.min(size.width, bounds.right - bounds.left);
        const above = rect.top - size.height - 8;
        setPosition({
          left: Math.max(bounds.left, Math.min(rect.left, bounds.right - width)),
          top: Math.max(bounds.top, Math.min(above >= bounds.top ? above : rect.bottom + 8, bounds.bottom - size.height)),
          maxWidth: bounds.right - bounds.left,
        });
        setVisible(true);
      });
    };
    const hide = () => { dismissedSelection.current = savedSelection.current?.clone() ?? null; setVisible(false); };
    const pointer = (event: PointerEvent) => {
      if (!(event.target instanceof Node) || toolbarRef.current?.contains(event.target)) return;
      if (editor.getRootElement()?.contains(event.target)) dismissedSelection.current = null;
      if (!editor.getRootElement()?.contains(event.target) && !boundaryRef?.current?.contains(event.target)) hide();
    };
    const keyboard = (event: KeyboardEvent) => {
      if (event.altKey && event.key === "F10" && savedSelection.current && !toolbarRef.current?.hidden) {
        event.preventDefault(); toolbarRef.current?.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus();
      }
    };
    const unregisterRoot = editor.registerRootListener((root, previous) => {
      previous?.removeEventListener("keydown", keyboard); root?.addEventListener("keydown", keyboard);
    });
    document.addEventListener("selectionchange", update);
    document.addEventListener("scroll", update, true);
    document.addEventListener("pointerdown", pointer, true);
    window.addEventListener("resize", update);
    window.addEventListener("blur", hide);
    update();
    return mergeRegister(unregisterRoot, editor.registerUpdateListener(update), editor.registerEditableListener(update), editor.registerCommand(SELECTION_CHANGE_COMMAND, () => { update(); return false; }, 1), () => {
      editor.getRootElement()?.removeEventListener("keydown", keyboard);
      document.removeEventListener("selectionchange", update); document.removeEventListener("scroll", update, true);
      document.removeEventListener("pointerdown", pointer, true); window.removeEventListener("resize", update); window.removeEventListener("blur", hide);
    });
  }, [boundaryRef, editor, size]);

  const restore = (callback: () => void) => {
    const selection = savedSelection.current?.clone();
    if (!selection) return;
    // A command can refocus contenteditable. Finish native Enter before that focus moves.
    afterEvent(() => {
      if (!editor.isEditable()) return;
      editor.getRootElement()?.focus({ preventScroll: true });
      let valid = false;
      editor.update(() => {
        if ($getNodeByKey(selection.anchor.key) && $getNodeByKey(selection.focus.key)) { $setSelection(selection); valid = true; }
      }, { discrete: true });
      if (valid) callback();
    });
  };
  const dispatch = (format: TextFormatType) => restore(() => { editor.dispatchCommand(FORMAT_TEXT_COMMAND, format); editor.focus(); });
  const controls = [
    { id: "bold", name: "Bold", icon: <FormatBoldIcon /> }, { id: "italic", name: "Italic", icon: <FormatItalicIcon /> },
    { id: "underline", name: "Underline", icon: <FormatUnderlinedIcon /> }, { id: "subscript", name: "Subscript", icon: <SubscriptIcon /> },
    { id: "superscript", name: "Superscript", icon: <SuperscriptIcon /> },
  ] as const;
  return <div ref={element => { toolbarRef.current = element; if (typeof ref === "function") ref(element); else if (ref) ref.current = element; }}
    role="group" aria-label={ariaLabel ?? label("selectionFormatting", "Selection formatting")} hidden={!visible}
    className={[styles.root, className].filter(Boolean).join(" ")} style={{ ...style, left: position.left, top: position.top, maxWidth: position.maxWidth }} data-sgui-part="selection-toolbar"
    onMouseDownCapture={event => {
      event.preventDefault();
      if (onRequestLink && (event.target as HTMLElement).closest('[data-sgui-part="selection-link"]')) onRequestLinkMouseDown?.();
    }} onKeyDownCapture={event => {
      if (event.key === "Escape") { event.preventDefault(); dismissedSelection.current = savedSelection.current?.clone() ?? null; setVisible(false); afterEvent(() => { editor.getRootElement()?.focus({ preventScroll: true }); editor.focus(); }); }
    }}>
    {controls.map(control => <Button key={control.id} className={styles.action} variant="text" tone="neutral" density="compact"
      aria-label={label(control.id, control.name)} aria-pressed={active[control.id]} startIcon={control.icon} onPress={() => dispatch(control.id)} />)}
    <span data-sgui-part="selection-link"><Button className={styles.action} variant="text" tone="neutral" density="compact"
      aria-label={label("link", "Edit link")} startIcon={<LinkIcon />} disabled={!onRequestLink} onPress={() => restore(() => onRequestLink?.())} /></span>
  </div>;
});
