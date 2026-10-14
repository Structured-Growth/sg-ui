import {List, ListItem, ListItemText, Link, Surface} from '@structured-growth/sg-ui/experimental';
import {Stack, Typography} from '@structured-growth/sg-ui/primitives';
import {componentUsage} from '../content/component-usage';
import composition from '../content/component-composition.json';
import styles from './docs.module.css';

export function ComponentUsage({slug}: {slug: string}) {
  const usage = componentUsage[slug];
  const groups = (composition as Record<string,{name:string;children:{name:string;slug:string}[]}[]>)[slug];
  const shared = groups?.every(group=>JSON.stringify(group.children)===JSON.stringify(groups[0]?.children));
  const visibleGroups=shared ? groups.slice(0,1) : groups;
  if (!usage) throw new Error(`Missing component usage guidance: ${slug}`);
  if (!groups) throw new Error(`Missing component composition: ${slug}`);
  return <Surface as="section" aria-label="Component usage" variant="outlined" padding={4}>
    <Stack gap={4}>
      <Stack gap={2}>
        <Typography as="h2" variant="subtitle1">When to use</Typography>
        <Typography variant="body2">{usage.when}</Typography>
      </Stack>
      <Stack gap={2}>
        <Typography as="h2" variant="subtitle1">How to use</Typography>
        <List aria-label="Usage instructions" className={styles.usageList}>
          {usage.how.map(instruction => <ListItem key={instruction} className={styles.usageListItem}>
            <ListItemText primary={instruction}/>
          </ListItem>)}
        </List>
      </Stack>
      <Stack gap={2}>
        <Typography as="h2" variant="subtitle1">Contains</Typography>
        <Typography variant="body2" tone="muted">Immediate UI components, including optional features. Follow a component link to see its own children. Application-supplied content varies.</Typography>
        {visibleGroups.map(group=><Stack key={group.name} gap={2} id={`composition-${group.name}`} as="section" aria-label={`${group.name} composition`}>
          {!shared && <Typography as="h3" variant="subtitle2">{group.name}</Typography>}
          {group.children.length ? <List aria-label="Included components" className={styles.usageList}>
            {group.children.map(child=><ListItem key={child.name} className={styles.usageListItem}><Link href={`/docs/components/${child.slug}${child.slug===slug ? '#composition-'+child.name : ''}`}>{child.name}</Link></ListItem>)}
          </List> : <Typography variant="body2" tone="muted">No fixed child components from the documented UI library. Native elements and content supplied by your application are not listed.</Typography>}
        </Stack>)}
        {!groups.length && <Typography variant="body2" tone="muted">These factories return host configuration rather than compose fixed UI components.</Typography>}

      </Stack>
      {usage.related?.length ? <Stack gap={2}>
        <Typography as="h3" variant="subtitle2">Related components</Typography>
        <Stack direction="row" wrap gap={3}>
          {usage.related.map(link => <Link key={link.slug} href={`/docs/components/${link.slug}`}>{link.label}</Link>)}
        </Stack>
      </Stack> : null}
    </Stack>
  </Surface>;
}
