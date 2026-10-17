import { createEditor } from "lexical";
import { EXPERIENCE_EDITOR_NODES } from "./editorConfig";

// The public toolbar and saved corpus emit text formatting, not layout CSS.
const REGISTERED_TYPES = new Set(["root", "paragraph", "text", "tab", "linebreak",
  ...EXPERIENCE_EDITOR_NODES.map(entry => typeof entry === "function" ? entry.getType() : entry.replace.getType()),
]);
const TEXT_FORMAT_PROPERTIES = new Set([
  "color", "background-color", "font-family", "font-size", "font-weight", "font-style",
  "font-variant", "font-variant-caps", "font-variant-numeric", "letter-spacing", "line-height",
  "text-decoration", "text-decoration-color", "text-decoration-line", "text-decoration-style",
  "text-decoration-thickness", "text-transform", "vertical-align", "white-space", "--lp-text-variant",
]);
/** Decode token spelling only after parsing raw declaration boundaries. */
function normalizedToken(value: string) {
  return value.replace(/\\([0-9a-f]{1,6})\s?/gi, (_, hex: string) => {
    const code = Number.parseInt(hex, 16);
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : "\ufffd";
  }).replace(/\\([^\n\r\f])/g, "$1");
}
function isTextFormattingStyle(style: string): boolean {
  const declarations: string[] = [];
  let current = ""; let quote = ""; let depth = 0;
  for (let index = 0; index < style.length; index++) {
    const char = style[index];
    if (char === "\\") {
      if (index + 1 === style.length) return false;
      current += char + style[++index]; continue;
    }
    if (quote) { current += char; if (char === quote) quote = ""; continue; }
    if (char === "'" || char === '\"') { quote = char; current += char; continue; }
    if (char === "/" && style[index + 1] === "*") {
      const end = style.indexOf("*/", index + 2); if (end < 0) return false;
      index = end + 1; continue;
    }
    if (char === "{" || char === "}") return false;
    if (char === "(") depth++;
    if (char === ")" && --depth < 0) return false;
    if (char === ";" && depth === 0) { declarations.push(current); current = ""; }
    else current += char;
  }
  if (quote || depth) return false;
  declarations.push(current);
  return declarations.every(declaration => {
    if (!declaration.trim()) return true;
    const colon = declaration.indexOf(":"); if (colon < 0) return false;
    const property = normalizedToken(declaration.slice(0, colon)).trim().toLowerCase();
    const value = normalizedToken(declaration.slice(colon + 1));
    return TEXT_FORMAT_PROPERTIES.has(property) && Boolean(value.trim())
      && !/\b(?:url|image|image-set|-webkit-image-set|cross-fade|paint|element|expression)\s*\(|@import/i.test(value);
  });
}
function validateNodes(node: unknown): void {
  if (!node || typeof node !== "object" || Array.isArray(node)) throw new Error("Invalid saved node");
  const value = node as Record<string, unknown>;
  if (typeof value.type !== "string" || !REGISTERED_TYPES.has(value.type)) throw new Error("Invalid saved node type");
  // HeadingNode.createDOM uses its serialized tag directly. Keep that DOM
  // boundary inside the shipped heading contract, even if headless parse accepts it.
  if (value.type === "heading" && (typeof value.tag !== "string" || !/^h[1-6]$/.test(value.tag))) throw new Error("Invalid saved heading tag");
  if (value.type === "text" || value.type === "tab" || value.type === "code-highlight") {
    if (typeof value.text !== "string") throw new Error("Invalid saved text");
  }
  if (value.type === "link" || value.type === "sgui-link") {
    if (typeof value.url !== "string") throw new Error("Invalid saved link destination");
    for (const property of ["target", "rel", "title"] as const) {
      if (value[property] != null && typeof value[property] !== "string") throw new Error("Invalid saved link metadata");
    }
  }
  if (value.version !== undefined && (typeof value.version !== "number" || !Number.isFinite(value.version))) throw new Error("Invalid saved node version");
  // ElementNode.textStyle seeds future typing; checking visible TextNode.style
  // alone would let an empty paragraph activate rejected CSS on the next key.
  for (const property of ["style", "textStyle"] as const) {
    const style = value[property];
    if (style === undefined) continue;
    if (typeof style !== "string") throw new Error("Invalid saved node style");
    if (!isTextFormattingStyle(style)) throw new Error("Unsupported saved text formatting style");
  }
  if (value.children !== undefined) {
    if (!Array.isArray(value.children)) throw new Error("Invalid saved children");
    value.children.forEach(validateNodes);
  }
}

/** An all-or-nothing admission check, not a schema migration or sanitizer. */
export function prepareEditorDocument(value: unknown): string | null {
  try {
    const serialized = JSON.stringify(value);
    if (typeof serialized !== "string") return null;
    const document = JSON.parse(serialized) as { root?: unknown };
    if (!document || typeof document !== "object" || !document.root || (document.root as { type?: unknown }).type !== "root") return null;
    validateNodes(document.root);
    // Use the same registered factories with a throwing handler. A swallowed
    // Lexical import error must never become editable partial host content.
    const probe = createEditor({ namespace: "sgui-document-admission", nodes: EXPERIENCE_EDITOR_NODES,
      onError: error => { throw error; } });
    const parsed = probe.parseEditorState(serialized);
    if (parsed.isEmpty()) return null;
    return serialized;
  } catch {
    return null;
  }
}

/** Same-namespace JSON clipboard imports bypass initial document loading. */
export function isSafeEditorClipboardJSON(serialized: string, namespace: string): boolean {
  if (!serialized) return true;
  try {
    const payload = JSON.parse(serialized) as { namespace?: unknown; nodes?: unknown };
    // Lexical ignores foreign namespaces and uses its ordinary HTML/text importer.
    if (payload?.namespace !== namespace) return true;
    if (!Array.isArray(payload.nodes)) return false;
    payload.nodes.forEach(validateNodes);
    return true;
  } catch {
    return false;
  }
}
