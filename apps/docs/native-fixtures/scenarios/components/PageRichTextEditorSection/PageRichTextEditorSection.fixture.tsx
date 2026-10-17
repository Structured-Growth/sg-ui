import { useEffect, useState } from "react";
import type { Meta, StoryObj, FixtureGlobals } from "../../../types";
import {SGTranslationProvider,type SGTranslationAdapter} from "@structured-growth/sg-ui/i18n";
import { Provider } from "@structured-growth/sg-ui/theme";
import { PageRichTextEditorSection } from "@structured-growth/sg-ui/components";
import { Button } from "@structured-growth/sg-ui/components";
import { IMAGE_POLICY_PIXEL, SAVED_IMAGE_SOURCE_DOCUMENT, SAVED_LINK_DOCUMENT, SAVED_RICH_DOCUMENT } from "./PageRichTextEditorSection.fixture.fixtures";

const meta = {
  title: "Editors/PageRichTextEditorSection",
  component: PageRichTextEditorSection,
  tags: ["autodocs"],
  args: { lexicalValue: null, editorKey: "demo", onLexicalChange: () => {} },
} satisfies Meta<typeof PageRichTextEditorSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const INITIAL_DOC = {
  root: {
    type: "root",
    version: 1,
    children: [
      {
        type: "paragraph",
        version: 1,
        children: [
          {
            type: "text",
            version: 1,
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod vehicula vestibulum. Curabitur ut tempus mauris, eget sodales nisi. Pellentesque ultricies ut sem non aliquet. Suspendisse dapibus id est nec sollicitudin. Fusce at justo est.",
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
          },
        ],
        direction: null,
        format: "",
        indent: 0,
      },
      {
        type: "paragraph",
        version: 1,
        children: [],
        direction: null,
        format: "",
        indent: 0,
      },
      {
        type: "paragraph",
        version: 1,
        children: [
          {
            type: "text",
            version: 1,
            text: "Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris molestie diam sit amet aliquam lacinia. Pellentesque egestas iaculis velit et aliquam. Ut blandit velit vitae leo interdum, eget tincidunt mi vulputate.",
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
          },
        ],
        direction: null,
        format: "",
        indent: 0,
      },
      {
        type: "paragraph",
        version: 1,
        children: [],
        direction: null,
        format: "",
        indent: 0,
      },
      {
        type: "paragraph",
        version: 1,
        children: [
          {
            type: "text",
            version: 1,
            text: "Mauris ultrices sem a orci blandit, sed fringilla orci rhoncus. Mauris feugiat tincidunt ex eu semper. Donec enim ligula, mattis at ullamcorper sed, molestie non enim. Donec et nulla tempus, pulvinar ex quis, viverra mauris.",
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
          },
        ],
        direction: null,
        format: "",
        indent: 0,
      },
    ],
    direction: null,
    format: "",
    indent: 0,
  },
};

export const FullTools: Story = {
  render: () => {
    const [lexicalValue, setLexicalValue] = useState(INITIAL_DOC);

    return (
      <Provider style={{ height: 520, width: "100%" }}>
        <PageRichTextEditorSection
          editorKey="story-page-1"
          lexicalValue={lexicalValue}
          toolPreset="full"
          onLexicalChange={(next) => setLexicalValue(next as typeof INITIAL_DOC)}
        />
      </Provider>
    );
  },
};

export const WithDisabledTools: Story = {
  render: () => {
    const [lexicalValue, setLexicalValue] = useState(INITIAL_DOC);

    return (
      <Provider style={{ height: 520, width: "100%" }}>
        <PageRichTextEditorSection
          toolPreset="full"
          disabledControls={{ link: true, code: true }}
          disabledControlSets={{ colors: true }}
          hiddenControls={{ code: true, link: true }}
          hiddenControlSets={{ colors: true, insert: true }}
          editorKey="story-page-2"
          lexicalValue={lexicalValue}
          onLexicalChange={(next) => setLexicalValue(next as typeof INITIAL_DOC)}
        />
      </Provider>
    );
  },
};

