import {spawnSync} from 'node:child_process';
import {writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,join} from 'node:path';
const owned=fileURLToPath(new URL('.',import.meta.url));
const root=resolve(owned,'../../../..');
const records=[];
for(const variant of ['proposed','baseline']) {
 const args=[join(root,'packages/ui/node_modules/vitest/vitest.mjs'),'run','--config',join(owned,`vitest.${variant}.config.mts`),'--maxWorkers','1'];
 if(variant==='baseline')args.push('-t','Uppercase changes|Lowercase changes|Capitalize changes|Clear Formatting changes|Unicode|at a caret|transforms the real selected paragraph');
 const result=spawnSync(process.execPath,args,{cwd:root,encoding:'utf8'});
 writeFileSync(join(owned,`${variant}-unit-final.log`),(result.stdout??'')+(result.stderr??''));
 records.push({variant,runtime:process.version,executable:process.execPath,args,exitCode:result.status,error:result.error?.message});
 if(variant==='proposed'&&result.status!==0)break;
}
writeFileSync(join(owned,'unit-execution.json'),JSON.stringify(records,null,2)+'\n');
if(records[0]?.exitCode!==0)process.exitCode=1;
