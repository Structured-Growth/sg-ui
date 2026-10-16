"""Prepare metadata/docs only; never write proposed targets into the checkout."""
import difflib, hashlib, json
from pathlib import Path

OUT = Path(__file__).resolve().parent
ROOT = OUT.parents[3]
evidence = json.loads((OUT / 'evidence.json').read_text())
def sha(b): return hashlib.sha256(b).hexdigest()
changes = []
patches = []
def propose(name, text):
    source = ROOT / name
    old = source.read_text() if source.exists() else ''
    target = OUT / 'proposed-files' / name
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(text)
    changes.append({'path': name, 'baseSha256': sha(old.encode()) if source.exists() else None, 'proposedSha256': sha(text.encode())})
    patches.append(''.join(difflib.unified_diff(old.splitlines(True), text.splitlines(True), fromfile='a/'+name if source.exists() else '/dev/null', tofile='b/'+name)))

fixture = 'apps/docs/native-fixtures/scenarios/experimental/Button/Button.fixture.tsx'
public = 'apps/docs/examples/ButtonDocumentation.tsx'
test = 'src/components/Button/Button.public-contract.test.tsx'
mapping = [
    {'originalExport': 'Default', 'replacement': public, 'replacementSymbol': 'ButtonOverview', 'disposition': 'Continue label retained; contained/color becomes filled/tone in owned migration.'},
    {'originalExport': 'Variants', 'replacement': public, 'replacementSymbol': 'ButtonReference', 'disposition': 'Filled primary, outlined secondary and text action replace contained/outlined/text. Labels differ; legacy color is not restored.'},
    {'originalExport': 'PendingAndDisabled', 'replacement': fixture, 'replacementSymbol': 'ThemesAndDensity', 'disposition': 'Added in local owned migration; retains dark pending, disabled and compact outlined combinations, with additional light/comfortable combinations.'},
    {'originalExport': 'NativeForm', 'replacement': public, 'replacementSymbol': 'ButtonForm', 'additionalReplacement': fixture+'#NativeFormTransitions', 'disposition': 'Added in local owned migration; explicit submit and ordinary button behavior retained in public-contract tests; public form adds native reset. Saved-count diagnostic deliberately replaced by submitted label; callback/event probes remain private.'}
]
manifest = json.loads((ROOT / 'docs/extraction-manifest.json').read_text())
row = next(r for r in manifest['files'] if r['source'] == 'components/AppButton/AppButton.stories.tsx')
row['migration']['replacements'] = [fixture, public]
row['migration']['evidenceLimit'] = 'Deliberate local-history replacement, not an exact docs-native module transfer. See docs/developer/extraction-lineage.md. All inspected local AppButton stories have no play/expect/assert execution; original learner-platform commit contents and behavior remain unverified.'
row['migration']['localReconciliation'] = {
    'initialExtractionCommit': '21adebd61bedfc6a1ed395fe664ff4be83896821',
    'initialStoryBlob': evidence['history'][0]['blob'].strip(),
    'ownedMigrationCommit': '8f41479c6f2ea5822ff0c149e359e2c6e0893f13',
    'ownedStoryBlob': evidence['history'][1]['blob'].strip(),
    'preDocsMigrationCommit': evidence['history'][2]['revision'].strip(),
    'storyAssertionDisposition': 'No executable assertions in inspected local versions; retain example rendering contracts through explicit export dispositions.',
    'exports': mapping,
    'unitAssertionReplacement': test,
    'unitContinuity': 'Pre-docs AppButton.test.tsx equals Button.public-contract.test.tsx after AppButton-to-Button substitution; source comparison only, not a new test execution.'
}
propose('docs/extraction-manifest.json', json.dumps(manifest, indent=2)+'\n')

