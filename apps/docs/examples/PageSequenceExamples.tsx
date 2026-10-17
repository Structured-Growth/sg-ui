'use client';
import {useState} from 'react';
import {ExperiencePageNavigator} from '@structured-growth/sg-ui/components';
import {SGNavigationProvider} from '@structured-growth/sg-ui';
import {ThemeScope, type Density} from '@structured-growth/sg-ui/theme';
import {Example} from '../components/Example';
const pages = [{key:'intro',title:'Introduction'},{key:'practice',title:'Practice'},{key:'reflection',title:'Reflection'}];
function PageSequenceReference({density,links}:{density:Density;links:boolean}) {
  const [value,setValue] = useState('intro');
  const index = pages.findIndex(page => page.key === value);
  const destination = (page: typeof pages[number]|undefined) => page ? {key:page.key,label:page.title,...(links?{href:'#'+page.key}:{})} : null;
  const adjacentNavigation = {previous:destination(pages[index-1]),next:destination(pages[index+1])};
  const navigator = <ExperiencePageNavigator title="Course sequence" pages={pages} activePageKey={value} onSelectPage={setValue}
    readOnly adjacentNavigation={adjacentNavigation} onAddPage={()=>{}} onRemovePage={()=>{}} onRenamePage={()=>{}} onReorderPages={()=>{}}/>;
  const source = [
    "import { useState } from 'react';",
    "import { ExperiencePageNavigator } from '@structured-growth/sg-ui/components';",
    ...(links?["import { SGNavigationProvider } from '@structured-growth/sg-ui';"]:[]),
    "import { ThemeScope } from '@structured-growth/sg-ui/theme';", '',
    `const pages = ${JSON.stringify(pages)};`, '',
    'export function CourseSequence() {',
    `  const [value,setValue] = useState(${JSON.stringify(value)});`,
    '  const index = pages.findIndex(page => page.key === value);',
    `  const destination = (page: typeof pages[number]|undefined) => page ? {key:page.key,label:page.title${links?",href:'#'+page.key":''}} : null;`,
    '  const adjacentNavigation = {previous:destination(pages[index-1]),next:destination(pages[index+1])};',
    '  const navigator = <ExperiencePageNavigator title="Course sequence" pages={pages} activePageKey={value} onSelectPage={setValue}',
    '    readOnly adjacentNavigation={adjacentNavigation} onAddPage={()=>{}} onRemovePage={()=>{}} onRenamePage={()=>{}} onReorderPages={()=>{}}/>;',
    `  return <ThemeScope density="${density}">${links?'<SGNavigationProvider value={{pathname: value,navigate: href => setValue(href.slice(1))}}>{navigator}</SGNavigationProvider>':'{navigator}'}</ThemeScope>;`,
    '}',
  ].join('\n');
  return <Example title={`${links?'Linked':'Action'} previous/next — ${density}`} density={density} source={source}
    description={links?'The example adapter updates local selection. The application supplies real routes; native modified-click behavior is preserved.':'Previous/next requests update only this example. Read-only keeps navigation available while collection mutations remain disabled.'}>
    {links?<SGNavigationProvider value={{pathname:value,navigate:href=>setValue(href.slice(1))}}>{navigator}</SGNavigationProvider>:navigator}
  </Example>;
}
export function PageSequenceReferences() {
  return <>{(['compact','comfortable'] as const).flatMap(density => [false,true].map(links => <PageSequenceReference key={`${density}-${links}`} density={density} links={links}/>))}</>;
}
