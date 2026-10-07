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
  <AppDataGrid label="Courses" getRowLabel={row => row.name} rows={[{ id: 'one', name: 'Example' }]} columns={columns} />
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

import { AppButton as GranularAppButton } from '@structured-growth/sg-ui/components/AppButton';
import { AppPageTabs } from '@structured-growth/sg-ui/components/AppPageTabs';
import { AppPageHeader, type AppPageHeaderMenuItem } from '@structured-growth/sg-ui/components/AppPageHeader';
import { ExperiencePageNavigator } from '@structured-growth/sg-ui/components/ExperiencePageNavigator';
import { createRef } from 'react';
const catalogRef = createRef<HTMLButtonElement>();
const catalogMenu: AppPageHeaderMenuItem = { label: 'Edit', onClick: () => {} };
export const migratedPages = <Provider>
  <GranularAppButton ref={catalogRef} variant="filled" tone="neutral" density="compact" onPress={() => {}}>Save</GranularAppButton>
  <AppPageHeader title="Course" hierarchy="primary" moreMenuItems={[catalogMenu]} />
  <AppPageTabs value="details" onChange={() => {}} items={[{id:'details',label:'Details',content:'Details'}]} />
  <ExperiencePageNavigator pages={[{key:'one',title:'Introduction'}]} activePageKey="one" onSelectPage={() => {}} onAddPage={() => {}} onRemovePage={() => {}} onRenamePage={() => {}} onReorderPages={() => {}} />
</Provider>;
// @ts-expect-error Catalog action no longer accepts upstream styling objects.
export const retiredCatalogStyle = <GranularAppButton sx={{ color: 'red' }} />;
// @ts-expect-error Catalog action uses the event-free owned activation callback.
export const retiredCatalogClick = <GranularAppButton onClick={() => {}} />;
// @ts-expect-error Routed actions use Link, not a polymorphic button.
export const retiredCatalogLink = <GranularAppButton href="/courses" />;

import { AppModal as GranularAppModal, type AppModalCloseReason } from '@structured-growth/sg-ui/components/AppModal';
import { AuthShell } from '@structured-growth/sg-ui/components/AuthShell';
import { SideNavigation } from '@structured-growth/sg-ui/components/SideNavigation';
import { AppShell } from '@structured-growth/sg-ui/components/AppShell';
export const migratedShells = <Provider><AuthShell title="Sign in"><TextField label="Email" /></AuthShell>
<AppShell navigation={<SideNavigation model={{user:{initials:'AU',name:'Author',organization:'School'},rootMenu:{id:'root',sections:[]}}} />}><OwnedTypography as="h1">Courses</OwnedTypography></AppShell>
<GranularAppModal open={false} title="Settings" size="md" bodyStyle={{padding:0}} onClose={reason=>{const owned: AppModalCloseReason=reason;console.log(owned);}}
primaryAction={{label:'Save',onPress:()=>{},variant:'filled',tone:'primary'}}>Content</GranularAppModal></Provider>;
// @ts-expect-error Modal styles are native rather than upstream styling callbacks.
export const retiredModalStyles = <GranularAppModal open={false} paperSx={{padding:0}}>Content</GranularAppModal>;
// @ts-expect-error Modal actions use owned normalized activation.
export const retiredModalAction = <GranularAppModal open={false} primaryAction={{label:'Save',onClick:()=>{}}}>Content</GranularAppModal>;

import { ColumnsLayoutModal } from '@structured-growth/sg-ui/components/ColumnsLayoutModal';
import { ImageUploadModal } from '@structured-growth/sg-ui/components/ImageUploadModal';
import { LinkUrlModal } from '@structured-growth/sg-ui/components/LinkUrlModal';
export const editorDialogs = <Provider>
<ColumnsLayoutModal open={false} defaultPreset="three255025" onClose={()=>{}} onSubmit={preset=>{const value: import('@structured-growth/sg-ui/components/ColumnsLayoutModal').ColumnsLayoutPreset = preset; console.log(value);}} />
<LinkUrlModal open={false} allowedProtocols={["https"]} allowRelativeUrls={false} onClose={()=>{}} onSubmit={payload=>{const url: string|null=payload.url; console.log(url);}} />
<ImageUploadModal enableAltText open={false} onClose={()=>{}} onSubmit={(file,alt)=>{const native: File=file;const text: string|undefined=alt;console.log(native,text);}} />
</Provider>;

import { InsertContentMenuControl } from '@structured-growth/sg-ui/components/InsertContentMenuControl';
import { TextAlignMenuControl } from '@structured-growth/sg-ui/components/TextAlignMenuControl';
import { TextColorPickerControl } from '@structured-growth/sg-ui/components/TextColorPickerControl';
import { TextStyleMenuControl } from '@structured-growth/sg-ui/components/TextStyleMenuControl';
export const editorMenus = <Provider><InsertContentMenuControl onInsertImage={()=>{}} /><TextAlignMenuControl value="end" onChange={value=>{const next: import('@structured-growth/sg-ui/components/TextAlignMenuControl').AlignOption=value; console.log(next);}} /><TextStyleMenuControl activeStyles={['highlight']} onHighlight={()=>{}} /><TextColorPickerControl value="#123456" onChange={()=>{}} /></Provider>;

import { RichTextFormattingToolbar } from '@structured-growth/sg-ui/components/RichTextFormattingToolbar';
export const ownedFormatting = <RichTextFormattingToolbar ref={createRef<HTMLDivElement>()} boldActive="mixed" activeTextStyles={['highlight']} canIndent={false} style={{marginInline:2}} onHeadingChange={value=>{const heading: import('@structured-growth/sg-ui/components/RichTextFormattingToolbar').RichTextHeadingValue=value; console.log(heading);}} />;

