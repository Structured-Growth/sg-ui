import {expect,it} from "vitest";
import {parseDateText} from "./parseDateText";
it("resolves bounded phrases from an explicit anchor without reading the clock",()=>{
 for(const [phrase,date] of [["today","2026-10-16"],["Tomorrow","2026-10-17"],["yesterday","2026-10-15"],["next Monday","2026-10-19"],["last Friday","2026-10-09"],["next Friday","2026-10-23"],["in 2 weeks","2026-10-30"],["3 days ago","2026-10-13"],["next month","2026-11-16"],["last year","2025-10-16"],["in 0 days","2026-10-16"]]){
  expect(parseDateText(phrase,"en-US","2026-10-16"),phrase).toBe(date);
 }
 expect(parseDateText("in ٢ days","ar-EG","2026-10-16")).toBe("2026-10-18");
 expect(parseDateText("next Montag","de-DE","2026-10-16")).toBe("2026-10-19");
 expect(parseDateText("1/1/26","en-US")).toBe("2026-01-01");
});
it("uses civil month-end/leap rules and rejects missing anchors, vague phrases and overflow",()=>{
 expect(parseDateText("next month","en-US","2024-01-31")).toBe("2024-02-29");
 expect(parseDateText("next year","en-US","2024-02-29")).toBe("2025-02-28");
 expect(parseDateText("tomorrow","en-US","2026-12-31")).toBe("2027-01-01");
 for(const anchor of [undefined,"bad","2026-02-30"])expect(parseDateText("today","en-US",anchor)).toBeNull();
 for(const phrase of ["soon","next business day","this Friday","in -1 days","in 1.5 weeks","today + 1","in 999999999999999999999 days"])expect(parseDateText(phrase,"en-US","2026-10-16")).toBeNull();
 expect(parseDateText("tomorrow","en-US","9999-12-31")).toBeNull();
 expect(parseDateText("yesterday","en-US","0001-01-01")).toBeNull();
 expect(parseDateText("next month","en-US","9999-12-01")).toBeNull();
});
