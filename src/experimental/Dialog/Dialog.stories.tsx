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
