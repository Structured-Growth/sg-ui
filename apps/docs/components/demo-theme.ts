import {defaultThemeTokens} from '@structured-growth/sg-ui/tokens';
import type {ScopeStyle} from '@structured-growth/sg-ui/theme';
import {resolveTheme} from '../theme';
export type DemoIdentity = 'none' | 'material' | 'apple' | 'editorial';
export type DemoMode = 'light' | 'dark' | 'system';
export type DemoContrast = 'standard' | 'increased' | 'system';
export type ResolvedMode = 'light' | 'dark';
export const identities = [
  {id:'none', label:'None — global defaults'},
  {id:'material', label:'Material Design'},
  {id:'apple', label:'Apple Human Interface'},
  {id:'editorial', label:'Editorial'},
] as const;
/** Inspired identities with complete palette-backed semantics; component aliases rebind inside owned scopes. */
export function demoTokens(mode:ResolvedMode, identity:DemoIdentity, contrast:'standard' | 'increased' = 'standard', forcedColors = false):ScopeStyle {
  if(identity==='none') {
    const defaults=defaultThemeTokens[mode];
    return contrast==='standard'&&!forcedColors ? {...defaults} : {...defaults,...resolveTheme('none',mode,contrast,forcedColors)};
  }
  return resolveTheme(identity,mode,contrast,forcedColors);
}
