import { ColumnsLayoutModal, ImageUploadModal, LinkUrlModal } from "@structured-growth/sg-ui/components";
import { AppDataGrid, AppDataGridShell, LearnerClassesDataGrid, type AppDataGridColumn } from "@structured-growth/sg-ui/components";
import { DataGrid } from "@structured-growth/sg-ui/experimental";
import { Table, TableCaption, TableHead, TableBody, TableFoot, TableRow, TableHeaderCell, TableCell } from "@structured-growth/sg-ui/experimental";
import { DateField, TimeField, Calendar, DatePicker, DateRangePicker, DateRangeSelector } from "@structured-growth/sg-ui/experimental";
import { ExperiencePageNavigator, EditableTitleField } from "@structured-growth/sg-ui/components";
import { ButtonGroup, SplitAction, Popover, Tooltip } from "@structured-growth/sg-ui/experimental";
import { TextArea, RadioGroup, ComboBox, AsyncMultiSelect, TagGroup, Avatar } from "@structured-growth/sg-ui/experimental";
import { useState } from "react";
import type { FixtureGlobals } from "../../../types";
import { CardCollectionWithFooter, InstructorClassCard, LearnerClassCard } from "@structured-growth/sg-ui/components";
import { SGTranslationProvider, formatIcuMessage } from "@structured-growth/sg-ui/i18n";
import { Breadcrumbs, Navigation, NavigationItem, Disclosure, Link } from "@structured-growth/sg-ui/experimental";
import type { Meta, StoryObj } from "../../../types";
import { Box } from "@structured-growth/sg-ui/experimental";
import { Provider } from "@structured-growth/sg-ui/theme";
import { ThemeScope } from "@structured-growth/sg-ui/theme";
import { Surface, Card, CardContent, Badge } from "@structured-growth/sg-ui/experimental";
import { Typography, Divider, List, ListItem, ListItemText, Chip, IconButton, CircularProgress, LinearProgress } from "@structured-growth/sg-ui/primitives";
import { CheckIcon } from "@structured-growth/sg-ui/experimental/icons";
import { tokens } from "@structured-growth/sg-ui/tokens";
import { Stack, Button, TextField, Select, Checkbox, Switch } from "@structured-growth/sg-ui/primitives";
import { ToggleButtonGroup } from "@structured-growth/sg-ui/experimental";
const meta = { title: "Migration proofs/Box", component: Box, tags: ["autodocs"],
  decorators: [(Story) => <Provider><Story /></Provider>], args: { children: "Course details" },
} satisfies Meta<typeof Box>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

/** Presentation boundaries at a narrow host width; no application CSS repairs. */
export const HardeningMatrix: Story = { render: () => <div style={{ display: "grid", gap: tokens.space4 }}>
  {(["light", "dark"] as const).flatMap(theme => (["compact", "comfortable"] as const).flatMap(density => (["ltr", "rtl"] as const).map(dir => {
    const title = dir === "rtl" ? "تفاصيل الدورة التدريبية للمدرسين ومسؤولي البرامج التعليمية" : "Professional development course details for instructors and administrators";
    const detail = dir === "rtl" ? "راجع الدروس والأنشطة قبل متابعة الدورة التدريبية." : "Review the lessons and activities before continuing this course.";
    return <ThemeScope key={`${theme}-${density}-${dir}`} data-testid={`${theme}-${density}-${dir}`} theme={theme} density={density} dir={dir} lang={dir === "rtl" ? "ar" : "en"}
      style={{ width: "18rem", maxWidth: "100%", background: tokens.surface, color: tokens.text, padding: tokens.space3 }}>
      <Box as="section" padding={2} aria-label={title} data-testid="box">
        <Typography as="h2" variant="subtitle1">{title}</Typography>
        <Surface variant="outlined" padding={2} data-testid="surface"><Typography variant="body2">{detail}</Typography></Surface>
        <Card data-testid="card"><CardContent padding={2}><Typography variant="bodyAlt2">{title}</Typography></CardContent></Card>
        <Divider />
        <List aria-label={title}><ListItem><ListItemText primary={title} secondary={detail} /></ListItem></List>
        <Chip>{dir === "rtl" ? "منشور وجاهز للمراجعة" : "Published and ready for review"}</Chip>
        <LinearProgress label={detail} value={50} />
        <CircularProgress label={dir === "rtl" ? "تحميل الدروس" : "Loading lessons"} />
        <div style={{ display: "flex", alignItems: "center", gap: tokens.space2, marginBlockStart: tokens.space3 }}>
          <Badge content="99+" aria-label={dir === "rtl" ? "١٢٣ رسالة غير مقروءة" : "123 unread messages"} />
          <IconButton label={dir === "rtl" ? "اكتملت المراجعة" : "Review complete"}><CheckIcon /></IconButton>
          <CheckIcon label={dir === "rtl" ? "مكتمل" : "Completed"} />
        </div>
      </Box>
    </ThemeScope>;
  })))}
</div> };

