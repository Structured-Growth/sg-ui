import { SGTranslationProvider, formatIcuMessage } from "@structured-growth/sg-ui/i18n";
import type { FixtureGlobals } from "../../../types";
import type { Meta, StoryObj } from "../../../types";
import { useEffect, useRef, useState } from "react";
import { PageRichTextEditorSection } from "@structured-growth/sg-ui/components";
import { Tooltip } from "@structured-growth/sg-ui/experimental";
import { AppModal } from "@structured-growth/sg-ui/components";
import { Button } from "@structured-growth/sg-ui/components";
import { AppPageTabs } from "@structured-growth/sg-ui/components";
import { TextField } from "@structured-growth/sg-ui/experimental";
import { Popover } from "@structured-growth/sg-ui/experimental";
import { Menu } from "@structured-growth/sg-ui/experimental";
import { ComboBox } from "@structured-growth/sg-ui/experimental";
import { ThemeScope, Provider } from "@structured-growth/sg-ui/theme";
const meta = { title: "Overlays/AppModal", component: AppModal, tags: ["autodocs"], args: { open: false, children: null } } satisfies Meta<typeof AppModal>;
export default meta;
type Story = StoryObj<typeof meta>;
function Preview({ tabs = false, locked = false, dark = false, full = false, custom = false, autoFocusAction = false }: { tabs?: boolean; locked?: boolean; dark?: boolean; full?: boolean; custom?: boolean; autoFocusAction?: boolean }) {
  const [open, setOpen] = useState(false); const [tab, setTab] = useState("details"); const [step, setStep] = useState(1);
  const [reason, setReason] = useState(""); const [saved, setSaved] = useState(0);
  return <Provider theme={dark ? "dark" : "light"}><Button variant="outlined" onPress={() => setOpen(true)}>Open modal</Button>
    <p>Last close: {reason || "None"}; saved: {saved}</p>
    <AppModal open={open} title="Course settings" subtitle="Host-owned settings" aria-label={custom ? "Custom settings" : undefined}
      headerContent={custom ? <h2>Custom settings</h2> : undefined} size={full ? "full" : "md"} heightMode={tabs ? "md" : "auto"}
      disableBackdropClose={locked} disableEscapeKeyDown={locked} showCloseButton onClose={value => {setReason(value); setOpen(false);}}
      steps={{ current: step, total: tabs ? 3 : 1 }}
      primaryAction={{ autoFocus: autoFocusAction, label: tabs ? "Next" : "Save", onPress: () => {setSaved(value => value + 1); if (tabs) setStep(value => value === 3 ? 1 : value + 1);} }}
      secondaryAction={{ label: "Cancel", onPress: () => {setReason("Cancel action"); setOpen(false);} }}>
      {tabs ? <AppPageTabs label="Settings" value={tab} onChange={setTab} items={[
        {id:"details",label:"Details",content:<>{Array.from({length:20},(_,index)=><TextField key={index} label={`Field ${index + 1}`} autoFocus={index === 0 && !autoFocusAction} />)}</>},
        {id:"access",label:"Access",content:<><TextField label="Permission" /><Popover title="Help" trigger={<Button>Help</Button>}><TextField label="Note" autoFocus /></Popover></>},
      ]} /> : <TextField label="Course name" autoFocus />}
    </AppModal></Provider>;
}
export const CreateSiteForm: Story = { render: () => <Preview /> };
export const MultiStepWizard: Story = { render: () => <Preview tabs /> };
export const FixedHeights: Story = { render: () => <Preview tabs /> };
export const DisableBackdropClose: Story = { render: () => <Preview locked /> };
export const DarkTabbed: Story = { render: () => <Preview tabs dark /> };
export const FullScreen: Story = { render: () => <Preview full tabs /> };
export const CustomSections: Story = { render: () => <Preview custom /> };

/** Resize to 320px or enlarge browser text: fields and footer actions stay keyboard-reachable. */
export const TextReflow: Story = { render: () => <Preview tabs />, parameters: { docs: { description: { story: "Tab through all twenty fields at narrow widths and with enlarged text. The panel scrolls independently when it fits; constrained dialog chrome falls back to scrolling the whole dialog." } } } };

