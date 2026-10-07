import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { HorizontalRuleSelectionPlugin } from "./HorizontalRuleSelectionPlugin";
import { ImageInsertPlugin } from "./ImageInsertPlugin";

export type ExperienceEditorPluginsProps = {
  onChange: (nextLexical: unknown) => void;
};

export function ExperienceEditorPlugins({ onChange }: ExperienceEditorPluginsProps) {
  return (
    <>
      <HistoryPlugin />
      <LinkPlugin />
      <ListPlugin />
      <ClickableLinkPlugin newTab />
      <HorizontalRulePlugin />
      <HorizontalRuleSelectionPlugin />
      <ImageInsertPlugin />
      <TablePlugin hasCellBackgroundColor hasCellMerge hasTabHandler />
      <OnChangePlugin
        onChange={(editorState) => {
          onChange(editorState.toJSON());
        }}
      />
    </>
  );
}
