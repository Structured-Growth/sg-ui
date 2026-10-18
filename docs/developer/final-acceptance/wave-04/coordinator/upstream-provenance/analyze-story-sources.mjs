import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(new URL('../../../../../../packages/ui/package.json',import.meta.url));
const ts=require('typescript');
const directory=fileURLToPath(new URL('.',import.meta.url));
const input=JSON.parse(readFileSync(directory+'verified-story-sources.json','utf8'));
function inspect(source){
 const ast=ts.createSourceFile('story.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 if(ast.parseDiagnostics.length)throw Error('Story parse diagnostics');
 const result={namedExports:[],playProperties:0,assertionCalls:0,interactionImports:[]};
 const exported=node=>node.modifiers?.some(m=>m.kind===ts.SyntaxKind.ExportKeyword);
 const assertionNames=new Set(['expect','assert']);
 for(const statement of ast.statements)if(ts.isImportDeclaration(statement)&&statement.importClause?.namedBindings&&ts.isNamedImports(statement.importClause.namedBindings))for(const item of statement.importClause.namedBindings.elements)if(['expect','assert'].includes((item.propertyName??item.name).text))assertionNames.add(item.name.text);
 const rootName=expression=>ts.isIdentifier(expression)?expression.text:ts.isPropertyAccessExpression(expression)?rootName(expression.expression):undefined;
 function visit(node){
  if(ts.isVariableStatement(node)&&exported(node))for(const declaration of node.declarationList.declarations)if(ts.isIdentifier(declaration.name))result.namedExports.push(declaration.name.text);
  if(ts.isFunctionDeclaration(node)&&exported(node)&&node.name)result.namedExports.push(node.name.text);
  if((ts.isPropertyAssignment(node)||ts.isMethodDeclaration(node))&&node.name?.getText(ast).replace(/['"]/g,'')==='play')result.playProperties++;
  if(ts.isCallExpression(node)&&assertionNames.has(rootName(node.expression)))result.assertionCalls++;
  if(ts.isImportDeclaration(node)&&/storybook\/(?:test|testing-library)|testing-library|vitest/.test(node.moduleSpecifier.text))result.interactionImports.push(node.moduleSpecifier.text);
  ts.forEachChild(node,visit);
 }
 visit(ast);result.namedExports.sort();return result;
}
const stories=input.stories.map(row=>{
 const upstream=inspect(readFileSync(row.localArtifact,'utf8'));
 const local=inspect(execFileSync('git',['show','21adebd:'+row.initialLocalPath],{encoding:'utf8'}));
 return {source:row.source,upstreamBlob:row.upstreamBlob,upstreamSha256:row.sha256,upstreamUrl:row.upstreamUrl,initialLocalBlob:row.initialLocalBlob,bytesEqual:row.initialLocalBytesEqual,upstream,initialLocal:local,namedExportsEqual:JSON.stringify(upstream.namedExports)===JSON.stringify(local.namedExports)};
});
const output={scope:'Read-only original33 story sources versus initial local extraction at21adebd; AST source evidence, no runtime execution',stories,total:stories.length,exactBlobMatches:stories.filter(x=>x.bytesEqual).length,namedExportMatches:stories.filter(x=>x.namedExportsEqual).length,upstreamPlayProperties:stories.reduce((n,x)=>n+x.upstream.playProperties,0),upstreamAssertionCalls:stories.reduce((n,x)=>n+x.upstream.assertionCalls,0),limits:'Story declaration/assertion inventory is not behavioral equivalence of adapted implementations or upstream application runtime acceptance. Source data is never executed.'};
writeFileSync(directory+'story-source-comparison.json',JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({total:output.total,exactBlobMatches:output.exactBlobMatches,namedExportMatches:output.namedExportMatches,upstreamPlayProperties:output.upstreamPlayProperties,upstreamAssertionCalls:output.upstreamAssertionCalls}));
