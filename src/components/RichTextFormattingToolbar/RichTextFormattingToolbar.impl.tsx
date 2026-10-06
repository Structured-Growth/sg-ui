import type { ReactNode } from "react";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import FontDownloadIcon from "@mui/icons-material/FontDownload";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import CodeIcon from "@mui/icons-material/Code";
import LinkIcon from "@mui/icons-material/Link";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { InsertContentMenuControl } from "../InsertContentMenuControl";
import { type AlignOption, TextAlignMenuControl } from "../TextAlignMenuControl";
import { TextColorPickerControl } from "../TextColorPickerControl";
import { TextStyleMenuControl } from "../TextStyleMenuControl";

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
  boldActive?: boolean;
  onItalic?: () => void;
  italicActive?: boolean;
  onUnderline?: () => void;
  underlineActive?: boolean;
  onCode?: () => void;
  codeActive?: boolean;
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

const formatIconButtonSx = {
  borderRadius: 1,
  color: "text.secondary",
  p: 0.5,
};

export function RichTextFormattingToolbar({
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
}: RichTextFormattingToolbarProps) {
  const compactSelectSx = {
    "& .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
    "& .MuiSelect-select": {
      py: 0.5,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
    minHeight: 30,
  };
  const isDisabled = (control: RichTextToolbarControlId, set: RichTextToolbarControlSetId) =>
    Boolean(disabledControlSets?.[set] || disabledControls?.[control]);
  const isHidden = (control: RichTextToolbarControlId, set: RichTextToolbarControlSetId) =>
    Boolean(hiddenControlSets?.[set] || hiddenControls?.[control]);
  const triggerHeadingSelection = (value: RichTextHeadingValue) => {
    onHeadingChange?.(value);
  };
  const formatButtonSx = (active: boolean) => ({
    ...formatIconButtonSx,
    backgroundColor: active ? "action.selected" : "transparent",
  });

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", ...(disableContainerPadding ? {} : { px: 1, py: 0.25 }) }}>
      <Box sx={{ alignItems: "center", columnGap: 0.75, display: "flex", flexWrap: "wrap", rowGap: 0.5 }}>
        <Box sx={{ alignItems: "center", display: "flex", flexShrink: 0 }}>
          {!isHidden("undo", "history") || !isHidden("redo", "history") ? (
            <Stack alignItems="center" direction="row" spacing={0.75}>
              {!isHidden("undo", "history") ? (
                <IconButton disabled={isDisabled("undo", "history")} onClick={onUndo} size="small" sx={formatIconButtonSx}>
                  <UndoIcon fontSize="small" />
                </IconButton>
              ) : null}
              {!isHidden("redo", "history") ? (
                <IconButton disabled={isDisabled("redo", "history")} onClick={onRedo} size="small" sx={formatIconButtonSx}>
                  <RedoIcon fontSize="small" />
                </IconButton>
              ) : null}
            </Stack>
          ) : null}

          {!isHidden("heading", "heading") ? <Divider flexItem orientation="vertical" sx={{ mx: 0.75 }} /> : null}

          {!isHidden("heading", "heading") ? (
            <Stack alignItems="center" direction="row" spacing={0.75}>
              <FormatSizeIcon fontSize="small" sx={{ color: "text.secondary" }} />
              <Select
                disabled={isDisabled("heading", "heading")}
                onChange={(event) => triggerHeadingSelection(event.target.value as RichTextHeadingValue)}
                size="small"
                sx={{ ...compactSelectSx, minWidth: 130 }}
                value={headingValue}
              >
                <MenuItem onClick={() => triggerHeadingSelection("Normal")} value="Normal">Normal</MenuItem>
                <MenuItem onClick={() => triggerHeadingSelection("Heading 1")} value="Heading 1">Heading 1</MenuItem>
                <MenuItem onClick={() => triggerHeadingSelection("Heading 2")} value="Heading 2">Heading 2</MenuItem>
                <MenuItem onClick={() => triggerHeadingSelection("Heading 3")} value="Heading 3">Heading 3</MenuItem>
                <MenuItem onClick={() => triggerHeadingSelection("Heading 4")} value="Heading 4">Heading 4</MenuItem>
                <MenuItem onClick={() => triggerHeadingSelection("Heading 5")} value="Heading 5">Heading 5</MenuItem>
                <MenuItem onClick={() => triggerHeadingSelection("Heading 6")} value="Heading 6">Heading 6</MenuItem>
                <MenuItem onClick={() => triggerHeadingSelection("Body Alt 1")} value="Body Alt 1">Body Alt 1</MenuItem>
                <MenuItem onClick={() => triggerHeadingSelection("Body Alt 2")} value="Body Alt 2">Body Alt 2</MenuItem>
                <MenuItem onClick={() => triggerHeadingSelection("Body Alt 3")} value="Body Alt 3">Body Alt 3</MenuItem>
              </Select>
            </Stack>
          ) : null}

          {showFontFamilySelector && !isHidden("fontFamily", "fontFamily") ? (
            <>
              <Divider flexItem orientation="vertical" sx={{ mx: 0.75 }} />
              <Stack alignItems="center" direction="row" spacing={0.75}>
                <FontDownloadIcon fontSize="small" sx={{ color: "text.secondary" }} />
                <Select
                  disabled={isDisabled("fontFamily", "fontFamily")}
                  onChange={(event) => onFontFamilyChange?.(String(event.target.value))}
                  size="small"
                  sx={{ ...compactSelectSx, minWidth: 120 }}
                  value={fontFamilyValue}
                >
                  <MenuItem value="Arial">Arial</MenuItem>
                  <MenuItem value="Georgia">Georgia</MenuItem>
                  <MenuItem value="Times New Roman">Times New Roman</MenuItem>
                </Select>
              </Stack>
            </>
          ) : null}

          {showFontSizeControls && (!isHidden("fontSizeDecrease", "fontSize") || !isHidden("fontSizeIncrease", "fontSize")) ? (
            <>
              <Divider flexItem orientation="vertical" sx={{ mx: 0.75 }} />
              <Stack alignItems="center" direction="row" spacing={0.25}>
                {!isHidden("fontSizeDecrease", "fontSize") ? (
                  <IconButton disabled={isDisabled("fontSizeDecrease", "fontSize")} onClick={onFontSizeDecrease} size="small" sx={formatIconButtonSx}>
                    <Typography variant="body2">-</Typography>
                  </IconButton>
                ) : null}
                <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1, px: 1, py: 0.25 }}>
                  <Typography variant="body2">{fontSizeValue}</Typography>
                </Box>
                {!isHidden("fontSizeIncrease", "fontSize") ? (
                  <IconButton disabled={isDisabled("fontSizeIncrease", "fontSize")} onClick={onFontSizeIncrease} size="small" sx={formatIconButtonSx}>
                    <Typography variant="body2">+</Typography>
                  </IconButton>
                ) : null}
              </Stack>
            </>
          ) : null}
        </Box>

        <Box sx={{ alignItems: "center", display: "flex", flexShrink: 1, minWidth: 0 }}>
          {!isHidden("bold", "inlineFormats")
          || !isHidden("italic", "inlineFormats")
          || !isHidden("underline", "inlineFormats")
          || !isHidden("code", "inlineFormats")
          || !isHidden("link", "inlineFormats") ? (
            <Divider flexItem orientation="vertical" sx={{ mx: 0.75 }} />
          ) : null}

          <Stack alignItems="center" direction="row" spacing={0.25}>
            {!isHidden("bold", "inlineFormats") ? (
              <IconButton disabled={isDisabled("bold", "inlineFormats")} onClick={onBold} size="small" sx={formatButtonSx(boldActive)}>
                <FormatBoldIcon fontSize="small" />
              </IconButton>
            ) : null}
            {!isHidden("italic", "inlineFormats") ? (
              <IconButton disabled={isDisabled("italic", "inlineFormats")} onClick={onItalic} size="small" sx={formatButtonSx(italicActive)}>
                <FormatItalicIcon fontSize="small" />
              </IconButton>
            ) : null}
            {!isHidden("underline", "inlineFormats") ? (
              <IconButton disabled={isDisabled("underline", "inlineFormats")} onClick={onUnderline} size="small" sx={formatButtonSx(underlineActive)}>
                <FormatUnderlinedIcon fontSize="small" />
              </IconButton>
            ) : null}
            {!isHidden("code", "inlineFormats") ? (
              <IconButton disabled={isDisabled("code", "inlineFormats")} onClick={onCode} size="small" sx={formatButtonSx(codeActive)}>
                <CodeIcon fontSize="small" />
              </IconButton>
            ) : null}
            {!isHidden("link", "inlineFormats") ? (
              <IconButton
                disabled={isDisabled("link", "inlineFormats")}
                onClick={onLink}
                onMouseDown={(event) => {
                  event.preventDefault();
                  onLinkMouseDown?.();
                }}
                size="small"
                sx={formatIconButtonSx}
              >
                <LinkIcon fontSize="small" />
              </IconButton>
            ) : null}
          </Stack>

          {!isHidden("textColor", "colors") || !isHidden("backgroundColor", "colors") ? (
            <Divider flexItem orientation="vertical" sx={{ mx: 0.75 }} />
          ) : null}

          <Stack alignItems="center" direction="row" spacing={0.25}>
            {!isHidden("textColor", "colors") ? (
              <TextColorPickerControl
                disabled={isDisabled("textColor", "colors")}
                onChange={onTextColorChange}
                value={textColorValue}
              />
            ) : null}
            {!isHidden("backgroundColor", "colors") ? (
              <TextColorPickerControl
                disabled={isDisabled("backgroundColor", "colors")}
                onChange={onBackgroundColorChange}
                triggerIcon={<FormatColorFillIcon fontSize="small" />}
              value={backgroundColorValue}
              />
            ) : null}
          </Stack>

          {!isHidden("alignment", "alignment") ? <Divider flexItem orientation="vertical" sx={{ mx: 0.75 }} /> : null}

          {!isHidden("alignment", "alignment") ? (
            <TextAlignMenuControl
              disabled={isDisabled("alignment", "alignment")}
              onChange={onAlignmentChange}
              onIndent={onIndent}
              onOutdent={onOutdent}
              value={alignmentValue}
            />
          ) : null}
          {!isHidden("textStyle", "textStyle") ? <Divider flexItem orientation="vertical" sx={{ mx: 0.75 }} /> : null}
          {!isHidden("textStyle", "textStyle") ? (
            <TextStyleMenuControl
              disabled={isDisabled("textStyle", "textStyle")}
              onCapitalize={onTextStyleCapitalize}
              onClearFormatting={onTextStyleClearFormatting}
              onHighlight={onTextStyleHighlight}
              onLowercase={onTextStyleLowercase}
              onStrikethrough={onTextStyleStrikethrough}
              onSubscript={onTextStyleSubscript}
              onSuperscript={onTextStyleSuperscript}
              onUppercase={onTextStyleUppercase}
            />
          ) : null}

          {leftSlot ? <Box sx={{ ml: 1 }}>{leftSlot}</Box> : null}
          {!isHidden("insert", "insert") ? <Divider flexItem orientation="vertical" sx={{ mx: 0.75 }} /> : null}
          {!isHidden("insert", "insert") ? (
            <InsertContentMenuControl
              disabled={isDisabled("insert", "insert")}
              onInsertColumnsLayout={onInsertColumnsLayout}
              onInsertImage={onInsertImage}
              onInsertHorizontalRule={onInsertHorizontalRule}
            />
          ) : null}
          {rightSlot ? <Box sx={{ ml: 1 }}>{rightSlot}</Box> : null}
        </Box>
      </Box>
    </Box>
  );
}
