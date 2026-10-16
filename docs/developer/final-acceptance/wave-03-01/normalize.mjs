// Reconcile saved records only. No build, export scan, runtime import, or shared write.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const out=dirname(fileURLToPath(import.meta.url)), root=resolve(out,'../../../..');
const read=p=>readFileSync(resolve(root,p),'utf8'), hash=s=>createHash('sha256').update(s).digest('hex');
const ts=createRequire(resolve(root,'packages/ui/package.json'))('typescript');
const base='docs/developer/final-acceptance/';
const snapshotPath=base+'parallel-01/api-snapshot.json', snapshot=JSON.parse(read(snapshotPath));
const index=JSON.parse(read(base+'wave-02-15/public-contract-index.json'));
const coordinator=JSON.parse(read(base+'coordinator-integration/evidence.json'));
const write=(p,d)=>writeFileSync(resolve(out,p),JSON.stringify(d,null,2)+'\n');
const sourceReceipt=Object.fromEntries(Object.entries(snapshot.sources).map(([p,s])=>[p,{snapshot:s.sha256,current:existsSync(resolve(root,p))?hash(read(p)):null}]));
const declarations=Object.entries(snapshot.declarations).map(([p,s])=>({file:p,snapshot:s.sha256,current:existsSync(resolve(root,p))?hash(read(p)):null}));
const publicNames=new Set(Object.values(snapshot.contracts).map(c=>c.name));
const asts=new Map();
function load(p){if(asts.has(p))return asts.get(p);const sf=ts.createSourceFile(p,read(p),ts.ScriptTarget.Latest,true,p.endsWith('tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);const candidates=[];function walk(n){let row;
 if((ts.isBindingElement(n)||ts.isParameter(n)||ts.isPropertyDeclaration(n))&&n.initializer)row={kind:ts.SyntaxKind[n.kind],name:n.name.getText(sf),expression:n.initializer.getText(sf)};
 if(ts.isBinaryExpression(n)&&n.operatorToken.kind===ts.SyntaxKind.QuestionQuestionToken)row={kind:'NullishFallback',name:n.left.getText(sf),expression:n.right.getText(sf)};
 if(row)candidates.push({...row,node:n,line:sf.getLineAndCharacterOfPosition(n.getStart()).line+1});ts.forEachChild(n,walk);};walk(sf);const result={sf,candidates};asts.set(p,result);return result;}
function enclosing(n){for(let p=n.parent;p;p=p.parent){if(ts.isFunctionLike(p)){let name=p.name?.getText();if(!name){for(let q=p.parent;q&&!ts.isSourceFile(q);q=q.parent){if(ts.isVariableDeclaration(q)){name=q.name.getText();break;}}}return {node:p,name:name??'<callback>'};}}return {name:'<module>'};}
const seen=new Map();
const defaults=snapshot.defaultCandidates.map((c,i)=>{const matches=load(c.file).candidates.filter(n=>n.kind===c.kind&&n.name===c.name&&n.expression===c.expression);const key=JSON.stringify([c.file,c.kind,c.name,c.expression]), used=seen.get(key)??0;seen.set(key,used+1);const match=matches[used];
 if(!match)return {id:`D${String(i+1).padStart(3,'0')}`,...c,classification:'changed-or-removed-candidate',publicDefault:false,residual:'Review current source; do not reuse saved expression as current contract.'};
 const owner=enclosing(match.node);let param=match.node;while(param&&!ts.isParameter(param)&&param!==owner.node)param=param.parent;
 const parameterPosition=!!param&&ts.isParameter(param);
 const exported=publicNames.has(owner.name);
 let classification=c.kind==='NullishFallback'?'derived-fallback-requires-dataflow':parameterPosition?(exported?'public-parameter-default':'implementation-parameter-default'):'local-binding-default';
 const rationale=classification==='public-parameter-default'?'Direct initializer on a saved public function/component parameter. Applies to undefined, not explicit null.':classification==='implementation-parameter-default'?'Helper parameter, private renderer or wrapper implementation; not independently promised as a public prop default.':classification==='local-binding-default'?'Local destructuring/state preparation, not an exported parameter initializer.':'Nullish expression handles both null and undefined; can encode rendering, validation, storage, translation or processing fallback. Not automatically an optional-prop default.';
 return {id:`D${String(i+1).padStart(3,'0')}`,...c,currentLine:match.line,owner:owner.name,classification,publicDefault:classification==='public-parameter-default',rationale,sourceUnchanged:sourceReceipt[c.file].snapshot===sourceReceipt[c.file].current};
});
const reviewed=JSON.parse(read(base+'wave-03-01/reviewed-dispositions.json'));
for(const d of defaults){const r=reviewed[d.id];if(r){d.structuralClassification=d.classification;d.classification=r.classification;d.publicOwner=r.publicOwner;d.reviewedDisposition=r.reason;d.publicDefault=['public-composed-default','shared-icon-default'].includes(r.classification);}}
const symbolRows=index.contracts.map(row=>{const c=snapshot.contracts[row.contractId];const candidates=defaults.filter(d=>row.sourceCandidates.includes(d.file));const own=c.ownedProperties;
 const policy=own.filter(p=>/^(variant|size|tone|density|placement|orientation|entryMode|kind|invalid|required|disabled|readOnly|dismissOnOutside|dismissOnEscape|showCloseButton|disableEscapeKeyDown|disableBackdropClose|onDismiss|onClose|errorMessage|onValidityChange)$/.test(p.name));
 const direct=candidates.filter(d=>d.publicDefault&&(d.owner===c.name||d.owner===c.name.replace(/Props$/,'')||d.publicOwner===c.name||d.publicOwner===c.name.replace(/Props$/,'')));
 const icon=/\/icons\/[^/]*Icon\.d\.ts/.test(c.declarations[0]?.file??'');
 const typeOnly=!c.signatures.length&&!/ForwardRefExoticComponent/.test(c.type);
 return {contractId:row.contractId,name:c.name,routes:row.routes,sourceCandidates:row.sourceCandidates,directParameterDefaults:direct.map(d=>({candidate:d.id,name:d.name,expression:d.expression})),policyProperties:policy,
 runtimeDefaultAuthority:icon?'shared-icon-factory':typeOnly?'no-independent-callable-runtime-default':direct.length?'direct-parameter-plus-context-or-composition':'context-or-composition-review',
 sharedEvidence:icon?'packages/ui/src/experimental/icons/createVector.tsx':null,
 candidateReferences:candidates.map(d=>d.id),residual:typeOnly?'Type/model/constant contract. Optional properties do not themselves establish a runtime default.':icon?'Factory defaults documented separately; callback helper icons and aliases retain separate route/type identities.':'Direct initializers are normalized; context/CSS/local-state/private-composition semantic review remains bounded by family-policy.md. Do not infer no default from absent initializer.'};
});
const counts={};for(const d of defaults)counts[d.classification]=(counts[d.classification]??0)+1;
write('normalized-defaults.json',{snapshot:snapshotPath,snapshotSha256:hash(read(snapshotPath)),scope:'Disposition of every saved candidate; no new inventory. Structural classification is not exhaustive public semantic/default acceptance.',counts,records:defaults});
write('normalized-contracts.json',{scope:'All saved contract/alias routes with owned policy properties and direct parameter defaults. No regenerated export inventory.',count:symbolRows.length,contracts:symbolRows});
const inputs=[snapshotPath,base+'wave-02-15/report.md',base+'wave-02-15/results.json',base+'wave-02-14/report.md',base+'wave-02-14/results.json',base+'coordinator-integration/evidence.json'];
write('input-comparison.json',{runtime:process.version,typescript:ts.version,snapshotSha256:hash(read(snapshotPath)),reusedInputs:Object.fromEntries(inputs.map(p=>[p,hash(read(p))])),sourceInputs:sourceReceipt,sourceDeltas:Object.entries(sourceReceipt).filter(([,v])=>v.snapshot!==v.current),declarationInputs:declarations,declarationDeltas:declarations.filter(v=>v.snapshot!==v.current),coordinatorInputComparison:Object.entries(coordinator.inputHashes).map(([p,h])=>({file:p,coordinator:h,current:existsSync(resolve(root,p))?hash(read(p)):null})),limits:['Hashes reconcile saved input paths, not a fresh export/dependency/source inventory.','Fresh coordinator output records are reused only by exact file hash; source/built equivalence is not assumed.','No runtime, native/browser/device/AT or release validation.']});
console.log(JSON.stringify({contracts:symbolRows.length,candidates:defaults.length,counts,sourceDeltas:Object.values(sourceReceipt).filter(x=>x.snapshot!==x.current).length,declarationDeltas:declarations.filter(x=>x.snapshot!==x.current).length,runtime:process.version}));
