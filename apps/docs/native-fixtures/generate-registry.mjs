import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
export function generateNativeRegistry() {
const dir=fileURLToPath(new URL('.',import.meta.url));const root=path.resolve(dir,'../../..');const manifest=JSON.parse(fs.readFileSync(dir+'/migration-manifest.json'));const entries={};
const slug=s=>s.replace(/([a-z0-9])([A-Z])/g,'$1-$2').replace(/([A-Z])([A-Z][a-z])/g,'$1-$2').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').toLowerCase();
function unwrap(node){while(ts.isSatisfiesExpression(node)||ts.isAsExpression(node)||ts.isParenthesizedExpression(node))node=node.expression;return node;}
for(const item of manifest.modules.filter(x=>x.scenarioModule)){
 const input=root+'/'+item.fixture,source=ts.createSourceFile(input,fs.readFileSync(input,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);let title,id;
 for(const node of source.statements)if(ts.isVariableStatement(node))for(const dec of node.declarationList.declarations)if(dec.name.getText(source)==='meta'&&dec.initializer){const meta=unwrap(dec.initializer);for(const prop of meta.properties??[]){if(ts.isPropertyAssignment(prop)&&prop.name.getText(source)==='title'&&ts.isStringLiteral(prop.initializer))title=prop.initializer.text;if(ts.isPropertyAssignment(prop)&&prop.name.getText(source)==='id'&&ts.isStringLiteral(prop.initializer))id=prop.initializer.text;}}
 if(!title)throw Error('No title '+input);
 for(const node of source.statements)if(ts.isVariableStatement(node)&&node.modifiers?.some(m=>m.kind===ts.SyntaxKind.ExportKeyword))for(const dec of node.declarationList.declarations){
  if(!dec.initializer||!ts.isObjectLiteralExpression(unwrap(dec.initializer)))continue;
  const name=dec.name.getText(source);let displayName=name;for(const prop of unwrap(dec.initializer).properties)if(ts.isPropertyAssignment(prop)&&prop.name.getText(source)==='name'&&ts.isStringLiteral(prop.initializer))displayName=prop.initializer.text;
  const fixtureID=(id??title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''))+'--'+slug(name);if(entries[fixtureID])throw Error('Duplicate '+fixtureID);
  entries[fixtureID]={id:fixtureID,type:'fixture',title,name:displayName,exportName:name,module:'./'+path.relative(dir,input).replaceAll('\\','/'),importPath:'./'+path.relative(dir,input).replaceAll('\\','/'),original:item.original};
 }
}
fs.writeFileSync(dir+'/registry.json',JSON.stringify({entries},null,2)+'\n');fs.mkdirSync(dir+'/public',{recursive:true});fs.writeFileSync(dir+'/public/index.json',JSON.stringify({v:1,entries},null,2)+'\n');console.log(Object.keys(entries).length+' fixture IDs');

return entries;
}
