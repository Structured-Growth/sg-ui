import {createRef, type ComponentProps} from 'react';
import {TextField, Checkbox, Menu, Button, MonthPicker, YearPicker, FormFieldScope, type AppDataGridColumn} from '@structured-growth/sg-ui';
import {Dialog, TextArea, Calendar, DateRangeSelector, DateRangePicker, MonthPicker as ExperimentalMonthPicker, YearPicker as ExperimentalYearPicker} from '@structured-growth/sg-ui/experimental';
import {MonthPicker as CatalogMonthPicker} from '@structured-growth/sg-ui/components';
import {FormFieldScope as PrimitiveFieldScope} from '@structured-growth/sg-ui/primitives';

type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type Assert<T extends true>=T;
export type DismissPayload=Assert<Equal<Parameters<ComponentProps<typeof Dialog>['onDismiss']>[0],'escape'|'outside'|'close-button'|'dismiss'>>;
export type NumericMonth=Assert<Equal<Parameters<NonNullable<ComponentProps<typeof MonthPicker>['onValueChange']>>[0],number>>;
export type NumericYear=Assert<Equal<Parameters<NonNullable<ComponentProps<typeof YearPicker>['onValueChange']>>[0],number>>;
export const aliases:[typeof MonthPicker,typeof YearPicker,typeof MonthPicker]=[ExperimentalMonthPicker,ExperimentalYearPicker,CatalogMonthPicker];
export const fields=<FormFieldScope descriptionPlacement="above" errorPlacement="below">
  <PrimitiveFieldScope descriptionPlacement="below"><TextField aria-label="Course" ref={createRef<HTMLInputElement>()} inputClassName="course-input"/>
    <TextArea label="Summary" ref={createRef<HTMLTextAreaElement>()} rows={4}/>
    <Checkbox label="Published" ref={createRef<HTMLLabelElement>()}/></PrimitiveFieldScope>
</FormFieldScope>;
export const namedHeader=<Dialog open={false} aria-label="Edit course" header="Course settings" onDismiss={reason=>{const owned:'escape'|'outside'|'close-button'|'dismiss'=reason;void owned;}}>Host form</Dialog>;
export const calendarContracts=<><Calendar label="Date" navigation="period" calendarNavigation="independent" allowMonthSelection allowYearSelection periodPickerProps={{yearNavigation:'paged',yearsPerPage:16}}/>
  <DateRangeSelector label="Range" showFields navigation="arrows" calendarNavigation="linked" rangeClickBehavior="adjust-end"/>
  <DateRangePicker label="Range" rangeClickBehavior="adjust-nearest" nearestEndpointTieBreak="start" calendarEndpoints={['start','end']}/>
  <MonthPicker year={2026} onValueChange={month=>{const numeric:number=month;void numeric;}}/>
  <YearPicker referenceYear={2026} yearNavigation="scroll" descriptionPlacement="above"/></>;
export const genericColumn:AppDataGridColumn<{id:string;title:string}>={field:'title',headerName:'Title',cellType:'text'};
// @ts-expect-error Field scopes create no native form or arbitrary DOM attributes.
export const scopeForm=<FormFieldScope action="/save"/>;
// @ts-expect-error Month is numeric; date-only strings are not month-selection values.
export const stringMonth=<MonthPicker year={2026} value="2026-10-01"/>;
// @ts-expect-error Month callback receives a number, not a civil range record.
export const rangeMonth=<MonthPicker year={2026} onValueChange={(range:{start:string;end:string})=>void range}/>;
// @ts-expect-error Year pagination accepts the owned page-size domain.
export const yearPage=<YearPicker yearsPerPage={20}/>;
// @ts-expect-error Dialog dismissal has one owned reason argument, no event/reason pair.
export const upstreamDismiss=<Dialog open={false} title="Course" onDismiss={(_event:Event,_reason:string)=>{}}/>;
// @ts-expect-error Checkbox ref targets its label rather than the native input.
export const inputCheckbox=<Checkbox label="Published" ref={createRef<HTMLInputElement>()}/>;
// @ts-expect-error Calendar has no generic native style escape hatch.
export const calendarStyle=<Calendar label="Date" style={{width:300}}/>;
// @ts-expect-error TextField exposes classes and owned slots rather than root native style.
export const fieldStyle=<TextField label="Course" style={{width:300}}/>;
// @ts-expect-error Menu does not expose a generic root native ref.
export const menuRef=<Menu label="Actions" items={[]} trigger={<Button>Actions</Button>} ref={createRef<HTMLDivElement>()}/>;
// @ts-expect-error Primitive field alias retains its naming requirement.
export const unnamedField=<TextField/>;
// @ts-expect-error Endpoint tie-break is its own domain, not a range click policy.
export const wrongTie=<DateRangeSelector label="Range" nearestEndpointTieBreak="adjust-end"/>;
