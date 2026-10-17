'use client';
import { HierarchicalMenuExamples } from '../HierarchicalMenuExamples';
import { TabsOverflowExamples } from '../TabsOverflowExamples';
import { useState } from 'react';
import { Button, Dialog, Popover, Tabs, Typography, Box, Stack, Surface, Card, CardContent, Divider, IconButton, ButtonGroup, Menu, SplitAction, Link, Breadcrumbs, Tooltip, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Navigation, NavigationItem, Disclosure, Collapse, Chip, Badge, Progress, Status, Avatar, Table, TableHead, TableBody, TableFoot, TableRow, TableCell, TableHeaderCell, TableCaption, Pagination, Select, Checkbox, TextField } from '@structured-growth/sg-ui/experimental';
import { Provider, ThemeScope, AppThemeProvider, type Density, type InteractionMode } from '@structured-growth/sg-ui/theme';
import { CircularProgress, LinearProgress } from '@structured-growth/sg-ui/primitives';
import * as Icons from '@structured-growth/sg-ui/icons';
import type { CatalogEntry } from '../../content/catalog-types';
import { Example } from '../../components/Example';
import { useExampleSource } from '../useExampleSource';
import { literal } from '../source';
import { ButtonExamples } from '../ButtonDocumentation';
import { SizingThemeExample } from '../SizingThemeExample';

function OwnedDialogPlayground({reference = false}: {reference?: boolean} = {}) {

if (reference) return <Stack gap={4}>
    <OwnedDialogPlaygroundPanel1 reference={reference} />
  </Stack>;
return <Stack gap={4}>
    <OwnedDialogPlaygroundPanel2 reference={reference} />
    <OwnedDialogPlayground reference />
  </Stack>;
}

