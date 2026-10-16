import {expect,it} from 'vitest';
import {parseDateText,formatDateText} from './parseDateText';
it('normalizes explicit civil formats, locale order, names and localized digits',()=>{
  for(const raw of ['2026-10-14','2026/10/14','20261014','10/14/2026','10.14.2026','October 14, 2026','14 Oct 2026']) expect(parseDateText(raw,'en-US'),raw).toBe('2026-10-14');
  expect(parseDateText('14/10/2026','en-GB')).toBe('2026-10-14');
  expect(parseDateText('03/04/2026','en-US')).toBe('2026-03-04');
  expect(parseDateText('03/04/2026','en-GB')).toBe('2026-04-03');
  expect(parseDateText('14 Oktober 2026','de-DE')).toBe('2026-10-14');
  expect(parseDateText('١٤/١٠/٢٠٢٦','ar-EG')).toBe('2026-10-14');
  expect(parseDateText(formatDateText('2026-10-14','ar-EG'),'ar-EG')).toBe('2026-10-14');
});
it('rejects rollover, ambiguous free prose and timestamps',()=>{
  for(const raw of ['2/29/2023','April 31, 2026','tomorrow','2026-10-14T00:00:00Z','13/10/2026','']) expect(parseDateText(raw,'en-US'),raw).toBeNull();
  expect(parseDateText('2/29/2024','en-US')).toBe('2024-02-29');
});

it('expands two-digit numeric and named-month years within a fixed 1950–2049 window',()=>{
 for(const [raw,expected] of [['1/1/26','2026-01-01'],['10/14/26','2026-10-14'],['1/1/00','2000-01-01'],['1/1/49','2049-01-01'],['1/1/50','1950-01-01'],['1/1/84','1984-01-01'],['1/1/99','1999-01-01'],['Jan 1, 26','2026-01-01'],['29 Feb 00','2000-02-29']]){
  expect(parseDateText(raw,'en-US'),raw).toBe(expected);
 }
 expect(parseDateText('03/04/26','en-US')).toBe('2026-03-04');
 expect(parseDateText('03/04/26','en-GB')).toBe('2026-04-03');
 expect(parseDateText('١٤/١٠/٢٦','ar-EG')).toBe('2026-10-14');
 expect(parseDateText('2/29/23','en-US')).toBeNull();
 expect(parseDateText('2/29/50','en-US')).toBeNull();
});
