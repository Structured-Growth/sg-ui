from pathlib import Path
import re,json,difflib
root=Path(__file__).resolve().parents[4]
owned=Path(__file__).resolve().parent
runtime=owned/'runtime'
runtime.mkdir(exist_ok=True)
component=root/'packages/ui/src/components/PageRichTextEditorSection'
def absolute_imports(text, parent):
    return re.sub(r'(["\'])(\.[^"\']+)\1',lambda m: m[1]+str((parent/m[2]).resolve())+m[1],text)
for path in (owned/'proposed-files').rglob('*.tsx'):
    relative=path.relative_to(owned/'proposed-files')
    (runtime/path.name).write_text(absolute_imports(path.read_text(),(root/relative).parent))
source=component/'PageRichTextEditorSection.impl.tsx'
(runtime/'baseline.impl.tsx').write_text(absolute_imports(source.read_text(),component))
patch=''
for path in sorted((owned/'proposed-files').rglob('*')):
    if not path.is_file(): continue
    relative=path.relative_to(owned/'proposed-files')
    original=root/relative
    patch+=''.join(difflib.unified_diff(original.read_text().splitlines(True) if original.exists() else [],path.read_text().splitlines(True),fromfile='a/'+str(relative) if original.exists() else '/dev/null',tofile='b/'+str(relative)))
(owned/'command-transactions.patch').write_text(patch)
for variant in ['baseline','proposed']:
    target=runtime/('baseline.impl.tsx' if variant=='baseline' else source.name)
    config='import { defineConfig } from '+json.dumps(str(root/'packages/ui/node_modules/vitest/config'))+';\n'
    config+='export default defineConfig('+json.dumps({'root':str(root/'packages/ui'),'esbuild':{'jsx':'automatic'},'resolve':{'alias':{str(source.with_suffix('')):str(target)}},'test':{'environment':'node','include':[str(runtime/'PageRichTextEditorSection.command-transactions.test.tsx')],'setupFiles':[str(root/'packages/ui/scripts/vitest.setup.ts')],'execArgv':['--no-experimental-webstorage']}})+');\n'
    # module extension required when importing by absolute path
    config=config.replace(str(root/'packages/ui/node_modules/vitest/config'),str(root/'packages/ui/node_modules/vitest/dist/config.js'))
    (owned/f'vitest.{variant}.config.mts').write_text(config)
