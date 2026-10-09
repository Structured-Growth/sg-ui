import postcss from 'postcss';
import { resolve } from 'node:path';

const typography = new Set(['font', 'font-family', 'font-size', 'font-weight', 'line-height']);
const inheritance = /^(?:inherit|unset|revert|revert-layer)$/i;

// Existing shared rich-document semantics, not component typography roles.
// Match the exact source, entire rule selector, property and value. All other
// declarations and every layer/token/selector check still run.
const semanticContentPath = 'src/components/PageRichTextEditorSection/PageRichTextEditorSection.module.css';
const semanticContent = new Map([
  ['.document :global(.editor-text-bold)', ['font-weight', '700']],
  ['.document :global(.editor-text-subscript)', ['font-size', '0.75em']],
  ['.document :global(.editor-text-superscript)', ['font-size', '0.75em']],
]);
function sharedSemanticContent(path, decl, value) {
  const contract = semanticContent.get(decl.parent?.selector?.trim());
  return resolve(path) === resolve(semanticContentPath) && contract?.[0] === decl.prop && contract[1] === value;
}

// Keep selector syntax and attribute names visible while masking quoted data,
// including escaped quotes. Never discard an entire selector or attribute.
function withoutQuotedData(selector) {
  let quote;
  let result = '';
  for (let i = 0; i < selector.length; i++) {
    const char = selector[i];
    if (quote) {
      if (char === '\\') { i++; result += '  '; continue; }
      if (char === quote) quote = undefined;
      result += ' ';
    } else if (char === '"' || char === "'") { quote = char; result += ' '; }
    else result += char;
  }
  return result;
}

// Only positive local classes outside functional pseudos prove module ownership.
// Classes in :not/:has/:is may describe another element or an alternative branch.
function hasLocalAnchor(selector) {
  let depth = 0;
  let quote;
  let attribute = false;
  for (let i = 0; i < selector.length; i++) {
    const char = selector[i];
    if (char === '\\') { i++; continue; }
    if (quote) { if (char === quote) quote = undefined; continue; }
    if (char === '"' || char === "'") { quote = char; continue; }
    if (char === '[') { attribute = true; continue; }
    if (char === ']') { attribute = false; continue; }
    if (attribute) continue;
    if (char === '(') { depth++; continue; }
    if (char === ')') { depth--; continue; }
    if (!depth && char === '.' && /[\w-]/.test(selector[i + 1] ?? '')) return true;
  }
  return false;
}

function scoped(selector) {
  // Explicit local functions are positive anchors; global functions never are.
  const local = selector.replace(/\/\*[\s\S]*?\*\//g, '').replace(/:global\([^()]*\)/g, '').replace(/:local\((\.[\w-]+)\)/g, '$1');
  // Bare :global changes the rest of the selector's mode. A prior local anchor
  // can still scope a descendant, but a later class cannot prove ownership.
  return hasLocalAnchor(local.split(/:global(?![\w-(])/)[0]);
}

function ancestor(node, predicate) {
  for (let parent = node.parent; parent; parent = parent.parent) if (predicate(parent)) return parent;
}

/** Return all bounded C-18 diagnostics; never mutate or suppress source rules. */
export function validateComponentCss(code, { path = '<component.css>', variables = new Set() } = {}) {
  const css = postcss.parse(code, { from: path });
  const errors = [];
  const fail = (node, message) => errors.push(`${path}:${node.source.start.line}:${node.source.start.column}: ${message}`);
  css.walkRules(rule => {
    const layer = ancestor(rule, node => node.type === 'atrule' && node.name === 'layer');
    if (layer?.params !== 'sgui.components') fail(rule, 'Unlayered component rule');
    if (ancestor(rule, node => node.type === 'atrule' && /^(?:-webkit-)?keyframes$/i.test(node.name))) return;
    for (const selector of postcss.list.comma(rule.selector.replace(/\/\*[\s\S]*?\*\//g, ''))) {
      if (/\.Mui[A-Z][\w-]*|\.(?:css|jss)-[\w-]+|\[\s*data-emotion(?=[\s~|^$*=\]])/.test(withoutQuotedData(selector))) fail(rule, `Retired foundation selector: ${selector}`);
      // Preserve and extend the original host-selector prohibition, including
      // functional pseudos and global wrappers; quoted attribute values are inert.
      const unquoted = selector.replace(/\[[^\]]*\]/g, '');
      if (/:root\b/i.test(unquoted) || /(^|[\s,>(+~])(?:body|html|:root)(?=$|[\s,.:[)>+~])/i.test(unquoted)) fail(rule, `Global host selector: ${selector}`);
      const parentScope = selector.includes('&') && ancestor(rule, node => node.type === 'rule' && postcss.list.comma(node.selector).every(scoped));
      if (!scoped(selector) && !parentScope) fail(rule, `Unscoped component selector: ${selector}`);
    }
  });
  css.walkDecls(decl => {
    const value = decl.value.replace(/\/\*[\s\S]*?\*\//g, '').trim();
    for (const match of value.matchAll(/var\(\s*(--sgui-[\w-]+)/g)) {
      if (!variables.has(match[1])) fail(decl, `Unknown token ${match[1]}`);
    }
    if (!typography.has(decl.prop.toLowerCase())) return;
    // An owned var must supply the value, or participate in CSS math. Merely
    // mentioning a token beside a literal (or as a fallback) is insufficient.
    if (inheritance.test(value) || sharedSemanticContent(path, decl, value)) return;
    const token = 'var\\(\\s*--sgui-[\\w-]+\\s*\\)';
    const direct = new RegExp(`^${token}$`).test(value);
    const math = /^(?:calc|min|max|clamp)\(/.test(value) && new RegExp(token).test(value)
      && !/[a-z%]/i.test(value.replace(new RegExp(token, 'g'), '').replace(/\b(?:calc|min|max|clamp)\b/g, ''));
    if (!direct && !math) fail(decl, `Ad hoc typography ${decl.prop}: ${decl.value}`);
  });
  return errors;
}
