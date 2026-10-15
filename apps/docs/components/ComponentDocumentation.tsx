import {Box,Stack,Typography} from '@structured-growth/sg-ui/primitives';
import {Table,TableHead,TableBody,TableRow,TableHeaderCell,TableCell,Surface,Link,Disclosure} from '@structured-growth/sg-ui/experimental';
import api from '../content/component-api.json';
import {componentUsage} from '../content/component-usage';
import styles from './docs.module.css';

type APIProp={name:string;type:string;required:boolean;default:string;description:string};
type APIGroup={names:string[];from:string;kind:string;props:APIProp[];native:string[]};
const inventory=api as Record<string,APIGroup[]>;
function accessibility(slug:string,groups:APIGroup[]) {
 if(slug==='icons')return 'Give meaningful icons an accessible label. Keep purely decorative icons hidden from assistive technology and label the containing action instead.';
 if(['navigation-provider','account-provider','translation-provider','provider','theme-scope'].includes(slug))return 'Scopes and adapters preserve their children’s semantics. Supply accessible labels and focus behavior through the child controls; the provider itself is not an extra keyboard stop.';
 if(['typography','box','stack','surface','card','divider','chip','badge','avatar','table','row-subheader','auth-shell','app-shell','document-editor-layout'].includes(slug))return 'Choose native elements and heading levels that fit the surrounding document. Preserve accessible names, contrast and focus indicators on interactive content supplied through slots; visual styling does not replace semantics.';
 if(slug==='grid-presets')return 'Factories return configuration rather than focusable controls. Keep generated labels translated and preserve the grid’s keyboard and selection behavior when customizing cells or actions.';
 if(['app-data-grid','data-grid-shell','learner-grid','processing-grid','row-reorder'].includes(slug))return 'Give the grid and row actions meaningful labels and stable identities. Custom cell content must preserve keyboard access and visible focus. Keep selection and reorder requests under the documented host ownership.';
 if(['owned-dialog','dialog','popover','columns-layout-modal','link-url-modal','image-upload-modal'].includes(slug))return 'Give the overlay a meaningful title or accessible name. Preserve its keyboard dismissal and focus management; handle the supplied close requests and make the trigger available for return focus. Explain any requirement for an explicit close action.';
 if(slug==='tooltip')return 'Tooltips supplement an already named control. Keep essential instructions and interactive content available outside the tooltip; pointer hover must not be the only way to access the description.';
 if(['button','icon-button','button-group','split-action'].includes(slug))return 'Keep visible labels or accessible names on each action. Native buttons support keyboard activation with Enter and Space. Decorative icons must not be the only indication of the action, pending state or outcome.';
 if(['link','sg-link','breadcrumbs','navigation','side-navigation','experience-page-navigator','page-tabs','tabs'].includes(slug))return 'Supply meaningful destination or tab labels and preserve current/selected state. Keep native link behavior and the component’s keyboard focus behavior when connecting host routing or panel selection.';
 if(['progress','inline-progress','operation-steps','status'].includes(slug))return 'Provide meaningful status or progress text and retain any accessible label required by the props. Use announcements for meaningful state changes and avoid communicating success, warning or failure through color alone.';
 if(['list','disclosure','collapse','pagination','pagination-footer','card-collection','card-frame','instructor-card','learner-card','page-header'].includes(slug))return 'Keep supplied headings, labels and actions meaningful in context. Preserve the native semantics and focus behavior of child controls; changing visual layout or visibility must not obscure the active keyboard focus.';
 const props=new Set(groups.flatMap(group=>group.props.map(prop=>prop.name)));
 if(['label','description','errorMessage','invalid','required','readOnly'].some(name=>props.has(name)))return 'Supply clear labels and supporting descriptions through the documented props. Keep required, read-only and validation states connected to the host model where supported. Preserve the component’s keyboard interaction and visible focus when composing surrounding content.';
 return 'Keep command labels and accessible names meaningful, preserve visible keyboard focus, and retain selection or checked state through the supplied props and callbacks. Custom content must remain keyboard accessible.';
}
export function ComponentDocumentation({slug,title}:{slug:string;title:string}) {
 const groups=inventory[slug],usage=componentUsage[slug];
 const functionsOnly=groups.every(group=>group.kind==='function');
 const imports=new Map<string,Set<string>>();
 for(const group of groups)for(const name of (group.names.length>10 ? [group.names.includes('AddIcon')?'AddIcon':group.names[0]] : group.names)) {const names=imports.get(group.from)??new Set();if(name!=='Provider')names.add(name);imports.set(group.from,names);}
 const setup=["'use client';",'',...(!functionsOnly?["import '@structured-growth/sg-ui/styles.css';","import { Provider } from '@structured-growth/sg-ui/theme';","import type { ReactNode } from 'react';"]:[]),...Array.from(imports,([from,names])=>names.size?`import { ${[...names].join(', ')} } from '${from}';`:null).filter(Boolean),...(!functionsOnly?['','export function ApplicationSetup({ children }: { children: ReactNode }) {','  return <Provider>{children}</Provider>;','}']:[])].join('\n');
 const host=usage.how.filter(text=>/\b(host|application|persist|fetch|server|routing|session|credentials|request|backend)\b/i.test(text));
 const behavior=usage.how.filter(text=>!host.includes(text));
 const callbacks=[...new Set(groups.flatMap(group=>group.props.filter(prop=>/^on[A-Z]/.test(prop.name)).map(prop=>prop.name)))];
 return <Surface as="section" aria-label="Component documentation" variant="outlined" padding={4}><Stack gap={4}>
  <Typography as="h2" variant="h5">Documentation</Typography>
  <Stack as="section" aria-label="Setup" gap={2}><Typography as="h3" variant="h6">Setup</Typography>
   <Typography>{functionsOnly?'Import the configuration functions into your host application. Their returned configuration is passed to the documented grid; the functions themselves do not need a mounted Provider.':'Load the stylesheet once and place the component within your application’s Provider or an existing ThemeScope. Reuse the application scope rather than wrapping every instance separately.'}</Typography>
   <Typography as="code" variant="code" tabIndex={0} aria-label={`Setup code: ${title}`} className={styles.code}>{setup}</Typography>
   <Typography>Connect the required props and host callbacks using the complete examples below. See <Link href="/installation">Installation</Link> and <Link href="/theming">Theming</Link> for application setup. Demo settings affect live previews only.</Typography>
  </Stack>
  <Stack as="section" aria-label="Prop reference" gap={3}><Typography as="h3" variant="h6">Props</Typography>
   <Typography tone="muted">Required inputs are marked. Defaults show values declared by the implementation; — means no default is declared here. Native attributes and inherited scope values follow their own defaults.</Typography>
   {groups.map(group=><Stack key={group.names.join(',')} gap={2}>
    {(groups.length>1||group.names.length>1)&&<Typography as="h4" variant="subtitle1">{group.names.length>3?`${group.names[0]} and ${group.names.length-1} matching exports`:group.names.join(', ')}{group.kind==='function'?' parameters':''}</Typography>}
    {group.names.length>3&&<Disclosure label="Matching exports"><Typography variant="body2">{group.names.join(', ')}</Typography></Disclosure>}
    <Box style={{overflowX:'auto'}}><Table aria-label={`${group.names[0]} props`} style={{minWidth:'48rem'}}><TableHead><TableRow>{['Prop','Type','Required','Default','Purpose'].map(label=><TableHeaderCell key={label}>{label}</TableHeaderCell>)}</TableRow></TableHead><TableBody>{group.props.map(prop=><TableRow key={prop.name}><TableHeaderCell scope="row">{prop.name}</TableHeaderCell><TableCell><Typography as="code" variant="code" style={{overflowWrap:'anywhere'}}>{prop.type}</Typography></TableCell><TableCell>{prop.required?'Yes':'No'}</TableCell><TableCell>{prop.default}</TableCell><TableCell>{prop.description}</TableCell></TableRow>)}</TableBody></Table></Box>
    {group.native.length>0&&<Disclosure label={`Native attributes: ${group.names[0]}`}><Typography variant="body2">Additional supported native and React attributes: {group.native.join(', ')}.</Typography></Disclosure>}
   </Stack>)}
  </Stack>
  <Stack as="section" aria-label="Behavior and accessibility" gap={2}><Typography as="h3" variant="h6">Behavior and accessibility</Typography>
   <Typography>{usage.when}</Typography>{behavior.map(text=><Typography key={text}>{text}</Typography>)}<Typography>{accessibility(slug,groups)}</Typography>
  </Stack>
  <Stack as="section" aria-label="Host responsibilities" gap={2}><Typography as="h3" variant="h6">Host responsibilities</Typography>
   {host.map(text=><Typography key={text}>{text}</Typography>)}
   {callbacks.length>0&&<Typography>Implement the callbacks you enable ({callbacks.join(', ')}). When supplying controlled values, accept the requested changes and pass the updated state back to this instance. Keep asynchronous work, persistence and outcome feedback in the application.</Typography>}
   {!host.length&&!callbacks.length&&<Typography>Supply {title} content and data from the application. Interactive content placed in slots retains its own callbacks and state. The examples demonstrate presentation and local interactions; connect your application’s persistence and routing where needed.</Typography>}
   <Typography>Keep each rendered instance’s mutable state independent unless sharing it is intentional. Supply translated content and accessible outcome feedback for application actions.</Typography>
  </Stack>
 </Stack></Surface>;
}
