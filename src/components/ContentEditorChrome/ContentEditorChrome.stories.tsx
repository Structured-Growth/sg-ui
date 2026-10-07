import { useEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Provider } from "../../experimental/Provider/Provider";
import { MenuBookIcon } from "../../experimental/icons/MenuBookIcon";
import { Typography } from "../../experimental/Typography/Typography";
import { tokens } from "../../foundation/tokens.generated";
import { Button } from "../../experimental/Button/Button";
import { Menu } from "../../experimental/Menu/Menu";
import { DocumentEditorToolbar } from "../DocumentEditorToolbar/DocumentEditorToolbar";
import { ContentEditorChrome } from "./ContentEditorChrome";
const meta = { title: "Editors/ContentEditorChrome", component: ContentEditorChrome, tags: ["autodocs"],
  args: { icon: null, title: "Untitled document", onTitleSave: () => {}, menuItems: [] },
  decorators: [Story => <Provider><Story /></Provider>],
} satisfies Meta<typeof ContentEditorChrome>;
export default meta;
type Story = StoryObj<typeof meta>;
function InteractiveChrome({ extended = false }: { extended?: boolean }) {
  const [title, setTitle] = useState("Untitled document"); const [action, setAction] = useState("");
  return <><ContentEditorChrome icon={<MenuBookIcon size={40} />} title={title} onTitleSave={setTitle}
    rightSlot={<Typography variant="bodyAlt2">Draft</Typography>}
    menuItems={(extended ? ["File", "Edit", "View", "Insert", "Format", "Tools"] : ["File", "Edit", "View"]).map(label => ({ id: label.toLowerCase(), label, onPress: anchor => setAction(`${label}: ${anchor.tagName}`) }))} />
    <p role="status">{action || "Choose an action or edit the title."}</p></>;
}
export const Default: Story = { render: () => <InteractiveChrome /> };
export const ExtendedMenu: Story = { render: () => <InteractiveChrome extended /> };
export const UnavailableAndPending: Story = { render: () => <ContentEditorChrome icon={null} title="Read-only lesson" titleReadOnly onTitleSave={()=>{}} menuItems={[{id:"file",label:"File"},{id:"saving",label:"Saving",onPress:()=>{},loading:true},{id:"locked",label:"Locked",onPress:()=>{},disabled:true}]} /> };
export const NarrowDark: Story = { render: () => <Provider theme="dark"><div style={{maxWidth:260,background:tokens.surface,color:tokens.text}}><InteractiveChrome extended /></div></Provider> };

// One host owns the editor state and focus. Menu owns its native overlay and
// keyboard interaction; its visible trigger is the overlay positioning anchor.
// Chrome's File action requests the same controlled menu through its native anchor.
export function NativeEditorChromeHost() {
  const editor = useRef<HTMLDivElement>(null);
  const focusTimers = useRef(new Set<ReturnType<typeof setTimeout>>());
  useEffect(() => () => { focusTimers.current.forEach(clearTimeout); }, []);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"editable" | "read-only" | "pending" | "unavailable">("editable");
  const [compact, setCompact] = useState(false);
  const [heading, setHeading] = useState<"normal" | "h1" | "h2" | "h3" | "h4" | "h5">("normal");
  const [bold, setBold] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [requests, setRequests] = useState({ file: 0, menu: 0, heading: 0, bold: 0, zoom: 0 });
  const [anchor, setAnchor] = useState("");
  const count = (key: keyof typeof requests) => setRequests(value => ({ ...value, [key]: value[key] + 1 }));
  const returnToEditor = () => {
    // Host focus runs after Menu restores its own trigger. This is host policy,
    // not a second focus/selection owner inside the chrome or toolbar.
    const timer = setTimeout(() => { focusTimers.current.delete(timer); editor.current?.focus(); }, 0);
    focusTimers.current.add(timer);
  };
  const available = mode !== "unavailable";
  const canEdit = mode === "editable";
  return <div data-testid="native-editor-host" style={{ maxWidth: "100%" }}>
    <div role="group" aria-label="Host fixture state" style={{ display: "flex", flexWrap: "wrap", gap: tokens.space1 }}>
      {(["editable", "read-only", "pending", "unavailable"] as const).map(value => <Button key={value} onPress={() => setMode(value)}>Use {value}</Button>)}
      <Button onPress={() => setCompact(value => !value)}>Toggle optional groups</Button>
    </div>
    <ContentEditorChrome icon={null} title="Native host document with a long descriptive title" titleReadOnly={!canEdit} onTitleSave={() => {}}
      rightSlot={<Menu trigger={<Button variant="text" tone="neutral">Document commands</Button>} label="Host file menu" density="compact"
        open={open} onOpenChange={next => { setOpen(next); if (!next) returnToEditor(); }}
        items={[{ id: "return", label: "Return to editor" }]}
        onAction={() => { count("menu"); setOpen(false); returnToEditor(); }} />}
      menuItems={[{ id: "file", label: "File", loading: mode === "pending", disabled: mode === "read-only",
        "aria-haspopup": "menu", "aria-expanded": open,
        onPress: available ? node => { setAnchor(node.tagName + ":" + node.textContent); count("file"); setOpen(true); } : undefined },
        { id: "unavailable", label: "Unavailable command" }]} />
    <DocumentEditorToolbar canEdit={canEdit} headingValue={heading}
      onHeadingChange={available ? value => { count("heading"); setHeading(value); editor.current?.focus(); } : undefined}
      actions={{ bold: { active: bold, onClick: available ? () => { count("bold"); setBold(value => !value); editor.current?.focus(); } : undefined },
        italic: { active: false }, bulletList: { active: false }, orderedList: { active: false } }}
      zoomValue={zoom} onZoomIn={() => { count("zoom"); setZoom(value => value + 10); }} onZoomOut={() => { count("zoom"); setZoom(value => value - 10); }}
      showZoomControls={!compact} showAlignmentControls={!compact} showCustomComponentAction={!compact}
      statusLabel={`Host state: ${mode}`} />
    <div ref={editor} role="textbox" aria-label="Host editor" aria-readonly={!canEdit} contentEditable={canEdit} tabIndex={0}
      suppressContentEditableWarning style={{ minHeight: 100, padding: tokens.space2, border: `1px solid ${tokens.divider}`, overflowWrap: "anywhere" }}>
      Host document text stays in this unchanged native node.
    </div>
    <output data-testid="host-requests" style={{ display: "block", overflowWrap: "anywhere" }}>{JSON.stringify(requests)}</output>
    <output data-testid="host-anchor" style={{ display: "block", overflowWrap: "anywhere" }}>{anchor}</output>
  </div>;
}
export const NativeHostComposition: Story = { render: () => <NativeEditorChromeHost /> };