export const BasePreset: Story = {
  render: () => {
    const [lexicalValue, setLexicalValue] = useState(INITIAL_DOC);

    return (
      <Provider style={{ height: 520, width: "100%" }}>
        <PageRichTextEditorSection
          editorKey="story-page-3"
          lexicalValue={lexicalValue}
          onLexicalChange={(next) => setLexicalValue(next as typeof INITIAL_DOC)}
        />
      </Provider>
    );
  },
};

export const DarkReadOnly: Story = { args: { lexicalValue: INITIAL_DOC, readOnly: true, "aria-label": "Read-only course content" }, decorators: [(Story) => <Provider theme="dark" style={{height:320}}><Story /></Provider>] };

/** The host saves callback JSON and supplies it with a new document key. */
export const SavedRichDocument: Story = {
  render: () => {
    const [value, setValue] = useState<unknown>(SAVED_RICH_DOCUMENT);
    const [seed, setSeed] = useState<unknown>(SAVED_RICH_DOCUMENT);
    const [revision, setRevision] = useState(0);
    const [readOnly, setReadOnly] = useState(false);
    return <Provider>
      <Button onPress={() => setReadOnly(current => !current)}>{readOnly ? 'Enable editing' : 'Make read-only'}</Button>
      <Button onPress={() => { setSeed(value); setRevision(current => current + 1); }}>Reload saved document</Button>
      <PageRichTextEditorSection lexicalValue={seed} editorKey={`rich-${revision}`} onLexicalChange={setValue}
        readOnly={readOnly} aria-label="Saved rich document" toolPreset="full" style={{ height: 520 }} />
      <pre aria-label="Saved rich JSON">{JSON.stringify(value)}</pre>
    </Provider>;
  },
};

/** Local images are temporary; a durable saved document needs a host upload. */
export const LocalImageLifecycle: Story = {
  render: () => {
    const [revision, setRevision] = useState(0);
    const [readOnly, setReadOnly] = useState(false);
    const [mounted, setMounted] = useState(true);
    const [value, setValue] = useState<unknown>(null);
    return <Provider>
      <Button onPress={() => setReadOnly(current => !current)}>{readOnly ? 'Enable editing' : 'Make read-only'}</Button>
      <Button onPress={() => { setReadOnly(false); setRevision(current => current + 1); }}>New document</Button>
      <Button onPress={() => setMounted(current => !current)}>{mounted ? 'Close editor' : 'Open editor'}</Button>
      {mounted && <PageRichTextEditorSection lexicalValue={null} editorKey={`local-image-${revision}`} onLexicalChange={setValue}
        readOnly={readOnly} aria-label="Local image document" toolPreset="full" style={{ height: 360 }} />}
      <pre aria-label="Saved image document">{JSON.stringify(value)}</pre>
    </Provider>;
  },
};

/** Native source fields intentionally exercise the browser's clipboard formats. */
export const ClipboardEditing: Story = {
  render: () => {
    const [value, setValue] = useState<unknown>(null);
    const [seed, setSeed] = useState<unknown>(null);
    const [revision, setRevision] = useState(0);
    const [readOnly, setReadOnly] = useState(false);
    return <Provider>
      <label>Plain clipboard source<textarea aria-label="Plain clipboard source" defaultValue={'First course line\nSecond course line'} /></label>
      <div role="textbox" aria-label="Rich clipboard source" aria-multiline="true" contentEditable suppressContentEditableWarning>
        <p><strong>Bold course</strong> and <em>italic lesson</em></p><p>Second paragraph</p>
      </div>
      <Button onPress={() => setReadOnly(current => !current)}>{readOnly ? 'Enable editing' : 'Make read-only'}</Button>
      <Button onPress={() => { setSeed(value); setRevision(current => current + 1); }}>Reload saved document</Button>
      <PageRichTextEditorSection lexicalValue={seed} editorKey={`clipboard-${revision}`} onLexicalChange={setValue}
        readOnly={readOnly} aria-label="Clipboard document" toolPreset="full" style={{ height: 360 }} />
      <pre aria-label="Saved document">{JSON.stringify(value)}</pre>
      <label>Copy destination<textarea aria-label="Copy destination" /></label>
    </Provider>;
  },
};

