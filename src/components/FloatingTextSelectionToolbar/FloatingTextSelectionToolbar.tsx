import { useEffect, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import type { RefObject } from "react";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import LinkIcon from "@mui/icons-material/Link";
import SubscriptIcon from "@mui/icons-material/Subscript";
import SuperscriptIcon from "@mui/icons-material/Superscript";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useRef } from "react";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  type TextFormatType,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";

type ToolbarFormats = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  subscript: boolean;
  superscript: boolean;
};

type Position = {
  left: number;
  top: number;
};

const DEFAULT_FORMATS: ToolbarFormats = {
  bold: false,
  italic: false,
  subscript: false,
  superscript: false,
  underline: false,
};

export type FloatingTextSelectionToolbarProps = {
  boundaryRef?: RefObject<HTMLElement | null>;
  onRequestLink?: () => void;
  onRequestLinkMouseDown?: () => void;
};

export function FloatingTextSelectionToolbar({
  boundaryRef,
  onRequestLink,
  onRequestLinkMouseDown,
}: FloatingTextSelectionToolbarProps) {
  const [editor] = useLexicalComposerContext();
  const [formats, setFormats] = useState<ToolbarFormats>(DEFAULT_FORMATS);
  const [position, setPosition] = useState<Position>({ left: 24, top: 24 });
  const [visible, setVisible] = useState(false);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const [toolbarSize, setToolbarSize] = useState({ height: 44, width: 460 });

  useEffect(() => {
    const element = toolbarRef.current;
    if (!element || typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => {
      const rect = element.getBoundingClientRect();
      setToolbarSize({ height: rect.height, width: rect.width });
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateToolbar = () => {
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || selection.isCollapsed()) {
          setVisible(false);
          setFormats(DEFAULT_FORMATS);
          return;
        }

        const domSelection = window.getSelection();
        if (!domSelection || domSelection.rangeCount === 0) {
          setVisible(false);
          return;
        }
        const rootElement = editor.getRootElement();
        const anchorNode = domSelection.anchorNode;
        const focusNode = domSelection.focusNode;
        if (
          !rootElement
          || !anchorNode
          || !focusNode
          || !rootElement.contains(anchorNode)
          || !rootElement.contains(focusNode)
        ) {
          setVisible(false);
          return;
        }

        const range = domSelection.getRangeAt(0);
        const clientRects = range.getClientRects();
        const rect = clientRects.length > 0 ? clientRects[0] : range.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) {
          setVisible(false);
          return;
        }

        setFormats({
          bold: selection.hasFormat("bold"),
          italic: selection.hasFormat("italic"),
          subscript: selection.hasFormat("subscript"),
          superscript: selection.hasFormat("superscript"),
          underline: selection.hasFormat("underline"),
        });

        const gutter = 8;
        const viewportPadding = 12;
        const scopeRect = boundaryRef?.current
          ? boundaryRef.current.getBoundingClientRect()
          : {
              bottom: window.innerHeight - viewportPadding,
              left: viewportPadding,
              right: window.innerWidth - viewportPadding,
              top: viewportPadding,
            };
        const startX = rect.left;
        const placeRightLeft = startX;
        const placeLeftLeft = startX - toolbarSize.width;
        const left = placeRightLeft + toolbarSize.width <= scopeRect.right
          ? placeRightLeft
          : placeLeftLeft >= scopeRect.left
            ? placeLeftLeft
            : Math.max(scopeRect.left, Math.min(placeRightLeft, scopeRect.right - toolbarSize.width));

        const aboveTop = rect.top - toolbarSize.height - gutter;
        const belowTop = rect.bottom + gutter;
        const top = aboveTop >= scopeRect.top
          ? aboveTop
          : Math.min(belowTop, scopeRect.bottom - toolbarSize.height);

        setPosition({
          left,
          top,
        });
        setVisible(true);
      });
    };

    return mergeRegister(
      editor.registerUpdateListener(() => {
        updateToolbar();
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        1,
      ),
    );
  }, [boundaryRef, editor, toolbarSize.height, toolbarSize.width]);

  useEffect(() => {
    const hideToolbar = () => {
      setVisible(false);
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      const toolbarElement = toolbarRef.current;
      if (toolbarElement?.contains(target)) {
        return;
      }
      const boundaryElement = boundaryRef?.current;
      const rootElement = editor.getRootElement();
      if (
        (boundaryElement && boundaryElement.contains(target))
        || (rootElement && rootElement.contains(target))
      ) {
        return;
      }
      hideToolbar();
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("blur", hideToolbar);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("blur", hideToolbar);
    };
  }, [boundaryRef, editor]);

  const dispatchFormat = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const buttonSx = (active: boolean) => ({
    bgcolor: active ? "action.selected" : "transparent",
    borderRadius: 1,
    color: "text.secondary",
    p: 0.5,
  });

  const onMouseDown = (event: ReactMouseEvent) => {
    event.preventDefault();
  };

  const controls = [
    { active: formats.bold, icon: <FormatBoldIcon fontSize="small" />, id: "bold", onClick: () => dispatchFormat("bold") },
    { active: formats.italic, icon: <FormatItalicIcon fontSize="small" />, id: "italic", onClick: () => dispatchFormat("italic") },
    { active: formats.underline, icon: <FormatUnderlinedIcon fontSize="small" />, id: "underline", onClick: () => dispatchFormat("underline") },
    { active: formats.subscript, icon: <SubscriptIcon fontSize="small" />, id: "subscript", onClick: () => dispatchFormat("subscript") },
    { active: formats.superscript, icon: <SuperscriptIcon fontSize="small" />, id: "superscript", onClick: () => dispatchFormat("superscript") },
    {
      active: false,
      icon: <LinkIcon fontSize="small" />,
      id: "link",
      onClick: () => onRequestLink?.(),
      onMouseDown: () => onRequestLinkMouseDown?.(),
    },
  ];

  return (
    <Box
      onMouseDown={onMouseDown}
      ref={toolbarRef}
      sx={{
        alignItems: "center",
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        boxShadow: 3,
        display: "flex",
        gap: 0.25,
        left: position.left,
        opacity: visible ? 1 : 0,
        p: 0.5,
        pointerEvents: visible ? "auto" : "none",
        position: "fixed",
        top: position.top,
        transform: visible ? "translateY(0) scale(1)" : "translateY(4px) scale(0.98)",
        transition: "opacity 160ms ease, transform 180ms ease",
        zIndex: 1400,
      }}
    >
      {controls.map((control) => (
        <IconButton
          key={control.id}
          onClick={control.onClick}
          onMouseDown={(event) => {
            event.preventDefault();
            control.onMouseDown?.();
          }}
          size="small"
          sx={buttonSx(control.active)}
        >
          {control.icon}
        </IconButton>
      ))}
    </Box>
  );
}
