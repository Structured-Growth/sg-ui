'use client';
import dynamic from 'next/dynamic';
import {Box} from '@structured-growth/sg-ui/primitives';
import {ExamplePresentation,type ExamplePhase} from './ExamplePresentation';
import styles from './docs.module.css';
import {Typography} from '@structured-growth/sg-ui/primitives';
const loading=()=> <Typography role="status">Loading examples…</Typography>;
const AppModalExamples=dynamic(()=>import('../examples/DialogPlayground').then(m=>m.DialogPlayground),{loading});
const Presentation=dynamic(()=>import('../examples/catalog/primitives-actions').then(m=>({slug}:{slug:string})=>{const entry=m.presentationEntries.find(e=>e.slug===slug)!;return <entry.Playground/>;}),{loading});
const Forms=dynamic(()=>import('../examples/catalog/forms-dates').then(m=>({slug}:{slug:string})=>{const entry=m.formsDateEntries.find(e=>e.slug===slug)!;return <entry.Playground/>;}),{loading});
const Editor=dynamic(()=>import('../examples/catalog/catalog-editor').then(m=>({slug}:{slug:string})=>{const entry=m.editorLayoutEntries.find(e=>e.slug===slug)!;return <entry.Playground/>;}),{loading});
const Data=dynamic(()=>import('../examples/catalog/catalog-data').then(m=>({slug}:{slug:string})=>{const entry=m.dataEntries.find(e=>e.slug===slug)!;return <entry.Playground/>;}),{loading});
export function CatalogPlayground({slug,group,phase,title,primary='Prop playground'}:{slug:string;group:string;phase?:ExamplePhase;title?:string;primary?:string}) {
 const Family=slug==='dialog'?AppModalExamples:group==='presentation'?Presentation:group==='forms'?Forms:group==='editor'?Editor:Data;
 const children=<Family slug={slug}/>;
 return phase ? <Box className={styles.catalogPhase} data-catalog-phase={phase}><ExamplePresentation phase={phase} title={title??slug} primary={primary}>{children}</ExamplePresentation></Box> : children;
}
