from pathlib import Path
import hashlib,json,datetime,subprocess,platform
root=Path(__file__).resolve().parents[4]; owned=Path(__file__).resolve().parent
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
prior=json.loads((root/'docs/developer/final-acceptance/wave-02-03/evidence.json').read_text())
coordinator=json.loads((root/'docs/developer/final-acceptance/coordinator-integration/evidence.json').read_text())
names=['PageRichTextEditorSection','RichTextFormattingToolbar','InsertContentMenuControl','TextAlignMenuControl','TextColorPickerControl','TextStyleMenuControl']
paths=set()
for name in names:
 paths.update((root/f'packages/ui/src/components/{name}').rglob('*'))
paths={p for p in paths if p.is_file()}
paths.update(root/x for x in ['docs/developer/react-aria-editor-menus.md','docs/developer/react-aria-formatting-toolbar.md','packages/ui/tests/browser/editor-mixed-formatting-history.spec.ts','packages/ui/tests/browser/editor-paragraph-transactions.spec.ts','packages/ui/tests/browser/inventory-editor-table-history.spec.ts'])
inputs={str(p.relative_to(root)):sha(p) for p in sorted(paths)}
prior_comparison={p:{'previous':prior['inputHashes'][p],'current':h,'unchanged':prior['inputHashes'][p]==h} for p,h in inputs.items() if p in prior['inputHashes']}
retained_outputs={}
for group in ['builtLibraryHashes','privateFixtureOutputHashes','receiptHashes']:
 for key,old in coordinator.get(group,{}).items():
  if not any(name in key for name in names): continue
  p=root/key
  retained_outputs[key]={'recorded':old,'current':sha(p) if p.exists() else None,'unchanged':sha(p)==old if p.exists() else None}
artifacts={str(p.relative_to(owned)):sha(p) for p in sorted(owned.rglob('*')) if p.is_file() and not p.is_symlink() and 'node_modules' not in p.parts and p.name!='evidence.json'}
value={'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),'platform':platform.platform(),'scope':'Owned evidence directory only; runtime copy with rewritten import locations, real Lexical plugins/history/callbacks','inputHashes':inputs,'priorWave02Comparison':prior_comparison,'coordinatorBuiltComparison':retained_outputs,'artifacts':artifacts}
(owned/'evidence.json').write_text(json.dumps(value,indent=2)+'\n')
print(json.dumps({'inputs':len(inputs),'priorCompared':len(prior_comparison),'priorChanged':[p for p,v in prior_comparison.items() if not v['unchanged']],'coordinatorBuiltCompared':len(retained_outputs)},indent=2))
