// Pure read-only TypeScript AST inspection; writes only this assignment's receipt.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const own = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(own, '../../../..');
const require = createRequire(path.join(root, 'packages/ui/package.json'));
const ts = require('typescript');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const references = [], maps = [];
function walk(dir) {
 for (const item of fs.readdirSync(dir, {withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))) {
  const file=path.join(dir,item.name);
  if(item.isDirectory())walk(file);
  else if(file.endsWith('.js')||file.endsWith('.d.ts')) {
   const bytes=fs.readFileSync(file), sf=ts.createSourceFile(file,bytes.toString(),ts.ScriptTarget.Latest,true);
   function visit(n) {
    let spec;
    if(ts.isImportDeclaration(n)||ts.isExportDeclaration(n))spec=n.moduleSpecifier;
    else if(ts.isImportTypeNode(n)&&ts.isLiteralTypeNode(n.argument))spec=n.argument.literal;
    else if(ts.isCallExpression(n)&&n.expression.kind===ts.SyntaxKind.ImportKeyword)spec=n.arguments[0];
    if(spec&&ts.isStringLiteralLike(spec)&&!spec.text.startsWith('.'))references.push({file:path.relative(root,file),sha256:hash(bytes),line:sf.getLineAndCharacterOfPosition(spec.getStart(sf)).line+1,specifier:spec.text,kind:ts.SyntaxKind[n.kind]});
    ts.forEachChild(n,visit);
   }visit(sf);
  } else if(file.endsWith('.map')) {
   const bytes=fs.readFileSync(file),d=JSON.parse(bytes);
   maps.push({file:path.relative(root,file),sha256:hash(bytes),sources:d.sources,hasSourcesContent:!!d.sourcesContent?.length});
  }
 }
}
walk(path.join(root,'packages/ui/dist'));
const receipt={runtime:process.version,typescript:ts.version,scriptSha256:hash(fs.readFileSync(fileURLToPath(import.meta.url))),references,maps,limits:['Syntactic external import references and source map names; not executed dependency graph or proof of copied-code absence.','Library build is tsc per-file emit; no library JavaScript bundler runs in inspected build script. Host application bundles remain separate.']};
fs.writeFileSync(path.join(own,'output-ast.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({runtime:process.version,typescript:ts.version,externalReferences:references.length,externalPackages:[...new Set(references.map(r=>r.specifier.startsWith('@')?r.specifier.split('/').slice(0,2).join('/'):r.specifier.split('/')[0]))].sort(),maps:maps.length,embeddedSourceMaps:maps.filter(r=>r.hasSourcesContent).length},null,2));
