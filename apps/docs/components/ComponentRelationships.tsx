import {Stack,Typography} from '@structured-growth/sg-ui/primitives';
import {Link,Surface} from '@structured-growth/sg-ui/experimental';
import composition from '../content/component-composition.json';
const data=composition as Record<string,{name:string;children:{name:string;slug:string}[]}[]>;
export function ComponentRelationships({slug}:{slug:string}) {
 const groups=data[slug];
 const shared=groups.every(group=>JSON.stringify(group.children)===JSON.stringify(groups[0]?.children));
 const visible=shared?groups.slice(0,1):groups;
 const parents=Object.entries(data).flatMap(([parentSlug,parts])=>parts.flatMap(part=>part.children.some(child=>child.slug===slug) ? [{slug:parentSlug,name:part.name,anchor:parts.every(p=>JSON.stringify(p.children)===JSON.stringify(parts[0]?.children))?parts[0].name:part.name}] : [])).filter(parent=>parent.slug!==slug).sort((a,b)=>a.name.localeCompare(b.name));
 return <><Surface as="section" aria-label="Contains" variant="outlined" padding={4}><Stack gap={3}>
  <Typography as="h2" variant="h5">Contains</Typography>
  {visible.map(group=><Stack as="section" id={`composition-${group.name}`} aria-label={`${group.name} composition`} key={group.name} gap={2}>
   {!shared&&<Typography as="h3" variant="h6">{group.name}</Typography>}
   <Stack direction="row" wrap gap={3}>{group.children.map(child=><Link key={child.name} href={`/docs/components/${child.slug}${child.slug===slug?'#composition-'+child.name:''}`}>{child.name}</Link>)}</Stack>
   {!group.children.length&&<Typography tone="muted">No fixed SGUI child components.</Typography>}
  </Stack>)}
  {!groups.length&&<Typography tone="muted">Configuration functions do not render child components.</Typography>}
 </Stack></Surface>
 <Surface as="section" aria-label="Used In" variant="outlined" padding={4}><Stack gap={3}>
  <Typography as="h2" variant="h5">Used In</Typography>
  <Stack direction="row" wrap gap={3}>{parents.map(parent=><Link key={`${parent.slug}-${parent.name}`} href={`/docs/components/${parent.slug}#composition-${parent.anchor}`}>{parent.name}</Link>)}</Stack>
  {!parents.length&&<Typography tone="muted">No direct parents in the documented component catalog.</Typography>}
 </Stack></Surface></>;
}
