'use client';
import {useEffect,useRef,useState} from 'react';
import {Button} from '@structured-growth/sg-ui/experimental';
import {SearchField,Link,Stack,Typography,Divider} from '@structured-growth/sg-ui/primitives';
import {ChevronRightIcon,KeyboardArrowLeftIcon,DashboardIcon,WindowIcon,CheckIcon,AssignmentTurnedInIcon,DescriptionOutlinedIcon,ViewListIcon,ClassIcon,ContentCopyIcon,MenuBookIcon,EditIcon,TaskAltIcon,TuneIcon,TerminalIcon,BrushIcon,AccessTimeFilledIcon,LockIcon,CalendarTodayIcon} from '@structured-growth/sg-ui/icons';
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
  const [direction,setDirection]=useState<'forward'|'back'>('forward');
  const panel=useRef<HTMLDivElement>(null);
  const pendingFocus=useRef<string|undefined>(undefined);
  useEffect(()=>{
    setGroupId(groupForPath(pathname)?.id);
    setQuery('');
    setDirection('forward');
  },[pathname]);
  useEffect(()=>{
    if(!pendingFocus.current)return;
    const target=pendingFocus.current;
    pendingFocus.current=undefined;
    const buttons=panel.current?.querySelectorAll<HTMLButtonElement>('button');
    const button=Array.from(buttons??[]).find(button=>button.dataset.group===target);
    (button??panel.current?.querySelector<HTMLButtonElement>('button'))?.focus();
  },[groupId]);
  const group=componentNavigationGroups.find(group=>group.id===groupId);
  const searchItems=catalog.map(entry=>({id:entry.slug,label:entry.title,keywords:entry.exports,description:groupForPath(`/docs/components/${entry.slug}`)?.label,href:`/docs/components/${entry.slug}`}));
  return <Stack gap={2}>
    <Link href="/" aria-current={pathname==='/'?'page':undefined} className={styles.navLink}><DashboardIcon className={styles.navigationIcon}/><span>Overview</span></Link>
    <Divider className={styles.navigationDivider}/>
    <SearchField aria-label="Find in navigation" placeholder="Search components…" density="compact"
      items={searchItems} value={query} onValueChange={setQuery} resultsLabel="Component search results"
      emptyMessage="No matching components." resultCountLabel={count=>`${count} matching ${count===1?'page':'pages'}`}
      onResultSelect={item=>{setGroupId(groupForPath(item.href!)?.id);setDirection('forward');setQuery('');}}/>
    <div className={styles.navigationViewport}>
      <div ref={panel} key={groupId??'root'} className={styles.navigationPanel} data-direction={direction}>
        {group?<Stack gap={2}>
          <Button variant="text" tone="neutral" startIcon={<KeyboardArrowLeftIcon className={styles.navigationIcon}/>} className={`${styles.navigationButton} ${styles.navigationBack}`} onPress={()=>{
            pendingFocus.current=group.id;setDirection('back');setGroupId(undefined);
          }}>Back to Components</Button>
          <Typography as="h2" variant="overline">{group.label}</Typography>
          <Stack gap={0}>{group.slugs.map(slug=>bySlug.get(slug)!).map(entry=><Link key={entry.slug} href={`/docs/components/${entry.slug}`} aria-current={pathname===`/docs/components/${entry.slug}`?'page':undefined} className={styles.navLink}><DescriptionOutlinedIcon className={styles.navigationIcon}/><Typography as="span" variant="caption">{entry.title}</Typography></Link>)}</Stack>
        </Stack>:<Stack gap={2}>
          <Link href="/docs/components" className={styles.navLink} aria-current={pathname==='/docs/components'?'page':undefined}><WindowIcon className={styles.navigationIcon}/><span>Components</span></Link>
          <Stack gap={0}>{componentNavigationGroups.map(category=>{const Icon=groupIcons[category.id as keyof typeof groupIcons];return <Button key={category.id} data-group={category.id} variant="text" tone="neutral" startIcon={<Icon className={styles.navigationIcon}/>} endIcon={<ChevronRightIcon/>} className={styles.navigationButton} onPress={()=>{
            pendingFocus.current='back';setDirection('forward');setGroupId(category.id);
          }}>{category.label}</Button>})}</Stack>
        </Stack>}
      </div>
    </div>
    <Divider className={styles.navigationDivider}/>
    <Stack gap={0}>{navigation.filter(item=>item.href!=='/'&&!item.href.startsWith('/docs/components')).map(item=>{const Icon=pageIcons[item.href]??MenuBookIcon;return <Link key={item.href} href={item.href} aria-current={pathname===item.href?'page':undefined} className={styles.navLink}><Icon className={styles.navigationIcon}/><span>{item.label}</span></Link>})}</Stack>
  </Stack>;
}
