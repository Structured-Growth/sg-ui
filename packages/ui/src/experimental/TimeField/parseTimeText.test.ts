import {expect,it} from "vitest";
import {parseTimeText,formatTimeText} from "./parseTimeText";
it("normalizes shorthand, explicit periods, 24-hour values, noon, midnight and seconds",()=>{
 for(const [raw,value] of [["8a","08:00:00"],["8P","20:00:00"],["8:30 pm","20:30:00"],["12am","00:00:00"],["12pm","12:00:00"],["20:30","20:30:00"],["8","08:00:00"],["8:00:15 a.m.","08:00:15"]])expect(parseTimeText(raw)).toBe(value);
 expect(formatTimeText("08:00:00","en-US",12)).toBe("8:00 AM");
 expect(formatTimeText("20:30:15","en-US",24)).toBe("20:30:15");
});
it("accepts localized digits/day periods and rejects overflow or prose",()=>{
 expect(parseTimeText("٨:٣٠ م","ar-EG")).toBe("20:30:00");
 for(const raw of ["24:00","8:60","13pm","0am","8:30:60","tomorrow","8:3","-1","8amjunk"])expect(parseTimeText(raw)).toBeNull();
});

it("accepts compact military and suffixed times without rolling invalid values",()=>{
 for(const [raw,value] of [["1300","13:00:00"],["315p","15:15:00"],["0315 pm","15:15:00"],["315","03:15:00"],["0000","00:00:00"],["1200a","00:00:00"],["1200p","12:00:00"],["2359","23:59:00"],["١٣٠٠","13:00:00"]])expect(parseTimeText(raw,"ar-EG"),raw).toBe(value);
 for(const raw of ["2400","1260","1300p","000a","31500","315:30p"])expect(parseTimeText(raw),raw).toBeNull();
 expect(formatTimeText(parseTimeText("1300"),"en-US",24)).toBe("13:00");
 expect(formatTimeText(parseTimeText("315p"),"en-US",12)).toBe("3:15 PM");
});
