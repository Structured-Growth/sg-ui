import {useState} from 'react';
import type {Meta, StoryObj} from '../../types';
import {Button, PageRichTextEditorSection} from '@structured-growth/sg-ui/components';
import {Stack, Typography} from '@structured-growth/sg-ui/primitives';
import {DataGrid, Dialog, Navigation, NavigationItem, TextField, ToggleButton} from '@structured-growth/sg-ui/experimental';
import {tokens} from '@structured-growth/sg-ui/tokens';

// Native review host only. No injected theme CSS or replacement component markup.
const meta = {title: 'Foundations/Visual acceptance', args: {longLabels: false}} satisfies Meta;
export default meta;
type Story = StoryObj;
const label = (long: boolean, short: string) => long ? `[!! ${short} — extended course administration label !!]` : short;
function Controls({long}: {long: boolean}) {
  return <Stack as="section" aria-label="Visual controls" gap={3}>
    <Button>{label(long, 'Save course')}</Button>
    <Button disabled>{label(long, 'Unavailable')}</Button>
    <Button loading>{label(long, 'Saving course')}</Button>
    <TextField label={label(long, 'Course name')} defaultValue="Introduction" />
    <TextField label={label(long, 'Invalid course name')} invalid errorMessage={label(long, 'Choose a unique course name')} />
    <ToggleButton defaultSelected>{label(long, 'Selected formatting')}</ToggleButton>
  </Stack>;
}
function Grids({long}: {long: boolean}) {
  const rows = [{id: '1', name: label(long, 'Algebra'), score: 89}, {id: '2', name: label(long, 'Geometry'), score: 74}];
  const columns = [{id: 'name', label: label(long, 'Course'), getValue: (row: typeof rows[number]) => row.name, hideable: false},
    {id: 'score', label: label(long, 'Score'), getValue: (row: typeof rows[number]) => row.score}];
  const props = {columns, getRowId: (row: typeof rows[number]) => row.id, getRowLabel: (row: typeof rows[number]) => row.name};
  return <Stack as="section" aria-label="Visual grids" gap={3}>
    <DataGrid {...props} label="Selected course grid" rows={rows} defaultState={{selectedIds:['1']}}
      renderActions={row => <Button variant="text" tone="neutral">{label(long, `Edit ${row.name}`)}</Button>} onRefresh={() => {}} />
    <DataGrid {...props} label="Loading course grid" rows={[]} loading />
    <DataGrid {...props} label="Empty course grid" rows={[]} />
    <DataGrid {...props} label="Failed course grid" rows={[]} errorMessage={label(long, 'Courses could not load')} onRefresh={() => {}} />
  </Stack>;
}
function NavigationSample({long}: {long: boolean}) {
  return <Stack as="section" aria-label="Visual navigation" gap={3}>
    <Navigation label="Course navigation">
      <NavigationItem current href="#overview">{label(long, 'Overview')}</NavigationItem>
      <NavigationItem href="#courses">{label(long, 'Courses')}</NavigationItem>
    </Navigation>
  </Stack>;
}
function Overlay({long}: {long: boolean}) {
  const [open, setOpen] = useState(false);
  return <Stack as="section" aria-label="Visual overlay" gap={3}>
    <Button onPress={() => setOpen(true)}>Open visual dialog</Button>
    <Dialog open={open} title={label(long, 'Course settings')} description={label(long, 'Review course details before saving')}
      onDismiss={() => setOpen(false)} footer={<Button onPress={() => setOpen(false)}>{label(long, 'Done')}</Button>}>
      <TextField autoFocus label={label(long, 'Dialog course name')} defaultValue="Algebra" />
      <TextField label={label(long, 'Invalid dialog field')} invalid errorMessage={label(long, 'This value is required')} />
      <Button loading>{label(long, 'Saving settings')}</Button>
    </Dialog>
  </Stack>;
}
function Editor({long}: {long: boolean}) {
  const [value, setValue] = useState<unknown>(null);
  return <Stack as="section" aria-label="Visual editor" gap={3}>
    <Typography as="h2" variant="h5">{label(long, 'Course content')}</Typography>
    <div style={{blockSize:'32rem', inlineSize:'100%'}}>
      <PageRichTextEditorSection editorKey="visual-acceptance" lexicalValue={value} onLexicalChange={setValue}
        aria-label="Visual course editor" toolPreset="full" />
    </div>
  </Stack>;
}
export const Matrix: Story = {render: args => <Stack gap={4} style={{background:tokens.surface, color:tokens.text}}>
  <Controls long={Boolean(args.longLabels)} /><Grids long={Boolean(args.longLabels)} />
  <NavigationSample long={Boolean(args.longLabels)} /><Editor long={Boolean(args.longLabels)} />
  <Overlay long={Boolean(args.longLabels)} />
</Stack>};
