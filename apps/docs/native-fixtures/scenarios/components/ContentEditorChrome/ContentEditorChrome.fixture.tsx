import { useEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "../../../types";
import { AppModal, DocumentEditorLayout } from "@structured-growth/sg-ui/components";
import { SGTranslationProvider, type SGTranslationAdapter } from "@structured-growth/sg-ui/i18n";
import { ThemeScope } from "@structured-growth/sg-ui/theme";
import { Provider } from "@structured-growth/sg-ui/theme";
import { MenuBookIcon } from "@structured-growth/sg-ui/experimental/icons";
import { Typography } from "@structured-growth/sg-ui/experimental";
import { tokens } from "@structured-growth/sg-ui/tokens";
import { Button } from "@structured-growth/sg-ui/experimental";
import { Menu } from "@structured-growth/sg-ui/experimental";
import { DocumentEditorToolbar } from "@structured-growth/sg-ui/components";
import { ContentEditorChrome } from "@structured-growth/sg-ui/components";
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

// Wave-03-23: real production scopes, public controls and a host-owned scroll pane.
// Hotkeys model host updates without moving focus to an auxiliary fixture button.
const arabicChrome: Record<string, string> = {
  "common.ui.documentActions": "إجراءات المستند",
  "common.ui.editTitle": "تعديل العنوان",
  "common.ui.documentTitle": "عنوان المستند",
  "common.ui.editor.documentToolbar": "أدوات تحرير المستند",
  "common.ui.editor.zoomOut": "تصغير",
  "common.ui.editor.zoomIn": "تكبير",
  "common.ui.editor.zoom": "التكبير",
  "common.ui.editor.heading": "نمط عنوان النص",
  "common.ui.editor.documentHeading0": "نص عادي طويل لاختبار الالتفاف",
  "common.ui.editor.documentHeading1": "عنوان أول",
  "common.ui.editor.documentHeading2": "عنوان ثان",
  "common.ui.editor.documentHeading3": "عنوان ثالث",
  "common.ui.editor.documentHeading4": "عنوان رابع",
  "common.ui.editor.documentHeading5": "عنوان خامس",
  "common.ui.editor.bold": "عريض",
  "common.ui.editor.italic": "مائل",
  "common.ui.editor.bulletList": "قائمة نقطية",
  "common.ui.editor.orderedList": "قائمة مرقمة",
  "common.ui.editor.alignLeft": "محاذاة لليسار",
  "common.ui.editor.alignCenter": "محاذاة للوسط",
  "common.ui.editor.alignRight": "محاذاة لليمين",
  "common.ui.editor.alignJustify": "ضبط المحاذاة",
  "common.ui.editor.customComponent": "إضافة مكون مخصص مع تسمية عربية طويلة",
};
const englishChrome: Record<string, string> = {
  "common.ui.editor.documentHeading0": "Normal text with a deliberately long translated heading label",
  "common.ui.editor.customComponent": "Custom component with a deliberately long translated action label",
};
function ChromeAcceptanceHost() {
  const arabic = new URLSearchParams(location.search).get("globals")?.includes("locale:ar") ?? false;
  const [mode, setMode] = useState<"editable" | "pending" | "unavailable">("editable");
  const [slots, setSlots] = useState(true);
  const [open, setOpen] = useState(false);
  const [bold, setBold] = useState(false);
  const [heading, setHeading] = useState<"normal" | "h1" | "h2" | "h3" | "h4" | "h5">("normal");
  const [zoom, setZoom] = useState(100);
  const [title, setTitle] = useState(arabic
    ? "عنوان مستند تعليمي طويل لاختبار التفاف العناوين وأزرار الحفظ داخل مساحة ضيقة"
    : "A long course document title to inspect wrapping beside save and status actions");
  const editor = useRef<HTMLTextAreaElement>(null);
  const adapter: SGTranslationAdapter = {
    locale: arabic ? "ar" : "en-US", useNamespace: () => {},
    t: (key, options) => (arabic ? arabicChrome : englishChrome)[key] ?? options.defaultMessage,
  };
  const labels = arabic
    ? { file: "ملف وإجراءات المستند الطويلة", save: "حفظ تغييرات المستند", status: "تم حفظ جميع تغييرات المستند محلياً في هذه المعاينة", doc: "محتوى المستند", scroll: "منطقة تمرير المستند", dialog: "إجراءات المستند", close: "إغلاق", unavailable: "إجراء غير متاح" }
    : { file: "File and long document actions", save: "Save document changes", status: "All document changes saved locally in this preview", doc: "Acceptance document", scroll: "Acceptance scroll region", dialog: "Document command dialog", close: "Close", unavailable: "Unavailable command" };
  useEffect(() => {
    const update = (event: KeyboardEvent) => {
      if (!event.altKey) return;
      if (event.code === "Digit1") { event.preventDefault(); setSlots(value => !value); }
      if (event.code === "Digit2") { event.preventDefault(); setMode("pending"); }
      if (event.code === "Digit3") { event.preventDefault(); setMode("unavailable"); }
      if (event.code === "Digit4") { event.preventDefault(); setMode("editable"); }
    };
    document.addEventListener("keydown", update);
    return () => document.removeEventListener("keydown", update);
  }, []);
  const editable = mode === "editable";
  return <SGTranslationProvider value={adapter}><ThemeScope dir={arabic ? "rtl" : "ltr"}>
    <div data-testid="chrome-acceptance" data-mode={mode} style={{ maxWidth: "100%" }}>
      <DocumentEditorLayout title={title} style={{ minHeight: 720 }}
        headerRight={<Button disabled={!editable}>{labels.save}</Button>}
        menuBar={slots ? <ContentEditorChrome icon={null} title={title} onTitleSave={setTitle} titleReadOnly={!editable}
          rightSlot={<Typography role="status">{labels.status}</Typography>}
          menuItems={[{ id: "file", label: labels.file, loading: mode === "pending", disabled: mode === "unavailable", "aria-haspopup": "dialog", "aria-expanded": open,
            onPress: () => setOpen(true) }, { id: "missing", label: labels.unavailable }]} /> : undefined}
        toolbar={slots ? <DocumentEditorToolbar canEdit={editable} headingValue={heading}
          onHeadingChange={value => { setHeading(value); editor.current?.focus(); }}
          actions={{ bold: { active: bold, onClick: () => { setBold(value => !value); editor.current?.focus(); } }, italic: { active: false }, bulletList: { active: false }, orderedList: { active: false } }}
          zoomValue={zoom} onZoomIn={() => setZoom(value => value + 10)} onZoomOut={() => setZoom(value => value - 10)}
          showCustomComponentAction statusLabel={labels.status} /> : undefined}>
        <div data-testid="acceptance-scroll" role="region" aria-label={labels.scroll} tabIndex={0}
          style={{ height: 220, overflow: "auto", minHeight: 0, padding: tokens.space2, boxSizing: "border-box" }}>
          <textarea ref={editor} aria-label={labels.doc} defaultValue={arabic ? "نص المستند الأصلي" : "Original document draft"}
            style={{ width: "100%", boxSizing: "border-box" }} />
          {Array.from({ length: 18 }, (_, index) => <Typography key={index}>{index + 1}. {labels.status}</Typography>)}
          <Button>{labels.save}</Button>
        </div>
      </DocumentEditorLayout>
      <AppModal open={open} onClose={() => setOpen(false)} title={labels.dialog}
        primaryAction={{ label: labels.save, loading: mode === "pending", disabled: !editable, onPress: () => setOpen(false) }}
        secondaryAction={{ label: labels.close, onPress: () => setOpen(false) }}>
        <Typography>{labels.status}</Typography>
      </AppModal>
    </div>
  </ThemeScope></SGTranslationProvider>;
}
export const AcceptanceComposition: Story = { render: () => <ChromeAcceptanceHost /> };
