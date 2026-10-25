"use client";
import {forwardRef, useId, useImperativeHandle, useRef, useState, type CSSProperties, type ForwardedRef, type ReactElement, type RefAttributes} from "react";
import {Slider as AriaSlider, SliderTrack, SliderThumb, SliderOutput} from "react-aria-components/Slider";
import {Label} from "react-aria-components/Label";
import type {Density} from "../../foundation/ThemeScope";
import {useTranslation} from "../../i18n";
import {FieldMessages, type FieldMessagePlacementProps} from "../TextField/FieldMessages";
import {useStandaloneFormReset} from "../TextField/useStandaloneFormReset";
import styles from "./Slider.module.css";
import {sliderTicks} from "./slider-ticks";
import {sliderFillInterval} from "./slider-fill";

export interface SliderMark { value: number; label?: string; }
export interface SliderProps<T extends number | number[] = number | number[]> extends FieldMessagePlacementProps {
  label: string;
  /** A number renders one thumb; an ordered array renders a range or multiple thumbs. */
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  /** Runs when a pointer or keyboard adjustment finishes, for host-owned expensive work. */
  onValueCommit?: (value: T) => void;
  min?: number;
  max?: number;
  step?: number;
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
  invalid?: boolean;
  description?: string;
  errorMessage?: string;
  /** Distinguish each thumb, e.g. ["Minimum price", "Maximum price"]. */
  thumbLabels?: readonly string[];
  /** Single values submit under name; multiple values use name[0], name[1], etc. */
  name?: string;
  /** Override individual native input names. */
  thumbNames?: readonly string[];
  showValue?: boolean;
  showBounds?: boolean;
  /** Display-only ticks; step controls snapping. Values outside the scale are omitted. */
  marks?: readonly SliderMark[];
  /** Generate evenly spaced ticks from min. At most 1001 ticks may be generated. */
  increment?: number;
  /** Show generated ticks; explicit marks are independent. Defaults to true. */
  showTicks?: boolean;
  tickAppearance?: "dot" | "line";
  /** Use increment for pointer and keyboard snapping instead of step. Requires increment. */
  snapToIncrements?: boolean;
  formatOptions?: Intl.NumberFormatOptions;
  /** Auto fills to a single value (or from fillOffset), or between outer handles. Before/after fill outside the selection. */
  fill?: "auto" | "before" | "after" | "between" | "none";
  /** Single-thumb auto-fill origin, e.g. 0 for a negative-to-positive scale. */
  fillOffset?: number;
  density?: Density;
  id?: string;
  className?: string;
  style?: CSSProperties;
  "aria-describedby"?: string;
}