/** Saved and pasted destinations share the browser policy; host JSON retains its schema. */
export const LinkDestinations: Story = {
  render: () => {
    const [value, setValue] = useState<unknown>(SAVED_LINK_DOCUMENT);
    const [seed, setSeed] = useState<unknown>(SAVED_LINK_DOCUMENT);
    const [revision, setRevision] = useState(0);
    const [readOnly, setReadOnly] = useState(false);
    return <Provider>
      <div role="textbox" aria-label="Link clipboard source" contentEditable suppressContentEditableWarning>
        <p><a href="/link-policy-destination"><strong>Pasted guide</strong></a></p>
        <p><a href="javascript:alert('unsafe-paste')"><em>Pasted rejected script</em></a></p>
      </div>
      <Button onPress={() => setReadOnly(current => !current)}>{readOnly ? 'Enable editing' : 'Make read-only'}</Button>
      <Button onPress={() => { setSeed(value); setRevision(current => current + 1); }}>Reload saved document</Button>
      <PageRichTextEditorSection lexicalValue={seed} editorKey={`links-${revision}`} onLexicalChange={setValue}
        readOnly={readOnly} aria-label="Link document" toolPreset="full" style={{ height: 360 }} />
      <pre aria-label="Saved link JSON">{JSON.stringify(value)}</pre>
    </Provider>;
  },
};

/** Saved sources preserve host JSON; new uploads require a supported address. */
export const ImageSources: Story = {
  render: () => {
    const [value, setValue] = useState<unknown>(SAVED_IMAGE_SOURCE_DOCUMENT);
    const [seed, setSeed] = useState<unknown>(SAVED_IMAGE_SOURCE_DOCUMENT);
    const [revision, setRevision] = useState(0);
    const [readOnly, setReadOnly] = useState(false);
    const [attempt, setAttempt] = useState(0);
    return <Provider>
      <p>The first upload returns an unsupported address, the second malformed metadata, and the third a valid image. Retry with the same file and description.</p>
      <Button onPress={() => setReadOnly(current => !current)}>{readOnly ? 'Enable editing' : 'Make read-only'}</Button>
      <Button onPress={() => { setSeed(value); setRevision(current => current + 1); }}>Reload saved document</Button>
      <PageRichTextEditorSection lexicalValue={seed} editorKey={`image-sources-${revision}`} onLexicalChange={setValue}
        readOnly={readOnly} aria-label="Image source document" toolPreset="full" style={{ height: 360 }}
        onUploadImage={async () => {
          setAttempt(current => current + 1);
          // Deliberately model an untyped service response at the public boundary.
          // The first two results must remain retryable without inserting a node.
          if (attempt === 1) return { assetId: { unexpected: true }, assetVersionId: "upload-v1", src: IMAGE_POLICY_PIXEL } as unknown as { assetId: string; assetVersionId: string; src: string };
          return { assetId: "uploaded-image", assetVersionId: "upload-v1", src: attempt === 0 ? "javascript:alert('unsafe-upload')" : IMAGE_POLICY_PIXEL };
        }} />
      <pre aria-label="Saved image source JSON">{JSON.stringify(value)}</pre>
    </Provider>;
  },
};

/** The host keeps ownership of work that finishes after an editor lifetime ends. */
export const HostUploadLifecycle: Story = {
  render: () => {
    const [mode, setMode] = useState("reset");
    const [outcome, setOutcome] = useState("success");
    const [revision, setRevision] = useState(0);
    const [readOnly, setReadOnly] = useState(false);
    const [mounted, setMounted] = useState(true);
    const [value, setValue] = useState<unknown>(null);
    const [completed, setCompleted] = useState(0);
    const [pending, setPending] = useState<{ resolve: (value: { assetId: string; assetVersionId: string; src: string }) => void; reject: (error: Error) => void } | null>(null);
    useEffect(() => {
      if (!pending) return;
      if (mode === "reset") setRevision(current => current + 1);
      else if (mode === "read-only") setReadOnly(true);
      else setMounted(false);
      const timer = window.setTimeout(() => {
        if (outcome === "success") pending.resolve({ assetId: "stale-host-image", assetVersionId: "v1", src: IMAGE_POLICY_PIXEL });
        else pending.reject(new Error("Stale host failure"));
        setCompleted(current => current + 1);
        setPending(null);
      }, 100);
      return () => window.clearTimeout(timer);
    }, [pending, mode, outcome]);
    return <Provider>
      <p>Choose how the editor lifetime ends when upload starts. The host promise settles afterward.</p>
      {['reset', 'read-only', 'unmount'].map(choice => <Button key={choice} onPress={() => setMode(choice)}>Use {choice}</Button>)}
      {['success', 'failure'].map(choice => <Button key={choice} onPress={() => setOutcome(choice)}>Late {choice}</Button>)}
      <Button onPress={() => { setMounted(true); setReadOnly(false); }}>Resume editor</Button>
      <output aria-label="Host upload completion">{completed}</output>
      {mounted && <PageRichTextEditorSection lexicalValue={null} editorKey={`host-upload-${revision}`} onLexicalChange={setValue}
        readOnly={readOnly} aria-label="Host upload document" toolPreset="full" style={{ height: 360 }}
        onUploadImage={() => new Promise((resolve, reject) => setPending({ resolve, reject }))} />}
      <pre aria-label="Host upload document JSON">{JSON.stringify(value)}</pre>
    </Provider>;
  },
};