function OwnedDialogPlaygroundPanel1({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [compactOpen, setCompactOpen] = useState(false);
const [comfortableOpen, setComfortableOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [title, setTitle] = useState("Publish course");
const [size, setSize] = useState<"md" | "xs" | "sm" | "lg" | "xl" | "full">("md");
const [dismissOnOutside, setDismissOnOutside] = useState(true);
const [dismissOnEscape, setDismissOnEscape] = useState(true);
const imports = ["import { Dialog, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [compactOpen, setCompactOpen] = useState(${compactOpen});\n  const [comfortableOpen, setComfortableOpen] = useState(${comfortableOpen});\n  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Compact and comfortable comparison" description="The same props in independent density scopes." source={source({name:"OwnedDialogPlaygroundDensities", imports, state, body:`<Stack gap={3}>
<ThemeScope density="compact"><Stack gap={3}><Button onPress={() => setCompactOpen(true)}>Open dialog</Button><Dialog open={compactOpen} title={${literal(title)}} size={${literal(size)}} dismissOnOutside={${dismissOnOutside}} dismissOnEscape={${dismissOnEscape}} onDismiss={reason => {setCompactOpen(false); setAction(reason);}} footer={<Button onPress={() => {setCompactOpen(false);setAction("Confirmed locally");}}>Confirm</Button>}><Typography>No server request is made. Your application owns persistence.</Typography></Dialog></Stack></ThemeScope>
<ThemeScope density="comfortable"><Stack gap={3}><Button onPress={() => setComfortableOpen(true)}>Open dialog</Button><Dialog open={comfortableOpen} title={${literal(title)}} size={${literal(size)}} dismissOnOutside={${dismissOnOutside}} dismissOnEscape={${dismissOnEscape}} onDismiss={reason => {setComfortableOpen(false); setAction(reason);}} footer={<Button onPress={() => {setComfortableOpen(false);setAction("Confirmed locally");}}>Confirm</Button>}><Typography>No server request is made. Your application owns persistence.</Typography></Dialog></Stack></ThemeScope>
</Stack>`})}><Stack gap={3}><ThemeScope density="compact"><Stack gap={3}><Button onPress={() => setCompactOpen(true)}>Open dialog</Button><Dialog open={compactOpen} title={title} size={size} dismissOnOutside={dismissOnOutside} dismissOnEscape={dismissOnEscape} onDismiss={reason => {setCompactOpen(false); setAction(reason);}} footer={<Button onPress={() => {setCompactOpen(false);setAction("Confirmed locally");}}>Confirm</Button>}><Typography>No server request is made. Your application owns persistence.</Typography></Dialog></Stack></ThemeScope><ThemeScope density="comfortable"><Stack gap={3}><Button onPress={() => setComfortableOpen(true)}>Open dialog</Button><Dialog open={comfortableOpen} title={title} size={size} dismissOnOutside={dismissOnOutside} dismissOnEscape={dismissOnEscape} onDismiss={reason => {setComfortableOpen(false); setAction(reason);}} footer={<Button onPress={() => {setComfortableOpen(false);setAction("Confirmed locally");}}>Confirm</Button>}><Typography>No server request is made. Your application owns persistence.</Typography></Dialog></Stack></ThemeScope></Stack></Example>;
}

function OwnedDialogPlaygroundPanel2({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [compactOpen, setCompactOpen] = useState(false);
const [comfortableOpen, setComfortableOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [title, setTitle] = useState("Publish course");
const [size, setSize] = useState<"md" | "xs" | "sm" | "lg" | "xl" | "full">("md");
const [dismissOnOutside, setDismissOnOutside] = useState(true);
const [dismissOnEscape, setDismissOnEscape] = useState(true);
const imports = ["import { Dialog, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [compactOpen, setCompactOpen] = useState(${compactOpen});\n  const [comfortableOpen, setComfortableOpen] = useState(${comfortableOpen});\n  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Prop playground" description="Controlled overlay dismissal and explicitly host-owned actions." density={density} controls={<Stack direction="row" wrap gap={3}><TextField label="title" value={title} onValueChange={setTitle} /><Select label="size" value={size} options={[{"id": "md", "label": "md"}, {"id": "xs", "label": "xs"}, {"id": "sm", "label": "sm"}, {"id": "lg", "label": "lg"}, {"id": "xl", "label": "xl"}, {"id": "full", "label": "full"}]} onValueChange={value => setSize(value as "md" | "xs" | "sm" | "lg" | "xl" | "full")} /><Checkbox label="dismissOnOutside" checked={dismissOnOutside} onCheckedChange={setDismissOnOutside} /><Checkbox label="dismissOnEscape" checked={dismissOnEscape} onCheckedChange={setDismissOnEscape} /><Select label="Preview density" value={density} options={[{id:"comfortable",label:"Comfortable"},{id:"compact",label:"Compact"}]} onValueChange={value => setDensity(value as Density)} /></Stack>} source={source({name:"OwnedDialogPlayground", imports, state, body:`<ThemeScope density=${literal(density)}>
<Stack gap={3}><Button onPress={() => setOpen(true)}>Open dialog</Button><Dialog open={open} title={${literal(title)}} size={${literal(size)}} dismissOnOutside={${dismissOnOutside}} dismissOnEscape={${dismissOnEscape}} onDismiss={reason => {setOpen(false); setAction(reason);}} footer={<Button onPress={() => {setOpen(false);setAction("Confirmed locally");}}>Confirm</Button>}><Typography>No server request is made. Your application owns persistence.</Typography></Dialog></Stack>
</ThemeScope>`})}>
<Stack gap={3}><Button onPress={() => setOpen(true)}>Open dialog</Button><Dialog open={open} title={title} size={size} dismissOnOutside={dismissOnOutside} dismissOnEscape={dismissOnEscape} onDismiss={reason => {setOpen(false); setAction(reason);}} footer={<Button onPress={() => {setOpen(false);setAction("Confirmed locally");}}>Confirm</Button>}><Typography>No server request is made. Your application owns persistence.</Typography></Dialog></Stack>
    </Example>;
}

function PopoverPlayground({reference = false}: {reference?: boolean} = {}) {

if (reference) return <Stack gap={4}>
    <PopoverPlaygroundPanel1 reference={reference} />
  </Stack>;
return <Stack gap={4}>
    <PopoverPlaygroundPanel2 reference={reference} />
    <PopoverPlayground reference />
  </Stack>;
}

function PopoverPlaygroundPanel1({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [title, setTitle] = useState("Course details");
const [placement, setPlacement] = useState<"bottom start" | "bottom end" | "top start" | "top end">("bottom start");
const [size, setSize] = useState<"md" | "lg" | "content">("md");
const imports = ["import { Popover, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Compact and comfortable comparison" description="The same props in independent density scopes." source={source({name:"PopoverPlaygroundDensities", imports, state, body:`<Stack gap={3}>
<ThemeScope density="compact"><Popover title={${literal(title)}} placement={${literal(placement)}} size={${literal(size)}} trigger={<Button variant="outlined">Show details</Button>}><Stack gap={3}><Typography>12 lessons · Updated today</Typography><Button onPress={() => setAction("Added to reading list")}>Add to reading list</Button></Stack></Popover></ThemeScope>
<ThemeScope density="comfortable"><Popover title={${literal(title)}} placement={${literal(placement)}} size={${literal(size)}} trigger={<Button variant="outlined">Show details</Button>}><Stack gap={3}><Typography>12 lessons · Updated today</Typography><Button onPress={() => setAction("Added to reading list")}>Add to reading list</Button></Stack></Popover></ThemeScope>
</Stack>`})}><Stack gap={3}><ThemeScope density="compact"><Popover title={title} placement={placement} size={size} trigger={<Button variant="outlined">Show details</Button>}><Stack gap={3}><Typography>12 lessons · Updated today</Typography><Button onPress={() => setAction("Added to reading list")}>Add to reading list</Button></Stack></Popover></ThemeScope><ThemeScope density="comfortable"><Popover title={title} placement={placement} size={size} trigger={<Button variant="outlined">Show details</Button>}><Stack gap={3}><Typography>12 lessons · Updated today</Typography><Button onPress={() => setAction("Added to reading list")}>Add to reading list</Button></Stack></Popover></ThemeScope></Stack></Example>;
}

function PopoverPlaygroundPanel2({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [presentation,setPresentation]=useState<"popover"|"dialog"|"drawer"|"auto">("popover");
const [showTitle, setShowTitle] = useState(true);
const [title, setTitle] = useState("Course details");
const [placement, setPlacement] = useState<"bottom start" | "bottom end" | "top start" | "top end">("bottom start");
const [size, setSize] = useState<"md" | "lg" | "content">("md");
const imports = ["import { Popover, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Prop playground" description="Anchored supplementary content with keyboard dismissal." density={density} controls={<Stack direction="row" wrap gap={3}><Select label="presentation" value={presentation} options={["popover","dialog","drawer","auto"].map(id=>({id,label:id}))} onValueChange={v=>setPresentation(v as typeof presentation)}/><Checkbox label="Show title" checked={showTitle} onCheckedChange={setShowTitle}/><TextField label="title" value={title} onValueChange={setTitle} /><Select label="placement" value={placement} options={[{"id": "bottom start", "label": "bottom start"}, {"id": "bottom end", "label": "bottom end"}, {"id": "top start", "label": "top start"}, {"id": "top end", "label": "top end"}]} onValueChange={value => setPlacement(value as "bottom start" | "bottom end" | "top start" | "top end")} /><Select label="size" value={size} options={[{"id": "md", "label": "md"}, {"id": "lg", "label": "lg"}, {"id": "content", "label": "Content width"}]} onValueChange={value => setSize(value as "md" | "lg" | "content")} /><Select label="Preview density" value={density} options={[{id:"comfortable",label:"Comfortable"},{id:"compact",label:"Compact"}]} onValueChange={value => setDensity(value as Density)} /></Stack>} source={source({name:"PopoverPlayground", imports, state, body:`<ThemeScope density=${literal(density)}>
<Popover presentation=${literal(presentation)} showTitle={${showTitle}} title={${literal(title)}} placement={${literal(placement)}} size={${literal(size)}} trigger={<Button variant="outlined">Show details</Button>}><Stack gap={3}><Typography>12 lessons · Updated today</Typography><Button onPress={() => setAction("Added to reading list")}>Add to reading list</Button></Stack></Popover>
</ThemeScope>`})}>
<Popover presentation={presentation} showTitle={showTitle} title={title} placement={placement} size={size} trigger={<Button variant="outlined">Show details</Button>}><Stack gap={3}><Typography>12 lessons · Updated today</Typography><Button onPress={() => setAction("Added to reading list")}>Add to reading list</Button></Stack></Popover>
    </Example>;
}

function TabsPlayground({reference = false}: {reference?: boolean} = {}) {
  const source = useExampleSource();
  const [density, setDensity] = useState<Density>("comfortable");
  const [action, setAction] = useState('No action yet');
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [selected, setSelected] = useState('overview');
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");
  const [activation, setActivation] = useState<"automatic" | "manual">("automatic");
  const [overflow, setOverflow] = useState<"scroll" | "menu">("scroll");
  const [overflowLabel, setOverflowLabel] = useState("More tabs");
  const [label, setLabel] = useState("Course workspace");
  const imports = ["import { Tabs, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
  const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
  if (reference) return <Stack gap={4}>
    {matrixOrientations.flatMap(orientation => matrixDensities.map(density => <TabsMatrixExample key={`${orientation}-${density}`} orientation={orientation} density={density} />))}
    {matrixOrientations.map(orientation => <TabsMatrixExample key={`${orientation}-manual`} orientation={orientation} density="comfortable" activation="manual" />)}
    <TabsOverflowExamples/>
  </Stack>;
  return <Stack gap={4}>
    <Example title="Prop playground" description="Host-controlled active panel, orientation and keyboard activation." density={density} controls={<Stack direction="row" wrap gap={3}><Select label="orientation" value={orientation} options={[{"id": "horizontal", "label": "horizontal"}, {"id": "vertical", "label": "vertical"}]} onValueChange={value => setOrientation(value as "horizontal" | "vertical")} /><Select label="activation" value={activation} options={[{"id": "automatic", "label": "automatic"}, {"id": "manual", "label": "manual"}]} onValueChange={value => setActivation(value as "automatic" | "manual")} /><Select label="overflow" value={overflow} options={[{id:"scroll",label:"scroll"},{id:"menu",label:"menu"}]} onValueChange={value=>setOverflow(value as typeof overflow)}/><TextField label="overflowLabel" value={overflowLabel} onValueChange={setOverflowLabel}/><TextField label="label" value={label} onValueChange={setLabel} /><Select label="Preview density" value={density} options={[{id:"comfortable",label:"Comfortable"},{id:"compact",label:"Compact"}]} onValueChange={value => setDensity(value as Density)} /></Stack>} source={source({name:"TabsPlayground", imports, state, body:`<ThemeScope density=${literal(density)}>
<Tabs label={${literal(label)}} orientation={${literal(orientation)}} activation={${literal(activation)}} overflow={${literal(overflow)}} overflowLabel={${literal(overflowLabel)}} value={selected} onValueChange={setSelected} items={[{id:"overview",label:"Overview",content:<Typography>Course overview</Typography>},{id:"lessons",label:"Lessons",content:<Typography>12 lessons ready to publish</Typography>},{id:"archive",label:"Archive",disabled:true,content:<Typography>Unavailable</Typography>}]} />
</ThemeScope>`})}>
<Tabs label={label} orientation={orientation} activation={activation} overflow={overflow} overflowLabel={overflowLabel} value={selected} onValueChange={setSelected} items={[{id:"overview",label:"Overview",content:<Typography>Course overview</Typography>},{id:"lessons",label:"Lessons",content:<Typography>12 lessons ready to publish</Typography>},{id:"archive",label:"Archive",disabled:true,content:<Typography>Unavailable</Typography>}]} />
    </Example>
    <TabsPlayground reference />
  </Stack>;
}

function TypographyPlayground({reference = false}: {reference?: boolean} = {}) {

if (reference) return <Stack gap={4}>
    <TypographyPlaygroundPanel1 reference={reference} />
    <TypographyPlaygroundPanel2 reference={reference} />
    <TypographyToneExamples />
  </Stack>;
return <Stack gap={4}>
    <TypographyPlaygroundPanel3 reference={reference} />
    <TypographyPlayground reference />
  </Stack>;
}

function TypographyToneExamples() {
  const source = useExampleSource();
  return <Example title="Text tones and emphasis" description="Tone describes text emphasis, accent or meaning. Primary is retained as an accent alias; it does not assign button priority." source={source({name:"TypographyTones", imports:["import { Stack, Typography } from '@structured-growth/sg-ui/experimental';"], body:`<Stack gap={2}>
  <Typography tone="default">Default: main content</Typography>
  <Typography tone="muted">Muted: supporting descriptions</Typography>
  <Typography tone="subtle">Subtle: supplementary metadata</Typography>
  <Typography tone="accent">Accent: brand-colored text</Typography>
  <Typography tone="primary">Primary: compatibility alias for accent</Typography>
  <Typography tone="danger">Danger: error messaging</Typography>
</Stack>`})}><Stack gap={2}>
    <Typography tone="default">Default: main content</Typography>
    <Typography tone="muted">Muted: supporting descriptions</Typography>
    <Typography tone="subtle">Subtle: supplementary metadata</Typography>
    <Typography tone="accent">Accent: brand-colored text</Typography>
    <Typography tone="primary">Primary: compatibility alias for accent</Typography>
    <Typography tone="danger">Danger: error messaging</Typography>
  </Stack></Example>;
}

function TypographyPlaygroundPanel1({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [variant, setVariant] = useState<"body1" | "body2" | "bodyAlt2" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "caption" | "overline" | "button" | "code">("body1");
const [tone, setTone] = useState<"default" | "muted" | "subtle" | "accent" | "primary" | "danger">("default");
const [text, setText] = useState("Learning that grows with you");
const [noWrap, setNoWrap] = useState(false);
const imports = ["import { Typography, Stack, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Compact and comfortable comparison" description="The same props in independent density scopes." source={source({name:"TypographyPlaygroundDensities", imports, state, body:`<Stack gap={3}>
<ThemeScope density="compact"><Typography variant={${literal(variant)}} tone={${literal(tone)}} noWrap={${noWrap}}>{${literal(text)}}</Typography></ThemeScope>
<ThemeScope density="comfortable"><Typography variant={${literal(variant)}} tone={${literal(tone)}} noWrap={${noWrap}}>{${literal(text)}}</Typography></ThemeScope>
</Stack>`})}><Stack gap={3}><ThemeScope density="compact"><Typography variant={variant} tone={tone} noWrap={noWrap}>{text}</Typography></ThemeScope><ThemeScope density="comfortable"><Typography variant={variant} tone={tone} noWrap={noWrap}>{text}</Typography></ThemeScope></Stack></Example>;
}

function TypographyPlaygroundPanel2({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [variant, setVariant] = useState<"body1" | "body2" | "bodyAlt2" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "caption" | "overline" | "button" | "code">("body1");
const [tone, setTone] = useState<"default" | "muted" | "subtle" | "accent" | "primary" | "danger">("default");
const [text, setText] = useState("Learning that grows with you");
const [noWrap, setNoWrap] = useState(false);
const imports = ["import { Typography, Stack, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Composed example" source={source({name:"TypographyPlaygroundComposition", imports, state, body:`<Stack gap={2}><Typography as="h3" variant="h5">Course overview</Typography><Typography variant="body1">A heading hierarchy with readable body text.</Typography><Typography variant="caption" tone="muted">Updated today</Typography></Stack>`})}><Stack gap={2}><Typography as="h3" variant="h5">Course overview</Typography><Typography variant="body1">A heading hierarchy with readable body text.</Typography><Typography variant="caption" tone="muted">Updated today</Typography></Stack></Example>;
}

function TypographyPlaygroundPanel3({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [variant, setVariant] = useState<"body1" | "body2" | "bodyAlt2" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "caption" | "overline" | "button" | "code">("body1");
const [tone, setTone] = useState<"default" | "muted" | "subtle" | "accent" | "primary" | "danger">("default");
const [text, setText] = useState("Learning that grows with you");
const [noWrap, setNoWrap] = useState(false);
const imports = ["import { Typography, Stack, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Prop playground" description="Visual roles are independent of native text semantics." density={density} controls={<Stack direction="row" wrap gap={3}><Select label="variant" value={variant} options={[{"id": "body1", "label": "body1"}, {"id": "body2", "label": "body2"}, {"id": "bodyAlt2", "label": "bodyAlt2"}, {"id": "h1", "label": "h1"}, {"id": "h2", "label": "h2"}, {"id": "h3", "label": "h3"}, {"id": "h4", "label": "h4"}, {"id": "h5", "label": "h5"}, {"id": "h6", "label": "h6"}, {"id": "subtitle1", "label": "subtitle1"}, {"id": "subtitle2", "label": "subtitle2"}, {"id": "caption", "label": "caption"}, {"id": "overline", "label": "overline"}, {"id": "button", "label": "button"}, {"id": "code", "label": "code"}]} onValueChange={value => setVariant(value as "body1" | "body2" | "bodyAlt2" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "caption" | "overline" | "button" | "code")} /><Select label="tone" value={tone} options={[{"id": "default", "label": "default"}, {"id": "muted", "label": "muted"}, {"id": "subtle", "label": "subtle"}, {"id": "accent", "label": "accent"}, {"id": "primary", "label": "primary (accent alias)"}, {"id": "danger", "label": "danger"}]} onValueChange={value => setTone(value as "default" | "muted" | "subtle" | "accent" | "primary" | "danger")} /><TextField label="text" value={text} onValueChange={setText} /><Checkbox label="noWrap" checked={noWrap} onCheckedChange={setNoWrap} /><Select label="Preview density" value={density} options={[{id:"comfortable",label:"Comfortable"},{id:"compact",label:"Compact"}]} onValueChange={value => setDensity(value as Density)} /></Stack>} source={source({name:"TypographyPlayground", imports, state, body:`<ThemeScope density=${literal(density)}>
<Typography variant={${literal(variant)}} tone={${literal(tone)}} noWrap={${noWrap}}>{${literal(text)}}</Typography>
</ThemeScope>`})}>
<Typography variant={variant} tone={tone} noWrap={noWrap}>{text}</Typography>
    </Example>;
}

function BoxPlayground({reference = false}: {reference?: boolean} = {}) {

if (reference) return <Stack gap={4}>
    <BoxPlaygroundPanel1 reference={reference} />
  </Stack>;
return <Stack gap={4}>
    <BoxPlaygroundPanel2 reference={reference} />
    <BoxPlayground reference />
  </Stack>;
}

function BoxPlaygroundPanel1({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [padding, setPadding] = useState<"0" | "1" | "2" | "3" | "4">("0");
const [as, setAs] = useState<"div" | "section" | "article" | "aside">("div");
const [container, setContainer] = useState(false);
const [text, setText] = useState("Contained content");
const imports = ["import { Box, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Compact and comfortable comparison" description="The same props in independent density scopes." source={source({name:"BoxPlaygroundDensities", imports, state, body:`<Stack gap={3}>
<ThemeScope density="compact"><Box as={${literal(as)}} padding={Number(${literal(padding)}) as 0 | 1 | 2 | 3 | 4} container={${container}}><Typography>{${literal(text)}}</Typography><Button>Continue learning</Button></Box></ThemeScope>
<ThemeScope density="comfortable"><Box as={${literal(as)}} padding={Number(${literal(padding)}) as 0 | 1 | 2 | 3 | 4} container={${container}}><Typography>{${literal(text)}}</Typography><Button>Continue learning</Button></Box></ThemeScope>
</Stack>`})}><Stack gap={3}><ThemeScope density="compact"><Box as={as} padding={Number(padding) as 0 | 1 | 2 | 3 | 4} container={container}><Typography>{text}</Typography><Button>Continue learning</Button></Box></ThemeScope><ThemeScope density="comfortable"><Box as={as} padding={Number(padding) as 0 | 1 | 2 | 3 | 4} container={container}><Typography>{text}</Typography><Button>Continue learning</Button></Box></ThemeScope></Stack></Example>;
}

function BoxPlaygroundPanel2({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [padding, setPadding] = useState<"0" | "1" | "2" | "3" | "4">("0");
const [as, setAs] = useState<"div" | "section" | "article" | "aside">("div");
const [container, setContainer] = useState(false);
const [text, setText] = useState("Contained content");
const imports = ["import { Box, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Prop playground" description="Native semantic wrapper with spacing and readable container width." density={density} controls={<Stack direction="row" wrap gap={3}><Select label="padding" value={padding} options={[{"id": "0", "label": "0"}, {"id": "1", "label": "1"}, {"id": "2", "label": "2"}, {"id": "3", "label": "3"}, {"id": "4", "label": "4"}]} onValueChange={value => setPadding(value as "0" | "1" | "2" | "3" | "4")} /><Select label="as" value={as} options={[{"id": "div", "label": "div"}, {"id": "section", "label": "section"}, {"id": "article", "label": "article"}, {"id": "aside", "label": "aside"}]} onValueChange={value => setAs(value as "div" | "section" | "article" | "aside")} /><Checkbox label="container" checked={container} onCheckedChange={setContainer} /><TextField label="text" value={text} onValueChange={setText} /><Select label="Preview density" value={density} options={[{id:"comfortable",label:"Comfortable"},{id:"compact",label:"Compact"}]} onValueChange={value => setDensity(value as Density)} /></Stack>} source={source({name:"BoxPlayground", imports, state, body:`<ThemeScope density=${literal(density)}>
<Box as={${literal(as)}} padding={Number(${literal(padding)}) as 0 | 1 | 2 | 3 | 4} container={${container}}><Typography>{${literal(text)}}</Typography><Button>Continue learning</Button></Box>
</ThemeScope>`})}>
<Box as={as} padding={Number(padding) as 0 | 1 | 2 | 3 | 4} container={container}><Typography>{text}</Typography><Button>Continue learning</Button></Box>
    </Example>;
}

function StackPlayground({reference = false}: {reference?: boolean} = {}) {
  const source = useExampleSource();
  const [density, setDensity] = useState<Density>("comfortable");
  const [action, setAction] = useState('No action yet');
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [selected, setSelected] = useState('overview');
  const [direction, setDirection] = useState<"row" | "column">("row");
  const [gap, setGap] = useState<"0" | "1" | "2" | "3" | "4">("0");
  const [align, setAlign] = useState<"start" | "center" | "end" | "stretch" | "baseline">("start");
  const [justify, setJustify] = useState<"start" | "center" | "end" | "between" | "around" | "evenly">("start");
  const [wrap, setWrap] = useState(true);
  const [responsive, setResponsive] = useState(false);
  const imports = ["import { Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
  const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
  if (reference) return <Stack gap={4}>
    {matrixDirections.flatMap(direction => matrixDensities.map(density => <StackMatrixExample key={`${direction}-${density}`} direction={direction} density={density} />))}
    {matrixDensities.map(density => <StackMatrixExample key={`responsive-${density}`} direction="row" density={density} responsive />)}
  </Stack>;
  return <Stack gap={4}>
    <Example title="Prop playground" description="Responsive spacing, alignment and wrapping for composed content." density={density} controls={<Stack direction="row" wrap gap={3}><Select label="direction" value={direction} options={[{"id": "row", "label": "row"}, {"id": "column", "label": "column"}]} onValueChange={value => setDirection(value as "row" | "column")} /><Select label="gap" value={gap} options={[{"id": "0", "label": "0"}, {"id": "1", "label": "1"}, {"id": "2", "label": "2"}, {"id": "3", "label": "3"}, {"id": "4", "label": "4"}]} onValueChange={value => setGap(value as "0" | "1" | "2" | "3" | "4")} /><Select label="align" value={align} options={[{"id": "start", "label": "start"}, {"id": "center", "label": "center"}, {"id": "end", "label": "end"}, {"id": "stretch", "label": "stretch"}, {"id": "baseline", "label": "baseline"}]} onValueChange={value => setAlign(value as "start" | "center" | "end" | "stretch" | "baseline")} /><Select label="justify" value={justify} options={[{"id": "start", "label": "start"}, {"id": "center", "label": "center"}, {"id": "end", "label": "end"}, {"id": "between", "label": "between"}, {"id": "around", "label": "around"}, {"id": "evenly", "label": "evenly"}]} onValueChange={value => setJustify(value as "start" | "center" | "end" | "between" | "around" | "evenly")} /><Checkbox label="wrap" checked={wrap} onCheckedChange={setWrap} /><Checkbox label="responsive" checked={responsive} onCheckedChange={setResponsive} /><Select label="Preview density" value={density} options={[{id:"comfortable",label:"Comfortable"},{id:"compact",label:"Compact"}]} onValueChange={value => setDensity(value as Density)} /></Stack>} source={source({name:"StackPlayground", imports, state, body:`<ThemeScope density=${literal(density)}>
<Stack direction={${literal(direction)}} gap={Number(${literal(gap)}) as 0 | 1 | 2 | 3 | 4} align={${literal(align)}} justify={${literal(justify)}} wrap={${wrap}} responsive={${responsive}}><Button>First</Button><Button variant="outlined">Second action</Button><Typography>Supporting content</Typography></Stack>
</ThemeScope>`})}>
<Stack direction={direction} gap={Number(gap) as 0 | 1 | 2 | 3 | 4} align={align} justify={justify} wrap={wrap} responsive={responsive}><Button>First</Button><Button variant="outlined">Second action</Button><Typography>Supporting content</Typography></Stack>
    </Example>
    <StackPlayground reference />
  </Stack>;
}

function SurfacePlayground({reference = false}: {reference?: boolean} = {}) {

if (reference) return <Stack gap={4}>
    <SurfacePlaygroundPanel1 reference={reference} />
    <SurfacePlaygroundPanel2 reference={reference} />
  </Stack>;
return <Stack gap={4}>
    <SurfacePlaygroundPanel3 reference={reference} />
    <SurfacePlayground reference />
  </Stack>;
}

function SurfacePlaygroundPanel1({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [variant, setVariant] = useState<"outlined" | "flat" | "raised">("outlined");
const [tone, setTone] = useState<"default" | "subtle">("default");
const [text, setText] = useState("Course summary");
const imports = ["import { Surface, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Compact and comfortable comparison" description="The same props in independent density scopes." source={source({name:"SurfacePlaygroundDensities", imports, state, body:`<Stack gap={3}>
<ThemeScope density="compact"><Surface variant={${literal(variant)}} tone={${literal(tone)}} padding={4}><Stack gap={2}><Typography variant="h5">{${literal(text)}}</Typography><Typography>Build a learning plan with clear next steps.</Typography><Button>Explore course</Button></Stack></Surface></ThemeScope>
<ThemeScope density="comfortable"><Surface variant={${literal(variant)}} tone={${literal(tone)}} padding={4}><Stack gap={2}><Typography variant="h5">{${literal(text)}}</Typography><Typography>Build a learning plan with clear next steps.</Typography><Button>Explore course</Button></Stack></Surface></ThemeScope>
</Stack>`})}><Stack gap={3}><ThemeScope density="compact"><Surface variant={variant} tone={tone} padding={4}><Stack gap={2}><Typography variant="h5">{text}</Typography><Typography>Build a learning plan with clear next steps.</Typography><Button>Explore course</Button></Stack></Surface></ThemeScope><ThemeScope density="comfortable"><Surface variant={variant} tone={tone} padding={4}><Stack gap={2}><Typography variant="h5">{text}</Typography><Typography>Build a learning plan with clear next steps.</Typography><Button>Explore course</Button></Stack></Surface></ThemeScope></Stack></Example>;
}

function SurfacePlaygroundPanel2({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [variant, setVariant] = useState<"outlined" | "flat" | "raised">("outlined");
const [tone, setTone] = useState<"default" | "subtle">("default");
const [text, setText] = useState("Course summary");
const imports = ["import { Surface, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Composed example" source={source({name:"SurfacePlaygroundComposition", imports, state, body:`<Stack direction="row" responsive gap={3}><Surface variant="flat" padding={4}><Typography>Flat</Typography></Surface><Surface variant="outlined" padding={4}><Typography>Outlined</Typography></Surface><Surface variant="raised" padding={4}><Typography>Raised</Typography></Surface></Stack>`})}><Stack direction="row" responsive gap={3}><Surface variant="flat" padding={4}><Typography>Flat</Typography></Surface><Surface variant="outlined" padding={4}><Typography>Outlined</Typography></Surface><Surface variant="raised" padding={4}><Typography>Raised</Typography></Surface></Stack></Example>;
}

function SurfacePlaygroundPanel3({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [variant, setVariant] = useState<"outlined" | "flat" | "raised">("outlined");
const [tone, setTone] = useState<"default" | "subtle">("default");
const [text, setText] = useState("Course summary");
const imports = ["import { Surface, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Prop playground" description="Shared surface elevation, tone and spacing." density={density} controls={<Stack direction="row" wrap gap={3}><Select label="variant" value={variant} options={[{"id": "outlined", "label": "outlined"}, {"id": "flat", "label": "flat"}, {"id": "raised", "label": "raised"}]} onValueChange={value => setVariant(value as "outlined" | "flat" | "raised")} /><Select label="tone" value={tone} options={[{"id": "default", "label": "default"}, {"id": "subtle", "label": "subtle"}]} onValueChange={value => setTone(value as "default" | "subtle")} /><TextField label="text" value={text} onValueChange={setText} /><Select label="Preview density" value={density} options={[{id:"comfortable",label:"Comfortable"},{id:"compact",label:"Compact"}]} onValueChange={value => setDensity(value as Density)} /></Stack>} source={source({name:"SurfacePlayground", imports, state, body:`<ThemeScope density=${literal(density)}>
<Surface variant={${literal(variant)}} tone={${literal(tone)}} padding={4}><Stack gap={2}><Typography variant="h5">{${literal(text)}}</Typography><Typography>Build a learning plan with clear next steps.</Typography><Button>Explore course</Button></Stack></Surface>
</ThemeScope>`})}>
<Surface variant={variant} tone={tone} padding={4}><Stack gap={2}><Typography variant="h5">{text}</Typography><Typography>Build a learning plan with clear next steps.</Typography><Button>Explore course</Button></Stack></Surface>
    </Example>;
}

function CardPlayground({reference = false}: {reference?: boolean} = {}) {

if (reference) return <Stack gap={4}>
    <CardPlaygroundPanel1 reference={reference} />
  </Stack>;
return <Stack gap={4}>
    <CardPlaygroundPanel2 reference={reference} />
    <CardPlayground reference />
  </Stack>;
}

function CardPlaygroundPanel1({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [variant, setVariant] = useState<"outlined" | "flat" | "raised">("outlined");
const [tone, setTone] = useState<"default" | "subtle">("default");
const [title, setTitle] = useState("Leadership foundations");
const imports = ["import { Card, CardContent, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Compact and comfortable comparison" description="The same props in independent density scopes." source={source({name:"CardPlaygroundDensities", imports, state, body:`<Stack gap={3}>
<ThemeScope density="compact"><Card variant={${literal(variant)}} tone={${literal(tone)}}><CardContent><Stack gap={3}><Typography variant="h5">{${literal(title)}}</Typography><Typography>Six modules · Self-paced</Typography><Button>View course</Button></Stack></CardContent></Card></ThemeScope>
<ThemeScope density="comfortable"><Card variant={${literal(variant)}} tone={${literal(tone)}}><CardContent><Stack gap={3}><Typography variant="h5">{${literal(title)}}</Typography><Typography>Six modules · Self-paced</Typography><Button>View course</Button></Stack></CardContent></Card></ThemeScope>
</Stack>`})}><Stack gap={3}><ThemeScope density="compact"><Card variant={variant} tone={tone}><CardContent><Stack gap={3}><Typography variant="h5">{title}</Typography><Typography>Six modules · Self-paced</Typography><Button>View course</Button></Stack></CardContent></Card></ThemeScope><ThemeScope density="comfortable"><Card variant={variant} tone={tone}><CardContent><Stack gap={3}><Typography variant="h5">{title}</Typography><Typography>Six modules · Self-paced</Typography><Button>View course</Button></Stack></CardContent></Card></ThemeScope></Stack></Example>;
}

function CardPlaygroundPanel2({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [variant, setVariant] = useState<"outlined" | "flat" | "raised">("outlined");
const [tone, setTone] = useState<"default" | "subtle">("default");
const [title, setTitle] = useState("Leadership foundations");
const imports = ["import { Card, CardContent, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Prop playground" description="Semantic cards with shared surfaces and padded content." density={density} controls={<Stack direction="row" wrap gap={3}><Select label="variant" value={variant} options={[{"id": "outlined", "label": "outlined"}, {"id": "flat", "label": "flat"}, {"id": "raised", "label": "raised"}]} onValueChange={value => setVariant(value as "outlined" | "flat" | "raised")} /><Select label="tone" value={tone} options={[{"id": "default", "label": "default"}, {"id": "subtle", "label": "subtle"}]} onValueChange={value => setTone(value as "default" | "subtle")} /><TextField label="title" value={title} onValueChange={setTitle} /><Select label="Preview density" value={density} options={[{id:"comfortable",label:"Comfortable"},{id:"compact",label:"Compact"}]} onValueChange={value => setDensity(value as Density)} /></Stack>} source={source({name:"CardPlayground", imports, state, body:`<ThemeScope density=${literal(density)}>
<Card variant={${literal(variant)}} tone={${literal(tone)}}><CardContent><Stack gap={3}><Typography variant="h5">{${literal(title)}}</Typography><Typography>Six modules · Self-paced</Typography><Button>View course</Button></Stack></CardContent></Card>
</ThemeScope>`})}>
<Card variant={variant} tone={tone}><CardContent><Stack gap={3}><Typography variant="h5">{title}</Typography><Typography>Six modules · Self-paced</Typography><Button>View course</Button></Stack></CardContent></Card>
    </Example>;
}

function DividerPlayground({reference = false}: {reference?: boolean} = {}) {

if (reference) return <Stack gap={4}>
    <DividerPlaygroundPanel1 reference={reference} />
  </Stack>;
return <Stack gap={4}>
    <DividerPlaygroundPanel2 reference={reference} />
    <DividerPlayground reference />
  </Stack>;
}

function DividerPlaygroundPanel1({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");
const [decorative, setDecorative] = useState(false);
const imports = ["import { Divider, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Compact and comfortable comparison" description="The same props in independent density scopes." source={source({name:"DividerPlaygroundDensities", imports, state, body:`<Stack gap={3}>
<ThemeScope density="compact"><Stack direction="row" align="stretch" gap={3}><Typography>Overview</Typography><Divider orientation={${literal(orientation)}} decorative={${decorative}} /><Typography>Lessons</Typography></Stack></ThemeScope>
<ThemeScope density="comfortable"><Stack direction="row" align="stretch" gap={3}><Typography>Overview</Typography><Divider orientation={${literal(orientation)}} decorative={${decorative}} /><Typography>Lessons</Typography></Stack></ThemeScope>
</Stack>`})}><Stack gap={3}><ThemeScope density="compact"><Stack direction="row" align="stretch" gap={3}><Typography>Overview</Typography><Divider orientation={orientation} decorative={decorative} /><Typography>Lessons</Typography></Stack></ThemeScope><ThemeScope density="comfortable"><Stack direction="row" align="stretch" gap={3}><Typography>Overview</Typography><Divider orientation={orientation} decorative={decorative} /><Typography>Lessons</Typography></Stack></ThemeScope></Stack></Example>;
}

function DividerPlaygroundPanel2({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");
const [decorative, setDecorative] = useState(false);
const imports = ["import { Divider, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Prop playground" description="Semantic or decorative separators in horizontal and vertical layouts." density={density} controls={<Stack direction="row" wrap gap={3}><Select label="orientation" value={orientation} options={[{"id": "horizontal", "label": "horizontal"}, {"id": "vertical", "label": "vertical"}]} onValueChange={value => setOrientation(value as "horizontal" | "vertical")} /><Checkbox label="decorative" checked={decorative} onCheckedChange={setDecorative} /><Select label="Preview density" value={density} options={[{id:"comfortable",label:"Comfortable"},{id:"compact",label:"Compact"}]} onValueChange={value => setDensity(value as Density)} /></Stack>} source={source({name:"DividerPlayground", imports, state, body:`<ThemeScope density=${literal(density)}>
<Stack direction="row" align="stretch" gap={3}><Typography>Overview</Typography><Divider orientation={${literal(orientation)}} decorative={${decorative}} /><Typography>Lessons</Typography></Stack>
</ThemeScope>`})}>
<Stack direction="row" align="stretch" gap={3}><Typography>Overview</Typography><Divider orientation={orientation} decorative={decorative} /><Typography>Lessons</Typography></Stack>
    </Example>;
}

function IconButtonPlayground({reference = false}: {reference?: boolean} = {}) {

if (reference) return <Stack gap={4}>
    <IconButtonPlaygroundPanel1 reference={reference} />
  </Stack>;
return <Stack gap={4}>
    <IconButtonPlaygroundPanel2 reference={reference} />
    <IconButtonPlayground reference />
  </Stack>;
}

function IconButtonPlaygroundPanel1({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [label, setLabel] = useState("Add lesson");
const [variant, setVariant] = useState<"text" | "filled" | "outlined">("text");
const [tone, setTone] = useState<"neutral" | "primary">("neutral");
const [disabled, setDisabled] = useState(false);
const [loading, setLoading] = useState(false);
const imports = ["import { IconButton, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';\nimport * as Icons from '@structured-growth/sg-ui/icons';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Compact and comfortable comparison" description="The same props in independent density scopes." source={source({name:"IconButtonPlaygroundDensities", imports, state, body:`<Stack gap={3}>
<ThemeScope density="compact"><Stack direction="row" gap={3} align="center"><IconButton label={${literal(label)}} variant={${literal(variant)}} tone={${literal(tone)}} disabled={${disabled}} loading={${loading}} onPress={() => setAction("Lesson added locally")}><Icons.AddIcon /></IconButton></Stack></ThemeScope>
<ThemeScope density="comfortable"><Stack direction="row" gap={3} align="center"><IconButton label={${literal(label)}} variant={${literal(variant)}} tone={${literal(tone)}} disabled={${disabled}} loading={${loading}} onPress={() => setAction("Lesson added locally")}><Icons.AddIcon /></IconButton></Stack></ThemeScope>
</Stack>`})}><Stack gap={3}><ThemeScope density="compact"><Stack direction="row" gap={3} align="center"><IconButton label={label} variant={variant} tone={tone} disabled={disabled} loading={loading} onPress={() => setAction("Lesson added locally")}><Icons.AddIcon /></IconButton></Stack></ThemeScope><ThemeScope density="comfortable"><Stack direction="row" gap={3} align="center"><IconButton label={label} variant={variant} tone={tone} disabled={disabled} loading={loading} onPress={() => setAction("Lesson added locally")}><Icons.AddIcon /></IconButton></Stack></ThemeScope></Stack></Example>;
}

function IconButtonPlaygroundPanel2({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [label, setLabel] = useState("Add lesson");
const [variant, setVariant] = useState<"text" | "filled" | "outlined">("text");
const [tone, setTone] = useState<"neutral" | "primary">("neutral");
const [disabled, setDisabled] = useState(false);
const [loading, setLoading] = useState(false);
const imports = ["import { IconButton, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';\nimport * as Icons from '@structured-growth/sg-ui/icons';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Prop playground" description="An accessible action name is required even when only an icon is visible." density={density} controls={<Stack direction="row" wrap gap={3}><TextField label="label" value={label} onValueChange={setLabel} /><Select label="variant" value={variant} options={[{"id": "text", "label": "text"}, {"id": "filled", "label": "filled"}, {"id": "outlined", "label": "outlined"}]} onValueChange={value => setVariant(value as "text" | "filled" | "outlined")} /><Select label="tone" value={tone} options={[{"id": "neutral", "label": "neutral"}, {"id": "primary", "label": "primary"}]} onValueChange={value => setTone(value as "neutral" | "primary")} /><Checkbox label="disabled" checked={disabled} onCheckedChange={setDisabled} /><Checkbox label="loading" checked={loading} onCheckedChange={setLoading} /><Select label="Preview density" value={density} options={[{id:"comfortable",label:"Comfortable"},{id:"compact",label:"Compact"}]} onValueChange={value => setDensity(value as Density)} /></Stack>} source={source({name:"IconButtonPlayground", imports, state, body:`<ThemeScope density=${literal(density)}>
<Stack direction="row" gap={3} align="center"><IconButton label={${literal(label)}} variant={${literal(variant)}} tone={${literal(tone)}} disabled={${disabled}} loading={${loading}} onPress={() => setAction("Lesson added locally")}><Icons.AddIcon /></IconButton></Stack>
</ThemeScope>`})}>
<Stack direction="row" gap={3} align="center"><IconButton label={label} variant={variant} tone={tone} disabled={disabled} loading={loading} onPress={() => setAction("Lesson added locally")}><Icons.AddIcon /></IconButton></Stack>
    </Example>;
}

function ButtonGroupPlayground({reference = false}: {reference?: boolean} = {}) {
  const source = useExampleSource();
  const [density, setDensity] = useState<Density>("comfortable");
  const [action, setAction] = useState('No action yet');
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [selected, setSelected] = useState('overview');
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");
  const [joined, setJoined] = useState(true);
  const [label, setLabel] = useState("Course actions");
  const imports = ["import { ButtonGroup, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
  const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
  if (reference) return <Stack gap={4}>
    {matrixOrientations.flatMap(orientation => matrixDensities.flatMap(density => [false,true].map(joined => <ButtonGroupMatrixExample key={`${orientation}-${density}-${joined}`} orientation={orientation} density={density} joined={joined} />)))}
    <ButtonGroupMatrixExample orientation="horizontal" density="comfortable" joined={false} variant="filled" />
    <ButtonGroupMatrixExample orientation="horizontal" density="comfortable" joined={false} variant="text" />
    <ButtonGroupMatrixExample orientation="vertical" density="comfortable" joined={false} contentStates />
  </Stack>;
  return <Stack gap={4}>
    <Example title="Prop playground" description="Group related native actions without changing their interaction semantics." density={density} controls={<Stack direction="row" wrap gap={3}><Select label="orientation" value={orientation} options={[{"id": "horizontal", "label": "horizontal"}, {"id": "vertical", "label": "vertical"}]} onValueChange={value => setOrientation(value as "horizontal" | "vertical")} /><Checkbox label="joined" checked={joined} onCheckedChange={setJoined} /><TextField label="label" value={label} onValueChange={setLabel} /><Select label="Preview density" value={density} options={[{id:"comfortable",label:"Comfortable"},{id:"compact",label:"Compact"}]} onValueChange={value => setDensity(value as Density)} /></Stack>} source={source({name:"ButtonGroupPlayground", imports, state, body:`<ThemeScope density=${literal(density)}>
<ButtonGroup label={${literal(label)}} orientation={${literal(orientation)}} joined={${joined}}><Button variant="outlined" onPress={() => setAction("Saved")}>Save</Button><Button variant="outlined" onPress={() => setAction("Duplicated")}>Duplicate</Button><Button variant="outlined" disabled>Archive</Button></ButtonGroup>
</ThemeScope>`})}>
<ButtonGroup label={label} orientation={orientation} joined={joined}><Button variant="outlined" onPress={() => setAction("Saved")}>Save</Button><Button variant="outlined" onPress={() => setAction("Duplicated")}>Duplicate</Button><Button variant="outlined" disabled>Archive</Button></ButtonGroup>
    </Example>
    <ButtonGroupPlayground reference />
  </Stack>;
}

function MenuPlayground({reference = false}: {reference?: boolean} = {}) {

if (reference) return <Stack gap={4}>
    <MenuPlaygroundPanel1 reference={reference} />
  </Stack>;
return <Stack gap={4}>
    <MenuPlaygroundPanel2 reference={reference} />
    <MenuPlayground reference />
  </Stack>;
}

function MenuPlaygroundPanel1({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [label, setLabel] = useState("Course actions");
const [placement, setPlacement] = useState<"bottom start" | "bottom end" | "top start" | "top end">("bottom start");
const [selectionMode, setSelectionMode] = useState<"multiple" | "single">("multiple");
const [errorMessage, setErrorMessage] = useState("");
const imports = ["import { Menu, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Compact and comfortable comparison" description="The same props in independent density scopes." source={source({name:"MenuPlaygroundDensities", imports, state, body:`<Stack gap={3}>
<ThemeScope density="compact"><Stack gap={3}><Menu label={${literal(label)}} placement={${literal(placement)}} selectionMode={${literal(selectionMode)}} errorMessage={${literal(errorMessage)}} trigger={<Button variant="outlined">Actions</Button>} items={[{id:"save",label:"Save",shortcut:"⌘S"},{id:"published",label:"Published",selected:action === "published"},{id:"archive",label:"Archive",disabled:true},{id:"delete",label:"Delete",tone:"danger",separatorBefore:true}]} onAction={setAction} /></Stack></ThemeScope>
<ThemeScope density="comfortable"><Stack gap={3}><Menu label={${literal(label)}} placement={${literal(placement)}} selectionMode={${literal(selectionMode)}} errorMessage={${literal(errorMessage)}} trigger={<Button variant="outlined">Actions</Button>} items={[{id:"save",label:"Save",shortcut:"⌘S"},{id:"published",label:"Published",selected:action === "published"},{id:"archive",label:"Archive",disabled:true},{id:"delete",label:"Delete",tone:"danger",separatorBefore:true}]} onAction={setAction} /></Stack></ThemeScope>
</Stack>`})}><Stack gap={3}><ThemeScope density="compact"><Stack gap={3}><Menu label={label} placement={placement} selectionMode={selectionMode} errorMessage={errorMessage} trigger={<Button variant="outlined">Actions</Button>} items={[{id:"save",label:"Save",shortcut:"⌘S"},{id:"published",label:"Published",selected:action === "published"},{id:"archive",label:"Archive",disabled:true},{id:"delete",label:"Delete",tone:"danger",separatorBefore:true}]} onAction={setAction} /></Stack></ThemeScope><ThemeScope density="comfortable"><Stack gap={3}><Menu label={label} placement={placement} selectionMode={selectionMode} errorMessage={errorMessage} trigger={<Button variant="outlined">Actions</Button>} items={[{id:"save",label:"Save",shortcut:"⌘S"},{id:"published",label:"Published",selected:action === "published"},{id:"archive",label:"Archive",disabled:true},{id:"delete",label:"Delete",tone:"danger",separatorBefore:true}]} onAction={setAction} /></Stack></ThemeScope></Stack></Example>;
}

function MenuPlaygroundPanel2({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [label, setLabel] = useState("Course actions");
const [placement, setPlacement] = useState<"bottom start" | "bottom end" | "top start" | "top end">("bottom start");
const [selectionMode, setSelectionMode] = useState<"multiple" | "single">("multiple");
const [errorMessage, setErrorMessage] = useState("");
const imports = ["import { Menu, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Prop playground" description="Host-owned actions, checked items, disabled commands and shortcuts." density={density} controls={<Stack direction="row" wrap gap={3}><TextField label="label" value={label} onValueChange={setLabel} /><Select label="placement" value={placement} options={[{"id": "bottom start", "label": "bottom start"}, {"id": "bottom end", "label": "bottom end"}, {"id": "top start", "label": "top start"}, {"id": "top end", "label": "top end"}]} onValueChange={value => setPlacement(value as "bottom start" | "bottom end" | "top start" | "top end")} /><Select label="selectionMode" value={selectionMode} options={[{"id": "multiple", "label": "multiple"}, {"id": "single", "label": "single"}]} onValueChange={value => setSelectionMode(value as "multiple" | "single")} /><TextField label="errorMessage" value={errorMessage} onValueChange={setErrorMessage} /><Select label="Preview density" value={density} options={[{id:"comfortable",label:"Comfortable"},{id:"compact",label:"Compact"}]} onValueChange={value => setDensity(value as Density)} /></Stack>} source={source({name:"MenuPlayground", imports, state, body:`<ThemeScope density=${literal(density)}>
<Stack gap={3}><Menu label={${literal(label)}} placement={${literal(placement)}} selectionMode={${literal(selectionMode)}} errorMessage={${literal(errorMessage)}} trigger={<Button variant="outlined">Actions</Button>} items={[{id:"save",label:"Save",shortcut:"⌘S"},{id:"published",label:"Published",selected:action === "published"},{id:"archive",label:"Archive",disabled:true},{id:"delete",label:"Delete",tone:"danger",separatorBefore:true}]} onAction={setAction} /></Stack>
</ThemeScope>`})}>
<Stack gap={3}><Menu label={label} placement={placement} selectionMode={selectionMode} errorMessage={errorMessage} trigger={<Button variant="outlined">Actions</Button>} items={[{id:"save",label:"Save",shortcut:"⌘S"},{id:"published",label:"Published",selected:action === "published"},{id:"archive",label:"Archive",disabled:true},{id:"delete",label:"Delete",tone:"danger",separatorBefore:true}]} onAction={setAction} /></Stack>
    </Example>;
}

function SplitActionPlayground({reference = false}: {reference?: boolean} = {}) {

if (reference) return <Stack gap={4}>
    <SplitActionPlaygroundPanel1 reference={reference} />
  </Stack>;
return <Stack gap={4}>
    <SplitActionPlaygroundPanel2 reference={reference} />
    <SplitActionPlayground reference />
  </Stack>;
}

function SplitActionPlaygroundPanel1({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [label, setLabel] = useState("Save course");
const [disabled, setDisabled] = useState(false);
const [loading, setLoading] = useState(false);
const imports = ["import { SplitAction, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Compact and comfortable comparison" description="The same props in independent density scopes." source={source({name:"SplitActionPlaygroundDensities", imports, state, body:`<Stack gap={3}>
<ThemeScope density="compact"><Stack gap={3}><SplitAction label={${literal(label)}} disabled={${disabled}} loading={${loading}} items={[{id:"draft",label:"Save draft"},{id:"copy",label:"Save a copy"}]} onPress={() => setAction("Saved locally")} onAction={setAction} /></Stack></ThemeScope>
<ThemeScope density="comfortable"><Stack gap={3}><SplitAction label={${literal(label)}} disabled={${disabled}} loading={${loading}} items={[{id:"draft",label:"Save draft"},{id:"copy",label:"Save a copy"}]} onPress={() => setAction("Saved locally")} onAction={setAction} /></Stack></ThemeScope>
</Stack>`})}><Stack gap={3}><ThemeScope density="compact"><Stack gap={3}><SplitAction label={label} disabled={disabled} loading={loading} items={[{id:"draft",label:"Save draft"},{id:"copy",label:"Save a copy"}]} onPress={() => setAction("Saved locally")} onAction={setAction} /></Stack></ThemeScope><ThemeScope density="comfortable"><Stack gap={3}><SplitAction label={label} disabled={disabled} loading={loading} items={[{id:"draft",label:"Save draft"},{id:"copy",label:"Save a copy"}]} onPress={() => setAction("Saved locally")} onAction={setAction} /></Stack></ThemeScope></Stack></Example>;
}

function SplitActionPlaygroundPanel2({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [label, setLabel] = useState("Save course");
const [disabled, setDisabled] = useState(false);
const [loading, setLoading] = useState(false);
const imports = ["import { SplitAction, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Prop playground" description="A primary command and secondary menu share a neutral action group." density={density} controls={<Stack direction="row" wrap gap={3}><TextField label="label" value={label} onValueChange={setLabel} /><Checkbox label="disabled" checked={disabled} onCheckedChange={setDisabled} /><Checkbox label="loading" checked={loading} onCheckedChange={setLoading} /><Select label="Preview density" value={density} options={[{id:"comfortable",label:"Comfortable"},{id:"compact",label:"Compact"}]} onValueChange={value => setDensity(value as Density)} /></Stack>} source={source({name:"SplitActionPlayground", imports, state, body:`<ThemeScope density=${literal(density)}>
<Stack gap={3}><SplitAction label={${literal(label)}} disabled={${disabled}} loading={${loading}} items={[{id:"draft",label:"Save draft"},{id:"copy",label:"Save a copy"}]} onPress={() => setAction("Saved locally")} onAction={setAction} /></Stack>
</ThemeScope>`})}>
<Stack gap={3}><SplitAction label={label} disabled={disabled} loading={loading} items={[{id:"draft",label:"Save draft"},{id:"copy",label:"Save a copy"}]} onPress={() => setAction("Saved locally")} onAction={setAction} /></Stack>
    </Example>;
}

function LinkPlayground({reference = false}: {reference?: boolean} = {}) {

if (reference) return <Stack gap={4}>
    <LinkPlaygroundPanel1 reference={reference} />
  </Stack>;
return <Stack gap={4}>
    <LinkPlaygroundPanel2 reference={reference} />
    <LinkPlayground reference />
  </Stack>;
}

function LinkPlaygroundPanel1({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [text, setText] = useState("Read the installation guide");
const [underline, setUnderline] = useState<"hover" | "always" | "none">("hover");
const [tone, setTone] = useState<"primary" | "inherit">("primary");
const [newTab, setNewTab] = useState(false);
const imports = ["import { Link, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Compact and comfortable comparison" description="The same props in independent density scopes." source={source({name:"LinkPlaygroundDensities", imports, state, body:`<Stack gap={3}>
<ThemeScope density="compact"><Link href="https://example.com/docs" external underline={${literal(underline)}} tone={${literal(tone)}} target={${newTab} ? "_blank" : "_self"}>{${literal(text)}}</Link></ThemeScope>
<ThemeScope density="comfortable"><Link href="https://example.com/docs" external underline={${literal(underline)}} tone={${literal(tone)}} target={${newTab} ? "_blank" : "_self"}>{${literal(text)}}</Link></ThemeScope>
</Stack>`})}><Stack gap={3}><ThemeScope density="compact"><Link href="https://example.com/docs" external underline={underline} tone={tone} target={newTab ? "_blank" : "_self"}>{text}</Link></ThemeScope><ThemeScope density="comfortable"><Link href="https://example.com/docs" external underline={underline} tone={tone} target={newTab ? "_blank" : "_self"}>{text}</Link></ThemeScope></Stack></Example>;
}

function LinkPlaygroundPanel2({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [text, setText] = useState("Read the installation guide");
const [underline, setUnderline] = useState<"hover" | "always" | "none">("hover");
const [tone, setTone] = useState<"primary" | "inherit">("primary");
const [newTab, setNewTab] = useState(false);
const imports = ["import { Link, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Prop playground" description="Native external navigation and host adapter routing for internal links." density={density} controls={<Stack direction="row" wrap gap={3}><TextField label="text" value={text} onValueChange={setText} /><Select label="underline" value={underline} options={[{"id": "hover", "label": "hover"}, {"id": "always", "label": "always"}, {"id": "none", "label": "none"}]} onValueChange={value => setUnderline(value as "hover" | "always" | "none")} /><Select label="tone" value={tone} options={[{"id": "primary", "label": "primary"}, {"id": "inherit", "label": "inherit"}]} onValueChange={value => setTone(value as "primary" | "inherit")} /><Checkbox label="newTab" checked={newTab} onCheckedChange={setNewTab} /><Select label="Preview density" value={density} options={[{id:"comfortable",label:"Comfortable"},{id:"compact",label:"Compact"}]} onValueChange={value => setDensity(value as Density)} /></Stack>} source={source({name:"LinkPlayground", imports, state, body:`<ThemeScope density=${literal(density)}>
<Link href="https://example.com/docs" external underline={${literal(underline)}} tone={${literal(tone)}} target={${newTab} ? "_blank" : "_self"}>{${literal(text)}}</Link>
</ThemeScope>`})}>
<Link href="https://example.com/docs" external underline={underline} tone={tone} target={newTab ? "_blank" : "_self"}>{text}</Link>
    </Example>;
}

function BreadcrumbsPlayground({reference = false}: {reference?: boolean} = {}) {

if (reference) return <Stack gap={4}>
    <BreadcrumbsPlaygroundPanel1 reference={reference} />
  </Stack>;
return <Stack gap={4}>
    <BreadcrumbsPlaygroundPanel2 reference={reference} />
    <BreadcrumbsPlayground reference />
  </Stack>;
}

function BreadcrumbsPlaygroundPanel1({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [label, setLabel] = useState("Course breadcrumb");
const [current, setCurrent] = useState("Leadership foundations");
const imports = ["import { Breadcrumbs, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Compact and comfortable comparison" description="The same props in independent density scopes." source={source({name:"BreadcrumbsPlaygroundDensities", imports, state, body:`<Stack gap={3}>
<ThemeScope density="compact"><Breadcrumbs label={${literal(label)}} items={[{id:"home",label:"Home",href:"#home"},{id:"courses",label:"Courses",href:"#courses"},{id:"current",label:${literal(current)}}]} /></ThemeScope>
<ThemeScope density="comfortable"><Breadcrumbs label={${literal(label)}} items={[{id:"home",label:"Home",href:"#home"},{id:"courses",label:"Courses",href:"#courses"},{id:"current",label:${literal(current)}}]} /></ThemeScope>
</Stack>`})}><Stack gap={3}><ThemeScope density="compact"><Breadcrumbs label={label} items={[{id:"home",label:"Home",href:"#home"},{id:"courses",label:"Courses",href:"#courses"},{id:"current",label:current}]} /></ThemeScope><ThemeScope density="comfortable"><Breadcrumbs label={label} items={[{id:"home",label:"Home",href:"#home"},{id:"courses",label:"Courses",href:"#courses"},{id:"current",label:current}]} /></ThemeScope></Stack></Example>;
}

function BreadcrumbsPlaygroundPanel2({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [label, setLabel] = useState("Course breadcrumb");
const [current, setCurrent] = useState("Leadership foundations");
const imports = ["import { Breadcrumbs, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Prop playground" description="A named navigation landmark with a non-link current item." density={density} controls={<Stack direction="row" wrap gap={3}><TextField label="label" value={label} onValueChange={setLabel} /><TextField label="current" value={current} onValueChange={setCurrent} /><Select label="Preview density" value={density} options={[{id:"comfortable",label:"Comfortable"},{id:"compact",label:"Compact"}]} onValueChange={value => setDensity(value as Density)} /></Stack>} source={source({name:"BreadcrumbsPlayground", imports, state, body:`<ThemeScope density=${literal(density)}>
<Breadcrumbs label={${literal(label)}} items={[{id:"home",label:"Home",href:"#home"},{id:"courses",label:"Courses",href:"#courses"},{id:"current",label:${literal(current)}}]} />
</ThemeScope>`})}>
<Breadcrumbs label={label} items={[{id:"home",label:"Home",href:"#home"},{id:"courses",label:"Courses",href:"#courses"},{id:"current",label:current}]} />
    </Example>;
}

function TooltipPlayground({reference = false}: {reference?: boolean} = {}) {

if (reference) return <Stack gap={4}>
    <TooltipPlaygroundPanel1 reference={reference} />
  </Stack>;
return <Stack gap={4}>
    <TooltipPlaygroundPanel2 reference={reference} />
    <TooltipPlayground reference />
  </Stack>;
}

function TooltipPlaygroundPanel1({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [content, setContent] = useState("Adds a new lesson to this course");
const [placement, setPlacement] = useState<"top" | "bottom" | "start" | "end">("top");
const [disabled, setDisabled] = useState(false);
const imports = ["import { Tooltip, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Compact and comfortable comparison" description="The same props in independent density scopes." source={source({name:"TooltipPlaygroundDensities", imports, state, body:`<Stack gap={3}>
<ThemeScope density="compact"><Tooltip content={${literal(content)}} placement={${literal(placement)}} disabled={${disabled}} delay={0} trigger={<Button variant="outlined">Add lesson</Button>} /></ThemeScope>
<ThemeScope density="comfortable"><Tooltip content={${literal(content)}} placement={${literal(placement)}} disabled={${disabled}} delay={0} trigger={<Button variant="outlined">Add lesson</Button>} /></ThemeScope>
</Stack>`})}><Stack gap={3}><ThemeScope density="compact"><Tooltip content={content} placement={placement} disabled={disabled} delay={0} trigger={<Button variant="outlined">Add lesson</Button>} /></ThemeScope><ThemeScope density="comfortable"><Tooltip content={content} placement={placement} disabled={disabled} delay={0} trigger={<Button variant="outlined">Add lesson</Button>} /></ThemeScope></Stack></Example>;
}

function TooltipPlaygroundPanel2({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [content, setContent] = useState("Adds a new lesson to this course");
const [placement, setPlacement] = useState<"top" | "bottom" | "start" | "end">("top");
const [disabled, setDisabled] = useState(false);
const imports = ["import { Tooltip, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Prop playground" description="Plain supplementary descriptions for pointer and keyboard focus." density={density} controls={<Stack direction="row" wrap gap={3}><TextField label="content" value={content} onValueChange={setContent} /><Select label="placement" value={placement} options={[{"id": "top", "label": "top"}, {"id": "bottom", "label": "bottom"}, {"id": "start", "label": "start"}, {"id": "end", "label": "end"}]} onValueChange={value => setPlacement(value as "top" | "bottom" | "start" | "end")} /><Checkbox label="disabled" checked={disabled} onCheckedChange={setDisabled} /><Select label="Preview density" value={density} options={[{id:"comfortable",label:"Comfortable"},{id:"compact",label:"Compact"}]} onValueChange={value => setDensity(value as Density)} /></Stack>} source={source({name:"TooltipPlayground", imports, state, body:`<ThemeScope density=${literal(density)}>
<Tooltip content={${literal(content)}} placement={${literal(placement)}} disabled={${disabled}} delay={0} trigger={<Button variant="outlined">Add lesson</Button>} />
</ThemeScope>`})}>
<Tooltip content={content} placement={placement} disabled={disabled} delay={0} trigger={<Button variant="outlined">Add lesson</Button>} />
    </Example>;
}

function ListPlayground({reference = false}: {reference?: boolean} = {}) {

if (reference) return <Stack gap={4}>
    <ListPlaygroundPanel1 reference={reference} />
  </Stack>;
return <Stack gap={4}>
    <ListPlaygroundPanel2 reference={reference} />
    <ListPlayground reference />
  </Stack>;
}

function ListPlaygroundPanel1({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [title, setTitle] = useState("Course overview");
const [secondary, setSecondary] = useState("Six lessons ready");
const [disabled, setDisabled] = useState(false);
const imports = ["import { List, ListItem, ListItemButton, ListItemText, ListItemIcon, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';\nimport * as Icons from '@structured-growth/sg-ui/icons';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Compact and comfortable comparison" description="The same props in independent density scopes." source={source({name:"ListPlaygroundDensities", imports, state, body:`<Stack gap={3}>
<ThemeScope density="compact"><List aria-label="Course sections"><ListItem><ListItemButton selected={selected === "overview"} disabled={${disabled}} onPress={() => setSelected("overview")}><ListItemIcon><Icons.BookIcon /></ListItemIcon><ListItemText primary={${literal(title)}} secondary={${literal(secondary)}} /></ListItemButton></ListItem><ListItem><ListItemButton selected={selected === "lessons"} onPress={() => setSelected("lessons")}><ListItemText primary="Lessons" secondary="Choose your next activity" /></ListItemButton></ListItem></List></ThemeScope>
<ThemeScope density="comfortable"><List aria-label="Course sections"><ListItem><ListItemButton selected={selected === "overview"} disabled={${disabled}} onPress={() => setSelected("overview")}><ListItemIcon><Icons.BookIcon /></ListItemIcon><ListItemText primary={${literal(title)}} secondary={${literal(secondary)}} /></ListItemButton></ListItem><ListItem><ListItemButton selected={selected === "lessons"} onPress={() => setSelected("lessons")}><ListItemText primary="Lessons" secondary="Choose your next activity" /></ListItemButton></ListItem></List></ThemeScope>
</Stack>`})}><Stack gap={3}><ThemeScope density="compact"><List aria-label="Course sections"><ListItem><ListItemButton selected={selected === "overview"} disabled={disabled} onPress={() => setSelected("overview")}><ListItemIcon><Icons.BookIcon /></ListItemIcon><ListItemText primary={title} secondary={secondary} /></ListItemButton></ListItem><ListItem><ListItemButton selected={selected === "lessons"} onPress={() => setSelected("lessons")}><ListItemText primary="Lessons" secondary="Choose your next activity" /></ListItemButton></ListItem></List></ThemeScope><ThemeScope density="comfortable"><List aria-label="Course sections"><ListItem><ListItemButton selected={selected === "overview"} disabled={disabled} onPress={() => setSelected("overview")}><ListItemIcon><Icons.BookIcon /></ListItemIcon><ListItemText primary={title} secondary={secondary} /></ListItemButton></ListItem><ListItem><ListItemButton selected={selected === "lessons"} onPress={() => setSelected("lessons")}><ListItemText primary="Lessons" secondary="Choose your next activity" /></ListItemButton></ListItem></List></ThemeScope></Stack></Example>;
}

function ListPlaygroundPanel2({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [title, setTitle] = useState("Course overview");
const [secondary, setSecondary] = useState("Six lessons ready");
const [disabled, setDisabled] = useState(false);
const imports = ["import { List, ListItem, ListItemButton, ListItemText, ListItemIcon, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';\nimport * as Icons from '@structured-growth/sg-ui/icons';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Prop playground" description="Native list semantics with optional selectable actions and secondary text." density={density} controls={<Stack direction="row" wrap gap={3}><TextField label="title" value={title} onValueChange={setTitle} /><TextField label="secondary" value={secondary} onValueChange={setSecondary} /><Checkbox label="disabled" checked={disabled} onCheckedChange={setDisabled} /><Select label="Preview density" value={density} options={[{id:"comfortable",label:"Comfortable"},{id:"compact",label:"Compact"}]} onValueChange={value => setDensity(value as Density)} /></Stack>} source={source({name:"ListPlayground", imports, state, body:`<ThemeScope density=${literal(density)}>
<List aria-label="Course sections"><ListItem><ListItemButton selected={selected === "overview"} disabled={${disabled}} onPress={() => setSelected("overview")}><ListItemIcon><Icons.BookIcon /></ListItemIcon><ListItemText primary={${literal(title)}} secondary={${literal(secondary)}} /></ListItemButton></ListItem><ListItem><ListItemButton selected={selected === "lessons"} onPress={() => setSelected("lessons")}><ListItemText primary="Lessons" secondary="Choose your next activity" /></ListItemButton></ListItem></List>
</ThemeScope>`})}>
<List aria-label="Course sections"><ListItem><ListItemButton selected={selected === "overview"} disabled={disabled} onPress={() => setSelected("overview")}><ListItemIcon><Icons.BookIcon /></ListItemIcon><ListItemText primary={title} secondary={secondary} /></ListItemButton></ListItem><ListItem><ListItemButton selected={selected === "lessons"} onPress={() => setSelected("lessons")}><ListItemText primary="Lessons" secondary="Choose your next activity" /></ListItemButton></ListItem></List>
    </Example>;
}

function NavigationPlayground({reference = false}: {reference?: boolean} = {}) {
  const source = useExampleSource();
  const [density, setDensity] = useState<Density>("comfortable");
  const [action, setAction] = useState('No action yet');
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [selected, setSelected] = useState('overview');
  const [layout, setLayout] = useState<"row" | "column">("column");
  const [label, setLabel] = useState("Course navigation");
  const [current, setCurrent] = useState<"overview" | "lessons">("overview");
  const [text, setText] = useState("Overview");
  const imports = ["import { Navigation, NavigationItem, List, ListItem, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
  const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
  if (reference) return <Stack gap={4}>
    {matrixDirections.flatMap(direction => matrixDensities.flatMap(density => (['ltr','rtl'] as const).map(dir => <NavigationMatrixExample key={`${direction}-${density}-${dir}`} direction={direction} density={density} dir={dir} />)))}
  </Stack>;
  return <Stack gap={4}>
    <Example title="Prop playground" description="Route ownership remains with the host; current links expose aria-current." density={density} controls={<Stack direction="row" wrap gap={3}><Select label="Navigation layout" value={layout} options={[{id:"row",label:"Horizontal"},{id:"column",label:"Vertical"}]} onValueChange={value => setLayout(value as typeof layout)} /><TextField label="label" value={label} onValueChange={setLabel} /><Select label="current" value={current} options={[{"id": "overview", "label": "overview"}, {"id": "lessons", "label": "lessons"}]} onValueChange={value => setCurrent(value as "overview" | "lessons")} /><TextField label="text" value={text} onValueChange={setText} /><Select label="Preview density" value={density} options={[{id:"comfortable",label:"Comfortable"},{id:"compact",label:"Compact"}]} onValueChange={value => setDensity(value as Density)} /></Stack>} source={source({name:"NavigationPlayground", imports, state, body:`<ThemeScope density=${literal(density)}>
<Navigation label={${literal(label)}}><Stack direction={${literal(layout)}} gap={2} wrap><NavigationItem href="#overview" current={(${literal(current)} as string) === "overview"}>{${literal(text)}}</NavigationItem><NavigationItem href="#lessons" current={(${literal(current)} as string) === "lessons"}>Lessons</NavigationItem></Stack></Navigation>
</ThemeScope>`})}>
<Navigation label={label}><Stack direction={layout} gap={2} wrap><NavigationItem href="#overview" current={current === "overview"}>{text}</NavigationItem><NavigationItem href="#lessons" current={current === "lessons"}>Lessons</NavigationItem></Stack></Navigation>
    </Example>
    <NavigationPlayground reference />
  </Stack>;
}

function DisclosurePlayground({reference = false}: {reference?: boolean} = {}) {

if (reference) return <Stack gap={4}>
    <DisclosurePlaygroundPanel1 reference={reference} />
  </Stack>;
return <Stack gap={4}>
    <DisclosurePlaygroundPanel2 reference={reference} />
    <DisclosurePlayground reference />
  </Stack>;
}

function DisclosurePlaygroundPanel1({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [label, setLabel] = useState("Course prerequisites");
const [disabled, setDisabled] = useState(false);
const [unmountOnCollapse, setUnmountOnCollapse] = useState(false);
const imports = ["import { Disclosure, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Compact and comfortable comparison" description="The same props in independent density scopes." source={source({name:"DisclosurePlaygroundDensities", imports, state, body:`<Stack gap={3}>
<ThemeScope density="compact"><Disclosure label={${literal(label)}} disabled={${disabled}} unmountOnCollapse={${unmountOnCollapse}} expanded={open} onExpandedChange={setOpen}><Typography>No prior experience is required.</Typography><Button>View preparation guide</Button></Disclosure></ThemeScope>
<ThemeScope density="comfortable"><Disclosure label={${literal(label)}} disabled={${disabled}} unmountOnCollapse={${unmountOnCollapse}} expanded={open} onExpandedChange={setOpen}><Typography>No prior experience is required.</Typography><Button>View preparation guide</Button></Disclosure></ThemeScope>
</Stack>`})}><Stack gap={3}><ThemeScope density="compact"><Disclosure label={label} disabled={disabled} unmountOnCollapse={unmountOnCollapse} expanded={open} onExpandedChange={setOpen}><Typography>No prior experience is required.</Typography><Button>View preparation guide</Button></Disclosure></ThemeScope><ThemeScope density="comfortable"><Disclosure label={label} disabled={disabled} unmountOnCollapse={unmountOnCollapse} expanded={open} onExpandedChange={setOpen}><Typography>No prior experience is required.</Typography><Button>View preparation guide</Button></Disclosure></ThemeScope></Stack></Example>;
}

function DisclosurePlaygroundPanel2({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [label, setLabel] = useState("Course prerequisites");
const [disabled, setDisabled] = useState(false);
const [unmountOnCollapse, setUnmountOnCollapse] = useState(false);
const imports = ["import { Disclosure, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Prop playground" description="Expandable regions with controlled state and optional child unmounting." density={density} controls={<Stack direction="row" wrap gap={3}><TextField label="label" value={label} onValueChange={setLabel} /><Checkbox label="disabled" checked={disabled} onCheckedChange={setDisabled} /><Checkbox label="unmountOnCollapse" checked={unmountOnCollapse} onCheckedChange={setUnmountOnCollapse} /><Select label="Preview density" value={density} options={[{id:"comfortable",label:"Comfortable"},{id:"compact",label:"Compact"}]} onValueChange={value => setDensity(value as Density)} /></Stack>} source={source({name:"DisclosurePlayground", imports, state, body:`<ThemeScope density=${literal(density)}>
<Disclosure label={${literal(label)}} disabled={${disabled}} unmountOnCollapse={${unmountOnCollapse}} expanded={open} onExpandedChange={setOpen}><Typography>No prior experience is required.</Typography><Button>View preparation guide</Button></Disclosure>
</ThemeScope>`})}>
<Disclosure label={label} disabled={disabled} unmountOnCollapse={unmountOnCollapse} expanded={open} onExpandedChange={setOpen}><Typography>No prior experience is required.</Typography><Button>View preparation guide</Button></Disclosure>
    </Example>;
}

function CollapsePlayground({reference = false}: {reference?: boolean} = {}) {

if (reference) return <Stack gap={4}>
    <CollapsePlaygroundPanel1 reference={reference} />
  </Stack>;
return <Stack gap={4}>
    <CollapsePlaygroundPanel2 reference={reference} />
    <CollapsePlayground reference />
  </Stack>;
}

function CollapsePlaygroundPanel1({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [unmountOnCollapse, setUnmountOnCollapse] = useState(false);
const [text, setText] = useState("This section keeps child state while hidden.");
const imports = ["import { Collapse, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Compact and comfortable comparison" description="The same props in independent density scopes." source={source({name:"CollapsePlaygroundDensities", imports, state, body:`<Stack gap={3}>
<ThemeScope density="compact"><Stack gap={3}><Button aria-expanded={open} onPress={() => setOpen(value => !value)}>Toggle details</Button><Collapse expanded={open} unmountOnCollapse={${unmountOnCollapse}}><Typography>{${literal(text)}}</Typography><Button>Read more</Button></Collapse></Stack></ThemeScope>
<ThemeScope density="comfortable"><Stack gap={3}><Button aria-expanded={open} onPress={() => setOpen(value => !value)}>Toggle details</Button><Collapse expanded={open} unmountOnCollapse={${unmountOnCollapse}}><Typography>{${literal(text)}}</Typography><Button>Read more</Button></Collapse></Stack></ThemeScope>
</Stack>`})}><Stack gap={3}><ThemeScope density="compact"><Stack gap={3}><Button aria-expanded={open} onPress={() => setOpen(value => !value)}>Toggle details</Button><Collapse expanded={open} unmountOnCollapse={unmountOnCollapse}><Typography>{text}</Typography><Button>Read more</Button></Collapse></Stack></ThemeScope><ThemeScope density="comfortable"><Stack gap={3}><Button aria-expanded={open} onPress={() => setOpen(value => !value)}>Toggle details</Button><Collapse expanded={open} unmountOnCollapse={unmountOnCollapse}><Typography>{text}</Typography><Button>Read more</Button></Collapse></Stack></ThemeScope></Stack></Example>;
}

function CollapsePlaygroundPanel2({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [unmountOnCollapse, setUnmountOnCollapse] = useState(false);
const [text, setText] = useState("This section keeps child state while hidden.");
const imports = ["import { Collapse, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Prop playground" description="Host-owned visibility preserves children by default." density={density} controls={<Stack direction="row" wrap gap={3}><Checkbox label="unmountOnCollapse" checked={unmountOnCollapse} onCheckedChange={setUnmountOnCollapse} /><TextField label="text" value={text} onValueChange={setText} /><Select label="Preview density" value={density} options={[{id:"comfortable",label:"Comfortable"},{id:"compact",label:"Compact"}]} onValueChange={value => setDensity(value as Density)} /></Stack>} source={source({name:"CollapsePlayground", imports, state, body:`<ThemeScope density=${literal(density)}>
<Stack gap={3}><Button aria-expanded={open} onPress={() => setOpen(value => !value)}>Toggle details</Button><Collapse expanded={open} unmountOnCollapse={${unmountOnCollapse}}><Typography>{${literal(text)}}</Typography><Button>Read more</Button></Collapse></Stack>
</ThemeScope>`})}>
<Stack gap={3}><Button aria-expanded={open} onPress={() => setOpen(value => !value)}>Toggle details</Button><Collapse expanded={open} unmountOnCollapse={unmountOnCollapse}><Typography>{text}</Typography><Button>Read more</Button></Collapse></Stack>
    </Example>;
}

function ChipPlayground({reference = false}: {reference?: boolean} = {}) {

if (reference) return <Stack gap={4}>
    <ChipPlaygroundPanel1 reference={reference} />
    <ChipPlaygroundPanel2 reference={reference} />
    <ChipPlaygroundPanel3 reference={reference} />
  </Stack>;
return <Stack gap={4}>
    <ChipPlaygroundPanel4 reference={reference} />
    <ChipPlayground reference />
  </Stack>;
}

function ChipPlaygroundPanel1({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [text, setText] = useState("Published");
const [tone, setTone] = useState<"neutral" | "primary">("neutral");
const [variant, setVariant] = useState<"filled" | "outlined">("filled");
const imports = ["import { Chip, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Compact and comfortable comparison" description="The same props in independent density scopes." source={source({name:"ChipPlaygroundDensities", imports, state, body:`<Stack gap={3}>
<ThemeScope density="compact"><Chip tone={${literal(tone)}} variant={${literal(variant)}}>{${literal(text)}}</Chip></ThemeScope>
<ThemeScope density="comfortable"><Chip tone={${literal(tone)}} variant={${literal(variant)}}>{${literal(text)}}</Chip></ThemeScope>
</Stack>`})}><Stack gap={3}><ThemeScope density="compact"><Chip tone={tone} variant={variant}>{text}</Chip></ThemeScope><ThemeScope density="comfortable"><Chip tone={tone} variant={variant}>{text}</Chip></ThemeScope></Stack></Example>;
}

function ChipPlaygroundPanel2({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [text, setText] = useState("Published");
const [tone, setTone] = useState<"neutral" | "primary">("neutral");
const [variant, setVariant] = useState<"filled" | "outlined">("filled");
const imports = ["import { Chip, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Composed example" source={source({name:"ChipPlaygroundComposition", imports, state, body:`<Stack direction="row" wrap gap={3}><Chip tone="neutral">Draft</Chip><Chip tone="primary">Published</Chip><Chip variant="outlined">Archived</Chip></Stack>`})}><Stack direction="row" wrap gap={3}><Chip tone="neutral">Draft</Chip><Chip tone="primary">Published</Chip><Chip variant="outlined">Archived</Chip></Stack></Example>;
}

function ChipPlaygroundPanel3({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [text, setText] = useState("Published");
const [tone, setTone] = useState<"neutral" | "primary">("neutral");
const [variant, setVariant] = useState<"filled" | "outlined">("filled");
const imports = ["import { Chip, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Tone and variant matrix" source={source({name:"ChipMatrix", imports:["import { Chip, Stack } from '@structured-growth/sg-ui/experimental';"], body:`<Stack direction="row" wrap gap={3}>{(["neutral","primary"] as const).map(tone => (["filled","outlined"] as const).map(variant => <Chip key={\`\${tone}-\${variant}\`} tone={tone} variant={variant}>{tone} · {variant}</Chip>))}</Stack>`})}><Stack direction="row" wrap gap={3}>{(["neutral","primary"] as const).map(tone => (["filled","outlined"] as const).map(variant => <Chip key={`${tone}-${variant}`} tone={tone} variant={variant}>{tone} · {variant}</Chip>))}</Stack></Example>;
}

function ChipPlaygroundPanel4({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [text, setText] = useState("Published");
const [tone, setTone] = useState<"neutral" | "primary">("neutral");
const [variant, setVariant] = useState<"filled" | "outlined">("filled");
const imports = ["import { Chip, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Prop playground" description="Presentation labels with owned tone, variant and local density." density={density} controls={<Stack direction="row" wrap gap={3}><TextField label="text" value={text} onValueChange={setText} /><Select label="tone" value={tone} options={[{"id": "neutral", "label": "neutral"}, {"id": "primary", "label": "primary"}]} onValueChange={value => setTone(value as "neutral" | "primary")} /><Select label="variant" value={variant} options={[{"id": "filled", "label": "filled"}, {"id": "outlined", "label": "outlined"}]} onValueChange={value => setVariant(value as "filled" | "outlined")} /><Select label="Preview density" value={density} options={[{id:"comfortable",label:"Comfortable"},{id:"compact",label:"Compact"}]} onValueChange={value => setDensity(value as Density)} /></Stack>} source={source({name:"ChipPlayground", imports, state, body:`<ThemeScope density=${literal(density)}>
<Chip tone={${literal(tone)}} variant={${literal(variant)}}>{${literal(text)}}</Chip>
</ThemeScope>`})}>
<Chip tone={tone} variant={variant}>{text}</Chip>
    </Example>;
}

function BadgePlayground({reference = false}: {reference?: boolean} = {}) {

if (reference) return <Stack gap={4}>
    <BadgePlaygroundPanel1 reference={reference} />
    <BadgePlaygroundPanel2 reference={reference} />
  </Stack>;
return <Stack gap={4}>
    <BadgePlaygroundPanel3 reference={reference} />
    <BadgePlayground reference />
  </Stack>;
}

function BadgePlaygroundPanel1({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [content, setContent] = useState("12");
const [tone, setTone] = useState<"primary" | "neutral">("primary");
const [label, setLabel] = useState("Unread messages");
const imports = ["import { Badge, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Compact and comfortable comparison" description="The same props in independent density scopes." source={source({name:"BadgePlaygroundDensities", imports, state, body:`<Stack gap={3}>
<ThemeScope density="compact"><Badge content={${literal(content)}} tone={${literal(tone)}} aria-label={${literal(label)}}><Button variant="outlined">Messages</Button></Badge></ThemeScope>
<ThemeScope density="comfortable"><Badge content={${literal(content)}} tone={${literal(tone)}} aria-label={${literal(label)}}><Button variant="outlined">Messages</Button></Badge></ThemeScope>
</Stack>`})}><Stack gap={3}><ThemeScope density="compact"><Badge content={content} tone={tone} aria-label={label}><Button variant="outlined">Messages</Button></Badge></ThemeScope><ThemeScope density="comfortable"><Badge content={content} tone={tone} aria-label={label}><Button variant="outlined">Messages</Button></Badge></ThemeScope></Stack></Example>;
}

function BadgePlaygroundPanel2({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [content, setContent] = useState("12");
const [tone, setTone] = useState<"primary" | "neutral">("primary");
const [label, setLabel] = useState("Unread messages");
const imports = ["import { Badge, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Composed example" source={source({name:"BadgePlaygroundComposition", imports, state, body:`<Stack direction="row" gap={3}><Badge content={0} /><Badge content="99+" tone="neutral" /><Badge content="New"><Button>Updates</Button></Badge></Stack>`})}><Stack direction="row" gap={3}><Badge content={0} /><Badge content="99+" tone="neutral" /><Badge content="New"><Button>Updates</Button></Badge></Stack></Example>;
}

function BadgePlaygroundPanel3({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [content, setContent] = useState("12");
const [tone, setTone] = useState<"primary" | "neutral">("primary");
const [label, setLabel] = useState("Unread messages");
const imports = ["import { Badge, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Prop playground" description="Host-formatted counts remain accessible without automatic capping." density={density} controls={<Stack direction="row" wrap gap={3}><TextField label="content" value={content} onValueChange={setContent} /><Select label="tone" value={tone} options={[{"id": "primary", "label": "primary"}, {"id": "neutral", "label": "neutral"}]} onValueChange={value => setTone(value as "primary" | "neutral")} /><TextField label="label" value={label} onValueChange={setLabel} /><Select label="Preview density" value={density} options={[{id:"comfortable",label:"Comfortable"},{id:"compact",label:"Compact"}]} onValueChange={value => setDensity(value as Density)} /></Stack>} source={source({name:"BadgePlayground", imports, state, body:`<ThemeScope density=${literal(density)}>
<Badge content={${literal(content)}} tone={${literal(tone)}} aria-label={${literal(label)}}><Button variant="outlined">Messages</Button></Badge>
</ThemeScope>`})}>
<Badge content={content} tone={tone} aria-label={label}><Button variant="outlined">Messages</Button></Badge>
    </Example>;
}

function ProgressPlayground({reference = false}: {reference?: boolean} = {}) {

if (reference) return <Stack gap={4}>
    <ProgressPlaygroundPanel1 reference={reference} />
    <ProgressPlaygroundPanel2 reference={reference} />
    <ProgressPlaygroundPanel3 reference={reference} />
    <ProgressPlaygroundPanel4 reference={reference} />
  </Stack>;
return <Stack gap={4}>
    <ProgressPlaygroundPanel5 reference={reference} />
    <ProgressPlayground reference />
  </Stack>;
}

function ProgressPlaygroundPanel1({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [label, setLabel] = useState("Uploading course materials");
const [variant, setVariant] = useState<"linear" | "circular">("linear");
const [value, setValue] = useState<"25" | "50" | "75" | "100">("25");
const [indeterminate, setIndeterminate] = useState(false);
const imports = ["import { Progress, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Compact and comfortable comparison" description="The same props in independent density scopes." source={source({name:"ProgressPlaygroundDensities", imports, state, body:`<Stack gap={3}>
<ThemeScope density="compact"><Progress label={${literal(label)}} variant={${literal(variant)}} value={${indeterminate} ? undefined : Number(${literal(value)})} /></ThemeScope>
<ThemeScope density="comfortable"><Progress label={${literal(label)}} variant={${literal(variant)}} value={${indeterminate} ? undefined : Number(${literal(value)})} /></ThemeScope>
</Stack>`})}><Stack gap={3}><ThemeScope density="compact"><Progress label={label} variant={variant} value={indeterminate ? undefined : Number(value)} /></ThemeScope><ThemeScope density="comfortable"><Progress label={label} variant={variant} value={indeterminate ? undefined : Number(value)} /></ThemeScope></Stack></Example>;
}

function ProgressPlaygroundPanel2({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [label, setLabel] = useState("Uploading course materials");
const [variant, setVariant] = useState<"linear" | "circular">("linear");
const [value, setValue] = useState<"25" | "50" | "75" | "100">("25");
const [indeterminate, setIndeterminate] = useState(false);
const imports = ["import { Progress, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Composed example" source={source({name:"ProgressPlaygroundComposition", imports, state, body:`<Stack gap={3}><Progress label="3 of 10 files" value={3} maxValue={10} valueText="3 of 10 files" /><Progress label="Preparing download" variant="circular" /></Stack>`})}><Stack gap={3}><Progress label="3 of 10 files" value={3} maxValue={10} valueText="3 of 10 files" /><Progress label="Preparing download" variant="circular" /></Stack></Example>;
}

function ProgressPlaygroundPanel3({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [label, setLabel] = useState("Uploading course materials");
const [variant, setVariant] = useState<"linear" | "circular">("linear");
const [value, setValue] = useState<"25" | "50" | "75" | "100">("25");
const [indeterminate, setIndeterminate] = useState(false);
const imports = ["import { Progress, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="CircularProgress wrapper" description="The public primitive fixes the circular variant; the shared playground controls adjust its label and value." source={source({name:'CircularProgressWrapper',imports:["import { CircularProgress } from '@structured-growth/sg-ui/primitives';"],body:`<CircularProgress label={${literal(label)}} value={${indeterminate ? 'undefined' : Number(value)}} />`})}><CircularProgress label={label} value={indeterminate ? undefined : Number(value)} /></Example>;
}

function ProgressPlaygroundPanel4({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [label, setLabel] = useState("Uploading course materials");
const [variant, setVariant] = useState<"linear" | "circular">("linear");
const [value, setValue] = useState<"25" | "50" | "75" | "100">("25");
const [indeterminate, setIndeterminate] = useState(false);
const imports = ["import { Progress, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="LinearProgress wrapper" description="The public primitive fixes the linear variant without changing accessible progress semantics." source={source({name:'LinearProgressWrapper',imports:["import { LinearProgress } from '@structured-growth/sg-ui/primitives';"],body:`<LinearProgress label={${literal(label)}} value={${indeterminate ? 'undefined' : Number(value)}} />`})}><LinearProgress label={label} value={indeterminate ? undefined : Number(value)} /></Example>;
}

function ProgressPlaygroundPanel5({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [label, setLabel] = useState("Uploading course materials");
const [variant, setVariant] = useState<"linear" | "circular">("linear");
const [value, setValue] = useState<"25" | "50" | "75" | "100">("25");
const [indeterminate, setIndeterminate] = useState(false);
const imports = ["import { Progress, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Prop playground" description="Determinate and unknown-work progress with meaningful accessible labels." density={density} controls={<Stack direction="row" wrap gap={3}><TextField label="label" value={label} onValueChange={setLabel} /><Select label="variant" value={variant} options={[{"id": "linear", "label": "linear"}, {"id": "circular", "label": "circular"}]} onValueChange={value => setVariant(value as "linear" | "circular")} /><Select label="value" value={value} options={[{"id": "25", "label": "25"}, {"id": "50", "label": "50"}, {"id": "75", "label": "75"}, {"id": "100", "label": "100"}]} onValueChange={value => setValue(value as "25" | "50" | "75" | "100")} /><Checkbox label="indeterminate" checked={indeterminate} onCheckedChange={setIndeterminate} /><Select label="Preview density" value={density} options={[{id:"comfortable",label:"Comfortable"},{id:"compact",label:"Compact"}]} onValueChange={value => setDensity(value as Density)} /></Stack>} source={source({name:"ProgressPlayground", imports, state, body:`<ThemeScope density=${literal(density)}>
<Progress label={${literal(label)}} variant={${literal(variant)}} value={${indeterminate} ? undefined : Number(${literal(value)})} />
</ThemeScope>`})}>
<Progress label={label} variant={variant} value={indeterminate ? undefined : Number(value)} />
    </Example>;
}

function StatusPlayground({reference = false}: {reference?: boolean} = {}) {

if (reference) return <Stack gap={4}>
    <StatusPlaygroundPanel1 reference={reference} />
    <StatusPlaygroundPanel2 reference={reference} />
  </Stack>;
return <Stack gap={4}>
    <StatusPlaygroundPanel3 reference={reference} />
    <StatusPlayground reference />
  </Stack>;
}

function StatusPlaygroundPanel1({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [tone, setTone] = useState<"neutral" | "danger">("neutral");
const [announcement, setAnnouncement] = useState<"off" | "polite" | "assertive">("off");
const [text, setText] = useState("Your changes have been saved.");
const imports = ["import { Status, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Compact and comfortable comparison" description="The same props in independent density scopes." source={source({name:"StatusPlaygroundDensities", imports, state, body:`<Stack gap={3}>
<ThemeScope density="compact"><Status tone={${literal(tone)}} announcement={${literal(announcement)}}>{${literal(text)}}</Status></ThemeScope>
<ThemeScope density="comfortable"><Status tone={${literal(tone)}} announcement={${literal(announcement)}}>{${literal(text)}}</Status></ThemeScope>
</Stack>`})}><Stack gap={3}><ThemeScope density="compact"><Status tone={tone} announcement={announcement}>{text}</Status></ThemeScope><ThemeScope density="comfortable"><Status tone={tone} announcement={announcement}>{text}</Status></ThemeScope></Stack></Example>;
}

function StatusPlaygroundPanel2({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [tone, setTone] = useState<"neutral" | "danger">("neutral");
const [announcement, setAnnouncement] = useState<"off" | "polite" | "assertive">("off");
const [text, setText] = useState("Your changes have been saved.");
const imports = ["import { Status, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Composed example" source={source({name:"StatusPlaygroundComposition", imports, state, body:`<Stack gap={3}><Button onPress={() => setAction("Saved locally")}>Save</Button><Status announcement="polite">{action}</Status></Stack>`})}><Stack gap={3}><Button onPress={() => setAction("Saved locally")}>Save</Button><Status announcement="polite">{action}</Status></Stack></Example>;
}

function StatusPlaygroundPanel3({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [tone, setTone] = useState<"neutral" | "danger">("neutral");
const [announcement, setAnnouncement] = useState<"off" | "polite" | "assertive">("off");
const [text, setText] = useState("Your changes have been saved.");
const imports = ["import { Status, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Prop playground" description="Opt-in announcements for meaningful host state changes." density={density} controls={<Stack direction="row" wrap gap={3}><Select label="tone" value={tone} options={[{"id": "neutral", "label": "neutral"}, {"id": "danger", "label": "danger"}]} onValueChange={value => setTone(value as "neutral" | "danger")} /><Select label="announcement" value={announcement} options={[{"id": "off", "label": "off"}, {"id": "polite", "label": "polite"}, {"id": "assertive", "label": "assertive"}]} onValueChange={value => setAnnouncement(value as "off" | "polite" | "assertive")} /><TextField label="text" value={text} onValueChange={setText} /><Select label="Preview density" value={density} options={[{id:"comfortable",label:"Comfortable"},{id:"compact",label:"Compact"}]} onValueChange={value => setDensity(value as Density)} /></Stack>} source={source({name:"StatusPlayground", imports, state, body:`<ThemeScope density=${literal(density)}>
<Status tone={${literal(tone)}} announcement={${literal(announcement)}}>{${literal(text)}}</Status>
</ThemeScope>`})}>
<Status tone={tone} announcement={announcement}>{text}</Status>
    </Example>;
}

function AvatarPlayground({reference = false}: {reference?: boolean} = {}) {

if (reference) return <Stack gap={4}>
    <AvatarPlaygroundPanel1 reference={reference} />
    <AvatarPlaygroundPanel2 reference={reference} />
    <AvatarPlaygroundPanel3 reference={reference} />
  </Stack>;
return <Stack gap={4}>
    <AvatarPlaygroundPanel4 reference={reference} />
    <AvatarPlayground reference />
  </Stack>;
}

function AvatarPlaygroundPanel1({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [alt, setAlt] = useState("Ada Lovelace");
const [fallback, setFallback] = useState("AL");
const [size, setSize] = useState<"medium" | "small" | "large">("medium");
const [shape, setShape] = useState<"circle" | "square">("circle");
const imports = ["import { Avatar, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Compact and comfortable comparison" description="The same props in independent density scopes." source={source({name:"AvatarPlaygroundDensities", imports, state, body:`<Stack gap={3}>
<ThemeScope density="compact"><Avatar alt={${literal(alt)}} fallback={${literal(fallback)}} size={${literal(size)}} shape={${literal(shape)}} /></ThemeScope>
<ThemeScope density="comfortable"><Avatar alt={${literal(alt)}} fallback={${literal(fallback)}} size={${literal(size)}} shape={${literal(shape)}} /></ThemeScope>
</Stack>`})}><Stack gap={3}><ThemeScope density="compact"><Avatar alt={alt} fallback={fallback} size={size} shape={shape} /></ThemeScope><ThemeScope density="comfortable"><Avatar alt={alt} fallback={fallback} size={size} shape={shape} /></ThemeScope></Stack></Example>;
}

function AvatarPlaygroundPanel2({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [alt, setAlt] = useState("Ada Lovelace");
const [fallback, setFallback] = useState("AL");
const [size, setSize] = useState<"medium" | "small" | "large">("medium");
const [shape, setShape] = useState<"circle" | "square">("circle");
const imports = ["import { Avatar, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Composed example" source={source({name:"AvatarPlaygroundComposition", imports, state, body:`<Stack direction="row" gap={3} align="center"><Avatar alt="Grace Hopper" fallback="GH" /><Stack gap={1}><Typography>Grace Hopper</Typography><Typography tone="muted" variant="caption">Instructor</Typography></Stack></Stack>`})}><Stack direction="row" gap={3} align="center"><Avatar alt="Grace Hopper" fallback="GH" /><Stack gap={1}><Typography>Grace Hopper</Typography><Typography tone="muted" variant="caption">Instructor</Typography></Stack></Stack></Example>;
}

function AvatarPlaygroundPanel3({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [alt, setAlt] = useState("Ada Lovelace");
const [fallback, setFallback] = useState("AL");
const [size, setSize] = useState<"medium" | "small" | "large">("medium");
const [shape, setShape] = useState<"circle" | "square">("circle");
const imports = ["import { Avatar, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Size and shape matrix" source={source({name:"AvatarMatrix", imports:["import { Avatar, Stack } from '@structured-growth/sg-ui/experimental';"], body:`<Stack direction="row" wrap gap={3}>{(["small","medium","large"] as const).map(size => (["circle","square"] as const).map(shape => <Avatar key={\`\${size}-\${shape}\`} size={size} shape={shape} alt={\`\${size} \${shape} avatar\`} fallback="AL" />))}</Stack>`})}><Stack direction="row" wrap gap={3}>{(["small","medium","large"] as const).map(size => (["circle","square"] as const).map(shape => <Avatar key={`${size}-${shape}`} size={size} shape={shape} alt={`${size} ${shape} avatar`} fallback="AL" />))}</Stack></Example>;
}

function AvatarPlaygroundPanel4({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [alt, setAlt] = useState("Ada Lovelace");
const [fallback, setFallback] = useState("AL");
const [size, setSize] = useState<"medium" | "small" | "large">("medium");
const [shape, setShape] = useState<"circle" | "square">("circle");
const imports = ["import { Avatar, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Prop playground" description="Named or decorative identities with stable fallback content." density={density} controls={<Stack direction="row" wrap gap={3}><TextField label="alt" value={alt} onValueChange={setAlt} /><TextField label="fallback" value={fallback} onValueChange={setFallback} /><Select label="size" value={size} options={[{"id": "medium", "label": "medium"}, {"id": "small", "label": "small"}, {"id": "large", "label": "large"}]} onValueChange={value => setSize(value as "medium" | "small" | "large")} /><Select label="shape" value={shape} options={[{"id": "circle", "label": "circle"}, {"id": "square", "label": "square"}]} onValueChange={value => setShape(value as "circle" | "square")} /><Select label="Preview density" value={density} options={[{id:"comfortable",label:"Comfortable"},{id:"compact",label:"Compact"}]} onValueChange={value => setDensity(value as Density)} /></Stack>} source={source({name:"AvatarPlayground", imports, state, body:`<ThemeScope density=${literal(density)}>
<Avatar alt={${literal(alt)}} fallback={${literal(fallback)}} size={${literal(size)}} shape={${literal(shape)}} />
</ThemeScope>`})}>
<Avatar alt={alt} fallback={fallback} size={size} shape={shape} />
    </Example>;
}

function TablePlayground({reference = false}: {reference?: boolean} = {}) {

if (reference) return <Stack gap={4}>
    <TablePlaygroundPanel1 reference={reference} />
  </Stack>;
return <Stack gap={4}>
    <TablePlaygroundPanel2 reference={reference} />
    <TablePlayground reference />
  </Stack>;
}

function TablePlaygroundPanel1({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [caption, setCaption] = useState("Course catalog");
const [align, setAlign] = useState<"start" | "center" | "end">("start");
const imports = ["import { Table, TableCaption, TableHead, TableBody, TableFoot, TableRow, TableCell, TableHeaderCell, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Compact and comfortable comparison" description="The same props in independent density scopes." source={source({name:"TablePlaygroundDensities", imports, state, body:`<Stack gap={3}>
<ThemeScope density="compact"><Table><TableCaption>{${literal(caption)}}</TableCaption><TableHead><TableRow><TableHeaderCell>Course</TableHeaderCell><TableHeaderCell align={${literal(align)}}>Lessons</TableHeaderCell></TableRow></TableHead><TableBody><TableRow><TableHeaderCell scope="row">Leadership</TableHeaderCell><TableCell align={${literal(align)}}>12</TableCell></TableRow><TableRow><TableHeaderCell scope="row">Communication</TableHeaderCell><TableCell align={${literal(align)}}>8</TableCell></TableRow></TableBody><TableFoot><TableRow><TableCell>Total</TableCell><TableCell align={${literal(align)}}>20</TableCell></TableRow></TableFoot></Table></ThemeScope>
<ThemeScope density="comfortable"><Table><TableCaption>{${literal(caption)}}</TableCaption><TableHead><TableRow><TableHeaderCell>Course</TableHeaderCell><TableHeaderCell align={${literal(align)}}>Lessons</TableHeaderCell></TableRow></TableHead><TableBody><TableRow><TableHeaderCell scope="row">Leadership</TableHeaderCell><TableCell align={${literal(align)}}>12</TableCell></TableRow><TableRow><TableHeaderCell scope="row">Communication</TableHeaderCell><TableCell align={${literal(align)}}>8</TableCell></TableRow></TableBody><TableFoot><TableRow><TableCell>Total</TableCell><TableCell align={${literal(align)}}>20</TableCell></TableRow></TableFoot></Table></ThemeScope>
</Stack>`})}><Stack gap={3}><ThemeScope density="compact"><Table><TableCaption>{caption}</TableCaption><TableHead><TableRow><TableHeaderCell>Course</TableHeaderCell><TableHeaderCell align={align}>Lessons</TableHeaderCell></TableRow></TableHead><TableBody><TableRow><TableHeaderCell scope="row">Leadership</TableHeaderCell><TableCell align={align}>12</TableCell></TableRow><TableRow><TableHeaderCell scope="row">Communication</TableHeaderCell><TableCell align={align}>8</TableCell></TableRow></TableBody><TableFoot><TableRow><TableCell>Total</TableCell><TableCell align={align}>20</TableCell></TableRow></TableFoot></Table></ThemeScope><ThemeScope density="comfortable"><Table><TableCaption>{caption}</TableCaption><TableHead><TableRow><TableHeaderCell>Course</TableHeaderCell><TableHeaderCell align={align}>Lessons</TableHeaderCell></TableRow></TableHead><TableBody><TableRow><TableHeaderCell scope="row">Leadership</TableHeaderCell><TableCell align={align}>12</TableCell></TableRow><TableRow><TableHeaderCell scope="row">Communication</TableHeaderCell><TableCell align={align}>8</TableCell></TableRow></TableBody><TableFoot><TableRow><TableCell>Total</TableCell><TableCell align={align}>20</TableCell></TableRow></TableFoot></Table></ThemeScope></Stack></Example>;
}

function TablePlaygroundPanel2({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [caption, setCaption] = useState("Course catalog");
const [align, setAlign] = useState<"start" | "center" | "end">("start");
const imports = ["import { Table, TableCaption, TableHead, TableBody, TableFoot, TableRow, TableCell, TableHeaderCell, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Prop playground" description="Native tabular content with captions, scoped headers and alignment." density={density} controls={<Stack direction="row" wrap gap={3}><TextField label="caption" value={caption} onValueChange={setCaption} /><Select label="align" value={align} options={[{"id": "start", "label": "start"}, {"id": "center", "label": "center"}, {"id": "end", "label": "end"}]} onValueChange={value => setAlign(value as "start" | "center" | "end")} /><Select label="Preview density" value={density} options={[{id:"comfortable",label:"Comfortable"},{id:"compact",label:"Compact"}]} onValueChange={value => setDensity(value as Density)} /></Stack>} source={source({name:"TablePlayground", imports, state, body:`<ThemeScope density=${literal(density)}>
<Table><TableCaption>{${literal(caption)}}</TableCaption><TableHead><TableRow><TableHeaderCell>Course</TableHeaderCell><TableHeaderCell align={${literal(align)}}>Lessons</TableHeaderCell></TableRow></TableHead><TableBody><TableRow><TableHeaderCell scope="row">Leadership</TableHeaderCell><TableCell align={${literal(align)}}>12</TableCell></TableRow><TableRow><TableHeaderCell scope="row">Communication</TableHeaderCell><TableCell align={${literal(align)}}>8</TableCell></TableRow></TableBody><TableFoot><TableRow><TableCell>Total</TableCell><TableCell align={${literal(align)}}>20</TableCell></TableRow></TableFoot></Table>
</ThemeScope>`})}>
<Table><TableCaption>{caption}</TableCaption><TableHead><TableRow><TableHeaderCell>Course</TableHeaderCell><TableHeaderCell align={align}>Lessons</TableHeaderCell></TableRow></TableHead><TableBody><TableRow><TableHeaderCell scope="row">Leadership</TableHeaderCell><TableCell align={align}>12</TableCell></TableRow><TableRow><TableHeaderCell scope="row">Communication</TableHeaderCell><TableCell align={align}>8</TableCell></TableRow></TableBody><TableFoot><TableRow><TableCell>Total</TableCell><TableCell align={align}>20</TableCell></TableRow></TableFoot></Table>
    </Example>;
}

function PaginationPlayground({reference = false}: {reference?: boolean} = {}) {

if (reference) return <Stack gap={4}>
    <PaginationPlaygroundPanel1 reference={reference} />
  </Stack>;
return <Stack gap={4}>
    <PaginationPlaygroundPanel2 reference={reference} />
    <PaginationPlayground reference />
  </Stack>;
}

function PaginationPlaygroundPanel1({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [disabled, setDisabled] = useState(false);
const [showBoundaryButtons, setShowBoundaryButtons] = useState(true);
const [knownTotal, setKnownTotal] = useState(true);
const [label, setLabel] = useState("Course pages");
const imports = ["import { Pagination, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Compact and comfortable comparison" description="The same props in independent density scopes." source={source({name:"PaginationPlaygroundDensities", imports, state, body:`<Stack gap={3}>
<ThemeScope density="compact"><Stack gap={3}><Pagination label={${literal(label)}} page={page} onPageChange={setPage} pageCount={${knownTotal} ? 8 : undefined} hasNextPage={page < 7} pageSize={pageSize} onPaginationChange={(nextPage, nextSize) => {setPage(nextPage);setPageSize(nextSize);}} pageSizeOptions={[10,25,50]} disabled={${disabled}} showBoundaryButtons={${showBoundaryButtons}} /><Typography>Page index: {page}; size: {pageSize}</Typography></Stack></ThemeScope>
<ThemeScope density="comfortable"><Stack gap={3}><Pagination label={${literal(label)}} page={page} onPageChange={setPage} pageCount={${knownTotal} ? 8 : undefined} hasNextPage={page < 7} pageSize={pageSize} onPaginationChange={(nextPage, nextSize) => {setPage(nextPage);setPageSize(nextSize);}} pageSizeOptions={[10,25,50]} disabled={${disabled}} showBoundaryButtons={${showBoundaryButtons}} /><Typography>Page index: {page}; size: {pageSize}</Typography></Stack></ThemeScope>
</Stack>`})}><Stack gap={3}><ThemeScope density="compact"><Stack gap={3}><Pagination label={label} page={page} onPageChange={setPage} pageCount={knownTotal ? 8 : undefined} hasNextPage={page < 7} pageSize={pageSize} onPaginationChange={(nextPage, nextSize) => {setPage(nextPage);setPageSize(nextSize);}} pageSizeOptions={[10,25,50]} disabled={disabled} showBoundaryButtons={showBoundaryButtons} /><Typography>Page index: {page}; size: {pageSize}</Typography></Stack></ThemeScope><ThemeScope density="comfortable"><Stack gap={3}><Pagination label={label} page={page} onPageChange={setPage} pageCount={knownTotal ? 8 : undefined} hasNextPage={page < 7} pageSize={pageSize} onPaginationChange={(nextPage, nextSize) => {setPage(nextPage);setPageSize(nextSize);}} pageSizeOptions={[10,25,50]} disabled={disabled} showBoundaryButtons={showBoundaryButtons} /><Typography>Page index: {page}; size: {pageSize}</Typography></Stack></ThemeScope></Stack></Example>;
}

function PaginationPlaygroundPanel2({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [disabled, setDisabled] = useState(false);
const [showBoundaryButtons, setShowBoundaryButtons] = useState(true);
const [knownTotal, setKnownTotal] = useState(true);
const [label, setLabel] = useState("Course pages");
const imports = ["import { Pagination, Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Prop playground" description="Zero-based host state, known or unknown totals and page-size reset." density={density} controls={<Stack direction="row" wrap gap={3}><Checkbox label="disabled" checked={disabled} onCheckedChange={setDisabled} /><Checkbox label="showBoundaryButtons" checked={showBoundaryButtons} onCheckedChange={setShowBoundaryButtons} /><Checkbox label="knownTotal" checked={knownTotal} onCheckedChange={setKnownTotal} /><TextField label="label" value={label} onValueChange={setLabel} /><Select label="Preview density" value={density} options={[{id:"comfortable",label:"Comfortable"},{id:"compact",label:"Compact"}]} onValueChange={value => setDensity(value as Density)} /></Stack>} source={source({name:"PaginationPlayground", imports, state, body:`<ThemeScope density=${literal(density)}>
<Stack gap={3}><Pagination label={${literal(label)}} page={page} onPageChange={setPage} pageCount={${knownTotal} ? 8 : undefined} hasNextPage={page < 7} pageSize={pageSize} onPaginationChange={(nextPage, nextSize) => {setPage(nextPage);setPageSize(nextSize);}} pageSizeOptions={[10,25,50]} disabled={${disabled}} showBoundaryButtons={${showBoundaryButtons}} /><Typography>Page index: {page}; size: {pageSize}</Typography></Stack>
</ThemeScope>`})}>
<Stack gap={3}><Pagination label={label} page={page} onPageChange={setPage} pageCount={knownTotal ? 8 : undefined} hasNextPage={page < 7} pageSize={pageSize} onPaginationChange={(nextPage, nextSize) => {setPage(nextPage);setPageSize(nextSize);}} pageSizeOptions={[10,25,50]} disabled={disabled} showBoundaryButtons={showBoundaryButtons} /><Typography>Page index: {page}; size: {pageSize}</Typography></Stack>
    </Example>;
}

function ProviderPlayground({reference = false}: {reference?: boolean} = {}) {

if (reference) return <Stack gap={4}>
    <ProviderPlaygroundPanel1 reference={reference} />
    <ProviderPlaygroundPanel2 reference={reference} />
    <SizingThemeExample/>
  </Stack>;
return <Stack gap={4}>
    <ProviderPlaygroundPanel3 reference={reference} />
    <ProviderPlayground reference />
  </Stack>;
}

function ProviderPlaygroundPanel1({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
const [text, setText] = useState("A scoped action");
const imports = ["import { Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Compact and comfortable comparison" description="The same props in independent density scopes." source={source({name:"ProviderPlaygroundDensities", imports, state, body:`<Stack gap={3}>
<ThemeScope density="compact"><Provider dir={${literal(direction)}}><Stack direction="row" gap={3}><Button>{${literal(text)}}</Button><Typography>Provider sets interaction locale and visual scope.</Typography></Stack></Provider></ThemeScope>
<ThemeScope density="comfortable"><Provider dir={${literal(direction)}}><Stack direction="row" gap={3}><Button>{${literal(text)}}</Button><Typography>Provider sets interaction locale and visual scope.</Typography></Stack></Provider></ThemeScope>
</Stack>`})}><Stack gap={3}><ThemeScope density="compact"><Provider dir={direction}><Stack direction="row" gap={3}><Button>{text}</Button><Typography>Provider sets interaction locale and visual scope.</Typography></Stack></Provider></ThemeScope><ThemeScope density="comfortable"><Provider dir={direction}><Stack direction="row" gap={3}><Button>{text}</Button><Typography>Provider sets interaction locale and visual scope.</Typography></Stack></Provider></ThemeScope></Stack></Example>;
}

function ProviderPlaygroundPanel2({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
const [text, setText] = useState("A scoped action");
const imports = ["import { Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="AppThemeProvider compatibility name" description="AppThemeProvider is the same owned Provider under its preserved public name." source={source({name:'AppThemeProvider',imports:["import { AppThemeProvider } from '@structured-growth/sg-ui/theme';", "import { Button, Typography, Stack } from '@structured-growth/sg-ui/experimental';"],body:`<AppThemeProvider dir={${literal(direction)}}><Stack gap={3}><Typography>{${literal(text)}}</Typography><Button>Scoped action</Button></Stack></AppThemeProvider>`})}><AppThemeProvider dir={direction}><Stack gap={3}><Typography>{text}</Typography><Button>Scoped action</Button></Stack></AppThemeProvider></Example>;
}

function ProviderPlaygroundPanel3({reference = false}: {reference?: boolean} = {}) {
  const source=useExampleSource();
  const [density,setDensity]=useState<Density>('comfortable');
  const [interactionMode,setInteractionMode]=useState<InteractionMode>('auto');
  const [direction,setDirection]=useState<'ltr'|'rtl'>('ltr');
  const [text,setText]=useState('A scoped action');
  const imports=["import { Stack, Button, Menu, TextField } from '@structured-growth/sg-ui/experimental';"];
  const body=`<Provider density=${literal(density)} interactionMode=${literal(interactionMode)} dir=${literal(direction)}><Stack gap={3}><TextField label="Workspace name" defaultValue="Design workspace"/><Menu label="Workspace actions" trigger={<Button>{${literal(text)}}</Button>} items={[{id:'settings',label:'Workspace settings'},{id:'members',label:'Manage members'}]}/></Stack></Provider>`;
  return <Example title="Prop playground" description="Density sets spacing; interaction mode sets target and navigation icon sizing. Auto follows available pointer capabilities." density={density} controls={<Stack direction="row" wrap gap={3}>
    <Select label="Interaction mode" value={interactionMode} options={[{id:'auto',label:'Auto'},{id:'pointer',label:'Pointer'},{id:'touch',label:'Touch'}]} onValueChange={value=>setInteractionMode(value as InteractionMode)}/>
    <Select label="direction" value={direction} options={[{id:'ltr',label:'ltr'},{id:'rtl',label:'rtl'}]} onValueChange={value=>setDirection(value as 'ltr'|'rtl')}/>
    <TextField label="text" value={text} onValueChange={setText}/>
    <Select label="Preview density" value={density} options={[{id:'comfortable',label:'Comfortable'},{id:'compact',label:'Compact'}]} onValueChange={value=>setDensity(value as Density)}/>
  </Stack>} source={source({name:'ProviderSizing',imports,body})}>
    <Provider density={density} interactionMode={interactionMode} dir={direction}><Stack gap={3}><TextField label="Workspace name" defaultValue="Design workspace"/><Menu label="Workspace actions" trigger={<Button>{text}</Button>} items={[{id:'settings',label:'Workspace settings'},{id:'members',label:'Manage members'}]}/></Stack></Provider>
  </Example>;
}

function ThemeScopePlayground({reference = false}: {reference?: boolean} = {}) {

if (reference) return <Stack gap={4}>
    <ThemeScopePlaygroundPanel1 reference={reference} />
    <SizingThemeExample/>
  </Stack>;
return <Stack gap={4}>
    <ThemeScopePlaygroundPanel2 reference={reference} />
    <ThemeScopePlayground reference />
  </Stack>;
}

function ThemeScopePlaygroundPanel1({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [density, setDensity] = useState<Density>("comfortable");
const [action, setAction] = useState('No action yet');
const [open, setOpen] = useState(false);
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(25);
const [selected, setSelected] = useState('overview');
const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
const [text, setText] = useState("Locally scoped content");
const imports = ["import { Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"];
const state = `  const [action, setAction] = useState(${literal(action)});\n  const [open, setOpen] = useState(${open});\n  const [page, setPage] = useState(${page});\n  const [pageSize, setPageSize] = useState(${pageSize});\n  const [selected, setSelected] = useState(${literal(selected)});`;
return <Example title="Compact and comfortable comparison" description="The same props in independent density scopes." source={source({name:"ThemeScopePlaygroundDensities", imports, state, body:`<Stack gap={3}>
<ThemeScope density="compact"><ThemeScope dir={${literal(direction)}}><Stack gap={3}><Typography>{${literal(text)}}</Typography><Button>Scoped action</Button></Stack></ThemeScope></ThemeScope>
<ThemeScope density="comfortable"><ThemeScope dir={${literal(direction)}}><Stack gap={3}><Typography>{${literal(text)}}</Typography><Button>Scoped action</Button></Stack></ThemeScope></ThemeScope>
</Stack>`})}><Stack gap={3}><ThemeScope density="compact"><ThemeScope dir={direction}><Stack gap={3}><Typography>{text}</Typography><Button>Scoped action</Button></Stack></ThemeScope></ThemeScope><ThemeScope density="comfortable"><ThemeScope dir={direction}><Stack gap={3}><Typography>{text}</Typography><Button>Scoped action</Button></Stack></ThemeScope></ThemeScope></Stack></Example>;
}

function ThemeScopePlaygroundPanel2({reference = false}: {reference?: boolean} = {}) {
  const source=useExampleSource();
  const [density,setDensity]=useState<Density>('comfortable');
  const [interactionMode,setInteractionMode]=useState<InteractionMode>('auto');
  const [direction,setDirection]=useState<'ltr'|'rtl'>('ltr');
  const [text,setText]=useState('A scoped action');
  const imports=["import { Stack, Button, Menu, TextField } from '@structured-growth/sg-ui/experimental';"];
  const body=`<ThemeScope density=${literal(density)} interactionMode=${literal(interactionMode)} dir=${literal(direction)}><Stack gap={3}><TextField label="Workspace name" defaultValue="Design workspace"/><Menu label="Workspace actions" trigger={<Button>{${literal(text)}}</Button>} items={[{id:'settings',label:'Workspace settings'},{id:'members',label:'Manage members'}]}/></Stack></ThemeScope>`;
  return <Example title="Prop playground" description="Density sets spacing; interaction mode sets target and navigation icon sizing. Auto follows available pointer capabilities." density={density} controls={<Stack direction="row" wrap gap={3}>
    <Select label="Interaction mode" value={interactionMode} options={[{id:'auto',label:'Auto'},{id:'pointer',label:'Pointer'},{id:'touch',label:'Touch'}]} onValueChange={value=>setInteractionMode(value as InteractionMode)}/>
    <Select label="direction" value={direction} options={[{id:'ltr',label:'ltr'},{id:'rtl',label:'rtl'}]} onValueChange={value=>setDirection(value as 'ltr'|'rtl')}/>
    <TextField label="text" value={text} onValueChange={setText}/>
    <Select label="Preview density" value={density} options={[{id:'comfortable',label:'Comfortable'},{id:'compact',label:'Compact'}]} onValueChange={value=>setDensity(value as Density)}/>
  </Stack>} source={source({name:'ThemeScopeSizing',imports,body})}>
    <ThemeScope density={density} interactionMode={interactionMode} dir={direction}><Stack gap={3}><TextField label="Workspace name" defaultValue="Design workspace"/><Menu label="Workspace actions" trigger={<Button>{text}</Button>} items={[{id:'settings',label:'Workspace settings'},{id:'members',label:'Manage members'}]}/></Stack></ThemeScope>
  </Example>;
}

const iconNames = ["AccessTimeFilledIcon", "AccountCircleIcon", "AddIcon", "ApartmentIcon", "ArrowDropDownIcon", "ArrowForwardIcon", "AssignmentTurnedInIcon", "AutoStoriesIcon", "BookIcon", "BrushIcon", "BuildIcon", "BusinessCenterIcon", "CachedIcon", "CalendarTodayIcon", "CheckIcon", "ChevronRightIcon", "CircleIcon", "ClassIcon", "CloseIcon", "CodeIcon", "ComputerIcon", "ContentCopyIcon", "CorporateFareIcon", "DashboardIcon", "DeleteOutlineIcon", "DescriptionIcon", "DescriptionOutlinedIcon", "DnsIcon", "DragIndicatorIcon", "EditIcon", "EventIcon", "ExpandLessIcon", "ExpandMoreIcon", "ExploreIcon", "FactCheckOutlinedIcon", "FilterListIcon", "FontDownloadIcon", "FormatAlignCenterIcon", "FormatAlignJustifyIcon", "FormatAlignLeftIcon", "FormatAlignRightIcon", "FormatBoldIcon", "FormatClearIcon", "FormatColorFillIcon", "FormatColorTextIcon", "FormatIndentDecreaseIcon", "FormatIndentIncreaseIcon", "FormatItalicIcon", "FormatListBulletedIcon", "FormatListNumberedIcon", "FormatSizeIcon", "FormatStrikethroughIcon", "FormatUnderlinedIcon", "GroupIcon", "HighlightIcon", "HorizontalRuleIcon", "ImageIcon", "KeyboardArrowDownIcon", "KeyboardArrowLeftIcon", "LinkIcon", "LockIcon", "LockResetIcon", "LogoutIcon", "ManageAccountsIcon", "MenuBookIcon", "MenuBookOutlinedIcon", "MoreHorizIcon", "MoreVertIcon", "PaidIcon", "PeopleIcon", "PersonIcon", "PersonAddIcon", "PhotoCameraBackIcon", "QuizOutlinedIcon", "RedoIcon", "RemoveIcon", "SchoolIcon", "ScienceOutlinedIcon", "SearchIcon", "SortIcon", "StarIcon", "SubscriptIcon", "SuperscriptIcon", "TaskAltIcon", "TerminalIcon", "TranslateIcon", "TuneIcon", "UndoIcon", "UploadFileIcon", "ViewColumnIcon", "ViewListIcon", "ViewWeekIcon", "VisibilityOffIcon", "VpnKeyIcon", "WindowIcon", "WorkOutlineOutlinedIcon"] as const;
function IconsPlayground({reference = false}: {reference?: boolean} = {}) {

if (reference) return <Stack gap={4}>
    <IconsPlaygroundPanel1 reference={reference} />
    <IconsPlaygroundPanel2 reference={reference} />
  </Stack>;
return <Stack gap={4}>
    <IconsPlaygroundPanel3 reference={reference} />
    <IconsPlayground reference />
  </Stack>;
}

function IconsPlaygroundPanel1({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [name, setName] = useState<(typeof iconNames)[number]>('AddIcon');
const [size, setSize] = useState('24');
const [stroke, setStroke] = useState('2');
const [label, setLabel] = useState('Add lesson');
const [query, setQuery] = useState('');
const [type, setType] = useState('lesson');
const Icon = Icons[name];
const visible = iconNames.filter(icon => icon.toLowerCase().includes(query.toLowerCase()));
const validSize = Number(size) || 24;
const validStroke = Number(stroke) || 2;
return <Example title="Searchable public icon gallery" controls={<TextField label="Filter icons" value={query} onValueChange={setQuery} />}
      source={source({name:'IconGallery',imports:[`import { ${visible.length ? visible.join(', ') : 'AddIcon'} } from '@structured-growth/sg-ui/icons';`,"import { Stack, Typography } from '@structured-growth/sg-ui/experimental';"],body:`<Stack direction="row" wrap gap={4}>
${visible.map(icon => `  <Stack align="center" gap={2}><${icon} size={${validSize}} strokeWidth={${validStroke}} /><Typography variant="caption">${icon}</Typography></Stack>`).join('\n')}
</Stack>`})}>
      <Stack direction="row" wrap gap={4}>{visible.map(icon => {const Item = Icons[icon]; return <Stack key={icon} align="center" gap={2}><Item size={validSize} strokeWidth={validStroke} /><Typography variant="caption">{icon}</Typography></Stack>;})}</Stack>
    </Example>;
}

function IconsPlaygroundPanel2({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [name, setName] = useState<(typeof iconNames)[number]>('AddIcon');
const [size, setSize] = useState('24');
const [stroke, setStroke] = useState('2');
const [label, setLabel] = useState('Add lesson');
const [query, setQuery] = useState('');
const [type, setType] = useState('lesson');
const Icon = Icons[name];
const visible = iconNames.filter(icon => icon.toLowerCase().includes(query.toLowerCase()));
const validSize = Number(size) || 24;
const validStroke = Number(stroke) || 2;
return <Example title="Activity icon mapping" description="Host activity names map to owned icons; unknown types use a fallback. No application contracts are imported."
      controls={<Select label="Activity type" value={type} onValueChange={value => setType(value ?? 'lesson')} options={['lesson','quiz','assignment','lab','unknown'].map(id => ({id,label:id}))} />}
      source={source({name:'ActivityIcon',imports:["import { getActivityTypeIcon, AddIcon } from '@structured-growth/sg-ui/icons';"],body:`<>{getActivityTypeIcon(${literal(type)}, {size:${validSize}, fallback:<AddIcon size={${validSize}} />})}</>`})}>
      {Icons.getActivityTypeIcon(type,{size:validSize,fallback:<Icons.AddIcon size={validSize} />})}
    </Example>;
}

function IconsPlaygroundPanel3({reference = false}: {reference?: boolean} = {}) {
const source = useExampleSource();
const [name, setName] = useState<(typeof iconNames)[number]>('AddIcon');
const [size, setSize] = useState('24');
const [stroke, setStroke] = useState('2');
const [label, setLabel] = useState('Add lesson');
const [query, setQuery] = useState('');
const [type, setType] = useState('lesson');
const Icon = Icons[name];
const visible = iconNames.filter(icon => icon.toLowerCase().includes(query.toLowerCase()));
const validSize = Number(size) || 24;
const validStroke = Number(stroke) || 2;
return <Example title="Prop playground" description="Select any public icon. An empty label makes the SVG decorative; label the containing action instead."
      controls={<Stack direction="row" wrap gap={3}>
        <Select label="Icon" value={name} options={iconNames.map(id => ({id,label:id}))} onValueChange={value => {if (value && iconNames.includes(value as typeof name)) setName(value as typeof name);}} />
        <TextField label="Size" value={size} onValueChange={setSize} /><TextField label="Stroke width" value={stroke} onValueChange={setStroke} /><TextField label="Accessible label" value={label} onValueChange={setLabel} />
      </Stack>}
      source={source({name:'Icon',imports:[`import { ${name} } from '@structured-growth/sg-ui/icons';`],body:`<${name} size={${validSize}} strokeWidth={${validStroke}} label={${literal(label)}} />`})}>
      <Icon size={validSize} strokeWidth={validStroke} label={label} />
    </Example>;
}

const matrixDensities = ['compact', 'comfortable'] as const;
const matrixOrientations = ['horizontal', 'vertical'] as const;
const matrixDirections = ['row', 'column'] as const;
function ButtonGroupMatrixExample({orientation, density, joined, variant = 'outlined', contentStates = false}: {
  orientation: 'horizontal' | 'vertical'; density: Density; joined: boolean;
  variant?: 'filled' | 'outlined' | 'text'; contentStates?: boolean;
}) {
  const source = useExampleSource();
  const [action, setAction] = useState('No action yet');
  const title = contentStates ? 'Long content, disabled and pending actions' : variant === 'outlined'
    ? `${orientation === 'horizontal' ? 'Horizontal' : 'Vertical'} · ${density} · ${joined ? 'joined' : 'separate'}`
    : `${variant === 'filled' ? 'Filled' : 'Text'} action group`;
  const saveLabel = contentStates ? 'Save this course as a reusable draft' : 'Save draft';
  const body = `<ThemeScope density={${literal(density)}}>
  <Stack gap={3} align="start">
    <ButtonGroup label={${literal(title)}} orientation={${literal(orientation)}} joined={${joined}}>
      <Button variant={${literal(variant)}} tone="neutral" onPress={() => setAction("Draft saved locally")}>{${literal(saveLabel)}}</Button>
      <Button variant={${literal(variant)}} tone="neutral" onPress={() => setAction("Course duplicated locally")}>Duplicate</Button>
      <Button variant={${literal(variant)}} tone="neutral" disabled>Archive unavailable</Button>
      ${contentStates ? '<Button variant="outlined" tone="neutral" loading>Publishing course</Button>' : ''}
    </ButtonGroup>

  </Stack>
</ThemeScope>`;
  return <Example title={title} density={density} description="These props are fixed independently of the playground."
    source={source({name:'ButtonGroupMatrix', imports:["import { ButtonGroup, Button, Stack, Typography } from '@structured-growth/sg-ui/experimental';"],state:`  const [action, setAction] = useState(${literal(action)});`,body})}>
    <Stack gap={3} align="start"><ButtonGroup label={title} orientation={orientation} joined={joined}>
      <Button variant={variant} tone="neutral" onPress={() => setAction('Draft saved locally')}>{saveLabel}</Button>
      <Button variant={variant} tone="neutral" onPress={() => setAction('Course duplicated locally')}>Duplicate</Button>
      <Button variant={variant} tone="neutral" disabled>Archive unavailable</Button>
      {contentStates && <Button variant="outlined" tone="neutral" loading>Publishing course</Button>}
    </ButtonGroup></Stack>
  </Example>;
}
function TabsMatrixExample({orientation, density, activation = 'automatic'}: {
  orientation: 'horizontal' | 'vertical'; density: Density; activation?: 'automatic' | 'manual';
}) {
  const source = useExampleSource();
  const [selected, setSelected] = useState('overview');
  const title = `${orientation === 'horizontal' ? 'Horizontal' : 'Vertical'} tabs · ${density} · ${activation}`;
  const body = `<ThemeScope density={${literal(density)}}>
  <Stack gap={3}>
    <Tabs label={${literal(title)}} orientation={${literal(orientation)}} activation={${literal(activation)}} value={selected} onValueChange={setSelected} items={[
      {id:"overview",label:"Course overview",content:<Typography>Explore learning objectives and course details.</Typography>},
      {id:"lessons",label:"Lessons and activities",content:<Typography>12 lessons are ready for review.</Typography>},
      {id:"archive",label:"Archived materials",disabled:true,content:<Typography>Unavailable</Typography>}
    ]} />

  </Stack>
</ThemeScope>`;
  return <Example title={title} density={density} description={activation === 'manual' ? 'Move focus with arrows, then activate the desired tab. The indicator slides on activation; focus alone does not move it. Reduced motion removes sliding.' : 'Arrow-key focus and panel selection move together. The indicator slides to the selected tab; reduced motion removes sliding. The archived tab is unavailable.'}
    source={source({name:'TabsMatrix',imports:["import { Tabs, Stack, Typography } from '@structured-growth/sg-ui/experimental';"],state:`  const [selected, setSelected] = useState(${literal(selected)});`,body})}>
    <Stack gap={3}><Tabs label={title} orientation={orientation} activation={activation} value={selected} onValueChange={setSelected} items={[
      {id:'overview',label:'Course overview',content:<Typography>Explore learning objectives and course details.</Typography>},
      {id:'lessons',label:'Lessons and activities',content:<Typography>12 lessons are ready for review.</Typography>},
      {id:'archive',label:'Archived materials',disabled:true,content:<Typography>Unavailable</Typography>}
    ]} /></Stack>
  </Example>;
}
function StackMatrixExample({direction, density, responsive = false}: {direction:'row' | 'column'; density:Density; responsive?:boolean}) {
  const source = useExampleSource();
  const [clicks, setClicks] = useState(0);
  const title = responsive ? `Responsive action row · ${density}` : `${direction === 'row' ? 'Horizontal' : 'Vertical'} stack · ${density}`;
  const body = `<ThemeScope density={${literal(density)}}>
  <Stack gap={3}>
    <Stack direction={${literal(direction)}} gap={3} align="center" justify="between" wrap responsive={${responsive}}>
      <Typography>Course publishing actions</Typography>
      <Button onPress={() => setClicks(value => value + 1)}>Save draft</Button>
      <Button variant="outlined" onPress={() => setClicks(value => value + 1)}>Review publishing options</Button>
    </Stack>

  </Stack>
</ThemeScope>`;
  return <Example title={title} density={density} description={responsive ? 'This fixed row becomes a column at the owned viewport breakpoint; resize the page to compare.' : 'Compare spacing and alignment with a fixed layout and density.'}
    source={source({name:'StackMatrix',imports:["import { Stack, Typography, Button } from '@structured-growth/sg-ui/experimental';"],state:`  const [clicks, setClicks] = useState(${clicks});`,body})}>
    <Stack gap={3}><Stack direction={direction} gap={3} align="center" justify="between" wrap responsive={responsive}>
      <Typography>Course publishing actions</Typography><Button onPress={() => setClicks(value => value + 1)}>Save draft</Button><Button variant="outlined" onPress={() => setClicks(value => value + 1)}>Review publishing options</Button>
    </Stack></Stack>
  </Example>;
}
function NavigationMatrixExample({direction, density, dir='ltr'}:{direction:'row' | 'column';density:Density;dir?:'ltr' | 'rtl'}) {
  const source = useExampleSource();
  const [current, setCurrent] = useState('overview');
  const title = `${direction === 'row' ? 'Horizontal' : 'Vertical'} navigation · ${density} · ${dir.toUpperCase()}`;
  const body = `<ThemeScope density={${literal(density)}} dir={${literal(dir)}}>
  <Stack gap={3}>
    <Navigation label={${literal(title)}}>
      <Stack direction={${literal(direction)}} gap={2} wrap>
        <NavigationItem href="#overview" current={current === "overview"} onClick={event => {event.preventDefault();setCurrent("overview");}}>Overview</NavigationItem>
        <NavigationItem href="#lessons" current={current === "lessons"} onClick={event => {event.preventDefault();setCurrent("lessons");}}>Lessons and activities</NavigationItem>
        <NavigationItem href="#resources" current={current === "resources"} onClick={event => {event.preventDefault();setCurrent("resources");}}>Resources</NavigationItem>
      </Stack>
    </Navigation>

  </Stack>
</ThemeScope>`;
  return <Example title={title} density={density} description="Stack supplies the layout; Navigation has no orientation prop. These local links update a simulated destination without leaving the example. A production host supplies its routing adapter."
    source={source({name:'NavigationMatrix',imports:["import { Navigation, NavigationItem, Stack, Typography } from '@structured-growth/sg-ui/experimental';"],state:`  const [current, setCurrent] = useState(${literal(current)});`,body})}>
    <ThemeScope dir={dir}><Stack gap={3}><Navigation label={title}><Stack direction={direction} gap={2} wrap>
      <NavigationItem href="#overview" current={current === 'overview'} onClick={event => {event.preventDefault();setCurrent('overview');}}>Overview</NavigationItem>
      <NavigationItem href="#lessons" current={current === 'lessons'} onClick={event => {event.preventDefault();setCurrent('lessons');}}>Lessons and activities</NavigationItem>
      <NavigationItem href="#resources" current={current === 'resources'} onClick={event => {event.preventDefault();setCurrent('resources');}}>Resources</NavigationItem>
    </Stack></Navigation></Stack></ThemeScope>
  </Example>;
}

export const presentationEntries: CatalogEntry[] = [
  {slug: "hierarchical-menu", title: "Hierarchical menu", exports: ["HierarchicalMenu"], description: "Sliding drilldown and Back navigation with native links or command menu semantics.", Playground: HierarchicalMenuExamples},
  {slug:"icons", title:"Icons", description:"Search every owned public SVG icon and adjust sizing, stroke and accessible labels.", exports:["AccessTimeFilledIcon", "AccountCircleIcon", "AddIcon", "ApartmentIcon", "ArrowDropDownIcon", "ArrowForwardIcon", "AssignmentTurnedInIcon", "AutoStoriesIcon", "BookIcon", "BrushIcon", "BuildIcon", "BusinessCenterIcon", "CachedIcon", "CalendarTodayIcon", "CheckIcon", "ChevronRightIcon", "CircleIcon", "ClassIcon", "CloseIcon", "CodeIcon", "ComputerIcon", "ContentCopyIcon", "CorporateFareIcon", "DashboardIcon", "DeleteOutlineIcon", "DescriptionIcon", "DescriptionOutlinedIcon", "DnsIcon", "DragIndicatorIcon", "EditIcon", "EventIcon", "ExpandLessIcon", "ExpandMoreIcon", "ExploreIcon", "FactCheckOutlinedIcon", "FilterListIcon", "FontDownloadIcon", "FormatAlignCenterIcon", "FormatAlignJustifyIcon", "FormatAlignLeftIcon", "FormatAlignRightIcon", "FormatBoldIcon", "FormatClearIcon", "FormatColorFillIcon", "FormatColorTextIcon", "FormatIndentDecreaseIcon", "FormatIndentIncreaseIcon", "FormatItalicIcon", "FormatListBulletedIcon", "FormatListNumberedIcon", "FormatSizeIcon", "FormatStrikethroughIcon", "FormatUnderlinedIcon", "GroupIcon", "HighlightIcon", "HorizontalRuleIcon", "ImageIcon", "KeyboardArrowDownIcon", "KeyboardArrowLeftIcon", "LinkIcon", "LockIcon", "LockResetIcon", "LogoutIcon", "ManageAccountsIcon", "MenuBookIcon", "MenuBookOutlinedIcon", "MoreHorizIcon", "MoreVertIcon", "PaidIcon", "PeopleIcon", "PersonIcon", "PersonAddIcon", "PhotoCameraBackIcon", "QuizOutlinedIcon", "RedoIcon", "RemoveIcon", "SchoolIcon", "ScienceOutlinedIcon", "SearchIcon", "SortIcon", "StarIcon", "SubscriptIcon", "SuperscriptIcon", "TaskAltIcon", "TerminalIcon", "TranslateIcon", "TuneIcon", "UndoIcon", "UploadFileIcon", "ViewColumnIcon", "ViewListIcon", "ViewWeekIcon", "VisibilityOffIcon", "VpnKeyIcon", "WindowIcon", "WorkOutlineOutlinedIcon", "getActivityTypeIcon"], Playground:IconsPlayground},
  {slug: "button", title: "Button", exports: ["Button"], description: "Trigger an action with a labelled button, optional icons and native interaction states.", Playground: ButtonExamples},
  {slug: "owned-dialog", title: "Dialog", exports: ["Dialog"], description: "Controlled overlay dismissal and explicitly host-owned actions.", Playground: OwnedDialogPlayground},
  {slug: "popover", title: "Popover", exports: ["Popover"], description: "Anchored supplementary content with keyboard dismissal.", Playground: PopoverPlayground},
  {slug: "tabs", title: "Tabs", exports: ["Tabs"], description: "Host-controlled active panel, orientation and keyboard activation.", Playground: TabsPlayground},
  {slug: "typography", title: "Typography", exports: ["Typography"], description: "Visual roles are independent of native text semantics.", Playground: TypographyPlayground},
  {slug: "box", title: "Box", exports: ["Box"], description: "Native semantic wrapper with spacing and readable container width.", Playground: BoxPlayground},
  {slug: "stack", title: "Stack", exports: ["Stack"], description: "Responsive spacing, alignment and wrapping for composed content.", Playground: StackPlayground},
  {slug: "surface", title: "Surface", exports: ["Surface"], description: "Shared surface elevation, tone and spacing.", Playground: SurfacePlayground},
  {slug: "card", title: "Card", exports: ["Card", "CardContent"], description: "Semantic cards with shared surfaces and padded content.", Playground: CardPlayground},
  {slug: "divider", title: "Divider", exports: ["Divider"], description: "Semantic or decorative separators in horizontal and vertical layouts.", Playground: DividerPlayground},
  {slug: "icon-button", title: "Icon button", exports: ["IconButton"], description: "An accessible action name is required even when only an icon is visible.", Playground: IconButtonPlayground},
  {slug: "button-group", title: "Button group", exports: ["ButtonGroup"], description: "Group related native actions without changing their interaction semantics.", Playground: ButtonGroupPlayground},
  {slug: "menu", title: "Menu", exports: ["Menu"], description: "Host-owned actions, checked items, disabled commands and shortcuts.", Playground: MenuPlayground},
  {slug: "split-action", title: "Split action", exports: ["SplitAction"], description: "A primary command and secondary menu share a neutral action group.", Playground: SplitActionPlayground},
  {slug: "link", title: "Link", exports: ["Link"], description: "Native external navigation and host adapter routing for internal links.", Playground: LinkPlayground},
  {slug: "breadcrumbs", title: "Breadcrumbs", exports: ["Breadcrumbs"], description: "A named navigation landmark with a non-link current item.", Playground: BreadcrumbsPlayground},
  {slug: "tooltip", title: "Tooltip", exports: ["Tooltip"], description: "Plain supplementary descriptions for pointer and keyboard focus.", Playground: TooltipPlayground},
  {slug: "list", title: "List", exports: ["List", "ListItem", "ListItemButton", "ListItemText", "ListItemIcon"], description: "Native list semantics with optional selectable actions and secondary text.", Playground: ListPlayground},
  {slug: "navigation", title: "Navigation", exports: ["Navigation", "NavigationItem"], description: "Route ownership remains with the host; current links expose aria-current.", Playground: NavigationPlayground},
  {slug: "disclosure", title: "Disclosure", exports: ["Disclosure"], description: "Expandable regions with controlled state and optional child unmounting.", Playground: DisclosurePlayground},
  {slug: "collapse", title: "Collapse", exports: ["Collapse"], description: "Host-owned visibility preserves children by default.", Playground: CollapsePlayground},
  {slug: "chip", title: "Chip", exports: ["Chip"], description: "Presentation labels with owned tone, variant and local density.", Playground: ChipPlayground},
  {slug: "badge", title: "Badge", exports: ["Badge"], description: "Host-formatted counts remain accessible without automatic capping.", Playground: BadgePlayground},
  {slug: "progress", title: "Progress", exports: ["Progress", "CircularProgress", "LinearProgress"], description: "Determinate and unknown-work progress with meaningful accessible labels.", Playground: ProgressPlayground},
  {slug: "status", title: "Status", exports: ["Status"], description: "Opt-in announcements for meaningful host state changes.", Playground: StatusPlayground},
  {slug: "avatar", title: "Avatar", exports: ["Avatar"], description: "Named or decorative identities with stable fallback content.", Playground: AvatarPlayground},
  {slug: "table", title: "Table", exports: ["Table", "TableCaption", "TableHead", "TableBody", "TableFoot", "TableRow", "TableCell", "TableHeaderCell"], description: "Native tabular content with captions, scoped headers and alignment.", Playground: TablePlayground},
  {slug: "pagination", title: "Pagination", exports: ["Pagination"], description: "Zero-based host state, known or unknown totals and page-size reset.", Playground: PaginationPlayground},
  {slug: "provider", title: "Provider", exports: ["Provider", "AppThemeProvider"], description: "Production interaction scope with owned density and direction.", Playground: ProviderPlayground},
  {slug: "theme-scope", title: "ThemeScope", exports: ["ThemeScope"], description: "Nested visual scopes preserve the selected demo identity while changing density.", Playground: ThemeScopePlayground},
];
