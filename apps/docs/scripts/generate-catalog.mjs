import {generateAPI} from './component-api.mjs';
import {generateComposition} from './component-composition.mjs';
import ts from 'typescript';
import {readFileSync,writeFileSync} from 'node:fs';
const entries=[{slug:'button',title:'AppButton',description:'Variants, tones, density, disabled and pending actions.',exports:['AppButton'],group:'presentation'},{slug:'dialog',title:'AppModal',description:'Dialog sizes, dismissal options and host-owned forms.',exports:['AppModal'],group:'editor'}];
for(const [file,group] of [['primitives-actions','presentation'],['forms-dates','forms'],['catalog-editor','editor'],['catalog-data','data']]) {
 const source=ts.createSourceFile(file,readFileSync(new URL(`../examples/catalog/${file}.tsx`,import.meta.url),'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 function visit(node){if(ts.isObjectLiteralExpression(node)) {const props=new Map(node.properties.filter(ts.isPropertyAssignment).map(p=>[p.name.getText(source).replaceAll('"','').replaceAll("'",''),p.initializer]));if(props.has('Playground')&&props.has('slug')) {const entry={group};for(const key of ['slug','title','description']) {const value=props.get(key);if(!value||!ts.isStringLiteral(value))throw Error(`${file}: literal ${key} required`);entry[key]=value.text;}if(props.has('exampleTitle')) {const title=props.get('exampleTitle');if(!ts.isStringLiteral(title))throw Error('Literal example title required');entry.exampleTitle=title.text;}const exports=props.get('exports');if(!exports||!ts.isArrayLiteralExpression(exports))throw Error('Literal exports required');entry.exports=exports.elements.map(x=>{if(!ts.isStringLiteral(x))throw Error('Literal export required');return x.text;});entries.push(entry);}}ts.forEachChild(node,visit);}visit(source);
}
if(new Set(entries.map(e=>e.slug)).size!==entries.length)throw Error('Duplicate catalog routes');
writeFileSync(new URL('../content/catalog.json',import.meta.url),JSON.stringify(entries,null,2)+'\n');
console.log(`${entries.length} catalog pages generated`);

generateComposition(entries);

generateAPI(entries);