/** Save the real editor callback and replace its key to exercise table history/reload. */
export const TableHistory: Story = {
  render: () => {
    const [value, setValue] = useState<unknown>(null);
    const [seed, setSeed] = useState<unknown>(null);
    const [revision, setRevision] = useState(0);
    return <Provider>
      <Button onPress={() => { setSeed(value); setRevision(current => current + 1); }}>Reload saved table</Button>
      <PageRichTextEditorSection lexicalValue={seed} editorKey={`table-history-${revision}`} onLexicalChange={setValue}
        aria-label="Table history document" toolPreset="full" style={{ height: 420 }} />
      <pre aria-label="Saved table JSON">{JSON.stringify(value)}</pre>
    </Provider>;
  },
};


// HB-20: real Lexical composition, with host-owned long content and translations.
const richArabic:Record<string,string>={
 'editor.documentScrollRegion':'منطقة تمرير المستند',
 'editor.insert.menu':'إدراج محتوى', 'editor.insert.image':'إدراج صورة تعليمية',
 'editor.insert.horizontalRule':'إدراج فاصل أفقي للمحتوى التعليمي', 'editor.insert.columnsLayout':'تخطيط الأعمدة',
 'common.ui.editor.formatting':'تنسيق النص', 'common.ui.editor.selectionFormatting':'تنسيق النص المحدد',
 'common.ui.editor.undo':'تراجع', 'common.ui.editor.redo':'إعادة',
 'common.ui.editor.heading':'نمط عنوان النص', 'common.ui.editor.fontFamily':'نوع الخط',
 'common.ui.editor.fontSize':'حجم الخط', 'common.ui.editor.fontSizeDecrease':'تصغير حجم الخط',
 'common.ui.editor.fontSizeIncrease':'تكبير حجم الخط', 'common.ui.editor.bold':'عريض',
 'common.ui.editor.italic':'مائل','common.ui.editor.underline':'تسطير','common.ui.editor.code':'رمز برمجي',
 'common.ui.editor.link':'تعديل الرابط','common.ui.editor.textColor':'لون النص','common.ui.editor.backgroundColor':'لون الخلفية',
 'common.ui.editor.hexColor':'رمز اللون','common.ui.editor.customColor':'لون مخصص','common.ui.editor.themeColors':'ألوان السمة',
 'common.ui.editor.invalidHexColor':'أدخل رمز لون من ست خانات مثل \u2066#336699\u2069.',
 'common.ui.editor.alignment':'محاذاة النص','common.ui.editor.align.left':'محاذاة لليسار',
 'common.ui.editor.align.center':'محاذاة للوسط','common.ui.editor.align.right':'محاذاة لليمين',
 'common.ui.editor.align.justify':'ضبط محاذاة النص','common.ui.editor.align.start':'محاذاة لبداية السطر',
 'common.ui.editor.align.end':'محاذاة لنهاية السطر','common.ui.editor.indent':'زيادة المسافة البادئة',
 'common.ui.editor.outdent':'تقليل المسافة البادئة','common.ui.editor.textStyle':'نمط النص',
 'common.ui.editor.lowercase':'أحرف صغيرة','common.ui.editor.uppercase':'أحرف كبيرة',
 'common.ui.editor.capitalize':'تكبير الحرف الأول','common.ui.editor.strikethrough':'شطب النص',
 'common.ui.editor.subscript':'نص سفلي','common.ui.editor.superscript':'نص علوي',
 'common.ui.editor.highlight':'تمييز النص','common.ui.editor.clearFormatting':'إزالة تنسيق النص المحدد بالكامل',
 'common.ui.clear':'مسح','common.ui.reset':'إعادة ضبط',
 'common.ui.editor.color.text':'نص','common.ui.editor.color.textMuted':'نص ثانوي',
 'common.ui.editor.color.action':'أساسي','common.ui.editor.color.actionHover':'تأكيد أساسي',
 'common.ui.editor.color.danger':'خطأ','common.ui.editor.color.surface':'سطح',
 'common.ui.editor.color.surfaceSubtle':'سطح ثانوي',
 'common.ui.editor.headingOption0':'نص عادي للمستندات التعليمية الطويلة',
 'common.ui.editor.headingOption1':'عنوان أول','common.ui.editor.headingOption2':'عنوان ثان',
 'common.ui.editor.headingOption3':'عنوان ثالث','common.ui.editor.headingOption4':'عنوان رابع',
 'common.ui.editor.headingOption5':'عنوان خامس','common.ui.editor.headingOption6':'عنوان سادس',
};
const richEnglish:Record<string,string>={
 'common.ui.editor.headingOption0':'Normal text for long international course documents',
 'editor.insert.horizontalRule':'Insert a horizontal separator for the learning document',
 'common.ui.editor.clearFormatting':'Clear all formatting from the selected document content',
};
function LocalizedRichPresentation({globals}:{globals:FixtureGlobals}){
 const rtl=globals.locale.startsWith('ar');
 const text=rtl?'التعاون بين فرق التدريس وتطوير المحتوى التعليمي مع مراجعة المستندات والأنشطة.':'International teaching team collaboration, course development and review of learning documents and activities.';
 const [value,setValue]=useState<unknown>(()=>({root:{type:'root',version:1,direction:rtl?'rtl':'ltr',format:'',indent:0,children:Array.from({length:18},(_,index)=>({type:'paragraph',version:1,direction:rtl?'rtl':'ltr',format:'',indent:0,children:[{type:'text',version:1,text:`${text} ${index+1}. ${text}`,detail:0,format:0,mode:'normal',style:''}]}))}}));
 const adapter:SGTranslationAdapter={locale:globals.locale,useNamespace:()=>{},t:(key,options)=>(rtl?richArabic:richEnglish)[key]??options.defaultMessage};
 return <SGTranslationProvider value={adapter}><Provider theme={globals.theme} density={globals.density} dir={rtl?'rtl':'ltr'}>
  <div data-testid="localized-rich-editor" style={{height:760,maxWidth:'100%'}}>
   <PageRichTextEditorSection editorKey="localized-presentation" lexicalValue={value} onLexicalChange={setValue} toolPreset="full" aria-label={rtl?'المستند التعليمي الطويل':'Long learning document'}/>
  </div>
 </Provider></SGTranslationProvider>;
}
export const LocalizedPresentation:Story={render:(_args,{globals})=><LocalizedRichPresentation globals={globals}/>};

