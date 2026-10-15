'use client';
import {createContext,useContext,type ReactNode} from 'react';
export type ExamplePhase='overview'|'playground'|'examples';
const Context=createContext<{phase:ExamplePhase;title:string;primary:string}|null>(null);
export function ExamplePresentation({phase,title,primary,children}:{phase:ExamplePhase;title:string;primary:string;children:ReactNode}) {
  return <Context.Provider value={{phase,title,primary}}>{children}</Context.Provider>;
}
export const useExamplePresentation=()=>useContext(Context);