function SliderImplementation<T extends number | number[]>({label, value, defaultValue, onValueChange, onValueCommit,
  min = 0, max = 100, step = 1, orientation = "horizontal", disabled, invalid, description, errorMessage,
  descriptionPlacement, errorPlacement, thumbLabels, name, thumbNames, showValue = true, showBounds = false,
  marks = [], increment, showTicks = true, tickAppearance = "dot", snapToIncrements = false, formatOptions, fill = "auto", fillOffset, density, id, className, style, "aria-describedby": describedBy}: SliderProps<T>, ref: ForwardedRef<HTMLDivElement>) {
  const root = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => root.current!, []);
  const {t, locale} = useTranslation();
  const messageId = useId();
  const [internal, setInternal] = useState<number | number[]>(defaultValue ?? min);
  const resetting = useStandaloneFormReset(root, () => {
    if (value === undefined) setInternal(defaultValue ?? min);
  });
  const blocked = () => disabled || resetting.current || !!root.current?.querySelector('input:disabled');
  const messages = {
    descriptionPlacement, errorPlacement,
    description: description && <span id={`${messageId}-description`} className={styles.description}>{description}</span>,
    error: invalid && errorMessage && <span id={`${messageId}-error`} className={styles.error}>{errorMessage}</span>,
  };
  const accessibleDescription = [describedBy, description && `${messageId}-description`, invalid && errorMessage && `${messageId}-error`].filter(Boolean).join(" ") || undefined;
  const formatter = new Intl.NumberFormat(locale, formatOptions);
  if (snapToIncrements && increment === undefined) throw new RangeError("Slider snapToIncrements requires increment.");
  if (increment !== undefined && (!Number.isFinite(increment) || increment <= 0)) throw new RangeError("Slider increment must be a finite positive number.");
  const ticks = !showTicks || increment === undefined ? [] : sliderTicks(min, max, increment);
  const effectiveStep = snapToIncrements ? increment! : step;
  return <AriaSlider<number | number[]> ref={root} id={id} value={value ?? internal} minValue={min} maxValue={max} step={effectiveStep}
    isDisabled={disabled} orientation={orientation} formatOptions={formatOptions}
    onChange={next => { if (blocked()) return; if (value === undefined) setInternal(next); onValueChange?.(next as T); }}
    onChangeEnd={next => { if (!blocked()) onValueCommit?.(next as T); }}
    className={[styles.root, className].filter(Boolean).join(" ")} style={style}
    data-sgui-part="slider" data-sgui-density={density} data-invalid={invalid || undefined}>
    {({state}) => {
      const interval = sliderFillInterval(state.values, min, max, fill, fillOffset);
      return <>
      <div className={styles.header}><Label className={styles.label}>{label}</Label>
        {showValue && <SliderOutput className={styles.output}>{state.values.map((_, index) => state.getThumbValueLabel(index)).join(" – ")}</SliderOutput>}
      </div>
      <FieldMessages position="above" {...messages}/>
      <div className={styles.scale}><div className={styles.body} data-marks={marks.some(mark => mark.label) || undefined}>
        <SliderTrack className={styles.track}>
          <div className={styles.rail} aria-hidden="true"/>
          {interval && <div className={styles.fill} data-sgui-part="slider-fill" aria-hidden="true"
            style={orientation === "horizontal" ? {insetInlineStart: `${interval.start * 100}%`, width: `${(interval.end - interval.start) * 100}%`}
              : {bottom: `${interval.start * 100}%`, height: `${(interval.end - interval.start) * 100}%`}}/>}
          {showTicks && ticks.map((tick,index)=><span key={index} className={styles.tick} data-sgui-part="slider-tick" data-appearance={tickAppearance} data-filled={interval && (tick-min)/(max-min)>=interval.start && (tick-min)/(max-min)<=interval.end || undefined} aria-hidden="true"
            style={orientation === "horizontal" ? {insetInlineStart: `${(tick-min)/(max-min)*100}%`} : {bottom: `${(tick-min)/(max-min)*100}%`}}/>)}
          {marks.filter(mark => Number.isFinite(mark.value) && mark.value >= min && mark.value <= max).map((mark,index) =>
            <span key={`${mark.value}-${index}`} className={styles.mark} aria-hidden="true" data-edge={mark.value === min ? "start" : mark.value === max ? "end" : undefined}
              style={orientation === "horizontal" ? {insetInlineStart: `${(mark.value - min)/(max - min)*100}%`} : {bottom: `${(mark.value - min)/(max - min)*100}%`}}>
              {mark.label && <span>{mark.label}</span>}
            </span>)}
          {state.values.map((_,index) => <SliderThumb key={index} index={index} className={styles.thumb}
            aria-label={thumbLabels?.[index] ?? (state.values.length === 1 ? undefined : state.values.length === 2
              ? index === 0 ? t("common.ui.slider.minimum", {defaultMessage:"Minimum"}) : t("common.ui.slider.maximum", {defaultMessage:"Maximum"})
              : t("common.ui.slider.value", {defaultMessage:"Value {index}", values:{index:index + 1}}))}
            aria-describedby={accessibleDescription} isInvalid={invalid}
            name={thumbNames?.[index] ?? (name ? state.values.length === 1 ? name : `${name}[${index}]` : undefined)}/>) }
        </SliderTrack>
      </div>
      {showBounds && <div className={styles.bounds} aria-hidden="true"><span>{formatter.format(min)}</span><span>{formatter.format(max)}</span></div>}</div>
      <FieldMessages position="below" {...messages}/>
    </>;}}
  </AriaSlider>;
}
/** Owned numeric field; React Aria remains an internal interaction detail. */
export const Slider = forwardRef(SliderImplementation) as <T extends number | number[]>(props: SliderProps<T> & RefAttributes<HTMLDivElement>) => ReactElement;