export const ControlGeometry: Story = { render: () => <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: tokens.space4 }}>
  {(["light", "dark"] as const).flatMap(theme => (["compact", "comfortable"] as const).flatMap(density => (["ltr", "rtl"] as const).flatMap(dir => (["pointer", "touch"] as const).map(interactionMode => {
    const rtl = dir === "rtl";
    return <ThemeScope key={`${theme}-${density}-${dir}-${interactionMode}`} data-testid={`${theme}-${density}-${dir}-${interactionMode}`}
      theme={theme} density={density} dir={dir} lang={rtl ? "ar" : "en"} interactionMode={interactionMode}
      style={{ background: tokens.surface, color: tokens.text, padding: tokens.space3, width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}>
      <Stack direction="row" align="end" wrap gap={3} data-testid="control-row">
        <Box style={{ width: "11rem", maxWidth: "100%" }}><TextField label={rtl ? "عنوان الدورة" : "Course title"} defaultValue={rtl ? "تطوير مهني" : "Professional development"} /></Box>
        <Box style={{ width: "11rem", maxWidth: "100%" }}><Select label={rtl ? "الحالة" : "Status"} defaultValue="short"
          options={[{ id: "short", label: rtl ? "مسودة" : "Draft" }, { id: "long", label: rtl ? "جاهز للمراجعة من قبل المدرسين ومسؤولي البرامج التعليمية" : "Ready for review by instructors and program administrators" }]} /></Box>
        <Checkbox label={rtl ? "معطل" : "Disabled"} />
        <Switch label={rtl ? "تنبيهات" : "Notifications"} />
        <Button tone="neutral" variant="outlined">{rtl ? "حفظ" : "Save"}</Button>
        <IconButton label={rtl ? "إضافة دورة" : "Add course"}><CheckIcon /></IconButton>
      </Stack>
      <ToggleButtonGroup label={rtl ? "عرض الدورة" : "Course view"} defaultSelectedIds={["short"]}
        options={[{ id: "short", label: rtl ? "شبكة" : "Grid" }, { id: "long", label: rtl ? "بطاقات الدورات" : "Course cards" }]} />
    </ThemeScope>;
  }))))}
</div> };

export const LocalizedNavigation:Story={render:(_args,{globals})=>{
 const rtl=globals.locale.startsWith('ar');
 const labels=rtl?['المؤسسة التعليمية والبرامج الدولية','مكتبة مواد التعلم والتطوير المهني','خطة التعاون بين المدرسين والمتعلمين']:['Educational organization and international programs','Learning materials and professional development library','Teaching and learner collaboration plan'];
 const details=rtl?'مراجعة مواد التعلم والمستندات الداعمة قبل نشر الدورة التدريبية':'Review learning materials and supporting documents before publishing the course';
 return <SGTranslationProvider value={{locale:globals.locale,useNamespace:()=>{},t:(key,options)=>key==='common.ui.breadcrumbs'&&rtl?'مسار التنقل':formatIcuMessage(options.defaultMessage,globals.locale,options.values)}}>
  <Provider theme={globals.theme} density={globals.density} dir={rtl?'rtl':'ltr'} data-testid="localized-navigation" style={{width:'100%',maxWidth:'100%',minWidth:0,boxSizing:'border-box'}}>
   <Stack gap={3}>
    <Breadcrumbs items={labels.map((label,index)=>({id:String(index),label,href:index<2?`#level-${index}`:undefined}))} />
    <Navigation label={rtl?'التنقل في مساحة العمل':'Workspace navigation'}><List>{labels.map((label,index)=><ListItem key={label}><NavigationItem href={`#section-${index}`} current={index===1}>{label}</NavigationItem></ListItem>)}</List></Navigation>
    <Disclosure label={details} defaultExpanded><Typography>{labels[2]}</Typography><Link href="#support">{rtl?'تواصل مع فريق الدعم التعليمي':'Contact the learning support team'}</Link></Disclosure>
   </Stack>
  </Provider>
 </SGTranslationProvider>;
}};

