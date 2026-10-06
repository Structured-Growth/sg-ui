import { CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { ImageNode } from "./ImageNode";

export const EXPERIENCE_EDITOR_NODES = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  LinkNode,
  CodeNode,
  ImageNode,
  HorizontalRuleNode,
  TableNode,
  TableRowNode,
  TableCellNode,
];

export const EXPERIENCE_EDITOR_THEME = {
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5",
    h6: "editor-heading-h6",
  },
  hr: "editor-horizontal-rule",
  hrSelected: "editor-horizontal-rule-selected",
  link: "editor-link",
  text: {
    bold: "editor-text-bold",
    code: "editor-text-code",
    italic: "editor-text-italic",
    strikethrough: "editor-text-strikethrough",
    subscript: "editor-text-subscript",
    superscript: "editor-text-superscript",
    underline: "editor-text-underline",
    underlineStrikethrough: "editor-text-underlineStrikethrough",
  },
};
