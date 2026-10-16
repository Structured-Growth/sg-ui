import { readFileSync, readdirSync, realpathSync, statSync, existsSync, writeFileSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { createHash } from 'node:crypto';
const root=process.cwd(),ui=resolve(root,'packages/ui'),owned=resolve(root,'docs/developer/final-acceptance/wave-03-05');
const hashes={}, nodes=new Map();
function manifest(path) {const b=readFileSync(path);hashes[relative(root,path)]=createHash('sha256').update(b).digest('hex');return JSON.parse(b);}
function find(name,from) {let d=from;while(true){const p=resolve(d,'node_modules',name);if(existsSync(resolve(p,'package.json')))return realpathSync(p);const up=dirname(d);if(up===d)throw Error('Missing '+name+' from '+from);d=up;}}
function size(dir){let bytes=0,files=0;for(const e of readdirSync(dir,{withFileTypes:true})){if(e.name==='node_modules')continue;const p=resolve(dir,e.name);if(e.isDirectory()){const s=size(p);bytes+=s.bytes;files+=s.files;}else if(e.isFile()){bytes+=statSync(p).size;files++;}}return {bytes,files};}
function visit(path){if(nodes.has(path))return;const p=manifest(resolve(path,'package.json'));const n={name:p.name,version:p.version,...size(path),dependencies:[]};nodes.set(path,n);for(const name of Object.keys({...p.dependencies,...p.optionalDependencies})){try{const target=find(name,path);n.dependencies.push(target);visit(target);}catch(e){if(!p.optionalDependencies?.[name])throw e;}}}
const p=manifest(resolve(ui,'package.json'));const editor=Object.keys(p.dependencies).filter(n=>n==='lexical'||n.startsWith('@lexical/'));const other=Object.keys(p.dependencies).filter(n=>!editor.includes(n));
function closure(names){const seen=new Set();function walk(path){if(seen.has(path))return;visit(path);seen.add(path);for(const child of nodes.get(path).dependencies)walk(child);}for(const name of names)walk(find(name,ui));return seen;}
const all=closure(Object.keys(p.dependencies)),core=closure(other),ed=closure(editor),unique=[...ed].filter(x=>!core.has(x));
function summary(paths){return {packages:paths.length,bytes:paths.reduce((n,p)=>n+nodes.get(p).bytes,0),files:paths.reduce((n,p)=>n+nodes.get(p).files,0),identities:paths.map(p=>nodes.get(p).name+'@'+nodes.get(p).version).sort()};}
const result={runtime:process.version,method:'Logical installed regular-file sizes per resolved runtime dependency closure; node_modules and peers excluded, optional dependencies included when present. Not tarball/network/download or fresh install measurement. No peer traversal.',directEditorDependencies:editor,all:summary([...all]),withoutEditorDirectDependencies:summary([...core]),editorClosure:summary([...ed]),editorExclusive:summary(unique),nodes:[...nodes].map(([path,v])=>({path:relative(root,path),...v,dependencies:v.dependencies.map(p=>relative(root,p))})),hashes};
writeFileSync(resolve(owned,'install-footprint.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({all:result.all,editorExclusive:result.editorExclusive},null,2));