function LocalizedCards({globals,instructor=false}:{globals:FixtureGlobals;instructor?:boolean}) {
 const [page,setPage]=useState(0),[pageSize,setPageSize]=useState(1);
 const rtl=globals.locale.startsWith('ar');
 const messages:Record<string,string>={
  'common.ui.pagination.displayedRows':'{from}-{to} من {count}','common.ui.pageOfCount':'الصفحة {page} من {count}',
  'common.ui.pageSize':'صفوف في الصفحة','common.ui.firstPage':'الصفحة الأولى','common.ui.previousPage':'الصفحة السابقة','common.ui.nextPage':'الصفحة التالية','common.ui.lastPage':'الصفحة الأخيرة',
  'card.status.active':'نشط','card.learnersCount':'{count} متعلمون','card.lastLearnerActivity.recent':'نشاط حديث','card.lastLearnerActivity.label':'آخر نشاط للمتعلمين: {value}',
  'card.progress':'تقدم الدورة','card.upNext':'النشاط التالي: {activity}','card.details':'التفاصيل','card.continue':'متابعة','due.absoluteWithTime':'الموعد {date} الساعة {time}'
 };
 const rows=Array.from({length:3},(_,index)=>({id:String(index),title:rtl?`التخطيط التعاوني ومراجعة مواد التعلم للمجموعات الدولية ${index+1}`:`Collaborative planning and learning materials review for international cohorts ${index+1}`}));
 return <SGTranslationProvider value={{locale:globals.locale,useNamespace:()=>{},t:(key,options)=>formatIcuMessage(rtl&&messages[key]?messages[key]:options.defaultMessage,globals.locale,options.values)}}>
  <Provider theme={globals.theme} density={globals.density} dir={rtl?'rtl':'ltr'} data-testid="localized-cards" style={{width:'100%',maxWidth:'100%',minWidth:0,boxSizing:'border-box'}}>
   <CardCollectionWithFooter rows={rows} getRowId={row=>row.id} page={page} pageSize={pageSize} pageSizeOptions={[1,2]} onPageChange={setPage} onPageSizeChange={setPageSize} paginationLabel={rtl?'صفحات الدورات التدريبية':'Course collection pages'}
    renderCard={row=>instructor?<InstructorClassCard className={row.title} siteName={rtl?'المؤسسة الدولية للتعلم والتطوير المهني':'International organization for learning and professional development'} status="active" learnerCount={28} lastLearnerActivityLabel="Recent activity" actionLabel={rtl?'مراجعة الدورة ومواد التعلم':'Review course and learning materials'} actionHref="#review-course" />:
     <LearnerClassCard courseName={row.title} instructorName={rtl?'فريق التدريس والتعاون الدولي':'International teaching and collaboration team'} progressPercent={62} nextActivity={rtl?'مراجعة الخطط والمستندات الداعمة':'Review plans and supporting documents'} dueAt="2026-01-01T15:05:00Z" referenceNow={new Date('2026-01-02T18:00:00Z')} detailsHref="#course-details" />}
   />
  </Provider>
 </SGTranslationProvider>;
}
export const LocalizedLearnerCards:Story={render:(_args,{globals})=><LocalizedCards globals={globals} />};
export const LocalizedInstructorCards:Story={render:(_args,{globals})=><LocalizedCards globals={globals} instructor />};

function LocalizedFields({globals}:{globals:FixtureGlobals}) {
 const rtl=globals.locale.startsWith('ar');const [query,setQuery]=useState('');
 const labels=rtl?['فريق مراجعة مواد التعلم والتطوير المهني','مجموعة التخطيط والتعاون بين المدرسين الدوليين']:['Learning materials and professional development review team','International teaching planning and collaboration group'];
 const options=labels.map((label,index)=>({id:String(index),label}));const [tags,setTags]=useState(options);
 const messages:Record<string,string>={'common.ui.showOptions':'إظهار الخيارات','common.ui.selectedOptions':'الخيارات المحددة','common.ui.removeOption':'إزالة {label}','common.ui.optionCount':'{count} خيارات متاحة','common.ui.removeTag':'إزالة {label}'};
 return <SGTranslationProvider value={{locale:globals.locale,useNamespace:()=>{},t:(key,options)=>formatIcuMessage(rtl&&messages[key]?messages[key]:options.defaultMessage,globals.locale,options.values)}}>
  <Provider theme={globals.theme} density={globals.density} dir={rtl?'rtl':'ltr'} data-testid="localized-fields" style={{width:'100%',maxWidth:'100%',minWidth:0,boxSizing:'border-box'}}><Stack gap={4}>
   <TextArea label={rtl?'ملاحظات مراجعة مواد التعلم':'Learning materials review notes'} defaultValue={labels[0]} rows={3} />
   <RadioGroup label={rtl?'فريق المراجعة':'Review team'} defaultValue="0" options={options.map(option=>({value:option.id,label:option.label}))} />
   <ComboBox label={rtl?'المجموعة التعليمية':'Teaching group'} options={options} />
   <AsyncMultiSelect label={rtl?'دعوة المتعاونين':'Invite collaborators'} query={query} onQueryChange={setQuery} options={options.filter(option=>option.label.includes(query))} />
   <TagGroup label={rtl?'فرق التخطيط المختارة':'Selected planning teams'} items={tags} onRemove={ids=>setTags(current=>current.filter(item=>!ids.includes(item.id)))} />
   <Avatar alt={rtl?'منسق فريق التعلم الدولي':'International learning team coordinator'} fallback={rtl?'مت':'SG'} />
  </Stack></Provider>
 </SGTranslationProvider>;
}
export const LocalizedFieldsPresentation:Story={render:(_args,{globals})=><LocalizedFields globals={globals} />};

