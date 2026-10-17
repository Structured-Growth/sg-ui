"use client";
import {FieldMessages,type FieldMessagePlacementProps} from "../TextField/FieldMessages";
import { CalendarMonthTransition } from "../Calendar/CalendarMonthTransition";
import { CalendarNavigation } from "../Calendar/CalendarNavigation";
import { useLocale } from "react-aria-components/I18nProvider";
import { useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import { parseDate, toCalendarDate, toCalendar, GregorianCalendar } from "@internationalized/date";
import { RangeCalendar, CalendarHeading, CalendarGrid, CalendarGridHeader, CalendarHeaderCell,
  CalendarGridBody, CalendarCell, RangeCalendarStateContext } from "react-aria-components/RangeCalendar";
import { ListBox, ListBoxItem } from "react-aria-components/ListBox";
import { Text } from "react-aria-components/Text";
import { CheckIcon } from "../../icons/CheckIcon";
import { ButtonContext } from "react-aria-components/Button";
import { Button } from "../../components/Button/Button";
import {Select} from "../Select/Select";
import { DateField } from "../DateField/DateField";
import { useCalendarFormReset } from "./useCalendarFormReset";
import { useNarrowWeekdays } from "./useNarrowWeekdays";
import { useTranslation } from "../../i18n";
import { isDateOnly, isDateRangeAllowed, fixedRangeFromStart, type DateRangeLength, type DateAvailabilityRule, type DateOnly, type DateRange, type DateAvailability, type DateRangePreset, type DateRangePresetGroup } from "./date-contract";
import {getCivilPeriod,addCivilDays} from "../../utils/relative-dates";
import {RangeGestures,type RangeDragBehavior} from "./RangeGestures";
import type {ReactNode} from "react";
import styles from "./DateRangeSelector.module.css";

export interface DateRangeSelectorProps extends FieldMessagePlacementProps {
  label: string;
  /** Show a visible section title in addition to its accessible label. Defaults to false. */
  showTitle?: boolean;
  /** Optional direct month/year jumps; arrows remain available. */
  navigation?: "arrows" | "month-year";
  /** Number of localized years offered around focus, constrained by min/max. Defaults to 120. */
  visibleYears?: number;
  /** Endpoint entry defaults to flexible date-only text. Use segments explicitly for segmented input. */
  entryMode?: "segments" | "text";
  /** Shared host-supplied YYYY-MM-DD anchor for both relative text endpoints. */
  referenceDate?: DateOnly;
  /**
   * Calendar clicks after a complete draft. Defaults to "adjust-end".
   * With no complete range, the first click anchors a date and the second completes
   * the inclusive range in either direction (5th then 1st becomes 1st–5th).
   * Given 7th–16th:
   * - "restart": any click starts a new incomplete range.
   * - "adjust-end": 13th becomes 7th–13th; 20th becomes 7th–20th;
   *   5th restarts at 5th with an empty end. Clicking the start also restarts there.
   * - "adjust-start": 5th becomes 5th–16th; 13th becomes 13th–16th;
   *   20th restarts at 20th with an empty end. Clicking the end also restarts there.
   * - "adjust-boundaries": 5th becomes 5th–16th; 13th becomes 7th–13th;
   *   20th becomes 7th–20th. Clicking the start produces a one-day range;
   *   clicking the end leaves the range unchanged. Calendar clicks never clear it.
   * - "active-endpoint": edits activeEndpoint. Start intent with 5th becomes
   *   5th–16th; end intent with 13th becomes 7th–13th. Crossing the other
   *   boundary restarts at the clicked date with an empty end. Equality gives
   *   a one-day range. Initial two-click creation still works in either direction.
   * Applies to pointer and keyboard activation, not typed endpoints or presets.
   * Changes remain drafts until Apply unless commitBehavior="immediate";
   * validation, Cancel and Clear still apply.
   */
  rangeClickBehavior?: "restart" | "adjust-end" | "adjust-start" | "adjust-boundaries" | "active-endpoint";
  /** Used with rangeClickBehavior="active-endpoint". Start/End controls and field focus express which boundary calendar activations edit. Controlled when supplied. */
  activeEndpoint?: "start" | "end";
  defaultActiveEndpoint?: "start" | "end";
  onActiveEndpointChange?: (endpoint:"start"|"end") => void;
  /** Calendar activation can select a whole Gregorian week/month/quarter/year. Defaults to individual days. Length constraints still validate the complete period. */
  selectionUnit?: "day" | "week" | "month" | "quarter" | "year";
  /** Show editable endpoint fields. Defaults false; opt in to display flexible start/end textboxes. entryMode defaults to flexible text. */
  showFields?: boolean;
  /** Hide Clear/Cancel/Apply when the enclosing composition owns actions. Defaults true. */
  showActions?: boolean;
  /** Completed-range dragging. In move-and-resize (default), drag the first/last day to resize and an interior day to move. Shift+drag moves from any selected day. Fixed duration makes endpoint drags move the whole range; bounded length pushes the opposite boundary at min/max. A one-day range grows toward the dragged date. Move translates any selected day; resize enables endpoints only. Shift+Left/Right moves; Alt+Left/Right edits end; Alt+Shift edits start, with the same duration limits. Invalid drops roll back; Escape cancels. */
  rangeDragBehavior?: RangeDragBehavior;
  /** Fixed length completes on the first click and relocates on later clicks. Days are inclusive; nights are endpoint distance. Bounded length validates every input, preset and gesture. */
  rangeLength?: DateRangeLength;
  /** Host-owned recurring/selection-aware availability. Return a reason, or undefined when allowed. Checked throughout the interval, including text and presets. */
  getDateUnavailableReason?: DateAvailabilityRule;
  /** Decorative supplemental content inside a day cell. Its complete accessible date name remains intact; meaningful availability belongs in getDateUnavailableReason. */
  renderDayContent?: (date: DateOnly) => ReactNode;
  /** Linked months advance together; independent months have separate navigation and may be nonconsecutive. */
  calendarNavigation?: "linked" | "independent";
  /**
   * Assign endpoint intent by calendar index, e.g. ["start", "end"] for From/To.
   * Applies only to independent, paged calendars. Omitted/null entries retain
   * rangeClickBehavior; linked and scrolling calendars ignore this mapping.
   * An assigned calendar edits its endpoint and preserves the other endpoint.
   * Crossing the other endpoint clears that opposite endpoint; equality selects
   * one day. Either endpoint can be entered first. Incomplete drafts cannot Apply.
   * Assignment overrides rangeClickBehavior/activeEndpoint for those calendar
   * activations and availability checks, and reports onActiveEndpointChange.
   * Fixed length and whole-period selection retain precedence. Text, presets,
   * dragging, validation and Apply/Cancel retain their existing contracts.
   */
  calendarEndpoints?: readonly ("start" | "end" | null)[];
  /** Paged months or a vertical scrolling month browser. Scrolling uses scrollMonths consecutive months. */
  calendarLayout?: "paged" | "scroll";
  /** Number of months in the scrolling browser, 1–120. Default 12. */
  scrollMonths?: number;
  /** Apply keeps drafts local; immediate commits complete valid calendar/preset selections. Manual invalid edits never commit. */
  commitBehavior?: "apply" | "immediate";
  /** Reports local drafts for host integration; does not imply persistence. */
  onDraftChange?: (range: DateRange | null) => void;
  /** Committed range. Changes outside the control replace the current draft. */
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  onValueChange?: (value: DateRange | null) => void;
  onCancel?: () => void;
  min?: DateOnly;
  max?: DateOnly;
  unavailable?: readonly DateAvailability[];
  /** Grouped/nested host presets. Category selection displays its resolved choices; labels and relative policies remain host-owned. */
  presetGroups?: readonly DateRangePresetGroup[];
  presets?: readonly DateRangePreset[];
  /** Defaults to side (logical start); narrow hosts wrap it above. End follows the calendars. */
  presetPlacement?: "above" | "side" | "end";
  months?: 1 | 2 | 3;
  defaultFocusedDate?: DateOnly;
  firstDayOfWeek?: "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
}

export function DateRangeSelector({ label, showTitle = false, navigation = "arrows", visibleYears, entryMode = "text", referenceDate, rangeClickBehavior = "adjust-end", selectionUnit="day", showFields=false, showActions=true, descriptionPlacement="above", errorPlacement="below", activeEndpoint, defaultActiveEndpoint="end", onActiveEndpointChange, rangeDragBehavior = "move-and-resize", rangeLength, getDateUnavailableReason, renderDayContent, calendarNavigation = "linked", calendarEndpoints, calendarLayout = "paged", scrollMonths = 12, commitBehavior = "apply", onDraftChange, value, defaultValue = null, onValueChange, onCancel, min, max,
  unavailable = [], presets:basePresets = [], presetGroups = [], presetPlacement = "side", months = 2, defaultFocusedDate, firstDayOfWeek, disabled, readOnly, required, name }: DateRangeSelectorProps) {
  const { t } = useTranslation();
  const { locale, direction } = useLocale();
  const [presetGroup,setPresetGroup]=useState<string|null>(null);
  const flattenGroups=(groups:readonly DateRangePresetGroup[],prefix=''):DateRangePresetGroup[]=>groups.flatMap(group=>[{...group,label:prefix?`${prefix} / ${group.label}`:group.label},...flattenGroups(group.children??[],prefix?`${prefix} / ${group.label}`:group.label)]);
  const groups=flattenGroups(presetGroups);
  const selectedGroup=groups.find(group=>group.id===presetGroup)??groups[0];
  const presets=selectedGroup?selectedGroup.presets:basePresets;
  const hasPresets=groups.length>0||presets.length>0;
  const narrowWeekdays = useNarrowWeekdays(locale);
  const descriptionId = useId();
  const previewId = `${descriptionId}-preview`;
  const previewContextId = `${descriptionId}-preview-context`;
  const [scrollStart,setScrollStart]=useState<DateOnly|null>(null);
  const scrollOrigin=useRef<DateOnly|null>(defaultFocusedDate??null);
  const [focusedDate, setFocusedDate] = useState<DateOnly | undefined>(defaultFocusedDate);
  const focusedReason = unavailable.find(day => day.date === focusedDate)?.reason;
  const [internal, setInternal] = useState<DateRange | null>(defaultValue);
  const committed = value === undefined ? internal : value;
  const [previous, setPrevious] = useState(committed);
  const [draft, setDraft] = useState(committed);
  const [internalEndpoint,setInternalEndpoint]=useState(defaultActiveEndpoint);
  const endpoint=activeEndpoint??internalEndpoint;
  const setEndpoint=(next:"start"|"end")=>{if(next===endpoint)return;if(activeEndpoint===undefined)setInternalEndpoint(next);onActiveEndpointChange?.(next);};
  const [dragPreview,setDragPreview] = useState<DateRange|null>(null);
  const [interactionError,setInteractionError] = useState(false);
  const constraints = {min,max,unavailable,rangeLength,getDateUnavailableReason};
  const validRange = (range:DateRange|null) => isDateRangeAllowed(range,constraints);
  const commit = (range:DateRange|null) => {if(value===undefined)setInternal(range);onValueChange?.(range);};
  const edit = (range:DateRange|null) => {
    setDraft(range);setInteractionError(false);setStartValid(true);setEndValid(true);setResetRevision(revision=>revision+1);
    if(commitBehavior==='immediate'&&validRange(range)&&(!required||range!==null))commit(range);
  };
  useEffect(()=>{onDraftChange?.(draft);},[draft,onDraftChange]);
  // Compare serialized endpoints, so new parent objects with the same value do not erase edits.
  if (previous?.start !== committed?.start || previous?.end !== committed?.end) {
    setPrevious(committed); setDraft(committed);
  }
  const root = useRef<HTMLDivElement>(null);
  const [resetRevision, setResetRevision] = useState(0);
  const [selectionRevision, setSelectionRevision] = useState(0);
  const [pointerActive, setPointerActive] = useState(false);
  const pointerActiveRef = useRef(false);
  const pointerIdRef = useRef<number|null>(null);
  const programmaticAnchor=useRef<string|null>(null);
  const pointerDate = useRef<DateOnly | null>(null);
  const activationEndpoint = useRef<"start" | "end" | undefined>(undefined);
  const calendarEndpoint = (index: number) => calendarNavigation === "independent" && calendarLayout === "paged" ? calendarEndpoints?.[index] ?? undefined : undefined;
  const rememberCalendar = (target: EventTarget) => {
    const intent = (target as Element).closest("[data-calendar-endpoint]")?.getAttribute("data-calendar-endpoint");
    activationEndpoint.current = intent === "start" || intent === "end" ? intent : undefined;
  };
  useEffect(() => {
    const doc = root.current?.ownerDocument;
    const view = doc?.defaultView;
    let frame: number | undefined;
    let touchTimer: number | undefined;
    // Boundary presses temporarily anchor the opposite endpoint for dragging.
    // Mouseup/click must finish before interpreting that anchor as a new click.
    const release = () => {
      if (frame !== undefined) view?.cancelAnimationFrame(frame);
      frame = undefined;
      if (touchTimer !== undefined) view?.clearTimeout(touchTimer);
      touchTimer = undefined;
      pointerActiveRef.current = false;
      pointerIdRef.current = null;
      setPointerActive(false);
    };
    const releaseAfterGesture = (event: PointerEvent) => {
      if (!pointerActiveRef.current || event.pointerId !== pointerIdRef.current) return;
      // Touch may synthesize click after the next frame; keep its endpoint-drag
      // anchor private until click, with a fallback for scroll/drag gestures.
      if (event.pointerType === "touch") touchTimer = view?.setTimeout(release, 350);
      else frame = view?.requestAnimationFrame(release);
    };
    const cancelGesture = (event: Event) => {
      if (!pointerActiveRef.current) return;
      if (event.type === 'pointercancel' && (event as PointerEvent).pointerId !== pointerIdRef.current) return;
      setResetRevision(revision => revision + 1);
      frame = view?.requestAnimationFrame(release);
    };
    doc?.addEventListener("pointerup", releaseAfterGesture, true);
    doc?.addEventListener("click", release, true);
    doc?.addEventListener("pointercancel", cancelGesture, true);
    view?.addEventListener("blur", cancelGesture);
    return () => {
      if (frame !== undefined) view?.cancelAnimationFrame(frame);
      if (touchTimer !== undefined) view?.clearTimeout(touchTimer);
      doc?.removeEventListener("pointerup", releaseAfterGesture, true);
      doc?.removeEventListener("click", release, true);
      doc?.removeEventListener("pointercancel", cancelGesture, true);
      view?.removeEventListener("blur", cancelGesture);
    };
  }, []);
  const resetting = useCalendarFormReset(root, () => {
    setInteractionError(false);
    if (value === undefined) setInternal(defaultValue);
    setDraft(value === undefined ? defaultValue : value);
    setStartValid(true); setEndValid(true); setResetRevision(revision => revision + 1);
  });
  const [startValid, setStartValid] = useState(true);
  const [endValid, setEndValid] = useState(true);
  const draftPayloadValid = (!required || draft !== null) && validRange(draft);
  const allowed = startValid && endValid && draftPayloadValid;
  const selectionEndpoint=!draft?.start||rangeLength?.mode==='fixed'?'start':!draft.end?'end':rangeClickBehavior==='active-endpoint'?endpoint:rangeClickBehavior==='adjust-start'?'start':'end';
  const awaitingEnd = Boolean(draft && (isDateOnly(draft.start) && !draft.end || !draft.start && isDateOnly(draft.end)));
  const activateDate = useCallback((date: DateOnly, assignedEndpoint = activationEndpoint.current) => {
    setInteractionError(false);
    // Boundary drag setup may expose the opposite endpoint as the native anchor.
    // A completed-range click uses the date actually pressed, including touch.
    date = pointerDate.current ?? date;
    setStartValid(true); setEndValid(true);
    setSelectionRevision(revision => revision + 1);
    if(selectionUnit!=='day'){
      const period=getCivilPeriod(date,selectionUnit,(['sun','mon','tue','wed','thu','fri','sat'] as const).indexOf(firstDayOfWeek??'mon') as 0|1|2|3|4|5|6);
      if(period)edit(period);else setInteractionError(true);return true;
    }
    if(rangeLength?.mode==='fixed') {
      const next=fixedRangeFromStart(date,rangeLength);
      if(next)edit(next);else setInteractionError(true);
      return true;
    }
    if (assignedEndpoint) {
      setEndpoint(assignedEndpoint);
      const next = assignedEndpoint === "start"
        ? { start: date, end: draft?.end && date <= draft.end ? draft.end : "" }
        : { start: draft?.start && date >= draft.start ? draft.start : "", end: date };
      edit(next);
      setResetRevision(revision => revision + 1);
      return true;
    }
    const complete = draft && isDateOnly(draft.start) && isDateOnly(draft.end) && draft.start <= draft.end;
    if (complete && rangeClickBehavior !== "restart") {
      let next: DateRange | null = null;
      if (rangeClickBehavior === "adjust-boundaries") {
        next = date < draft.start ? { start: date, end: draft.end } : { start: draft.start, end: date };
      } else if(rangeClickBehavior==='active-endpoint'){
        if(endpoint==='start'&&date<=draft.end)next={start:date,end:draft.end};
        if(endpoint==='end'&&date>=draft.start)next={start:draft.start,end:date};
      } else if (rangeClickBehavior === "adjust-end" && date > draft.start) {
        next = { start: draft.start, end: date };
      } else if (rangeClickBehavior === "adjust-start" && date < draft.end) {
        next = { start: date, end: draft.end };
      }
      if (next) {
        edit(next);
        setResetRevision(revision => revision + 1);
        return true;
      }
    }
    if(!draft?.start||draft.end)setDraft({ start: date, end: "" });
    if(draft?.start&&!draft.end&&isDateOnly(draft.start)) {
      edit(date<draft.start?{start:date,end:draft.start}:{start:draft.start,end:date});return true;
    }
    return false;
  }, [draft, rangeClickBehavior, selectionUnit, firstDayOfWeek, endpoint, activeEndpoint, onActiveEndpointChange, rangeLength, commitBehavior, value, onValueChange, min, max, unavailable, getDateUnavailableReason]);
  const rangeError=<>
    {interactionError&&<p role="alert" className={styles.summary}>{t("common.ui.invalidRangeGesture",{defaultMessage:"That change is unavailable. The previous range was kept."})}</p>}
    {!allowed && !awaitingEnd && startValid && endValid && <p className={styles.summary}>{t("common.ui.invalidDateRange", { defaultMessage: "Choose an available date range." })}</p>}
</>;
    const displayRange=dragPreview??draft;
  const displayedRangeValid=dragPreview?validRange(dragPreview):draftPayloadValid;
  const pendingDate = displayRange && (displayRange.start && !displayRange.end ? displayRange.start : !displayRange.start && displayRange.end ? displayRange.end : null);
  const pendingDisplay=(calendarNavigation==='independent'||calendarLayout==='scroll')&&pendingDate&&isDateOnly(pendingDate)?{start:parseDate(pendingDate),end:parseDate(pendingDate)}:null;
  const calendarValue = displayRange && isDateOnly(displayRange.start) && isDateOnly(displayRange.end) && displayRange.start <= displayRange.end
    ? { start: parseDate(displayRange.start), end: parseDate(displayRange.end) } : pendingDisplay;
  return <div ref={root} onPointerDownCapture={event => {
      rememberCalendar(event.target);
      if (pointerActiveRef.current || event.button !== 0) return;
      pointerIdRef.current = event.pointerId;
      pointerDate.current = (event.target as Element).closest("[data-sgui-date]")?.getAttribute("data-sgui-date") ?? null;
      pointerActiveRef.current = true; setPointerActive(true);
    }} onKeyDownCapture={event => {
      rememberCalendar(event.target);
      pointerDate.current = null;
      if(calendarLayout!=='scroll'||event.altKey||event.shiftKey||event.ctrlKey||event.metaKey)return;
      const date=(event.target as Element).closest<HTMLElement>('[data-sgui-date]')?.dataset.sguiDate;
      const offsets:Record<string,number>={ArrowLeft:direction==='rtl'?1:-1,ArrowRight:direction==='rtl'?-1:1,ArrowUp:-7,ArrowDown:7};
      const delta=offsets[event.key];if(!date||!delta)return;
      const next=addCivilDays(date,delta);if(!next)return;
      const target=event.currentTarget.querySelector<HTMLElement>(`[data-calendar-layout="scroll"] [data-sgui-date="${next}"][role="button"]:not([data-outside-month]):not([data-disabled])`);
      if(target){event.preventDefault();event.stopPropagation();target.focus();}
    }}
    onClickCapture={event => { if (event.detail === 0) pointerDate.current = null; }} className={styles.root} data-show-fields={showFields || undefined} data-sgui-part="date-range-selector" data-months={calendarLayout==="scroll"?1:months} data-drag-behavior={rangeDragBehavior} data-invalid-preview={dragPreview&&!displayedRangeValid||undefined} data-fixed-length={rangeLength?.mode==="fixed"||(rangeLength?.mode==="bounded"&&rangeLength.min!==undefined&&rangeLength.min===rangeLength.max)||undefined} data-preset-placement={hasPresets ? presetPlacement : undefined}>
    <RangeCalendar aria-label={label} aria-describedby={rangeDragBehavior!=="none"?`${descriptionId}-gestures`:undefined} value={calendarValue} visibleDuration={{ months }} pageBehavior="single" selectionAlignment="start" commitBehavior="reset"
      defaultFocusedValue={defaultFocusedDate && isDateOnly(defaultFocusedDate) ? parseDate(defaultFocusedDate) : undefined} firstDayOfWeek={firstDayOfWeek}
      minValue={min && isDateOnly(min) ? parseDate(min) : undefined} maxValue={max && isDateOnly(max) ? parseDate(max) : undefined}
      onFocusChange={date => setFocusedDate(toCalendar(toCalendarDate(date), new GregorianCalendar()).toString())}
      isDisabled={disabled} isReadOnly={readOnly} isInvalid={!allowed && !awaitingEnd && startValid && endValid}
      isDateUnavailable={date => {const iso=toCalendar(toCalendarDate(date),new GregorianCalendar()).toString();return unavailable.some(day=>day.date===iso)||Boolean(getDateUnavailableReason?.(iso,{range:draft,endpoint:selectionEndpoint}));}}
      onChange={range => edit(range ? {start:toCalendar(toCalendarDate(range.start),new GregorianCalendar()).toString(),end:toCalendar(toCalendarDate(range.end),new GregorianCalendar()).toString()}:null)} className={styles.calendar}>
    {({ state }) => {
      const previewText = t("common.ui.dateRangePreview", { defaultMessage: "Range preview: {start} – {end}. Choose an end date to finish.", values: {
        start: toCalendar(state.highlightedRange?.start ?? state.anchorDate ?? state.focusedDate, new GregorianCalendar()).toString(),
        end: toCalendar(state.highlightedRange?.end ?? state.anchorDate ?? state.focusedDate, new GregorianCalendar()).toString(),
      } });
      const contextText = t("common.ui.dateRangePreviewContext", { defaultMessage: "Anchor: {anchor}. Focused endpoint: {endpoint}. Draft: {draft}. Apply commits the draft.", values: {
        anchor: toCalendar(state.anchorDate ?? state.focusedDate, new GregorianCalendar()).toString(),
        endpoint: toCalendar(state.focusedDate, new GregorianCalendar()).toString(),
        draft: draft ? `${draft.start} – ${draft.end}` : t("common.ui.noDates", { defaultMessage: "No dates selected" }),
      } });
      const presetPanel = <ButtonContext.Provider value={null}>
    {hasPresets && <div className={styles.presets} role="group" aria-label={t("common.ui.datePresets", { defaultMessage: "Date presets" })}>
      <h3 className={styles.heading}>{t("common.ui.datePresets", { defaultMessage: "Date presets" })}</h3>
      {groups.length>0&&<Select label={t("common.ui.presetCategory",{defaultMessage:"Preset category"})} value={selectedGroup?.id??null} options={groups.map(group=>({id:group.id,label:group.label}))} onValueChange={setPresetGroup}/>}
      <ListBox aria-label={t("common.ui.datePresets", {defaultMessage:"Date presets"})} selectionMode="single"
        selectedKeys={presets.filter(preset=>draft?.start===preset.value.start&&draft?.end===preset.value.end).slice(0,1).map(preset=>preset.id)}
        disabledKeys={presets.filter(preset=>disabled||readOnly||!validRange(preset.value)).map(preset=>preset.id)}
        onSelectionChange={keys=>{const key=keys==="all"?undefined:[...keys][0];const preset=presets.find(item=>item.id===key);if(!preset||disabled||readOnly||!validRange(preset.value))return;state.setAnchorDate(null);setStartValid(true);setEndValid(true);setResetRevision(revision=>revision+1);edit(preset.value);}}
        className={styles.presetList}>
        {presets.map(preset=><ListBoxItem key={preset.id} id={preset.id} textValue={preset.label} className={styles.presetOption}>
          {({isSelected})=><><Text slot="label">{preset.label}</Text><CheckIcon size={16} className={styles.presetCheck} aria-hidden="true" style={{visibility:isSelected?'visible':'hidden'}}/>{preset.description&&<Text slot="description" className={styles.visuallyHidden}>{preset.description}</Text>}</>}
        </ListBoxItem>)}
      </ListBox>
    </div>}
    </ButtonContext.Provider>;
      if(!scrollOrigin.current)scrollOrigin.current=toCalendar(state.focusedDate,new GregorianCalendar()).toString();
      const seed=calendarLayout==='scroll'?scrollStart??scrollOrigin.current:defaultFocusedDate;
      const baseMonth=toCalendar(seed&&isDateOnly(seed)?parseDate(seed):state.focusedDate,new GregorianCalendar());
      const remaining=(9999-baseMonth.year)*12+13-baseMonth.month;
      const count=Math.min(remaining,calendarLayout==='scroll'?Math.max(1,Math.min(120,Math.floor(scrollMonths)||12)):months);
      const monthView=(index:number,offset=index)=><div key={index} className={styles.month} data-calendar-endpoint={calendarEndpoint(index)}>
          <header className={styles.monthHeader}>
            {(index===months-1||calendarNavigation==='independent')&&calendarLayout!=='scroll'&&<Button className={styles.previous} slot="previous" variant="text" tone="neutral" aria-label={t("common.ui.previousMonth",{defaultMessage:"Previous month"})}>‹</Button>}
            {navigation==='month-year'&&(months===1||calendarNavigation==='independent')?<div className={styles.monthHeading}><CalendarNavigation visibleYears={visibleYears} disabled={disabled} readOnly={readOnly}/></div>:<CalendarHeading offset={{months:offset}} className={`${styles.heading} ${styles.monthHeading}`}/>}
            {(index===months-1||calendarNavigation==='independent')&&calendarLayout!=='scroll'&&<Button className={styles.next} slot="next" variant="text" tone="neutral" aria-label={t("common.ui.nextMonth",{defaultMessage:"Next month"})}>›</Button>}
          </header>
          <RangeMonthMotion enabled={calendarLayout==='paged'}><div className={styles.gridViewport}><CalendarGrid offset={{months:offset}} weekdayStyle="short" className={`${styles.grid} ${styles.rangeGrid}`}>
            <CalendarGridHeader>{day=><CalendarHeaderCell className={styles.weekday} data-narrow-label={narrowWeekdays.get(day)??day}><span className={styles.weekdayLabel}>{day}</span></CalendarHeaderCell>}</CalendarGridHeader>
            <CalendarGridBody>{date=>{const iso=toCalendar(date,new GregorianCalendar()).toString();const reason=unavailable.find(day=>day.date===iso)?.reason??getDateUnavailableReason?.(iso,{range:draft,endpoint:calendarEndpoint(index)??selectionEndpoint});return <DescribedCalendarCell date={date} reason={reason} reasonId={`${descriptionId}-date-${iso}-${index}`} previewIds={state.anchorDate&&state.isFocused&&state.focusedDate.compare(date)===0?[previewId,previewContextId]:[]} content={renderDayContent?.(iso)} rangeValid={displayedRangeValid} inRange={Boolean(displayRange?.start&&displayRange?.end&&iso>=displayRange.start&&iso<=displayRange.end)} start={displayRange?.start===iso} end={displayRange?.end===iso}/>;}}</CalendarGridBody>
          </CalendarGrid></div></RangeMonthMotion>
        </div>;
      return <RangeGestures resetKey={`${committed?.start}/${committed?.end}/${resetRevision}`} value={calendarValue&&draft?.end?{start:calendarValue.start.toString(),end:calendarValue.end.toString()}:null} behavior={rangeDragBehavior} length={rangeLength} disabled={disabled||readOnly} onActivate={activateDate} onEdit={edit} onPreview={setDragPreview} isAllowed={validRange} onInvalid={()=>setInteractionError(true)} onRestart={date=>{programmaticAnchor.current=date;}}>
    {rangeDragBehavior!=='none'&&<p id={`${descriptionId}-gestures`} className={styles.visuallyHidden}>{t("common.ui.rangeGestureHelp",{defaultMessage:"Shift and Left or Right moves the range when enabled. Alt and Left or Right resizes the end; add Shift to resize the start when enabled. Escape cancels dragging. Drag the first or last day to resize, or an interior day to move. Shift and drag moves from any selected day. At duration limits the opposite boundary follows; fixed duration moves the whole range."})}</p>}
    <ResetCalendarAnchor start={committed?.start} end={committed?.end} resetRevision={resetRevision} />
    <SelectionBehaviorBridge pointerActive={pointerActive} skipAnchor={programmaticAnchor} onActivate={activateDate} />
    <div className={styles.layout} data-preset-placement={hasPresets ? presetPlacement : undefined}>
    {presetPlacement !== "end" && presetPanel}
    <div className={styles.calendarBody}>
    <ButtonContext.Provider value={null}>
    {rangeClickBehavior==='active-endpoint'&&<div className={styles.actions} role="group" aria-label={t("common.ui.editRangeEndpoint",{defaultMessage:"Edit range endpoint"})}>
      <Button variant={endpoint==='start'?'filled':'outlined'} aria-pressed={endpoint==='start'} disabled={disabled||readOnly} onPress={()=>setEndpoint('start')}>{t("common.ui.startDate",{defaultMessage:"Start date"})}</Button>
      <Button variant={endpoint==='end'?'filled':'outlined'} aria-pressed={endpoint==='end'} disabled={disabled||readOnly} onPress={()=>setEndpoint('end')}>{t("common.ui.endDate",{defaultMessage:"End date"})}</Button>
    </div>}
    {showFields&&<div className={styles.fields} onFocusCapture={event=>{const target=event.target as HTMLElement;const controls=event.currentTarget.children;setEndpoint(controls[0]?.contains(target)?'start':'end');}}>
      <DateField descriptionPlacement={descriptionPlacement} errorPlacement={errorPlacement} key={`start-${resetRevision}-${selectionRevision}`} entryMode={entryMode} referenceDate={referenceDate} onValidityChange={setStartValid} label={t("common.ui.startDate", { defaultMessage: "Start date" })} value={draft?.start || null}
        onValueChange={start => { if (resetting.current) return; state.setAnchorDate(null); const next={start:start??"",end:draft?.end??""};setDraft(next);if(commitBehavior==='immediate'&&endValid&&validRange(next))commit(next); }} min={min} max={max} disabled={disabled} readOnly={readOnly} required={required} />
      <DateField descriptionPlacement={descriptionPlacement} errorPlacement={errorPlacement} key={`end-${resetRevision}-${selectionRevision}`} entryMode={entryMode} referenceDate={referenceDate} onValidityChange={setEndValid} label={t("common.ui.endDate", { defaultMessage: "End date" })} value={draft?.end || null}
        onValueChange={end => { if (resetting.current) return; state.setAnchorDate(null); const next={start:draft?.start??"",end:end??""};setDraft(next);if(commitBehavior==='immediate'&&startValid&&validRange(next))commit(next); }} min={min} max={max} disabled={disabled} readOnly={readOnly} required={required} />
    </div>}

    </ButtonContext.Provider>
      {showTitle && <h2 className={styles.heading}>{label}</h2>}
      <FieldMessages position="above" errorPlacement={errorPlacement} error={rangeError}/>
      {navigation === "month-year" && months > 1 && calendarNavigation==='linked' && <CalendarNavigation visibleYears={visibleYears} disabled={disabled} readOnly={readOnly}/>}
      {calendarLayout==='scroll'&&<ButtonContext.Provider value={null}><div className={styles.monthHeader}>
        <Button className={styles.previous} variant="text" tone="neutral" disabled={disabled||readOnly||!isDateOnly(baseMonth.subtract({months:count}).toString())||Boolean(min&&baseMonth.subtract({days:1}).toString()<min)} onPress={()=>setScrollStart(baseMonth.subtract({months:count}).toString())} aria-label={t("common.ui.previousMonths",{defaultMessage:"Previous months"})}>‹</Button>
        <h3 className={`${styles.heading} ${styles.monthHeading}`}>{t("common.ui.browseMonths",{defaultMessage:"Browse months"})}</h3>
        <Button className={styles.next} variant="text" tone="neutral" disabled={disabled||readOnly||!isDateOnly(baseMonth.add({months:count}).toString())||Boolean(max&&baseMonth.add({months:count}).toString()>max)} onPress={()=>setScrollStart(baseMonth.add({months:count}).toString())} aria-label={t("common.ui.nextMonths",{defaultMessage:"Next months"})}>›</Button>
      </div></ButtonContext.Provider>}
      <div data-calendar-layout={calendarLayout} className={calendarLayout==='scroll'?styles.scrollingMonths:styles.months}>
      {Array.from({length:count},(_,index)=>calendarNavigation==='independent'||calendarLayout==='scroll'?
        <RangeCalendar key={calendarLayout==='scroll'?`${baseMonth.toString()}-${index}`:index} aria-label={t("common.ui.rangeMonth",{defaultMessage:"{label}, calendar {number}",values:{label:calendarEndpoint(index)?`${label}, ${t(calendarEndpoint(index)==='start'?"common.ui.startDate":"common.ui.endDate",{defaultMessage:calendarEndpoint(index)==='start'?"Start date":"End date"})}`:label,number:index+1}})} value={calendarValue}
          defaultFocusedValue={baseMonth.add({months:index})} visibleDuration={{months:1}} minValue={min&&isDateOnly(min)?parseDate(min):undefined} maxValue={max&&isDateOnly(max)?parseDate(max):undefined}
          firstDayOfWeek={firstDayOfWeek} isDisabled={disabled} isReadOnly={readOnly} commitBehavior="reset"
          isDateUnavailable={date=>{const iso=toCalendar(date,new GregorianCalendar()).toString();return unavailable.some(day=>day.date===iso)||Boolean(getDateUnavailableReason?.(iso,{range:draft,endpoint:calendarEndpoint(index)??selectionEndpoint}));}}
          onChange={range=>edit(range?{start:range.start.toString(),end:range.end.toString()}:null)}>
          <ResetCalendarAnchor start={committed?.start} end={committed?.end} resetRevision={resetRevision}/><SelectionBehaviorBridge pointerActive={pointerActive} skipAnchor={programmaticAnchor} onActivate={date=>activateDate(date,calendarEndpoint(index))}/>{monthView(index,0)}
        </RangeCalendar>:monthView(index))}
      </div>
    {focusedReason && <p className={styles.summary} role="status" data-sgui-part="date-availability">{focusedDate}: {focusedReason}</p>}
    {unavailable.length > 0 && <details className={styles.availability}>
      <summary>{t("common.ui.unavailableDates", { defaultMessage: "Unavailable dates" })}</summary>
      <ul>{unavailable.map(day => <li key={day.date}>{day.date}: {day.reason}</li>)}</ul>
    </details>}
    <div className={styles.visuallyHidden}>
      {state.anchorDate && <div>
        <p id={previewId} className={styles.summary} data-sgui-part="date-range-preview">{previewText}</p>
        <p id={previewContextId} data-sgui-part="date-range-preview-context">{contextText}</p>
      </div>}
    </div>
    <p className={styles.visuallyHidden} role="status" data-sgui-part="date-range-draft">{draft ? `${draft.start} – ${draft.end}` : t("common.ui.noDates", { defaultMessage: "No dates selected" })}</p>
    <FieldMessages position="below" errorPlacement={errorPlacement} error={rangeError}/>
    <ButtonContext.Provider value={null}>
    {showActions&&<div className={styles.actions}>
      <Button variant="text" tone="neutral" disabled={disabled || readOnly || required} onPress={() => { state.setAnchorDate(null); setStartValid(true); setEndValid(true); setResetRevision(revision => revision + 1); edit(null); }}>{t("common.ui.clear", { defaultMessage: "Clear" })}</Button>
      <Button variant="outlined" tone="neutral" disabled={disabled} onPress={() => { state.setAnchorDate(null); setStartValid(true); setEndValid(true); setResetRevision(revision => revision + 1); setInteractionError(false);setDraft(committed); onCancel?.(); }}>{t("common.ui.cancel", { defaultMessage: "Cancel" })}</Button>
      {commitBehavior==='apply'&&<Button disabled={disabled || readOnly || !allowed || state.anchorDate !== null} onPress={() => {
        commit(draft);
      }}>{t("common.ui.apply", { defaultMessage: "Apply" })}</Button>}
    </div>}
    </ButtonContext.Provider>
    </div>{presetPlacement === "end" && presetPanel}</div>
    </RangeGestures>; }}
    </RangeCalendar>
    {name && <><input type="hidden" name={`${name}.start`} value={committed?.start ?? ""} disabled={disabled} />
      <input type="hidden" name={`${name}.end`} value={committed?.end ?? ""} disabled={disabled} /></>}
  </div>;
}

// CalendarCell filters labelable ARIA props. Keep its native interaction and full
// date label, and append only owned descriptions after its button has mounted.
// Preview descriptions follow the actual focused endpoint rather than every cell;
// no extra live region repeats each arrow alongside the engine announcements.
function DescribedCalendarCell({ date, reason, reasonId, previewIds, content, start, end, inRange, rangeValid }: { rangeValid:boolean; inRange?:boolean; content?:ReactNode;start?:boolean;end?:boolean; date: ReturnType<typeof parseDate>; reason?: string; reasonId: string; previewIds: string[] }) {
  const ref = useRef<HTMLTableCellElement>(null);
  useEffect(() => {
    const button = ref.current?.firstElementChild;
    // Click-role unavailability does not invalidate a range whose actual endpoints
    // and interior are allowed. Keep owned range validity authoritative.
    if(button&&inRange){
      for(const node of [ref.current,button]){
        if(!rangeValid)node?.setAttribute("aria-invalid","true");else node?.removeAttribute("aria-invalid");
      }
      if(!rangeValid)button.setAttribute("data-invalid","true");else button.removeAttribute("data-invalid");
    }
    const ownedIds = [...(reason ? [reasonId] : []), ...previewIds];
    if (!ownedIds.length || !button) return;
    const existing = button.getAttribute("aria-describedby")?.split(/\s+/).filter(Boolean) ?? [];
    button.setAttribute("aria-describedby", [...new Set([...existing, ...ownedIds])].join(" "));
    return () => {
      const remaining = button.getAttribute("aria-describedby")?.split(/\s+/).filter(id => id && !ownedIds.includes(id)) ?? [];
      if (remaining.length) button.setAttribute("aria-describedby", remaining.join(" "));
      else button.removeAttribute("aria-describedby");
    };
  });
  return <CalendarCell ref={ref} date={date} data-sgui-date={toCalendar(date, new GregorianCalendar()).toString()} className={styles.cell} data-range-selected={inRange||undefined} data-range-start={start||undefined} data-range-end={end||undefined}>
    {({ formattedDate }) => <><span>{formattedDate}</span>{content&&<span aria-hidden="true" className={styles.dayContent}>{content}</span>}
      {reason && <span id={reasonId} className={styles.visuallyHidden}>{reason}</span>}</>}
  </CalendarCell>;
}

// Host replacements and native resets invalidate an unfinished range without
// remounting the calendar or duplicating the interaction engine's selection state.
function ResetCalendarAnchor({ start, end, resetRevision }: { start?: DateOnly; end?: DateOnly; resetRevision: number }) {
  const state = useContext(RangeCalendarStateContext);
  const setAnchorDate = state?.setAnchorDate;
  useEffect(() => { setAnchorDate?.(null); }, [setAnchorDate, start, end, resetRevision]);
  return null;
}

// Observe only new native anchors. React Aria completes unfinished selections in
// either direction; the owned policy handles activation of a completed draft.
// Track the processed anchor so draft/prop rerenders cannot replay a click.
function SelectionBehaviorBridge({ pointerActive, skipAnchor, onActivate }: { skipAnchor:{current:string|null};pointerActive: boolean; onActivate: (date: DateOnly) => boolean }) {
  const state = useContext(RangeCalendarStateContext)!;
  const anchor = state.anchorDate ? toCalendar(state.anchorDate, new GregorianCalendar()).toString() : null;
  const processedAnchor = useRef<DateOnly | null>(null);
  useEffect(() => {
    if (!pointerActive && !state.isDragging && anchor !== processedAnchor.current) {
      processedAnchor.current = anchor;
      if(anchor&&skipAnchor.current===anchor){skipAnchor.current=null;return;}
      if (anchor && onActivate(anchor)) state.setFocusedDate(parseDate(anchor));
    }
  }, [anchor, pointerActive, state.isDragging, state.setFocusedDate, onActivate]);
  return null;
}

function RangeMonthMotion({children,enabled}: {children:ReactNode;enabled:boolean}) {
 const state=useContext(RangeCalendarStateContext)!;
 const {direction}=useLocale();
 return <CalendarMonthTransition month={state.visibleRange.start.toString()} direction={direction} enabled={enabled}>{children}</CalendarMonthTransition>;
}
