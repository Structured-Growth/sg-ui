import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {readFile,writeFile} from 'node:fs/promises';
import {dirname,resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const args=process.argv.slice(2),option=k=>{const i=args.indexOf(k);return i<0?undefined:args[i+1]};
assert(option('--inventory')&&option('--repo')&&option('--output'),'--inventory public-contracts.json --repo repository-root --output new-receipt.json');
const repo=resolve(option('--repo')),here=dirname(fileURLToPath(import.meta.url));
const req=createRequire(join(repo,'packages/ui/package.json')),ts=req('typescript');
const hash=b=>createHash('sha256').update(b).digest('hex');
const mapBytes=await readFile(option('--map')||join(here,'public-migration-map.json'));
const ledger=JSON.parse(mapBytes);
const sourceRef=option('--source-ref')?execFileSync('git',['rev-parse','--verify',option('--source-ref')+'^{commit}'],{cwd:repo,encoding:'utf8'}).trim():null;
const bytes=await readFile(option('--inventory')),inventory=JSON.parse(bytes);
const baselineBytes=await readFile(resolve(repo,ledger.baseline.path));assert.equal(hash(baselineBytes),ledger.baseline.sha256,'Baseline symbol receipt changed');
const baseline=JSON.parse(baselineBytes),names=new Set(Object.values(inventory.routes).flat().map(r=>r.name));
const checks=[];
for(const row of baseline.baselineNames){if(names.has(row.name))continue;const mapping=ledger.removals.find(r=>r.name===row.name);assert(mapping,'Unmapped removed baseline name: '+row.name);assert(mapping.requiredReplacementExports.every(n=>names.has(n)),'Missing replacement export for '+row.name);const guide=await readFile(resolve(repo,mapping.guide));checks.push({kind:'removed-name',name:row.name,replacements:mapping.requiredReplacementExports,guide:mapping.guide,guideSha256:hash(guide),passed:true});}
for(const row of ledger.defaults){
 const content=sourceRef?execFileSync('git',['show',sourceRef+':'+row.source],{cwd:repo,encoding:'utf8'}):await readFile(resolve(repo,row.source),'utf8');assert.equal(hash(content),row.sourceSha256,'Runtime source changed: '+row.source);
 const source=ts.createSourceFile(row.source,content,ts.ScriptTarget.Latest,true),matches=[];
 function visit(node){if(ts.isBindingElement(node)&&node.name.getText(source)===row.prop&&node.initializer){let owner=node.parent;while(owner&&!ts.isFunctionLike(owner))owner=owner.parent;if(!row.sourceOwner||owner?.name?.getText(source)===row.sourceOwner)matches.push(node.initializer.getText(source));}ts.forEachChild(node,visit);}visit(source);
 assert(matches.includes(row.after),'Runtime default no longer matches '+row.component+'.'+row.prop);
 const contract=Object.values(inventory.contracts).find(c=>c.aliases.some(a=>a.name===row.component));assert(contract,'Missing component '+row.component);
 assert(contract.parameters.some(ps=>ps.some(p=>p.properties.some(v=>v.name===row.prop))),'Prop absent from public declaration '+row.prop);
 const guide=await readFile(resolve(repo,row.guide));
 checks.push({kind:'changed-default',...row,matchedSourceInitializers:matches,guideSha256:hash(guide),passed:true});
}
const receipt={inventorySha256:hash(bytes),mapSha256:hash(mapBytes),sourceMode:sourceRef?'git-commit':'working-tree',sourceRef,compiler:ts.version,checks,passed:true,limits:ledger.limits};
await writeFile(resolve(option('--output')),JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({passed:true,removedNames:checks.filter(c=>c.kind==='removed-name').length,changedDefaults:checks.filter(c=>c.kind==='changed-default').length}));