function LocalizedActions({globals,navigator=false}:{globals:FixtureGlobals;navigator?:boolean}) {
 const rtl=globals.locale.startsWith('ar');const [title,setTitle]=useState(rtl?'مراجعة مواد التعلم والتعاون الدولي':'Review learning materials and international collaboration');
 const initial=rtl?['مقدمة للتخطيط والتعاون بين فرق التدريس الدولية','مراجعة مواد التعلم والمستندات الداعمة قبل النشر']:['Introduction to international teaching team planning and collaboration','Review the learning materials and supporting documents before publication'];
 const [pages,setPages]=useState(initial.map((title,index)=>({key:String(index),title}))),[active,setActive]=useState<string|null>('0');
 const messages:Record<string,string>={'common.ui.editTitle':'تعديل العنوان','common.ui.documentTitle':'عنوان المستند','common.ui.moreActions':'المزيد من الإجراءات','common.ui.add':'إضافة','common.ui.save':'حفظ','common.ui.cancel':'إلغاء','common.ui.close':'إغلاق',
 'experience.pages.title':'الصفحات','experience.pages.editName':'تعديل اسم الصفحة','experience.pages.name':'اسم الصفحة','experience.pages.actions':'إجراءات {title}','experience.pages.position':'الصفحة {number}','experience.pages.active':'نشط','common.ui.remove':'إزالة','experience.pages.moveUp':'نقل لأعلى','experience.pages.moveDown':'نقل لأسفل'};
 const detail=rtl?'مراجعة الأذونات ومواد التعلم قبل النشر للمجموعات الدولية':'Review permissions and learning materials before publication to international cohorts';
 return <SGTranslationProvider value={{locale:globals.locale,useNamespace:()=>{},t:(key,options)=>formatIcuMessage(rtl&&messages[key]?messages[key]:options.defaultMessage,globals.locale,options.values)}}>
  <Provider theme={globals.theme} density={globals.density} dir={rtl?'rtl':'ltr'} data-testid="localized-actions" style={{width:'100%',maxWidth:'100%',minWidth:0,boxSizing:'border-box'}}>
   {navigator?<ExperiencePageNavigator style={{blockSize:'28rem'}} pages={pages} activePageKey={active} onSelectPage={setActive} onAddPage={()=>setPages(current=>[...current,{key:String(current.length),title:detail}])} onRemovePage={key=>setPages(current=>current.filter(page=>page.key!==key))} onRenamePage={(key,title)=>setPages(current=>current.map(page=>page.key===key?{...page,title}:page))} onReorderPages={(source,target)=>setPages(current=>{const next=[...current];const sourceIndex=next.findIndex(page=>page.key===source),targetIndex=next.findIndex(page=>page.key===target);const [page]=next.splice(sourceIndex,1);next.splice(targetIndex,0,page);return next;})} />:
    <Stack gap={4}>
     <EditableTitleField title={title} onSave={setTitle} />
     <SplitAction label={rtl?'حفظ خطة التعلم للمراجعة':'Save learning plan for review'} items={[{id:'review',label:detail},{id:'disabled',label:rtl?'غير متاح':'Unavailable',disabled:true}]} onPress={()=>{}} onAction={()=>{}} />
     <ButtonGroup label={rtl?'إجراءات المراجعة':'Review actions'} orientation="vertical" joined><Button variant="outlined">{rtl?'مراجعة المسودة مع فريق التدريس':'Review the draft with the teaching team'}</Button><Button variant="outlined">{rtl?'حفظ المستندات الداعمة للمراجعة':'Save supporting documents for review'}</Button></ButtonGroup>
     <Popover title={rtl?'إرشادات مراجعة الدورة':'Course review guidance'} trigger={<Button>{rtl?'فتح إرشادات المراجعة':'Open review guidance'}</Button>}><Typography>{detail}</Typography><TextField label={rtl?'ملاحظة المراجعة':'Review note'} autoFocus /></Popover>
     <Tooltip delay={0} closeDelay={0} content={detail} trigger={<Button>{rtl?'إرشادات النشر':'Publication guidance'}</Button>} />
    </Stack>}
  </Provider>
 </SGTranslationProvider>;
}
export const LocalizedActionsPresentation:Story={render:(_args,{globals})=><LocalizedActions globals={globals} />};
export const LocalizedNavigatorPresentation:Story={render:(_args,{globals})=><LocalizedActions globals={globals} navigator />};

