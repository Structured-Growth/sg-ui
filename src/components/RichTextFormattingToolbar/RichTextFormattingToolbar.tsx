import {
  RichTextFormattingToolbar as RichTextFormattingToolbarImpl,
  type RichTextFormattingToolbarProps,
  type RichTextHeadingValue,
  type RichTextToolbarControlId,
  type RichTextToolbarControlSetId,
} from "./RichTextFormattingToolbar.impl";
import type { AlignOption } from "../TextAlignMenuControl";

export type {
  AlignOption,
  RichTextFormattingToolbarProps,
  RichTextHeadingValue,
  RichTextToolbarControlId,
  RichTextToolbarControlSetId,
};

export function RichTextFormattingToolbar(props: RichTextFormattingToolbarProps) {
  return RichTextFormattingToolbarImpl(props);
}
