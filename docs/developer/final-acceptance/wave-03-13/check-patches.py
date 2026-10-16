from pathlib import Path
import subprocess,json,shutil
own=Path(__file__).resolve().parent;root=own.parents[3]
checks=[]
for patch in ['scoped-css-corrections.patch','native-fixture.patch','documentation.patch']:
 p=subprocess.run(['git','apply','--check',str(own/patch)],cwd=root,capture_output=True,text=True)
 checks.append({'patch':patch,'exitCode':p.returncode,'stdout':p.stdout,'stderr':p.stderr})
# Optional patch depends on the focus candidate: check inside an isolated mirror.
work=own/'patch-check-work';path='packages/ui/src/experimental/TextField/TextField.module.css';target=work/path;target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(own/'proposed-files'/path,target)
p=subprocess.run(['git','apply','--check','--unsafe-paths','--directory='+str(work),str(own/'optional-native-nesting.patch')],cwd=root,capture_output=True,text=True)
checks.append({'patch':'optional-native-nesting.patch','exitCode':p.returncode,'stdout':p.stdout,'stderr':p.stderr,'scope':'read-only apply check against own candidate mirror'})
(own/'patch-check.json').write_text(json.dumps(checks,indent=2)+'\n');print(json.dumps(checks,indent=2))
