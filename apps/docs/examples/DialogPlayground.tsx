'use client';
import { useState } from 'react';
import { AppModal, type AppModalProps } from '@structured-growth/sg-ui/components/AppModal';
import { AppPageTabs } from '@structured-growth/sg-ui/components/AppPageTabs';
import { ThemeScope, type Density } from '@structured-growth/sg-ui/theme';
import { useExampleSource } from './useExampleSource';
import { AppButton } from '@structured-growth/sg-ui/components/AppButton';
import { Stack, Typography } from '@structured-growth/sg-ui/primitives';
import { Select, TextField, Checkbox } from '@structured-growth/sg-ui/experimental';
import { Example } from '../components/Example';
import { exampleSource, literal } from './source';
export function DialogPlayground() {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<NonNullable<AppModalProps['size']>>('md');
  const [locked, setLocked] = useState(false); const [name, setName] = useState('Course basics');
  const [saved, setSaved] = useState('No changes saved');
  const source = exampleSource({ name:'Dialog',
    imports:["import { AppModal } from '@structured-growth/sg-ui/components/AppModal';", "import { AppButton } from '@structured-growth/sg-ui/components/AppButton';", "import { Stack, Typography } from '@structured-growth/sg-ui/primitives';", "import { TextField } from '@structured-growth/sg-ui/experimental';"],
    state:`  const [open, setOpen] = useState(false);\n  const [name, setName] = useState(${literal(name)});\n  const [saved, setSaved] = useState(${literal(saved)});`,
    body:`<Stack gap={3}>\n  <AppButton onPress={() => setOpen(true)}>Open example dialog</AppButton>\n  <Typography role="status">{saved}</Typography>\n  <AppModal open={open} title="Course settings" size=${literal(size)} showCloseButton\n    disableBackdropClose={${locked}} disableEscapeKeyDown={${locked}} onClose={() => setOpen(false)}\n    primaryAction={{label:'Save settings', onPress:() => {setSaved(\`Saved \${name}\`); setOpen(false);}}}\n    secondaryAction={{label:'Cancel', onPress:() => setOpen(false)}}>\n    <Stack gap={3}>\n      <Typography>This example keeps its draft and save action in the docs app.</Typography>\n      <TextField label="Course name" value={name} onValueChange={setName} />\n    </Stack>\n  </AppModal>\n</Stack>`,
  });
  return <Stack gap={4}><Example title="Prop playground" description="Adjust dialog props and copy a complete example with host-owned draft and actions." source={source} controls={<Stack gap={3}>
<Select label="Dialog size" value={size} options={['xs','sm','md','lg','xl','full'].map(id => ({id,label:id}))} onValueChange={v => setSize(v as typeof size)} />
    <Checkbox label="Require an explicit close action" checked={locked} onCheckedChange={setLocked} />
    </Stack>}>
    <AppButton onPress={() => setOpen(true)}>Open example dialog</AppButton><Typography role="status">{saved}</Typography>
    <AppModal open={open} title="Course settings" size={size} showCloseButton disableBackdropClose={locked} disableEscapeKeyDown={locked} onClose={() => setOpen(false)} primaryAction={{label:'Save settings',onPress:() => {setSaved(`Saved ${name}`);setOpen(false);}}} secondaryAction={{label:'Cancel',onPress:() => setOpen(false)}}><Stack gap={3}><Typography>This example keeps its draft and save action in the docs app.</Typography><TextField label="Course name" value={name} onValueChange={setName} /></Stack></AppModal>
  </Example>
    {(['xs','sm','md','lg','xl','full'] as const).map(value => <ModalSizeExample key={value} size={value} />)}
    {(['compact','comfortable'] as const).map(value => <ModalDensityExample key={value} density={value} />)}
    <TabbedModalExample />
    <TwoStepModalExample />
    <LongContentModalExample />
  </Stack>;
}

