import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
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
  const fixture = useRef<HTMLDivElement>(null);
  const armed = useRef<Mode | null>(null);
  const trace = useRef<string[]>([]);
  const [timeline, setTimeline] = useState("[]");
  const deliver = (name: string, heading: Heading) => {
    trace.current.push(`delivered:${name}`);
    setRequests(previous => [...previous, `${name}:${heading}`]);
    editor.current?.focus();
  };
  // Capture only arms the host transaction. Native microtask checkpoints can
  // run between capture and Select's delegated bubble handler, so capture alone
  // cannot establish that a request has been queued.
  const arm = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" || !(event.target instanceof Element) || !event.target.closest('[role="option"]')) return;
    armed.current = mode;
    trace.current.push("option-enter");
  };
  useEffect(() => {
    const trigger = fixture.current?.querySelector('button[aria-haspopup="listbox"]');
    if (!trigger) return;
    // Select changes aria-expanded to false only after selection processing has
    // requested the heading and closed its popup. Mutation delivery is therefore
    // after request creation and before the toolbar's deferred timer.
    const observer = new MutationObserver(records => {
      if (!armed.current || !records.some(record => record.attributeName === "aria-expanded") || trigger.getAttribute("aria-expanded") !== "false") return;
      const transaction = armed.current;
      armed.current = null;
      trace.current.push("select-closed");
      flushSync(() => {
        setCommits(previous => previous + 1);
        if (transaction === "replace") setOwner("current");
        if (transaction === "remove" || transaction === "remove-restore") setOwner("absent");
        if (transaction === "read-only" || transaction === "read-only-restore") setCanEdit(false);
        if (transaction === "unmount") setMounted(false);
      });
      trace.current.push(`host-committed:${transaction}`);
      if (transaction === "remove-restore" || transaction === "read-only-restore") {
        flushSync(() => { setCanEdit(true); setOwner("current"); });
        trace.current.push("availability-restored");
      }
      // This later timer is an explicit event-loop checkpoint for zero requests.
      setTimeout(() => {
        trace.current.push("delivery-checkpoint");
        setTimeline(JSON.stringify(trace.current));
        setDrained(true);
      }, 0);
    });
    observer.observe(trigger, { attributes: true, attributeFilter: ["aria-expanded"] });
    return () => observer.disconnect();
  }, []);
  return <Provider><div ref={fixture} onKeyDownCapture={arm}>
    <div role="group" aria-label="Heading lifetime scenarios">
      {modes.map(value => <Button key={value} variant="outlined" tone="neutral" aria-pressed={mode === value} onPress={() => setMode(value)}>{value}</Button>)}
    </div>
    {mounted && <DocumentEditorToolbar canEdit={canEdit} headingValue="normal" actions={actions}
      onHeadingChange={owner === "absent" ? undefined : heading => deliver(owner, heading)} />}
    <div ref={editor} role="textbox" aria-label="Heading host editor" contentEditable suppressContentEditableWarning>Preserved document</div>
    <output aria-label="Heading event trace">{timeline}</output>
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
