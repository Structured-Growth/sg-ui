import { useId, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dialog } from "./Dialog";
import { Button } from "../Button/Button";
import { TextField } from "../TextField/TextField";
import { ComboBox } from "../ComboBox/ComboBox";
import { Popover } from "../Popover/Popover";
import { Tabs } from "../Tabs/Tabs";
import { Provider } from "../Provider/Provider";
import { tokens } from "../../foundation/tokens.generated";

function NestedFormProof() {
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [course, setCourse] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [dismissal, setDismissal] = useState("");
  const [tab, setTab] = useState("details");
  const [submitted, setSubmitted] = useState(false);
  return <Provider theme="dark" density="compact" style={{ padding: tokens.space4 }}>
    <Button onPress={() => setOpen(true)}>Create course</Button>
    <p>Last dismissal: {dismissal || "None"}</p>
    <Dialog open={open} title="Create course" description="Review the settings before saving." size="md"
      onDismiss={reason => { setDismissal(reason); setOpen(false); }}
      footer={<><Button variant="outlined" tone="neutral" onPress={() => setOpen(false)}>Cancel</Button><Button form={formId} type="submit">Save course</Button></>}>
      <form id={formId} onSubmit={event => {
        event.preventDefault(); setSubmitted(true);
        if (!course.trim()) { setTab("details"); return; }
        setOpen(false);
      }}>
        <Tabs label="Course settings" value={tab} onValueChange={setTab} style={{ maxBlockSize: "min(26rem, 45dvh)" }} items={[
          { id: "details", label: "Details", content: <div style={{ display: "grid", gap: tokens.space4 }}>
            <TextField label="Course name" autoFocus name="course" required value={course} onValueChange={setCourse}
              invalid={submitted && !course.trim()} errorMessage="Enter a course name." />
            <ComboBox label="Category" name="category" value={category} onValueChange={setCategory} options={[
              { id: "science", label: "Science" }, { id: "math", label: "Mathematics" }, { id: "archived", label: "Archived", disabled: true },
            ]} />
            <Popover title="Naming guidance" trigger={<Button variant="outlined" tone="neutral">Naming help</Button>}>
              <p>Use a short, descriptive name that learners can recognize.</p><TextField label="Private note" />
            </Popover>
          </div> },
          { id: "access", label: "Access", content: <div>{Array.from({ length: 20 }, (_, index) => <p key={index}>Host-supplied access policy {index + 1}</p>)}</div> },
          { id: "future", label: "Unavailable", disabled: true, content: "Unavailable" },
        ]} />
      </form>
    </Dialog>
  </Provider>;
}
const meta = { title: "Migration proofs/Dialog", component: Dialog, tags: ["autodocs"] } satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const NestedForm: Story = { args: { open: false, title: "Create course", children: null, onDismiss: () => {} }, render: () => <NestedFormProof /> };

function HeaderReflowProof({ size }: { size: "md" | "lg" }) {
  const [open, setOpen] = useState(false);
  const [help, setHelp] = useState(false);
  const [dismissal, setDismissal] = useState("");
  return <Provider>
    <Button onPress={() => setOpen(true)}>Open header reflow</Button>
    <p role="status">{dismissal || "Ready"}</p>
    <Dialog open={open} aria-label="Custom chrome settings" size={size}
      surfaceStyle={{ height: size === "md" ? "68dvh" : "80dvh" }}
      bodyStyle={{ minBlockSize: "calc(var(--sgui-control-height) + 2 * var(--sgui-space4))" }}
      header={<><h2>Course settings with host supplied header details</h2>
        <Button variant="outlined" onPress={() => setHelp(value => !value)}>Header help</Button>
        {help && <p>Host supplied guidance</p>}</>}
      footer={<div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: tokens.space2, inlineSize: "100%" }}><Button variant="outlined" tone="neutral">Cancel</Button><Button>Save</Button></div>}
      onDismiss={reason => { setDismissal(reason); setOpen(false); }}>
      <div style={{ display: "grid", gap: tokens.space4 }}>
        {Array.from({ length: 12 }, (_, index) => <TextField key={index} autoFocus={index === 0} label={`Custom field ${index + 1}`} />)}
      </div>
    </Dialog>
  </Provider>;
}
export const MediumHeaderReflow: Story = { args: { open: false, children: null, onDismiss: () => {} }, render: () => <HeaderReflowProof size="md" /> };
export const LargeHeaderReflow: Story = { args: { open: false, children: null, onDismiss: () => {} }, render: () => <HeaderReflowProof size="lg" /> };
