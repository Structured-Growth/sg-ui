import type { ComponentProps } from 'react';
import type { IconButton } from '../../../../packages/ui/src/experimental/IconButton/IconButton';
import type { TextField } from '../../../../packages/ui/src/experimental/TextField/TextField';
import type { TextArea } from '../../../../packages/ui/src/experimental/TextArea/TextArea';
import type { Select } from '../../../../packages/ui/src/experimental/Select/Select';
import type { Button } from '../../../../packages/ui/src/components/Button/Button';
import type { Dialog } from '../../../../packages/ui/src/experimental/Dialog/Dialog';
import type { Menu } from '../../../../packages/ui/src/experimental/Menu/Menu';
import type { Calendar } from '../../../../packages/ui/src/experimental/Calendar/Calendar';

type Props<T extends import('react').ElementType> = ComponentProps<T>;
declare const trigger: import('react').ReactElement<Props<typeof Button>>;
const icon: Props<typeof IconButton> = {label:'Close',children:null};
// @ts-expect-error IconButton requires a control name, independently of glyph content.
const unnamedIcon: Props<typeof IconButton> = {children:null};
const text: Props<typeof TextField> = {label:'Name'};
const hiddenText: Props<typeof TextField> = {'aria-label':'Search'};
// @ts-expect-error TextField requires visible or programmatic label.
const unnamedText: Props<typeof TextField> = {};
const area: Props<typeof TextArea> = {'aria-label':'Notes',rows:4};
// @ts-expect-error TextArea preserves the field naming union.
const unnamedArea: Props<typeof TextArea> = {};
// @ts-expect-error Select requires its visible label even with options.
const unnamedSelect: Props<typeof Select> = {options:[]};
// Generic Button intentionally permits native aria naming or host child content.
const genericButton: Props<typeof Button> = {};
const describedButton: Props<typeof Button> = {'aria-label':'Save','aria-describedby':'save-help',onPress:()=>{}};
// @ts-expect-error Owned activation is onPress, not a native onClick escape hatch.
const nativeClick: Props<typeof Button> = {onClick:()=>{}};
// @ts-expect-error Owned visual vocabulary excludes legacy contained.
const legacyVariant: Props<typeof Button> = {variant:'contained'};
// Dialog generic translated fallback is intentionally permitted by the public type.
const genericDialog: Props<typeof Dialog> = {open:false,onDismiss:()=>{},children:null};
// @ts-expect-error Dialog's reason vocabulary is owned.
const legacyDismiss: Props<typeof Dialog> = {open:false,onDismiss:(reason:'backdropClick')=>{},children:null};
// @ts-expect-error Menu requires an overlay name independent of its trigger.
const unnamedMenu: Props<typeof Menu> = {items:[],trigger};
// @ts-expect-error Calendar requires a name even without a selected value.
const unnamedCalendar: Props<typeof Calendar> = {};
// @ts-expect-error Calendar intentionally has no generic root style escape hatch.
const styledCalendar: Props<typeof Calendar> = {label:'Dates',style:{width:200}};
// @ts-expect-error Select intentionally exposes className, not generic style.
const styledSelect: Props<typeof Select> = {label:'Status',options:[],style:{width:200}};
void [icon,text,hiddenText,area,genericButton,describedButton,genericDialog];