function LocalizedDates({globals}:{globals:FixtureGlobals}) {
 const [touch,setTouch]=useState(false);
 const rtl=globals.locale.startsWith('ar');const messages:Record<string,string>={
 'common.ui.chooseDate':'اختر {label}','common.ui.previousMonth':'الشهر السابق','common.ui.nextMonth':'الشهر التالي','common.ui.startDate':'تاريخ البداية','common.ui.endDate':'تاريخ النهاية','common.ui.clear':'مسح','common.ui.cancel':'إلغاء','common.ui.apply':'تطبيق','common.ui.datePresets':'فترات التاريخ','common.ui.noDates':'لم يتم تحديد تواريخ',
 'common.ui.dateRangePreview':'معاينة الفترة: {start} – {end}. اختر تاريخ النهاية للمتابعة.','common.ui.dateRangePreviewContext':'البداية: {anchor}. النهاية الحالية: {endpoint}. المسودة: {draft}. تطبيق يحفظ المسودة.'};
 const range={start:'2026-10-12',end:'2026-10-16'};
 return <SGTranslationProvider value={{locale:globals.locale,useNamespace:()=>{},t:(key,options)=>formatIcuMessage(rtl&&messages[key]?messages[key]:options.defaultMessage,globals.locale,options.values)}}>
  <Provider theme={globals.theme} density={globals.density} dir={rtl?'rtl':'ltr'} interactionMode={touch?'touch':'pointer'} data-testid="localized-dates" style={{width:'100%',maxWidth:'100%',minWidth:0,boxSizing:'border-box'}}><Stack gap={4}><Button onPress={()=>setTouch(value=>!value)}>{rtl?'تبديل أهداف اللمس':'Toggle touch targets'}</Button>
   <div data-testid="date-entry"><DateField label={rtl?'تاريخ مراجعة مواد التعلم':'Learning materials review date'} defaultValue="2026-10-15" name="review-date" /></div>
   <div data-testid="time-entry"><TimeField entryMode="segments" label={rtl?'وقت اجتماع فريق التدريس الدولي':'International teaching team meeting time'} defaultValue="12:30:00" hourCycle={24} name="meeting-time" /></div>
   <div data-testid="inline-calendar"><Calendar navigation="arrows" label={rtl?'تقويم التعاون الدولي':'International collaboration calendar'} defaultValue="2026-10-15" defaultFocusedDate="2026-10-15" /></div>
   <DatePicker entryMode="segments" label={rtl?'تاريخ نشر مواد التعلم':'Learning materials publication date'} defaultValue="2026-10-15" />
   <DateRangePicker fieldMode="button" label={rtl?'فترة مراجعة الخطة التعليمية':'Learning plan review period'} defaultValue={range} months={1} />
   <div data-testid="inline-range"><DateRangeSelector label={rtl?'فترة التخطيط التعاوني':'Collaborative planning period'} defaultValue={range} months={1} /></div>
  </Stack></Provider>
 </SGTranslationProvider>;
}
export const LocalizedDatesPresentation:Story={render:(_args,{globals})=><LocalizedDates globals={globals} />};

