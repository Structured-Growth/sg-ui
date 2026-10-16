import { useState } from "react";
import { AppPageTabs } from "@structured-growth/sg-ui/components";
import { Provider } from "@structured-growth/sg-ui/theme";
import { SGTranslationProvider, formatIcuMessage } from "@structured-growth/sg-ui/i18n";
import type { Meta, StoryObj } from "../../../types";
import { GroupIcon } from "@structured-growth/sg-ui/experimental/icons";
import { SchoolIcon } from "@structured-growth/sg-ui/experimental/icons";
import { Button } from "@structured-growth/sg-ui/components";
import { AppPageHeader } from "@structured-growth/sg-ui/components";

const meta = {
  title: "Layout/AppPageHeader",
  component: AppPageHeader,
  args: {
    title: "My Classes",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AppPageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Minimal: Story = {
  args: {
    title: "Biology 101",
  },
};

export const DetailStyle: Story = {
  args: {
    title: "Biology 101",
    breadcrumbs: [
      { href: "/sections/instructor", label: "Classes" },
      { label: "Section" },
    ],
    description: "Introductory section with mixed-ability learner groups.",
    metaItems: [
      { id: "learners", icon: <GroupIcon />, label: "28 Learners" },
      { id: "site", icon: <SchoolIcon />, label: "Hogwarts" },
    ],
    moreMenuItems: [
      { id: "edit", label: "Edit Section" },
      { id: "duplicate", label: "Duplicate" },
      { id: "archive", label: "Archive", danger: true },
    ],
  },
};

export const CondensedBreadcrumbs: Story = {
  args: {
    title: "Biology 101",
    breadcrumbs: [
      { href: "/org", label: "Organization" },
      { href: "/org/content", label: "Content Library" },
      { href: "/org/content/courses", label: "Courses" },
      { label: "Section" },
    ],
  },
};

export const MoreMenu: Story = {
  args: {
    title: "Biology 101",
    breadcrumbs: [
      { href: "/sections/instructor", label: "Classes" },
      { label: "Biology 101" },
    ],
    moreMenuItems: [
      { id: "edit", label: "Edit Section" },
      { id: "duplicate", label: "Duplicate" },
      { id: "open", label: "Open in New Tab", href: "/sections/biology-101/instructor/me" },
      { id: "archive", label: "Archive", danger: true },
    ],
  },
};

export const ActionButtons: Story = {
  args: {
    title: "Biology 101",
    breadcrumbs: [
      { href: "/sections/instructor", label: "Classes" },
      { label: "Biology 101" },
    ],
    actionButtons: <Button density="compact" tone="neutral" variant="outlined">Add Course to Section...</Button>,
  },
};

export const Primary: Story = { args: { title: "Courses", hierarchy: "primary" } };
export const Narrow: Story = { ...DetailStyle, decorators: [(Story) => <div style={{ width: 260 }}><Story /></div>] };


// Host labels deliberately include long words and several independently focusable actions.
export const ReflowActions: Story = {
  args: {
    title: "International interdisciplinary course planning and learner collaboration",
    description: "Plan accessible learning experiences across organizations and teaching teams.",
    breadcrumbs: [
      { label: "InternationalOrganizationWithAnUnbrokenHostLabel", href: "#organization" },
      { label: "Shared content library", href: "#library" },
      { label: "Professional development courses", href: "#courses" },
      { label: "Current interdisciplinary course planning workspace" },
    ],
    metaItems: [
      { icon: <GroupIcon />, label: "InternationalLearnerCollaborationNetworkWithAnUnbrokenHostLabel" },
      { icon: <SchoolIcon />, label: "North campus teaching and learning community" },
    ],
    actionButtons: <><Button tone="neutral" variant="outlined">AddCourseToAnotherSectionWithAnUnbrokenHostLabel</Button><Button tone="neutral" variant="outlined">Review learner participation</Button></>,
  },
};
export const ReflowMenu: Story = {
  args: {
    ...ReflowActions.args,
    actionButtons: undefined,
    moreMenuItems: [{ label: "Unavailable action", disabled: true }, { label: "Review course details" }, { label: "Archive course", danger: true }],
  },
};

function LocalizedHeaderTabs({ rtl }: { rtl: boolean }) {
  const [value, setValue] = useState('details');
  const names = rtl ? ['التفاصيل', 'غير متاح', 'الوصول', 'مراجعة مواد الدورة التدريبية والمستندات الداعمة من قبل فريق التدريس والإدارة', 'السجل']
    : ['Details', 'Unavailable', 'Access', 'Review the course materials and supporting documents with the teaching and administration team', 'History'];
  return <>
    <AppPageHeader title={rtl ? 'التخطيط للدورات التدريبية والتعاون بين فرق التدريس الدولية' : 'International course planning and teaching team collaboration'}
      description={rtl ? 'راجع المستندات الداعمة وخطط التعلم قبل نشر الدورة للمتعلمين.' : 'Review supporting documents and learning plans before publishing the course for learners.'}
      breadcrumbs={(rtl ? ['المؤسسة', 'مكتبة المحتوى المشترك', 'الدورات التدريبية', 'مساحة عمل الدورة الحالية'] : ['Organization', 'Shared content library', 'Courses', 'Current course workspace']).map((label,index) => ({label, href:index < 3 ? `#level-${index}` : undefined}))}
      metaItems={[{icon:<GroupIcon />,label:rtl ? 'مجتمع المتعلمين والمدرسين في البرامج الدولية' : 'International learner and teaching community'}]}
      moreMenuItems={[{label:rtl ? 'مراجعة تفاصيل الدورة' : 'Review course details'}, {label:rtl ? 'غير متاح' : 'Unavailable',disabled:true}]} />
    <AppPageTabs value={value} onChange={setValue} items={['details','unavailable','access','review','history'].map((id,index) => ({id,label:names[index],disabled:index===1,content:<p>{names[index]}</p>}))} />
  </>;
}
export const LocalizedPresentation: Story = { render: (_args, { globals }) => {
  const rtl = globals.locale.startsWith('ar');
  const messages: Record<string,string> = {'common.ui.showPath':'إظهار المسار','common.ui.moreActions':'المزيد من الإجراءات','common.ui.breadcrumbs':'مسار التنقل','common.ui.pageTabs':'أقسام الصفحة'};
  return <SGTranslationProvider value={{locale:globals.locale,useNamespace:()=>{},t:(key,options)=>rtl && messages[key] ? messages[key] : formatIcuMessage(options.defaultMessage,globals.locale,options.values)}}>
    <Provider theme={globals.theme} density={globals.density} dir={rtl?'rtl':'ltr'} data-testid="localized-header-tabs" style={{width:'100%',maxWidth:'100%',minWidth:0,boxSizing:'border-box'}}>
      <LocalizedHeaderTabs rtl={rtl} />
    </Provider>
  </SGTranslationProvider>;
} };
