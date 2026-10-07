"use client";

import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import {
  $createParagraphNode,
  $createRangeSelection,
  $createTextNode,
  $getSelection,
  $getNodeByKey,
  $isElementNode,
  type LexicalNode,
  $isTextNode,
  $isRangeSelection,
  $setSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  type LexicalCommand,
  type TextFormatType,
  type LexicalEditor,
} from "lexical";
import { $patchStyleText, $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, $isHeadingNode } from "@lexical/rich-text";
import { $createLinkNode, $isLinkNode, $toggleLink, LinkNode } from "@lexical/link";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createTableNodeWithDimensions } from "@lexical/table";
import { mergeRegister } from "@lexical/utils";
import { ColumnsLayoutModal, type ColumnsLayoutPreset } from "../ColumnsLayoutModal";
import { FloatingTextSelectionToolbar } from "../FloatingTextSelectionToolbar";
import { ImageUploadModal } from "../ImageUploadModal";
import { LinkUrlModal } from "../LinkUrlModal";
import { EXPERIENCE_EDITOR_NODES, EXPERIENCE_EDITOR_THEME } from "./lexical/editorConfig";
import { ExperienceEditorPlugins } from "./lexical/ExperienceEditorPlugins";
import { INSERT_IMAGE_COMMAND } from "./lexical/ImageInsertPlugin";
import {
  RichTextFormattingToolbar,
  type AlignOption,
  type RichTextHeadingValue,
  type RichTextToolbarControlId,
  type RichTextToolbarControlSetId,
} from "../RichTextFormattingToolbar";
import { useTranslation } from "../../i18n";
import styles from "./PageRichTextEditorSection.module.css";

type HeadingValue = RichTextHeadingValue;

type ToolbarState = {
  heading: HeadingValue;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  code: boolean;
  fontFamily: string;
  fontSize: number;
};

type RangeSelectionSnapshot = {
  anchorKey: string;
  anchorOffset: number;
  anchorType: "text" | "element";
  focusKey: string;
  focusOffset: number;
  focusType: "text" | "element";
};

const FORMAT_CLEAR_LIST: TextFormatType[] = [
  "bold",
  "italic",
  "underline",
  "code",
  "strikethrough",
  "subscript",
  "superscript",
];

const DEFAULT_HIGHLIGHT_COLOR = "#fff59d";
const TEXT_VARIANT_MARKER_PROPERTY = "--lp-text-variant";

type TextVariantMarker = "body" | "body1" | "body2" | "bodyAlt2";

function readStyleProperty(styleValue: string, propertyName: string): string | null {
  const declarations = styleValue.split(";").map((entry) => entry.trim()).filter(Boolean);
  for (const declaration of declarations) {
    const separatorIndex = declaration.indexOf(":");
    if (separatorIndex <= 0) {
      continue;
    }
    const key = declaration.slice(0, separatorIndex).trim();
    if (key !== propertyName) {
      continue;
    }
    const value = declaration.slice(separatorIndex + 1).trim();
    return value || null;
  }
  return null;
}

function headingValueFromMarker(marker: string | null): HeadingValue {
  if (marker === "body1") {
    return "Body Alt 1";
  }
  if (marker === "body2") {
    return "Body Alt 2";
  }
  if (marker === "bodyAlt2") {
    return "Body Alt 3";
  }
  return "Normal";
}

function normalizeUrlForStorage(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (trimmed.startsWith("www.")) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url) || /^www\./i.test(url);
}

function readSelectionFontFamily(selection: ReturnType<typeof $getSelection>): string {
  if (!$isRangeSelection(selection)) {
    return "Arial";
  }
  const styledTextNode = selection
    .getNodes()
    .find((node) => $isTextNode(node) && Boolean(node.getStyle()));
  if (!styledTextNode || !$isTextNode(styledTextNode)) {
    return "Arial";
  }
  const fontFamily = readStyleProperty(styledTextNode.getStyle(), "font-family");
  return fontFamily || "Arial";
}

function readSelectionFontSize(selection: ReturnType<typeof $getSelection>): number {
  if (!$isRangeSelection(selection)) {
    return 15;
  }
  const styledTextNode = selection
    .getNodes()
    .find((node) => $isTextNode(node) && Boolean(node.getStyle()));
  if (!styledTextNode || !$isTextNode(styledTextNode)) {
    return 15;
  }
  const fontSize = readStyleProperty(styledTextNode.getStyle(), "font-size");
  if (!fontSize) {
    return 15;
  }
  const parsed = Number.parseFloat(fontSize);
  return Number.isFinite(parsed) ? Math.round(parsed) : 15;
}

