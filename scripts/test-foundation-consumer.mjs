import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const reactVersion = process.argv.includes('--react18') ? '18.3.1' : '19.2.3';
// A disposable production fixture. No publication and no source aliases.
const fixture = await mkdtemp(join(tmpdir(), 'sgui-foundation-consumer-'));
const pack = join(fixture, 'pack');
await mkdir(pack);
execFileSync('pnpm', ['pack', '--pack-destination', pack], { stdio: 'pipe' });
const tarball = (await readdir(pack)).find(name => name.endsWith('.tgz'));
assert(tarball, 'Pack did not produce a tarball');
await writeFile(join(fixture, 'package.json'), JSON.stringify({
  name: 'sgui-foundation-consumer', private: true, type: 'module', packageManager: 'pnpm@10.29.3',
  dependencies: {
    '@structured-growth/sg-ui': `file:${join(pack, tarball)}`,
    react: reactVersion, 'react-dom': reactVersion, vite: '7.3.1',
  },
}));
await writeFile(join(fixture, 'index.html'), '<!doctype html><html lang="en"><meta charset="utf-8"><title>SGUI packed foundation proof</title><div id="root"></div><script type="module" src="/main.jsx"></script></html>');
await writeFile(join(fixture, 'Proof.jsx'), `
import React from 'react';
import { Button, TextField, Provider, Dialog, Tabs, ComboBox, Popover, AsyncMultiSelect, DateRangeSelector } from '@structured-growth/sg-ui/experimental';
import { ToggleButtonGroup, Tooltip, Disclosure, Navigation, NavigationItem, List, ListItem,
  TagGroup, Progress, Status, Avatar, Table, TableCaption, TableHead, TableBody, TableRow,
  TableCell, TableHeaderCell, Pagination } from '@structured-growth/sg-ui/experimental';
import { AppInlineProgress } from '@structured-growth/sg-ui/components/AppInlineProgress';
import { AppOperationSteps } from '@structured-growth/sg-ui/components/AppOperationSteps';
import { EditableTitleField } from '@structured-growth/sg-ui/components/EditableTitleField';
import { AppPaginationFooter } from '@structured-growth/sg-ui/components/CardPaginationFooter';
import { CardCollectionWithFooter } from '@structured-growth/sg-ui/components/CardCollectionWithFooter';
import { ClassCardFrame } from '@structured-growth/sg-ui/components/ClassCardFrame';
import { InstructorClassCard } from '@structured-growth/sg-ui/components/InstructorClassCard';
import { LearnerClassCard } from '@structured-growth/sg-ui/components/LearnerClassCard';
import { AppButton } from '@structured-growth/sg-ui/components/AppButton';
import { ExperiencePageNavigator } from '@structured-growth/sg-ui/components/ExperiencePageNavigator';
import { AppPageTabs } from '@structured-growth/sg-ui/components/AppPageTabs';
import { AppPageHeader } from '@structured-growth/sg-ui/components/AppPageHeader';

import { AppModal } from '@structured-growth/sg-ui/components/AppModal';
import { AuthShell } from '@structured-growth/sg-ui/components/AuthShell';
import { AppShell } from '@structured-growth/sg-ui/components/AppShell';
import { SideNavigation } from '@structured-growth/sg-ui/components/SideNavigation';
import { ColumnsLayoutModal } from '@structured-growth/sg-ui/components/ColumnsLayoutModal';
import { ImageUploadModal } from '@structured-growth/sg-ui/components/ImageUploadModal';
import { LinkUrlModal } from '@structured-growth/sg-ui/components/LinkUrlModal';
import { InsertContentMenuControl } from '@structured-growth/sg-ui/components/InsertContentMenuControl';
import { TextAlignMenuControl } from '@structured-growth/sg-ui/components/TextAlignMenuControl';
import { TextColorPickerControl } from '@structured-growth/sg-ui/components/TextColorPickerControl';
import { TextStyleMenuControl } from '@structured-growth/sg-ui/components/TextStyleMenuControl';
import { RichTextFormattingToolbar } from '@structured-growth/sg-ui/components/RichTextFormattingToolbar';
import { DocumentEditorLayout } from '@structured-growth/sg-ui/components/DocumentEditorLayout';
import { DocumentEditorToolbar } from '@structured-growth/sg-ui/components/DocumentEditorToolbar';
import { ContentEditorChrome } from '@structured-growth/sg-ui/components/ContentEditorChrome';
import { DataToolbar, DataToolbarSelectionMenu } from '@structured-growth/sg-ui/components/DataToolbar';
import { tokens } from '@structured-growth/sg-ui/tokens';
import { AddIcon } from '@structured-growth/sg-ui/experimental/icons/AddIcon';
export function Proof() {
  const [open,setOpen]=React.useState(false);
  const [editorDialog,setEditorDialog]=React.useState(null);
  const [result,setResult]=React.useState('No editor changes');
  const [page,setPage]=React.useState('one');
  const [columns,setColumns]=React.useState([{id:'name',label:'Name',visible:true,locked:true},{id:'status',label:'Status',visible:true}]);
  const [sortRules,setSortRules]=React.useState([{field:'name',direction:'asc'}]);
  const [filterRules,setFilterRules]=React.useState([]);
  const [viewMode,setViewMode]=React.useState('cards');
  const [tab,setTab]=React.useState('details');
  const [gridPagination,setGridPagination]=React.useState({page:2,pageSize:10});
  const [paginationRequests,setPaginationRequests]=React.useState(0);
  return <Provider theme="dark" style={{background:tokens.surface,padding:tokens.space4}}>
    <DataToolbar aria-label="Packed data toolbar" onRefresh={()=>setResult('Refreshed')} columnOptions={columns} onColumnOptionsChange={setColumns}
      sortOptions={[{id:'name',label:'Name'},{id:'status',label:'Status'}]} sortRules={sortRules} onSortRulesChange={rules=>{setSortRules(rules);setResult(JSON.stringify(rules));}}
      filterFields={[{id:'name',label:'Name',type:'string'},{id:'status',label:'Status',type:'enum',enumOptions:[{id:'active',label:'Active'},{id:'paused',label:'Paused'}]}]}
      filterRules={filterRules} onFilterRulesChange={rules=>{setFilterRules(rules);setResult(JSON.stringify(rules));}}
      viewMode={viewMode} onViewModeChange={setViewMode} selectedCount={2}
      leftContent={<DataToolbarSelectionMenu options={[{id:'page',label:'Current page'},{id:'none',label:'Select none'}]} selectionState="some" onToggleSelection={()=>setResult('Toggle page')} onSelectOption={setResult} />} />
    <Button onPress={()=>setEditorDialog('columns')}>Choose columns</Button><Button onPress={()=>setEditorDialog('link')}>Edit link</Button><Button onPress={()=>setEditorDialog('image')}>Upload image</Button>
    <InsertContentMenuControl onInsertColumnsLayout={()=>setEditorDialog('columns')} onInsertImage={()=>setEditorDialog('image')} onInsertHorizontalRule={()=>setResult('Horizontal rule')} />
    <TextAlignMenuControl value="start" onChange={setResult} onIndent={()=>setResult('Indent')} onOutdent={()=>setResult('Outdent')} />
    <TextStyleMenuControl activeStyles={['highlight']} onHighlight={()=>setResult('Highlight')} onClearFormatting={()=>setResult('Clear formatting')} />
    <TextColorPickerControl value="#123456" onChange={setResult} />
    <RichTextFormattingToolbar aria-label="Packed formatting" headingValue="Normal" onHeadingChange={setResult} fontFamilyValue="Arial" onFontFamilyChange={setResult} boldActive="mixed" onBold={()=>setResult('Bold')} onItalic={()=>setResult('Italic')} onLink={()=>setResult('Toolbar link')} onTextColorChange={setResult} onInsertColumnsLayout={()=>setEditorDialog('columns')} />
    <ContentEditorChrome title="Packed document" icon={null} onTitleSave={setResult} menuItems={[{id:'file',label:'File',onPress:anchor=>setResult(anchor.textContent)}]} />
    <DocumentEditorLayout title="Packed layout" toolbar={<DocumentEditorToolbar canEdit headingValue="normal" onHeadingChange={setResult} onZoomIn={()=>setResult('Zoom in')} actions={{bold:{active:true,onClick:()=>setResult('Document Bold')},italic:{active:false,onClick:()=>setResult('Document Italic')},bulletList:{active:false},orderedList:{active:false}}} />}><p>Host content</p></DocumentEditorLayout>
    <p role="status">{result}</p>
    <ColumnsLayoutModal open={editorDialog==='columns'} onClose={()=>setEditorDialog(null)} onSubmit={preset=>{setResult(preset);setEditorDialog(null);}} />
    <LinkUrlModal open={editorDialog==='link'} initialDisplayText="Course guide" onClose={()=>setEditorDialog(null)} onSubmit={payload=>{setResult(JSON.stringify(payload));setEditorDialog(null);}} />
    <ImageUploadModal enableAltText open={editorDialog==='image'} onClose={()=>setEditorDialog(null)} onSubmit={(file,alt)=>{setResult(file.name+': '+alt);setEditorDialog(null);}} />
    <AppPageHeader title="Course workspace" hierarchy="primary" breadcrumbs={[{label:'Courses',href:'/courses'},{label:'Workspace'}]} moreMenuItems={[{label:'Refresh',onClick:()=>{}}]} />
    <AppPageTabs label="Workspace sections" value={tab} onChange={setTab} items={[{id:'details',label:'Details',content:'Course details'},{id:'access',label:'Access',content:'Course access'}]} />
    <AppButton onPress={()=>setOpen(true)} density="compact">Catalog settings</AppButton>
    <ExperiencePageNavigator pages={[{key:'one',title:'Introduction'},{key:'two',title:'Practice'}]} activePageKey={page} onSelectPage={setPage} onAddPage={()=>{}} onRemovePage={()=>{}} onRenamePage={()=>{}} onReorderPages={()=>{}} />
    <TextField label="Course name" name="course" required />
    <Button startIcon={<AddIcon />} onPress={()=>setOpen(true)}>Edit course</Button>
    <AsyncMultiSelect label="Courses" query="" onQueryChange={()=>{}} options={[{id:'one',label:'Science'}]} />
    <DateRangeSelector label="Reporting dates" defaultValue={{start:'2024-02-28',end:'2024-02-29'}} />
    <Navigation label="Course navigation"><List><ListItem><NavigationItem href="/courses" current>Courses</NavigationItem></ListItem></List></Navigation>
    <Disclosure label="Details"><TextField label="Details note" /></Disclosure>
    <ToggleButtonGroup label="View" options={[{id:'grid',label:'Grid'},{id:'cards',label:'Cards'}]} defaultSelectedIds={['grid']} />
    <Tooltip content="Refresh courses" trigger={<Button>Refresh</Button>} />
    <TagGroup label="Topics" items={[{id:'science',label:'Science'}]} />
    <Progress label="Uploading" value={40} /><Status>Saved</Status><Avatar alt="Course author" fallback="TH" />
    <Table><TableCaption>Course summary</TableCaption><TableHead><TableRow><TableHeaderCell>Name</TableHeaderCell></TableRow></TableHead>
      <TableBody><TableRow><TableCell>Science</TableCell></TableRow></TableBody></Table>
    <Pagination page={0} pageCount={3} onPageChange={()=>{}} />
    <AppInlineProgress value={40} /><AppOperationSteps title="Publishing" steps={[{id:'one',label:'Prepare',status:'completed'}]} />
    <EditableTitleField title="Course title" onSave={()=>{}} />
    <AppModal open={open} title="Course settings" size="md" heightMode="md" showCloseButton onClose={()=>setOpen(false)} primaryAction={{label:"Save settings",onPress:()=>setOpen(false)}}>
      <Tabs label="Settings" items={[{id:'details',label:'Details',content:<>
        <ComboBox label="Category" options={[{id:'science',label:'Science'}]} />
        <Popover title="Help" trigger={<Button>Help</Button>}><TextField label="Note" /></Popover>
      </>},{id:'access',label:'Access',content:'Host settings'}]} />
    </AppModal>
  <AppPaginationFooter label="Packed atomic pagination" page={gridPagination.page} pageSize={gridPagination.pageSize} pageSizeOptions={[10,25,250]} totalCount={67}
    onPageChange={()=>{}} onPageSizeChange={()=>{}} onPaginationModelChange={model=>{setGridPagination(model);setPaginationRequests(count=>count+1);}} />
  <output id="packed-pagination-result">{JSON.stringify(gridPagination)} requests:{paginationRequests}</output>
  <CardCollectionWithFooter rows={[{id:'one',label:'Science'}]} getRowId={row=>row.id} page={0} pageSize={4} pageSizeOptions={[4,8]} onPageChange={()=>{}} onPageSizeChange={()=>{}} renderCard={row=><ClassCardFrame header={row.label} body="Course details" />} />
  <InstructorClassCard className="Science" siteName="School" status="active" learnerCount={12} lastLearnerActivityLabel="Recent activity" actionLabel="Open Class" actionHref="/courses/science" />
  <LearnerClassCard courseName="Science" instructorName="Author" progressPercent={40} nextActivity="Read" dueAt="2026-10-10" referenceNow={new Date('2026-10-06T12:00:00Z')} detailsHref="/courses/science" />
<AuthShell title="Sign in"><TextField label="Host email" /></AuthShell>
<AppShell style={{height:300}} navigation={<SideNavigation model={{user:{initials:"AU",name:"Author",organization:"School"},rootMenu:{id:"root",sections:[{id:"courses",title:"Workspace",items:[{id:"courses",label:"Courses",href:"/courses"}]}]}}} />}><h1>Host workspace</h1></AppShell>
</Provider>;
}
`);
await writeFile(join(fixture, 'main.jsx'), `import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { Proof } from './Proof.jsx';
import '@structured-growth/sg-ui/styles.css';
hydrateRoot(document.getElementById('root'), <Proof />);
`);
await writeFile(join(fixture, 'ssr.mjs'), `import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';
assert.equal(typeof window, 'undefined'); assert.equal(typeof document, 'undefined');
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { Proof } = await server.ssrLoadModule('/Proof.jsx');
  const html = renderToString(React.createElement(Proof));
  assert(html.includes('Course name') && html.includes('Reporting dates'), 'SSR lost controls');
  await writeFile('index.html', '<!doctype html><html lang="en"><meta charset="utf-8"><title>SGUI packed React ${reactVersion} hydration proof</title><div id="root">' + html + '</div><script type="module" src="/main.jsx"></script></html>');
} finally { await server.close(); }
`);
await writeFile(join(fixture, '.npmrc'), 'auto-install-peers=false\n');
execFileSync('pnpm', ['--config.auto-install-peers=false', 'install', '--ignore-scripts'], {
  cwd: fixture, stdio: 'pipe', env: { ...process.env, npm_config_auto_install_peers: 'false' },
});
execFileSync(process.execPath, ['ssr.mjs'], { cwd: fixture, stdio: 'pipe' });
execFileSync('pnpm', ['exec', 'vite', 'build'], { cwd: fixture, stdio: 'pipe' });
const assets = join(fixture, 'dist/assets');
const files = await readdir(assets);
const cssFiles = files.filter(file => file.endsWith('.css'));
assert.equal(cssFiles.length, 1, 'Expected one deduplicated stylesheet');
const css = await readFile(join(assets, cssFiles[0]), 'utf8');
assert(css.includes('--sgui-action') && css.includes('sgui_root_'), 'Production build lost tokens or CSS Modules');
assert(css.includes('--sgui-overlay-layer') && css.includes('--sgui-popover-layer'), 'Production build lost overlay tokens');
const js = (await Promise.all(files.filter(file => file.endsWith('.js')).map(file => readFile(join(assets, file), 'utf8')))).join('\n');
assert(!/@mui|@emotion|lexical|MuiButton/.test(js), 'Basic proof pulled legacy/editor dependencies into consumer bundle');
assert(js.includes('chevron-down'), 'The fixture lost its selected dropdown vector');
assert(!js.includes('flask-conical') && !js.includes('graduation-cap') && !js.includes('user-round-cog'), 'The fixture bundled unused icon catalog vectors');
const installed = await readdir(join(fixture, 'node_modules/.pnpm'));
assert(!installed.some(name => /^@mui\+|^@emotion\+/.test(name)), 'Fixture unexpectedly installed retired peers');
console.log(`Packed React ${reactVersion} SSR/hydration consumer builds with production CSS: ${resolve(fixture)}`);
