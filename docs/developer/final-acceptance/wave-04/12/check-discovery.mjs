// Discovery only: transpile isolated proposals and list tests without starting a host/browser.
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
const here=dirname(fileURLToPath(import.meta.url));
const repo=resolve(here,'../../../../..');
const require=createRequire(resolve(repo,'packages/ui/package.json'));
const ts=require('typescript');
const directory=resolve(here,'discovery');await mkdir(directory,{recursive:true});
const playwright=pathToFileURL(resolve(repo,'packages/ui/node_modules/@playwright/test/index.mjs')).href;
for(const [name,source] of [
 ['wave04-browser-acceptance',resolve(here,'proposed-files/packages/ui/tests/browser/wave04-browser-acceptance.spec.ts')],
 ['batch52-dialog-removed-opener',resolve(repo,'packages/ui/tests/browser/batch52-dialog-removed-opener.spec.ts')],
]) {
 const text=(await readFile(source,'utf8')).replace(/from '@playwright\/test'/g,`from '${playwright}'`);
 const output=ts.transpileModule(text,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
 await writeFile(resolve(directory,`${name}.spec.mjs`),output);
}
const configSource=await readFile(resolve(here,'proposed-files/packages/ui/playwright.wave04-browser-acceptance.config.ts'),'utf8');
const config=ts.transpileModule(configSource.replace(/from '@playwright\/test'/g,`from '${playwright}'`).replace("testDir: './tests/browser'","testDir: '.'").replaceAll('.spec.ts','.spec.mjs'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
await writeFile(resolve(directory,'discovery.config.mjs'),config);
const result=spawnSync(process.execPath,[resolve(repo,'packages/ui/node_modules/@playwright/test/cli.js'),'test','--config',resolve(directory,'discovery.config.mjs'),'--list'],{cwd:repo,encoding:'utf8',env:{...process.env,SGUI_ACCEPTANCE_BASE_URL:'http://127.0.0.1:6173',SGUI_ACCEPTANCE_OUTPUT:resolve(directory,'output')}});
await writeFile(resolve(here,'native-discovery.log'),result.stdout+result.stderr);
console.log(result.stdout+result.stderr);process.exitCode=result.status??1;