doc = '''# Extraction and example lineage

This reconciliation distinguishes the recorded upstream source, local extracted
files, later owned contracts and the docs-native replacement host. The upstream
identity remains `Structured-Growth/learning-platform`, commit
`8e63f1e16fc3d43d851908b312603a1099ca13d9`, root `apps/web/src/ui`.
That commit object is unavailable in this SGUI repository. No learner-platform
checkout or remote was accessed. Local extraction history is evidence of local
contents; it does not independently authenticate upstream bytes or behavior.

The [extraction manifest](../extraction-manifest.json) retains all 201 source and
destination pairs in original order. Historical `src/` destinations resolve under
`packages/ui`. The 2026-10-16 audit finds 159 present and 42 absent destinations,
zero presence mismatches and no missing replacement paths. These are a dated
working-tree inventory, not permanent thresholds or runtime acceptance.

## AppButton replacement

Initial local extraction `21adebd61bedfc6a1ed395fe664ff4be83896821` stores
`src/components/AppButton/AppButton.stories.tsx` as blob
`55e160e15e974ffa4e9814724aa1223b84aed6d8`. It exports Default and Variants.
Owned migration `8f41479c6f2ea5822ff0c149e359e2c6e0893f13` stores blob
`81d785a261d4b1a61b17939a682ce9a23e783039`, adding PendingAndDisabled and
NativeForm. That exact story blob remains at the parent of docs-workspace
migration `530bbc00465d9dbf1e9948f8a2c01b2e51b1a479`.

| Local story export | Deliberate successor | Disposition |
| --- | --- | --- |
| Default | [ButtonOverview](../../apps/docs/examples/ButtonDocumentation.tsx) | Continue label retained. Initial contained/color maps to owned filled/tone. |
| Variants | ButtonReference in the same public module | Filled primary, outlined secondary and text action panels replace contained/outlined/text. Labels change; the old foundation prop contract is retired. |
| PendingAndDisabled | [ThemesAndDensity](../../apps/docs/native-fixtures/scenarios/experimental/Button/Button.fixture.tsx) | Dark pending, disabled and compact outlined combinations remain, with additional light and comfortable combinations. |
| NativeForm | ButtonForm in the public module; NativeFormTransitions in the private fixture | Explicit submit and default non-submit behavior have retained unit assertions. Public form adds reset; submitted label deliberately replaces the historical Saved-count diagnostic. Event probes stay private. |

None of these inspected local story versions contains a play property or
expect/assert call. There is no story assertion to invent or mark as executed.
The pre-docs `AppButton.test.tsx` blob
`8cb45f5dc1932702ca7a2fba6a4e3718173856dd` is byte-identical to
[Button.public-contract.test.tsx](../../packages/ui/src/components/Button/Button.public-contract.test.tsx)
after substituting AppButton with Button. Its four cases retain pointer/Enter/Space
callback count and native ref/default type, disabled/pending suppression with
pending focus, explicit native submit, and server attributes/decorative slots.
This is source assertion continuity, not a fresh runtime test result.

The [native migration manifest](../../apps/docs/native-fixtures/migration-manifest.json)
continues to map the experimental Button story to its fixture. AppButton's
many-to-one deliberate replacement is recorded in the extraction manifest rather
than registered as a second copy of that fixture. Existing fixture IDs and registry
generation stay unchanged. Commit `540f47d4059a9cea8890b80927f34f51ef2fbc3e`
explicitly records the breaking removal of AppButton/AppButtonProps. Use
Button/ButtonProps; do not restore the removed aliases or Storybook.

## Original story modules

All 33 story paths in the extraction manifest exist in the initial local
extraction and the pre-docs-migration Git tree. The latter has 32 exact module
destinations in the docs-native migration manifest, plus AppButton's deliberate
replacement above. All exported scenario names in those 32 pre-docs modules
remain in their fixtures. Both inspected generations of the 33 local story
modules contain zero play properties and zero expect/assert calls. This does
not cover imported helper assertions, browser specs, deleted intermediate Git
versions or upstream repository contents.

| Extracted story path relative to src/ | Docs-native replacement |
| --- | --- |
'''
for s in evidence['stories']:
    replacement = ('[AppButton disposition above](#appbutton-replacement)' if not s['fixture'] else '['+s['fixture'].split('/')[-1]+'](../../'+s['fixture']+')')
    doc += '| `'+s['original'].removeprefix('src/')+'` | '+replacement+' |\n'
