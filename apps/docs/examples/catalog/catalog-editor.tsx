'use client';
import {SavedDocumentExample,HostImageUploadExample} from '../SavedDocumentExamples';
import {editorSampleText,sampleEditorDocument as documentValue} from '../editor-sample-document';
import {LongAuthFormExample,HeaderActionsExample} from '../ShellContentExamples';
import { useState, useRef, type ReactNode } from 'react';
import {
  AuthShell, AppShell, AppPageHeader, AppPageTabs, ExperiencePageNavigator, SideNavigation,
  EditableTitleField, DocumentEditorLayout, DocumentEditorToolbar, ContentEditorChrome,
  FloatingTextSelectionToolbar, RichTextFormattingToolbar, InsertContentMenuControl, TextAlignMenuControl, TextColorPickerControl,
  TextStyleMenuControl, ColumnsLayoutModal, LinkUrlModal, ImageUploadModal, PageRichTextEditorSection,
  Button, type SideNavigationModel, type ColumnsLayoutPreset, type AlignOption, type TextStyleId,
} from '@structured-growth/sg-ui/components';
import { DashboardIcon,MenuBookIcon,EditIcon,TuneIcon,PeopleIcon,DescriptionOutlinedIcon,TerminalIcon } from '@structured-growth/sg-ui/icons';
import { Stack, Typography } from '@structured-growth/sg-ui/primitives';
import { TextField, Select, Checkbox, Surface } from '@structured-growth/sg-ui/experimental';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ThemeScope } from '@structured-growth/sg-ui/theme';
import { SGNavigationProvider, SGAccountProvider, SGLink, SGTranslationProvider, useAccountAdapter, useTranslation, formatIcuMessage, type StoredAuthSession, type SGAccountAdapter, type SGTranslationAdapter } from '@structured-growth/sg-ui';
import { Example } from '../../components/Example';
import { IconPanelNavigationExamples, AppShellIconNavigationExamples } from '../IconPanelNavigationExamples';
import { AppShellScrollingExample } from '../AppShellScrollingExample';
import { useExampleSource } from '../useExampleSource';
import { literal } from '../source';
import type { CatalogEntry } from '../../content/catalog-types';

const navigationIcons={dashboard:DashboardIcon,course:MenuBookIcon,edit:EditIcon,settings:TuneIcon,people:PeopleIcon,resources:DescriptionOutlinedIcon,terminal:TerminalIcon};
function resolveNavigationIcon(key:string) { const Icon=navigationIcons[key as keyof typeof navigationIcons];return Icon?<Icon/>:null; }

type Kind = 'AuthShell' | 'AppShell' | 'AppPageHeader' | 'AppPageTabs' | 'ExperiencePageNavigator' | 'SideNavigation' | 'EditableTitleField' | 'DocumentEditorLayout' | 'DocumentEditorToolbar' | 'ContentEditorChrome' | 'FloatingTextSelectionToolbar' | 'RichTextFormattingToolbar' | 'InsertContentMenuControl' | 'TextAlignMenuControl' | 'TextColorPickerControl' | 'TextStyleMenuControl' | 'ColumnsLayoutModal' | 'LinkUrlModal' | 'ImageUploadModal' | 'PageRichTextEditorSection';
const choices: Record<Kind, string[]> = {
  AuthShell:['Welcome back','Create your account','Reset your password'], AppShell:['Course workspace','Organization workspace'],
  AppPageHeader:['primary','subpage'], AppPageTabs:['automatic','manual'], ExperiencePageNavigator:['Course outline','Lesson sequence'], SideNavigation:['Mixed menu'],
  EditableTitleField:['h4','h5','h6'], DocumentEditorLayout:['Full chrome','Minimal chrome'], DocumentEditorToolbar:['All controls','Formatting only'],
  ContentEditorChrome:['Save and preview','Export only'], FloatingTextSelectionToolbar:['Narrow boundary','Wide boundary'], RichTextFormattingToolbar:['Full toolbar','Essential formatting'],
  InsertContentMenuControl:['All insertions','Rule only'], TextAlignMenuControl:['left','center','right','justify','start','end'], TextColorPickerControl:['foreground','background'],
  TextStyleMenuControl:['All styles','Case conversion only'], ColumnsLayoutModal:['twoEqual','two2575','threeEqual','three255025','fourEqual'],
  LinkUrlModal:['All safe protocols','HTTPS only'], ImageUploadModal:['Success','Simulated failure'], PageRichTextEditorSection:['base','full'],
};
const descriptions: Record<Kind,string> = {
  AuthShell:'A presentation shell for host-owned authentication forms, without account APIs.', AppShell:'Independent navigation and main content regions for application compositions.',
  AppPageHeader:'Hierarchy, breadcrumbs, metadata and host-owned actions.', AppPageTabs:'Controlled panels with automatic or manual keyboard activation.', ExperiencePageNavigator:'Host-owned page selection, rename, reorder, creation and removal.',
  SideNavigation:'One menu combining direct destinations, inline expansion, nested drilldown and footer actions. Each branch chooses its own behavior.', EditableTitleField:'Inline title editing with save/cancel and read-only presentation.',
  DocumentEditorLayout:'Compose document title, actions and toolbar around host-owned content.', DocumentEditorToolbar:'Controlled heading, formatting and zoom state with explicit command availability.',
  ContentEditorChrome:'An editable document title with anchor-aware menu commands.', FloatingTextSelectionToolbar:'Select text in the integrated Lexical editor; Alt+F10 focuses its floating formatting actions.',
  RichTextFormattingToolbar:'Host-controlled formatting commands, checked states and optional control groups.', InsertContentMenuControl:'Insertion commands request host-owned changes rather than saving content themselves.',
  TextAlignMenuControl:'Physical and logical alignment with host-controlled indent bounds.', TextColorPickerControl:'Semantic colors and custom hex values, with separate foreground/background modes.',
  TextStyleMenuControl:'Case conversion and checked formatting state with explicit host callbacks.', ColumnsLayoutModal:'A fresh layout draft on opening with a host-owned insertion result.',
  LinkUrlModal:'Editable link text and protocol policy, including relative URLs and removing links.', ImageUploadModal:'Picker/drop presentation, optional descriptions, retryable errors and host-owned upload.',
  PageRichTextEditorSection:'A controlled rich-document editor with formatting, insertion and read-only presentation.',
};


