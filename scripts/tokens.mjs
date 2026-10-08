import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const sourcePath = new URL('../src/foundation/tokens.json', import.meta.url);
const cssPath = new URL('../src/foundation/tokens.css', import.meta.url);
const tsPath = new URL('../src/foundation/tokens.generated.ts', import.meta.url);
const name = key => `--sgui-${key.replace(/[A-Z]/g, char => `-${char.toLowerCase()}`)}`;

export function compileTokens(source) {
  const groups = ['base', 'shared', 'light', 'dark', 'compact', 'comfortable', 'component'];
  for (const group of Object.keys(source)) {
    if (!groups.includes(group)) throw new Error(`Unknown token group: ${group}`);
  }
  for (const group of groups) {
    if (!source[group] || typeof source[group] !== 'object' || Array.isArray(source[group]) || !Object.keys(source[group]).length) {
      throw new Error(`Missing token group: ${group}`);
    }
  }
  const tokens = new Map();
  for (const [group, entries] of Object.entries(source)) {
    for (const [key, token] of Object.entries(entries)) {
      if (!/^[a-z][A-Za-z0-9]*$/.test(key)) throw new Error(`Invalid token name: ${key}`);
      if (!token || typeof token !== 'object' || !('$value' in token) || !('$type' in token)) {
        throw new Error(`Invalid token record: ${group}.${key}`);
      }
      tokens.set(`${group}.${key}`, token);
    }
  }
  function resolve(path, stack = []) {
    if (stack.includes(path)) throw new Error(`Token cycle: ${[...stack, path].join(' -> ')}`);
    const token = tokens.get(path);
    if (!token) throw new Error(`Unknown token: ${path}`);
    const alias = /^\{([^}]+)\}$/.exec(String(token.$value));
    if (alias) {
      const target = tokens.get(alias[1]);
      if (target && target.$type !== token.$type) throw new Error(`Alias type mismatch: ${path}`);
      return resolve(alias[1], [...stack, path]);
    }
    const validators = {
      color: value => /^#[\da-f]{6}([\da-f]{2})?$/i.test(value),
      dimension: value => /^(\d+(\.\d+)?)rem$/.test(value),
      duration: value => /^\d+ms$/.test(value),
      number: value => typeof value === 'number' && Number.isFinite(value),
      fontFamily: value => typeof value === 'string' && !/[;{}\n]/.test(value),
      shadow: value => typeof value === 'string' && /^\d+rem \d+(\.\d+)?rem \d+(\.\d+)?rem #[\da-f]{8}$/i.test(value),
    };
    if (!validators[token.$type]?.(token.$value)) throw new Error(`Invalid token value/type: ${path}`);
    return token.$value;
  }
  for (const [first, second] of [['light', 'dark'], ['compact', 'comfortable']]) {
    if (Object.keys(source[first]).sort().join() !== Object.keys(source[second]).sort().join()) {
      throw new Error(`Unpaired token groups: ${first}/${second}`);
    }
    for (const key of Object.keys(source[first])) {
      if (source[first][key].$type !== source[second][key].$type) throw new Error(`Unpaired token types: ${key}`);
    }
  }
  for (const path of tokens.keys()) resolve(path);
  const aliasOf = token => /^\{([^}]+)\}$/.exec(String(token.$value))?.[1];
  const allowed = {
    base: [], shared: ['base'], light: ['base', 'light'], dark: ['base', 'dark'],
    compact: ['base', 'shared'], comfortable: ['base', 'shared'],
    component: ['shared', 'light', 'compact', 'component'],
  };
  for (const [path, token] of tokens) {
    const group = path.split('.')[0], alias = aliasOf(token);
    if (group !== 'base' && !alias) throw new Error(`Role token must alias an allowed tier: ${path}`);
    if (alias && !allowed[group].includes(alias.split('.')[0])) throw new Error(`Invalid tier alias: ${path} -> ${alias}`);
    if (['light', 'dark'].includes(group) && token.$type !== 'color') throw new Error(`Semantic token must be color: ${path}`);
  }
  // Same-theme aliases are emitted as variables and rebound on every scope.
  // Require matching topology so a density-only/nested scope has one unambiguous graph.
  const localAlias = (group, key) => {
    const alias = aliasOf(source[group][key]);
    return alias?.startsWith(`${group}.`) ? alias.split('.')[1] : undefined;
  };
  for (const key of Object.keys(source.light)) {
    if (localAlias('light', key) !== localAlias('dark', key)) throw new Error(`Unpaired semantic alias: ${key}`);
  }
  const emittedGroups = ['shared', 'light', 'compact', 'component'];
  const names = new Set();
  for (const group of emittedGroups) {
    for (const key of Object.keys(source[group])) {
      if (names.has(name(key))) throw new Error(`Duplicate emitted token: ${key}`);
      names.add(name(key));
    }
  }
  const value = (group, key) => {
    const alias = aliasOf(source[group][key]);
    return alias && (group === 'component' || alias.startsWith(`${group}.`))
      ? `var(${name(alias.split('.')[1])})` : resolve(`${group}.${key}`);
  };
  const declarations = (group, keys = Object.keys(source[group])) => keys.map(key => `    ${name(key)}: ${value(group, key)};`).join('\n');
  const components = '\n' + declarations('component');
  const semanticAliases = declarations('light', Object.keys(source.light).filter(key => localAlias('light', key)));
  const block = (selector, group, extra = '') => `  ${selector} {\n${declarations(group)}${extra}\n  }`;
  const css = `/* Generated by scripts/tokens.mjs; edit tokens.json. */\n@layer sgui.tokens, sgui.components;\n@layer sgui.tokens {\n${block(':where([data-sgui-scope])', 'shared', '\n' + semanticAliases + components)}\n${block(':where([data-sgui-theme="light"], [data-sgui-theme="system"])', 'light', components + '\n    color-scheme: light;')}\n${block(':where([data-sgui-theme="dark"])', 'dark', components + '\n    color-scheme: dark;')}\n  @media (prefers-color-scheme: dark) {\n${block(':where([data-sgui-theme="system"])', 'dark', components + '\n    color-scheme: dark;')}\n  }\n${block(':where([data-sgui-density="compact"])', 'compact', '\n' + semanticAliases + components)}\n${block(':where([data-sgui-density="comfortable"])', 'comfortable', '\n' + semanticAliases + components)}\n}\n`;
  const keys = [...new Set(emittedGroups.flatMap(group => Object.keys(source[group])))];
  const ts = `// Generated by scripts/tokens.mjs; edit tokens.json.\nexport const tokens = ${JSON.stringify(Object.fromEntries(keys.map(key => [key, `var(${name(key)})`])), null, 2)} as const;\nexport type TokenName = keyof typeof tokens;\nexport const tokenTiers = ${JSON.stringify(Object.fromEntries([['shared', 'shared'], ['semantic', 'light'], ['density', 'compact'], ['component', 'component']].map(([tier, group]) => [tier, Object.keys(source[group])])), null, 2)} as const;\nexport type SemanticTokenName = typeof tokenTiers.semantic[number];\nexport type ComponentTokenName = typeof tokenTiers.component[number];\n`;
  return { css, ts };
}

export async function generateTokens({ check = false } = {}) {
  const { css, ts } = compileTokens(JSON.parse(await readFile(sourcePath, 'utf8')));
  for (const [path, expected] of [[cssPath, css], [tsPath, ts]]) {
    if (check) {
      if (await readFile(path, 'utf8') !== expected) throw new Error(`${path.pathname} is stale; run pnpm tokens:generate`);
    } else await writeFile(path, expected);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await generateTokens({ check: process.argv.includes('--check') });
}
