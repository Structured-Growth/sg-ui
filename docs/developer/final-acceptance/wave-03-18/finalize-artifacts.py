from pathlib import Path
import difflib
r=Path.cwd();o=r/'docs/developer/final-acceptance/wave-03-18';d=o/'proposed-files'
changes={
'apps/docs/native-fixtures/scenarios/experimental/PrimitiveAcceptance/PrimitiveAcceptance.fixture.tsx':(o/'native-fixture.tsx').read_text(),
'packages/ui/tests/browser/wave03-18-primitives.spec.ts':(o/'native.spec.ts').read_text(),
'packages/ui/src/experimental/TextArea/TextArea.reset-ownership.test.tsx':(o/'textarea-reset.test.tsx').read_text().replace("'../../../../packages/ui/src/experimental/TextArea/TextArea'","'./TextArea'"),
'packages/ui/src/experimental/RadioGroup/RadioGroup.reset-edge.test.tsx':(o/'radio-edge.test.tsx').read_text().replace("'../../../../packages/ui/src/experimental/RadioGroup/RadioGroup'","'./RadioGroup'"),
}
patch=''
for p,s in changes.items():
 dest=d/p;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(s)
 patch+=''.join(difflib.unified_diff([],s.splitlines(True),fromfile='/dev/null',tofile='b/'+p))
(o/'focused-tests-fixtures.patch').write_text(patch)
