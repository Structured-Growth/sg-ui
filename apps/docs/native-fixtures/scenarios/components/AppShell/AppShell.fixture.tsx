import { Provider } from "@structured-growth/sg-ui/theme";
import { SGTranslationProvider, formatIcuMessage } from "@structured-growth/sg-ui/i18n";
import { AuthShell } from "@structured-growth/sg-ui/components";
import { Link, Stack } from "@structured-growth/sg-ui/experimental";
import type { Meta, StoryObj, FixtureGlobals } from "../../../types";
import { Typography } from "@structured-growth/sg-ui/experimental";
import { SideNavigation, type SideNavigationModel } from "@structured-growth/sg-ui/components";
import { AppShell } from "@structured-growth/sg-ui/components";
import { Button } from "@structured-growth/sg-ui/components";
import { TextField } from "@structured-growth/sg-ui/experimental";
import { tokens } from "@structured-growth/sg-ui/tokens";
import { useState } from "react";
const model: SideNavigationModel = { user: { initials: "TH", name: "Thomas Hall", organization: "Structured Growth" }, rootMenu: { id: "root", sections: [{ id: "courses", title: "Workspace", items: [{ id: "overview", label: "Overview", href: "/", active: true }, { id: "courses", label: "Courses", children: [{ id: "course", label: "Sample course", href: "/course" }] }] }] } };
const meta = { title: "Layout/AppShell", component: AppShell, parameters: { layout: "fullscreen" }, tags: ["autodocs"] } satisfies Meta<typeof AppShell>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { children: undefined, navigation: undefined }, render: () => <AppShell mainLabel="Workspace" navigation={<SideNavigation model={model} />}><Typography as="h1" variant="h2">Main Area Placeholder</Typography></AppShell> };
export const IndependentScrollAndReflow: Story = { args: { children: undefined, navigation: undefined }, render: () => <AppShell mainLabel="Long workspace" navigation={<SideNavigation model={{ ...model, rootMenu: { id: "long", sections: [{ id: "courses", title: "Courses", items: Array.from({ length: 35 }, (_, i) => ({ id: `course-${i}`, label: `Course ${i + 1}`, href: `/course/${i}` })) }] } }} />}><Typography as="h1" variant="h2">Responsive workspace</Typography>{Array.from({ length: 45 }, (_, i) => <Typography key={i}>Learning content section {i + 1}</Typography>)}</AppShell> };

// A fullscreen host removes the preview decorator's page gutters from viewport
// measurements. The production theme/density scope still comes from that decorator.
export const NativeResponsiveWorkspace: Story = {
  args: { children: undefined, navigation: undefined },
  render: () => <AppShell mainLabel="Responsive host workspace" style={{ position: "fixed", inset: 0 }}
    navigation={<SideNavigation model={{ ...model, rootMenu: { id: "native", sections: [{ id: "courses", title: "Courses", items: Array.from({ length: 35 }, (_, i) => ({ id: `course-${i}`, label: `Course ${i + 1}`, href: `#course-${i}` })) }] } }} />}>
    <div style={{ padding: tokens.space4, display: "flex", flexDirection: "column", gap: tokens.space4 }}>
      <Typography as="h1" variant="h2">Responsive host workspace</Typography>
      <TextField label="Host workspace title" defaultValue="Learning plan" />
      {Array.from({ length: 12 }, (_, i) => <section key={i} aria-label={`Host section ${i + 1}`}>
        <Typography as="h2" variant="h3">Learning content section {i + 1}</Typography>
        <Typography>Host-owned course content wraps within the available main area as navigation changes between a side rail and a stacked region.</Typography>
        <Button variant="outlined">Host action {i + 1}</Button>
      </section>)}
    </div>
  </AppShell>,
};

function ContainerWorkspaces() {
  const [width, setWidth] = useState("20rem");
  const longModel: SideNavigationModel = { ...model, rootMenu: { id: "container", sections: [{ id: "courses", title: "Courses", items: Array.from({ length: 35 }, (_, i) => ({ id: `course-${i}`, label: `Course ${i + 1}`, href: `#course-${i}` })) }] } };
  return <div style={{ padding: tokens.space4, display: "flex", flexDirection: "column", gap: tokens.space4 }}>
    <Button onPress={() => setWidth(value => value === "20rem" ? "56rem" : "20rem")}>Resize first shell</Button>
    {(["First", "Second"] as const).map((name, index) => <AppShell key={name}
      style={{ inlineSize: index === 0 ? width : "56rem", maxInlineSize: "100%", blockSize: "36rem" }}
      mainId={`container-main-${index}`} mainLabel={`${name} container workspace`}
      navigation={<SideNavigation model={longModel} aria-label={`${name} container navigation`} />}>
      <div style={{ padding: tokens.space4, display: "flex", flexDirection: "column", gap: tokens.space4 }}>
        <Typography as="h1" variant="h2">{name} workspace</Typography>
        <TextField label={`${name} host title`} defaultValue="Learning plan" />
        {Array.from({ length: 12 }, (_, i) => <section key={i}>
          <Typography as="h2" variant="h3">Course section {i + 1}</Typography>
          <Typography>Host content remains available as its container width changes.</Typography>
          <Button variant="outlined">{name} host action {i + 1}</Button>
        </section>)}
      </div>
    </AppShell>)}
  </div>;
}

