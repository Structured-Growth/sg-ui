import {spawnSync} from 'node:child_process';
import {openSync,closeSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../../../',import.meta.url));
const here=fileURLToPath(new URL('.',import.meta.url));
const jobs=[
 ['units',['--filter','@structured-growth/sg-ui','test']],
 ['library',['--filter','@structured-growth/sg-ui','build']],
 ['foundation',['--filter','@structured-growth/sg-ui','foundations:check']],
 ['tokens',['--filter','@structured-growth/sg-ui','tokens:check']],
 ['docs',['--filter','@structured-growth/docs','build']],
 ['native',['--filter','@structured-growth/sg-ui','exec','node','scripts/build-browser-docs.mjs']],
 ['browser-types',['--filter','@structured-growth/sg-ui','exec','tsc','--noEmit','-p','tests/browser/tsconfig.json']],
 ['package',['--filter','@structured-growth/sg-ui','exec','node','scripts/check-package.mjs','--retain-packed='+root+'packages/ui/artifacts/wave03-followup-package']]
];
const results=[];
for(const [name,args] of jobs.filter(([name])=>!process.env.SGUI_SKIP_UNITS||name!=='units')){const fd=openSync(here+name+'-final.log','wx');const startedAt=new Date().toISOString();const result=spawnSync('pnpm',args,{cwd:root,env:process.env,stdio:['ignore',fd,fd]});closeSync(fd);results.push({name,command:['pnpm',...args],startedAt,completedAt:new Date().toISOString(),exitCode:result.status,error:result.error?.message});writeFileSync(here+'checkpoint-results.json',JSON.stringify(results,null,2)+'\n');console.log(name,result.status);if(result.status!==0){process.exitCode=result.status??1;break;}}
