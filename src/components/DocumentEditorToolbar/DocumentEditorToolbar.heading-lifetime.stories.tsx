import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState, type KeyboardEvent } from "react";
import { flushSync } from "react-dom";
import { Provider } from "../../experimental/Provider/Provider";
import { Button } from "../../experimental/Button/Button";
import { DocumentEditorToolbar, type DocumentEditorToolbarProps } from "./DocumentEditorToolbar";

const modes = ["replace", "remove", "read-only", "unmount", "remove-restore", "read-only-restore", "unchanged"] as const;
type Mode = typeof modes[number];
type Heading = DocumentEditorToolbarProps["headingValue"];
const actions = { bold: { active: false }, italic: { active: false }, bulletList: { active: false }, orderedList: { active: false } };
function HeadingLifetimePreview() {
  const [mode, setMode] = useState<Mode>("replace");
  const [owner, setOwner] = useState<"original" | "current" | "absent">("original");
  const [canEdit, setCanEdit] = useState(true);
  const [mounted, setMounted] = useState(true);
  const [requests, setRequests] = useState<string[]>([]);
  const [drained, setDrained] = useState(false);
  const [commits, setCommits] = useState(0);
  const editor = useRef<HTMLDivElement>(null);
  const deliver = (name: string, heading: Heading) => {
    setRequests(previous => [...previous, `${name}:${heading}`]);
    editor.current?.focus();
  };
  // The capture handler observes the actual option Enter gesture. A microtask
  // commits after Select finishes that event and before deferred task delivery.
  const transition = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" || !(event.target instanceof Element) || !event.target.closest('[role="option"]')) return;
    queueMicrotask(() => {
      flushSync(() => {
        setCommits(previous => previous + 1);
        if (mode === "replace") setOwner("current");
        if (mode === "remove" || mode === "remove-restore") setOwner("absent");
        if (mode === "read-only" || mode === "read-only-restore") setCanEdit(false);
        if (mode === "unmount") setMounted(false);
      });
      if (mode === "remove-restore" || mode === "read-only-restore") {
        flushSync(() => { setCanEdit(true); setOwner("current"); });
      }
      // Registered after the toolbar's zero-delay delivery. This is an observable
      // event-loop checkpoint, so negative assertions do not depend on sleeps.
      setTimeout(() => setDrained(true), 0);
    });
  };
  return <Provider><div onKeyDownCapture={transition}>
    <div role="group" aria-label="Heading lifetime scenarios">
      {modes.map(value => <Button key={value} variant="outlined" tone="neutral" aria-pressed={mode === value} onPress={() => setMode(value)}>{value}</Button>)}
    </div>
    {mounted && <DocumentEditorToolbar canEdit={canEdit} headingValue="normal" actions={actions}
      onHeadingChange={owner === "absent" ? undefined : heading => deliver(owner, heading)} />}
    <div ref={editor} role="textbox" aria-label="Heading host editor" contentEditable suppressContentEditableWarning>Preserved document</div>
    <output aria-label="Heading requests">{JSON.stringify(requests)}</output>
    <output aria-label="Heading host commits">{commits}</output>
    <output aria-label="Heading delivery checkpoint">{drained ? "drained" : "pending"}</output>
  </div></Provider>;
}
const meta = {
  title: "Components/DocumentEditorToolbar/Heading lifetime",
  component: DocumentEditorToolbar,
  args: { canEdit: true, headingValue: "normal", actions },
} satisfies Meta<typeof DocumentEditorToolbar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const QueuedHostTransition: Story = { render: () => <HeadingLifetimePreview /> };
