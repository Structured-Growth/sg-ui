import type {ScopeStyle} from '@structured-growth/sg-ui/theme';
import {themeGraph, semanticRoles, type ThemeGraph, type ThemeIdentity, type Appearance, type Contrast, type SemanticMap, type SemanticRole} from './theme-graph';

export function resolveSemantics(map:SemanticMap, graph:ThemeGraph = themeGraph):Record<SemanticRole,string> {
  const resolved = {} as Record<SemanticRole,string>;
  const visiting = new Set<string>();
  const roles = new Set<string>(semanticRoles);
  const resolve = (role:SemanticRole):string => {
    if (resolved[role] !== undefined) return resolved[role];
    if (visiting.has(role)) throw new Error(`Theme semantic reference cycle: ${[...visiting,role].join(' → ')}`);
    visiting.add(role);
    const reference:string = map[role];
    if (typeof reference !== 'string') throw new Error(`Missing semantic role: ${role}`);
    let value:string;
    if (reference.startsWith('semantic.')) {
      const next = reference.slice('semantic.'.length);
      if (!roles.has(next)) throw new Error(`Unknown semantic reference: ${role} → ${reference}`);
      value = resolve(next as SemanticRole);
    } else if (reference.startsWith('palette.')) {
      const [,palette,key,...extra] = reference.split('.');
      const colors = graph.palettes as Record<string, Record<string,string>>;
      const raw = !extra.length ? colors[palette!]?.[key!] : undefined;
      if (typeof raw !== 'string') throw new Error(`Unknown palette reference: ${role} → ${reference}`);
      value = raw;
    } else {
      throw new Error(`Semantic colors must reference named palettes or semantics: ${role} → ${reference}`);
    }
    visiting.delete(role);
    resolved[role] = value;
    return value;
  };
  for (const role of semanticRoles) resolve(role);
  return resolved;
}
export const semanticCssName = (role:SemanticRole) => `--sgui-${role.replace(/[A-Z]/g,letter => '-' + letter.toLowerCase())}` as const;

/** Resolve colors before applying the scope so snippets are standalone and contrast inspection is deterministic. */
export function resolveTheme(identity:ThemeIdentity, appearance:Appearance, contrast:Contrast = 'standard', osForcedColors = false):ScopeStyle {
  const semantics = resolveSemantics(osForcedColors ? themeGraph.forcedColors : themeGraph.themes[identity][appearance][contrast]);
  const settings = themeGraph.identitySettings[identity];
  const style:ScopeStyle = Object.fromEntries(semanticRoles.map(role => [semanticCssName(role),semantics[role]]));
  return {...style,
    '--sgui-font-family':settings.fontFamily,
    '--sgui-control-radius':settings.controlRadius,
    '--sgui-field-radius':settings.fieldRadius,
    '--sgui-focus-width':osForcedColors || contrast === 'increased' ? '0.1875rem' : '0.125rem',
  };
}