import { DocumentEditorLayout } from '@structured-growth/sg-ui/components/DocumentEditorLayout';
import { DocumentEditorToolbar } from '@structured-growth/sg-ui/components/DocumentEditorToolbar';
import { ContentEditorChrome } from '@structured-growth/sg-ui/components/ContentEditorChrome';
import { FloatingTextSelectionToolbar } from '@structured-growth/sg-ui/components/FloatingTextSelectionToolbar';
export const ownedEditorLayout = <DocumentEditorLayout ref={createRef<HTMLDivElement>()} title="Document" style={{height:400}}><p>Content</p></DocumentEditorLayout>;
export const ownedDocumentToolbar = <DocumentEditorToolbar ref={createRef<HTMLDivElement>()} canEdit headingValue="h2" onHeadingChange={value=>{const heading: 'normal'|'h1'|'h2'|'h3'|'h4'|'h5'=value; console.log(heading);}} actions={{bold:{active:true},italic:{active:false},bulletList:{active:false},orderedList:{active:false}}} />;
export const ownedChrome = <ContentEditorChrome ref={createRef<HTMLDivElement>()} icon={null} title="Document" onTitleSave={()=>{}} menuItems={[{id:'file',label:'File',onPress:anchor=>{const element:HTMLButtonElement=anchor; console.log(element);},'aria-haspopup':'menu',loading:false}]} />;
export const ownedFloating = <FloatingTextSelectionToolbar ref={createRef<HTMLDivElement>()} className="host" style={{margin:2}} onRequestLink={()=>{}} />;

import { PageRichTextEditorSection as OwnedPageEditor, type PageRichTextEditorSectionProps } from "@structured-growth/sg-ui/components/PageRichTextEditorSection";
const ownedPageProps: PageRichTextEditorSectionProps = {lexicalValue:null,editorKey:"owned",onLexicalChange:()=>{},"aria-label":"Course content",className:"host-editor",style:{height:400}};
export const ownedPageEditor = <Provider><OwnedPageEditor {...ownedPageProps} /></Provider>;

import { DataToolbar as OwnedDataToolbar, type DataToolbarProps } from "@structured-growth/sg-ui/components/DataToolbar";
const ownedToolbarProps: DataToolbarProps = {searchValue:"course",onSearchValueChange:()=>{},viewMode:"list",onViewModeChange:()=>{},selectedCount:2,className:"host-toolbar",style:{maxWidth:600}};
export const ownedDataToolbar = <Provider><OwnedDataToolbar {...ownedToolbarProps} /></Provider>;

// @ts-expect-error Retired sort model is not an owned grid prop.
export const retiredGridSort = <AppDataGrid label="Courses" rows={[]} columns={[]} getRowLabel={() => ""} sortModel={[]} />;

import { CircularProgress, LinearProgress, Autocomplete as PublicAutocomplete, Menu as PublicMenu, Button as PublicButton, Checkbox as PublicCheckbox, Link as PublicLink, Table as PublicTable, TableHead as PublicTableHead, TableHeaderCell as PublicTableHeaderCell, TableRow as PublicTableRow } from '@structured-growth/sg-ui/primitives';
import { AddIcon as PublicAddIcon } from '@structured-growth/sg-ui/icons/AddIcon';
import { getActivityTypeIcon as PublicActivityIcon, type IconProps as PublicIconProps } from '@structured-growth/sg-ui/icons';
export const publicIconProps: PublicIconProps = {size:20,label:'Add'};
export const publicPrimitiveProof = <Provider><PublicAutocomplete label="Category" options={[{id:'science',label:'Science'}]} />
<PublicCheckbox label="Publish" /><CircularProgress aria-label="Loading" ref={createRef<HTMLDivElement>()} />
<LinearProgress label="Upload" value={40} /><PublicLink href="/courses">Courses</PublicLink>
<PublicMenu label="Actions" trigger={<PublicButton>Actions</PublicButton>} items={[{id:'edit',label:'Edit'}]} />
<PublicTable><PublicTableHead><PublicTableRow><PublicTableHeaderCell>Course</PublicTableHeaderCell></PublicTableRow></PublicTableHead></PublicTable>
<PublicAddIcon ref={createRef<SVGSVGElement>()} label="Add course" />{PublicActivityIcon('lesson',{size:18})}</Provider>;
// @ts-expect-error Public circular progress requires an accessible name.
export const unnamedPublicProgress = <CircularProgress />;
// @ts-expect-error Public primitive fields exclude retired style props.
export const retiredPublicField = <PublicAutocomplete label="Category" options={[]} sx={{padding:2}} />;
import { MenuItem as RetiredMenuItem } from '@structured-growth/sg-ui/primitives';
// @ts-expect-error Public menu takes owned item records, no item component remains.
export const retiredMenuItem = <RetiredMenuItem />;
// @ts-expect-error Public links use the owned name.
import { MuiLink } from '@structured-growth/sg-ui/primitives';
// @ts-expect-error Checkbox owns its label; external engine label wrapper is removed.
import { FormControlLabel } from '@structured-growth/sg-ui/primitives';
// @ts-expect-error Selection callbacks expose values, not engine events.
import type { SelectChangeEvent } from '@structured-growth/sg-ui/primitives';
// @ts-expect-error Public icons expose owned sizing.
export const retiredIconSize = <PublicAddIcon fontSize="small" />;
// @ts-expect-error Activity helper uses owned options instead of positional engine font size.
export const retiredActivitySize = PublicActivityIcon('lesson','small');
