import type { ComponentType, ReactNode } from 'react';
export type FixtureGlobals = {theme:'light'|'dark'|'system';density:'compact'|'comfortable';locale:string;direction:'auto'|'ltr'|'rtl'};
export interface FixtureContext { id:string; globals:FixtureGlobals; args:Record<string,unknown>; canvasElement:HTMLElement; }
export type FixtureDecorator = (Fixture:ComponentType, context:FixtureContext)=>ReactNode;
type Props<T> = T extends ComponentType<infer P> ? P : T extends {component:infer C} ? Props<C> : Record<string,unknown>;
/** Owned fixture metadata: ordinary React render functions, not a documentation runtime. */
export interface Meta<T=ComponentType<Record<string,unknown>>> {
 title:string; id?:string; component?:T; args?:Partial<Props<T>>; tags?:string[];
 decorators?:FixtureDecorator[]; parameters?:Record<string,unknown>; excludeStories?:string[]; includeStories?:string[];
 render?:(args:Props<T>,context:FixtureContext)=>ReactNode;
}
export interface StoryObj<T=unknown> {
 name?:string; args?:Partial<Props<T>>; tags?:string[]; parameters?:Record<string,unknown>; globals?:Partial<FixtureGlobals>;
 decorators?:FixtureDecorator[];
 render?:(args:Props<T>,context:FixtureContext)=>ReactNode;
 play?:(context:FixtureContext)=>Promise<void>|void;
}