/** Rejected inputs remain host data; no editable partial parse can overwrite them. */
export const DocumentAdmission: Story = {
  render: () => {
    const [input, setInput] = useState<unknown>(SAVED_RICH_DOCUMENT);
    const [saved, setSaved] = useState<unknown>(SAVED_RICH_DOCUMENT);
    const [revision, setRevision] = useState(0);
    const [changes, setChanges] = useState(0);
    const [safeClipboard, setSafeClipboard] = useState(false);
    const load = (kind: "unknown" | "style" | "typing-style" | "heading" | "image" | "valid", replace = true) => {
      const next = structuredClone(SAVED_RICH_DOCUMENT) as any;
      if (kind === "unknown") next.root.children.push({ type: "unknown-host-widget", version: 1 });
      if (kind === "style") next.root.children[1].children[0].style = "background-image: u/**/rl(https://rejected-editor-style.example/pixel); position: fixed; inset: 0;";
      if (kind === "typing-style") { next.root.children = [next.root.children[1]]; next.root.children[0].children = []; next.root.children[0].textStyle = "position: fixed; background-image: url(https://rejected-editor-style.example/pixel)"; }
      if (kind === "heading") { next.root.children[0].tag = "script"; next.root.children[0].children[0].text = "window.__sguiSavedHeadingExecuted = true"; }
      if (kind === "image") next.root.children[8].children[0].assetId = { unexpected: true };
      setInput(next); if (replace) setRevision(current => current + 1);
    };
    return <Provider>
      <Button onPress={() => load("unknown")}>Load unknown node</Button>
      <Button onPress={() => load("style")}>Load resource style</Button>
      <Button onPress={() => load("typing-style")}>Load inherited typing style</Button>
      <Button onPress={() => load("heading")}>Load unsafe heading</Button>
      <Button onPress={() => load("image")}>Load malformed image</Button>
      <Button onPress={() => load("valid", false)}>Change same-key input</Button>
      <Button onPress={() => load("valid")}>Load valid document</Button>
      <Button onPress={() => setSafeClipboard(true)}>Use safe clipboard content</Button>
      <textarea aria-label="Admission clipboard source" readOnly value="Clipboard content" onCopy={event => {
        const node = structuredClone(SAVED_RICH_DOCUMENT.root.children[1]) as any;
        node.children = [{ type: "text", version: 1, text: safeClipboard ? "Safe clipboard text" : "Rejected clipboard text",
          detail: 0, format: 1, mode: "normal", style: safeClipboard ? "color: var(--sgui-action);" : "transform: translateX(-100vw); background-image: url(https://rejected-editor-style.example/pixel)" }];
        event.clipboardData.setData("application/x-lexical-editor", JSON.stringify({ namespace: "experience-native-content-page", nodes: [node] }));
        event.clipboardData.setData("text/plain", "Clipboard content"); event.preventDefault();
      }} />
      <PageRichTextEditorSection lexicalValue={input} editorKey={`admission-${revision}`}
        onLexicalChange={next => { setSaved(next); setChanges(current => current + 1); }}
        aria-label="Admission document" toolPreset="full" style={{ height: 360 }} />
      <pre aria-label="Original admission JSON">{JSON.stringify(input)}</pre>
      <pre aria-label="Saved admission JSON">{JSON.stringify(saved)}</pre>
      <output aria-label="Admission callback count">{changes}</output>
    </Provider>;
  },
};

