import {createRequire} from 'node:module';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const require=createRequire(new URL('../../../../packages/ui/package.json',import.meta.url));
const postcss=require('postcss'),modules=require('postcss-modules');
const repo=new URL('../../../../',import.meta.url),own=new URL('./',import.meta.url);
const read=p=>readFile(new URL(p,repo),'utf8');
const candidate=p=>readFile(new URL('proposed-files/'+p,own),'utf8');
const base='packages/ui/src/experimental/';
const before=postcss.parse(await read(base+'TextField/TextField.module.css'));
const after=postcss.parse(await candidate(base+'TextField/TextField.module.css'));
function unsupportedHasSuppressions(ast) {
 const result=[];
 ast.walkDecls('outline',d=>{ if(d.value!=='none') return;
 let guarded=false;for(let a=d.parent;a;a=a.parent)if(a.type==='atrule'&&a.name==='supports'&&a.params.includes(':has('))guarded=true;
 if(!guarded&&!d.parent.selector.includes(':has('))result.push(d.parent.selector);
 });return result;
}
assert.equal(unsupportedHasSuppressions(before).length,1,'reproduce original suppression gap before using prior patch');
assert.equal(unsupportedHasSuppressions(after).length,0);
assert(after.toString().includes('.input[data-focus-visible], .input:focus-visible { outline: var('));
const grid=postcss.parse(await candidate('packages/ui/src/components/AppDataGridShell/AppDataGridShell.module.css'));
assert(grid.nodes[0].nodes.find(n=>n.selector==='.content:focus').nodes.some(d=>d.prop==='outline'&&d.value.includes('--sgui-control-focus-color')));
const pop=postcss.parse(await candidate(base+'Popover/Popover.module.css'));
let important=0;pop.walkDecls(d=>{if(d.important){important++;assert(['position','inset','max-block-size'].includes(d.prop));}});
assert.equal(important,12); // Nine geometry roles; three vh/dvh fallback pairs add declarations.
const dialog=await candidate(base+'Dialog/Dialog.module.css');assert(dialog.includes('.modal[data-size="full"] { block-size: 100vh; max-block-size: 100vh; }'));
// Run installed production PostCSS Modules transform without touching dist.
const {scopedName}=await import(new URL('packages/ui/scripts/css-modules.mjs',repo));
let classes;
const css=await candidate(base+'TextField/TextField.module.css');
const nested=css.replace('  .adornment > svg { inline-size: 100%; block-size: 100%; }','  .adornment { & > svg { inline-size: 100%; block-size: 100%; } }');
const output=await postcss([modules({generateScopedName:scopedName,getJSON:(_f,c)=>classes=c})]).process(nested,{from:new URL(base+'TextField/TextField.module.css',repo).pathname,map:false});
assert(output.css.includes('& > svg'));assert(output.css.includes('.'+classes.adornment));
assert(!output.css.includes('.adornment > svg'));
const result={runtime:process.version,status:'pass',assertions:['Original unsupported-has outline suppression reproduced by AST/cascade premise','Candidate guards suppression and retains independent input ring','Empty-grid wrapper has inset token focus outline','Only position/inset/block-cap important exceptions remain; vh precedes dvh','XL/full dialog fallback explicit','Installed production PostCSS Modules keeps native nesting and scopes owner'],importantDeclarations:important,outputSha256:createHash('sha256').update(output.css).digest('hex'),limits:'Pure Node/PostCSS structural checks. No browser CSS parsing, computed focus, native geometry, supported Node matrix or minimum browser-version proof.'};
await writeFile(new URL('structural-results.json',own),JSON.stringify(result,null,2)+'\n');
await writeFile(new URL('nesting-compiled.css',own),output.css);console.log(JSON.stringify(result,null,2));
