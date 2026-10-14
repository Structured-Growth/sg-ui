'use client';
import {useEffect,useState} from 'react';
import {Disclosure} from '@structured-growth/sg-ui/experimental';
import {TextField,Link,Stack,Typography} from '@structured-growth/sg-ui/primitives';
import catalog from '../content/catalog.json';
import componentNavigationGroups from '../content/component-navigation.json';
import styles from './docs.module.css';
const bySlug=new Map(catalog.map(entry=>[entry.slug,entry]));
export function CatalogNavigation({pathname}:{pathname:string}) {
  const [query,setQuery]=useState('');
  const [expanded,setExpanded]=useState<Record<string,boolean>>({});
  const active=componentNavigationGroups.find(group=>group.slugs.some(slug=>pathname===`/docs/components/${slug}`))?.id;
  useEffect(()=>{if(active)setExpanded(previous=>({...previous,[active]:true}));},[pathname,active]);
  const search=query.trim().toLowerCase();
  const groups=componentNavigationGroups.map(group=>({...group,entries:group.slugs.map(slug=>bySlug.get(slug)!).filter(entry=>!search || group.label.toLowerCase().includes(search) || [entry.title,...entry.exports].some(name=>name.toLowerCase().includes(search)))})).filter(group=>group.entries.length);
  return <Stack gap={2}>
    <Typography variant="overline">Component groups</Typography>
    <TextField label="Find in navigation" value={query} onValueChange={setQuery}/>
    {!groups.length && <Typography variant="body2" tone="muted" aria-live="polite">No matching components.</Typography>}
    {groups.map(group=><Disclosure key={group.id} label={group.label} expanded={Boolean(search) || (expanded[group.id]??active===group.id)} onExpandedChange={value=>setExpanded(previous=>({...previous,[group.id]:value}))}>
      <Stack gap={2} className={styles.nestedNavigation}>
        {group.entries.map(entry=><Link key={entry.slug} href={`/docs/components/${entry.slug}`} aria-current={pathname===`/docs/components/${entry.slug}`?'page':undefined} className={styles.navLink}><Typography as="span" variant="body2">{entry.title}</Typography></Link>)}
      </Stack>
    </Disclosure>)}
  </Stack>;
}
