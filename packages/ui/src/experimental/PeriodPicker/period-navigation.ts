import {addCivilDays} from '../../utils/relative-dates';
import {isDateOnly,type DateRange,type DateRangeConstraints} from '../DateRangeSelector/date-contract';

/** Navigation needs one selectable day, rather than permission for a whole period. */
export function firstPeriodNavigationDate(period:DateRange,constraints:DateRangeConstraints):string|null {
 const {min,max,unavailable=[],getDateUnavailableReason}=constraints;
 if(!isDateOnly(period.start)||!isDateOnly(period.end)||(min&&!isDateOnly(min))||(max&&!isDateOnly(max)))return null;
 const start=min&&min>period.start?min:period.start,end=max&&max<period.end?max:period.end;
 const blocked=new Set(unavailable.map(item=>item.date));
 for(let date:string|null=start;date&&date<=end;date=addCivilDays(date,1)){
  if(!blocked.has(date)&&!getDateUnavailableReason?.(date,{range:null,endpoint:null}))return date;
 }
 return null;
}
