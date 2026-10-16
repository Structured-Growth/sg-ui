'use client';
import {useState} from 'react';
import {SearchField,Link,Stack,Typography} from '@structured-growth/sg-ui/primitives';
import {Surface} from '@structured-growth/sg-ui/experimental';
import catalog from '../content/catalog.json';
export const groups={presentation:'Actions and presentation',forms:'Forms and dates',editor:'Navigation, dialogs and editors',data:'Data grids and course cards'};
export function CatalogIndex(){const [query,setQuery]=useState('');const entries=catalog.filter(e=>`${e.title} ${e.description} ${e.exports.join(' ')}`.toLowerCase().includes(query.toLowerCase()));return <Stack gap={4}><SearchField label="Find a component" showResults={false} placeholder="Search components…" value={query} onValueChange={setQuery}/><Typography role="status">{entries.length} component pages</Typography>{Object.entries(groups).map(([group,label])=><Stack key={group} gap={3}><Typography as="h2" variant="h5">{label}</Typography>{entries.filter(e=>e.group===group).map(e=><Surface key={e.slug} variant="outlined" padding={4}><Stack gap={2}><Link href={`/docs/components/${e.slug}`}>{e.title}</Link><Typography tone="muted">{e.description}</Typography><Typography variant="caption">{e.exports.join(', ')}</Typography></Stack></Surface>)}</Stack>)}</Stack>;}
