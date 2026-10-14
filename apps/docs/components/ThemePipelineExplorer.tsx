'use client';
import {useState} from 'react';
import {componentTokenReferences, type ComponentTokenName} from '@structured-growth/sg-ui/tokens';
import {ThemeScope, type ScopeStyle} from '@structured-growth/sg-ui/theme';
import {Button, Checkbox, Dialog, Disclosure, Menu, Select, Surface, TextField} from '@structured-growth/sg-ui/experimental';
import {Stack, Typography} from '@structured-growth/sg-ui/primitives';
import {themeGraph, resolveSemantics, type SemanticRole} from '../theme';
import {useDemoSettings} from './DemoSettings';
import {Example} from './Example';
import {exampleSource} from '../examples/source';
import {Code} from './DocPage';

const componentOptions = Object.keys(componentTokenReferences).map(id => ({id, label:id}));
const override:ScopeStyle = {
  '--sgui-button-primary-background':'var(--sgui-action-neutral)',
  '--sgui-button-primary-hover-background':'var(--sgui-action-neutral-hover)',
  '--sgui-button-primary-pressed-background':'var(--sgui-action-neutral-pressed)',
  '--sgui-button-primary-text':'var(--sgui-on-action-neutral)',
};

export function ThemePipelineExplorer() {
  const settings=useDemoSettings();
  const [selected,setSelected]=useState<ComponentTokenName>('buttonPrimaryBackground');
  const [custom,setCustom]=useState(false);
  const [open,setOpen]=useState(false);
  const map=settings.forcedColors ? themeGraph.forcedColors : themeGraph.themes[settings.identity][settings.resolvedMode][settings.resolvedContrast];
  const semantics=resolveSemantics(map);
  const dependency=componentTokenReferences[selected];
  const chain:string[]=[`component.${selected}`,`${dependency.tier}.${dependency.token}`];
  if(dependency.tier==='semantic') {
    let role=dependency.token as SemanticRole;
    while(map[role].startsWith('semantic.')) {const reference=map[role];chain.push(reference);role=reference.slice(9) as SemanticRole;}
    chain.push(map[role],semantics[role]);
  }
  const style:ScopeStyle=custom ? override : {};
  const source=exampleSource({name:'ComponentTokenOverride',
    state:`  const [open, setOpen] = useState(${open});`,
    imports:["import { Button, Dialog, Menu, TextField } from '@structured-growth/sg-ui/experimental';", "import { Stack } from '@structured-growth/sg-ui/primitives';"],
    body:`<Stack gap={3}>\n<Button>Identity button</Button>\n<ThemeScope density="compact" style={${JSON.stringify(style,null,2)}}>\n  <Stack gap={3}>\n  <Button>Scoped button</Button>\n  <TextField label="Unchanged field" defaultValue="Same identity semantics" />\n  <Menu label="Scoped actions" trigger={<Button variant="outlined">Open scoped menu</Button>} items={[{id:'save',label:'Save'}]} />\n  <Button variant="outlined" onPress={() => setOpen(true)}>Open scoped dialog</Button>\n  <Dialog open={open} title="Scoped dialog" onDismiss={() => setOpen(false)}><Button onPress={() => setOpen(false)}>Portal action</Button></Dialog>\n  </Stack>\n</ThemeScope>\n</Stack>`});
  return <Stack gap={4}>
    <Surface variant="outlined" padding={4} as="section" aria-label="Theme token pipeline">
      <Stack gap={3}>
        <Typography as="h2" variant="h5">Inspect the token pipeline</Typography>
        <Typography>Use Demo settings to inspect the selected identity, appearance and contrast. The component references below come from the library’s compiled public tokens.</Typography>
        <Select label="Component token" value={selected} onValueChange={value=>{if(value && value in componentTokenReferences)setSelected(value as ComponentTokenName);}} options={componentOptions} />
        <Code>{chain.join(' → ')}</Code>
        <Code>{`--sgui-${selected.replace(/[A-Z]/g,letter=>'-'+letter.toLowerCase())}: var(--sgui-${dependency.token.replace(/[A-Z]/g,letter=>'-'+letter.toLowerCase())});`}</Code>
        <Typography tone="muted">Color tokens resolve through the active semantic map to a named palette value. Geometry and typography reference shared or density tokens. Component styles consume these aliases; nested scopes and portals retain the local theme.</Typography>
        <Disclosure label="Show all semantic mappings"><Code>{JSON.stringify(map,null,2)}</Code></Disclosure>
        <Disclosure label="Show named identity palettes"><Code>{JSON.stringify(themeGraph.palettes,null,2)}</Code></Disclosure>
      </Stack>
    </Surface>
    <Example title="Component token override" description="A local primary-button override uses the identity’s neutral action colors. The sibling button and field keep their existing tokens. Nested density and the menu portal preserve the same scoped override."
      controls={<Checkbox label="Use neutral colors for scoped primary buttons" checked={custom} onCheckedChange={setCustom} />} source={source}>
      <Stack gap={3}>
        <Button>Identity button</Button>
        <ThemeScope density="compact" style={style} data-token-override="">
          <Stack gap={3}>
            <Button>Scoped button</Button>
            <TextField label="Unchanged field" defaultValue="Same identity semantics" />
            <Menu label="Scoped actions" trigger={<Button variant="outlined">Open scoped menu</Button>} items={[{id:'save',label:'Save'}]} />
            <Button variant="outlined" onPress={()=>setOpen(true)}>Open scoped dialog</Button>
            <Dialog open={open} title="Scoped dialog" onDismiss={()=>setOpen(false)}><Button onPress={()=>setOpen(false)}>Portal action</Button></Dialog>
          </Stack>
        </ThemeScope>
      </Stack>
    </Example>
  </Stack>;
}
