import type {ReactNode} from 'react';
import {Provider} from '@structured-growth/sg-ui/theme';
import type {FixtureGlobals} from './types';

/** Explicit observed context, independent from legacy fixture decorators. */
export function StateIndicatorHost({globals,children}:{globals:FixtureGlobals;children:ReactNode}){
 return <Provider theme={globals.theme} density={globals.density} dir={globals.direction==='auto'?undefined:globals.direction}
   data-testid="current-state-scope" style={{width:'36rem',maxWidth:'100%',padding:'var(--sgui-space3)',background:'var(--sgui-surface)',color:'var(--sgui-text)'}}>
   {children}
 </Provider>;
}
