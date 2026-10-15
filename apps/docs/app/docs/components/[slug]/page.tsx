import catalog from '../../../../content/catalog.json';
import {ComponentCatalogPage} from '../../../../components/ComponentCatalogPage';
export function generateStaticParams(){return catalog.filter(e=>!['button','dialog'].includes(e.slug)).map(e=>({slug:e.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return {title:`${catalog.find(e=>e.slug===slug)?.title??'Component'} · SGUI`};}
export default async function ComponentPage({params}:{params:Promise<{slug:string}>}) { const {slug}=await params;return <ComponentCatalogPage slug={slug}/>; }
