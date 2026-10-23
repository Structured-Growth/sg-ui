import {expect,it} from 'vitest';
import {getRelativeDateRange} from '../../utils/relative-dates';
it('resolves full month/year periods across leap years and year boundaries',()=>{
 expect(getRelativeDateRange('2024-02-29',{unit:'month'})).toEqual({start:'2024-02-01',end:'2024-02-29'});
 expect(getRelativeDateRange('2026-01-16',{unit:'month',offset:-1})).toEqual({start:'2025-12-01',end:'2025-12-31'});
 expect(getRelativeDateRange('2026-10-16',{unit:'year'})).toEqual({start:'2026-01-01',end:'2026-12-31'});
 expect(getRelativeDateRange('2026-10-16',{unit:'year',offset:-1})).toEqual({start:'2025-01-01',end:'2025-12-31'});
});
it('resolves explicit week starts and offsets without reading a clock or timezone',()=>{
 expect(getRelativeDateRange('2026-10-16',{unit:'week'})).toEqual({start:'2026-10-12',end:'2026-10-18'});
 expect(getRelativeDateRange('2026-10-16',{unit:'week',offset:-1,weekStartsOn:0})).toEqual({start:'2026-10-04',end:'2026-10-10'});
 expect(getRelativeDateRange('2026-01-01',{unit:'week',weekStartsOn:1})).toEqual({start:'2025-12-29',end:'2026-01-04'});
});
it('rejects invalid reference dates and non-integral options',()=>{
 expect(()=>getRelativeDateRange('2026-02-30',{unit:'month'})).toThrow(RangeError);
 expect(()=>getRelativeDateRange('2026-10-16',{unit:'year',offset:1.5})).toThrow(RangeError);
 expect(()=>getRelativeDateRange('2026-10-16',{unit:'year',offset:Infinity})).toThrow(RangeError);
 expect(()=>getRelativeDateRange('2026-10-16',{unit:'week',weekStartsOn:7 as 1})).toThrow(RangeError);
});