export const IndependentContainers: Story = {
  args: { children: undefined, navigation: undefined },
  render: () => <ContainerWorkspaces />,
};

function LocalizedShellContent({rtl,auth=false}:{rtl:boolean;auth?:boolean}) {
  const [saved,setSaved]=useState(false);
  const title=rtl?'مساحة عمل التخطيط والتعاون بين فرق التدريس الدولية':'International teaching team planning and collaboration workspace';
  const field=rtl?'عنوان خطة التعلم':'Learning plan title';
  const submit=rtl?'حفظ خطة التعلم':'Save learning plan';
  const form=<form onSubmit={event=>{event.preventDefault();setSaved(true);}}><Stack gap={3}>
    <TextField label={field} defaultValue={rtl?'خطة التعلم التعاوني':'Collaborative learning plan'} />
    <Button type="submit">{submit}</Button>
    {saved && <Typography role="status">{rtl?'تم حفظ المسودة للمراجعة.':'Draft saved for review.'}</Typography>}
  </Stack></form>;
  if(auth)return <AuthShell title={title} subtitle={rtl?'تدير مؤسستك هذا النموذج وتراجع المعلومات قبل المتابعة.':'Your organization manages this form and reviews the information before continuing.'}
    footerContent={<Link href="#support">{rtl?'تواصل مع فريق الدعم والمساعدة في المؤسسة التعليمية':'Contact your school administration and learning support team'}</Link>}>{form}</AuthShell>;
  const sideModel:SideNavigationModel={user:{initials:rtl?'مت':'SG',name:rtl?'مجتمع التعلم':'Learning community',organization:rtl?'البرامج الدولية':'International programs'},rootMenu:{id:'localized',sections:[{id:'courses',title:rtl?'الدورات التدريبية':'Courses',items:Array.from({length:14},(_,index)=>({id:String(index),label:rtl?`خطة التعلم والتعاون للمجموعة الدولية ${index+1}`:`International collaborative learning plan ${index+1}`,href:`#course-${index}`,active:index===0}))}]}};
  return <AppShell mainLabel={title} style={{blockSize:'100dvh'}} navigation={<SideNavigation model={sideModel} aria-label={rtl?'التنقل في الدورات':'Course navigation'} />}>
    <Stack gap={3} style={{padding:tokens.space4,minWidth:0}}>
      <Typography as="h1" variant="h2">{title}</Typography>{form}
      {Array.from({length:12},(_,index)=><section key={index}><Typography as="h2" variant="h3">{rtl?`مواد التعلم والمستندات الداعمة ${index+1}`:`Learning materials and supporting documents ${index+1}`}</Typography><Typography>{rtl?'راجع مواد الدورة التدريبية وخطط التعلم بالتعاون مع فريق التدريس قبل النشر.':'Review the course materials and learning plans together with the teaching team before publication.'}</Typography></section>)}
    </Stack>
  </AppShell>;
}
function LocaleScope({globals,auth=false}:{globals:FixtureGlobals;auth?:boolean}) {
 const rtl=globals.locale.startsWith('ar');
 const messages:Record<string,string>={'landmark':'التنقل الرئيسي','expand':'توسيع التنقل','collapse':'طي التنقل','user.menu':'الحساب والمؤسسة','user.manageProfile':'إدارة الملف الشخصي','user.addAccount':'إضافة حساب','user.logout':'تسجيل الخروج'};
 return <SGTranslationProvider value={{locale:globals.locale,useNamespace:()=>{},t:(key,options)=>rtl&&messages[key]?messages[key]:formatIcuMessage(options.defaultMessage,globals.locale,options.values)}}>
   <Provider theme={globals.theme} density={globals.density} dir={rtl?'rtl':'ltr'} data-testid="localized-shell" style={{width:'100%',maxWidth:'100%',minWidth:0,boxSizing:'border-box'}}><LocalizedShellContent rtl={rtl} auth={auth} /></Provider>
 </SGTranslationProvider>;
}
export const LocalizedPresentation:Story={args:{children:undefined,navigation:undefined},render:(_args,{globals})=><LocaleScope globals={globals} />};
export const LocalizedAuthPresentation:Story={args:{children:undefined,navigation:undefined},render:(_args,{globals})=><LocaleScope globals={globals} auth />};
