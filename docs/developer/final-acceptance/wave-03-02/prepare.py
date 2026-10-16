from pathlib import Path
import re,difflib,json,hashlib
root=Path.cwd(); own=root/'docs/developer/final-acceptance/wave-03-02'; proposed=own/'proposed-files'; changes={}
def change(p,text):
 changes[p]=text
 dest=proposed/p;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(text)
for name in ['DateField','TimeField']:
 p=f'packages/ui/src/experimental/{name}/{name}.tsx'; text=(root/p).read_text()
 m=re.search(r'export interface '+name+r'Props \{.*?\n\}',text,re.S);assert m
 change(f'packages/ui/src/experimental/{name}/{name}.types.ts',m[0]+'\n')
 change(p,text[:m.start()]+f'import type {{ {name}Props }} from "./{name}.types";\nexport type {{ {name}Props }} from "./{name}.types";'+text[m.end():])
 p=f'packages/ui/src/experimental/{name}/Text{name}.tsx';text=(root/p).read_text()
 change(p,text.replace(f'from "./{name}"',f'from "./{name}.types"'))
p='packages/ui/src/adapters/navigation.tsx';text=(root/p).read_text();start=text.index('export type SGLinkProps');end=text.index('const defaultAdapter')
change('packages/ui/src/adapters/navigation.types.ts','import type { AnchorHTMLAttributes, ComponentType, RefAttributes } from "react";\n'+text[start:end])
text=text[:start]+'import type { SGNavigationAdapter } from "./navigation.types";\nexport type { SGLinkProps, SGNavigationAdapter } from "./navigation.types";\n'+text[end:]
text=text.replace('useContext, type AnchorHTMLAttributes, type ComponentType, type ReactNode, type RefAttributes','useContext, type ReactNode')
change(p,text)
p='packages/ui/src/adapters/navigationContext.ts';change(p,(root/p).read_text().replace('from "./navigation"','from "./navigation.types"'))
p='packages/ui/scripts/check-foundations.mjs';text=(root/p).read_text();text=text.replace("import { compileTokens } from './tokens.mjs';","import { compileTokens } from './tokens.mjs';\nimport { assertSourceGraph, inspectSourceGraph } from './check-source-graph.mjs';\nimport { runSourceGraphRegression } from './check-source-graph.test.mjs';")
text=text.replace('export async function checkFoundations() {','export async function checkFoundations() {\nassertSourceGraph(inspectSourceGraph());\nrunSourceGraphRegression();')
# Replace the depth-limited regular expression check with the maintained graph check.
text='\n'.join(line for line in text.split('\n') if 'Internal root import in' not in line)
change(p,text)
p='docs/developer/component-architecture.md';text=(root/p).read_text();needle='The public primitives/icons and catalog use strict source/transitive/declaration'
text=text.replace(needle,'The foundation check resolves every production TypeScript/JavaScript module reference\nusing the library compiler options. Internal references to `src/index.ts` or the\npackage root are forbidden at any depth, including aliases, type imports, reexports,\nside effects and dynamic imports. Both runtime cycles and cycles involving erased\ntype edges are forbidden; reports distinguish these graphs rather than claiming\na type-only return edge is a runtime cycle. Extract shared contracts to dependency\nleaves and preserve public type reexports. Nonliteral module references fail the\naudit because their targets cannot be established. Tests and native fixtures are\noutside this production graph. Run `node scripts/check-source-graph.mjs` and\n`node --test scripts/check-source-graph.test.mjs` from `packages/ui`; both checks\nalso run through `foundations:check`.\n\n'+needle)
change(p,text)
# Include manually authored scripts.
for f in (proposed/'packages/ui/scripts').glob('check-source-graph*.mjs'):changes[str(f.relative_to(proposed))]=f.read_text()
patch=''
for p,text in sorted(changes.items()):
 old=(root/p).read_text() if (root/p).exists() else ''
 patch+=''.join(difflib.unified_diff(old.splitlines(True),text.splitlines(True),fromfile='a/'+p if (root/p).exists() else '/dev/null',tofile='b/'+p))
(own/'cycle-enforcement.patch').write_text(patch)
(own/'patch-input-hashes.json').write_text(json.dumps({p:hashlib.sha256((root/p).read_bytes()).hexdigest() if (root/p).exists() else None for p in sorted(changes)},indent=2)+'\n')
