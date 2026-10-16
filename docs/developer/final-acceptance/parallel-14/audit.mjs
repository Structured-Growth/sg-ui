import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
const root=process.cwd(), out='docs/developer/final-acceptance/parallel-14';
const ts=createRequire(path.join(root,'packages/ui/package.json'))('typescript');
const snapshot=JSON.parse(fs.readFileSync('docs/developer/final-acceptance/2026-10-16-source-inventory.json'));
const files=execFileSync('rg',['--files','packages/ui/src'],{encoding:'utf8'}).trim().split('\n').filter(f=>/\.tsx?$/.test(f)&&!/(\.test\.|\.native-fixture|\.stories\.|\.d\.ts$)/.test(f));
const calls=[], hashes={}, defaults=new Map();
for(const file of files){
 const text=fs.readFileSync(file,'utf8');
 const sha256=crypto.createHash('sha256').update(text).digest('hex');
 hashes[file]={sha256,fa02:snapshot.inputHashes[file]??null,unchangedFromFA02:snapshot.inputHashes[file]===sha256};
 const sf=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true,file.endsWith('tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
 function visit(n){
 if(ts.isCallExpression(n)&&((ts.isIdentifier(n.expression)&&n.expression.text==='t')||(ts.isPropertyAccessExpression(n.expression)&&n.expression.name.text==='t'))){
 const key=n.arguments[0], options=n.arguments[1];
 const props=options&&ts.isObjectLiteralExpression(options)?options.properties:[];
 const prop=name=>props.find(p=>(ts.isPropertyAssignment(p)||ts.isShorthandPropertyAssignment(p))&&p.name.getText(sf).replace(/['"]/g,'')===name);
 const d=prop('defaultMessage'), v=prop('values');
 const record={file,line:sf.getLineAndCharacterOfPosition(n.getStart(sf)).line+1,callee:n.expression.getText(sf),key:key?.getText(sf),literalKey:key&&ts.isStringLiteralLike(key)?key.text:null,options:options?.getText(sf),hasDefaultMessage:!!d,valuesKeys:v&&ts.isPropertyAssignment(v)&&ts.isObjectLiteralExpression(v.initializer)?v.initializer.properties.map(p=>p.name?.getText(sf).replace(/['"]/g,'')):null,defaultLiteral:d&&ts.isPropertyAssignment(d)&&ts.isStringLiteralLike(d.initializer)?d.initializer.text:null};
 calls.push(record);
 if(record.literalKey&&record.defaultLiteral!==null){const list=defaults.get(record.literalKey)??[];list.push(record);defaults.set(record.literalKey,list);}
 }
 ts.forEachChild(n,visit);
 } visit(sf);
}
const collisions=[...defaults].filter(([,list])=>new Set(list.map(r=>r.defaultLiteral)).size>1).map(([key,uses])=>({key,uses}));
const evidence={capturedAt:new Date().toISOString(),head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),node:process.version,scope:'Syntactic t / .t call inventory; excludes tests/native fixtures/declarations. Not symbol/dataflow or all library-owned string coverage. Local due-label t uses an intentionally different signature. Dynamic/spread options require manual review.',fileCount:files.length,calls,callsWithoutObjectDefault:calls.filter(c=>!c.hasDefaultMessage),literalDefaultCollisions:collisions,hashes};
fs.writeFileSync(path.join(out,'source-audit.json'),JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({files:files.length,calls:calls.length,withoutObjectDefault:evidence.callsWithoutObjectDefault,collisions},null,2));
