"use client";
import {Fragment, forwardRef, useContext, useEffect, useId, useImperativeHandle, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode} from "react";
import {RadioGroup as AriaRadioGroup, Radio, RadioGroupStateContext} from "react-aria-components/RadioGroup";
import {Label} from "react-aria-components/Label";
import {Text} from "react-aria-components/Text";
import {FieldError} from "react-aria-components/FieldError";
import {Button} from "../../components/Button/Button";
import type {Density} from "../../foundation/ThemeScope";
import {useTranslation} from "../../i18n";
import {FieldMessages, type FieldMessagePlacementProps} from "../TextField/FieldMessages";
import {useStandaloneFormReset} from "../TextField/useStandaloneFormReset";
import {StarIcon} from "../icons/StarIcon";
import styles from "./Rating.module.css";

export interface RatingOption {
  value: number;
  /** Accessible meaning of this answer; also displayed for labeled choices. */
  label: string;
  /** One icon or a non-interactive group of icons for this answer. */
  icon?: ReactNode;
  disabled?: boolean;
  /** Non-interactive content above the selectable answer. */
  annotation?: ReactNode;
}
export interface RatingProps extends FieldMessagePlacementProps {
  label: string;
  /** Independent, evenly distributed scale anchors; not tied to individual answers. */
  scaleLabels?: {start: string; middle?: string; end: string};
  choiceShape?: "rounded" | "circle";
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  /** Outlined answer frames by default; plain removes their surface and border. */
  appearance?: "outlined" | "plain";
  variant?: "stars" | "numbers" | "labels" | "icons";
  /** Generate whole-number choices from 1 through max when options is omitted. */
  max?: number;
  /** Ordered, unique numeric answers, including zero if needed. Labels belong to the host. */
  options?: readonly RatingOption[];
  /** Repeated custom symbol for icon mode. Per-option icons take precedence. */
  icon?: ReactNode;
  /** Optional alternate symbol for an unfilled custom-icon choice. */
  emptyIcon?: ReactNode;
  /** Highlight through the chosen position, or only the chosen answer. */
  highlightMode?: "cumulative" | "selected";
  /** Default: icon for stars/icons, background for numbers/labels. */
  highlightAppearance?: "icon" | "background" | "both";
  showOptionLabels?: boolean;
  showOptionValues?: boolean;
  /** Stack the value, symbol and optional label within each answer. */
  optionLayout?: "inline" | "stacked";
  clearable?: boolean;
  clearLabel?: string;
  orientation?: "horizontal" | "vertical";
  /** Alternate answers across two rows or columns, preserving answer order. */
  layout?: "inline" | "staggered";
  /** Equal widths by default; staggered layout always uses equal widths. */
  buttonWidth?: "equal" | "content";
  density?: Density;
  name?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  description?: string;
  errorMessage?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
  "aria-describedby"?: string;
}
const useChoiceLayoutEffect = typeof document === "undefined" ? useEffect : useLayoutEffect;

