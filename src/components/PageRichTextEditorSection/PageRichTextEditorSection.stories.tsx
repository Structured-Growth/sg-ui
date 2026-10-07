import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Provider } from "../../experimental/Provider/Provider";
import { PageRichTextEditorSection } from "./PageRichTextEditorSection";
import { AppButton } from "../AppButton/AppButton";
import { IMAGE_POLICY_PIXEL, SAVED_IMAGE_SOURCE_DOCUMENT, SAVED_LINK_DOCUMENT, SAVED_RICH_DOCUMENT } from "./PageRichTextEditorSection.stories.fixtures";

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
      <AppButton onPress={() => setReadOnly(current => !current)}>{readOnly ? 'Enable editing' : 'Make read-only'}</AppButton>
      <AppButton onPress={() => { setSeed(value); setRevision(current => current + 1); }}>Reload saved document</AppButton>
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
      <AppButton onPress={() => setReadOnly(current => !current)}>{readOnly ? 'Enable editing' : 'Make read-only'}</AppButton>
      <AppButton onPress={() => { setReadOnly(false); setRevision(current => current + 1); }}>New document</AppButton>
      <AppButton onPress={() => setMounted(current => !current)}>{mounted ? 'Close editor' : 'Open editor'}</AppButton>
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
      <AppButton onPress={() => setReadOnly(current => !current)}>{readOnly ? 'Enable editing' : 'Make read-only'}</AppButton>
      <AppButton onPress={() => { setSeed(value); setRevision(current => current + 1); }}>Reload saved document</AppButton>
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
      <AppButton onPress={() => setReadOnly(current => !current)}>{readOnly ? 'Enable editing' : 'Make read-only'}</AppButton>
      <AppButton onPress={() => { setSeed(value); setRevision(current => current + 1); }}>Reload saved document</AppButton>
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
      <p>The first host upload returns an unsupported address. Retry with the same file and description.</p>
      <AppButton onPress={() => setReadOnly(current => !current)}>{readOnly ? 'Enable editing' : 'Make read-only'}</AppButton>
      <AppButton onPress={() => { setSeed(value); setRevision(current => current + 1); }}>Reload saved document</AppButton>
      <PageRichTextEditorSection lexicalValue={seed} editorKey={`image-sources-${revision}`} onLexicalChange={setValue}
        readOnly={readOnly} aria-label="Image source document" toolPreset="full" style={{ height: 360 }}
        onUploadImage={async () => {
          setAttempt(current => current + 1);
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
      {['reset', 'read-only', 'unmount'].map(choice => <AppButton key={choice} onPress={() => setMode(choice)}>Use {choice}</AppButton>)}
      {['success', 'failure'].map(choice => <AppButton key={choice} onPress={() => setOutcome(choice)}>Late {choice}</AppButton>)}
      <AppButton onPress={() => { setMounted(true); setReadOnly(false); }}>Resume editor</AppButton>
      <output aria-label="Host upload completion">{completed}</output>
      {mounted && <PageRichTextEditorSection lexicalValue={null} editorKey={`host-upload-${revision}`} onLexicalChange={setValue}
        readOnly={readOnly} aria-label="Host upload document" toolPreset="full" style={{ height: 360 }}
        onUploadImage={() => new Promise((resolve, reject) => setPending({ resolve, reject }))} />}
      <pre aria-label="Host upload document JSON">{JSON.stringify(value)}</pre>
    </Provider>;
  },
};
