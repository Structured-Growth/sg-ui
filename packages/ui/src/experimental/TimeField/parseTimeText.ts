/** Local clock only. Bare hours use 24-hour meaning; a/p suffix removes ambiguity. */
export function parseTimeText(text: string, locale = "en-US"): string | null {
  // Normalize localized decimal digits and the locale's day periods.
  const digits = new Intl.NumberFormat(locale, {useGrouping:false});
  let input = text.trim().toLocaleLowerCase(locale);
  for (let digit=0;digit<10;digit++) input = input.split(digits.format(digit)).join(String(digit));
  for (const [hour, replacement] of [[1,"am"],[13,"pm"]] as const) {
    const period = new Intl.DateTimeFormat(locale,{hour:"numeric",hour12:true,timeZone:"UTC"})
      .formatToParts(new Date(Date.UTC(2026,0,1,hour))).find(part=>part.type==="dayPeriod")?.value.toLocaleLowerCase(locale);
    if (period) input = input.split(period).join(replacement);
  }
  input = input.replace(/[\s.\u200e\u200f\u061c]/g,"");
  // Compact HMM/HHMM keeps the final two digits as minutes; validate normally below.
  input = input.replace(/^(\d{1,2})(\d{2})(am?|pm?)?$/, "$1:$2$3");
  const match = /^(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?(am?|pm?)?$/.exec(input);
  if (!match) return null;
  let hour=Number(match[1]); const minute=Number(match[2]??0),second=Number(match[3]??0),period=match[4];
  if (minute>59 || second>59 || (period ? hour<1 || hour>12 : hour>23)) return null;
  if (period) hour=hour%12+(period.startsWith("p")?12:0);
  return [hour,minute,second].map(value=>String(value).padStart(2,"0")).join(":");
}
export function isClockTime(value: string | null | undefined): value is string {
  if (!value || !/^\d{2}:\d{2}:\d{2}$/.test(value)) return false;
  const [hour,minute,second]=value.split(":").map(Number);
  return hour<24 && minute<60 && second<60;
}
export function formatTimeText(value: string | null | undefined, locale: string, hourCycle?: 12 | 24): string {
  if (!value) return "";
  if (!isClockTime(value)) return value;
  const [hour,minute,second]=value.split(":").map(Number);
  return new Intl.DateTimeFormat(locale,{hour:"numeric",minute:"2-digit",...(second?{second:"2-digit" as const}:{}),
    ...(hourCycle?{hourCycle:hourCycle===12?"h12" as const:"h23" as const}:{}),timeZone:"UTC"})
    .format(new Date(Date.UTC(2026,0,1,hour,minute,second)));
}
