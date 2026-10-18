from pathlib import Path
import json, hashlib, subprocess, re, difflib
ROOT=Path(__file__).resolve().parents[5]
OUT=Path(__file__).resolve().parent
assert (ROOT/'packages/ui').is_dir()
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def dump(name,data): (OUT/name).write_text(json.dumps(data,indent=2)+'\n')
components=['DocumentEditorLayout','DocumentEditorToolbar','ContentEditorChrome','FloatingTextSelectionToolbar']
inputs=set()
for c in components:
 inputs.update(p for p in (ROOT/'packages/ui/src/components'/c).rglob('*') if p.is_file())
queue=list(inputs)
while queue:
 p=queue.pop()
 if p.suffix not in ('.ts','.tsx','.css'): continue
 for match in re.finditer(r'(?:from\s*|import\s*)[\'\"](\.[^\'\"]+)[\'\"]',p.read_text()):
  base=p.parent/match.group(1)
  candidates=[base,Path(str(base)+'.ts'),Path(str(base)+'.tsx'),base/'index.ts',base/'index.tsx']
  dest=next((q.resolve() for q in candidates if q.is_file()),None)
  if dest and dest.is_relative_to(ROOT) and dest not in inputs: inputs.add(dest);queue.append(dest)
paths=[
 'AGENTS.md','docs/developer/react-aria-editor-layout.md','docs/developer/react-aria-baseline-tasks.md',
 'docs/developer/react-aria-regression-tasks.md','docs/developer/react-aria-hardening-tasks.md',
 'docs/developer/react-aria-hardening-execution.md','docs/developer/react-aria-final-acceptance.md',
 'docs/developer/react-aria-master-task-list.md','docs/developer/react-aria-progress.md',
 'docs/developer/backlog-execution-2026-10-15.md','docs/developer/react-aria-migration-inventory-acceptance.md',
 'docs/developer/react-aria-scope-ledger.md','pnpm-lock.yaml',
 'packages/ui/tests/browser/wave03-editor-chrome-acceptance.spec.ts',
 'packages/ui/tests/browser/inventory-layout-replacement.spec.ts',
 'packages/ui/tests/browser/inventory-editor-chrome.spec.ts',
 'packages/ui/tests/browser/inventory-selection-boundary.spec.ts',
 'packages/ui/tests/browser/hardening-rich-editor-presentation.spec.ts',
 'packages/ui/tests/browser/editor-selection-editing-successors.spec.ts',
 'apps/docs/native-fixtures/scenarios/components/ContentEditorChrome/ContentEditorChrome.fixture.tsx',
 'apps/docs/native-fixtures/scenarios/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.fixture.tsx',
 'apps/docs/native-fixtures/scenarios/components/PageRichTextEditorSection/PageRichTextEditorSection.fixture.tsx',
 'apps/docs/content/component-usage/editor.json',
 'docs/developer/final-acceptance/wave-03-23/report.md','docs/developer/final-acceptance/wave-03-23/results.json',
 'docs/developer/final-acceptance/wave-03-25/report.md','docs/developer/final-acceptance/wave-03-25/results.json',
 'docs/developer/final-acceptance/wave-02-03/report.md',
 'docs/developer/final-acceptance/wave-03-followup/validation-results.json',
 'docs/developer/final-acceptance/wave-03-followup/native-final.log',
 'docs/developer/final-acceptance/wave-03-followup/units-final.log',
 'docs/developer/final-acceptance/wave-03-integration/reconciliation.json']
for n in [21,22,23,25]: paths.append(f'docs/developer/parallel-next100/next100-c{n}.md')
receipts=[]
for folder in ['editor-chrome-presentation','rich-editor-presentation']:
 base=ROOT/'docs/developer/final-acceptance'/folder
 inputs.update(p for p in base.rglob('*') if p.is_file())
 receipt=json.loads((base/'results.json').read_text())
 comparisons=[]
 for path,expected in receipt['sourceSha256'].items():
  p=ROOT/path;actual=sha(p) if p.is_file() else None
  comparisons.append({'path':path,'expected':expected,'actual':actual,'matches':expected==actual})
 receipts.append({'receipt':str((base/'results.json').relative_to(ROOT)),'sha256':sha(base/'results.json'),'sourceComparisons':comparisons,'allMatch':all(r['matches'] for r in comparisons)})
