'use client';
import { useState } from 'react';
import { ThemeScope, type Density } from '@structured-growth/sg-ui/theme';
import { AppButton, type AppButtonProps } from '@structured-growth/sg-ui/components/AppButton';
import { Stack, Typography } from '@structured-growth/sg-ui/primitives';
import { Select, TextField, Checkbox } from '@structured-growth/sg-ui/experimental';
import { Example } from '../components/Example';
import { exampleSource, literal } from './source';
const imports = ["import { AppButton } from '@structured-growth/sg-ui/components/AppButton';", "import { Stack, Typography } from '@structured-growth/sg-ui/primitives';"];
const variants = ['filled', 'outlined', 'text'] as const;
const tones = ['primary', 'neutral'] as const;
export function ButtonPlayground() {
  return <Stack gap={4}>
    <ButtonPlaygroundPanel1 />
    {variants.map(variant=><ButtonVariantExample key={variant} variant={variant}/>)}
    <Typography as="h2" variant="h5">Compare densities</Typography>
    <Typography tone="muted">Independent compact and comfortable scopes leave the docs layout alone.</Typography>
    <Stack direction="row" responsive gap={4}>
      <ButtonDensityExample density="compact"/>
      <ButtonDensityExample density="comfortable"/>
    </Stack>
    <ButtonPlaygroundPanel2 />
    <ButtonPlaygroundPanel3 />
  </Stack>;
}
function ButtonDensityExample({density}:{density:Density}) {
  const [value,setValue]=useState('Course basics');
  const title=`${density==='compact'?'Compact':'Comfortable'} density`;
  const fieldLabel=`${density==='compact'?'Compact':'Comfortable'} field`;
  return <Stack style={{flex:1,minWidth:0}}><Example title={title} density={density} source={exampleSource({
    name:density==='compact'?'CompactControls':'ComfortableControls',
    imports:[...imports,"import { TextField } from '@structured-growth/sg-ui/experimental';"],
    state:`  const [value, setValue] = useState(${literal(value)});`,
    body:`<ThemeScope density=${literal(density)}>\n  <Stack gap={3}>\n    <AppButton>Example action</AppButton>\n    <TextField label=${literal(fieldLabel)} value={value} onValueChange={setValue} />\n  </Stack>\n</ThemeScope>`,
  })}><Stack gap={3}><AppButton>Example action</AppButton><TextField label={fieldLabel} value={value} onValueChange={setValue}/></Stack></Example></Stack>;
}

function ButtonPlaygroundPanel1() {
const [density, setDensity] = useState<Density>('comfortable');
const [densityValues, setDensityValues] = useState({compact:'Course basics', comfortable:'Course basics'});
const [variant, setVariant] = useState<NonNullable<AppButtonProps['variant']>>('filled');
const [tone, setTone] = useState<NonNullable<AppButtonProps['tone']>>('primary');
const [label, setLabel] = useState('Save changes');
const [disabled, setDisabled] = useState(false);
const [loading, setLoading] = useState(false);
const [presses, setPresses] = useState(0);
const [submits, setSubmits] = useState(0);
const renderedLabel = label || 'Action';
const source = (name: string, body: string, state = '', extraImports: string[] = []) => exampleSource({ name, body, state, imports: [...imports, ...extraImports] });
return <Example title="Prop playground" description="Change the props; the source below follows your current settings."
      controls={<Stack gap={3}>
<Stack direction="row" responsive gap={3}>
        <Select label="Variant" value={variant} options={variants.map(id => ({id, label:id}))} onValueChange={v => setVariant(v as typeof variant)} />
        <Select label="Tone" value={tone} options={tones.map(id => ({id, label:id}))} onValueChange={v => setTone(v as typeof tone)} />
        <Select label="Button density" value={density} options={[{id:'comfortable', label:'Comfortable'}, {id:'compact', label:'Compact'}]} onValueChange={v => {if (v === 'comfortable' || v === 'compact') setDensity(v);}} />
        <TextField label="Button label" value={label} onValueChange={setLabel} />
      </Stack>
      <Stack direction="row" wrap gap={3}><Checkbox label="Disabled" checked={disabled} onCheckedChange={setDisabled} /><Checkbox label="Pending" checked={loading} onCheckedChange={setLoading} /></Stack>
      </Stack>}
      source={source('Button', `<Stack direction="row" wrap align="center" gap={3}>\n  <AppButton variant=${literal(variant)} tone=${literal(tone)} density=${literal(density)} disabled={${disabled}} loading={${loading}} onPress={() => setPresses(value => value + 1)}>\n    {${literal(renderedLabel)}}\n  </AppButton>\n  \n</Stack>`, `  const [presses, setPresses] = useState(${presses});`)}>
      <Stack direction="row" wrap align="center" gap={3}><AppButton density={density} variant={variant} tone={tone} disabled={disabled} loading={loading} onPress={() => setPresses(n => n + 1)}>{renderedLabel}</AppButton></Stack>
    </Example>;
}