export const ActionFocus: Story = { render: () => <Preview tabs autoFocusAction /> };

function ContainerSurface({ kind }: { kind: "narrow" | "wide" }) {
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(kind === "narrow" ? 360 : 800);
  const [tab, setTab] = useState("details");
  return <>
    <Button onPress={() => { setWidth(kind === "narrow" ? 360 : 800); setOpen(true); }}>Open {kind} surface</Button>
    <AppModal open={open} title={`${kind === "narrow" ? "Narrow" : "Wide"} surface settings`}
      subtitle="Resize this surface while keeping the viewport wide" size="md" width={width} height={560}
      showCloseButton onClose={() => setOpen(false)} steps={{ current: 2, total: 3, label: "Step 2 of 3: Review course settings" }}
      secondaryAction={{ label: "Cancel changes", onPress: () => setOpen(false) }} primaryAction={{ label: "Save course settings" }}>
      <Button onPress={() => setWidth(value => value === 360 ? 800 : 360)}>Toggle surface width</Button>
      <AppPageTabs label="Surface sections" value={tab} onChange={setTab} items={[
        { id: "details", label: "Details", content: <>{Array.from({ length: 20 }, (_, index) =>
          <TextField key={index} label={`Surface field ${index + 1}`} autoFocus={index === 0} />)}</> },
        { id: "access", label: "Access", content: <TextField label="Surface permission" /> },
      ]} />
    </AppModal>
  </>;
}
function ContainerBoundaryPreview() {
  return <Provider><ContainerSurface kind="narrow" /><ContainerSurface kind="wide" /></Provider>;
}

export const ContainerBoundary: Story = { render: () => <ContainerBoundaryPreview />,
  parameters: { docs: { description: { story: "C-08: At a wide viewport, open each independent 360px/800px portaled surface sequentially. Toggle width without remounting; below 30rem the step precedes full-width stacked actions. Check tab-panel scrolling, whole-dialog fallback with enlarged text, and initial/return keyboard focus." } } } };

function NestedOverlaysPreview() {
  const [open, setOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const record = (value: string) => setEvents(previous => [...previous, value]);
  return <Provider theme="dark" density="compact">
    <Button onPress={() => setOpen(true)}>Open parent</Button>
    <p role="status">Dismissals: {events.join(", ") || "None"}</p>
    <AppModal open={open} title="Parent settings" subtitle="Host-owned settings" size="md" showCloseButton
      onClose={reason => { record(`parent:${reason}`); setOpen(false); }}>
      <TextField label="Parent name" autoFocus />
      <Menu label="Settings actions" trigger={<Button>Open actions</Button>}
        items={[{ id: "review", label: "Review settings" }]} onAction={() => record("menu:review")} />
      <ComboBox label="Category" options={[{ id: "science", label: "Science" }, { id: "math", label: "Mathematics" }]} />
      <Button onPress={() => setChildOpen(true)}>Open child</Button>
      <AppModal open={childOpen} title="Child settings" size="sm" showCloseButton
        onClose={reason => { record(`child:${reason}`); setChildOpen(false); }}>
        <TextField label="Child name" autoFocus />
        <Popover title="Child guidance" trigger={<Button>Open guidance</Button>}>
          <TextField label="Guidance note" autoFocus />
        </Popover>
      </AppModal>
    </AppModal>
  </Provider>;
}
export const NestedOverlays: Story = { globals: { locale: "ar-EG", direction: "auto" }, render: () => <NestedOverlaysPreview /> };

function RemovedOpenerPreview() {
  const [open, setOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);
  const [openerPresent, setOpenerPresent] = useState(true);
  const [hostFocus, setHostFocus] = useState(false);
  const [reason, setReason] = useState("");
  const destination = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!childOpen && hostFocus && destination.current) {
      const input = destination.current;
      const inert = Boolean(input.closest("[inert]"));
      input.focus();
      input.dataset.hostFocusAttempt = JSON.stringify({ inert, succeeded: document.activeElement === input,
        active: document.activeElement?.outerHTML.slice(0, 500) });
    }
  }, [childOpen, hostFocus]);
  return <Provider>
    <Button onPress={() => setOpen(true)}>Open recovery parent</Button>
    <AppModal open={open} title="Recovery parent" onClose={() => setOpen(false)}>
      <p role="status">Child dismissal: {reason || "None"}</p>
      <TextField label="Parent fallback" autoFocus />
      <TextField label="Host destination" ref={destination} />
      {openerPresent && <Button onPress={() => setChildOpen(true)}>Open removable child</Button>}
      <AppModal open={childOpen} title="Recovery child" showCloseButton onClose={value => { setReason(value); setChildOpen(false); }}>
        <TextField label="Child input" autoFocus />
        <Button onPress={() => setOpenerPresent(false)}>Remove child opener</Button>
        <Button onPress={() => { setOpenerPresent(false); setHostFocus(true); }}>Remove opener and choose host destination</Button>
      </AppModal>
    </AppModal>
  </Provider>;
}
/** Removal happens while the child is open, after its focus scope captured the opener. */
export const RemovedOpener: Story = { render: () => <RemovedOpenerPreview /> };