inputs.update(ROOT/p for p in paths)
missing=[str(p.relative_to(ROOT)) for p in inputs if not p.is_file()]
assert not missing, missing
closure=[str(p.relative_to(ROOT)) for p in inputs if str(p.relative_to(ROOT)).startswith('packages/ui/src/')]
delta=subprocess.check_output(['git','diff','--name-only','d955656b3ae85c600d233e959a0b9da3116eeb7f','HEAD','--',*closure],cwd=ROOT,text=True).splitlines()
evidence={'schemaVersion':1,'baseline':'6c485ed79d0d6a521d188e5bde8315722296f518','head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'method':'Read-only SHA256 capture; local relative import/export traversal from four component families, including CSS imports. This is not full bundler/package resolution or a new runtime execution.','receiptComparisons':receipts,'sourceClosurePaths':sorted(closure),'sourceChangesSinceHB19Commit':delta,'deltaDisposition':'Floating source/test changes match HB-20 receipt. Shared Menu CSS change also matches HB-20 and its 33 passing tab/overflow cases. No other traversed source changed since HB-19 commit.','inputSha256':{str(p.relative_to(ROOT)):sha(p) for p in sorted(inputs)}}
dump('evidence.json',evidence)
# Distinguish concurrent unrelated fixture edits from the accepted HB-20 scenario.
fixture='apps/docs/native-fixtures/scenarios/components/PageRichTextEditorSection/PageRichTextEditorSection.fixture.tsx'
committed=subprocess.check_output(['git','show','HEAD:'+fixture],cwd=ROOT,text=True)
working=(ROOT/fixture).read_text()
marker='// HB-20: real Lexical composition, with host-owned long content and translations.'
scenarioEqual=working[working.index(marker):]==committed[committed.index(marker):]
expected=json.loads((ROOT/'docs/developer/final-acceptance/rich-editor-presentation/results.json').read_text())['sourceSha256'][fixture]
assert hashlib.sha256(committed.encode()).hexdigest()==expected
assert scenarioEqual
(OUT/'concurrent-fixture.diff').write_text(subprocess.check_output(['git','diff','--',fixture],cwd=ROOT,text=True))
evidence['concurrentFixtureChange']={'path':fixture,'acceptedCommittedSha256':expected,'currentSha256':sha(ROOT/fixture),'acceptedLocalizedPresentationRegionUnchanged':scenarioEqual,'acceptedLocalizedPresentationRegionSha256':hashlib.sha256(committed[committed.index(marker):].encode()).hexdigest(),'delta':'Only ImageSources upload retry scenario changed; localized HB-20 scenario and module imports are unchanged. See concurrent-fixture.diff. No new behavior pass claimed for changed ImageSources.','scope':'Do not apply this owner documentation patch to the fixture or revert another writer.'}
evidence['deltaDisposition']='Only traversed source changes since HB-19 commit are floating source/tests, both exactly matched by HB-20. Shared Menu CSS is separately exactly matched by HB-20 sourceSha256 and its 33 passing tab/overflow regressions.'
evidence['workingSourceDiffFromHEAD']=subprocess.check_output(['git','diff','--name-only','--',*closure],cwd=ROOT,text=True).splitlines()
dump('evidence.json',evidence)
assert not evidence['workingSourceDiffFromHEAD']
assert all(r['matches'] or r['path']==fixture for receipt in receipts for r in receipt['sourceComparisons'])
original=ROOT/'docs/developer/react-aria-editor-layout.md'
text=original.read_text()
text=text.replace('Position follows selection/update, captured ancestor scroll, resize and toolbar\nmeasurement.', 'Position follows selection/update, captured ancestor scroll, resize and toolbar\nmeasurement. For multi-line ranges, anchoring uses the first selected client\nrectangle visible inside the viewport/boundary intersection, so an offscreen\nfirst line does not hide actions for the remaining visible selection.')
text=text.replace('Full\ncross-browser/touch/assistive-technology acceptance remains open.', 'The named desktop selection-boundary and presentation checks pass in Chromium,\nFirefox and WebKit; see the [component acceptance reconciliation](react-aria-editor-chrome-acceptance.md).\nPhysical-device and spoken assistive-technology acceptance remain separate.')
assert text!=original.read_text()
(OUT/'proposed-files/docs/developer/react-aria-editor-layout.md').write_text(text)
print(json.dumps({'capturedInputs':len(inputs),'sourceClosurePaths':len(closure),'receiptHashesMatch':all(r['allMatch'] for r in receipts),'sourceChangesSinceHB19Commit':delta},indent=2))
