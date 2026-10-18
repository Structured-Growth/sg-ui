// Own-directory mirror only; no production writes or generated dist consumption.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
const here=dirname(fileURLToPath(import.meta.url));
const root=resolve(here,'../../../../..');
const require=createRequire(resolve(root,'packages/ui/package.json'));
const target='packages/ui/src/foundation/Tokens.next100-regression.test.mjs';
const mirror=resolve(here,'runnable/packages/ui');
mkdirSync(resolve(mirror,'src/foundation'),{recursive:true});mkdirSync(resolve(mirror,'scripts'),{recursive:true});
for(const name of ['tokens.json','tokens.generated.ts'])copyFileSync(resolve(root,'packages/ui/src/foundation',name),resolve(mirror,'src/foundation',name));
copyFileSync(resolve(root,'packages/ui/scripts/tokens.mjs'),resolve(mirror,'scripts/tokens.mjs'));
const source=readFileSync(resolve(here,'proposed-files',target),'utf8');
// Only resolution substitution: TypeScript is already installed in the real UI workspace.
const runnable=source.replace("from 'typescript'",`from '${pathToFileURL(require.resolve('typescript')).href}'`);
writeFileSync(resolve(mirror,'src/foundation/Tokens.next100-regression.test.mjs'),runnable);
const result=spawnSync(process.execPath,['--test',resolve(mirror,'src/foundation/Tokens.next100-regression.test.mjs')],{encoding:'utf8'});
process.stdout.write(result.stdout);process.stderr.write(result.stderr);process.exitCode=result.status??1;
