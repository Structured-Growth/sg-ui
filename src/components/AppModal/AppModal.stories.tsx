import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { AppModal } from "./AppModal";
import { AppButton } from "../AppButton";
import { AppPageTabs } from "../AppPageTabs";
import { TextField } from "../../experimental/TextField/TextField";
import { Popover } from "../../experimental/Popover/Popover";
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
