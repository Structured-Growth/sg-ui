import type {ScopeStyle} from '@structured-growth/sg-ui/theme';
import {resolveTheme} from '../theme';
export type DemoIdentity = 'material' | 'apple' | 'editorial';
export type DemoMode = 'light' | 'dark' | 'system';
export type DemoContrast = 'standard' | 'increased' | 'system';
export type ResolvedMode = 'light' | 'dark';
export const identities = [
  {id:'material', label:'Material Design'},
  {id:'apple', label:'Apple Human Interface'},
  {id:'editorial', label:'Editorial'},
] as const;
/** Inspired identities with complete palette-backed semantics; component aliases rebind inside owned scopes. */
export function demoTokens(mode:ResolvedMode, identity:DemoIdentity, contrast:'standard' | 'increased' = 'standard', forcedColors = false):ScopeStyle {
  return resolveTheme(identity,mode,contrast,forcedColors);
}
