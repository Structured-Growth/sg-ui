"use client";

import { forwardRef, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { Button } from "../../experimental/Button/Button";
import { Select } from "../../experimental/Select/Select";
import { useTranslation } from "../../i18n";
import { UndoIcon } from "../../experimental/icons/UndoIcon";
import { RedoIcon } from "../../experimental/icons/RedoIcon";
import { FormatBoldIcon } from "../../experimental/icons/FormatBoldIcon";
import { FormatItalicIcon } from "../../experimental/icons/FormatItalicIcon";
import { FormatUnderlinedIcon } from "../../experimental/icons/FormatUnderlinedIcon";
import { CodeIcon } from "../../experimental/icons/CodeIcon";
import { LinkIcon } from "../../experimental/icons/LinkIcon";
import { AddIcon } from "../../experimental/icons/AddIcon";
import { RemoveIcon } from "../../experimental/icons/RemoveIcon";
import { InsertContentMenuControl } from "../InsertContentMenuControl";
import { type AlignOption, TextAlignMenuControl } from "../TextAlignMenuControl";
import { TextColorPickerControl } from "../TextColorPickerControl";
import { TextStyleMenuControl, type TextStyleId } from "../TextStyleMenuControl";
import styles from "./RichTextFormattingToolbar.module.css";

export type RichTextToolbarControlId =
  | "undo"
  | "redo"
  | "heading"
  | "fontFamily"
  | "fontSizeDecrease"
  | "fontSizeIncrease"
  | "bold"
  | "italic"
  | "underline"
  | "code"
  | "link"
  | "textColor"
  | "backgroundColor"
  | "alignment"
  | "textStyle"
  | "insert";

export type RichTextToolbarControlSetId =
  | "history"
  | "heading"
  | "fontFamily"
  | "fontSize"
  | "inlineFormats"
  | "colors"
  | "alignment"
  | "textStyle"
  | "insert";

export type RichTextHeadingValue =
  | "Normal"
  | "Heading 1"
  | "Heading 2"
  | "Heading 3"
  | "Heading 4"
  | "Heading 5"
  | "Heading 6"
  | "Body Alt 1"
  | "Body Alt 2"
  | "Body Alt 3";

export type RichTextFormattingToolbarProps = {
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
  activeTextStyles?: readonly TextStyleId[];
  canIndent?: boolean;
  canOutdent?: boolean;
  headingValue?: RichTextHeadingValue;
  onHeadingChange?: (value: RichTextHeadingValue) => void;
  showFontFamilySelector?: boolean;
  fontFamilyValue?: string;
  onFontFamilyChange?: (value: string) => void;
  showFontSizeControls?: boolean;
  fontSizeValue?: number;
  onFontSizeDecrease?: () => void;
  onFontSizeIncrease?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onBold?: () => void;
  boldActive?: boolean | "mixed";
  onItalic?: () => void;
  italicActive?: boolean | "mixed";
  onUnderline?: () => void;
  underlineActive?: boolean | "mixed";
  onCode?: () => void;
  codeActive?: boolean | "mixed";
  onLink?: () => void;
  onLinkMouseDown?: () => void;
  textColorValue?: string;
  onTextColorChange?: (nextColor: string) => void;
  backgroundColorValue?: string;
  onBackgroundColorChange?: (nextColor: string) => void;
  onTextStyleLowercase?: () => void;
  onTextStyleUppercase?: () => void;
  onTextStyleCapitalize?: () => void;
  onTextStyleStrikethrough?: () => void;
  onTextStyleSubscript?: () => void;
  onTextStyleSuperscript?: () => void;
  onTextStyleHighlight?: () => void;
  onTextStyleClearFormatting?: () => void;
  onInsertHorizontalRule?: () => void;
  onInsertColumnsLayout?: () => void;
  onInsertImage?: () => void;
  alignmentValue?: AlignOption;
  onAlignmentChange?: (next: AlignOption) => void;
  onOutdent?: () => void;
  onIndent?: () => void;
  disabledControls?: Partial<Record<RichTextToolbarControlId, boolean>>;
  disabledControlSets?: Partial<Record<RichTextToolbarControlSetId, boolean>>;
  hiddenControls?: Partial<Record<RichTextToolbarControlId, boolean>>;
  hiddenControlSets?: Partial<Record<RichTextToolbarControlSetId, boolean>>;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  disableContainerPadding?: boolean;
};

const headings: readonly RichTextHeadingValue[] = ["Normal", "Heading 1", "Heading 2", "Heading 3", "Heading 4", "Heading 5", "Heading 6", "Body Alt 1", "Body Alt 2", "Body Alt 3"];

export const RichTextFormattingToolbar = forwardRef<HTMLDivElement, RichTextFormattingToolbarProps>(function RichTextFormattingToolbar({
  className, style, "aria-label": ariaLabel, activeTextStyles, canIndent, canOutdent,
  headingValue = "Normal",
  onHeadingChange,
  showFontFamilySelector = true,
  fontFamilyValue = "Arial",
  onFontFamilyChange,
  showFontSizeControls = true,
  fontSizeValue = 15,
  onFontSizeDecrease,
  onFontSizeIncrease,
  onUndo,
  onRedo,
  onBold,
  boldActive = false,
  onItalic,
  italicActive = false,
  onUnderline,
  underlineActive = false,
  onCode,
  codeActive = false,
  onLink,
  onLinkMouseDown,
  textColorValue,
  onTextColorChange,
  backgroundColorValue,
  onBackgroundColorChange,
  onTextStyleLowercase,
  onTextStyleUppercase,
  onTextStyleCapitalize,
  onTextStyleStrikethrough,
  onTextStyleSubscript,
  onTextStyleSuperscript,
  onTextStyleHighlight,
  onTextStyleClearFormatting,
  onInsertHorizontalRule,
  onInsertColumnsLayout,
  onInsertImage,
  alignmentValue = "left",
  onAlignmentChange,
  onOutdent,
  onIndent,
  disabledControls,
  disabledControlSets,
  hiddenControls,
  hiddenControlSets,
  leftSlot,
  rightSlot,
  disableContainerPadding = false,
}, ref) {
  const { t } = useTranslation();
  const pendingChanges = useRef(new Set<ReturnType<typeof setTimeout>>());
  useEffect(() => () => { pendingChanges.current.forEach(clearTimeout); pendingChanges.current.clear(); }, []);
  // Finish the select event and its focus restoration before a host command can
  // focus contenteditable. Synchronous focus lets native Enter edit the selection.
  const requestSelectionChange = (apply: () => void) => {
    const timer = setTimeout(() => { pendingChanges.current.delete(timer); apply(); }, 0);
    pendingChanges.current.add(timer);
  };
  const label = (id: string, fallback: string) => t(`common.ui.editor.${id}`, { defaultMessage: fallback });
  const isDisabled = (control: RichTextToolbarControlId, set: RichTextToolbarControlSetId) => Boolean(disabledControlSets?.[set] || disabledControls?.[control]);
  const isHidden = (control: RichTextToolbarControlId, set: RichTextToolbarControlSetId) => Boolean(hiddenControlSets?.[set] || hiddenControls?.[control]);
  const action = (id: RichTextToolbarControlId, set: RichTextToolbarControlSetId, name: string, icon: ReactNode, onPress?: () => void, active?: boolean | "mixed") =>
    isHidden(id, set) ? null : <Button key={id} aria-label={label(id, name)} aria-pressed={active} variant="text" tone="neutral" density="compact"
      className={styles.action} disabled={isDisabled(id, set) || !onPress} onPress={onPress} startIcon={icon} />;
  return <div ref={ref} className={[styles.root, className].filter(Boolean).join(" ")} style={style}
    aria-label={ariaLabel ?? label("formatting", "Text formatting")} role="group" data-sgui-part="formatting-toolbar" data-padding={!disableContainerPadding}>
    <div className={styles.group}>
      {action("undo", "history", "Undo", <UndoIcon />, onUndo)}
      {action("redo", "history", "Redo", <RedoIcon />, onRedo)}
    </div>
    {!isHidden("heading", "heading") && <Select className={styles.select} label={label("heading", "Text style heading")}
      value={headingValue} disabled={isDisabled("heading", "heading") || !onHeadingChange}
      options={headings.map((id, index) => ({ id, label: label(`headingOption${index}`, id) }))}
      onValueChange={value => { if (value !== null && headings.includes(value as RichTextHeadingValue)) requestSelectionChange(() => onHeadingChange?.(value as RichTextHeadingValue)); }} />}
    {showFontFamilySelector && !isHidden("fontFamily", "fontFamily") && <Select className={styles.select} label={label("fontFamily", "Font family")}
      value={fontFamilyValue} disabled={isDisabled("fontFamily", "fontFamily") || !onFontFamilyChange}
      options={["Arial", "Georgia", "Times New Roman"].map(id => ({ id, label: id }))} onValueChange={value => { if (value !== null) requestSelectionChange(() => onFontFamilyChange?.(value)); }} />}
    {showFontSizeControls && (!isHidden("fontSizeDecrease", "fontSize") || !isHidden("fontSizeIncrease", "fontSize")) && <div className={styles.group}>
      {action("fontSizeDecrease", "fontSize", "Decrease font size", <RemoveIcon />, onFontSizeDecrease)}
      <output className={styles.fontSize} aria-label={label("fontSize", "Font size")}>{fontSizeValue}</output>
      {action("fontSizeIncrease", "fontSize", "Increase font size", <AddIcon />, onFontSizeIncrease)}
    </div>}
    <div className={styles.group}>
      {action("bold", "inlineFormats", "Bold", <FormatBoldIcon />, onBold, boldActive)}
      {action("italic", "inlineFormats", "Italic", <FormatItalicIcon />, onItalic, italicActive)}
      {action("underline", "inlineFormats", "Underline", <FormatUnderlinedIcon />, onUnderline, underlineActive)}
      {action("code", "inlineFormats", "Inline code", <CodeIcon />, onCode, codeActive)}
      {!isHidden("link", "inlineFormats") && <span className={styles.link} onMouseDownCapture={event => {
        if (!isDisabled("link", "inlineFormats") && onLink) { event.preventDefault(); onLinkMouseDown?.(); }
      }}>{action("link", "inlineFormats", "Edit link", <LinkIcon />, onLink)}</span>}
    </div>
    <div className={styles.group}>
      {!isHidden("textColor", "colors") && <TextColorPickerControl disabled={isDisabled("textColor", "colors")} value={textColorValue} onChange={onTextColorChange} />}
      {!isHidden("backgroundColor", "colors") && <TextColorPickerControl mode="background" disabled={isDisabled("backgroundColor", "colors")} value={backgroundColorValue} onChange={onBackgroundColorChange} />}
    </div>
    {!isHidden("alignment", "alignment") && <TextAlignMenuControl disabled={isDisabled("alignment", "alignment")} value={alignmentValue} onChange={onAlignmentChange}
      onIndent={onIndent} onOutdent={onOutdent} canIndent={canIndent} canOutdent={canOutdent} />}
    {!isHidden("textStyle", "textStyle") && <TextStyleMenuControl disabled={isDisabled("textStyle", "textStyle")} activeStyles={activeTextStyles}
      onLowercase={onTextStyleLowercase} onUppercase={onTextStyleUppercase} onCapitalize={onTextStyleCapitalize}
      onStrikethrough={onTextStyleStrikethrough} onSubscript={onTextStyleSubscript} onSuperscript={onTextStyleSuperscript}
      onHighlight={onTextStyleHighlight} onClearFormatting={onTextStyleClearFormatting} />}
    {leftSlot != null && <div className={styles.slot}>{leftSlot}</div>}
    {!isHidden("insert", "insert") && <InsertContentMenuControl disabled={isDisabled("insert", "insert")} onInsertHorizontalRule={onInsertHorizontalRule} onInsertColumnsLayout={onInsertColumnsLayout} onInsertImage={onInsertImage} />}
    {rightSlot != null && <div className={styles.slot}>{rightSlot}</div>}
  </div>;
});
