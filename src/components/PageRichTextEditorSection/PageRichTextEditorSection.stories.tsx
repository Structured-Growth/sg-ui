import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Provider } from "../../experimental/Provider/Provider";
import { PageRichTextEditorSection } from "./PageRichTextEditorSection";
import { AppButton } from "../AppButton/AppButton";

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