const modalImports = [
  "import { AppModal } from '@structured-growth/sg-ui/components/AppModal';",
  "import { AppButton } from '@structured-growth/sg-ui/components/AppButton';",
  "import { Stack, Typography } from '@structured-growth/sg-ui/primitives';",
];
function ModalSizeExample({size}: {size: NonNullable<AppModalProps['size']>}) {
  const source = useExampleSource();
  const [open, setOpen] = useState(false);
  return <Example title={`${size.toUpperCase()} size`} description={size === 'full' ? 'Full-screen composition for a large workspace.' : `The ${size} width adapts to the available viewport.`}
    source={source({name:`Modal${size.toUpperCase()}`,imports:modalImports,state:`  const [open, setOpen] = useState(${open});`,body:`<Stack gap={3}>
  <AppButton variant="outlined" onPress={() => setOpen(true)}>Open ${size} dialog</AppButton>
  <AppModal open={open} title="Course overview" subtitle="Select a size appropriate to the task." size={${literal(size)}} showCloseButton onClose={() => setOpen(false)} primaryAction={{label:"Done",onPress:() => setOpen(false)}}>
    <Stack gap={3}><Typography variant="h5">Leadership foundations</Typography><Typography>Six modules with practical exercises and instructor feedback.</Typography><Typography tone="muted">This read-only summary has one action and no step indicator.</Typography></Stack>
  </AppModal>
</Stack>`})}>
    <AppButton variant="outlined" onPress={() => setOpen(true)}>Open {size} dialog</AppButton>
    <AppModal open={open} title="Course overview" subtitle="Select a size appropriate to the task." size={size} showCloseButton onClose={() => setOpen(false)} primaryAction={{label:'Done',onPress:() => setOpen(false)}}><Stack gap={3}><Typography variant="h5">Leadership foundations</Typography><Typography>Six modules with practical exercises and instructor feedback.</Typography><Typography tone="muted">This read-only summary has one action and no step indicator.</Typography></Stack></AppModal>
  </Example>;
}
function ModalDensityExample({density}: {density: Density}) {
  const source = useExampleSource();
  const [open, setOpen] = useState(false); const [value, setValue] = useState('Leadership foundations');
  const [saved, setSaved] = useState('Not saved');
  const title = `${density === 'compact' ? 'Compact' : 'Comfortable'} dialog density`;
  return <Example title={title} density={density} description="Fields and content inherit the local density; AppModal footer actions retain their compact contract."
    source={source({name:`${density === 'compact' ? 'Compact' : 'Comfortable'}Modal`,imports:[...modalImports,"import { TextField } from '@structured-growth/sg-ui/experimental';"],state:`  const [open, setOpen] = useState(${open});\n  const [value, setValue] = useState(${literal(value)});\n  const [saved, setSaved] = useState(${literal(saved)});`,body:`<ThemeScope density={${literal(density)}}>
  <Stack gap={3}>
    <AppButton onPress={() => setOpen(true)}>Open ${density} form</AppButton><Typography role="status">{saved}</Typography>
    <AppModal open={open} title="Rename course" size="sm" showCloseButton onClose={() => setOpen(false)} primaryAction={{label:"Save locally",onPress:() => {setSaved(value);setOpen(false);}}} secondaryAction={{label:"Cancel",onPress:() => setOpen(false)}}>
      <TextField label="Course title" value={value} onValueChange={setValue} />
    </AppModal>
  </Stack>
</ThemeScope>`})}>
    <AppButton onPress={() => setOpen(true)}>Open {density} form</AppButton><Typography role="status">{saved}</Typography>
    <AppModal open={open} title="Rename course" size="sm" showCloseButton onClose={() => setOpen(false)} primaryAction={{label:'Save locally',onPress:() => {setSaved(value);setOpen(false);}}} secondaryAction={{label:'Cancel',onPress:() => setOpen(false)}}><TextField label="Course title" value={value} onValueChange={setValue} /></AppModal>
  </Example>;
}
function TabbedModalExample() {
  const source = useExampleSource();
  const [open, setOpen] = useState(false); const [tab, setTab] = useState('details');
  const [course, setCourse] = useState('Leadership foundations'); const [summary, setSummary] = useState('Build confidence through practice.');
  const [saved, setSaved] = useState('No tabbed settings saved');
  const body = `<Stack gap={3}>
  <AppButton variant="outlined" onPress={() => setOpen(true)}>Open tabbed settings</AppButton><Typography role="status">{saved}</Typography>
  <AppModal open={open} title="Course configuration" size="md" heightMode="md" showCloseButton onClose={() => setOpen(false)} bodyStyle={{display:"flex",flexDirection:"column",overflow:"auto"}} primaryAction={{label:"Save locally",onPress:() => {setSaved(course + ": " + summary);setOpen(false);}}} secondaryAction={{label:"Cancel",onPress:() => setOpen(false)}}>
    <AppPageTabs value={tab} onChange={setTab} label="Configuration sections" style={{position:"sticky",top:0}} items={[
      {id:"details",label:"Details",content:<Stack gap={3} style={{overflow:"auto",maxHeight:"35dvh"}}><TextField label="Course title" value={course} onValueChange={setCourse} /><Typography>Configure the title learners see.</Typography></Stack>},
      {id:"summary",label:"Summary",content:<Stack gap={3} style={{overflow:"auto",maxHeight:"35dvh"}}><TextField label="Course summary" value={summary} onValueChange={setSummary} /><Typography>Keep the summary concise and useful.</Typography></Stack>}
    ]} />
  </AppModal>
</Stack>`;
  return <Example title="Tabbed configuration form" description="Two sections share host draft state. Tab content scrolls independently; dialog scrolling remains available when chrome cannot fit. Saving here updates local state only."
    source={source({name:'TabbedModal',imports:[...modalImports,"import { AppPageTabs } from '@structured-growth/sg-ui/components/AppPageTabs';","import { TextField } from '@structured-growth/sg-ui/experimental';"],state:`  const [open, setOpen] = useState(${open});\n  const [tab, setTab] = useState(${literal(tab)});\n  const [course, setCourse] = useState(${literal(course)});\n  const [summary, setSummary] = useState(${literal(summary)});\n  const [saved, setSaved] = useState(${literal(saved)});`,body})}>
    <AppButton variant="outlined" onPress={() => setOpen(true)}>Open tabbed settings</AppButton><Typography role="status">{saved}</Typography>
    <AppModal open={open} title="Course configuration" size="md" heightMode="md" showCloseButton onClose={() => setOpen(false)} bodyStyle={{display:'flex',flexDirection:'column',overflow:'auto'}} primaryAction={{label:'Save locally',onPress:() => {setSaved(course + ': ' + summary);setOpen(false);}}} secondaryAction={{label:'Cancel',onPress:() => setOpen(false)}}>
      <AppPageTabs value={tab} onChange={setTab} label="Configuration sections" style={{position:'sticky',top:0}} items={[
        {id:'details',label:'Details',content:<Stack gap={3} style={{overflow:'auto',maxHeight:'35dvh'}}><TextField label="Course title" value={course} onValueChange={setCourse} /><Typography>Configure the title learners see.</Typography></Stack>},
        {id:'summary',label:'Summary',content:<Stack gap={3} style={{overflow:'auto',maxHeight:'35dvh'}}><TextField label="Course summary" value={summary} onValueChange={setSummary} /><Typography>Keep the summary concise and useful.</Typography></Stack>}
      ]} />
    </AppModal>
  </Example>;
}
function TwoStepModalExample() {
  const source = useExampleSource();
  const [open, setOpen] = useState(false); const [step, setStep] = useState(1);
  const [name, setName] = useState('Leadership foundations'); const [saved, setSaved] = useState('No course created');
  return <Example title="Two-step creation flow" description="Step labels appear only for a multi-step task. Back preserves the draft; reopening begins at step one. Persistence remains host-owned."
    source={source({name:'TwoStepModal',imports:[...modalImports,"import { TextField } from '@structured-growth/sg-ui/experimental';"],state:`  const [open, setOpen] = useState(${open});\n  const [step, setStep] = useState(${step});\n  const [name, setName] = useState(${literal(name)});\n  const [saved, setSaved] = useState(${literal(saved)});`,body:`<Stack gap={3}>
  <AppButton onPress={() => {setStep(1);setOpen(true);}}>Start two-step flow</AppButton><Typography role="status">{saved}</Typography>
  <AppModal open={open} title="Create course" size="md" showCloseButton onClose={() => setOpen(false)} steps={{current:step,total:2,label:step === 1 ? "1 of 2: Course details" : "2 of 2: Review"}} primaryAction={{label:step === 1 ? "Review" : "Create locally",disabled:!name.trim(),onPress:() => {if (step === 1) setStep(2);else {setSaved("Created " + name);setOpen(false);}}}} secondaryAction={{label:step === 1 ? "Cancel" : "Back",onPress:() => {if (step === 1) setOpen(false);else setStep(1);}}}>
    {step === 1 ? <TextField label="New course title" value={name} onValueChange={setName} /> : <Stack gap={3}><Typography variant="h5">{name}</Typography><Typography>Review your title before creating this local draft.</Typography></Stack>}
  </AppModal>
</Stack>`})}>
    <AppButton onPress={() => {setStep(1);setOpen(true);}}>Start two-step flow</AppButton><Typography role="status">{saved}</Typography>
    <AppModal open={open} title="Create course" size="md" showCloseButton onClose={() => setOpen(false)} steps={{current:step,total:2,label:step === 1 ? '1 of 2: Course details' : '2 of 2: Review'}} primaryAction={{label:step === 1 ? 'Review' : 'Create locally',disabled:!name.trim(),onPress:() => {if (step === 1) setStep(2);else {setSaved('Created ' + name);setOpen(false);}}}} secondaryAction={{label:step === 1 ? 'Cancel' : 'Back',onPress:() => {if (step === 1) setOpen(false);else setStep(1);}}}>
      {step === 1 ? <TextField label="New course title" value={name} onValueChange={setName} /> : <Stack gap={3}><Typography variant="h5">{name}</Typography><Typography>Review your title before creating this local draft.</Typography></Stack>}
    </AppModal>
  </Example>;
}
function LongContentModalExample() {
  const source = useExampleSource();
  const [open, setOpen] = useState(false);
  const sections = Array.from({length:12}, (_,index) => `Module ${index + 1}: Practice, reflect, and apply the learning to a real situation.`);
  return <Example title="Scrollable content and custom footer" description="Long content uses bounded dialog height and an explicit host footer. Focus and dismissal remain owned by AppModal."
    source={source({name:'ScrollableModal',imports:modalImports,state:`  const [open, setOpen] = useState(${open});`,body:`<Stack gap={3}>
  <AppButton variant="outlined" onPress={() => setOpen(true)}>Open long course outline</AppButton>
  <AppModal open={open} title="Course outline" subtitle="12 practical modules" size="lg" heightMode="lg" showCloseButton onClose={() => setOpen(false)} footerContent={<AppButton variant="outlined" onPress={() => setOpen(false)}>Close outline</AppButton>}>
    <Stack gap={4}>${sections.map(text => `<Typography>{${literal(text)}}</Typography>`).join('\n')}</Stack>
  </AppModal>
</Stack>`})}>
    <AppButton variant="outlined" onPress={() => setOpen(true)}>Open long course outline</AppButton>
    <AppModal open={open} title="Course outline" subtitle="12 practical modules" size="lg" heightMode="lg" showCloseButton onClose={() => setOpen(false)} footerContent={<AppButton variant="outlined" onPress={() => setOpen(false)}>Close outline</AppButton>}><Stack gap={4}>{sections.map(text => <Typography key={text}>{text}</Typography>)}</Stack></AppModal>
  </Example>;
}
