'use client';
import {createContext,useContext,useEffect,type ReactNode} from 'react';
import {usePathname} from 'next/navigation';
import {canonicalDocumentationPath} from '../content/documentation-versioning.mjs';

/** Pages supply server-rendered documentation; the persistent shell owns its placement. */
export const PageDocumentationContext=createContext<((pathname:string,content:ReactNode)=>()=>void)|null>(null);
export function PageDocumentation({children}:{children:ReactNode}) {
  const register=useContext(PageDocumentationContext);
  const pathname=canonicalDocumentationPath(usePathname(),process.env.NEXT_PUBLIC_DOCS_BASE_PATH);
  useEffect(()=>register?.(pathname,children),[register,pathname,children]);
  return null;
}
