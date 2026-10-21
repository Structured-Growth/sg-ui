'use client';
import {useEffect,useState} from 'react';
import {HierarchicalMenu,type HierarchicalMenuLevel} from '@structured-growth/sg-ui/experimental';
import {SearchField,Link,Stack,Typography,Divider} from '@structured-growth/sg-ui/primitives';
import {DashboardIcon,WindowIcon,CheckIcon,AssignmentTurnedInIcon,DescriptionOutlinedIcon,ViewListIcon,ClassIcon,ContentCopyIcon,MenuBookIcon,EditIcon,TaskAltIcon,TuneIcon,TerminalIcon,BrushIcon,AccessTimeFilledIcon,LockIcon,CalendarTodayIcon} from '@structured-growth/sg-ui/icons';
import catalog from '../content/catalog.json';
import componentNavigationGroups from '../content/component-navigation.json';
import {navigation} from '../content/navigation';
import styles from './docs.module.css';
const groupIcons={actions:CheckIcon,forms:AssignmentTurnedInIcon,calendar:CalendarTodayIcon,text:DescriptionOutlinedIcon,grids:ViewListIcon,cards:ClassIcon,overlays:ContentCopyIcon,layouts:WindowIcon,editor:EditIcon,feedback:TaskAltIcon,foundations:TuneIcon};
const pageIcons:Record<string,typeof MenuBookIcon>={'/installation':TerminalIcon,'/theming':BrushIcon,'/releases':AccessTimeFilledIcon,'/licensing':LockIcon};
const bySlug=new Map(catalog.map(entry=>[entry.slug,entry]));
const groupForPath=(pathname:string)=>componentNavigationGroups.find(group=>group.slugs.some(slug=>pathname===`/docs/components/${slug}`));

export function CatalogNavigation({pathname}:{pathname:string}) {
  const [query,setQuery]=useState('');
  const [groupId,setGroupId]=useState<string|undefined>(()=>groupForPath(pathname)?.id);
  useEffect(()=>{
    setGroupId(groupForPath(pathname)?.id);
    setQuery('');
  },[pathname]);
  const group=componentNavigationGroups.find(group=>group.id===groupId);
  const items:HierarchicalMenuLevel={sections:[
    {id:'overview',items:[{id:'components',label:'Components',href:'/docs/components',current:pathname==='/docs/components',icon:<WindowIcon/>}]},
    {id:'categories',items:componentNavigationGroups.map(category=>{
      const Icon=groupIcons[category.id as keyof typeof groupIcons];
      return {id:category.id,label:category.label,icon:<Icon/>,children:{sections:[{id:category.id,items:category.slugs.map(slug=>{
        const entry=bySlug.get(slug)!;
        const href=`/docs/components/${slug}`;
        return {id:slug,label:entry.title,href,current:pathname===href,icon:<DescriptionOutlinedIcon/>};
      })}]}};
    })},
  ]};
  const searchItems=catalog.map(entry=>({id:entry.slug,label:entry.title,keywords:entry.exports,description:groupForPath(`/docs/components/${entry.slug}`)?.label,href:`/docs/components/${entry.slug}`}));
  return <Stack gap={2}>
    <Link href="/" aria-current={pathname==='/'?'page':undefined} className={styles.navLink}><DashboardIcon className={styles.navigationIcon}/><span>Overview</span></Link>
    <Divider className={styles.navigationDivider}/>
    <SearchField aria-label="Find in navigation" placeholder="Search components…" density="compact"
      items={searchItems} value={query} onValueChange={setQuery} resultsLabel="Component search results"
      emptyMessage="No matching components." resultCountLabel={count=>`${count} matching ${count===1?'page':'pages'}`}
      onResultSelect={item=>{setGroupId(groupForPath(item.href!)?.id);setQuery('');}}/>
    <div className={styles.navigationViewport}>
      {group&&<Typography as="h2" variant="overline">{group.label}</Typography>}
      <HierarchicalMenu label="Component categories" items={items} density="compact"
        path={groupId?[groupId]:[]} onPathChange={path=>setGroupId(path[0])}
        backLabel={()=>'Back to Components'} className={styles.componentMenu}/>
    </div>
    <Divider className={styles.navigationDivider}/>
    <Stack gap={0}>{navigation.filter(item=>item.href!=='/'&&!item.href.startsWith('/docs/components')).map(item=>{const Icon=pageIcons[item.href]??MenuBookIcon;return <Link key={item.href} href={item.href} aria-current={pathname===item.href?'page':undefined} className={styles.navLink}><Icon className={styles.navigationIcon}/><span>{item.label}</span></Link>})}</Stack>
  </Stack>;
}
