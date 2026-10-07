import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { expect } from '@playwright/test';
import { packedBrowsers, staticConsumer } from './packed-browser.mjs';

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
    ...(reactVersion.startsWith('19.') ? { 'react-server-dom-webpack': reactVersion } : {}),
  },
}));
await writeFile(join(fixture, 'index.html'), '<!doctype html><html lang="en"><meta charset="utf-8"><title>SGUI packed foundation proof</title><div id="root"></div><script type="module" src="/main.jsx"></script></html>');
await writeFile(join(fixture, 'Proof.jsx'), `
import React from 'react';
import { Button, TextField, Dialog, Tabs, ComboBox, Popover, AsyncMultiSelect, DateRangeSelector } from '@structured-growth/sg-ui/experimental';
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
import { AppDataGrid } from '@structured-growth/sg-ui/components/AppDataGrid';
import { DataGridDragHandle } from '@structured-growth/sg-ui/components/AppDataGridRowDnd';
import { AppDataGridShell } from '@structured-growth/sg-ui/components/AppDataGridShell';
import { LearnerClassesDataGrid } from '@structured-growth/sg-ui/components/LearnerClassesDataGrid';
import { DataToolbar, DataToolbarSelectionMenu } from '@structured-growth/sg-ui/components/DataToolbar';
import { Provider } from '@structured-growth/sg-ui/theme';
import { tokens } from '@structured-growth/sg-ui/tokens';
import { AddIcon } from '@structured-growth/sg-ui/icons/AddIcon';
import { CircularProgress, LinearProgress, Autocomplete as PublicAutocomplete, Typography as PublicTypography } from '@structured-growth/sg-ui/primitives';
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
    <AppDataGrid label="Packed courses" rows={[{id:'one',name:'Science'}]} columns={[{field:'name',headerName:'Course'}]} getRowLabel={row=>row.name} rowDrag={{onReorder:()=>{}}} />
    <AppDataGridShell label="Packed shell" rows={[{id:'two',name:'Mathematics'}]} columns={[{field:'name',headerName:'Course'}]} getRowLabel={row=>row.name} view={{cards:{renderCard:row=><article>{row.name}</article>}}} />
    <LearnerClassesDataGrid rows={[]} />
    <DataGridDragHandle label="Packed reorder handle" />
    <PublicTypography as="h2" variant="bodyAlt2">Public primitives</PublicTypography>
    <CircularProgress aria-label="Packed circular loading" /><LinearProgress label="Packed upload" value={40} />
    <PublicAutocomplete label="Packed category" options={[{id:"science",label:"Science"}]} />
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
window.packedServerScope = document.querySelector('[data-sgui-scope]');
hydrateRoot(document.getElementById('root'), <Proof />, { onRecoverableError(error) { console.error(error); } });
`);
await writeFile(join(fixture, 'ssr.mjs'), `import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';
import { getActivityTypeIcon } from '@structured-growth/sg-ui/icons';
assert(renderToString(getActivityTypeIcon('lesson', {size:18})).includes('width="18"'), 'Packed public activity mapping failed SSR');
assert.equal(renderToString(getActivityTypeIcon('custom', {fallback:'Host icon'})), 'Host icon');
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
if (reactVersion.startsWith('19.')) {
  // Exercise Flight itself with React's server condition and the official directive loader.
  // Ordinary renderToString alone cannot prove a module is a Server Component.
  await writeFile(join(fixture, 'rsc.mjs'), `
import assert from 'node:assert/strict';
import React from 'react';
import { PassThrough } from 'node:stream';
import { renderToPipeableStream } from 'react-server-dom-webpack/server.node';
import { tokens } from '@structured-growth/sg-ui/tokens';
import { normalizePaginationModel } from '@structured-growth/sg-ui/hooks';
import { Box, Typography, Table, TableBody, TableRow, TableCell } from '@structured-growth/sg-ui/primitives';
import { ClassCardFrame } from '@structured-growth/sg-ui/components/ClassCardFrame';
import { AuthShell } from '@structured-growth/sg-ui/components/AuthShell';
import { AppShell } from '@structured-growth/sg-ui/components/AppShell';
import { AppButton } from '@structured-growth/sg-ui/components/AppButton';
import { Provider } from '@structured-growth/sg-ui/theme';
assert.equal(typeof window, 'undefined');
assert.equal(React.useState, undefined, 'Fixture must run the React server condition');
assert.deepEqual(normalizePaginationModel({ page: 2, pageSize: 37 }), { page: 2, pageSize: 37 });
for (const component of [Box, Typography, Table, ClassCardFrame, AuthShell, AppShell]) {
  assert.notEqual(component.$$typeof, Symbol.for('react.client.reference'), 'Presentation became a client reference');
}
for (const component of [AppButton, Provider]) {
  assert.equal(component.$$typeof, Symbol.for('react.client.reference'), 'Interaction lost its client boundary');
}
const manifest = {};
for (const [component, id] of [[AppButton, 'packed-app-button'], [Provider, 'packed-provider']]) {
  const module = component.$$id.slice(0, component.$$id.lastIndexOf('#'));
  manifest[module] = { id, chunks: [], name: '*' };
}
const el = React.createElement;
const tree = el(Provider, { theme: 'dark' },
  el(AppShell, { navigation: el('nav', null, 'Server navigation') },
    el(AuthShell, { title: 'Packed server shell' },
      el(ClassCardFrame, {
        header: el(Typography, { as: 'h2' }, 'Server course card'),
        body: el(Box, { padding: 2, style: { color: tokens.text } },
          el(Table, null, el(TableBody, null, el(TableRow, null, el(TableCell, null, 'Server table cell'))))),
        footer: el(AppButton, null, 'Client action'),
      }))));
const output = new PassThrough();
let flight = '';
const errors = [];
output.on('data', chunk => { flight += chunk; });
const done = new Promise((resolve, reject) => { output.on('end', resolve); output.on('error', reject); });
renderToPipeableStream(tree, manifest, { onError(error) { errors.push(error); } }).pipe(output);
await done;
assert.equal(errors.length, 0, errors.map(error => error.stack).join('\\n'));
for (const text of ['Server course card', 'Server table cell', 'class-card-frame', 'auth-shell', 'packed-app-button', 'packed-provider']) {
  assert(flight.includes(text), 'Flight lost ' + text);
}
console.log('Packed React Server Components Flight renders presentation and preserves interaction references.');
`);
  // Adapt Node module bytes and relative map URLs to the official loader's input contract.
  await writeFile(join(fixture, 'rsc-source-loader.mjs'), `export async function load(url, context, nextLoad) {
    const result = await nextLoad(url, context);
    if (result.format !== 'module' || result.source == null) return result;
    const source = typeof result.source === 'string' ? result.source : Buffer.from(result.source).toString('utf8');
    return { ...result, source: source.replace(/(sourceMappingURL=)([^\\s]+)/g, (_, prefix, map) => prefix + new URL(map, url).href) };
  }`);
  await writeFile(join(fixture, 'rsc-register.mjs'), `import { register } from 'node:module';
    register('./rsc-source-loader.mjs', import.meta.url);
    register('react-server-dom-webpack/node-loader', import.meta.url);
  `);
  execFileSync(process.execPath, ['--conditions=react-server', '--import', './rsc-register.mjs', 'rsc.mjs'], { cwd: fixture, stdio: 'pipe' });
  console.log('Packed React Server Components Flight proof passed.');
}
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
if (process.argv.includes('--browser')) {
  await staticConsumer(join(fixture, 'dist'), url => packedBrowsers(url, `vite-react-${reactVersion}`, async (page, hydrated) => {
    const scope = page.locator('[data-sgui-scope]').first();
    await expect(scope).toHaveAttribute('data-sgui-theme', 'dark');
    await expect(scope).toHaveAttribute('lang', 'en-US');
    await expect(page.getByRole('textbox', { name: 'Course name', exact: true })).toBeVisible();
    await expect(page.getByRole('grid', { name: 'Reporting dates, February 2024', exact: true })).toBeVisible();
    // The committed leap-day range is present in both server and hydrated markup.
    await expect(page.locator('[data-sgui-part="date-range-selector"]')).toContainText('February');
    const ids = await page.locator('[id]').evaluateAll(elements => elements.map(element => element.id));
    assert.equal(new Set(ids).size, ids.length, 'Duplicate accessible IDs');
    if (!hydrated) return;
    await page.getByRole('button', { name: 'Catalog settings', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Course settings' });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('tab', { name: 'Access', exact: true }).click();
    await expect(dialog.getByRole('tabpanel')).toContainText('Host settings');
    await dialog.getByRole('button', { name: 'Save settings', exact: true }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByRole('button', { name: 'Catalog settings', exact: true })).toBeFocused();
    await page.getByLabel('Packed data toolbar', { exact: true }).getByRole('button', { name: 'Refresh', exact: true }).click();
    await expect(page.getByRole('status', { exact: true }).filter({ hasText: 'Refreshed' })).toBeVisible();
    assert(await scope.evaluate(element => element === window.packedServerScope), 'Hydration replaced the server scope');
    // Accessibility references must resolve after hydration and portal cleanup.
    assert(await page.locator('[aria-labelledby], [aria-describedby]').evaluateAll(elements => elements.every(element =>
      ['aria-labelledby', 'aria-describedby'].every(attribute => (element.getAttribute(attribute) ?? '').split(/\s+/).filter(Boolean).every(id => document.getElementById(id))))), 'Dangling accessible ID reference');
  }));
}
