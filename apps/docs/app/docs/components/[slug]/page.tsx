import {notFound} from 'next/navigation';
import catalog from '../../../../content/catalog.json';
import {DocPage} from '../../../../components/DocPage';
import {CatalogPlayground} from '../../../../components/CatalogPlayground';
import {ComponentUsage} from '../../../../components/ComponentUsage';
import {Typography} from '@structured-growth/sg-ui/primitives';
export function generateStaticParams(){return catalog.filter(e=>!['button','dialog'].includes(e.slug)).map(e=>({slug:e.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return {title:`${catalog.find(e=>e.slug===slug)?.title??'Component'} · SGUI`};}
export default async function ComponentPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const entry=catalog.find(e=>e.slug===slug);if(!entry)notFound();return <DocPage title={entry.title} description={entry.description}><Typography variant="caption" tone="muted">Public exports: {entry.exports.join(', ')}</Typography><ComponentUsage slug={slug}/><CatalogPlayground slug={slug} group={entry.group}/></DocPage>;}
