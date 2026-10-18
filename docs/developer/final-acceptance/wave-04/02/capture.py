from pathlib import Path
import hashlib,json,subprocess
r=Path.cwd();o=r/'docs/developer/final-acceptance/wave-04/02'
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
inputs=set(['AGENTS.md','docs/developer/react-aria-final-acceptance.md','docs/developer/react-aria-hardening-execution.md','docs/developer/react-aria-hardening-tasks.md','docs/developer/react-aria-baseline-tasks.md','docs/developer/react-aria-regression-tasks.md','docs/developer/backlog-execution-2026-10-15.md'])
for n in ['23','24','25','26']:
 for name in ['report.md','results.json','evidence.json']:inputs.add(f'docs/developer/final-acceptance/wave-03-{n}/{name}')
for n in ['26','27','28','29','30','34']:inputs.add(f'docs/developer/parallel-next100/next100-c{n}.md')
for directory in ['wave-03-integration','wave-03-followup','editor-chrome-presentation','rich-editor-presentation']:
 for p in (r/'docs/developer/final-acceptance'/directory).glob('*'):
  if p.is_file() and p.suffix in ['.json','.log','.md']:inputs.add(str(p.relative_to(r)))
components=['PageRichTextEditorSection','RichTextFormattingToolbar','InsertContentMenuControl','TextAlignMenuControl','TextColorPickerControl','TextStyleMenuControl','FloatingTextSelectionToolbar']
for c in components:
 for p in (r/'packages/ui/src/components'/c).rglob('*'):
  if p.is_file():inputs.add(str(p.relative_to(r)))
for p in (r/'packages/ui/tests/browser').glob('*editor*.spec.ts'):inputs.add(str(p.relative_to(r)))
inputs.add('apps/docs/native-fixtures/scenarios/components/PageRichTextEditorSection/PageRichTextEditorSection.fixture.tsx')
for receipt in ['rich-editor-presentation/results.json','editor-chrome-presentation/results.json']:
 data=json.loads((r/'docs/developer/final-acceptance'/receipt).read_text()); inputs.update(data.get('sourceSha256',{}))
hashes={p:digest(r/p) for p in sorted(inputs) if (r/p).is_file()}
comparisons={}
for receipt,field in [('rich-editor-presentation/results.json','sourceSha256'),('editor-chrome-presentation/results.json','sourceSha256'),('wave-03-integration/push-source-inputs.json',None),('wave-03-followup/validated-source-inputs.json',None)]:
 data=json.loads((r/'docs/developer/final-acceptance'/receipt).read_text()); old=data[field] if field else data
 rows=[]
 for p,h in old.items():
  if p in hashes:rows.append({'path':p,'recordedSha256':h,'currentSha256':hashes[p],'equal':h==hashes[p]})
 comparisons[receipt]=rows
result={'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'branch':subprocess.check_output(['git','branch','--show-current'],text=True).strip(),'inputSha256':hashes,'receiptComparisons':comparisons,'limits':'Hash equality retains named prior results; it is not execution. Changed historical inputs require the later named correction receipt. No new runtime acceptance claimed.'}
(o/'evidence.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({k:{'compared':len(v),'equal':sum(x['equal'] for x in v),'changed':[x['path'] for x in v if not x['equal']]} for k,v in comparisons.items()},indent=2))
