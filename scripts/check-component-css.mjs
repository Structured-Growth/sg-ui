import postcss from 'postcss';

const typography = new Set(['font', 'font-family', 'font-size', 'font-weight', 'line-height']);
const inheritance = /^(?:inherit|unset|revert|revert-layer)$/i;

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
      if (/Mui[A-Z]|\.(?:css|jss)-[\w-]+|data-emotion/.test(selector)) fail(rule, `Retired foundation selector: ${selector}`);
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
    if (inheritance.test(value)) return;
    const token = 'var\\(\\s*--sgui-[\\w-]+\\s*\\)';
    const direct = new RegExp(`^${token}$`).test(value);
    const math = /^(?:calc|min|max|clamp)\(/.test(value) && new RegExp(token).test(value)
      && !/[a-z]/i.test(value.replace(new RegExp(token, 'g'), '').replace(/\b(?:calc|min|max|clamp)\b/g, ''));
    if (!direct && !math) fail(decl, `Ad hoc typography ${decl.prop}: ${decl.value}`);
  });
  return errors;
}
