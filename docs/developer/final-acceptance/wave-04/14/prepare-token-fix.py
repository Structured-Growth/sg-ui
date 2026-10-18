from pathlib import Path
import difflib
root=Path.cwd(); base=root/'docs/developer/final-acceptance/wave-04/14'
path='packages/ui/src/foundation/Tokens.next100-regression.test.mjs'
before=(root/path).read_text()
after=before.replace("import { tokens, tokenTiers } from './tokens.generated.ts';", """import ts from 'typescript';

// Node 22.12 has no default TypeScript loader. Compile the actual generated source
// with the existing toolchain instead of relying on newer Node's type stripping.
const generated = await readFile(new URL('./tokens.generated.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(generated, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  reportDiagnostics: true,
});
assert.deepEqual(compiled.diagnostics, []);
const { tokens, tokenTiers } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`);""")
assert before!=after
out=base/'proposed-files'/path;out.parent.mkdir(parents=True,exist_ok=True);out.write_text(after)
(base/'node22-token-test.patch').write_text(''.join(difflib.unified_diff(before.splitlines(True),after.splitlines(True),fromfile='a/'+path,tofile='b/'+path)))