function CustomChromePreview({ size }: { size: "md" | "lg" }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("details");
  return <Provider>
    <Button onPress={() => setOpen(true)}>Open custom {size} modal</Button>
    <AppModal open={open} aria-label="Custom chrome settings" size={size} heightMode={size} showCloseButton
      onClose={() => setOpen(false)}
      headerContent={<><p>Course settings with host supplied header details</p><Button variant="outlined">Header help</Button></>}
      footerContent={<><Button variant="text" onPress={() => setOpen(false)}>Custom cancel</Button><Button>Custom save</Button></>}>
      <AppPageTabs label="Custom settings sections" value={tab} onChange={setTab} items={[
        { id: "details", label: "Details", content: <>{Array.from({ length: 12 }, (_, index) => <TextField key={index} label={`Custom field ${index + 1}`} autoFocus={index === 0} />)}</> },
        { id: "access", label: "Access", content: <TextField label="Custom permission" /> },
      ]} />
    </AppModal>
  </Provider>;
}
export const MediumCustomChrome: Story = { render: () => <CustomChromePreview size="md" /> };
export const LargeCustomChrome: Story = { render: () => <CustomChromePreview size="lg" /> };

function LocalizedModal({globals}:{globals:FixtureGlobals}) {
 const [open,setOpen]=useState(false);
 const rtl=globals.locale.startsWith('ar');
 const title=rtl?'مراجعة إعدادات الدورة ومواد التعلم للمجموعات الدولية':'Review course settings and learning materials for international cohorts';
 const messages:Record<string,string>={'common.ui.close':'إغلاق','common.ui.modalStep':'الخطوة {current} من {total}'};
 return <SGTranslationProvider value={{locale:globals.locale,useNamespace:()=>{},t:(key,options)=>formatIcuMessage(rtl&&messages[key]?messages[key]:options.defaultMessage,globals.locale,options.values)}}>
  <Provider theme={globals.theme} density={globals.density} dir={rtl?'rtl':'ltr'}>
   <Button onPress={()=>setOpen(true)}>{rtl?'فتح إعدادات الدورة':'Open course settings'}</Button>
   <AppModal open={open} onClose={()=>setOpen(false)} title={title} subtitle={rtl?'يتولى التطبيق حفظ المسودات ومراجعة الصلاحيات قبل نشر الدورة.':'The host saves drafts and reviews permissions before publishing the course.'} size="md" showCloseButton steps={{current:2,total:3}}
    primaryAction={{label:rtl?'حفظ إعدادات الدورة للمراجعة':'Save course settings for review',onPress:()=>setOpen(false)}}
    secondaryAction={{label:rtl?'إلغاء التغييرات والعودة':'Cancel changes and return',onPress:()=>setOpen(false)}}>
     <TextField label={rtl?'عنوان الدورة التدريبية':'Course title'} autoFocus defaultValue={rtl?'التخطيط التعاوني للتعلم':'Collaborative learning planning'} />
   </AppModal>
  </Provider>
 </SGTranslationProvider>;
}
export const LocalizedPresentation:Story={render:(_args,{globals})=><LocalizedModal globals={globals} />};

