import assert from 'node:assert/strict';
import {addCivilDays} from '../../../../packages/ui/dist/utils/relative-dates.js';
import {dateTimeToInstant,getDateRangeLength,isDateRangeAllowed} from '../../../../packages/ui/dist/experimental/DateRangeSelector/date-contract.js';
// Evidence-local host adapter. addCivilDays is internal, not a new public SGUI API.
const exclusive = end => {const next=addCivilDays(end,1); if(!next) throw new RangeError('Exclusive end exceeds civil domain'); return next;};
for(const [end,next] of [['2024-02-28','2024-02-29'],['2024-02-29','2024-03-01'],['2023-02-28','2023-03-01'],['2026-04-30','2026-05-01'],['2026-12-31','2027-01-01']]) assert.equal(exclusive(end),next);
assert.throws(()=>exclusive('9999-12-31'),RangeError);
for(const [day,hours,startInstant,endInstant] of [
 ['2024-03-10',23,'2024-03-10T06:00:00.000Z','2024-03-11T05:00:00.000Z'],
 ['2024-11-03',25,'2024-11-03T05:00:00.000Z','2024-11-04T06:00:00.000Z'],
]) {
 const range={start:day,end:day}; const frozen=JSON.stringify(range);
 assert.equal(getDateRangeLength(range),1);assert.equal(getDateRangeLength(range,'nights'),0);
 assert.equal(isDateRangeAllowed(range,{min:day,max:day}),true);
 assert.equal(isDateRangeAllowed(range,{unavailable:[{date:day,reason:'Closed'}]}),false);
 const start=dateTimeToInstant(day+'T00:00:00','America/Chicago','reject');
 const end=dateTimeToInstant(exclusive(day)+'T00:00:00','America/Chicago','reject');
 assert.equal(start,startInstant);assert.equal(end,endInstant);
 // Millisecond subtraction measures elapsed instants only, never advances the civil end.
 assert.equal((Date.parse(end)-Date.parse(start))/3600000,hours);
 assert.equal(dateTimeToInstant(exclusive(day)+'T00:00:00','Asia/Tokyo','reject').endsWith('15:00:00.000Z'),true);
 assert.equal(JSON.stringify(range),frozen);
}
console.log(JSON.stringify({result:'pass',runtime:process.version,hostTZ:process.env.TZ??'unset',civilTransitions:5,overflowRejected:true,chicagoLocalDays:[23,25],explicitDisambiguation:'reject',scope:'Built pure utilities and evidence-local host adapter only; no UI/native/AT claim'}));
