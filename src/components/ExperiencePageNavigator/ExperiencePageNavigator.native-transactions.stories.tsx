import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../../experimental/Button/Button";
import { Typography } from "../../experimental/Typography/Typography";
import { ExperiencePageNavigator, type ExperiencePageNavigatorItem } from "./ExperiencePageNavigator";

const initialPages: ExperiencePageNavigatorItem[] = [
  { key: "intro", title: "Introduction" },
  { key: "lesson", title: "Lesson" },
  { key: "summary", title: "Summary" },
];
type Request = ["select" | "add" | "remove" | "rename" | "reorder", ...string[]];

/** A bounded host: requests are observable, and only accepted requests change props. */
export function NativeTransactionsHost() {
  const [pages, setPages] = useState(initialPages);
  const [activePageKey, setActivePageKey] = useState<string | null>("intro");
  const [requests, setRequests] = useState<Request[]>([]);
  const [readOnly, setReadOnly] = useState(false);
  const [rejectNext, setRejectNext] = useState(false);
  const [removeOnDrag, setRemoveOnDrag] = useState(false);
  const record = (request: Request) => setRequests(current => [...current, request]);
  const remove = (key: string) => {
    setPages(current => current.filter(page => page.key !== key));
    if (activePageKey === key) setActivePageKey(pages.find(page => page.key !== key)?.key ?? null);
  };
  return <div onKeyDownCapture={event => {
    // Host shortcuts let native input change controlled props while a portal is open.
    if (event.altKey && event.key.toLowerCase() === "r") { event.preventDefault(); setReadOnly(current => !current); }
    if (event.altKey && event.key.toLowerCase() === "x") { event.preventDefault(); remove("intro"); }
  }} onDragStartCapture={event => {
    if (!removeOnDrag || !event.isTrusted) return;
    const row = (event.target as Element).closest("li");
    const source = row?.querySelector("button")?.textContent;
    const page = pages.find(item => source?.startsWith(item.title));
    if (page) { setRemoveOnDrag(false); remove(page.key); }
  }}>
    <Typography as="p" variant="body2">Host shortcuts: Alt+R toggles read-only; Alt+X removes Introduction.</Typography>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Button onPress={() => setRejectNext(true)}>Reject next reorder</Button>
      <Button onPress={() => setRemoveOnDrag(true)}>Remove source on native drag start</Button>
      <Button onPress={() => setReadOnly(current => !current)}>Toggle read-only</Button>
    </div>
    <div style={{ width: 300, height: 320, maxWidth: "100%" }}>
      <ExperiencePageNavigator pages={pages} activePageKey={activePageKey} readOnly={readOnly}
        onSelectPage={key => { record(["select", key]); setActivePageKey(key); }}
        onAddPage={() => { record(["add"]); setPages(current => [...current, { key: "extra", title: "Extra" }]); }}
        onRemovePage={key => { record(["remove", key]); remove(key); }}
        onRenamePage={(key, title) => { record(["rename", key, title]); setPages(current => current.map(page => page.key === key ? { ...page, title } : page)); }}
        onReorderPages={(source, target) => {
          record(["reorder", source, target]);
          if (rejectNext) { setRejectNext(false); return; }
          setPages(current => {
            const next = [...current];
            const from = next.findIndex(page => page.key === source);
            const to = next.findIndex(page => page.key === target);
            if (from < 0 || to < 0) return current;
            const [moved] = next.splice(from, 1); next.splice(to, 0, moved); return next;
          });
        }} />
    </div>
    <Typography as="p" variant="body2"><output aria-label="Host requests">{JSON.stringify(requests)}</output></Typography>
    <Typography as="p" variant="body2"><output aria-label="Host page order">{JSON.stringify(pages.map(page => page.key))}</output></Typography>
    <Typography as="p" variant="body2"><output aria-label="Host read-only">{String(readOnly)}</output></Typography>
    <Typography as="p" variant="body2"><output aria-label="Host reject next">{String(rejectNext)}</output></Typography>
    <Typography as="p" variant="body2"><output aria-label="Host remove on drag">{String(removeOnDrag)}</output></Typography>
  </div>;
}
const meta = { title: "Navigation/ExperiencePageNavigator/Native transactions", component: NativeTransactionsHost } satisfies Meta<typeof NativeTransactionsHost>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ControlledHost: Story = {};