function LocalizedTypographyTable({globals}:{globals:FixtureGlobals}) {
 const rtl=globals.locale.startsWith('ar');const [density,setDensity]=useState(globals.density);
 const opposite=globals.density==='compact'?'comfortable':'compact';
 const sample=rtl?'خطط التعلم والتعاون بين فرق التدريس الدولية ومراجعة المستندات الداعمة':'International teaching team learning plans and collaboration with supporting document review';
 const roles=['h1','h2','h3','h4','h5','h6','body1','body2','bodyAlt2','subtitle1','subtitle2','button','caption','overline','code'] as const;
 return <SGTranslationProvider value={{locale:globals.locale,useNamespace:()=>{},t:(_key,options)=>formatIcuMessage(options.defaultMessage,globals.locale,options.values)}}>
  <Provider theme={globals.theme} density={density} interactionMode="pointer" dir={rtl?'rtl':'ltr'} data-testid="localized-typography-table" style={{width:'100%',maxWidth:'100%',minWidth:0,boxSizing:'border-box'}}><Stack gap={4}>
   <Button onPress={()=>setDensity(value=>value==='compact'?'comfortable':'compact')}>{rtl?'تبديل كثافة الحاوية':'Toggle parent density'}</Button>
   <Box data-testid="inherited-density"><Button>{rtl?'حفظ المسودة':'Save draft'}</Button></Box>
   <ThemeScope density={opposite} data-testid="explicit-density"><Button>{rtl?'مراجعة التغييرات':'Review changes'}</Button></ThemeScope>
   {[0,1,2].map(group=><Stack key={group} gap={3} data-testid={`typeface-group-${group}`}>
    {roles.slice(group*5,group*5+5).map(variant=><Box key={variant}><Typography as="h3" variant="body2" tone="muted">{variant}</Typography><Typography as={variant==='code'?'code':'p'} variant={variant} data-testid="typeface-sample">{sample}</Typography></Box>)}
   </Stack>)}
   <Box role="region" aria-label={rtl?'منطقة تمرير جدول الدورات':'Course table scroll area'} tabIndex={0} style={{overflowX:'auto',maxInlineSize:'100%'}} data-testid="table-viewport">
    <Table style={{minInlineSize:'36rem'}}>
     <TableCaption>{rtl?'خطط التعلم ومراجعة المواد للدورات الدولية':'Learning plans and materials review for international courses'}</TableCaption>
     <TableHead><TableRow><TableHeaderCell id="course-name">{rtl?'الدورة وخطة التعلم':'Course and learning plan'}</TableHeaderCell><TableHeaderCell id="course-status">{rtl?'حالة المراجعة':'Review status'}</TableHeaderCell></TableRow></TableHead>
     <TableBody><TableRow><TableHeaderCell scope="row" id="plan-name">{sample}</TableHeaderCell><TableCell headers="course-status plan-name"><Typography>{rtl?'جاهز للمراجعة من قبل فرق التدريس ومسؤولي البرامج':'Ready for review by teaching teams and program administrators'}</Typography><Link href="#review-learning-plan">{rtl?'مراجعة الخطة':'Review plan'}</Link></TableCell></TableRow></TableBody>
     <TableFoot><TableRow><TableCell colSpan={2}>{rtl?'يتولى التطبيق حفظ التغييرات وإدارة صلاحيات المراجعة.':'The host saves changes and manages review permissions.'}</TableCell></TableRow></TableFoot>
    </Table>
   </Box>
  </Stack></Provider>
 </SGTranslationProvider>;
}
export const LocalizedTypographyTablePresentation:Story={render:(_args,{globals})=><LocalizedTypographyTable globals={globals} />};

