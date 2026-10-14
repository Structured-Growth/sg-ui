import type {ScopeStyle, ColorTheme} from '@structured-growth/sg-ui/theme';
import {resolveTheme} from '../theme';
/** Fixed app-owned identity. Overlay portals receive the same resolved semantic scope. */
export function docsTheme(theme:ColorTheme):ScopeStyle {
  return resolveTheme('structured-growth',theme === 'dark' ? 'dark' : 'light');
}
