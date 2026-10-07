import { useCallback, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../experimental/Button/Button";
import { Typography } from "../../experimental/Typography/Typography";
import { ThemeScope } from "../../foundation/ThemeScope";
import { DocumentEditorLayout } from "./DocumentEditorLayout";

const meta = {
  title: "Layout/DocumentEditorLayout",
  component: DocumentEditorLayout,
  tags: ["autodocs"],
} satisfies Meta<typeof DocumentEditorLayout>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Document",
    style: { height: 420, border: "1px solid var(--sgui-divider)" },
    headerRight: <Button density="compact" variant="outlined">Save</Button>,
    menuBar: <Typography variant="body2">File · Edit · View</Typography>,
    toolbar: <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--sgui-space2)" }}>
      <Button density="compact" variant="outlined">Bold</Button><Button density="compact" variant="outlined">Italic</Button>
    </div>,
    children: <div style={{ padding: "var(--sgui-space4)", flex: 1, minHeight: 0, overflow: "auto" }}>
      {Array.from({ length: 20 }, (_, i) => <Typography key={i}>Editor content paragraph {i + 1}. The document scrolls while its header and tools remain visible.</Typography>)}
      <Button variant="outlined">End of document action</Button>
    </div>,
  },
};
export const CustomTitle: Story = {
  args: { ...Default.args, titleNode: <Typography as="h2" variant="h6">Host document heading</Typography>, menuBar: undefined },
};
export const NarrowDark: Story = {
  args: { ...Default.args, title: "A document with a long translated title that wraps within the available width" },
  decorators: [(Story) => <ThemeScope theme="dark" style={{ width: 260, maxWidth: "100%" }}><Story /></ThemeScope>],
};

function SlotReplacementPreview() {
  const [chrome, setChrome] = useState<"absent" | "draft" | "review">("absent");
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const attachRoot = useCallback((node: HTMLDivElement | null) => {
    rootRef.current = node;
    if (node) node.dataset.refAttachments = String(Number(node.dataset.refAttachments ?? 0) + 1);
  }, []);
  const attachHost = useCallback((node: HTMLDivElement | null) => {
    hostRef.current = node;
    if (node) node.dataset.refAttachments = String(Number(node.dataset.refAttachments ?? 0) + 1);
  }, []);
  const present = chrome !== "absent";
  return <div data-testid="replacement-fixture" data-chrome={chrome} style={{ width: 260, maxWidth: "100%" }}>
    <Typography variant="body2">While focused in the document, Alt+1 removes chrome, Alt+2 adds draft tools and Alt+3 replaces them with review tools.</Typography>
    <DocumentEditorLayout ref={attachRoot} title="Course document" style={{ height: 680, border: "1px solid var(--sgui-divider)" }}
      headerRight={present ? <Button key={chrome} density="compact" variant="outlined">{chrome === "draft" ? "Save draft" : "Publish review"}</Button> : undefined}
      menuBar={present ? <Typography key={chrome} variant="body2">{chrome === "draft" ? "File · Edit" : "Review · Comments"}</Typography> : undefined}
      toolbar={present ? <Button key={chrome} density="compact" variant="outlined">{chrome === "draft" ? "Format draft" : "Review changes"}</Button> : undefined}>
      <div ref={attachHost} role="region" aria-label="Host document scroll" tabIndex={0}
        style={{ flex: 1, minHeight: 0, overflow: "auto", padding: "var(--sgui-space3)" }}
        onKeyDown={event => {
          if (!event.altKey || !["1", "2", "3"].includes(event.key)) return;
          event.preventDefault();
          setChrome(event.key === "1" ? "absent" : event.key === "2" ? "draft" : "review");
        }}>
        {Array.from({ length: 30 }, (_, index) => <div key={index} style={{ paddingBlock: "var(--sgui-space3)" }}>
          <Typography>Course paragraph {index + 1}. Host content and its scroll position survive changes to editor chrome.</Typography>
          <Button density="compact" variant="outlined">Document action {index + 1}</Button>
        </div>)}
      </div>
    </DocumentEditorLayout>
  </div>;
}

export const SlotReplacement: Story = {
  args: { title: "Course document", children: null },
  render: () => <SlotReplacementPreview />,
  parameters: { docs: { description: { story: "M-21 F6a: host-owned scrolling with live header action, menu and toolbar insertion/removal/replacement. Keyboard shortcuts keep focus in the same document node. Resize or enlarge browser text to inspect reflow in either production theme." } } },
};