/** Localized grid compositions share production layout; the host owns row state. */
function LocalizedGridPresentation({globals,kind}:{globals:FixtureGlobals;kind:'owned'|'shell'|'learner'|'proof'}){
 const rtl=globals.locale.startsWith('ar');const[interactionMode,setInteractionMode]=useState<'pointer'|'touch'>('pointer');
 const names=rtl?['خطة التعاون الدولي لتطوير مواد التعلم والتدريس للفرق التعليمية','برنامج مراجعة المستندات والأنشطة للمتعلمين والمدرسين','خطة التطوير المهني للفرق الدولية']:['International collaboration plan for learning materials and teaching teams','Supporting documents and activities review for learners and instructors','Professional development plan for international teams'];
 const [rows,setRows]=useState(()=>names.map((name,index)=>({id:String(index+1),name,status:rtl?'جاهز لمراجعة الفريق التعليمي':'Ready for teaching team review',courseName:name,instructorName:rtl?'منسق الفريق التعليمي':'Teaching team coordinator',progressPercent:45,nextActivity:rtl?'مراجعة المواد':'Review materials',siteName:rtl?'المؤسسة التعليمية ومركز التعاون الدولي':'Educational organization and international collaboration center',dueAt:'2099-10-15T12:00:00Z'})));
 const words:Record<string,string>={'Search':'بحث','Refresh':'تحديث','Columns':'الأعمدة','Sort':'ترتيب','Filter':'تصفية','Data toolbar':'أدوات البيانات','Cards':'بطاقات','List':'قائمة','View mode':'طريقة العرض','Select page':'تحديد الصفحة','Select {label}':'تحديد {label}','Reorder {label}':'إعادة ترتيب {label}','Move {label} up':'نقل {label} لأعلى','Move {label} down':'نقل {label} لأسفل','Resize {label}':'تغيير عرض {label}','Sort {label}':'ترتيب {label}','Name':'الاسم','Site':'الموقع','Due':'الاستحقاق','Section ID':'معرف الشعبة','Actions':'الإجراءات','Details':'التفاصيل','Continue':'متابعة','Rows per page':'صفوف الصفحة','First page':'الصفحة الأولى','Last page':'الصفحة الأخيرة','Page {page} of {count}':'الصفحة {page} من {count}','Page {page}':'الصفحة {page}','{from}-{to} of {count}':'{from}–{to} من {count}','Reorder':'إعادة الترتيب','Selection':'التحديد','Selection actions':'إجراءات التحديد','None':'لا شيء','Select none':'إلغاء التحديد','Next page':'الصفحة التالية','Previous page':'الصفحة السابقة','{count} selected':'تم تحديد {count}','Clear and close search':'مسح البحث وإغلاقه'};
 const tr=(message:string)=>rtl?(words[message]??message):message;
 const title=rtl?'خطط الدورات والتعاون الدولي':'Course plans and international collaboration';
 const columns:AppDataGridColumn<typeof rows[number]>[]=[{field:'name',headerName:rtl?'الدورة وخطة التعلم':'Course and learning plan',minWidth:230,flex:1,cellType:'link',getLink:row=>({href:'#course-'+row.id})},{field:'status',headerName:rtl?'حالة المراجعة':'Review status',width:240}];
 const move=(source:string,target:string,position:'before'|'after')=>setRows(previous=>{const item=previous.find(row=>row.id===source)!;const next=previous.filter(row=>row.id!==source);next.splice(next.findIndex(row=>row.id===target)+(position==='after'?1:0),0,item);return next;});
 return <SGTranslationProvider value={{locale:globals.locale,useNamespace:()=>{},t:(_key,options)=>formatIcuMessage(tr(options.defaultMessage),globals.locale,options.values)}}>
  <Provider theme={globals.theme} density={globals.density} interactionMode={interactionMode} dir={rtl?'rtl':'ltr'} data-testid="localized-grid" style={{width:'100%',maxWidth:'100%',minWidth:0,boxSizing:'border-box'}}>
   <Typography as="h2" variant="h4">{title}</Typography><Button onPress={()=>setInteractionMode(value=>value==='pointer'?'touch':'pointer')}>{rtl?'تبديل أهداف اللمس':'Toggle touch targets'}</Button>
   <Box data-testid="grid-host" style={{height:kind==='proof'?'auto':'44rem',minWidth:0,maxWidth:'100%'}}>
    {kind==='owned'&&<AppDataGrid label={title} rows={rows} columns={columns} getRowLabel={row=>row.name} pageSizeOptions={[10]} defaultPaginationModel={{page:0,pageSize:10}} rowDrag={{onReorder:({sourceRowId,targetRowId,position})=>move(sourceRowId,targetRowId,position)}} />}
    {kind==='shell'&&<AppDataGridShell label={title} rows={rows} columns={columns} getRowLabel={row=>row.name} pageSizeOptions={[10]} defaultPaginationModel={{page:0,pageSize:10}} view={{cards:{renderCard:row=><Card><CardContent><Typography as="h3" variant="subtitle1">{row.name}</Typography><Link href={'#course-'+row.id}>{rtl?'مراجعة الخطة':'Review plan'}</Link></CardContent></Card>}}} />}
    {kind==='learner'&&<LearnerClassesDataGrid label={title} rows={rows} getRowLabel={row=>row.courseName} pageSizeOptions={[10]} defaultPaginationModel={{page:0,pageSize:10}} />}
    {kind==='proof'&&<DataGrid label={title} rows={rows} columns={[{id:'name',label:columns[0].headerName!,minWidth:230,getValue:row=>row.name,renderCell:row=><Link href={'#course-'+row.id}>{row.name}</Link>},{id:'status',label:columns[1].headerName!,minWidth:240,getValue:row=>row.status}]} getRowId={row=>row.id} getRowLabel={row=>row.name} onRefresh={()=>{}} onReorder={move} />}
   </Box>
  </Provider>
 </SGTranslationProvider>;
}
export const LocalizedOwnedGridPresentation:Story={render:(_args,{globals})=><LocalizedGridPresentation globals={globals} kind="owned" />};
export const LocalizedShellGridPresentation:Story={render:(_args,{globals})=><LocalizedGridPresentation globals={globals} kind="shell" />};
export const LocalizedLearnerGridPresentation:Story={render:(_args,{globals})=><LocalizedGridPresentation globals={globals} kind="learner" />};
export const LocalizedProofGridPresentation:Story={render:(_args,{globals})=><LocalizedGridPresentation globals={globals} kind="proof" />};