doc += '''
## Earlier grid scenario exports still need behavior disposition

Module transfer does not establish parity with the initial extraction. Two grid
modules changed their example exports before docs migration. The following 16
initial exports have no same-name successor in the pre-docs module or current
fixture. Their initial blobs/exports are retained in the audit receipt. Related
current examples are candidates, not accepted semantic replacements. W-10 remains
open for explicit behavior mapping, deliberate retirement or implementation and
focused validation of these scenarios; do not silently drop them from the count.

'''
for s in evidence['stories']:
    missing = s['missingInitialExportsBeforeRetirement']
    if missing:
        doc += '- `'+s['original']+'` (initial blob `'+s['initialExtraction']['blob']+'`): '+', '.join('`'+x+'`' for x in missing)+'.\n'
doc += '''
AppDataGrid Default, RetainedSelection and HostOwnedReorder provide related owned
list/selection/reorder examples. AppDataGridShell SharedListAndCards,
ControlledHostResponses and ServerLatestRequestWins provide related view and host
request examples. Structured cell-type matrices, combined checkbox/drag behavior
and sectioned/collapsible-row contracts require individual comparison; filename
presence and catalog membership cannot settle them. The existing
[public example backlog](docs-fixture-migration.md#public-example-parity-audit--docs-005-b)
also remains independent, including primitive/adapter/calendar/grid-helper flows.

## Historical-reference policy and evidence limits

Keep source repository/commit/path identifiers, Git objects, dated baseline
captures, original acceptance IDs and execution receipts unchanged. They describe
their original source/host and must not be presented as current runtime imports
or fresh validation. Current guides point to owned public contracts and docs-native
fixtures. Precise removed API names are necessary to explain consumer migration;
negative guards retain the names they reject. This policy is a proposed
documentation disposition, not a waiver of a literal zero-reference requirement.
If literal zero matches is required, a separate provenance-preserving decision is
still needed. Legal notices remain subject to their separate owner review.

[Audit evidence](final-acceptance/wave-03-33/evidence.json) records exact local Git
blobs, source SHA-256 hashes, scenario export comparisons, unit assertion texts,
the unavailable-upstream diagnostic and prior-receipt input comparisons. No
learner-platform mutation, runtime/browser/AT/device execution, legal approval,
publication or historical-evidence rewrite is implied.
'''
propose('docs/developer/extraction-lineage.md', doc)

p='docs/migration.md'
text=(ROOT/p).read_text()
text=text.replace('This documentation slice does not change that manifest or the learner platform.',
    'The [lineage reconciliation](developer/extraction-lineage.md) separates original\nsource identity from local Git evidence, deliberate AppButton replacements and\nremaining early grid scenario dispositions. The learner platform remains outside\nthis migration; no upstream checkout is modified.')
propose(p,text)
p='docs/developer/react-aria-removal-audit.md'
text=(ROOT/p).read_text()
needle='## Current provenance supplement — 2026-10-16\n'
assert needle not in text
text += '\n'+needle+'\nThe counts and Storybook output references above retain their dated audit scope.\nCurrent source/scripts live under `packages/ui`; current private native scenarios\nlive under `apps/docs/native-fixtures`. The extraction manifest now accounts for\nworkspace moves and removed story modules. See [lineage reconciliation](extraction-lineage.md)\nfor exact local AppButton story/unit dispositions and the upstream evidence limit.\nKeep original Git objects, source paths, snapshots and execution receipts unchanged.\nThese precise historical identifiers do not establish active dependencies. Literal\nzero-reference policy and legal-notice approval remain separate open decisions.\n'
propose(p,text)
p='docs/developer/react-aria-i18n-acceptance.md'
text=(ROOT/p).read_text()
text += '\n## Current fixture-host supplement — 2026-10-16\n\nThe Storybook build and execution statements above retain their original dated\nscope. The current scenario module is [Translations.fixture.tsx](../../apps/docs/native-fixtures/scenarios/i18n/Translations.fixture.tsx);\nthe [migration manifest](../../apps/docs/native-fixtures/migration-manifest.json)\nrecords its original path and the [registry](../../apps/docs/native-fixtures/registry.json)\nrecords current fixture IDs. Host globals and locale/direction scopes now belong\nto the docs-owned fixture host. This supplement changes no original test or\nreceipt and claims no fresh translation browser or assistive-technology execution.\n'
propose(p,text)
(OUT/'provenance.patch').write_text(''.join(patches))
(OUT/'patch-inputs.json').write_text(json.dumps(changes,indent=2)+'\n')
print(json.dumps({'targets':len(changes),'patchBytes':(OUT/'provenance.patch').stat().st_size}))
