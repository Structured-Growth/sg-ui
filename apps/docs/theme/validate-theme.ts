import {themeGraph, semanticRoles, type ThemeGraph, type SemanticMap, type ThemeIdentity, type Appearance, type Contrast} from './theme-graph';
import {resolveSemantics} from './resolve-theme';
const identityNames:ThemeIdentity[] = ['material','apple','editorial','structured-growth'];
const appearances:Appearance[] = ['light','dark'];
const contrasts:Contrast[] = ['standard','increased'];
const sameKeys = (actual:string[], expected:readonly string[], context:string) => {
  const missing = expected.filter(key => !actual.includes(key));
  const unknown = actual.filter(key => !expected.includes(key));
  if (missing.length || unknown.length) throw new Error(`${context} completeness: missing [${missing.join(', ')}], unknown [${unknown.join(', ')}]`);
};
export function validateThemeGraph(graph:ThemeGraph = themeGraph) {
  sameKeys([...graph.semanticRoles],semanticRoles,'Semantic role inventory');
  if (new Set(graph.semanticRoles).size !== semanticRoles.length) throw new Error('Semantic role inventory contains duplicates');
  sameKeys(Object.keys(graph.themes),identityNames,'Theme identities');
  sameKeys(Object.keys(graph.identitySettings),identityNames,'Identity settings');
  const checkMap = (map:SemanticMap, context:string) => {
    sameKeys(Object.keys(map),semanticRoles,context);
    resolveSemantics(map,graph);
  };
  for (const [name,colors] of Object.entries(graph.palettes)) for (const [key,value] of Object.entries(colors)) {
    if (typeof value !== 'string' || (name === 'os'
      ? !['Canvas','CanvasText','ButtonFace','ButtonText','GrayText','Highlight','HighlightText'].includes(value)
      : !/^#[\da-f]{6}(?:[\da-f]{2})?$/i.test(value))) throw new Error(`Raw palette value is invalid: palette.${name}.${key}`);
  }
  for (const identity of identityNames) {
    const modes = graph.themes[identity];
    sameKeys(Object.keys(modes),appearances,`${identity} appearances`);
    const settings = graph.identitySettings[identity];
    if (!settings.fontFamily || !settings.controlRadius || !settings.fieldRadius) throw new Error(`Incomplete identity settings: ${identity}`);
    for (const appearance of appearances) {
      sameKeys(Object.keys(modes[appearance]),contrasts,`${identity}/${appearance} contrast modes`);
      for (const contrast of contrasts) checkMap(modes[appearance][contrast],`${identity}/${appearance}/${contrast}`);
    }
  }
  checkMap(graph.forcedColors,'Forced colors');
  return {identities:identityNames.length, semanticRoles:semanticRoles.length, maps:identityNames.length * appearances.length * contrasts.length + 1};
}
