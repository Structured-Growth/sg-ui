"""Bounded documentation/source checks; no browser or runtime conformance claim."""
from pathlib import Path
import json
import re

root = Path(__file__).resolve().parents[4]
doc = root / 'docs/developer/react-aria-adoption-checklist.md'
text = doc.read_text()
checks = []
def check(label, value):
    assert value, label
    checks.append({'check': label, 'result': 'pass'})
check('Overbroad read-only focus/copy statement removed', 'Read-only permits\n  focus/copy' not in text)
check('Review links to explicit focus/submission policy', '(#read-only-focus-and-form-values)' in text and '## Read-only focus and form values' in text)
check('Documents disabled trigger and submitted Select ID', 'The trigger is a native disabled button' in text and 'selected option ID' in text)
check('Documents text/button/segment differences', all(s in text for s in ['fieldMode="text"', 'fieldMode="button"', 'entryMode="text"', 'Segmented']))
check('Documents null, suffix and JSON form representations', all(s in text for s in ['name.start', 'name.end', 'empty strings for null', 'JSON for the committed primary/comparison/mode record']))
check('Keeps open-panel commit fix separate', 'Clear/commit transition fix separately' in text)
for component in ['Select', 'DatePicker', 'DateRangePicker', 'PeriodPicker', 'DateTimeRangePicker', 'DateRangeComparisonPicker']:
    source = (root / f'packages/ui/src/experimental/{component}/{component}.tsx').read_text()
    compact = re.sub(r'\s+', '', source)
    pattern = 'isDisabled={readOnly}' if component == 'Select' else ('disabled={props.disabled||props.readOnly}' if component in ['DatePicker', 'DateRangePicker'] else 'disabled={disabled||readOnly}')
    check(component + ' source has documented read-only trigger policy', pattern in compact)
for component in ['TextField', 'TextArea']:
    source = (root / f'packages/ui/src/experimental/{component}/{component}.tsx').read_text()
    check(component + ' forwards separate disabled/readOnly state', 'isReadOnly={readOnly}' in source and 'isDisabled={disabled}' in source)
for target in re.findall(r'\]\(([^)]+)\)', text):
    if target.startswith(('http:', 'https:', '#')): continue
    check('Local link exists: ' + target, (doc.parent / target.split('#')[0]).is_file())
print(json.dumps({'scope': 'Documentation/source consistency only; no runtime tests executed', 'checks': checks, 'passed': len(checks)}, indent=2))