function ButtonPlaygroundPanel2() {
const [density, setDensity] = useState<Density>('comfortable');
const [densityValues, setDensityValues] = useState({compact:'Course basics', comfortable:'Course basics'});
const [variant, setVariant] = useState<NonNullable<AppButtonProps['variant']>>('filled');
const [tone, setTone] = useState<NonNullable<AppButtonProps['tone']>>('primary');
const [label, setLabel] = useState('Save changes');
const [disabled, setDisabled] = useState(false);
const [loading, setLoading] = useState(false);
const [presses, setPresses] = useState(0);
const [submits, setSubmits] = useState(0);
const renderedLabel = label || 'Action';
const source = (name: string, body: string, state = '', extraImports: string[] = []) => exampleSource({ name, body, state, imports: [...imports, ...extraImports] });
return <Example title="Density and content" source={source('ButtonContent', `<Stack direction="row" wrap gap={3}>\n  <AppButton density="compact">Compact action</AppButton>\n  <AppButton density="comfortable">Comfortable action</AppButton>\n  <AppButton variant="outlined">A longer action label to explore wrapping</AppButton>\n  <AppButton disabled>Unavailable</AppButton>\n  <AppButton loading>Saving changes</AppButton>\n</Stack>`)}>
      <Stack direction="row" wrap gap={3}><AppButton density="compact">Compact action</AppButton><AppButton density="comfortable">Comfortable action</AppButton><AppButton variant="outlined">A longer action label to explore wrapping</AppButton><AppButton disabled>Unavailable</AppButton><AppButton loading>Saving changes</AppButton></Stack>
    </Example>;
}

function ButtonPlaygroundPanel3() {
const [density, setDensity] = useState<Density>('comfortable');
const [densityValues, setDensityValues] = useState({compact:'Course basics', comfortable:'Course basics'});
const [variant, setVariant] = useState<NonNullable<AppButtonProps['variant']>>('filled');
const [tone, setTone] = useState<NonNullable<AppButtonProps['tone']>>('primary');
const [label, setLabel] = useState('Save changes');
const [disabled, setDisabled] = useState(false);
const [loading, setLoading] = useState(false);
const [presses, setPresses] = useState(0);
const [submits, setSubmits] = useState(0);
const renderedLabel = label || 'Action';
const source = (name: string, body: string, state = '', extraImports: string[] = []) => exampleSource({ name, body, state, imports: [...imports, ...extraImports] });
return <Example title="Native form submission" source={source('ButtonForm', `<form onSubmit={event => { event.preventDefault(); setSubmits(value => value + 1); }}>\n  <Stack direction="row" wrap gap={3}>\n    <AppButton variant="text">Cancel</AppButton>\n    <AppButton type="submit">Save form</AppButton>\n    <Typography aria-live="polite">Saved {submits} times</Typography>\n  </Stack>\n</form>`, `  const [submits, setSubmits] = useState(${submits});`)}>
      <form onSubmit={event => {event.preventDefault(); setSubmits(value => value + 1);}}><Stack direction="row" wrap gap={3}><AppButton variant="text">Cancel</AppButton><AppButton type="submit">Save form</AppButton><Typography aria-live="polite">Saved {submits} times</Typography></Stack></form>
    </Example>;
}

/** Fixed variant × tone × density references own their interaction state. */
function ButtonVariantExample({variant}: {variant: NonNullable<AppButtonProps['variant']>}) {
  const [presses, setPresses] = useState(0);
  const title = `${variant[0].toUpperCase() + variant.slice(1)} variant and tone matrix`;
  const body = `<Stack gap={3}>\n${(['compact','comfortable'] as const).map(density => `  <ThemeScope density=${literal(density)}>\n    <Stack direction="row" wrap gap={3}>\n${tones.map(tone => `      <AppButton variant=${literal(variant)} tone=${literal(tone)} onPress={() => setPresses(value => value + 1)}>{${literal(tone+' · '+density)}}</AppButton>`).join('\n')}\n    </Stack>\n  </ThemeScope>`).join('\n')}\n  \n</Stack>`;
  return <Example title={title} description="Both tones at both densities, independently of the playground."
    source={exampleSource({name:`${variant[0].toUpperCase()+variant.slice(1)}Buttons`,imports,state:`  const [presses, setPresses] = useState(${presses});`,body})}>
    <Stack gap={3}>{(['compact','comfortable'] as const).map(density => <ThemeScope key={density} density={density}>
      <Stack direction="row" wrap gap={3}>{tones.map(tone => <AppButton key={tone} variant={variant} tone={tone} onPress={() => setPresses(value => value+1)}>{tone} · {density}</AppButton>)}</Stack>
    </ThemeScope>)}</Stack>
  </Example>;
}