// Acceptance-only host: each mounted composition owns its drafts and overlays.
function OwnershipPreview() {
  const [open, setOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);
  const [alternate, setAlternate] = useState(false);
  const [value, setValue] = useState<unknown>(null);
  return <Provider>
    <ThemeScope theme="light" density="comfortable" dir="ltr" lang="en-US">
      <TextField label="Independent sibling" defaultValue="Sibling draft" />
    </ThemeScope>
    <ThemeScope theme={alternate ? "dark" : "light"} density={alternate ? "compact" : "comfortable"}
      dir={alternate ? "rtl" : "ltr"} lang={alternate ? "ar-EG" : "en-US"}>
      <Button onPress={() => setOpen(true)}>Open ownership modal</Button>
      <AppModal open={open} title="Ownership settings" showCloseButton size="lg" onClose={() => setOpen(false)}>
        <TextField label="Ownership name" autoFocus />
        <Button onPress={() => setAlternate(next => !next)}>Change active scope</Button>
        <Tooltip delay={0} closeDelay={0} trigger={<Button>Ownership help</Button>} content="Help for the current settings" />
        <Menu label="Ownership actions" trigger={<Button>Ownership actions</Button>}
          items={[{ id: "review", label: "Review ownership" }]} />
        <PageRichTextEditorSection lexicalValue={value} onLexicalChange={setValue} editorKey="overlay-ownership"
          aria-label="Ownership document" />
        <Button onPress={() => setChildOpen(true)}>Open ownership child</Button>
        <AppModal open={childOpen} title="Ownership child" showCloseButton onClose={() => setChildOpen(false)}>
          <TextField label="Ownership child name" autoFocus />
        </AppModal>
      </AppModal>
    </ThemeScope>
  </Provider>;
}
export const Ownership: Story = { render: () => <OwnershipPreview /> };

function ContractCase({ size, heightMode, custom = false }: {
  size: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  heightMode: "auto" | "sm" | "md" | "lg"; custom?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("details");
  const id = `${size}-${heightMode}${custom ? "-custom" : ""}`;
  return <>
    <Button onPress={() => setOpen(true)}>Open {id}</Button>
    <AppModal open={open} title={`Contract ${id}`} aria-label={`Contract ${id}`} size={size} heightMode={heightMode}
      width={custom ? 540 : undefined} height={custom ? 440 : undefined} showCloseButton onClose={() => setOpen(false)}
      headerContent={custom ? <Button>Custom header help</Button> : undefined}
      footerContent={custom ? <Button onPress={() => setOpen(false)}>Custom done</Button> : undefined}
      primaryAction={{ label: "Contract done", onPress: () => setOpen(false) }}>
      <AppPageTabs label={`Contract sections ${id}`} value={tab} onChange={setTab} items={[
        { id: "details", label: "Details", content: <>{Array.from({length: 10}, (_, index) =>
          <TextField key={index} label={`Contract field ${index + 1}`} autoFocus={index === 0} />)}</> },
        { id: "access", label: "Access", content: <TextField label="Contract permission" /> },
      ]} />
    </AppModal>
  </>;
}
function ContractMatrixPreview() {
  return <Provider>{(["xs", "sm", "md", "lg", "xl", "full"] as const).map(size =>
    (["auto", "sm", "md", "lg"] as const).map(heightMode => <ContractCase key={`${size}-${heightMode}`} size={size} heightMode={heightMode} />))}
    <ContractCase size="md" heightMode="lg" custom />
  </Provider>;
}
export const ContractMatrix: Story = { render: () => <ContractMatrixPreview /> };