function RatingChoices({options, name, selected, variant, icon, emptyIcon, highlightMode, showOptionLabels, showOptionValues, optionLayout, orientation, layout, buttonWidth, preview, onPreview, blocked}: {
  options: readonly RatingOption[]; name: string; selected: number | null; variant: NonNullable<RatingProps["variant"]>;
  icon: ReactNode; emptyIcon: ReactNode; highlightMode: NonNullable<RatingProps["highlightMode"]>;
  buttonWidth: NonNullable<RatingProps["buttonWidth"]>; layout: NonNullable<RatingProps["layout"]>; showOptionValues: boolean; optionLayout: NonNullable<RatingProps["optionLayout"]>; showOptionLabels: boolean; orientation: NonNullable<RatingProps["orientation"]>; preview: number | null;
  onPreview: (value: number | null) => void; blocked: () => boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const state = useContext(RadioGroupStateContext);
  const {locale} = useTranslation();
  const formatter = new Intl.NumberFormat(locale);
  // Keep native grouping and Tab entry usable after collection/disabled changes,
  // including WebKit's checked-disabled-radio grouping behavior.
  useChoiceLayoutEffect(() => {
    const inputs = [...root.current?.querySelectorAll<HTMLInputElement>('input[type="radio"]') ?? []];
    for (const input of inputs) {
      if (input.disabled && input.checked) input.removeAttribute("name");
      else input.name = name;
    }
    const enabled = inputs.filter(input => !input.disabled);
    if (!enabled.some(input => input.checked)) {
      const entry = enabled.find(input => input.value === state?.lastFocusedValue) ?? enabled[0];
      enabled.forEach(input => { input.tabIndex = input === entry ? 0 : -1; });
    }
  });
  const annotated = options.some(option => option.annotation != null);
  const activeIndex = options.findIndex(option => option.value === (preview ?? selected));
  return <div ref={root} className={styles.choices} data-orientation={orientation} data-layout={layout} data-annotations={annotated || undefined} data-button-width={layout === "staggered" ? "equal" : buttonWidth} style={layout === "staggered" ? orientation === "horizontal" ? {gridTemplateColumns: `repeat(${Math.max(4, options.length * 3 + 1)}, 1fr)`} : {gridTemplateRows: `repeat(${Math.max(4, options.length * 3 + 1)}, 1fr)`} : undefined}>
    {options.map((option, index) => {
      const filled = activeIndex >= 0 && (highlightMode === "cumulative" ? index <= activeIndex : index === activeIndex);
      const symbol = variant === "stars" ? <StarIcon/> : !filled && emptyIcon !== undefined ? emptyIcon : option.icon !== undefined ? option.icon : icon ?? <StarIcon/>;
      const placement = layout === "staggered" ? orientation === "horizontal"
        ? {gridColumn: `${index * 3 + 1} / span 4`, gridRow: index % 2 + (annotated ? 2 : 1)}
        : {gridRow: `${index * 3 + 1} / span 4`, gridColumn: index % 2 + 1}
        : annotated ? orientation === "horizontal" ? {gridColumn: index + 1, gridRow: 2} : {gridRow: index + 1, gridColumn: 1} : undefined;
      const annotationPlacement = orientation === "horizontal" ? {...placement, gridRow: 1} : {...placement, gridColumn: layout === "staggered" ? 3 : 2};
      return <Fragment key={option.value}>
        {annotated && option.annotation != null && <span className={styles.annotation} style={annotationPlacement} data-sgui-part="rating-annotation" aria-hidden="true">{option.annotation}</span>}
        <div className={styles.option} data-sgui-part="rating-option"
        style={placement}>
        <Radio value={String(option.value)} isDisabled={option.disabled} className={styles.choice} aria-label={option.label} data-filled={filled || undefined} data-sgui-part="rating-choice"
        onHoverStart={() => { if (!blocked() && !option.disabled) onPreview(option.value); }} onHoverEnd={() => onPreview(null)}>
        <span className={styles.content} data-layout={optionLayout} aria-hidden="true">
          {showOptionValues && variant !== "numbers" && <span className={styles.number}>{formatter.format(option.value)}</span>}
          {variant === "numbers" ? <span className={styles.number}>{formatter.format(option.value)}</span>
            : variant !== "labels" && <span className={styles.symbol}>{symbol}</span>}
          {(variant === "labels" || showOptionLabels) && <span className={styles.optionLabel}>{option.label}</span>}
        </span>
      </Radio></div></Fragment>;
    })}
  </div>;
}

/** A single numeric survey answer, with an explicit unanswered state. */
export const Rating = forwardRef<HTMLDivElement, RatingProps>(function Rating({label, scaleLabels, choiceShape = "rounded", value, defaultValue, onValueChange,
  appearance = "outlined", variant = "stars", max = 5, options, icon, emptyIcon, highlightMode, highlightAppearance, showOptionLabels = false, showOptionValues = false, optionLayout = "inline",
  clearable = false, clearLabel, orientation = "horizontal", layout = "inline", buttonWidth = "equal", density, name, disabled, readOnly, required,
  invalid, description, descriptionPlacement, errorPlacement, errorMessage, id, className, style, "aria-describedby": describedBy}, ref) {
  const root = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => root.current!, []);
  const {t} = useTranslation();
  const generatedName = useId();
  const scaleDescriptionId = useId();
  const formName = name ?? generatedName;
  const [internal, setInternal] = useState<number | null>(defaultValue ?? null);
  const [preview, setPreview] = useState<number | null>(null);
  const [preservedError, setPreservedError] = useState<string | undefined>();
  const selected = value === undefined ? internal : value;
  if (!options && (!Number.isInteger(max) || max < 1)) throw new RangeError("Rating max must be a positive integer.");
  const choices = options ?? Array.from({length: max}, (_, index) => ({value: index + 1,
    label: t(variant === "stars" ? "common.ui.rating.stars" : "common.ui.rating.score", {
      defaultMessage: variant === "stars" ? "{value} of {max} stars" : "{value} of {max}", values: {value: index + 1, max},
    })}));
  const resetting = useStandaloneFormReset(root, () => {
    if (value === undefined) setInternal(defaultValue ?? null);
    setPreview(null); setPreservedError(undefined);
  }, () => {
    const input = root.current?.querySelector<HTMLInputElement>('input:not(:disabled)');
    const message = root.current?.querySelector('[role="radiogroup"][aria-invalid="true"]') ? input?.validationMessage : "";
    return message ? () => setPreservedError(message) : undefined;
  });
  const blocked = () => !!(disabled || readOnly || resetting.current || root.current?.querySelector('input:not([disabled])')?.matches(":disabled"));
  const change = (next: number | null) => {
    if (blocked()) return;
    setPreservedError(undefined); setPreview(null);
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };
  const messages = {descriptionPlacement, errorPlacement,
    description: description && <Text slot="description" className={styles.description}>{description}</Text>,
    error: <FieldError className={styles.error}>{errorMessage ?? preservedError}</FieldError>};
  return <div ref={root} id={id} className={[styles.root, className].filter(Boolean).join(" ")} style={style}
    data-sgui-part="rating" data-sgui-density={density} data-orientation={orientation} data-choice-shape={choiceShape} data-scale-labels={!!scaleLabels || undefined} data-variant={variant} data-appearance={appearance} data-highlight-appearance={highlightAppearance ?? (variant === "stars" || variant === "icons" ? "icon" : "background")}>
    <AriaRadioGroup value={selected === null ? null : String(selected)} onChange={next => change(Number(next))}
      name={formName} orientation={orientation} isDisabled={disabled} isReadOnly={readOnly} isRequired={required}
      isInvalid={preservedError ? true : invalid} aria-describedby={[describedBy, scaleLabels ? scaleDescriptionId : undefined].filter(Boolean).join(" ") || undefined} validationBehavior="native" className={styles.group}>
      <Label className={styles.label}>{label}</Label><FieldMessages position="above" {...messages}/>
      <div className={styles.scaleViewport}><div className={styles.scale} style={scaleLabels ? {"--rating-choice-count": choices.length} as CSSProperties : undefined}>
      {scaleLabels && <div id={scaleDescriptionId} className={styles.scaleLabels} data-sgui-part="rating-scale-labels"><span>{scaleLabels.start}</span><span>{scaleLabels.middle}</span><span>{scaleLabels.end}</span></div>}
      <RatingChoices options={choices} name={formName} selected={selected} variant={variant} icon={icon} emptyIcon={emptyIcon}
        highlightMode={highlightMode ?? (variant === "stars" || variant === "icons" ? "cumulative" : "selected")} showOptionLabels={showOptionLabels} showOptionValues={showOptionValues} optionLayout={optionLayout} orientation={orientation} layout={layout} buttonWidth={buttonWidth}
        preview={disabled || readOnly ? null : preview} onPreview={setPreview} blocked={blocked}/>
      </div></div>
      <FieldMessages position="below" {...messages}/>
    </AriaRadioGroup>
    {clearable && <Button className={styles.clear} variant="text" tone="neutral" disabled={disabled || readOnly || selected === null}
      onPress={() => { if (blocked()) return; change(null); root.current?.querySelector<HTMLInputElement>('input:not(:disabled)')?.focus(); }}>
      {clearLabel ?? t("common.ui.rating.clear", {defaultMessage: "Clear rating"})}
    </Button>}
  </div>;
});
