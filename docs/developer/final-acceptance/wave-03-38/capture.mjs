import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
const root=process.cwd(), out=path.join(root,'docs/developer/final-acceptance/wave-03-38');
const require=createRequire(import.meta.url);
const yamlDir=fs.readdirSync('node_modules/.pnpm').find(n=>n.startsWith('js-yaml@'));
const yaml=require(path.resolve('node_modules/.pnpm',yamlDir,'node_modules/js-yaml'));
const read=p=>fs.readFileSync(p,'utf8'), hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const lock=yaml.load(read('pnpm-lock.yaml')), workspace=yaml.load(read('pnpm-workspace.yaml'));
const prior=JSON.parse(read('docs/developer/final-acceptance/wave-02-12/evidence.json'));
const selected=['AGENTS.md','docs/developer/react-aria-final-acceptance.md','docs/developer/final-acceptance/coordinator-integration/evidence.json','docs/developer/final-acceptance/wave-02-12/report.md','docs/developer/final-acceptance/wave-02-12/results.json','docs/developer/final-acceptance/wave-02-12/release-recovery-draft.md','package.json','packages/ui/package.json','apps/docs/package.json','pnpm-lock.yaml','pnpm-workspace.yaml','.github/workflows/release.yml','packages/ui/release.config.mjs','packages/ui/scripts/release-policy.test.mjs','docs/github-setup.md','docs/migration.md','docs/troubleshooting/validation.md','LICENSE','THIRD_PARTY_NOTICES.md', 'packages/ui/node_modules/semantic-release/index.js','packages/ui/node_modules/semantic-release/lib/get-next-version.js','packages/ui/node_modules/@semantic-release/npm/lib/publish.js','packages/ui/node_modules/@semantic-release/npm/lib/verify-auth.js','packages/ui/node_modules/@semantic-release/github/lib/publish.js'];
const oldInputs=prior.inputs??prior.inputHashes??{};
const inputs=Object.fromEntries(selected.map(p=>{const sha256=hash(p), old=oldInputs[p]?.sha256;return [p,{sha256,priorSha256:old??null,delta:old?(old===sha256?'unchanged':'changed'):'not selected previously'}]}));
const mismatches=[];
for(const [dir,imp] of Object.entries(lock.importers)) {
 const manifest=JSON.parse(read(path.join(dir,'package.json')));
 for(const group of ['dependencies','devDependencies','optionalDependencies']) {
  for(const [name,range] of Object.entries(manifest[group]??{})) if(imp[group]?.[name]?.specifier!==range)mismatches.push({dir,group,name,manifest:range,lock:imp[group]?.[name]?.specifier??null});
  for(const name of Object.keys(imp[group]??{}))if(!(name in (manifest[group]??{})))mismatches.push({dir,group,name,extra:true});
 }
}
const packages=Object.entries(lock.packages??{}), snapshots=Object.entries(lock.snapshots??{});
const audit={lockfileVersion:lock.lockfileVersion,settings:lock.settings,overrides:lock.overrides??null,patchedDependencies:lock.patchedDependencies??null,workspaceOverrides:workspace.overrides??null,workspacePatchedDependencies:workspace.patchedDependencies??null,importers:lock.importers,manifestMismatches:mismatches,packageCount:packages.length,snapshotCount:snapshots.length,integrityCount:packages.filter(([,v])=>v.resolution?.integrity).length,nonIntegrityResolutions:packages.filter(([,v])=>!v.resolution?.integrity),platformPackages:packages.filter(([,v])=>v.os||v.cpu||v.libc),peerPackages:packages.filter(([,v])=>v.peerDependencies),optionalSnapshots:snapshots.filter(([,v])=>v.optional||v.optionalDependencies),peerContextSnapshots:snapshots.filter(([k])=>k.includes('(')).map(([k])=>k),snapshotDependencies:snapshots.map(([k,v])=>({key:k,dependencies:v.dependencies??{},optionalDependencies:v.optionalDependencies??{}})),retired:packages.filter(([k])=>/^(@mui\/|@emotion\/)/.test(k)),installedLockSha256:hash('node_modules/.pnpm/lock.yaml'),sourceLockSha256:hash('pnpm-lock.yaml')};
fs.writeFileSync(path.join(out,'lock-audit.json'),JSON.stringify(audit,null,2)+'\n');
fs.writeFileSync(path.join(out,'evidence.json'),JSON.stringify({time:new Date().toISOString(),runtime:process.version,head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),inputs,coordinatorEvidence:{sha256:hash('docs/developer/final-acceptance/coordinator-integration/evidence.json'),topLevelKeys:Object.keys(JSON.parse(read('docs/developer/final-acceptance/coordinator-integration/evidence.json')))},limits:['Read-only structural lock audit; no package-manager generation, frozen installation, vulnerability or license result.','Node26 offline audit is not supported Node22/24 conformance.','Installed lock identity is not clean physical installation/optional-topology proof.']},null,2)+'\n');
console.log(JSON.stringify({packages:audit.packageCount,snapshots:audit.snapshotCount,integrities:audit.integrityCount,manifestMismatches:mismatches,platformPackages:audit.platformPackages.length,optionalSnapshots:audit.optionalSnapshots.length,peerContextSnapshots:audit.peerContextSnapshots.length,retired:audit.retired.length,installedLockEqualsSource:audit.installedLockSha256===audit.sourceLockSha256,priorInputs:inputs},null,2));
