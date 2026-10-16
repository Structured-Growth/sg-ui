import { useState } from "react";
import type { Meta, StoryObj } from "../../../types";
import { Menu } from "@structured-growth/sg-ui/experimental";
import { Provider } from "@structured-growth/sg-ui/theme";
import { Button } from "@structured-growth/sg-ui/experimental";
const meta = { title: "Migration proofs/Menu", component: Menu, tags: ["autodocs"], decorators: [(Story) => <Provider><Story /></Provider>], args: { label: "Course actions", trigger: <Button>Actions</Button>, items: [{ id: "edit", label: "Edit" }, { id: "locked", label: "Unavailable", disabled: true }, { id: "delete", label: "Delete", tone: "danger" }] } } satisfies Meta<typeof Menu>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const NativeAutofocus: Story = { args: { label: "Native focus actions", trigger: <Button>Native actions</Button>, items: [
  { id: "blocked-first", label: "Unavailable first", disabled: true },
  { id: "first", label: "First enabled" },
  { id: "middle", label: "Unavailable middle", disabled: true },
  { id: "last", label: "Last enabled" },
  { id: "blocked-last", label: "Unavailable last", disabled: true },
] } };

export const RetryableActionError: Story = { args: { defaultOpen: true, errorMessage: "Unable to complete this action. Try again." } };
export const LinkTargets: Story = { args: { items: [{ id: "course", label: "Open course", href: "/courses/1" }, { id: "reference", label: "Open reference in a new tab", href: "https://example.com", target: "_blank", rel: "help" }] } };


function NativeContractsExample() {
 const [requests, setRequests] = useState<string[]>([]);
 return <>
  <Button>Before commands</Button>
  <Menu label="Contract commands" trigger={<Button>Contract actions</Button>} items={[
   { id: "blocked-first", label: "Unavailable first", disabled: true },
   { id: "first", label: "First enabled" },
   { id: "middle", label: "Unavailable middle", disabled: true },
   { id: "last", label: "Last enabled" },
   { id: "blocked-last", label: "Unavailable last", disabled: true },
  ]} onAction={id => setRequests(previous => [...previous, id])} />
  <Button>After commands</Button>
  <output aria-label="Command requests">{requests.join(",")}</output>
 </>;
}
export const NativeContracts: Story = { render: () => <NativeContractsExample /> };
