import {readFile,readdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const out='docs/developer/final-acceptance/wave-02-08/';
const fa02=JSON.parse(await readFile('docs/developer/final-acceptance/2026-10-16-source-inventory.json','utf8'));
const fa01=JSON.parse(await readFile('docs/developer/final-acceptance/2026-10-16-inventory.json','utf8'));
const delta=JSON.parse(await readFile('docs/developer/final-acceptance/fa04-library-input-delta.json','utf8'));
const sha=b=>createHash('sha256').update(b).digest('hex');
const dirs=['i18n','hooks','foundation',...['Button','AppDataGrid','AppDataGridShell','CardPaginationFooter'].map(d=>'components/'+d),...['Box','Stack','Surface','Card','Divider','Typography','IconButton','ButtonGroup','SplitAction','TextField','TextArea','Checkbox','Switch','RadioGroup','Select','ComboBox','AsyncMultiSelect','Menu','Popover','Tooltip','Dialog','Tabs','Link','Breadcrumbs','DateField','Calendar','DateRangeSelector','TimeField','Provider'].map(d=>'experimental/'+d)].map(d=>'packages/ui/src/'+d);
const paths=new Set(['packages/ui/src/utils/formatDueDateLabel.ts','packages/ui/src/utils/formatDueDateLabel.test.ts','packages/ui/src/utils/relative-dates.ts','packages/ui/src/utils/relative-dates.test.ts','packages/ui/src/components/LearnerClassCard/formatDueDateLabel.ts','packages/ui/src/components/LearnerClassCard/formatDueDateLabel.test.ts','packages/ui/src/experimental/index.ts','packages/ui/src/primitives/index.ts','packages/ui/src/components/primitives/index.ts','packages/ui/src/adapters/Link.tsx','packages/ui/src/adapters/navigation.tsx','packages/ui/vitest.config.ts','packages/ui/scripts/vitest.setup.ts','packages/ui/package.json','pnpm-lock.yaml','apps/docs/content/component-usage/forms.json']);
async function visit(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const p=dir+'/'+entry.name;if(entry.isDirectory())await visit(p);else if(/\.(?:tsx?|css|mjs)$/.test(p))paths.add(p);}}
for(const dir of dirs)await visit(dir);
const docs=['react-aria-pagination-state.md','react-aria-catalog-grid.md','react-aria-due-date-acceptance.md','react-aria-calendar-contracts.md','react-aria-i18n-acceptance.md','react-aria-primitives.md','react-aria-layout-actions.md','react-aria-proof-controls.md','react-aria-button.md','react-aria-tabs-orientation.md','react-aria-remaining-controls.md','hierarchical-menu-scope.md','parallel-batch-108/acceptance-evidence.md','parallel-batch-110/acceptance-evidence.md','parallel-batch-05/due-date.md'];
for(const p of docs)paths.add('docs/developer/'+p);
const leafResults=JSON.parse(await readFile(out+'results.json','utf8'));
for(const leaf of leafResults.leaves)for(const p of [...leaf.sourceReferences,...leaf.testReferences])paths.add(p);
const files=[];
for(const path of [...paths].sort()){
 const bytes=await readFile(path), hash=sha(bytes), baseline=fa02.inputHashes[path]??fa01.sourceHashes[path]??null;
 const corrected=delta.changes.find(x=>x.file===path)?.after;
 files.push({path,sha256:hash,baselineSha256:baseline,matchesBaseline:baseline===null?null:baseline===hash,matchesFA04Delta:corrected?corrected===hash:null,kind:path.includes('.test.')?'test':path.endsWith('.md')?'documentation':'source/configuration',assertionTitles:path.includes('.test.')?[...bytes.toString().matchAll(/\b(?:it|test)\s*\(\s*["'`]([^"'`]+)["'`]/g)].map(m=>m[1]):undefined});
}
const historical=[];
for(const path of ['packages/ui/src/utils/formatDueDateLabel.ts','packages/ui/src/utils/formatDueDateLabel.test.ts','packages/ui/src/components/LearnerClassCard/formatDueDateLabel.ts','packages/ui/src/components/LearnerClassCard/formatDueDateLabel.test.ts']){
 const old=path.replace(/^packages\/ui\//,'');let bytes;
 try{bytes=execFileSync('git',['show',`4529de0ccefc11ebed799a8480477baf5e931324:${old}`]);}catch{continue;}
 historical.push({path,testedHead:'4529de0ccefc11ebed799a8480477baf5e931324',historicalSha256:sha(bytes),currentSha256:sha(await readFile(path)),same:sha(bytes)===sha(await readFile(path))});
}
const logs=[];for(const name of ['fa04-original-check.txt','fa04-calendar-rerun.txt','fa04-library-input-delta.json','fa04-package.txt','parallel-13/input-evidence.json','parallel-14/reconciliation.json','parallel-08/input-reconciliation.json']){const p='docs/developer/final-acceptance/'+name;logs.push({path:p,sha256:sha(await readFile(p))});}
const result={schemaVersion:1,capturedAt:new Date().toISOString(),head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),branch:execFileSync('git',['branch','--show-current'],{encoding:'utf8'}).trim(),runtime:process.version,method:'Targeted read-only input reconciliation and syntactic test-title index. No tests, compiler, build or server executed. Test titles index assertions; they are not new runtime results.',files,historical,logs};
await writeFile(out+'input-evidence.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({files:files.length,changed:files.filter(f=>f.matchesBaseline===false).map(f=>({path:f.path,fa04Correction:f.matchesFA04Delta})),withoutBaseline:files.filter(f=>f.matchesBaseline===null).map(f=>f.path),historical},null,2));
