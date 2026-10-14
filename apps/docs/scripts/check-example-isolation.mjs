import ts from 'typescript';
import {readdirSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'../examples');
export function validateExampleIsolation(text,file='example.tsx') {
 const owners=new Map();
 const source=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 function visit(node){const opening=ts.isJsxElement(node)?node.openingElement:ts.isJsxSelfClosingElement(node)?node:null;
 if(opening?.tagName.getText(source)==='Example'){
   let owner=node.parent;while(owner&&!ts.isFunctionLike(owner))owner=owner.parent;
   if(!owner)throw Error(`Example needs a component owner: ${file}`);
   if(ts.isFunctionDeclaration(owner)&&(!owner.name||!/^\s*[A-Z]/.test(owner.name.text)))throw Error(`Example needs a named React component owner: ${file}`);
   if(ts.isArrowFunction(owner)||ts.isFunctionExpression(owner)){
     if(!ts.isVariableDeclaration(owner.parent)||!/^\s*[A-Z]/.test(owner.parent.name.getText(source)))throw Error(`Move inline/mapped examples into their own component: ${file}`);
   }
   const key=`${file}:${owner.pos}`;owners.set(key,(owners.get(key)??0)+1);
   if(owners.get(key)>1)throw Error(`Each example block needs its own state owner: ${file}:${source.getLineAndCharacterOfPosition(owner.getStart(source)).line+1}`);
 }ts.forEachChild(node,visit);}visit(source);
 return owners.size;
}
let count=0;
function scan(path){for(const entry of readdirSync(path,{withFileTypes:true})){
 const file=resolve(path,entry.name);if(entry.isDirectory())scan(file);else if(file.endsWith('.tsx'))count+=validateExampleIsolation(readFileSync(file,'utf8'),file);
}}
scan(root);
console.log(`${count} example component owners pass the single-panel isolation guard`);
