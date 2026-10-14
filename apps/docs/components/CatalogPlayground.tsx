'use client';
import dynamic from 'next/dynamic';
import {Typography} from '@structured-growth/sg-ui/primitives';
const loading=()=> <Typography role="status">Loading examples…</Typography>;
const Presentation=dynamic(()=>import('../examples/catalog/primitives-actions').then(m=>({slug}:{slug:string})=>{const entry=m.presentationEntries.find(e=>e.slug===slug)!;return <entry.Playground/>;}),{loading});
const Forms=dynamic(()=>import('../examples/catalog/forms-dates').then(m=>({slug}:{slug:string})=>{const entry=m.formsDateEntries.find(e=>e.slug===slug)!;return <entry.Playground/>;}),{loading});
const Editor=dynamic(()=>import('../examples/catalog/catalog-editor').then(m=>({slug}:{slug:string})=>{const entry=m.editorLayoutEntries.find(e=>e.slug===slug)!;return <entry.Playground/>;}),{loading});
const Data=dynamic(()=>import('../examples/catalog/catalog-data').then(m=>({slug}:{slug:string})=>{const entry=m.dataEntries.find(e=>e.slug===slug)!;return <entry.Playground/>;}),{loading});
export function CatalogPlayground({slug,group}:{slug:string;group:string}) {const Family=group==='presentation'?Presentation:group==='forms'?Forms:group==='editor'?Editor:Data;return <Family slug={slug}/>;}
