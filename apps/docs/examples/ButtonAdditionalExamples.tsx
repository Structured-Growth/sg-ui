'use client';
import { useState } from 'react';
import { ThemeScope, type Density } from '@structured-growth/sg-ui/theme';
import { Button, type ButtonProps } from '@structured-growth/sg-ui/components/Button';
import { Stack, Typography } from '@structured-growth/sg-ui/primitives';
import { Select, TextField, Checkbox } from '@structured-growth/sg-ui/experimental';
import { Example } from '../components/Example';
import { exampleSource, literal } from './source';
const imports = ["import { Button } from '@structured-growth/sg-ui/components/Button';", "import { Stack, Typography } from '@structured-growth/sg-ui/primitives';"];
const variants = ['filled', 'outlined', 'text'] as const;
const tones = ['primary', 'neutral'] as const;
export function ButtonAdditionalExamples() {
  return <Stack gap={4}>
    {variants.map(variant=><ButtonVariantExample key={variant} variant={variant}/>)}
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
    body:`<ThemeScope density=${literal(density)}>\n  <Stack gap={3}>\n    <Button>Example action</Button>\n    <TextField label=${literal(fieldLabel)} value={value} onValueChange={setValue} />\n  </Stack>\n</ThemeScope>`,
  })}><Stack gap={3}><Button>Example action</Button><TextField label={fieldLabel} value={value} onValueChange={setValue}/></Stack></Example></Stack>;
}

function ButtonPlaygroundPanel2() {
const [density, setDensity] = useState<Density>('comfortable');
const [densityValues, setDensityValues] = useState({compact:'Course basics', comfortable:'Course basics'});
const [variant, setVariant] = useState<NonNullable<ButtonProps['variant']>>('filled');
const [tone, setTone] = useState<NonNullable<ButtonProps['tone']>>('primary');
const [label, setLabel] = useState('Save changes');
const [disabled, setDisabled] = useState(false);
const [loading, setLoading] = useState(false);
const [presses, setPresses] = useState(0);
const [submits, setSubmits] = useState(0);
const renderedLabel = label || 'Action';
const source = (name: string, body: string, state = '', extraImports: string[] = []) => exampleSource({ name, body, state, imports: [...imports, ...extraImports] });
return <Example title="Density and content" source={source('ButtonContent', `<Stack direction="row" wrap gap={3}>\n  <Button density="compact">Compact action</Button>\n  <Button density="comfortable">Comfortable action</Button>\n  <Button variant="outlined">A longer action label to explore wrapping</Button>\n  <Button disabled>Unavailable</Button>\n  <Button loading>Saving changes</Button>\n</Stack>`)}>
      <Stack direction="row" wrap gap={3}><Button density="compact">Compact action</Button><Button density="comfortable">Comfortable action</Button><Button variant="outlined">A longer action label to explore wrapping</Button><Button disabled>Unavailable</Button><Button loading>Saving changes</Button></Stack>
    </Example>;
}

function ButtonPlaygroundPanel3() {
const [density, setDensity] = useState<Density>('comfortable');
const [densityValues, setDensityValues] = useState({compact:'Course basics', comfortable:'Course basics'});
const [variant, setVariant] = useState<NonNullable<ButtonProps['variant']>>('filled');
const [tone, setTone] = useState<NonNullable<ButtonProps['tone']>>('primary');
const [label, setLabel] = useState('Save changes');
const [disabled, setDisabled] = useState(false);
const [loading, setLoading] = useState(false);
const [presses, setPresses] = useState(0);
const [submits, setSubmits] = useState(0);
const renderedLabel = label || 'Action';
const source = (name: string, body: string, state = '', extraImports: string[] = []) => exampleSource({ name, body, state, imports: [...imports, ...extraImports] });
return <Example title="Native form submission" source={source('ButtonForm', `<form onSubmit={event => { event.preventDefault(); setSubmits(value => value + 1); }}>\n  <Stack direction="row" wrap gap={3}>\n    <Button variant="text">Cancel</Button>\n    <Button type="submit">Save form</Button>\n    <Typography aria-live="polite">Saved {submits} times</Typography>\n  </Stack>\n</form>`, `  const [submits, setSubmits] = useState(${submits});`)}>
      <form onSubmit={event => {event.preventDefault(); setSubmits(value => value + 1);}}><Stack direction="row" wrap gap={3}><Button variant="text">Cancel</Button><Button type="submit">Save form</Button><Typography aria-live="polite">Saved {submits} times</Typography></Stack></form>
    </Example>;
}

/** Fixed variant × tone × density references own their interaction state. */
function ButtonVariantExample({variant}: {variant: NonNullable<ButtonProps['variant']>}) {
  const [presses, setPresses] = useState(0);
  const title = `${variant[0].toUpperCase() + variant.slice(1)} variant and tone matrix`;
  const body = `<Stack gap={3}>\n${(['compact','comfortable'] as const).map(density => `  <ThemeScope density=${literal(density)}>\n    <Stack direction="row" wrap gap={3}>\n${tones.map(tone => `      <Button variant=${literal(variant)} tone=${literal(tone)} onPress={() => setPresses(value => value + 1)}>{${literal(tone+' · '+density)}}</Button>`).join('\n')}\n    </Stack>\n  </ThemeScope>`).join('\n')}\n  \n</Stack>`;
  return <Example title={title} description="Both tones at both densities, independently of the playground."
    source={exampleSource({name:`${variant[0].toUpperCase()+variant.slice(1)}Buttons`,imports,state:`  const [presses, setPresses] = useState(${presses});`,body})}>
    <Stack gap={3}>{(['compact','comfortable'] as const).map(density => <ThemeScope key={density} density={density}>
      <Stack direction="row" wrap gap={3}>{tones.map(tone => <Button key={tone} variant={variant} tone={tone} onPress={() => setPresses(value => value+1)}>{tone} · {density}</Button>)}</Stack>
    </ThemeScope>)}</Stack>
  </Example>;
}
