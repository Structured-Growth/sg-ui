import {
  PageRichTextEditorSection as PageRichTextEditorSectionImpl,
  type PageRichTextEditorSectionProps,
} from "./PageRichTextEditorSection.impl";

export type { PageRichTextEditorSectionProps };

export function PageRichTextEditorSection(props: PageRichTextEditorSectionProps) {
  return PageRichTextEditorSectionImpl(props);
}