/** The fixture and its source share current state; commands deliberately update host-owned presentation. */
function EditorExample({kind, section, initialChoice, initialReadOnly = false, initialDensity = 'comfortable', playground = false, previewWidth, routeTabs = false, initialContent, initialLink, initialRightNavigation = false}:{kind:Kind;section:string;initialChoice:string;initialReadOnly?:boolean;initialDensity?:'compact'|'comfortable';playground?:boolean;previewWidth?:number;routeTabs?:boolean;initialContent?:string;initialLink?:{displayText:string;url:string};initialRightNavigation?:boolean}) {
  const source = useExampleSource();
  const [label,setLabel] = useState(initialContent??(section==='Compact configuration'?'Quick start':section==='Alternate content and restricted actions'?'A longer course title that demonstrates wrapping, constrained widths, and clear presentation when actions are unavailable.':'Building a thoughtful learning experience'));
  const [choice,setChoice] = useState(initialChoice);
  const [showRightNavigation,setShowRightNavigation] = useState(initialRightNavigation);
  const [readOnly,setReadOnly] = useState(initialReadOnly);
  const [density,setDensity] = useState<'compact'|'comfortable'>(initialDensity);
  const [title,setTitle] = useState(initialReadOnly?'Archived course introduction':'Course introduction');
  const [status,setStatus] = useState('Ready');
  const [open,setOpen] = useState(false);
  const [value,setValue] = useState(routeTabs?'/courses/overview':'overview');
  const [navigationPath,setNavigationPath] = useState('/workspace/overview');
  const [pages,setPages] = useState([{key:'overview',title:'Overview'},{key:'practice',title:'Practice'},{key:'reflection',title:'Reflection'}]);
  const [bold,setBold] = useState(false); const [italic,setItalic] = useState(false); const [underline,setUnderline] = useState(false);
  const [bullet,setBullet] = useState(false); const [ordered,setOrdered] = useState(false);
  const [heading,setHeading] = useState<'normal'|'h1'|'h2'|'h3'|'h4'|'h5'>('normal');
  const [richHeading,setRichHeading] = useState<NonNullable<React.ComponentProps<typeof RichTextFormattingToolbar>['headingValue']>>('Normal');
  const [zoom,setZoom] = useState(100); const [alignment,setAlignment] = useState<AlignOption>(kind==='TextAlignMenuControl'?initialChoice as AlignOption:'left'); const [indent,setIndent] = useState(0);
  const [color,setColor] = useState(kind==='TextColorPickerControl'&&initialChoice==='background'?'var(--sgui-surface)':'var(--sgui-text)'); const [activeStyles,setActiveStyles] = useState<TextStyleId[]>([]);
  const [text,setText] = useState(kind==='FloatingTextSelectionToolbar'?editorSampleText:'Style this host-controlled sentence.');
  const [link,setLink] = useState(initialLink??{displayText:'Read the course guide',url:'https://example.com/guide'});
  const [preset,setPreset] = useState<ColumnsLayoutPreset>('twoEqual');
  const [lexical,setLexical] = useState<unknown>(() => documentValue());
  const report = (message:string) => setStatus(message);
  const toggleStyle = (style:TextStyleId) => setActiveStyles(items => items.includes(style) ? items.filter(item => item!==style) : [...items,style]);
  const navigationModel:SideNavigationModel = kind==='SideNavigation'?{
    user:{initials:'AL',name:label,organization:'Structured Growth'},
    rootMenu:{id:'mixed-workspace',sections:[{id:'workspace',title:'Workspace',items:[
      {id:'overview',icon:'dashboard',label:'Overview',href:'/workspace/overview'},
      {id:'course-tools',icon:'course',label:'Course tools',childBehavior:'expand',defaultExpanded:true,children:[
        {id:'practice',icon:'edit',label:'Practice'},
        {id:'reflection',icon:'edit',label:'Reflection'},
        {id:'course-settings',icon:'settings',label:'Course settings',childBehavior:'drilldown',children:[
          {id:'general',icon:'settings',label:'General settings'},
          {id:'notifications',icon:'settings',label:'Notifications',childBehavior:'expand',defaultExpanded:true,children:[
            {id:'announcements',icon:'resources',label:'Announcements'},
            {id:'reminders',icon:'resources',label:'Reminders'},
          ]},
          {id:'advanced',icon:'settings',label:'Advanced settings',childBehavior:'drilldown',children:[
            {id:'completion',icon:'settings',label:'Completion rules'},
            {id:'availability',icon:'settings',label:'Availability'},
          ]},
        ]},
      ]},
      {id:'organization',icon:'people',label:'Organization',childBehavior:'drilldown',children:[
        {id:'people',icon:'people',label:'People',href:'/workspace/people'},
        {id:'teams',icon:'people',label:'Teams',childBehavior:'expand',children:[
          {id:'instructors',icon:'people',label:'Instructors'},
          {id:'learners',icon:'people',label:'Learners'},
        ]},
      ]},
    ]}],footerSections:[{id:'help',title:'Help & support',items:[
      {id:'resources',icon:'resources',label:'Resources',childBehavior:'expand',children:[
        {id:'guide',icon:'resources',label:'Workspace guide'},
        {id:'shortcuts',icon:'terminal',label:'Keyboard shortcuts'},
      ]},
      {id:'support',icon:'people',label:'Contact support'},
    ]}]},
  }:{user:{initials:'AL',name:label,organization:'Structured Growth'},rootMenu:{id:'demo',sections:[{id:'workspace',title:'Workspace',items:[{id:'overview',label:'Overview',active:value==='overview'},{id:'course',label:'Course tools',childBehavior:'expand',defaultExpanded:true,children:[{id:'practice',label:'Practice'},{id:'reflection',label:'Reflection'}]}]}]}};
  const actions = {bold:{active:bold,onClick:()=>setBold(!bold)},italic:{active:italic,onClick:()=>setItalic(!italic)},bulletList:{active:bullet,onClick:()=>setBullet(!bullet)},orderedList:{active:ordered,onClick:()=>setOrdered(!ordered)}};
  let preview:ReactNode; let body=''; let imports:string[]=[]; let state='';
  const componentImport = (names:string) => `import { ${names} } from '@structured-growth/sg-ui/components';`;
  const primitiveImport = `import { Stack, Typography } from '@structured-growth/sg-ui/primitives';`;
  const experimentalImport = `import { TextField, Surface } from '@structured-growth/sg-ui/experimental';`;
  const L=literal(label), R=String(readOnly), C=literal(choice);
  switch(kind) {
    case 'AuthShell': {
      preview=<AuthShell title={choice} subtitle={label} footerContent={<Typography variant="caption">The host owns accounts and session handling.</Typography>}><Stack gap={3}><TextField label="Email address" value={text} onValueChange={setText} readOnly={readOnly}/><Button disabled={readOnly} onPress={()=>report(`Continue requested for ${text}`)}>Continue</Button><Typography role="status">{status}</Typography></Stack></AuthShell>;
      body=`<AuthShell title={${C}} subtitle={${L}} footerContent={<Typography variant="caption">The host owns accounts and session handling.</Typography>}><Stack gap={3}><TextField label="Email address" value={text} onValueChange={setText} readOnly={${R}} /><Button disabled={${R}} onPress={() => setStatus('Continue requested for ' + text)}>Continue</Button><Typography role="status">{status}</Typography></Stack></AuthShell>`;
      imports=[componentImport('AuthShell, Button'),primitiveImport,experimentalImport];state=`  const [text,setText] = useState(${literal(text)});\n  const [status,setStatus] = useState(${literal(status)});`;break;
    }
    case 'AppShell': case 'SideNavigation': {
      const rightModel:SideNavigationModel={user:{initials:'PG',name:'Page tools',organization:'Workspace'},rootMenu:{id:'page-tools',sections:[{id:'outline',title:'On this page',items:[{id:'goals',label:'Learning goals'},{id:'activities',label:'Activities'}]}]}};
      const rightNav=<SideNavigation model={rightModel} aria-label="Example page navigation"/>;
      const nav=<SideNavigation model={navigationModel} resolveIcon={kind==='SideNavigation'?resolveNavigationIcon:undefined} onItemSelect={setValue} aria-label="Example workspace navigation"/>;
      preview=kind==='AppShell'?<AppShell navigation={nav} rightNavigation={showRightNavigation?rightNav:undefined} mainLabel="Example workspace" style={{height:420}}><Stack gap={3}><Typography variant="h5">{choice}</Typography><Typography>{label}</Typography></Stack></AppShell>:<SGNavigationProvider value={{pathname:navigationPath,navigate:href=>setNavigationPath(href)}}><Stack gap={3}><Surface style={{height:560,width:'fit-content',maxWidth:'100%'}}>{nav}</Surface></Stack></SGNavigationProvider>;
      const model=JSON.stringify(navigationModel).replace(/"active":(?:true|false)/, "\"active\":value==='overview'");
      state=`  const [value,setValue] = useState(${literal(value)});\n  const model:SideNavigationModel = ${model};`;
      const n=`<SideNavigation model={model}${kind==='SideNavigation'?' resolveIcon={resolveNavigationIcon}':''} onItemSelect={setValue} aria-label="Example workspace navigation" />`;
      body=kind==='AppShell'?`<AppShell navigation={${n}}${showRightNavigation?` rightNavigation={<SideNavigation model={${JSON.stringify(rightModel)}} aria-label="Example page navigation" />}`:''} mainLabel="Example workspace" style={{height:420}}><Stack gap={3}><Typography variant="h5">{${C}}</Typography><Typography>{${L}}</Typography></Stack></AppShell>`:`<Stack gap={3}><Surface style={{height:440,maxWidth:360}}>${n}</Surface></Stack>`;
      imports=[componentImport('AppShell, SideNavigation, type SideNavigationModel'),primitiveImport,experimentalImport];
      if(kind==='SideNavigation') {
        state=`  const [value,setValue] = useState(${literal(value)});\n  const [navigationPath,setNavigationPath] = useState(${literal(navigationPath)});\n  const model:SideNavigationModel = ${JSON.stringify(navigationModel,null,2)};\nconst navigationIcons={dashboard:DashboardIcon,course:MenuBookIcon,edit:EditIcon,settings:TuneIcon,people:PeopleIcon,resources:DescriptionOutlinedIcon,terminal:TerminalIcon};\nfunction resolveNavigationIcon(key:string) { const Icon=navigationIcons[key as keyof typeof navigationIcons];return Icon?<Icon/>:null; }`;
        body=`<SGNavigationProvider value={{pathname:navigationPath,navigate:href=>setNavigationPath(href)}}><Stack gap={3}><Surface style={{height:560,width:'fit-content',maxWidth:'100%'}}>${n}</Surface></Stack></SGNavigationProvider>`;
        imports=[componentImport('SideNavigation, type SideNavigationModel'),primitiveImport,experimentalImport,"import { SGNavigationProvider } from '@structured-growth/sg-ui/adapters';","import { DashboardIcon,MenuBookIcon,EditIcon,TuneIcon,PeopleIcon,DescriptionOutlinedIcon,TerminalIcon } from '@structured-growth/sg-ui/icons';"];
      }
      break;
    }
    case 'AppPageHeader': {
      preview=<AppPageHeader title={label} headingLevel={2} hierarchy={choice as 'primary'|'subpage'} description="Publish a course with clear goals." breadcrumbs={[{label:'Workspace'},{label:'Courses'},{label:title}]} metaItems={[{label:'Draft'},{label:'3 sections'}]} moreMenuItems={[{label:'Duplicate',onClick:()=>report('Duplicate requested')},{label:'Archive',danger:true,onClick:()=>report('Archive requested'),disabled:readOnly}]} />;
      body=`<Stack gap={3}><AppPageHeader title={${L}} headingLevel={2} hierarchy={${C}} description="Publish a course with clear goals." breadcrumbs={[{label:'Workspace'},{label:'Courses'},{label:${literal(title)}}]} metaItems={[{label:'Draft'},{label:'3 sections'}]} moreMenuItems={[{label:'Duplicate',onClick:()=>setStatus('Duplicate requested')},{label:'Archive',danger:true,onClick:()=>setStatus('Archive requested'),disabled:${R}}]} /><Typography role="status">{status}</Typography></Stack>`;
      preview=<Stack gap={3}>{preview}<Typography role="status">{status}</Typography></Stack>;
      imports=[componentImport('AppPageHeader'),primitiveImport];state=`  const [status,setStatus] = useState(${literal(status)});`;break;
    }
    case 'AppPageTabs': {
      const items=[{id:'overview',label:'Overview',content:<Typography>{label}</Typography>},{id:'practice',label:'Practice',content:<Typography>Practice tasks for the course.</Typography>},{id:'reflection',label:'Reflection',disabled:readOnly,content:<Typography>Reflect on your progress.</Typography>}];
      preview=<AppPageTabs value={value} onChange={setValue} items={items} density={density} activation={choice as 'automatic'|'manual'} label="Course sections"/>;
      body=`<AppPageTabs value={value} onChange={setValue} density=${literal(density)} activation={${C}} label="Course sections" items={[{id:'overview',label:'Overview',content:<Typography>{${L}}</Typography>},{id:'practice',label:'Practice',content:<Typography>Practice tasks for the course.</Typography>},{id:'reflection',label:'Reflection',disabled:${R},content:<Typography>Reflect on your progress.</Typography>}]} />`;
      imports=[componentImport('AppPageTabs'),primitiveImport];state=`  const [value,setValue] = useState(${literal(value)});`;
      if(routeTabs) {
        const routeItems=[{id:'/courses/overview',label:'Overview',href:'/courses/overview'},{id:'/courses/practice',label:'Practice',href:'/courses/practice'},{id:'/courses/reflection',label:'Reflection',href:'/courses/reflection',disabled:readOnly}];
        preview=<SGNavigationProvider value={{pathname:value,navigate:setValue}}><Stack gap={3}><AppPageTabs value={value} items={routeItems} density={density} label="Course routes"/></Stack></SGNavigationProvider>;
        body=`<SGNavigationProvider value={{pathname:value,navigate:setValue}}><Stack gap={3}><AppPageTabs value={value} items={${JSON.stringify(routeItems)}} density=${literal(density)} label="Course routes"/></Stack></SGNavigationProvider>`;
        imports.push("import { SGNavigationProvider } from '@structured-growth/sg-ui';");
      }
      break;
    }
    case 'ExperiencePageNavigator': {
      const add=()=>setPages(items=>[...items,{key:`page-${Date.now()}`,title:label}]);
      const remove=(key:string)=>{setPages(items=>items.filter(item=>item.key!==key)); if(value===key)setValue(pages.find(item=>item.key!==key)?.key??'');};
      const rename=(key:string,name:string)=>setPages(items=>items.map(item=>item.key===key?{...item,title:name}:item));
      const reorder=(source:string,target:string)=>setPages(items=>{const next=[...items],index=next.findIndex(item=>item.key===source); const [item]=next.splice(index,1);next.splice(next.findIndex(item=>item.key===target),0,item);return next;});
      preview=<ExperiencePageNavigator title={choice} pages={pages} activePageKey={value} onSelectPage={setValue} onAddPage={add} onRemovePage={remove} onRenamePage={rename} onReorderPages={reorder} readOnly={readOnly}/>;
      body=`<ExperiencePageNavigator title={${C}} pages={pages} activePageKey={value} onSelectPage={setValue} readOnly={${R}} onAddPage={()=>setPages(items=>[...items,{key:'page-'+Date.now(),title:${L}}])} onRemovePage={key=>{setPages(items=>items.filter(item=>item.key!==key));if(value===key)setValue(pages.find(item=>item.key!==key)?.key??'');}} onRenamePage={(key,title)=>setPages(items=>items.map(item=>item.key===key?{...item,title}:item))} onReorderPages={(source,target)=>setPages(items=>{const next=[...items];const [item]=next.splice(next.findIndex(item=>item.key===source),1);next.splice(next.findIndex(item=>item.key===target),0,item);return next;})} />`;
      imports=[componentImport('ExperiencePageNavigator')];state=`  const [pages,setPages] = useState(${JSON.stringify(pages)});\n  const [value,setValue] = useState(${literal(value)});`;break;
    }
    case 'EditableTitleField': {
      preview=<EditableTitleField title={title} placeholder={label} onSave={setTitle} readOnly={readOnly} variant={choice as 'h4'|'h5'|'h6'} minWidth={0}/>;
      body=`<EditableTitleField title={title} placeholder={${L}} onSave={setTitle} readOnly={${R}} variant={${C}} minWidth={0} />`;
      imports=[componentImport('EditableTitleField')];state=`  const [title,setTitle] = useState(${literal(title)});`;break;
    }
    case 'ContentEditorChrome': {
      const items=choice==='Export only'?[{id:'export',label:'Export',onPress:()=>report('Export requested')}]:[{id:'save',label:'Save',disabled:readOnly,onPress:()=>report('Saved locally')},{id:'preview',label:'Preview',onPress:()=>report('Preview requested')}];
      preview=<ContentEditorChrome icon={<Typography as="span">✎</Typography>} title={title} onTitleSave={setTitle} titleReadOnly={readOnly} menuItems={items} rightSlot={<Typography role="status">{status}</Typography>} />;
      body=`<ContentEditorChrome icon={<Typography as="span">✎</Typography>} title={title} onTitleSave={setTitle} titleReadOnly={${R}} menuItems={${choice==='Export only'?"[{id:'export',label:'Export',onPress:()=>setStatus('Export requested')}]":`[{id:'save',label:'Save',disabled:${R},onPress:()=>setStatus('Saved locally')},{id:'preview',label:'Preview',onPress:()=>setStatus('Preview requested')}]`}} rightSlot={<Typography role="status">{status}</Typography>} />`;
      imports=[componentImport('ContentEditorChrome'),primitiveImport];state=`  const [title,setTitle] = useState(${literal(title)});\n  const [status,setStatus] = useState(${literal(status)});`;break;
    }
    case 'DocumentEditorLayout': {
      const full=choice==='Full chrome';
      preview=<DocumentEditorLayout title={label} titleNode={full?<EditableTitleField title={title} onSave={setTitle} readOnly={readOnly} minWidth={0}/>:undefined} headerRight={full?<Button disabled={readOnly} onPress={()=>report('Saved locally')}>Save</Button>:undefined} toolbar={full?<InsertContentMenuControl disabled={readOnly} onInsertHorizontalRule={()=>{setText(s=>s+'\n—\n');report('Rule requested in host notes');}}/>:undefined} style={{minHeight:300}}><Stack gap={3}><Typography>{label}</Typography><TextField label="Document notes" value={text} onValueChange={setText} readOnly={readOnly}/><Typography role="status">{status}</Typography></Stack></DocumentEditorLayout>;
      body=`<DocumentEditorLayout title={${L}} ${full?`titleNode={<EditableTitleField title={title} onSave={setTitle} readOnly={${R}} minWidth={0}/>} headerRight={<Button disabled={${R}} onPress={()=>setStatus('Saved locally')}>Save</Button>} toolbar={<InsertContentMenuControl disabled={${R}} onInsertHorizontalRule={()=>{setText(s=>s+'\\n—\\n');setStatus('Rule requested in host notes');}}/>}`:''} style={{minHeight:300}}><Stack gap={3}><Typography>{${L}}</Typography><TextField label="Document notes" value={text} onValueChange={setText} readOnly={${R}}/><Typography role="status">{status}</Typography></Stack></DocumentEditorLayout>`;
      imports=[componentImport('DocumentEditorLayout, EditableTitleField, Button, InsertContentMenuControl'),primitiveImport,experimentalImport];state=`  const [title,setTitle] = useState(${literal(title)});\n  const [text,setText] = useState(${literal(text)});\n  const [status,setStatus] = useState(${literal(status)});`;break;
    }
    case 'DocumentEditorToolbar': {
      preview=<Stack gap={3}><DocumentEditorToolbar canEdit={!readOnly} headingValue={heading} onHeadingChange={setHeading} actions={actions} zoomValue={zoom} onZoomIn={()=>setZoom(n=>Math.min(200,n+10))} onZoomOut={()=>setZoom(n=>Math.max(50,n-10))} showZoomControls={choice==='All controls'} showAlignmentControls={false} statusLabel={label}/><Typography>{`${heading} / ${zoom}% / bold ${bold} / italic ${italic} / bulleted ${bullet} / numbered ${ordered}`}</Typography></Stack>;
      body=`<Stack gap={3}><DocumentEditorToolbar canEdit={${!readOnly}} headingValue={heading} onHeadingChange={setHeading} actions={{bold:{active:bold,onClick:()=>setBold(!bold)},italic:{active:italic,onClick:()=>setItalic(!italic)},bulletList:{active:bullet,onClick:()=>setBullet(!bullet)},orderedList:{active:ordered,onClick:()=>setOrdered(!ordered)}}} zoomValue={zoom} onZoomIn={()=>setZoom(n=>Math.min(200,n+10))} onZoomOut={()=>setZoom(n=>Math.max(50,n-10))} showZoomControls={${choice==='All controls'}} showAlignmentControls={false} statusLabel={${L}}/><Typography>{heading} / {zoom}% / bold {String(bold)} / italic {String(italic)} / bulleted {String(bullet)} / numbered {String(ordered)}</Typography></Stack>`;
      imports=[componentImport('DocumentEditorToolbar'),primitiveImport];state=`  const [heading,setHeading] = useState<'normal'|'h1'|'h2'|'h3'|'h4'|'h5'>(${literal(heading)});\n  const [zoom,setZoom] = useState(${zoom});\n  const [bold,setBold] = useState(${bold});\n  const [italic,setItalic] = useState(${italic});\n  const [bullet,setBullet] = useState(${bullet});\n  const [ordered,setOrdered] = useState(${ordered});`;break;
    }
    case 'RichTextFormattingToolbar': {
      preview=<Stack gap={3}><RichTextFormattingToolbar headingValue={richHeading} onHeadingChange={setRichHeading} boldActive={bold} onBold={()=>setBold(!bold)} italicActive={italic} onItalic={()=>setItalic(!italic)} underlineActive={underline} onUnderline={()=>setUnderline(!underline)} alignmentValue={alignment} onAlignmentChange={setAlignment} showFontFamilySelector={false} showFontSizeControls={false} hiddenControlSets={choice==='Essential formatting'?{colors:true,textStyle:true,insert:true,alignment:true}:undefined} disabledControlSets={readOnly?{heading:true,inlineFormats:true,alignment:true,colors:true,textStyle:true,insert:true}:undefined} textColorValue={color} onTextColorChange={setColor}/><Typography>{label}</Typography></Stack>;
      body=`<Stack gap={3}><RichTextFormattingToolbar headingValue={heading} onHeadingChange={setHeading} boldActive={bold} onBold={()=>setBold(!bold)} italicActive={italic} onItalic={()=>setItalic(!italic)} underlineActive={underline} onUnderline={()=>setUnderline(!underline)} alignmentValue={alignment} onAlignmentChange={setAlignment} showFontFamilySelector={false} showFontSizeControls={false} ${choice==='Essential formatting'?'hiddenControlSets={{colors:true,textStyle:true,insert:true,alignment:true}}':''} ${readOnly?'disabledControlSets={{heading:true,inlineFormats:true,alignment:true,colors:true,textStyle:true,insert:true}}':''} textColorValue={color} onTextColorChange={setColor}/><Typography>{${L}}</Typography></Stack>`;
      imports=[componentImport('RichTextFormattingToolbar, type AlignOption'),primitiveImport];state=`  const [heading,setHeading] = useState<NonNullable<React.ComponentProps<typeof RichTextFormattingToolbar>['headingValue']>>(${literal(richHeading)});\n  const [bold,setBold] = useState(${bold});\n  const [italic,setItalic] = useState(${italic});\n  const [underline,setUnderline] = useState(${underline});\n  const [alignment,setAlignment] = useState<AlignOption>(${literal(alignment)});\n  const [color,setColor] = useState(${literal(color)});`;break;
    }
    case 'InsertContentMenuControl': {
      preview=<Stack gap={3}><InsertContentMenuControl disabled={readOnly} onInsertHorizontalRule={()=>report('Horizontal rule insertion requested')} onInsertImage={choice==='All insertions'?()=>report('Image insertion requested'):undefined} onInsertColumnsLayout={choice==='All insertions'?()=>report('Columns insertion requested'):undefined}/><Typography>{label}</Typography><Typography role="status">{status}</Typography></Stack>;
      body=`<Stack gap={3}><InsertContentMenuControl disabled={${R}} onInsertHorizontalRule={()=>setStatus('Horizontal rule insertion requested')} ${choice==='All insertions'?"onInsertImage={()=>setStatus('Image insertion requested')} onInsertColumnsLayout={()=>setStatus('Columns insertion requested')}":''}/><Typography>{${L}}</Typography><Typography role="status">{status}</Typography></Stack>`;
      imports=[componentImport('InsertContentMenuControl'),primitiveImport];state=`  const [status,setStatus] = useState(${literal(status)});`;break;
    }
    case 'TextAlignMenuControl': {
      preview=<Stack gap={3}><TextAlignMenuControl value={alignment} onChange={setAlignment} disabled={readOnly} canIndent={indent<3} canOutdent={indent>0} onIndent={()=>setIndent(n=>Math.min(3,n+1))} onOutdent={()=>setIndent(n=>Math.max(0,n-1))}/><Typography style={{textAlign:alignment,marginInlineStart:indent*16}}>{label}</Typography></Stack>;
      body=`<Stack gap={3}><TextAlignMenuControl value={alignment} onChange={setAlignment} disabled={${R}} canIndent={indent<3} canOutdent={indent>0} onIndent={()=>setIndent(n=>Math.min(3,n+1))} onOutdent={()=>setIndent(n=>Math.max(0,n-1))}/><Typography style={{textAlign:alignment,marginInlineStart:indent*16}}>{${L}}</Typography></Stack>`;
      imports=[componentImport('TextAlignMenuControl, type AlignOption'),primitiveImport];state=`  const [alignment,setAlignment] = useState<AlignOption>(${literal(alignment)});\n  const [indent,setIndent] = useState(${indent});`;break;
    }
    case 'TextColorPickerControl': {
      preview=<Stack gap={3}><TextColorPickerControl value={color} onChange={setColor} disabled={readOnly} mode={choice as 'foreground'|'background'}/><Typography style={choice==='background'?{background:color}:{color}}>{label}</Typography></Stack>;
      body=`<Stack gap={3}><TextColorPickerControl value={color} onChange={setColor} disabled={${R}} mode={${C}}/><Typography style={{${choice==='background'?'background':'color'}:color}}>{${L}}</Typography></Stack>`;
      imports=[componentImport('TextColorPickerControl'),primitiveImport];state=`  const [color,setColor] = useState(${literal(color)});`;break;
    }
    case 'TextStyleMenuControl': {
      preview=<Stack gap={3}><TextStyleMenuControl disabled={readOnly} activeStyles={activeStyles} onLowercase={()=>setText(s=>s.toLowerCase())} onUppercase={()=>setText(s=>s.toUpperCase())} onCapitalize={()=>setText(s=>s.replace(/\b\w/g,c=>c.toUpperCase()))} onStrikethrough={choice==='All styles'?()=>toggleStyle('strikethrough'):undefined} onSubscript={choice==='All styles'?()=>toggleStyle('subscript'):undefined} onSuperscript={choice==='All styles'?()=>toggleStyle('superscript'):undefined} onHighlight={choice==='All styles'?()=>toggleStyle('highlight'):undefined} onClearFormatting={()=>{setActiveStyles([]);setText(label);}}/><Typography style={{textDecoration:activeStyles.includes('strikethrough')?'line-through':undefined}}>{text}</Typography></Stack>;
      body=`<Stack gap={3}><TextStyleMenuControl disabled={${R}} activeStyles={activeStyles} onLowercase={()=>setText(s=>s.toLowerCase())} onUppercase={()=>setText(s=>s.toUpperCase())} onCapitalize={()=>setText(s=>s.replace(/\\b\\w/g,c=>c.toUpperCase()))} ${choice==='All styles'?"onStrikethrough={()=>toggleStyle('strikethrough')} onSubscript={()=>toggleStyle('subscript')} onSuperscript={()=>toggleStyle('superscript')} onHighlight={()=>toggleStyle('highlight')}":''} onClearFormatting={()=>{setActiveStyles([]);setText(${L});}}/><Typography style={{textDecoration:activeStyles.includes('strikethrough')?'line-through':undefined}}>{text}</Typography></Stack>`;
      imports=[componentImport('TextStyleMenuControl, type TextStyleId'),primitiveImport];state=`  const [text,setText] = useState(${literal(text)});\n  const [activeStyles,setActiveStyles] = useState<TextStyleId[]>(${JSON.stringify(activeStyles)});\n  const toggleStyle = (style:TextStyleId) => setActiveStyles(items=>items.includes(style)?items.filter(item=>item!==style):[...items,style]);`;break;
    }
    case 'ColumnsLayoutModal': {
      preview=<Stack gap={3}><Button disabled={readOnly} onPress={()=>setOpen(true)}>Choose columns</Button><Typography role="status">Inserted preset: {preset}</Typography><Typography>{label}</Typography><ColumnsLayoutModal open={open} defaultPreset={choice as ColumnsLayoutPreset} onClose={()=>setOpen(false)} onSubmit={next=>{setPreset(next);setOpen(false);}}/></Stack>;
      body=`<Stack gap={3}><Button disabled={${R}} onPress={()=>setOpen(true)}>Choose columns</Button><Typography role="status">Inserted preset: {preset}</Typography><Typography>{${L}}</Typography><ColumnsLayoutModal open={open} defaultPreset={${C}} onClose={()=>setOpen(false)} onSubmit={next=>{setPreset(next);setOpen(false);}}/></Stack>`;
      imports=[componentImport('Button, ColumnsLayoutModal, type ColumnsLayoutPreset'),primitiveImport];state=`  const [open,setOpen] = useState(${open});\n  const [preset,setPreset] = useState<ColumnsLayoutPreset>(${literal(preset)});`;break;
    }
    case 'LinkUrlModal': {
      preview=<Stack gap={3}><Button disabled={readOnly} onPress={()=>setOpen(true)}>Edit destination</Button><Typography role="status">{link.displayText}: {link.url||'Link removed'}</Typography><LinkUrlModal open={open} title={label} initialDisplayText={link.displayText} initialUrl={link.url} allowedProtocols={choice==='HTTPS only'?['https']:['http','https','mailto','tel']} allowRelativeUrls={choice!=='HTTPS only'} onClose={()=>setOpen(false)} onSubmit={next=>{setLink({displayText:next.displayText,url:next.url??''});setOpen(false);}}/></Stack>;
      body=`<Stack gap={3}><Button disabled={${R}} onPress={()=>setOpen(true)}>Edit destination</Button><Typography role="status">{link.displayText}: {link.url||'Link removed'}</Typography><LinkUrlModal open={open} title={${L}} initialDisplayText={link.displayText} initialUrl={link.url} allowedProtocols={${choice==='HTTPS only'?"['https']":"['http','https','mailto','tel']"}} allowRelativeUrls={${choice!=='HTTPS only'}} onClose={()=>setOpen(false)} onSubmit={next=>{setLink({displayText:next.displayText,url:next.url??''});setOpen(false);}}/></Stack>`;
      imports=[componentImport('Button, LinkUrlModal'),primitiveImport];state=`  const [open,setOpen] = useState(${open});\n  const [link,setLink] = useState(${JSON.stringify(link)});`;break;
    }
    case 'ImageUploadModal': {
      preview=<Stack gap={3}><Button onPress={()=>setOpen(true)}>Select image</Button><Typography role="status">{status}</Typography><ImageUploadModal open={open} title={label} enableAltText={!readOnly} onClose={()=>setOpen(false)} onSubmit={async(file,alt)=>{if(choice==='Simulated failure')throw new Error('Simulated host rejection');report(`Selected ${file.name}; description: ${alt||'decorative'}. No upload performed.`);setOpen(false);}}/></Stack>;
      body=`<Stack gap={3}><Button onPress={()=>setOpen(true)}>Select image</Button><Typography role="status">{status}</Typography><ImageUploadModal open={open} title={${L}} enableAltText={${!readOnly}} onClose={()=>setOpen(false)} onSubmit={async(file,alt)=>{${choice==='Simulated failure'?"throw new Error('Simulated host rejection');":"setStatus('Selected '+file.name+'; description: '+(alt||'decorative')+'. No upload performed.');setOpen(false);"}}}/></Stack>`;
      imports=[componentImport('Button, ImageUploadModal'),primitiveImport];state=`  const [open,setOpen] = useState(${open});\n  const [status,setStatus] = useState(${literal(status)});`;break;
    }
    case 'FloatingTextSelectionToolbar': {
      preview=<Stack gap={3}><Typography>{label}</Typography><FloatingHost text={text} readOnly={readOnly} narrow={choice==='Narrow boundary'} status={status} lexical={lexical} onLexicalChange={setLexical} onLink={()=>report('Link requested for the current selection')}/><Typography variant="caption">Select text, then press Alt+F10 to focus formatting. Escape returns to the editor. The host supplies Lexical context and document scrolling.</Typography></Stack>;
      body=`<Stack gap={3}><Typography>{${L}}</Typography><div ref={boundary} style={{height:280,maxWidth:${choice==='Narrow boundary'?320:640},overflow:'auto',position:'relative'}}><LexicalComposer initialConfig={{namespace:'floating-example',editable:${!readOnly},onError:(error:Error)=>{throw error;},editorState:JSON.stringify(document)}}><FloatingTextSelectionToolbar boundaryRef={boundary} onRequestLink={()=>setStatus('Link requested for the current selection')}/><OnChangePlugin onChange={editorState=>setDocument(editorState.toJSON())}/><RichTextPlugin ErrorBoundary={LexicalErrorBoundary} contentEditable={<ContentEditable aria-label="Selection demonstration" style={{minHeight:240,padding:16}}/>} placeholder={null}/></LexicalComposer></div><Typography role="status">{status}</Typography><Typography variant="caption">Select text, then press Alt+F10 to focus formatting. Escape returns to the editor. The host supplies Lexical context and document scrolling.</Typography></Stack>`;
      imports=[componentImport('FloatingTextSelectionToolbar'),primitiveImport,"import { useRef } from 'react';","import { LexicalComposer } from '@lexical/react/LexicalComposer';","import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';","import { ContentEditable } from '@lexical/react/LexicalContentEditable';","import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';","import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';"];
      state=`  const boundary = useRef<HTMLDivElement>(null);\n  const [status,setStatus] = useState(${literal(status)});\n  const [document,setDocument] = useState<unknown>(${JSON.stringify(lexical)});`;break;
    }
    case 'PageRichTextEditorSection': {
      preview=<Stack gap={3}><PageRichTextEditorSection editorKey={`docs-${kind}-${section}`} lexicalValue={lexical} onLexicalChange={setLexical} placeholder={label} readOnly={readOnly} toolPreset={choice as 'base'|'full'} aria-label="Example rich document"/><Typography variant="caption">{'Changes update local JSON only. Image uploads require a durable host URL; the default preview is temporary.'}</Typography></Stack>;
      body=`<Stack gap={3}><PageRichTextEditorSection editorKey="example-document" lexicalValue={lexical} onLexicalChange={setLexical} placeholder={${L}} readOnly={${R}} toolPreset={${C}} aria-label="Example rich document"/><Typography variant="caption">{${literal('Changes update local JSON only. Image uploads require a durable host URL; the default preview is temporary.')}}</Typography></Stack>`;
      imports=[componentImport('PageRichTextEditorSection'),primitiveImport];state=`  const [lexical,setLexical] = useState<unknown>(${JSON.stringify(lexical)});`;break;
    }
  }
  const densityBody=`<ThemeScope density=${literal(density)}${previewWidth?` style={{maxWidth:${previewWidth}}}`:''}>\n${body}\n</ThemeScope>`;
  const controls=<Stack direction="row" wrap gap={3} align="end">{kind==='AppShell'&&<Checkbox label="Show right navigation" checked={showRightNavigation} onCheckedChange={setShowRightNavigation}/>}<TextField label="Content / label" value={label} onValueChange={next=>{setLabel(next);if(kind==='TextStyleMenuControl')setText(next);}}/>{kind!=='SideNavigation'&&<Select label="Configuration" value={choice} onValueChange={next=>{if(next){setChoice(next);if(kind==='TextAlignMenuControl')setAlignment(next as AlignOption);}}} options={choices[kind].map(id=>({id,label:id}))}/> }<Select label="Preview density" value={density} onValueChange={next=>setDensity(next as 'compact'|'comfortable')} options={[{id:'compact',label:'Compact'},{id:'comfortable',label:'Comfortable'}]}/>{kind!=='AppShell'&&kind!=='SideNavigation'?<Checkbox checked={readOnly} onCheckedChange={setReadOnly} label={kind==='ImageUploadModal'?'Hide image description':kind==='AppPageTabs'?'Disable reflection tab':kind==='AppPageHeader'?'Disable archive action':'Read-only / unavailable actions'} />:null}{kind==='FloatingTextSelectionToolbar'?<TextField label="Document text" value={text} onValueChange={next=>{setText(next);setLexical(documentValue(next));}}/>:null}{kind==='EditableTitleField'||kind==='ContentEditorChrome'||kind==='DocumentEditorLayout'?<TextField label="Host title" value={title} onValueChange={setTitle}/>:null}</Stack>;
  return <Example title={section} description={descriptions[kind]} controls={playground?controls:undefined} density={density} flushPreview={kind==='SideNavigation'} source={source({name:kind,imports,state,body:densityBody})}><ThemeScope density={density} style={previewWidth?{maxWidth:previewWidth}:undefined}>{preview}</ThemeScope></Example>;
}
type ReferenceConfiguration = { title:string; choice:string; density?:'compact'|'comfortable'; readOnly?:boolean; width?:number; routeTabs?:boolean; rightNavigation?:boolean; content?:string; link?:{displayText:string;url:string} };
const densities = ['compact','comfortable'] as const;
const densityReferences = (values:string[], label=(value:string)=>value):ReferenceConfiguration[] => values.flatMap(choice=>densities.map(density=>({title:`${label(choice)} — ${density}`,choice,density})));
const references:Record<Kind,ReferenceConfiguration[]> = {
  AuthShell:choices.AuthShell.map((choice,index)=>({title:choice,choice,density:index===1?'compact':'comfortable',readOnly:index===2,content:index===0?'Continue your learning journey.':index===1?'Create an account for your workspace.':'Account recovery is managed by the host.'})),
  AppShell:[{title:'Left and right navigation',choice:'Course workspace',rightNavigation:true},{title:'Workspace with navigation',choice:'Course workspace',width:760},{title:'Narrow workspace composition',choice:'Organization workspace',width:360,density:'compact',content:'A narrow workspace with the same navigation and main region.'}],
  AppPageHeader:densityReferences(['primary','subpage'],value=>`${value==='primary'?'First-level':'Subpage'} header`),
  AppPageTabs:[...densityReferences(['automatic','manual'],value=>`${value==='automatic'?'Automatic':'Manual'} panel activation`),...densities.map(density=>({title:`Host route navigation — ${density}`,choice:'automatic',density,routeTabs:true}))],
  ExperiencePageNavigator:densities.flatMap(density=>[{title:`Editable page collection — ${density}`,choice:'Course outline',density},{title:`Read-only lesson sequence — ${density}`,choice:'Lesson sequence',density,readOnly:true}]),
  SideNavigation:densityReferences(['Mixed menu'],()=>'Mixed expansion, drilldown and destinations'),
  EditableTitleField:[...densityReferences(['h4','h5','h6'],value=>`${value.toUpperCase()} title`),{title:'Read-only committed title',choice:'h4',readOnly:true}],
  DocumentEditorLayout:[{title:'Full editor composition',choice:'Full chrome'},{title:'Full editor in a narrow host',choice:'Full chrome',width:360,density:'compact',content:'An editor title and its host commands wrap within a narrow content region.'},{title:'Minimal document layout',choice:'Minimal chrome'},{title:'Read-only notes composition',choice:'Minimal chrome',readOnly:true,density:'compact'}],
  DocumentEditorToolbar:[...densityReferences(['All controls','Formatting only']),{title:'Read-only formatting with active zoom',choice:'All controls',readOnly:true}],
  ContentEditorChrome:[...densityReferences(['Save and preview','Export only']),{title:'Read-only title and unavailable Save',choice:'Save and preview',readOnly:true,width:360}],
  FloatingTextSelectionToolbar:[...densityReferences(['Narrow boundary','Wide boundary']),{title:'Read-only selection host',choice:'Wide boundary',readOnly:true}],
  RichTextFormattingToolbar:[...densityReferences(['Full toolbar','Essential formatting']),{title:'Unavailable formatting commands',choice:'Full toolbar',readOnly:true}],
  InsertContentMenuControl:[{title:'Complete insertion menu',choice:'All insertions'},{title:'Horizontal-rule command only',choice:'Rule only'},{title:'Unavailable insertion menu',choice:'All insertions',readOnly:true}],
  TextAlignMenuControl:[...choices.TextAlignMenuControl.map(choice=>({title:`${choice[0].toUpperCase()+choice.slice(1)} alignment`,choice})),{title:'Unavailable alignment commands',choice:'left',readOnly:true}],
  TextColorPickerControl:[{title:'Foreground color selection',choice:'foreground'},{title:'Background color selection',choice:'background'},{title:'Unavailable color picker',choice:'foreground',readOnly:true}],
  TextStyleMenuControl:[{title:'All text style commands',choice:'All styles'},{title:'Case conversion commands only',choice:'Case conversion only'},{title:'Unavailable text styles',choice:'All styles',readOnly:true}],
  ColumnsLayoutModal:[...choices.ColumnsLayoutModal.map(choice=>({title:`Default column preset: ${choice}`,choice})),{title:'Compact column-selection dialog',choice:'twoEqual',density:'compact'}],
  LinkUrlModal:[{title:'Edit an HTTPS link',choice:'All safe protocols'},{title:'HTTPS-only destination policy',choice:'HTTPS only',density:'compact'},{title:'Document-relative destination',choice:'All safe protocols',link:{displayText:'Course overview',url:'/courses/overview'}},{title:'Email destination',choice:'All safe protocols',link:{displayText:'Contact the course team',url:'mailto:team@example.com'}},{title:'Blank destination for removing a link',choice:'All safe protocols',link:{displayText:'Keep this existing text',url:''}}],
  ImageUploadModal:[{title:'Image selection with description',choice:'Success'},{title:'File-only host submission',choice:'Success',readOnly:true},{title:'Retryable host rejection',choice:'Simulated failure'},{title:'Compact image-selection dialog',choice:'Success',density:'compact'}],
  PageRichTextEditorSection:[{title:'Base editing controls',choice:'base',density:'compact'},{title:'Full document editing controls',choice:'full'},{title:'Read-only document',choice:'full',readOnly:true}],
};
/** Each reference owns its hooks and callbacks; it never consumes playground state. */
function EditorReferences({kind}:{kind:Kind}) {
  return <Stack gap={4}>{references[kind].map(reference=><EditorExample key={reference.title} kind={kind} section={reference.title} initialChoice={reference.choice} initialDensity={reference.density} initialReadOnly={reference.readOnly} previewWidth={reference.width} routeTabs={reference.routeTabs} initialContent={reference.content} initialLink={reference.link} initialRightNavigation={reference.rightNavigation}/>)}</Stack>;
}
function makePlayground(kind:Kind) {
  return function CatalogEditorPlayground(){return <Stack gap={4}>
    <EditorExample kind={kind} section="Prop playground" initialChoice={choices[kind][0]} playground/>
    <EditorReferences kind={kind}/>
    {kind==='PageRichTextEditorSection'&&<><SavedDocumentExample/><SavedDocumentExample readOnly/><HostImageUploadExample/></>}
    {kind==='AuthShell'&&<LongAuthFormExample/>}{kind==='AppPageHeader'&&<HeaderActionsExample/>}
    {kind==='AppShell'&&<><AppShellScrollingExample/><AppShellScrollingExample withRightNavigation/><AppShellIconNavigationExamples/></>}
  </Stack>;};
}
export const editorLayoutEntries:CatalogEntry[] = [
  {slug:"icon-panel-navigation",title:"IconPanelNavigation",description:"An icon-only rail with sliding, independently owned workspace panels.",exports:["IconPanelNavigation"],Playground:IconPanelNavigationExamples},
  {slug:"auth-shell",title:"AuthShell",description:"A presentation shell for host-owned authentication forms, without account APIs.",exports:["AuthShell"],Playground:makePlayground("AuthShell")},
  {slug:"app-shell",title:"AppShell",description:"Independent navigation and main content regions for application compositions.",exports:["AppShell"],Playground:makePlayground("AppShell")},
  {slug:"page-header",title:"AppPageHeader",description:"Hierarchy, breadcrumbs, metadata and host-owned actions.",exports:["AppPageHeader"],Playground:makePlayground("AppPageHeader")},
  {slug:"page-tabs",title:"AppPageTabs",description:"Controlled panels with automatic or manual keyboard activation.",exports:["AppPageTabs"],Playground:makePlayground("AppPageTabs")},
  {slug:"experience-page-navigator",title:"ExperiencePageNavigator",description:"Host-owned page selection, rename, reorder, creation and removal.",exports:["ExperiencePageNavigator"],Playground:makePlayground("ExperiencePageNavigator")},
  {slug:"side-navigation",title:"SideNavigation",description:"Direct destinations, expanding groups and sliding drilldown levels in one host-supplied menu.",exports:["SideNavigation"],Playground:makePlayground("SideNavigation")},
  {slug:"editable-title-field",title:"EditableTitleField",description:"Inline title editing with save/cancel and read-only presentation.",exports:["EditableTitleField"],Playground:makePlayground("EditableTitleField")},
  {slug:"document-editor-layout",title:"DocumentEditorLayout",description:"Compose document title, actions and toolbar around host-owned content.",exports:["DocumentEditorLayout"],Playground:makePlayground("DocumentEditorLayout")},
  {slug:"document-editor-toolbar",title:"DocumentEditorToolbar",description:"Controlled heading, formatting and zoom state with explicit command availability.",exports:["DocumentEditorToolbar"],Playground:makePlayground("DocumentEditorToolbar")},
  {slug:"content-editor-chrome",title:"ContentEditorChrome",description:"An editable document title with anchor-aware menu commands.",exports:["ContentEditorChrome"],Playground:makePlayground("ContentEditorChrome")},
  {slug:"floating-text-selection-toolbar",title:"FloatingTextSelectionToolbar",description:"Select text in the integrated Lexical editor; Alt+F10 focuses its floating formatting actions.",exports:["FloatingTextSelectionToolbar"],Playground:makePlayground("FloatingTextSelectionToolbar")},
  {slug:"rich-text-formatting-toolbar",title:"RichTextFormattingToolbar",description:"Host-controlled formatting commands, checked states and optional control groups.",exports:["RichTextFormattingToolbar"],Playground:makePlayground("RichTextFormattingToolbar")},
  {slug:"insert-content-menu-control",title:"InsertContentMenuControl",description:"Insertion commands request host-owned changes rather than saving content themselves.",exports:["InsertContentMenuControl"],Playground:makePlayground("InsertContentMenuControl")},
  {slug:"text-align-menu-control",title:"TextAlignMenuControl",description:"Physical and logical alignment with host-controlled indent bounds.",exports:["TextAlignMenuControl"],Playground:makePlayground("TextAlignMenuControl")},
  {slug:"text-color-picker-control",title:"TextColorPickerControl",description:"Semantic colors and custom hex values, with separate foreground/background modes.",exports:["TextColorPickerControl"],Playground:makePlayground("TextColorPickerControl")},
  {slug:"text-style-menu-control",title:"TextStyleMenuControl",description:"Case conversion and checked formatting state with explicit host callbacks.",exports:["TextStyleMenuControl"],Playground:makePlayground("TextStyleMenuControl")},
  {slug:"columns-layout-modal",title:"ColumnsLayoutModal",description:"A fresh layout draft on opening with a host-owned insertion result.",exports:["ColumnsLayoutModal"],Playground:makePlayground("ColumnsLayoutModal")},
  {slug:"link-url-modal",title:"LinkUrlModal",description:"Editable link text and protocol policy, including relative URLs and removing links.",exports:["LinkUrlModal"],Playground:makePlayground("LinkUrlModal")},
  {slug:"image-upload-modal",title:"ImageUploadModal",description:"Picker/drop presentation, optional descriptions, retryable errors and host-owned upload.",exports:["ImageUploadModal"],Playground:makePlayground("ImageUploadModal")},
  {slug:"page-rich-text-editor-section",title:"PageRichTextEditorSection",description:"A controlled rich-document editor with formatting, insertion and read-only presentation.",exports:["PageRichTextEditorSection"],Playground:makePlayground("PageRichTextEditorSection")},
  {slug:"navigation-provider",title:"SGNavigationProvider",description:"Connect SGUI navigation to host-owned route state without a framework dependency.",exports:["SGNavigationProvider"],Playground:()=> <HostAdapterPlayground kind="navigation"/>},
  {slug:"sg-link",title:"SGLink",description:"Native anchor semantics with an optional host router, including replace and download behavior.",exports:["SGLink"],Playground:()=> <HostAdapterPlayground kind="link"/>},
  {slug:"account-provider",title:"SGAccountProvider",description:"Supply local account selection and logout operations; credentials and persistence remain host-owned.",exports:["SGAccountProvider"],Playground:()=> <HostAdapterPlayground kind="account"/>},
  {slug:"translation-provider",title:"SGTranslationProvider",description:"Supply host translations, ICU values and locale with deterministic English fallbacks.",exports:["SGTranslationProvider"],Playground:()=> <HostAdapterPlayground kind="translation"/>},
];

