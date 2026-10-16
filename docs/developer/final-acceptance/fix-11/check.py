"""Bounded documentation/source consistency checks; no runtime execution."""
from pathlib import Path
import datetime, hashlib, json, re
root = Path(__file__).resolve().parents[4]
out = Path(__file__).resolve().parent
target = root / 'docs/developer/react-aria-calendar-contracts.md'
s = target.read_text()
checks = []
def check(name, condition):
    checks.append({'name': name, 'passed': bool(condition)})
def read(path):
    return (root / path).read_text()
check('No obsolete comparison/period deferral or pressed/visible-preset claim', all(x not in s for x in ['not a shipped contract', 'month/year-only selectors', 'Preset descriptions are visible paragraphs', 'aria-pressed', 'filled primary\nButton variant']))
check('Current feature scope and host engine limits', all(x in s for x in ['Gregorian week/month/quarter/year selectors', 'previous-year endpoint shifts with leap-day clamping', 'no recurrence/resource-scheduling or booking-persistence engine', 'Fiscal/business/holiday policies remain host-resolved']))
check('Preset options and hidden descriptions', all(x in s for x in ['keyboard-operable single-select options', 'associated option descriptions', 'visually hidden', 'Enter/Space']))
check('Day reverse creation distinct from completed edits, fixed length and periods', all(x in s for x in ['no fixed `rangeLength`', 'under every `rangeClickBehavior`', '`active-endpoint` edits', '`adjust-end` (default)', '`adjust-start` mirrors', '`adjust-boundaries`']))
check('Availability gaps/successors explicitly not accepted', all(x in s for x in ['BUG-0010', 'BUG-0011', 'does not mark either correction validated', 'K04-datepicker-entry-parity', 'K17-callback-reason-access']))
check('Grammar/reference anchor, DST and host boundaries retained', all(x in s for x in ['referenceDate', 'bounded English grammar', 'No browser/server clock', 'disambiguation', 'Business/fiscal/holiday rules remain explicit host policies']))
check('Native/clipboard/AT evidence limits remain explicit', all(x in s for x in ['trusted clipboard outcomes', 'spoken AT', 'listing the spec is not a new run', 'Node 26/jsdom defect probes', 'not establish current\nchanged-source browser results']))
check('Historical inbound scope fragment preserved', '<a id="initial-scope-and-accessibility-limits"></a>' in s)
links=[]
for label, url in re.findall(r'\[([^\]]+)\]\(([^)]+)\)', s):
    if '://' in url: continue
    path, _, fragment = url.partition('#')
    destination=(target.parent/path).resolve() if path else target
    exists=destination.exists()
    anchor=True
    if exists and fragment and destination.suffix=='.md':
        headings=re.findall(r'^#+\s+(.+)$',destination.read_text(),re.M)
        slugs=[re.sub(r'[^\w\- ]','',heading.lower()).replace(' ','-') for heading in headings]
        anchor=fragment in slugs
    links.append({'url':url,'exists':exists,'anchorExists':anchor})
check('All local guide paths and heading anchors resolve', all(x['exists'] and x['anchorExists'] for x in links))
selector=read('packages/ui/src/experimental/DateRangeSelector/DateRangeSelector.tsx')
check('Source preset rendering uses ListBox single selection and hidden descriptions', all(x in selector for x in ['<ListBox ', 'selectionMode="single"', '<ListBoxItem ', '<Text slot="description" className={styles.visuallyHidden}>']))
check('Source initial reverse completion and completed policies', all(x in selector for x in ['date<draft.start?{start:date,end:draft.start}', 'rangeClickBehavior === "adjust-start"', "rangeClickBehavior==='active-endpoint'", "if(selectionUnit!=='day')", "if(rangeLength?.mode==='fixed')"]))
exports=read('packages/ui/src/experimental/index.ts')
check('Period, comparison and datetime range public exports', all('export { '+name in exports for name in ['PeriodPicker','DateRangeComparisonPicker','DateTimeRangePicker']))
comparison=read('packages/ui/src/experimental/DateRangeComparisonPicker/DateRangeComparisonPicker.tsx')
check('Comparison modes use inclusive adjacent duration and year endpoint shifts', all(x in comparison for x in ["'none'|'previous-period'|'previous-year'|'custom'", "differenceInCivilDays(primary.start,primary.end)+1", "parseRelativeDateText('a year ago',primary.start", "parseRelativeDateText('a year ago',primary.end"]))
period=read('packages/ui/src/experimental/PeriodPicker/PeriodPicker.tsx')
check('Period units, explicit reference and Monday/Sunday start', all(x in period for x in ['unit:"week"|"month"|"quarter"|"year"', 'referenceDate?:string', "firstDayOfWeek='mon'", "firstDayOfWeek==='sun'?0:1"]))
calendar=read('packages/ui/src/experimental/Calendar/Calendar.tsx')
picker=read('packages/ui/src/experimental/DatePicker/DatePicker.tsx')
check('Pending source plumbing observed without claiming behavior validated', all(x in calendar for x in ['reasonForDate', 'function DescribedCalendarCell', 'function AvailabilityDisclosure', 'state.visibleRange']) and all(x in picker for x in ['DateFieldValidationContext.Provider', 'unavailableReasonFor(candidate)']))
receipt=json.loads((out/'input-receipt.json').read_text())
drift={p:{'inspected':sha,'now':hashlib.sha256((root/p).read_bytes()).hexdigest()} for p,sha in receipt['inputs'].items() if hashlib.sha256((root/p).read_bytes()).hexdigest()!=sha}
check('Target matches recorded post-edit SHA256',hashlib.sha256(target.read_bytes()).hexdigest()==receipt['targetAfterSha256'])
result={'checkedAtUTC':datetime.datetime.now(datetime.timezone.utc).isoformat(),'kind':'documentation/source inspection only','checks':checks,'localLinks':links,'inputDrift':drift,'targetSha256':hashlib.sha256(target.read_bytes()).hexdigest()}
(out/'checks.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({'passed':sum(x['passed'] for x in checks),'total':len(checks),'localLinks':len(links),'inputDrift':list(drift)},indent=2))
for c in checks:
    if not c['passed']: print('FAIL:', c['name'])
raise SystemExit(0 if all(x['passed'] for x in checks) else 1)
