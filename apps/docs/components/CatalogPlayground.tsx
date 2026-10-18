'use client';
import dynamic from 'next/dynamic';
import {Box} from '@structured-growth/sg-ui/primitives';
import {ExamplePresentation,type ExamplePhase} from './ExamplePresentation';
import styles from './docs.module.css';
import {Typography} from '@structured-growth/sg-ui/primitives';
import {useEffect,useState,type ReactNode} from 'react';
// Dynamic examples can replace streamed fallback content after document load.
// Consumers of geometry/source snapshots wait for the actual client owner.
function ReadyExamples({children}:{children:ReactNode}) {
 const [ready,setReady]=useState(false);
 useEffect(()=>setReady(true),[]);
 return <Box style={{display:'contents'}} data-docs-examples-ready={ready?'true':'false'}>{children}</Box>;
}
const loading=()=> <Typography role="status">Loading examples…</Typography>;
const AppModalExamples=dynamic(()=>import('../examples/DialogPlayground').then(m=>function DialogExamples(){return <ReadyExamples><m.DialogPlayground/></ReadyExamples>;}),{loading});
const Presentation=dynamic(()=>import('../examples/catalog/primitives-actions').then(m=>({slug}:{slug:string})=>{const entry=m.presentationEntries.find(e=>e.slug===slug)!;return <ReadyExamples><entry.Playground/></ReadyExamples>;}),{loading});
const Forms=dynamic(()=>import('../examples/catalog/forms-dates').then(m=>({slug}:{slug:string})=>{const entry=m.formsDateEntries.find(e=>e.slug===slug)!;return <ReadyExamples><entry.Playground/></ReadyExamples>;}),{loading});
const Editor=dynamic(()=>import('../examples/catalog/catalog-editor').then(m=>({slug}:{slug:string})=>{const entry=m.editorLayoutEntries.find(e=>e.slug===slug)!;return <ReadyExamples><entry.Playground/></ReadyExamples>;}),{loading});
const Data=dynamic(()=>import('../examples/catalog/catalog-data').then(m=>({slug}:{slug:string})=>{const entry=m.dataEntries.find(e=>e.slug===slug)!;return <ReadyExamples><entry.Playground/></ReadyExamples>;}),{loading});
export function CatalogPlayground({slug,group,phase,title,primary='Prop playground'}:{slug:string;group:string;phase?:ExamplePhase;title?:string;primary?:string}) {
 const Family=slug==='dialog'?AppModalExamples:group==='presentation'?Presentation:group==='forms'?Forms:group==='editor'?Editor:Data;
 const children=<Family slug={slug}/>;
 return phase ? <Box className={styles.catalogPhase} data-catalog-phase={phase} data-catalog-component={slug}><ExamplePresentation phase={phase} title={title??slug} primary={primary}>{children}</ExamplePresentation></Box> : children;
}
