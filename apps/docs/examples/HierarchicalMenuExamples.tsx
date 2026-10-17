'use client';
import { useState } from 'react';
import { Button, Checkbox, HierarchicalMenu, Popover, Select, Stack, TextField, type HierarchicalMenuLevel } from '@structured-growth/sg-ui/experimental';
import { type Density } from '@structured-growth/sg-ui/theme';
import { Example } from '../components/Example';

const items: HierarchicalMenuLevel = { title: 'Course workspace', sections: [{ id: 'workspace', label: 'Workspace', items: [
  { id: 'settings', label: 'Course settings', children: { title: 'Course settings', sections: [{ id: 'settings', items: [
    { id: 'people', label: 'People', children: { title: 'People', sections: [{ id: 'people', items: [{ id: 'invite', label: 'Invite learner' }, { id: 'roster', label: 'Open roster', href: '#roster' }] }] } },
    { id: 'unavailable', label: 'Unavailable', disabled: true },
  ] }] } },
  { id: 'resources', label: 'Resources', childBehavior: 'inline', children: { sections: [{ id: 'resources', items: [
    { id: 'reports', label: 'Reports', children: { title: 'Reports', sections: [{ id: 'reports', items: [{ id: 'export', label: 'Export report' }] }] } },
  ] }] } },
  { id: 'overview', label: 'Overview', href: '#overview', current: true },
] }], footerItems: [{ id: 'help', label: 'Help', href: 'https://example.org', target: '_blank' }] };
const modelSource = `const items: HierarchicalMenuLevel = ${JSON.stringify(items, null, 2)};`;
const imports = `import { useState } from 'react';\nimport { HierarchicalMenu, type HierarchicalMenuLevel } from '@structured-growth/sg-ui/experimental';`;
const frame = { width: '18rem', height: '20rem', maxWidth: '100%' };

function Playground() {
  const [label, setLabel] = useState('Course navigation');
  const [title, setTitle] = useState('Course workspace');
  const [density, setDensity] = useState<Density>('comfortable');
  const [presentation, setPresentation] = useState<'navigation' | 'commands'>('navigation');
  const [disabled, setDisabled] = useState(false);
  const [path, setPath] = useState<string[]>([]);
  const model = { ...items, title, sections: items.sections.map(section => ({ ...section, items: section.items.map(item => item.id === 'settings' ? { ...item, disabled } : item) })) };
  const source = `${imports}\n\nconst items: HierarchicalMenuLevel = ${JSON.stringify(model, null, 2)};\n\nexport function CourseMenu() {\n  const [path, setPath] = useState<string[]>(${JSON.stringify(path)});\n  return <HierarchicalMenu label={${JSON.stringify(label)}} items={items} presentation="${presentation}" density="${density}" path={path} onPathChange={setPath} style={${JSON.stringify(frame)}} />;\n}`;
  return <Example title="Prop playground" density={density} source={source} controls={<Stack direction="row" wrap gap={3}>
    <TextField label="label" value={label} onValueChange={setLabel} />
    <TextField label="Level title" value={title} onValueChange={setTitle} />
    <Select label="presentation" value={presentation} options={[{ id: 'navigation', label: 'Navigation' }, { id: 'commands', label: 'Commands' }]} onValueChange={value => setPresentation(value as typeof presentation)} />
    <Select label="Preview density" value={density} options={[{ id: 'compact', label: 'Compact' }, { id: 'comfortable', label: 'Comfortable' }]} onValueChange={value => setDensity(value as Density)} />
    <Checkbox label="Disable settings branch" checked={disabled} onCheckedChange={setDisabled} />
  </Stack>}>
    <HierarchicalMenu label={label} items={model} presentation={presentation} density={density} path={path} onPathChange={setPath} style={frame} />
  </Example>;
}
function NavigationReference({ density }: { density: Density }) {
  return <Example title={`Mixed navigation — ${density}`} density={density} description="Open Course settings, then People. Resources expands inline and contains its own Reports drilldown. The host owns real destinations." source={`${imports.replace("import { useState } from 'react';\n", '')}\n\n${modelSource}\n\nexport function WorkspaceNavigation() {\n  return <HierarchicalMenu label="Workspace navigation" items={items} density="${density}" style={${JSON.stringify(frame)}} />;\n}`}>
    <HierarchicalMenu label="Workspace navigation" items={items} density={density} style={frame} />
  </Example>;
}
function ControlledReference() {
  const [path, setPath] = useState<string[]>([]);
  const [accept, setAccept] = useState(false);
  return <Example title="Controlled path authority" description="Requests are rejected until the host accepts them. No navigation or persistence is performed by opening a branch." source={`${imports}\nimport { Checkbox, Stack } from '@structured-growth/sg-ui/experimental';\n\n${modelSource}\n\nexport function ControlledMenu() {\n  const [path, setPath] = useState<string[]>(${JSON.stringify(path)});\n  const [accept, setAccept] = useState(${accept});\n  return <Stack gap={3}>\n    <Checkbox label="Accept path changes" checked={accept} onCheckedChange={setAccept} />\n    <HierarchicalMenu label="Controlled workspace" items={items} path={path} onPathChange={next => { if (accept) setPath(next); }} style={${JSON.stringify(frame)}} />\n  </Stack>;\n}`}>
    <Stack gap={3}><Checkbox label="Accept path changes" checked={accept} onCheckedChange={setAccept} /><HierarchicalMenu label="Controlled workspace" items={items} path={path} onPathChange={next => { if (accept) setPath(next); }} style={frame} /></Stack>
  </Example>;
}
function PopupReference() {
  const [open, setOpen] = useState(false);
  const [complete, setComplete] = useState(false);
  const source = `${imports}\nimport { Button, Popover, Stack } from '@structured-growth/sg-ui/experimental';\n\n${modelSource}\n\nexport function CourseCommands() {\n  const [open, setOpen] = useState(${open});\n  const [complete, setComplete] = useState(${complete});\n  return <Stack gap={3}>\n    <Popover title="Course command popup" size="content" open={open} onOpenChange={setOpen} trigger={<Button>Open course commands</Button>}>\n      <HierarchicalMenu label="Course commands" presentation="commands" items={items} onDismiss={() => setOpen(false)} onAction={() => { setComplete(true); setOpen(false); }} style={${JSON.stringify(frame)}} />\n    </Popover>\n    {complete && <output role="status">Local command completed. The host owns persistence.</output>}\n  </Stack>;\n}`;
  return <Example title="Popup commands and Escape" description="Escape returns one child level, then closes the root popup. Reopening mounts a fresh local path. Leaf action completion is local." source={source}>
    <Stack gap={3}><Popover title="Course command popup" size="content" open={open} onOpenChange={setOpen} trigger={<Button>Open course commands</Button>}><HierarchicalMenu label="Course commands" presentation="commands" items={items} onDismiss={() => setOpen(false)} onAction={() => { setComplete(true); setOpen(false); }} style={frame} /></Popover>{complete && <output role="status">Local command completed. The host owns persistence.</output>}</Stack>
  </Example>;
}
export function HierarchicalMenuExamples() {
  return <Stack gap={4}><Playground /><NavigationReference density="compact" /><NavigationReference density="comfortable" /><ControlledReference /><PopupReference /></Stack>;
}
