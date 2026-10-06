// This fixture typechecks only against built package entry points.
import { AppButton, AppModal, AppDataGrid, PageRichTextEditorSection } from '@structured-growth/sg-ui';
import { Typography } from '@structured-growth/sg-ui/primitives';
import { darkTheme } from '@structured-growth/sg-ui/theme';
import { SGNavigationProvider } from '@structured-growth/sg-ui/adapters';
import type { AppDataGridColumn } from '@structured-growth/sg-ui/components';
import { Button, TextField, ThemeScope, Provider, Dialog, Tabs, ComboBox, Popover, AsyncMultiSelect, DateRangeSelector } from '@structured-growth/sg-ui/experimental';
import { tokens } from '@structured-growth/sg-ui/tokens';
import { DataGrid, DateField, TimeField, Checkbox } from '@structured-growth/sg-ui/experimental';
import { AddIcon } from '@structured-growth/sg-ui/experimental/icons/AddIcon';
import type { IconProps } from '@structured-growth/sg-ui/experimental/icons';
import { Typography as OwnedTypography, Box, Stack, Surface, Card, CardContent, Divider,
  IconButton, Menu, SplitAction, Switch, RadioGroup, Select, TextArea, Link, Breadcrumbs } from '@structured-growth/sg-ui/experimental';
import { ToggleButton, ToggleButtonGroup, Tooltip, List, ListItem, Navigation, NavigationItem, Disclosure,
  Chip, Badge, TagGroup, Progress, Status, Avatar, Table, TableCaption, TableHead, TableBody,
  TableRow, TableCell, TableHeaderCell, Pagination } from '@structured-growth/sg-ui/experimental';
import { AppInlineProgress } from '@structured-growth/sg-ui/components/AppInlineProgress';
import { AppOperationSteps } from '@structured-growth/sg-ui/components/AppOperationSteps';
import { EditableTitleField } from '@structured-growth/sg-ui/components/EditableTitleField';
import { AppPaginationFooter } from '@structured-growth/sg-ui/components/CardPaginationFooter';
import { CardCollectionWithFooter } from '@structured-growth/sg-ui/components/CardCollectionWithFooter';
import { ClassCardFrame } from '@structured-growth/sg-ui/components/ClassCardFrame';
import { InstructorClassCard } from '@structured-growth/sg-ui/components/InstructorClassCard';
import { LearnerClassCard } from '@structured-growth/sg-ui/components/LearnerClassCard';

export const remainingControls = <Provider><Navigation label="Course navigation"><List><ListItem>
  <NavigationItem href="/courses" current>Courses</NavigationItem>
</ListItem></List></Navigation><Disclosure label="Course details"><TextField label="Note" /></Disclosure>
  <Chip>Draft</Chip><Badge content={3} /><TagGroup label="Topics" items={[{id:'science',label:'Science'}]} onRemove={ids => console.log(ids)} />
  <Progress label="Uploading" value={40} /><Status>Saved</Status><Avatar alt="Course author" fallback="TH" />
  <ToggleButton onSelectedChange={selected => console.log(selected)}>Bold</ToggleButton>
  <ToggleButtonGroup label="View" options={[{id:'grid',label:'Grid'}]} onSelectionChange={ids => console.log(ids)} />
  <Tooltip content="Refresh courses" trigger={<Button>Refresh</Button>} />
  <Table><TableCaption>Courses</TableCaption><TableHead><TableRow><TableHeaderCell>Name</TableHeaderCell></TableRow></TableHead>
    <TableBody><TableRow><TableCell>Science</TableCell></TableRow></TableBody></Table>
  <Pagination page={0} pageCount={3} onPageChange={page => console.log(page)} />
  <AppInlineProgress value={40} /><AppOperationSteps steps={[{id:'upload',label:'Upload',status:'in_progress'}]} />
  <EditableTitleField title="Course" onSave={async title => {console.log(title);}} />
<AppPaginationFooter page={0} pageSize={4} pageSizeOptions={[4,8]} totalCount={12} onPageChange={()=>{}} onPageSizeChange={()=>{}} />
  <CardCollectionWithFooter rows={[{id:'one',label:'Science'}]} getRowId={row=>row.id} page={0} pageSize={4} pageSizeOptions={[4,8]} onPageChange={()=>{}} onPageSizeChange={()=>{}} renderCard={row=><ClassCardFrame header={row.label} body="Course details" />} />
  <InstructorClassCard className="Science" siteName="School" status="active" learnerCount={12} lastLearnerActivityLabel="Recent activity" actionLabel="Open Class" actionHref="/courses/science" />
  <LearnerClassCard courseName="Science" instructorName="Author" progressPercent={40} nextActivity="Read" dueAt="2026-10-10" referenceNow={new Date('2026-10-06T12:00:00Z')} detailsHref="/courses/science" />
