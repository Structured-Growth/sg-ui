"""Bounded documentation/source checks; writes only fix-02/validation.json."""
from pathlib import Path
import hashlib
import json

ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent

def read(path):
    return (ROOT / path).read_text()

def digest(path):
    return hashlib.sha256((ROOT / path).read_bytes()).hexdigest()

button_doc = read('docs/developer/react-aria-button.md')
toggle_doc = read('docs/developer/react-aria-remaining-controls.md')
chrome = read('packages/ui/src/components/ContentEditorChrome/ContentEditorChrome.tsx')
button = read('packages/ui/src/components/Button/Button.tsx')
toggle = read('packages/ui/src/experimental/ToggleButton/ToggleButton.tsx')
checks = {
    'stale_chrome_paragraph_removed': 'ContentEditorChrome continues to use its legacy button' not in button_doc and 'That composition remains unmigrated' not in button_doc,
    'chrome_owned_button_and_native_anchor': all(s in chrome for s in ['onPress?: (anchor: HTMLButtonElement) => void;', 'const anchor = useRef<HTMLButtonElement>(null);', '<Button ref={anchor}', 'item.onPress?.(anchor.current)', 'forwardRef<HTMLDivElement, ContentEditorChromeProps>']),
    'button_no_argument_press_and_native_ref': 'onPress?: () => void;' in button and 'forwardRef<HTMLButtonElement, ButtonProps>' in button,
    'toggle_distinct_callbacks_and_native_ref': all(s in toggle for s in ['onSelectedChange?: (selected: boolean) => void;', 'onPress?: () => void;', 'onChange={onSelectedChange} onPress={onPress}', 'forwardRef<HTMLButtonElement, ToggleButtonProps>']),
    'documentation_maps_both_contracts': all(s in button_doc for s in ['ContentEditorChromeMenuItem.onPress(anchor: HTMLButtonElement)', 'event.currentTarget', 'HTMLDivElement']) and all(s in toggle_doc for s in ['one selection request and one action', 'Disabled activation invokes neither callback', 'Callback ordering is not a public']),
    'relative_document_link_resolves': (ROOT / 'docs/developer/react-aria-remaining-controls.md').is_file() and '## Toggle actions and tooltip descriptions' in toggle_doc,
}
prior = json.loads(read('docs/developer/final-acceptance/parallel-04/input-reconciliation.json'))
# Locate the original recorded input hash map without depending on its wrapper name.
def find_hash(value, path):
    if isinstance(value, dict):
        if path in value and isinstance(value[path], str):
            return value[path]
        for child in value.values():
            found = find_hash(child, path)
            if found:
                return found
    return None
paths = [
    'packages/ui/src/components/Button/Button.tsx',
    'packages/ui/src/components/Button/Button.test.tsx',
    'packages/ui/src/components/ContentEditorChrome/ContentEditorChrome.tsx',
    'packages/ui/src/components/ContentEditorChrome/ContentEditorChrome.test.tsx',
    'packages/ui/src/experimental/ToggleButton/ToggleButton.tsx',
    'packages/ui/src/experimental/ToggleButton/ToggleButton.test.tsx',
]
retained = {p: {'sha256': digest(p), 'parallel04Sha256': find_hash(prior, p)} for p in paths}
for p, entry in retained.items():
    entry['unchanged'] = entry['sha256'] == entry['parallel04Sha256']
checks['retained_relevant_library_inputs_unchanged'] = all(e['unchanged'] for e in retained.values())
result = {'checks': checks, 'retainedLibraryInputs': retained, 'passed': all(checks.values()), 'scope': 'Documentation assertions and source/hash reconciliation only; no test/browser/build execution.'}
(OUT / 'validation.json').write_text(json.dumps(result, indent=2) + '\n')
assert result['passed'], result
print(f'{len(checks)} documentation/source checks passed; {len(retained)} relevant library inputs unchanged from parallel-04.')
