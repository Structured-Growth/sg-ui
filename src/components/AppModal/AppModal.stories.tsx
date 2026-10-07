import type { Meta, StoryObj } from "@storybook/react-vite";
import { useLayoutEffect, useRef, useState } from "react";
import { AppModal } from "./AppModal";
import { AppButton } from "../AppButton";
import { AppPageTabs } from "../AppPageTabs";
import { TextField } from "../../experimental/TextField/TextField";
import { Popover } from "../../experimental/Popover/Popover";
import { Menu } from "../../experimental/Menu/Menu";
import { ComboBox } from "../../experimental/ComboBox/ComboBox";
import { Provider } from "../../experimental/Provider/Provider";
const meta = { title: "Overlays/AppModal", component: AppModal, tags: ["autodocs"], args: { open: false, children: null } } satisfies Meta<typeof AppModal>;
export default meta;
type Story = StoryObj<typeof meta>;
function Preview({ tabs = false, locked = false, dark = false, full = false, custom = false, autoFocusAction = false }: { tabs?: boolean; locked?: boolean; dark?: boolean; full?: boolean; custom?: boolean; autoFocusAction?: boolean }) {
  const [open, setOpen] = useState(false); const [tab, setTab] = useState("details"); const [step, setStep] = useState(1);
  const [reason, setReason] = useState(""); const [saved, setSaved] = useState(0);
  return <Provider theme={dark ? "dark" : "light"}><AppButton variant="outlined" onPress={() => setOpen(true)}>Open modal</AppButton>
    <p>Last close: {reason || "None"}; saved: {saved}</p>
    <AppModal open={open} title="Course settings" subtitle="Host-owned settings" aria-label={custom ? "Custom settings" : undefined}
      headerContent={custom ? <h2>Custom settings</h2> : undefined} size={full ? "full" : "md"} heightMode={tabs ? "md" : "auto"}
      disableBackdropClose={locked} disableEscapeKeyDown={locked} showCloseButton onClose={value => {setReason(value); setOpen(false);}}
      steps={{ current: step, total: tabs ? 3 : 1 }}
      primaryAction={{ autoFocus: autoFocusAction, label: tabs ? "Next" : "Save", onPress: () => {setSaved(value => value + 1); if (tabs) setStep(value => value === 3 ? 1 : value + 1);} }}
      secondaryAction={{ label: "Cancel", onPress: () => {setReason("Cancel action"); setOpen(false);} }}>
      {tabs ? <AppPageTabs label="Settings" value={tab} onChange={setTab} items={[
        {id:"details",label:"Details",content:<>{Array.from({length:20},(_,index)=><TextField key={index} label={`Field ${index + 1}`} autoFocus={index === 0 && !autoFocusAction} />)}</>},
        {id:"access",label:"Access",content:<><TextField label="Permission" /><Popover title="Help" trigger={<AppButton>Help</AppButton>}><TextField label="Note" autoFocus /></Popover></>},
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

function NestedOverlaysPreview() {
  const [open, setOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const record = (value: string) => setEvents(previous => [...previous, value]);
  return <Provider theme="dark" density="compact">
    <AppButton onPress={() => setOpen(true)}>Open parent</AppButton>
    <p role="status">Dismissals: {events.join(", ") || "None"}</p>
    <AppModal open={open} title="Parent settings" subtitle="Host-owned settings" size="md" showCloseButton
      onClose={reason => { record(`parent:${reason}`); setOpen(false); }}>
      <TextField label="Parent name" autoFocus />
      <Menu label="Settings actions" trigger={<AppButton>Open actions</AppButton>}
        items={[{ id: "review", label: "Review settings" }]} onAction={() => record("menu:review")} />
      <ComboBox label="Category" options={[{ id: "science", label: "Science" }, { id: "math", label: "Mathematics" }]} />
      <AppButton onPress={() => setChildOpen(true)}>Open child</AppButton>
      <AppModal open={childOpen} title="Child settings" size="sm" showCloseButton
        onClose={reason => { record(`child:${reason}`); setChildOpen(false); }}>
        <TextField label="Child name" autoFocus />
        <Popover title="Child guidance" trigger={<AppButton>Open guidance</AppButton>}>
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
  useLayoutEffect(() => {
    if (!childOpen && hostFocus) destination.current?.focus();
  }, [childOpen, hostFocus]);
  return <Provider>
    <AppButton onPress={() => setOpen(true)}>Open recovery parent</AppButton>
    <p role="status">Child dismissal: {reason || "None"}</p>
    <AppModal open={open} title="Recovery parent" onClose={() => setOpen(false)}>
      <TextField label="Parent fallback" autoFocus />
      <TextField label="Host destination" ref={destination} />
      {openerPresent && <AppButton onPress={() => setChildOpen(true)}>Open removable child</AppButton>}
      <AppModal open={childOpen} title="Recovery child" showCloseButton onClose={value => { setReason(value); setChildOpen(false); }}>
        <TextField label="Child input" autoFocus />
        <AppButton onPress={() => setOpenerPresent(false)}>Remove child opener</AppButton>
        <AppButton onPress={() => { setOpenerPresent(false); setHostFocus(true); }}>Remove opener and choose host destination</AppButton>
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
    <AppButton onPress={() => setOpen(true)}>Open custom {size} modal</AppButton>
    <AppModal open={open} aria-label="Custom chrome settings" size={size} heightMode={size} showCloseButton
      onClose={() => setOpen(false)}
      headerContent={<><p>Course settings with host supplied header details</p><AppButton variant="outlined">Header help</AppButton></>}
      footerContent={<><AppButton variant="text" onPress={() => setOpen(false)}>Custom cancel</AppButton><AppButton>Custom save</AppButton></>}>
      <AppPageTabs label="Custom settings sections" value={tab} onChange={setTab} items={[
        { id: "details", label: "Details", content: <>{Array.from({ length: 12 }, (_, index) => <TextField key={index} label={`Custom field ${index + 1}`} autoFocus={index === 0} />)}</> },
        { id: "access", label: "Access", content: <TextField label="Custom permission" /> },
      ]} />
    </AppModal>
  </Provider>;
}
export const MediumCustomChrome: Story = { render: () => <CustomChromePreview size="md" /> };
export const LargeCustomChrome: Story = { render: () => <CustomChromePreview size="lg" /> };