function clearInlineFormattingOnSelection() {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return;
  }
  const nodes = selection.getNodes();
  for (const node of nodes) {
    if ($isTextNode(node)) {
      for (const format of FORMAT_CLEAR_LIST) {
        if (node.hasFormat(format)) {
          node.toggleFormat(format);
        }
      }
      node.setStyle("");
    }
  }
  $patchStyleText(selection, {
    [TEXT_VARIANT_MARKER_PROPERTY]: "",
    "background-color": "",
    color: "",
    "font-family": "",
    "font-size": "",
  });
}

export type PageRichTextEditorSectionProps = {
  lexicalValue: unknown;
  onLexicalChange: (nextLexical: unknown) => void;
  placeholder?: string;
  editorKey: string;
  toolPreset?: "base" | "full";
  enabledControls?: Partial<Record<RichTextToolbarControlId, boolean>>;
  enabledControlSets?: Partial<Record<RichTextToolbarControlSetId, boolean>>;
  disabledControls?: Partial<Record<RichTextToolbarControlId, boolean>>;
  disabledControlSets?: Partial<Record<RichTextToolbarControlSetId, boolean>>;
  hiddenControls?: Partial<Record<RichTextToolbarControlId, boolean>>;
  hiddenControlSets?: Partial<Record<RichTextToolbarControlSetId, boolean>>;
  readOnly?: boolean;
  /** Accessible name for the editable document. */
  "aria-label"?: string;
  className?: string;
  style?: import("react").CSSProperties;
  onUploadImage?: (file: File) => Promise<{
    assetId: string;
    assetVersionId: string;
    src: string;
    altText?: string;
    width?: number | null;
    height?: number | null;
  }>;
};

function ToolbarBridge({
  onStateChange,
  onReady,
  onSelectionSnapshotChange,
  readOnly,
}: {
  readOnly: boolean;
  onStateChange: (nextState: ToolbarState) => void;
  onReady: (editor: LexicalEditor) => void;
  onSelectionSnapshotChange: (snapshot: RangeSelectionSnapshot | null) => void;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => { editor.setEditable(!readOnly); }, [editor, readOnly]);

  useEffect(() => {
    onReady(editor);
  }, [editor, onReady]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) {
            onSelectionSnapshotChange(null);
            onStateChange({
              bold: false,
              code: false,
              fontFamily: "Arial",
              fontSize: 15,
              heading: "Normal",
              italic: false,
              underline: false,
            });
            return;
          }
          onSelectionSnapshotChange({
            anchorKey: selection.anchor.key,
            anchorOffset: selection.anchor.offset,
            anchorType: selection.anchor.type,
            focusKey: selection.focus.key,
            focusOffset: selection.focus.offset,
            focusType: selection.focus.type,
          });

          const anchorNode = selection.anchor.getNode();
          const topLevel = anchorNode.getTopLevelElementOrThrow();
          const heading = $isHeadingNode(topLevel)
            ? (topLevel.getTag() === "h1"
                ? "Heading 1"
                : topLevel.getTag() === "h2"
                  ? "Heading 2"
                  : topLevel.getTag() === "h3"
                    ? "Heading 3"
                    : topLevel.getTag() === "h4"
                      ? "Heading 4"
                      : topLevel.getTag() === "h5"
                        ? "Heading 5"
                        : topLevel.getTag() === "h6"
                          ? "Heading 6"
                          : "Normal")
            : (() => {
                const styledTextNode = selection
                  .getNodes()
                  .find((node) => $isTextNode(node) && Boolean(node.getStyle()));
                const marker = styledTextNode && $isTextNode(styledTextNode)
                  ? readStyleProperty(styledTextNode.getStyle(), TEXT_VARIANT_MARKER_PROPERTY)
                  : null;
                return headingValueFromMarker(marker);
              })();
          onStateChange({
            bold: selection.hasFormat("bold"),
            code: selection.hasFormat("code"),
            fontFamily: readSelectionFontFamily(selection),
            fontSize: readSelectionFontSize(selection),
            heading,
            italic: selection.hasFormat("italic"),
            underline: selection.hasFormat("underline"),
          });
        });
      }),
    );
  }, [editor, onSelectionSnapshotChange, onStateChange]);

  return null;
}