/** Each opening owns a fresh editor dialog draft; the host accepts its submission. */
function LocalizedEditorDialogs({globals}:{globals:FixtureGlobals}){
 const rtl=globals.locale.startsWith('ar');const[open,setOpen]=useState<'columns'|'image'|'link'|null>(null);const[notice,setNotice]=useState('');
 const words:Record<string,string>={'Choose columns layout':'اختيار تخطيط الأعمدة','Columns layout':'تخطيط الأعمدة','2 columns (equal width)':'عمودان بعرض متساو','2 columns (25% - 75%)':'عمودان بنسب خمسة وعشرين وخمسة وسبعين بالمئة','3 columns (equal width)':'ثلاثة أعمدة بعرض متساو','3 columns (25% - 50% - 25%)':'ثلاثة أعمدة بنسب خمسة وعشرين وخمسين وخمسة وعشرين بالمئة','4 columns (equal width)':'أربعة أعمدة بعرض متساو','Insert':'إدراج','Cancel':'إلغاء','Close':'إغلاق','Insert Image':'إدراج صورة','Search Files':'البحث عن الملفات','Choose image':'اختيار صورة','Image description':'وصف الصورة','Describe the image for readers who cannot see it. Leave empty for a decorative image.':'صف الصورة للقراء الذين لا يمكنهم رؤيتها واترك الحقل فارغا للصورة الزخرفية.','Drag and drop an image here':'اسحب الصورة وأفلتها هنا','Insert Link':'إدراج رابط','Display Text':'النص المعروض','URL':'عنوان الرابط','Apply':'تطبيق','Enter a valid URL using an allowed protocol or a relative path.':'أدخل عنوان رابط صالحا باستخدام بروتوكول مسموح أو مسار نسبي.'};
 const long=rtl?'خطة التعاون بين فرق التدريس والتطوير المهني ومراجعة مواد التعلم الدولية':'International teaching team collaboration and professional development learning materials review';
 return <SGTranslationProvider value={{locale:globals.locale,useNamespace:()=>{},t:(_key,options)=>formatIcuMessage(rtl?(words[options.defaultMessage]??options.defaultMessage):options.defaultMessage,globals.locale,options.values)}}>
  <Provider theme={globals.theme} density={globals.density} interactionMode="pointer" dir={rtl?'rtl':'ltr'} data-testid="localized-editor-dialogs"><Stack gap={3}>
   <Button onPress={()=>setOpen('columns')}>{rtl?'فتح تخطيط الأعمدة':'Open columns layout'}</Button><Button onPress={()=>setOpen('image')}>{rtl?'فتح إدراج صورة':'Open image insertion'}</Button><Button onPress={()=>setOpen('link')}>{rtl?'فتح إدراج رابط':'Open link insertion'}</Button>
   {notice&&<Typography role="status">{notice}</Typography>}
   <ColumnsLayoutModal open={open==='columns'} onClose={()=>setOpen(null)} onSubmit={preset=>{setNotice(rtl?'تم إدراج تخطيط الأعمدة':'Columns layout inserted');setOpen(null);}} />
   <ImageUploadModal open={open==='image'} enableAltText title={long} onClose={()=>setOpen(null)} onSubmit={(_file,alt)=>{setNotice(alt??'');setOpen(null);}} />
   <LinkUrlModal open={open==='link'} initialDisplayText={long} initialUrl="/learning-plan" onClose={()=>setOpen(null)} onSubmit={({displayText})=>{setNotice(displayText);setOpen(null);}} />
  </Stack></Provider>
 </SGTranslationProvider>;
}
export const LocalizedEditorDialogsPresentation:Story={render:(_args,{globals})=><LocalizedEditorDialogs globals={globals} />};
