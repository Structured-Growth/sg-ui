import type {ComponentProps,ElementType,ReactNode} from 'react';
type Args<T> = T extends ElementType ? ComponentProps<T> : T extends {component:infer C extends ElementType} ? ComponentProps<C> : Record<string,unknown>;
export type FixtureContext={args:Record<string,unknown>;globals:Record<string,unknown>;canvasElement:HTMLElement};
export type FixtureMeta<T=unknown>={title?:string;component?:T;args?:Partial<Args<T>>;tags?:string[];parameters?:Record<string,unknown>;argTypes?:Record<string,unknown>;decorators?:Array<(Fixture:()=>ReactNode,context:FixtureContext)=>ReactNode>};
export type FixtureCase<T=unknown>={args?:Partial<Args<T>>;render?:(args:Args<T>,context:FixtureContext)=>ReactNode;name?:string;parameters?:Record<string,unknown>;decorators?:Array<(Fixture:()=>ReactNode,context:FixtureContext)=>ReactNode>;play?:(context:FixtureContext)=>Promise<void>|void;globals?:Record<string,unknown>};