</Provider>;
// @ts-expect-error Progress requires a host-provided accessible name.
export const unnamedProgress = <Progress value={40} />;
// @ts-expect-error Group selection exposes owned string IDs rather than engine keys.
export const upstreamToggleGroup = <ToggleButtonGroup label="View" options={[]} selectedKeys={new Set()} />;
export const ownedPresentation = <Box as="main" container><Stack direction="row" responsive gap={4}><Surface tone="subtle">
  <Card><CardContent><OwnedTypography as="h2" variant="h1">Course</OwnedTypography><Divider /></CardContent></Card>
</Surface></Stack></Box>;
export const ownedActions = <><IconButton label="Add course" onPress={() => {}}><AddIcon /></IconButton>
  <Menu label="Actions" trigger={<Button>Actions</Button>} items={[{ id: 'edit', label: 'Edit' }]} onAction={id => console.log(id)} />
  <SplitAction label="Create" items={[]} onPress={() => {}} onAction={() => {}} /></>;
export const ownedChoices = <><Switch label="Notify" onCheckedChange={checked => console.log(checked)} />
  <RadioGroup label="Format" options={[{ value: 'self', label: 'Self paced' }]} />
  <Select label="Status" options={[{ id: 'draft', label: 'Draft' }]} />
  <TextArea aria-label="Summary" rows={5} onValueChange={value => console.log(value)} />
  <Link href="/courses">Courses</Link><Breadcrumbs items={[{ id: 'course', label: 'Course' }]} /></>;
// @ts-expect-error Icon actions require a consumer-provided accessible name.
export const unnamedIconAction = <IconButton><AddIcon /></IconButton>;
// @ts-expect-error Multiline fields preserve the mandatory accessible name contract.
export const unnamedMultilineField = <TextArea />;
const columns: AppDataGridColumn<{ id: string; name: string }>[] = [{ field: 'name', headerName: 'Name', cellType: 'text' }];
export const example = <SGNavigationProvider value={{ pathname: '/', navigate: () => {} }}>
  <AppButton>Save</AppButton>
  <Typography variant="bodyAlt2">Custom typography</Typography>
  <AppModal open={false} title="Example" onClose={() => {}}>Content</AppModal>
  <AppDataGrid rows={[{ id: 'one', name: 'Example' }]} columns={columns} />
  <PageRichTextEditorSection lexicalValue={null} editorKey="example" onLexicalChange={() => {}} />
</SGNavigationProvider>;
export const theme = darkTheme;
export const iconProof = <AddIcon label="Add course" size={20} strokeWidth={1.5} />;
export const iconProps: IconProps = { size: '1em', color: 'currentColor' };
export const gridProof = <DataGrid label="Courses" rows={[{ id: 'one', name: 'Science' }]}
  columns={[{ id: 'name', label: 'Name', getValue: row => row.name }]} getRowId={row => row.id} getRowLabel={row => row.name}
  onStateChange={state => console.log(state.selectedIds, state.sort)} />;
export const dateFieldsProof = <><DateField label="Starts" kind="datetime" defaultValue="2024-11-03T01:30:00" />
  <TimeField label="Local time" defaultValue="09:30:00" /><Checkbox label="Available" mixed /></>;
export const asyncProof = <AsyncMultiSelect label="Courses" query="" onQueryChange={query => console.log(query)}
  options={[{ id: 'one', label: 'Science' }]} onValueChange={records => console.log(records.map(record => record.id))} />;
export const dateProof = <DateRangeSelector label="Dates" defaultValue={{ start: '2024-02-28', end: '2024-02-29' }}
  onValueChange={range => console.log(range?.start, range?.end)} />;
export const foundationProof = <ThemeScope theme="dark" density="compact">
  <TextField label="Course name" name="course" onValueChange={value => console.log(value)} />
  <Button onPress={() => {}} style={{ color: tokens.text }}>Save</Button>
</ThemeScope>;
// @ts-expect-error An accessible name is mandatory for a field.
export const unnamedField = <TextField />;
// @ts-expect-error The owned contract deliberately excludes upstream styling props.
export const upstreamButton = <Button sx={{ color: 'red' }} />;
export const dialogProof = <Provider theme="dark"><Dialog open={false} title="Course" onDismiss={reason => {
  const owned: 'escape' | 'outside' | 'close-button' | 'dismiss' = reason;
  console.log(owned);
}}><Tabs label="Settings" items={[{id:'details',label:'Details',content:<>
  <ComboBox label="Category" options={[{id:'science',label:'Science'}]} onValueChange={value => console.log(value)} />
  <Popover title="Help" trigger={<Button>Help</Button>}><TextField label="Note" /></Popover>
</>}]} /></Dialog></Provider>;
