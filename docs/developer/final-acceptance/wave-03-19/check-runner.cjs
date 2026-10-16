const fs=require('node:fs');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'../../../..');
process.env.SGUI_BROWSER_BASE_URL='http://127.0.0.1:6173/';
const config=require('./selector-contracts.config.cjs');
const files=[path.join(__dirname,'proposed-files/packages/ui/tests/browser/wave03-selector-contracts.spec.ts'),...['batch01-selectors.spec.ts','batch14-async-busy.spec.ts'].map(n=>path.join(root,'packages/ui/tests/browser',n))];
const selected=files.flatMap(file=>[...fs.readFileSync(file,'utf8').matchAll(/test\('([^']+)'/g)].map(m=>m[1])).filter(name=>config.grep.test(`chromium example.spec.ts ${name}`));
if(selected.length!==8||config.webServer||config.workers!==1||config.retries!==0)throw Error('Runner selection/configuration mismatch');
console.log('Static runner selection: '+selected.length+' cases x '+config.projects.length+' engines (UNRUN)');
selected.forEach(name=>console.log('- '+name));
for(const origin of ['', 'http://127.0.0.1:3000/']){
 const result=spawnSync(process.execPath,['-e',`require(${JSON.stringify(path.join(__dirname,'selector-contracts.config.cjs'))})`],{env:{...process.env,SGUI_BROWSER_BASE_URL:origin},encoding:'utf8'});
 if(result.status===0)throw Error('Unsafe host configuration accepted');
 console.log('Rejected '+(origin||'missing origin')+' before browser execution');
}
console.log(process.version+'; configuration inspection only; no browser/server started');
