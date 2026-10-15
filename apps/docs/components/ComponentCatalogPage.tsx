import {notFound} from 'next/navigation';
import catalog from '../content/catalog.json';
import {DocPage} from './DocPage';
import {CatalogPlayground} from './CatalogPlayground';
import {ComponentDocumentation} from './ComponentDocumentation';
import {ComponentRelationships} from './ComponentRelationships';
import {ButtonDocumentationIntro,ButtonDocumentation} from '../examples/ButtonDocumentation';
import {PageDocumentation} from './PageDocumentation';
import {Typography} from '@structured-growth/sg-ui/primitives';
export function ComponentCatalogPage({slug}:{slug:string}) {
 const entry=catalog.find(entry=>entry.slug===slug);if(!entry)notFound();
 const phaseProps={slug,group:entry.group,title:entry.title,primary:'exampleTitle' in entry?entry.exampleTitle:'Prop playground'};
 return <DocPage title={entry.title} description={entry.description}>
  <PageDocumentation>{slug==='owned-button'?<ButtonDocumentation/>:<ComponentDocumentation slug={slug} title={entry.title}/>}</PageDocumentation>
  {slug==='owned-button'?<><ButtonDocumentationIntro/><CatalogPlayground slug={slug} group={entry.group}/></>:<>
   <CatalogPlayground {...phaseProps} phase="overview"/>
   <CatalogPlayground {...phaseProps} phase="playground"/>
   {!('exampleTitle' in entry)&&<><Typography as="h2" variant="h4">Examples</Typography><CatalogPlayground {...phaseProps} phase="examples"/></>}
   <ComponentRelationships slug={slug}/>
  </>}
 </DocPage>;
}