const DEFAULT_LEXICAL_VALUE = {
  root: {
    type: "root",
    version: 1,
    children: [
      {
        type: "paragraph",
        version: 1,
        children: [],
        direction: null,
        format: "",
        indent: 0,
      },
    ],
    direction: null,
    format: "",
    indent: 0,
  },
};

export const PageRichTextEditorSection = forwardRef<HTMLDivElement, PageRichTextEditorSectionProps>(function PageRichTextEditorSection({
  lexicalValue,
  onLexicalChange,
  placeholder,
  editorKey,
  toolPreset = "base",
  enabledControls,
  enabledControlSets,
  disabledControls,
  disabledControlSets,
  hiddenControls,
  hiddenControlSets,
  readOnly = false,
  onUploadImage,
  "aria-label": accessibleName,
  className,
  style,
}, ref) {
  const { t } = useTranslation();
  const [toolbarState, setToolbarState] = useState<ToolbarState>({
    bold: false,
    code: false,
    fontFamily: "Arial",
    fontSize: 15,
    heading: "Normal",
    italic: false,
    underline: false,
  });
  const [editorRef, setEditorRef] = useState<LexicalEditor | null>(null);
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [alignment, setAlignment] = useState<AlignOption>("left");
  const editorViewportRef = useRef<HTMLDivElement | null>(null);
  const selectionSnapshotRef = useRef<RangeSelectionSnapshot | null>(null);
  const pendingLinkSelectionRef = useRef<RangeSelectionSnapshot | null>(null);
  const pendingLinkSelectedTextRef = useRef("");
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkModalInitialDisplayText, setLinkModalInitialDisplayText] = useState("");
  const [linkModalInitialUrl, setLinkModalInitialUrl] = useState("");
  const [linkModalSession, setLinkModalSession] = useState(0);
  const [activeLinkNodeKey, setActiveLinkNodeKey] = useState<string | null>(null);
  const [columnsLayoutModalOpen, setColumnsLayoutModalOpen] = useState(false);
  const [imageUploadModalOpen, setImageUploadModalOpen] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const imageUploadSessionRef = useRef(0);
  useEffect(() => () => { imageUploadSessionRef.current += 1; }, []);

  useEffect(() => {
    imageUploadSessionRef.current += 1;
    setLinkModalOpen(false); setActiveLinkNodeKey(null);
    setColumnsLayoutModalOpen(false); setImageUploadModalOpen(false);
    setImageUploading(false); setImageUploadError(null);
    pendingLinkSelectionRef.current = null; selectionSnapshotRef.current = null;
    pendingLinkSelectedTextRef.current = "";
  }, [editorKey, readOnly]);

  const baseHiddenControls = useMemo<Partial<Record<RichTextToolbarControlId, boolean>>>(
    () => (toolPreset === "base" ? { code: true, link: true } : {}),
    [toolPreset],
  );
  const baseHiddenControlSets = useMemo<Partial<Record<RichTextToolbarControlSetId, boolean>>>(
    () => (toolPreset === "base"
      ? {
          colors: true,
          fontFamily: true,
          fontSize: true,
          insert: true,
          textStyle: true,
        }
      : {}),
    [toolPreset],
  );

  const resolvedHiddenControls = useMemo(() => {
    const resolved = { ...baseHiddenControls };
    for (const [control, enabled] of Object.entries(enabledControls ?? {}) as Array<[RichTextToolbarControlId, boolean]>) {
      if (enabled) {
        resolved[control] = false;
      } else {
        resolved[control] = true;
      }
    }
    for (const [control, hidden] of Object.entries(hiddenControls ?? {}) as Array<[RichTextToolbarControlId, boolean]>) {
      resolved[control] = hidden;
    }
    return resolved;
  }, [baseHiddenControls, enabledControls, hiddenControls]);

  const resolvedHiddenControlSets = useMemo(() => {
    const resolved = { ...baseHiddenControlSets };
    for (const [setId, enabled] of Object.entries(enabledControlSets ?? {}) as Array<[RichTextToolbarControlSetId, boolean]>) {
      if (enabled) {
        resolved[setId] = false;
      } else {
        resolved[setId] = true;
      }
    }
    for (const [setId, hidden] of Object.entries(hiddenControlSets ?? {}) as Array<[RichTextToolbarControlSetId, boolean]>) {
      resolved[setId] = hidden;
    }
    return resolved;
  }, [baseHiddenControlSets, enabledControlSets, hiddenControlSets]);

  const initialEditorState = useMemo(() => {
    try {
      return JSON.stringify(lexicalValue ?? DEFAULT_LEXICAL_VALUE);
    } catch {
      return JSON.stringify(DEFAULT_LEXICAL_VALUE);
    }
  }, [lexicalValue]);

  const applyTextVariantMarker = (marker: TextVariantMarker) => {
    patchSelectedTextStyle({
      [TEXT_VARIANT_MARKER_PROPERTY]: marker,
    });
  };

  const onHeadingChange = (value: RichTextHeadingValue) => {
    withFocusedRangeSelection(() => {
      clearInlineFormattingOnSelection();
      if (value === "Normal") {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return;
        }
        $setBlocksType(selection, () => $createParagraphNode());
        return;
      }
      if (value === "Heading 1") {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return;
        }
        $setBlocksType(selection, () => $createHeadingNode("h1"));
        return;
      }
      if (value === "Heading 2") {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return;
        }
        $setBlocksType(selection, () => $createHeadingNode("h2"));
        return;
      }
      if (value === "Heading 3") {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return;
        }
        $setBlocksType(selection, () => $createHeadingNode("h3"));
        return;
      }
      if (value === "Heading 4") {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return;
        }
        $setBlocksType(selection, () => $createHeadingNode("h4"));
        return;
      }
      if (value === "Heading 5") {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return;
        }
        $setBlocksType(selection, () => $createHeadingNode("h5"));
        return;
      }
      if (value === "Heading 6") {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return;
        }
        $setBlocksType(selection, () => $createHeadingNode("h6"));
        return;
      }

      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        return;
      }
      $setBlocksType(selection, () => $createParagraphNode());
      if (value === "Body Alt 1") {
        applyTextVariantMarker("body1");
        return;
      }
      if (value === "Body Alt 2") {
        applyTextVariantMarker("body2");
        return;
      }
      if (value === "Body Alt 3") {
        applyTextVariantMarker("bodyAlt2");
        return;
      }
      if (value === "Normal") {
        applyTextVariantMarker("body");
      }
    });
  };

  const dispatchTextFormat = (format: TextFormatType) => {
    if (!editorRef) {
      return;
    }
    editorRef.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const withFocusedRangeSelection = (apply: () => void) => {
    if (!editorRef) {
      return;
    }
    editorRef.focus(() => {
      editorRef.update(() => {
        let selection = $getSelection();
        if ((!$isRangeSelection(selection) || selection.isCollapsed()) && selectionSnapshotRef.current) {
          const snapshot = selectionSnapshotRef.current;
          const anchorNode = $getNodeByKey(snapshot.anchorKey);
          const focusNode = $getNodeByKey(snapshot.focusKey);
          if (anchorNode && focusNode) {
            const restoredSelection = $createRangeSelection();
            restoredSelection.anchor.set(snapshot.anchorKey, snapshot.anchorOffset, snapshot.anchorType);
            restoredSelection.focus.set(snapshot.focusKey, snapshot.focusOffset, snapshot.focusType);
            $setSelection(restoredSelection);
            selection = $getSelection();
          }
        }
        if (!$isRangeSelection(selection)) {
          return;
        }
        apply();
      });
    });
  };

  const patchSelectedTextStyle = (style: Record<string, string>) => {
    withFocusedRangeSelection(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        return;
      }
      $patchStyleText(selection, style);
    });
  };

  const updateSelectedText = (transform: (input: string) => string) => {
    withFocusedRangeSelection(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        return;
      }
      const nodes = selection.getNodes();
      for (const node of nodes) {
        if ($isTextNode(node)) {
          node.setTextContent(transform(node.getTextContent()));
        }
      }
    });
  };

  const clearSelectedFormatting = () => {
    withFocusedRangeSelection(() => {
      clearInlineFormattingOnSelection();
    });
    setTextColor("#000000");
    setBackgroundColor("#ffffff");
    setToolbarState((current) => ({ ...current, fontFamily: "Arial", fontSize: 15 }));
  };

  const getLinkAncestor = (node: LexicalNode | null): LinkNode | null => {
    let current = node;
    while (current) {
      if ($isLinkNode(current)) {
        return current;
      }
      current = current.getParent();
    }
    return null;
  };

  const snapshotSelection = (selection: ReturnType<typeof $getSelection>): RangeSelectionSnapshot | null => {
    if (!$isRangeSelection(selection)) {
      return null;
    }
    return {
      anchorKey: selection.anchor.key,
      anchorOffset: selection.anchor.offset,
      anchorType: selection.anchor.type,
      focusKey: selection.focus.key,
      focusOffset: selection.focus.offset,
      focusType: selection.focus.type,
    };
  };

  const withPendingLinkSelection = (apply: () => void): boolean => {
    if (!editorRef) {
      return false;
    }
    let applied = false;
    editorRef.update(() => {
      const snapshot = pendingLinkSelectionRef.current;
      if (!snapshot) {
        return;
      }
      const anchorNode = $getNodeByKey(snapshot.anchorKey);
      const focusNode = $getNodeByKey(snapshot.focusKey);
      if (!anchorNode || !focusNode) {
        return;
      }
      const anchorType = $isTextNode(anchorNode) ? "text" : "element";
      const focusType = $isTextNode(focusNode) ? "text" : "element";
      const anchorMaxOffset = $isTextNode(anchorNode)
        ? anchorNode.getTextContentSize()
        : $isElementNode(anchorNode)
          ? anchorNode.getChildrenSize()
          : 0;
      const focusMaxOffset = $isTextNode(focusNode)
        ? focusNode.getTextContentSize()
        : $isElementNode(focusNode)
          ? focusNode.getChildrenSize()
          : 0;
      const restoredSelection = $createRangeSelection();
      restoredSelection.anchor.set(
        snapshot.anchorKey,
        Math.max(0, Math.min(snapshot.anchorOffset, anchorMaxOffset)),
        anchorType,
      );
      restoredSelection.focus.set(
        snapshot.focusKey,
        Math.max(0, Math.min(snapshot.focusOffset, focusMaxOffset)),
        focusType,
      );
      $setSelection(restoredSelection);
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        return;
      }
      apply();
      applied = true;
    });
    return applied;
  };

  const capturePendingLinkSelection = () => {
    if (!editorRef) {
      return;
    }
    let foundLinkNodeKey: string | null = null;
    let linkDisplayText = "";
    let linkUrl = "";
    editorRef.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        return;
      }
      pendingLinkSelectionRef.current = snapshotSelection(selection);
      pendingLinkSelectedTextRef.current = selection.getTextContent();
      const anchorLink = getLinkAncestor(selection.anchor.getNode());
      const focusLink = getLinkAncestor(selection.focus.getNode());
      if (!anchorLink || !focusLink || anchorLink.getKey() !== focusLink.getKey()) {
        return;
      }
      foundLinkNodeKey = anchorLink.getKey();
      linkDisplayText = anchorLink.getTextContent();
      linkUrl = anchorLink.getURL();
      pendingLinkSelectedTextRef.current = linkDisplayText;
    });

    if (foundLinkNodeKey) {
      setActiveLinkNodeKey(foundLinkNodeKey);
      setLinkModalInitialDisplayText(linkDisplayText);
      setLinkModalInitialUrl(linkUrl);
      return;
    }

    setActiveLinkNodeKey(null);
  };

  const openLinkModal = () => {
    if (!pendingLinkSelectionRef.current) {
      capturePendingLinkSelection();
    }
    if (!pendingLinkSelectionRef.current && selectionSnapshotRef.current) {
      pendingLinkSelectionRef.current = selectionSnapshotRef.current;
    }
    const domSelection = typeof window !== "undefined" ? window.getSelection() : null;
    let existingLinkHref = "";

    if (domSelection && domSelection.rangeCount > 0) {
      const range = domSelection.getRangeAt(0);
      const startElement = range.startContainer instanceof Element ? range.startContainer : range.startContainer.parentElement;
      const endElement = range.endContainer instanceof Element ? range.endContainer : range.endContainer.parentElement;
      const startLink = startElement?.closest("a");
      const endLink = endElement?.closest("a");

      if (startLink && endLink && startLink === endLink) {
        const fullLinkRange = document.createRange();
        fullLinkRange.selectNodeContents(startLink);
        domSelection.removeAllRanges();
        domSelection.addRange(fullLinkRange);
        existingLinkHref = startLink.getAttribute("href") ?? "";
      }
    }

    const selectedText = (domSelection?.toString().trim() ?? "") || pendingLinkSelectedTextRef.current.trim();
    const tokens = selectedText.split(/\s+/).filter(Boolean);
    const urlToken = tokens.find((token) => token.startsWith("http") || token.startsWith("www."));

    if (!urlToken) {
      setLinkModalInitialDisplayText(selectedText);
      setLinkModalInitialUrl(existingLinkHref);
    } else if (tokens.length === 1) {
      setLinkModalInitialDisplayText(urlToken.split("?")[0] ?? urlToken);
      setLinkModalInitialUrl(existingLinkHref || urlToken);
    } else {
      setLinkModalInitialDisplayText(selectedText);
      setLinkModalInitialUrl(existingLinkHref || urlToken);
    }

    setLinkModalSession((current) => current + 1);
    setLinkModalOpen(true);
  };

  const applyLink = ({ displayText, url }: { displayText: string; url: string | null }) => {
    if (activeLinkNodeKey) {
      editorRef?.update(() => {
        const linkNode = $getNodeByKey(activeLinkNodeKey);
        if (!linkNode || !$isLinkNode(linkNode)) {
          return;
        }
        const previousDisplayText = linkNode.getTextContent();

        if (!url) {
          if (!displayText || displayText === previousDisplayText) {
            const children = linkNode.getChildren();
            for (const child of children) linkNode.insertBefore(child);
            linkNode.remove();
            children.at(-1)?.selectEnd();
          } else {
            const replacement = $createTextNode(displayText);
            linkNode.replace(replacement);
            replacement.select();
          }
          return;
        }

        const normalizedUrl = normalizeUrlForStorage(url);
        linkNode.setURL(normalizedUrl);
        if (isExternalUrl(url)) {
          linkNode.setTarget("_blank");
          linkNode.setRel("noopener noreferrer");
        } else {
          linkNode.setTarget(null);
          linkNode.setRel(null);
        }
        if (displayText && displayText !== previousDisplayText) {
          const replacement = $createTextNode(displayText);
          // Replace atomically: clearing a nonempty LinkNode detaches it.
          linkNode.splice(0, linkNode.getChildrenSize(), [replacement]);
          replacement.select();
        } else {
          linkNode.selectEnd();
        }
      });
      setLinkModalOpen(false);
      setActiveLinkNodeKey(null);
      pendingLinkSelectionRef.current = null;
      pendingLinkSelectedTextRef.current = "";
      return;
    }

    const applyAtSelection = () => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        return;
      }
      const currentText = selection.getTextContent();
      const finalDisplayText = displayText || currentText;

      if (!url) {
        if (finalDisplayText === currentText) { $toggleLink(null); return; }
        selection.insertText(finalDisplayText);
        return;
      }

      const normalizedUrl = normalizeUrlForStorage(url);
      const isExternal = isExternalUrl(url);
      if (finalDisplayText === currentText && !selection.isCollapsed()) {
        $toggleLink(normalizedUrl, isExternal ? { rel: "noopener noreferrer", target: "_blank" } : { rel: null, target: null });
        return;
      }
      const linkNode = $createLinkNode(
        normalizedUrl,
        isExternal
          ? { rel: "noopener noreferrer", target: "_blank" }
          : {},
      );
      linkNode.append($createTextNode(finalDisplayText || normalizedUrl));
      selection.insertNodes([linkNode]);
    };
    const applied = withPendingLinkSelection(applyAtSelection);
    if (!applied) {
      withFocusedRangeSelection(applyAtSelection);
    }
    setLinkModalOpen(false);
    setActiveLinkNodeKey(null);
    pendingLinkSelectionRef.current = null;
    pendingLinkSelectedTextRef.current = "";
  };

  const dispatchInsertCommand = <TPayload,>(command: LexicalCommand<TPayload>, payload: TPayload) => {
    editorRef?.dispatchCommand(command, payload);
  };

  const getColumnsLayoutConfig = (preset: ColumnsLayoutPreset): { columns: number; colWidths?: readonly number[] } => {
    if (preset === "two2575") {
      return { columns: 2, colWidths: [250, 750] };
    }
    if (preset === "three255025") {
      return { columns: 3, colWidths: [250, 500, 250] };
    }
    if (preset === "threeEqual") {
      return { columns: 3 };
    }
    if (preset === "fourEqual") {
      return { columns: 4 };
    }
    return { columns: 2 };
  };

  const insertColumnsLayout = (preset: ColumnsLayoutPreset) => {
    if (!editorRef) {
      return;
    }
    editorRef.focus(() => {
      editorRef.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return;
        }
        const config = getColumnsLayoutConfig(preset);
        const tableNode = $createTableNodeWithDimensions(1, config.columns, false);
        if (config.colWidths) {
          tableNode.setColWidths(config.colWidths);
        }
        selection.insertNodes([tableNode, $createParagraphNode()]);
      });
    });
  };

  return (
    <div ref={ref} className={[styles.root, className].filter(Boolean).join(" ")} style={style} data-sgui-part="editor-section">
      {readOnly ? null : (
        <RichTextFormattingToolbar
        disabledControls={disabledControls}
        disabledControlSets={disabledControlSets}
        hiddenControls={resolvedHiddenControls}
        hiddenControlSets={resolvedHiddenControlSets}
        fontFamilyValue={toolbarState.fontFamily}
        fontSizeValue={toolbarState.fontSize}
        headingValue={toolbarState.heading}
        alignmentValue={alignment}
        onAlignmentChange={(nextAlignment) => {
          if (readOnly) {
            return;
          }
          setAlignment(nextAlignment);
          editorRef?.dispatchCommand(FORMAT_ELEMENT_COMMAND, nextAlignment);
        }}
        onIndent={() => {
          if (readOnly) {
            return;
          }
          editorRef?.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
        }}
        onOutdent={() => {
          if (readOnly) {
            return;
          }
          editorRef?.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
        }}
        onBold={() => dispatchTextFormat("bold")}
        onCode={() => dispatchTextFormat("code")}
        onFontFamilyChange={(nextFamily) => {
          setToolbarState((current) => ({ ...current, fontFamily: nextFamily }));
          patchSelectedTextStyle({ "font-family": nextFamily });
        }}
        onFontSizeDecrease={() => {
          const next = Math.max(8, toolbarState.fontSize - 1);
          setToolbarState((current) => ({ ...current, fontSize: next }));
          patchSelectedTextStyle({ "font-size": `${next}px` });
        }}
        onFontSizeIncrease={() => {
          const next = Math.min(72, toolbarState.fontSize + 1);
          setToolbarState((current) => ({ ...current, fontSize: next }));
          patchSelectedTextStyle({ "font-size": `${next}px` });
        }}
        onHeadingChange={onHeadingChange}
        onItalic={() => dispatchTextFormat("italic")}
        onInsertHorizontalRule={() => {
          dispatchInsertCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
        }}
        onInsertColumnsLayout={() => {
          if (readOnly) {
            return;
          }
          setColumnsLayoutModalOpen(true);
        }}
        onInsertImage={() => {
          if (readOnly) {
            return;
          }
          imageUploadSessionRef.current += 1;
          setImageUploading(false);
          setImageUploadError(null);
          setImageUploadModalOpen(true);
        }}
        onLink={openLinkModal}
        onLinkMouseDown={capturePendingLinkSelection}
        onBackgroundColorChange={(nextColor) => {
          setBackgroundColor(nextColor);
          withFocusedRangeSelection(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) {
              return;
            }
            $patchStyleText(selection, { "background-color": nextColor || null });
          });
        }}
        onTextColorChange={(nextColor) => {
          setTextColor(nextColor);
          withFocusedRangeSelection(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) {
              return;
            }
            $patchStyleText(selection, { color: nextColor || null });
          });
        }}
        onRedo={() => {
          editorRef?.dispatchCommand(REDO_COMMAND, undefined);
        }}
        onTextStyleCapitalize={() => {
          updateSelectedText((value) =>
            value.replace(/\b\w+/g, (word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`),
          );
        }}
        onTextStyleClearFormatting={clearSelectedFormatting}
        onTextStyleHighlight={() => {
          setBackgroundColor(DEFAULT_HIGHLIGHT_COLOR);
          withFocusedRangeSelection(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) {
              return;
            }
            $patchStyleText(selection, { "background-color": DEFAULT_HIGHLIGHT_COLOR });
          });
        }}
        onTextStyleLowercase={() => {
          updateSelectedText((value) => value.toLowerCase());
        }}
        onTextStyleStrikethrough={() => dispatchTextFormat("strikethrough")}
        onTextStyleSubscript={() => dispatchTextFormat("subscript")}
        onTextStyleSuperscript={() => dispatchTextFormat("superscript")}
        onTextStyleUppercase={() => {
          updateSelectedText((value) => value.toUpperCase());
        }}
        onUnderline={() => dispatchTextFormat("underline")}
        boldActive={toolbarState.bold}
        codeActive={toolbarState.code}
        onUndo={() => {
          editorRef?.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        italicActive={toolbarState.italic}
        underlineActive={toolbarState.underline}
        backgroundColorValue={backgroundColor}
        textColorValue={textColor}
        disableContainerPadding
        />
      )}
      <div ref={editorViewportRef} className={styles.viewport} data-sgui-part="editor-viewport"
        role="region" tabIndex={0} aria-label={t("editor.documentScrollRegion", { defaultMessage: "Document scroll region" })}>
        <div className={styles.document}>
          <LexicalComposer
            key={editorKey}
            initialConfig={{
              namespace: "experience-native-content-page",
              theme: EXPERIENCE_EDITOR_THEME,
              onError: () => {},
              editable: !readOnly,
              editorState: initialEditorState,
              nodes: EXPERIENCE_EDITOR_NODES,
            }}
          >
            {readOnly ? null : (
              <FloatingTextSelectionToolbar
                boundaryRef={editorViewportRef}
                onRequestLink={openLinkModal}
                onRequestLinkMouseDown={capturePendingLinkSelection}
              />
            )}
            <ToolbarBridge readOnly={readOnly}
              onReady={(editor) => setEditorRef(editor)}
              onSelectionSnapshotChange={(snapshot) => {
                selectionSnapshotRef.current = snapshot;
              }}
              onStateChange={(nextState) => setToolbarState(nextState)}
            />
            <RichTextPlugin
              ErrorBoundary={LexicalErrorBoundary}
              contentEditable={(
                <ContentEditable className={styles.editable} tabIndex={0}
                  aria-label={accessibleName ?? t("editor.document", { defaultMessage: "Document" })}
                  onKeyDown={(event) => {
                    // A non-editable div has no native scoped Select All behavior.
                    // Keep copying local to the focused read-only document; Lexical
                    // retains all keyboard handling while the document is editable.
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
                  }} />
              )}
              placeholder={(
                readOnly ? null : (
                  <div className={styles.placeholder}>
                    {placeholder ?? t("editor.placeholder", { defaultMessage: "Start writing page content..." })}
                  </div>
                )
              )}
            />
            <ExperienceEditorPlugins onChange={onLexicalChange} />
          </LexicalComposer>
        </div>
      </div>
      <LinkUrlModal
        initialDisplayText={linkModalInitialDisplayText}
        key={linkModalSession}
        initialUrl={linkModalInitialUrl}
        onClose={() => {
          setLinkModalOpen(false);
          setActiveLinkNodeKey(null);
          pendingLinkSelectionRef.current = null;
          pendingLinkSelectedTextRef.current = "";
        }}
        onSubmit={applyLink}
        open={linkModalOpen}
      />
      <ColumnsLayoutModal
        onClose={() => setColumnsLayoutModalOpen(false)}
        onSubmit={(preset) => {
          insertColumnsLayout(preset);
          setColumnsLayoutModalOpen(false);
        }}
        open={columnsLayoutModalOpen}
      />
      <ImageUploadModal
        enableAltText
        errorMessage={imageUploadError}
        onClose={() => {
          imageUploadSessionRef.current += 1;
          setImageUploadModalOpen(false);
          setImageUploadError(null);
          setImageUploading(false);
        }}
        onSubmit={async (file, altText) => {
          const uploadSession = imageUploadSessionRef.current;
          try {
            setImageUploading(true);
            setImageUploadError(null);
            const uploaded = onUploadImage
              ? await onUploadImage(file)
              : {
                  assetId: "local-preview",
                  assetVersionId: "local-preview-v1",
                  src: URL.createObjectURL(file),
                  altText: file.name,
                  width: null,
                  height: null,
                };
            if (imageUploadSessionRef.current !== uploadSession) return;
            dispatchInsertCommand(INSERT_IMAGE_COMMAND, {
              src: uploaded.src,
              altText: altText ?? uploaded.altText ?? file.name,
              width: uploaded.width ?? null,
              height: uploaded.height ?? null,
              assetId: uploaded.assetId,
              assetVersionId: uploaded.assetVersionId,
            });
            setImageUploadModalOpen(false);
          } catch (error) {
            if (imageUploadSessionRef.current === uploadSession) {
              setImageUploadError(error instanceof Error ? error.message : t("editor.imageUploadFailed", { defaultMessage: "Image upload failed." }));
            }
          } finally {
            if (imageUploadSessionRef.current === uploadSession) setImageUploading(false);
          }
        }}
        open={imageUploadModalOpen}
        uploading={imageUploading}
      />
    </div>
  );
});
