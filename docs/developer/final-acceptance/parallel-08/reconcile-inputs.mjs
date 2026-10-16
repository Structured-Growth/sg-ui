import {readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const root = process.cwd();
const owner = 'docs/developer/final-acceptance/parallel-08/';
const read = async path => JSON.parse(await readFile(path, 'utf8'));
const fa01 = await read('docs/developer/final-acceptance/2026-10-16-inventory.json');
const fa02 = await read('docs/developer/final-acceptance/2026-10-16-source-inventory.json');
const paths = [...new Set([
  '.github/workflows/ci.yml', 'package.json', 'packages/ui/package.json', 'apps/docs/package.json',
  'packages/ui/scripts/tokens.mjs', 'packages/ui/scripts/tokens.test.mjs',
  'packages/ui/scripts/check-foundations.mjs', 'packages/ui/scripts/check-component-css.mjs',
  'packages/ui/scripts/check-component-css.test.mjs', 'packages/ui/src/foundation/Tokens.next100-regression.test.mjs',
  'packages/ui/src/foundation/tokens.json', 'packages/ui/src/foundation/tokens.css', 'packages/ui/src/foundation/tokens.generated.ts',
  ...Object.keys(fa02.inputHashes).filter(path => path.startsWith('packages/ui/src/') && path.endsWith('.module.css')),
  ...Object.keys(fa02.inputHashes).filter(path => path.startsWith('apps/docs/theme/')),
  'docs/developer/react-aria-token-roles.md', 'docs/developer/theme-token-pipeline.md',
  'docs/developer/react-aria-architecture.md',
])];
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const inputs=[];
for (const path of paths) {
  const hash=sha(await readFile(path));
  const prior=fa02.inputHashes[path] ?? fa01.sourceHashes[path];
  inputs.push({path, sha256:hash, snapshotSha256:prior??null, matchesSnapshot:prior ? hash===prior:null});
}
const outputs=[];
for (const [path,prior] of Object.entries(fa01.builtHashes).filter(([path])=>path.startsWith('dist/foundation/tokens.generated.') || path==='dist/styles.css')) {
  const hash=sha(await readFile(`packages/ui/${path}`));
  outputs.push({path:`packages/ui/${path}`,sha256:hash,snapshotSha256:prior,matchesSnapshot:hash===prior});
}
const source=await read('packages/ui/src/foundation/tokens.json');
const groups=Object.fromEntries(Object.entries(source).map(([group,entries])=>[group,{count:Object.keys(entries).length,literals:Object.values(entries).filter(t=>!/^\{[^}]+\}$/.test(String(t.$value))).length,aliasTargets:Object.values(entries).reduce((acc,t)=>{const target=/^\{([^.]+)\./.exec(String(t.$value))?.[1];if(target)acc[target]=(acc[target]??0)+1;return acc;},{})}]));
const baseValues=Object.values(source.base).map(t=>JSON.stringify([t.$type,t.$value]));
const evidencePaths=['fa04-original-check.txt','fa04-retained-docs-build.txt','fa04-library-input-delta.json','fa04-package.txt','fa04-library.txt'];
const logs=[];
for(const path of evidencePaths) logs.push({path:`docs/developer/final-acceptance/${path}`,sha256:sha(await readFile(`docs/developer/final-acceptance/${path}`))});
const audit={schemaVersion:1,capturedAt:new Date().toISOString(),root,head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),branch:execFileSync('git',['branch','--show-current'],{encoding:'utf8'}).trim(),runtime:process.version,method:'Read-only targeted SHA-256 comparisons and JSON tier census; no compiler, build, test suite, browser, network or generated output mutation.',snapshots:{fa01:fa01.capturedAt,fa02:fa02.capturedAt},inputs,outputs,groups,baseLiteralDuplicates:baseValues.length-new Set(baseValues).size,logs};
await writeFile(owner+'input-reconciliation.json',JSON.stringify(audit,null,2)+'\n');
console.log(JSON.stringify({head:audit.head,inputs:inputs.length,inputMismatches:inputs.filter(x=>x.matchesSnapshot===false),outputs:outputs.length,outputMismatches:outputs.filter(x=>!x.matchesSnapshot),groups,baseLiteralDuplicates:audit.baseLiteralDuplicates},null,2));