function FloatingHost({text,readOnly,narrow,status,onLink,lexical,onLexicalChange}:{text:string;readOnly:boolean;narrow:boolean;status:string;onLink:()=>void;lexical:unknown;onLexicalChange:(document:unknown)=>void}) {
  const boundary=useRef<HTMLDivElement>(null);
  return <Stack gap={3}><div ref={boundary} style={{height:280,maxWidth:narrow?320:640,overflow:'auto',position:'relative'}}><LexicalComposer key={`${text}-${readOnly}`} initialConfig={{namespace:'floating-example',editable:!readOnly,onError:(error:Error)=>{throw error;},editorState:JSON.stringify(lexical)}}><FloatingTextSelectionToolbar boundaryRef={boundary} onRequestLink={onLink}/><OnChangePlugin onChange={editorState=>onLexicalChange(editorState.toJSON())}/><RichTextPlugin ErrorBoundary={LexicalErrorBoundary} contentEditable={<ContentEditable aria-label="Selection demonstration" style={{minHeight:240,padding:16}}/>} placeholder={null}/></LexicalComposer></div><Typography role="status">{status}</Typography></Stack>;
}

type AdapterKind='navigation'|'link'|'account'|'translation';
function HostAdapterPlayground({kind}:{kind:AdapterKind}) {
  return <Stack gap={4}><HostAdapterExample kind={kind} title="Prop playground"/><HostAdapterExample kind={kind} title="Compact configuration" compact/><HostAdapterExample kind={kind} title="Alternate host integration" alternate/></Stack>;
}
function HostAdapterExample({kind,title,compact=false,alternate=false}:{kind:AdapterKind;title:string;compact?:boolean;alternate?:boolean}) {
  const source=useExampleSource();const [label,setLabel]=useState(alternate?'A host-defined destination with a longer descriptive label':'Open course');
  const [pathname,setPathname]=useState('/courses');const [replace,setReplace]=useState(alternate);const [status,setStatus]=useState('Ready');
  const [locale,setLocale]=useState(alternate?'es-ES':'en-US');const [translationMode,setTranslationMode]=useState(alternate?'Translated':'Fallback');const [count,setCount]=useState(1);
  const [sessions,setSessions]=useState<StoredAuthSession[]>([{accountId:'alex',email:'alex@example.com',activeOrgId:'sg',organizations:[{id:'sg',name:'Structured Growth'}]},{accountId:'sam',email:'sam@example.com',activeOrgId:'sg',organizations:[{id:'sg',name:'Structured Growth'}]}]);const [account,setAccount]=useState('alex');
  const density=compact?'compact':'comfortable';
  const accountAdapter:SGAccountAdapter={getStoredAuthSessions:()=>sessions,getStoredAuthSession:()=>sessions.find(item=>item.accountId===account)??null,setActiveStoredAuthSession:next=>{setAccount(next);setStatus('Selected '+next);},markOrganizationSwitched:()=>setStatus('Organization switch recorded locally'),logoutAccount:async id=>{setSessions(items=>items.filter(item=>item.accountId!==id));setAccount(sessions.find(item=>item.accountId!==id)?.accountId??'');setStatus('Signed out locally: '+id);},logoutAllAccounts:async()=>{setSessions([]);setAccount('');setStatus('All local sessions removed');}};
  const t:SGTranslationAdapter['t']=(key,options)=>{if(translationMode==='Throw lookup error')throw new Error('Simulated translation failure');if(translationMode==='Return missing marker')return '[[missing_translation]]';if(translationMode==='Expanded labels')return '⟦'+formatIcuMessage(options.defaultMessage,locale,options.values)+' — expanded label⟧';const translated=translationMode==='Translated'&&locale==='es-ES'?(key==='demo.label'?'Abrir curso':key==='demo.progress'?'{count, plural, one {# paso completado} other {# pasos completados}}':options.defaultMessage):options.defaultMessage;return formatIcuMessage(translated,locale,options.values);};
  const namespaces=new Set<string>();const translationAdapter:SGTranslationAdapter={locale,t,useNamespace:namespace=>{namespaces.add(namespace);}};
  let body='',state='',imports:string[]=[];let preview:ReactNode;
  const commonImports="import { Stack, Typography } from '@structured-growth/sg-ui/primitives';";
  const L=literal(label);
  if(kind==='navigation'||kind==='link') {
    const navigation={pathname,navigate:(href:string,options?:{replace?:boolean})=>{setPathname(href);setStatus((options?.replace?'Replaced':'Pushed')+' '+href);}};
    preview=<SGNavigationProvider value={navigation}><Stack gap={3}><SGLink href="/courses/intro" replace={replace}>{label}</SGLink>{kind==='navigation'?<AppPageTabs label="Host routes" value={pathname} items={[{id:'/courses',label:'Courses',href:'/courses'},{id:'/courses/intro',label:'Introduction',href:'/courses/intro'}]}/>:<SGLink href="data:text/plain,Example%20download" download="example.txt">Native download (router bypass)</SGLink>}<Typography role="status">Path: {pathname} — {status}</Typography></Stack></SGNavigationProvider>;
    imports=["import { SGNavigationProvider, SGLink } from '@structured-growth/sg-ui';","import { AppPageTabs } from '@structured-growth/sg-ui/components';",commonImports];
    state=`  const [pathname,setPathname]=useState(${literal(pathname)});\n  const [status,setStatus]=useState(${literal(status)});\n  const adapter={pathname,navigate:(href:string,options?:{replace?:boolean})=>{setPathname(href);setStatus((options?.replace?'Replaced':'Pushed')+' '+href);}};`;
    body=`<SGNavigationProvider value={adapter}><Stack gap={3}><SGLink href="/courses/intro" replace={${replace}}>{${L}}</SGLink>${kind==='navigation'?`<AppPageTabs label="Host routes" value={pathname} items={[{id:'/courses',label:'Courses',href:'/courses'},{id:'/courses/intro',label:'Introduction',href:'/courses/intro'}]}/>`:'<SGLink href="data:text/plain,Example%20download" download="example.txt">Native download (router bypass)</SGLink>'}<Typography role="status">Path: {pathname} — {status}</Typography></Stack></SGNavigationProvider>`;
  } else if(kind==='account') {
    preview=<SGAccountProvider value={accountAdapter}><AccountConsumer label={label}/><Typography role="status">{status}</Typography></SGAccountProvider>;
    imports=["import { SGAccountProvider, useAccountAdapter, type StoredAuthSession, type SGAccountAdapter } from '@structured-growth/sg-ui';","import { Button } from '@structured-growth/sg-ui/components';",commonImports];
    state=`  const [sessions,setSessions]=useState<StoredAuthSession[]>(${JSON.stringify(sessions)});\n  const [account,setAccount]=useState(${literal(account)});\n  const [status,setStatus]=useState(${literal(status)});\n  const adapter:SGAccountAdapter={getStoredAuthSessions:()=>sessions,getStoredAuthSession:()=>sessions.find(item=>item.accountId===account)??null,setActiveStoredAuthSession:next=>{setAccount(next);setStatus('Selected '+next);},markOrganizationSwitched:()=>setStatus('Organization switch recorded locally'),logoutAccount:async id=>{setSessions(items=>items.filter(item=>item.accountId!==id));setAccount(sessions.find(item=>item.accountId!==id)?.accountId??'');setStatus('Signed out locally: '+id);},logoutAllAccounts:async()=>{setSessions([]);setAccount('');setStatus('All local sessions removed');}};\n  function AccountConsumer(){const adapter=useAccountAdapter();const current=adapter.getStoredAuthSession();return <Stack gap={3}><Typography variant="h6">{${L}}</Typography><Typography>Active: {current?.email??'No session'}</Typography>{adapter.getStoredAuthSessions().map(session=><Button key={session.accountId} variant="outlined" onPress={()=>adapter.setActiveStoredAuthSession(session.accountId)}>Select {session.email}</Button>)}<Button disabled={!current} onPress={()=>current&&adapter.logoutAccount(current.accountId)}>Sign out current account</Button><Button disabled={!adapter.getStoredAuthSessions().length} tone="neutral" onPress={()=>adapter.logoutAllAccounts()}>Sign out all accounts</Button></Stack>;}`;
    body='<SGAccountProvider value={adapter}><AccountConsumer/><Typography role="status">{status}</Typography></SGAccountProvider>';
  } else {
    preview=<SGTranslationProvider value={translationAdapter}><TranslationConsumer label={label} count={count} onIncrement={()=>setCount(n=>n+1)}/></SGTranslationProvider>;
    imports=["import { SGTranslationProvider, useTranslation, formatIcuMessage, type SGTranslationAdapter } from '@structured-growth/sg-ui';","import { Button } from '@structured-growth/sg-ui/components';",commonImports];
    state=`  const [count,setCount]=useState(${count});\n  const [locale]=useState<string>(${literal(locale)});const [mode]=useState<string>(${literal(translationMode)});\n  const namespaces=new Set<string>();\n  const adapter:SGTranslationAdapter={locale,useNamespace:namespace=>{namespaces.add(namespace);},t:(key,options)=>{if(mode==='Throw lookup error')throw new Error('Simulated translation failure');if(mode==='Return missing marker')return '[[missing_translation]]';if(mode==='Expanded labels')return '⟦'+formatIcuMessage(options.defaultMessage,locale,options.values)+' — expanded label⟧';const translated=mode==='Translated'&&locale==='es-ES'?(key==='demo.label'?'Abrir curso':key==='demo.progress'?'{count, plural, one {# paso completado} other {# pasos completados}}':options.defaultMessage):options.defaultMessage;return formatIcuMessage(translated,locale,options.values);}};\n  function TranslationConsumer(){const {t}=useTranslation();return <Stack gap={3}><Button onPress={()=>setCount(n=>n+1)}>{t('demo.label',{defaultMessage:${L},namespace:'demo'})}</Button><Typography role="status">{t('demo.progress',{defaultMessage:'{count, plural, one {# step completed} other {# steps completed}}',namespace:'demo',values:{count}})}</Typography></Stack>;}`;
    body='<SGTranslationProvider value={adapter}><TranslationConsumer/></SGTranslationProvider>';
  }
  const controls=<Stack direction="row" wrap gap={3}><TextField label="Content / label" value={label} onValueChange={setLabel}/>{kind==='translation'?<><Select label="Host locale" value={locale} onValueChange={next=>next&&setLocale(next)} options={[{id:'en-US',label:'English'},{id:'es-ES',label:'Spanish'}]}/><Select label="Lookup behavior" value={translationMode} onValueChange={next=>next&&setTranslationMode(next)} options={['Fallback','Translated','Expanded labels','Throw lookup error','Return missing marker'].map(id=>({id,label:id}))}/></>:kind==='account'?<Button variant="outlined" onPress={()=>{setSessions([{accountId:'alex',email:'alex@example.com',organizations:[]},{accountId:'sam',email:'sam@example.com',organizations:[]}]);setAccount('alex');setStatus('Local sessions reset');}}>Reset demo accounts</Button>:<Checkbox label="Replace route rather than push" checked={replace} onCheckedChange={setReplace}/>}</Stack>;
  return <Example title={title} controls={title==='Prop playground'?controls:undefined} density={density} description={kind==='account'?'This in-memory account adapter does not authenticate, store credentials, or contact a server.':kind==='translation'?'Host lookup failures and missing markers fall back to the English defaultMessage. Catalogs are local; namespace registration does not fetch data.':'This adapter changes local route state only. Real host routers own history, URL updates and persistence.'} source={source({name:kind+'Adapter',imports,state,body:`<ThemeScope density="${density}">${body}</ThemeScope>`})}>{preview}</Example>;
}
function AccountConsumer({label}:{label:string}) {
  const adapter=useAccountAdapter();const current=adapter.getStoredAuthSession();
  return <Stack gap={3}><Typography variant="h6">{label}</Typography><Typography>Active: {current?.email??'No session'}</Typography>{adapter.getStoredAuthSessions().map(session=><Button key={session.accountId} variant="outlined" onPress={()=>adapter.setActiveStoredAuthSession(session.accountId)}>Select {session.email}</Button>)}<Button disabled={!current} onPress={()=>current&&adapter.logoutAccount(current.accountId)}>Sign out current account</Button><Button disabled={!adapter.getStoredAuthSessions().length} tone="neutral" onPress={()=>adapter.logoutAllAccounts()}>Sign out all accounts</Button></Stack>;
}
function TranslationConsumer({label,count,onIncrement}:{label:string;count:number;onIncrement:()=>void}) {
  const {t}=useTranslation();return <Stack gap={3}><Button onPress={onIncrement}>{t('demo.label',{defaultMessage:label,namespace:'demo'})}</Button><Typography role="status">{t('demo.progress',{defaultMessage:'{count, plural, one {# step completed} other {# steps completed}}',namespace:'demo',values:{count}})}</Typography></Stack>;
}
