import { createRequire } from 'node:module';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const owner=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const root=resolve(owner,'../../../..');
const require=createRequire(resolve(root,'packages/ui/package.json'));
const postcss=require('postcss');
const ts=require('typescript');
const read=p=>readFileSync(resolve(root,p),'utf8');
const base=readFileSync(resolve(owner,'before-files/packages/ui/src/components/Button/Button.module.css'),'utf8');
const candidate=readFileSync(resolve(owner,'proposed-files/packages/ui/src/components/Button/Button.module.css'),'utf8');
// Bounded authored-selector cascade probe. It excludes @media, all pseudo selectors,
// and anything beyond simple root/data selectors: not a browser CSS implementation.
function background(css,attrs) {
 let value, winning=-1;
 postcss.parse(css).walkRules(rule=>{
  for(let p=rule.parent;p;p=p.parent)if(p.type==='atrule'&&p.name!=='layer')return;
  for(const selector of rule.selectors){
   if(!/^\.root(?:\[data-[\w-]+(?:="[\w-]+")?\])*$/.test(selector))continue;
   const selectors=[...selector.matchAll(/\[(data-[\w-]+)(?:="([\w-]+)")?\]/g)];
   if(!selectors.every(([,key,v])=>key in attrs&&(v===undefined||attrs[key]===v)))continue;
   const specificity=1+selectors.length;
   if(specificity<winning)continue;
   rule.walkDecls('background',d=>{value=d.value;winning=specificity;});
  }
 });return value;
}
const neutral={ 'data-tone':'neutral','data-variant':'filled','data-pressed':'' };
assert.equal(background(base,neutral),'var(--sgui-button-neutral-surface)');
assert.equal(background(candidate,neutral),'var(--sgui-button-subtle-interaction-background)');
for(const tone of ['primary','neutral'])for(const variant of ['filled','outlined','text']){
 const common={'data-tone':tone,'data-variant':variant};
 assert.equal(background(candidate,{...common,'data-pressed':''}),background(candidate,{...common,'data-hovered':''}));
 if(tone!=='neutral'||variant!=='filled')assert.equal(background(candidate,{...common,'data-pressed':''}),background(base,{...common,'data-pressed':''}));
 assert.equal(background(candidate,common),background(base,common));
}
console.log('PASS: original neutral-filled keyboard-only press resolves to rest; candidate resolves to subtle interaction. Six tone/variant pairs preserve hover/press parity and unchanged rest.');
const matrix=JSON.parse(readFileSync(resolve(owner,'state-matrix.json'),'utf8'));
const catalog=JSON.parse(read('apps/docs/content/component-api.json'));
const expected=Object.values(catalog).flatMap(es=>es.flatMap(e=>e.names)).sort();
assert.deepEqual(matrix.rows.map(r=>r.name).sort(),expected);
assert.equal(new Set(matrix.rows.map(r=>r.name)).size,matrix.rows.length);
for(const row of matrix.rows){
 assert.deepEqual(Object.keys(row.states),matrix.states);
 assert.ok(row.source.length,row.name+' missing source');
 for(const p of [...row.source,...row.referenceTests])assert.ok(existsSync(resolve(root,p)),p);
 for(const state of Object.values(row.states))assert.ok(state.design.length>20);
}
console.log(`PASS: ${matrix.rows.length} named catalog exports, aliases and compound parts each have all eleven state decisions and existing source/test references.`);
const srcPath=resolve(owner,'proposed-files/apps/docs/tests/button-neutral-pressed.spec.ts');
for(const p of [srcPath,resolve(owner,'checks/playwright.config.ts')]){
 const result=ts.transpileModule(readFileSync(p,'utf8'),{fileName:p,reportDiagnostics:true,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}});
 assert.deepEqual(result.diagnostics?.filter(d=>d.category===ts.DiagnosticCategory.Error),[]);
}
console.log('PASS: prepared native spec/config TypeScript syntax transpiles; native execution remains unperformed.');
for(const file of ['docs/developer/react-aria-theme.md','docs/developer/react-aria-foundation-scales.md','docs/developer/react-aria-state-applicability.md','docs/developer/react-aria-layout-actions.md']){
 const path=resolve(owner,'proposed-files',file);
 for(const [,link] of readFileSync(path,'utf8').matchAll(/\]\(([^)]+)\)/g)){
  if(link.startsWith('/docs/components/')){assert.ok(catalog[link.split('/').at(-1)],link);continue;}
  const target=relative(root,resolve(root,dirname(file),link.split('#')[0]));
  assert.ok(existsSync(resolve(root,target))||existsSync(resolve(owner,'proposed-files',target)),link);
 }
}
const usage=JSON.parse(readFileSync(resolve(owner,'proposed-files/apps/docs/content/component-usage/presentation.json'),'utf8'));
assert.ok(usage.button.how.some(s=>s.includes('one dominant confirmation')&&s.includes('SplitAction')));
console.log('PASS: proposed documentation links and Button usage JSON/emphasis guidance.');
console.log(`Runtime: ${process.version}; platform ${process.platform}/${process.arch}. Source/design validation only; no native, AT or device claims.`);
