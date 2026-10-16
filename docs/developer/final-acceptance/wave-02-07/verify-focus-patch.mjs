import {createRequire} from 'node:module';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const require=createRequire(new URL('../../../../packages/ui/package.json',import.meta.url));
const postcss=require('postcss');
const root=new URL('../../../../',import.meta.url);
const sourceURL=new URL('packages/ui/src/experimental/TextField/TextField.module.css',root);
const source=await readFile(sourceURL,'utf8');
const patch=await readFile(new URL('proposed-focus-fallback.patch',import.meta.url),'utf8');
const old='  .decoratedControl > .input[data-focus-visible], .decoratedControl > .input:focus-visible { outline: none; }\n  .decoratedControl:has(.input[data-focus-visible]), .decoratedControl:has(.input:focus-visible) { outline: var(--sgui-control-focus-width) solid var(--sgui-text-field-focus-color); outline-offset: var(--sgui-control-focus-offset); }\n';
const replacement='  @supports selector(:has(*)) {\n    .decoratedControl > .input[data-focus-visible], .decoratedControl > .input:focus-visible { outline: none; }\n    .decoratedControl:has(.input[data-focus-visible]), .decoratedControl:has(.input:focus-visible) { outline: var(--sgui-control-focus-width) solid var(--sgui-text-field-focus-color); outline-offset: var(--sgui-control-focus-offset); }\n  }\n';
assert.equal(source.split(old).length,2,'Candidate source no longer matches patch input');
function inspect(css){
 const ast=postcss.parse(css);let suppression=0,guarded=0,baseline=0;
 ast.walkDecls('outline',d=>{
  if(d.value==='none'&&d.parent.selector?.includes('.decoratedControl > .input')){
   suppression++;for(let p=d.parent;p;p=p.parent)if(p.type==='atrule'&&p.name==='supports'&&p.params==='selector(:has(*))')guarded++;
  }
  if(d.value.includes('--sgui-text-field-focus-color')&&d.parent.selector==='.input[data-focus-visible], .input:focus-visible')baseline++;
 });
 return {suppressionRules:suppression,guardedSuppressionRules:guarded,baselineInputFocusRules:baseline};
}
const before=inspect(source),after=inspect(source.replace(old,replacement));
assert.equal(before.guardedSuppressionRules,0);
assert.equal(after.guardedSuppressionRules,1);
assert.equal(after.baselineInputFocusRules,1);
const hash=s=>createHash('sha256').update(s).digest('hex');
const result={status:'pass',runtime:process.version,sourcePath:sourceURL.pathname,sourceSha256:hash(source),patchSha256:hash(patch),before,after,limits:'CSS parse/guard structure only; in-memory candidate, never applied. No computed-style/cascade-engine/native focus/browser compatibility proof.'};
await writeFile(new URL('focus-patch-structure.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));
