// Run from any cwd. Writes exclusively next to this script; no --record/shared build.
import {readFile,writeFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import * as os from 'node:os';
const here=dirname(fileURLToPath(import.meta.url)),root=resolve(here,'../../../..');
const hash=b=>createHash('sha256').update(b).digest('hex');
const coordinator=JSON.parse(await readFile(root+'/docs/developer/final-acceptance/coordinator-integration/evidence.json','utf8'));
const prior=JSON.parse(await readFile(root+'/docs/developer/final-acceptance/wave-02-07/ssr-attestation.json','utf8'));
const paths=[...new Set([...Object.keys(coordinator.builtLibraryHashes),...prior.timingInputs.map(x=>x.path),'packages/ui/scripts/measure-migration-proofs.mjs','packages/ui/package.json','pnpm-lock.yaml','docs/developer/migration-baseline/proof-measurements.json'])];
async function snapshot(){return Object.fromEntries(await Promise.all(paths.map(async p=>[p,await readFile(root+'/'+p).then(hash).catch(()=>null)])));}
const before=await snapshot();
const startedAt=new Date().toISOString();
let raw;
try {raw=execFileSync(process.execPath,[root+'/packages/ui/scripts/measure-migration-proofs.mjs'],{cwd:here,env:{...process.env,NODE_ENV:'production'},encoding:'utf8',stdio:['ignore','pipe','pipe']});}
catch(error){await writeFile(here+'/measurement-failure.txt',String(error)+'\n'+String(error.stderr));throw error;}
await writeFile(here+'/local-ssr.json',raw);
const after=await snapshot();const css=await readFile(root+'/packages/ui/dist/styles.css');
const record={startedAt,completedAt:new Date().toISOString(),command:'NODE_ENV=production node packages/ui/scripts/measure-migration-proofs.mjs (absolute script; owned cwd; no --record)',cwd:here,environment:{node:process.version,execPath:process.execPath,os:os.type(),release:os.release(),arch:os.arch(),cpu:os.cpus()[0]?.model,logicalCpuCount:os.cpus().length,totalMemoryBytes:os.totalmem(),loadAverage:os.loadavg(),react:JSON.parse(await readFile(root+'/packages/ui/node_modules/react/package.json')).version,nodeEnv:'production'},before,after,stable:paths.every(p=>before[p]===after[p]),changedSinceCoordinator:Object.keys(coordinator.builtLibraryHashes).filter(p=>before[p]!==coordinator.builtLibraryHashes[p]),changedSincePriorSSR:prior.timingInputs.filter(p=>before[p.path]!==p.after).map(p=>p.path),distributionCSS:{bytes:css.length,gzipLevel9Bytes:gzipSync(css,{level:9}).length,sha256:hash(css)},limits:['Concurrent 40-chat dirty checkout; no isolated performance window.','SSR is production React under Node26 analysis only, not client latency or Node22/24 acceptance.','Whole dist hash agreement with coordinator binds built bytes, not later source/build synchronization.','No consumer fixture argument: no fresh editor/grid consumer transfer measurement.','Historical Node26 benchmark did not record NODE_ENV and HTML/workloads changed; no comparative speedup claim.']};
await writeFile(here+'/local-measurement-receipt.json',JSON.stringify(record,null,2)+'\n');
console.log(JSON.stringify({stable:record.stable,changedBuiltFiles:record.changedSinceCoordinator.length,changedSourceInputs:record.changedSincePriorSSR,distributionCSS:record.distributionCSS,results:JSON.parse(raw).results},null,2));