const STRUCTURED_CONTENT_DOCUMENT = (() => {
  const value = structuredClone(SAVED_RICH_DOCUMENT) as any;
  const nested = structuredClone(value.root.children[4]);
  nested.children[0].children[0].text = "Nested practice lesson";
  nested.children[0].indent = 1;
  value.root.children[3].children.push({ type: "listitem", version: 1, direction: null, format: "", indent: 0, value: 5, children: [nested] });
  const row = value.root.children[7].children[0];
  row.children[0].colSpan = 2; row.children[0].headerState = 3; row.children.splice(1, 1);
  return value;
})();
/** Authored native corpus; does not claim an approved consumer schema inventory. */
export const StructuredContent: Story = {
  render: () => {
    const [value, setValue] = useState<unknown>(STRUCTURED_CONTENT_DOCUMENT);
    const [seed, setSeed] = useState<unknown>(STRUCTURED_CONTENT_DOCUMENT);
    const [revision, setRevision] = useState(0);
    const [readOnly, setReadOnly] = useState(false);
    return <Provider>
      <Button onPress={() => { setSeed(value); setRevision(current => current + 1); }}>Reload structured document</Button>
      <Button onPress={() => setReadOnly(current => !current)}>{readOnly ? "Enable editing" : "Make read-only"}</Button>
      <PageRichTextEditorSection lexicalValue={seed} editorKey={`structured-${revision}`} onLexicalChange={setValue}
        readOnly={readOnly} aria-label="Structured content document" toolPreset="full" style={{ height: 460 }} />
      <pre aria-label="Saved structured JSON">{JSON.stringify(value)}</pre>
    </Provider>;
  },
};
