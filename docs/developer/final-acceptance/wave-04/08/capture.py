from pathlib import Path
import hashlib,json,subprocess,datetime
out=Path(__file__).resolve().parent
root=out.parents[4]
assert (root/'packages/ui').exists()
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
checks=[]
for cmd in [['node','--check',str(out/'proposed-files/packages/ui/scripts/acceptance-installed-types.mjs')],['git','apply','--check',str(out/'public-contract-followup.patch')]]:
 p=subprocess.run(cmd,cwd=root,text=True,capture_output=True)
 checks.append({'command':cmd,'exitCode':p.returncode,'stdout':p.stdout,'stderr':p.stderr})
(out/'preparation-checks.json').write_text(json.dumps({'node':subprocess.check_output(['node','--version'],text=True).strip(),'checks':checks,'limits':'Syntax and unapplied patch applicability only. No type proof, package suite, install, build or browser executed.'},indent=2)+'\n')
files=['AGENTS.md','docs/developer/react-aria-final-acceptance.md','docs/developer/react-aria-hardening-execution.md','docs/developer/react-aria-hardening-tasks.md','docs/developer/react-aria-public-contracts.md','docs/developer/react-aria-public-composition-contracts.md','docs/developer/react-aria-calendar-contracts.md','docs/developer/react-aria-runtime-ci.md','packages/ui/package.json','packages/ui/scripts/package-consumer.tsx','packages/ui/scripts/test-foundation-consumer.mjs','packages/ui/scripts/check-package.mjs','packages/ui/release.config.mjs']
base='docs/developer/final-acceptance/'
files += [base+p for p in ['wave-03-01/report.md','wave-03-01/results.json','wave-03-01/normalized-defaults.json','wave-03-01/normalized-contracts.json','wave-03-01/breaking-change-map.json','wave-03-01/historical-dependency-boundary.json','wave-03-03/report.md','wave-03-03/results.json','wave-03-13/report.md','wave-03-13/styling-migration-addendum.md','wave-03-32/report.md','wave-03-32/results.json','wave-03-32/validation-plan.json','wave-03-32/run-matrix.mjs','wave-03-35/public-symbol-dispositions.json','wave-03-38/report.md','wave-03-38/results.json','wave-03-38/offline-release.txt','wave-03-integration/reconciliation.json','wave-03-integration/push-evidence.json','wave-03-followup/validation-results.json','wave-03-followup/package-final.log','editor-chrome-presentation/results.json','rich-editor-presentation/results.json','parallel-01/api-snapshot.json']]
files += ['packages/ui/src/'+p for p in ['foundation/ThemeScope.tsx','experimental/Checkbox/Checkbox.tsx','experimental/TextField/TextField.tsx','experimental/Dialog/Dialog.tsx','experimental/Menu/Menu.tsx','experimental/Popover/Popover.tsx','experimental/FormFieldScope/FormFieldScope.tsx','experimental/DateRangeSelector/DateRangeSelector.tsx','experimental/Calendar/Calendar.tsx','experimental/DatePicker/DatePicker.tsx','experimental/DateRangePicker/DateRangePicker.tsx']]
inputs={p:sha(root/p) for p in files if (root/p).exists()}
# Later HB receipts supersede old presentation gaps; validate only their saved source maps.
comparisons={}
for f in ['editor-chrome-presentation/results.json','rich-editor-presentation/results.json']:
 data=json.loads((root/base/f).read_text()); mapping=data.get('sourceSha256',{})
 comparisons[f]=[{'path':p,'recorded':h,'current':sha(root/p) if (root/p).exists() else None,'unchanged':(root/p).exists() and sha(root/p)==h} for p,h in mapping.items()]
head=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()
(out/'evidence.json').write_text(json.dumps({'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':head,'expectedBaseline':'6c485ed79d0d6a521d188e5bde8315722296f518','inputs':inputs,'laterReceiptInputComparison':comparisons,'limits':['Lightweight read-only source/hash reconciliation. Unchanged source hashes preserve bounded prior evidence, not all transitive/build identities.','No remote publication/history or human release approval inferred.','No older editor presentation gap is reintroduced after HB19/HB20.']},indent=2)+'\n')
assert all(c['exitCode']==0 for c in checks)
print(json.dumps({'head':head,'checks':len(checks),'hashedInputs':len(inputs),'laterSavedSources':{k:{'compared':len(v),'unchanged':sum(r['unchanged'] for r in v)} for k,v in comparisons.items()}}))
