import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scopedName } from './css-modules.mjs';
import { resolve } from 'node:path';
import postcss from 'postcss';
import modules from 'postcss-modules';

test('module names are stable, namespaced and distinct between components', async () => {
  const a = resolve('src/components/Button/Button.module.css');
  const b = resolve('src/experimental/TextField/TextField.module.css');
  assert.equal(scopedName('root', a), scopedName('root', a));
  assert.notEqual(scopedName('root', a), scopedName('root', b));
  let classes;
  const result = await postcss([modules({ generateScopedName: scopedName, getJSON: (_file, value) => { classes = value; } })])
    .process('@layer sgui.components { .root { color: red; } }', { from: a, map: false });
  assert.equal(classes.root, scopedName('root', a));
  assert(result.css.includes(`.${classes.root}`));
  assert(result.css.includes('@layer sgui.components'));
});


test('shallow native nesting retains scoped parent/child and an equivalent flat baseline', async () => {
  let classes;
  const result = await postcss([modules({ generateScopedName: scopedName, getJSON: (_file, value) => { classes = value; } })])
    .process('@layer sgui.components { .adornment > svg { inline-size: 100%; block-size: 100%; } .adornment { & > svg { inline-size: 100%; block-size: 100%; } } .owner { & > .child { display: block; } } }', { from: resolve('src/experimental/TextField/TextField.module.css'), map: false });
  const ast = postcss.parse(result.css);
  const found = new Map();
  ast.walkRules(rule => found.set(rule.selector, rule));
  assert(found.has(`.${classes.adornment} > svg`));
  const nested = found.get('& > svg');
  assert.equal(nested.parent.selector, `.${classes.adornment}`);
  const declarations = rule => rule.nodes.filter(node => node.type === 'decl').map(node => [node.prop, node.value]);
  assert.deepEqual(declarations(nested), declarations(found.get(`.${classes.adornment} > svg`)));
  assert(found.has(`& > .${classes.child}`));
});

test('diamond compositions emit dependencies first regardless of filesystem timing',async()=>{
 const {mkdtemp,writeFile,rm}=await import('node:fs/promises');const {tmpdir}=await import('node:os');const {join}=await import('node:path');
 const {DeterministicCSSLoader}=await import('./deterministic-css-loader.mjs');
 const root=await mkdtemp(join(tmpdir(),'sgui-css-diamond-'));
 try{
  await writeFile(join(root,'Shared.module.css'),'.shared { color: red; }');
  await writeFile(join(root,'Middle.module.css'),'.choice { composes: shared from "./Shared.module.css"; color: blue; }');
  const source='.a { composes: choice from "./Middle.module.css"; } .b { composes: shared from "./Shared.module.css"; }';
  const outputs=[];
  for(const delayed of ['Middle.module.css','Shared.module.css']){
   class DelayedLoader extends DeterministicCSSLoader {constructor(...args){super(...args);const fs=this.fs;this.fs={...fs,readFile:(path,encoding,callback)=>{setTimeout(()=>fs.readFile(path,encoding,callback),path.endsWith(delayed)?25:0);}};}}
   let classes;const result=await postcss([modules({Loader:DelayedLoader,generateScopedName:scopedName,getJSON:(_file,value)=>{classes=value;}})]).process(source,{from:join(root,'Entry.module.css'),map:false});
   assert(result.css.indexOf('color: red')<result.css.indexOf('color: blue'),'Shared dependency must precede its consumer');
   outputs.push({css:result.css,classes});
  }
  assert.deepEqual(outputs[0],outputs[1]);
 }finally{await rm(root,{recursive:true,force:true});}
});
