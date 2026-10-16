// Read-only, bounded source graph audit; writes only this owned evidence directory.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const cp = require('node:child_process');
const root = cp.execFileSync('git', ['rev-parse', '--show-toplevel'], {encoding:'utf8'}).trim();
const ts = require(path.join(root, 'packages/ui/node_modules/typescript'));
const out = path.join(root, 'docs/developer/final-acceptance/parallel-02');
const saved = JSON.parse(fs.readFileSync(path.join(root, 'docs/developer/final-acceptance/2026-10-16-source-inventory.json')));
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const tracked = cp.execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], {cwd:root,encoding:'utf8'}).split('\0');
const production = f => f.startsWith('packages/ui/src/') && /\.[cm]?[jt]sx?$/.test(f) && !/(?:\.test\.|\.native-fixture|\.stories\.|\.fixture\.)/.test(f);
const files = [...new Set(tracked.filter(production))].filter(f => fs.existsSync(path.join(root,f))).sort();
const inputHashes = {}, delta = [], edges = [], computed = [], unresolved = [];
const options = {moduleResolution:ts.ModuleResolutionKind.Bundler, module:ts.ModuleKind.ESNext, resolveJsonModule:true, jsx:ts.JsxEmit.ReactJSX};
for (const file of files) {
  const bytes = fs.readFileSync(path.join(root,file)); inputHashes[file] = hash(bytes);
  if (saved.inputHashes[file] !== inputHashes[file]) delta.push({file,previous:saved.inputHashes[file] ?? null,current:inputHashes[file]});
  // Reuse saved reference inventory; AST adds named-type-only information absent from FA-02.
  const source = ts.createSourceFile(file,bytes.toString(),ts.ScriptTarget.Latest,true);
  const typeAt = new Map();
  function visit(n) {
    let typeOnly = false;
    if (ts.isImportDeclaration(n)) {
      const c=n.importClause;
      typeOnly=!!c && (c.isTypeOnly || (!c.name && c.namedBindings && ts.isNamedImports(c.namedBindings) && c.namedBindings.elements.length>0 && c.namedBindings.elements.every(e=>e.isTypeOnly)));
    } else if (ts.isExportDeclaration(n)) typeOnly=n.isTypeOnly || !!(n.exportClause && ts.isNamedExports(n.exportClause) && n.exportClause.elements.length>0 && n.exportClause.elements.every(e=>e.isTypeOnly));
    else if (ts.isImportTypeNode(n)) typeOnly=true;
    if (ts.isImportDeclaration(n)||ts.isExportDeclaration(n)||ts.isImportTypeNode(n)) typeAt.set(source.getLineAndCharacterOfPosition(n.getStart(source)).line+1,!!typeOnly);
    ts.forEachChild(n,visit);
  }
  visit(source);
  let refs=saved.imports.filter(e=>e.file===file);
  if (saved.inputHashes[file]!==inputHashes[file]) {
    refs=[];
    function collect(n) {
      let s,kind;
      if(ts.isImportDeclaration(n)||ts.isExportDeclaration(n)){s=n.moduleSpecifier;kind=ts.isImportDeclaration(n)?'import':'reexport';}
      else if(ts.isImportTypeNode(n)&&ts.isLiteralTypeNode(n.argument)){s=n.argument.literal;kind='import-type';}
      else if(ts.isExternalModuleReference(n)){s=n.expression;kind='import-equals';}
      else if(ts.isCallExpression(n)&&(n.expression.kind===ts.SyntaxKind.ImportKeyword||ts.isIdentifier(n.expression)&&n.expression.text==='require')){s=n.arguments[0];kind='dynamic-or-require';}
      if(kind) refs.push({file,line:source.getLineAndCharacterOfPosition(n.getStart(source)).line+1,kind,specifier:s&&ts.isStringLiteralLike(s)?s.text:'<computed>'});
      ts.forEachChild(n,collect);
    } collect(source);
  }
  for (const ref of refs) {
    if(ref.specifier==='<computed>'){computed.push(ref);continue;}
    const edge={...ref,typeOnly:typeAt.get(ref.line) ?? !!ref.typeOnly};
    if(ref.specifier.startsWith('.')) {
      const resolved=ts.resolveModuleName(ref.specifier,path.join(root,file),options,ts.sys).resolvedModule;
      if(resolved) edge.target=path.relative(root,resolved.resolvedFileName);
      else if(!/\.(css|json)$/.test(ref.specifier)) unresolved.push(ref);
    }
    edges.push(edge);
  }
}
function scc(runtimeOnly) {
  const graph=new Map(files.map(f=>[f,[]]));
  for(const e of edges) if(graph.has(e.target)&&(!runtimeOnly||!e.typeOnly))graph.get(e.file).push(e.target);
  let index=0;const indices=new Map(),low=new Map(),stack=[],on=new Set(),cycles=[];
  function visit(v){indices.set(v,index);low.set(v,index++);stack.push(v);on.add(v);
    for(const w of graph.get(v)){if(!indices.has(w)){visit(w);low.set(v,Math.min(low.get(v),low.get(w)));}else if(on.has(w))low.set(v,Math.min(low.get(v),indices.get(w)));}
    if(low.get(v)===indices.get(v)){const group=[];let w;do{w=stack.pop();on.delete(w);group.push(w);}while(w!==v);
      if(group.length>1||graph.get(v).includes(v)){const members=new Set(group);cycles.push({members:group.sort(),edges:edges.filter(e=>members.has(e.file)&&members.has(e.target)&&(!runtimeOnly||!e.typeOnly))});}}
  }
  for(const v of files)if(!indices.has(v))visit(v);return cycles;
}
const rootBarrelImports=edges.filter(e=>e.target==='packages/ui/src/index.ts'||/^@structured-growth\/sg-ui(?:$|\/index(?:\.|$))/.test(e.specifier));
const basic=f=>/^packages\/ui\/src\/(?:foundation|experimental|primitives|icons|theme|adapters|i18n|hooks|utils)\//.test(f);
const specialist=f=>/^packages\/ui\/src\/components\/(?:AppDataGrid|LearnerClassesDataGrid|DataToolbar|PageRichTextEditorSection|DocumentEditor|ContentEditor|RichText|FloatingText|LearnerClass|InstructorClass)/.test(f??'')||/^lexical(?:$|\/)|^@lexical\/|^@tanstack\//.test(f??'');
const specialistInversions=edges.filter(e=>basic(e.file)&&(specialist(e.target)||specialist(e.specifier)));
const lowLayerImports=edges.filter(e=>/^packages\/ui\/src\/(foundation|adapters|i18n|utils)\//.test(e.file)&&e.target&&/^packages\/ui\/src\/(components|experimental|theme|primitives|icons)\//.test(e.target));
const supportingPaths=['AGENTS.md','docs/developer/react-aria-architecture.md','docs/developer/component-architecture.md','docs/developer/react-aria-hardening-tasks.md','packages/ui/scripts/check-foundations.mjs','packages/ui/scripts/check-component-css.mjs','packages/ui/scripts/react-stately-boundaries.test.mjs','packages/ui/scripts/tokens.mjs','packages/ui/scripts/tokens.test.mjs','packages/ui/scripts/css-modules.mjs','packages/ui/scripts/css-modules.test.mjs','packages/ui/scripts/build.mjs','packages/ui/tsconfig.json'];
const supportingInputs=supportingPaths.map(file=>{const sha256=hash(fs.readFileSync(path.join(root,file)));return {file,sha256,matchesFA02:saved.inputHashes[file]===sha256};});
const report={capturedAt:new Date().toISOString(),head:cp.execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),baseInventory:{path:'docs/developer/final-acceptance/2026-10-16-source-inventory.json',capturedAt:saved.capturedAt,sha256:hash(fs.readFileSync(path.join(root,'docs/developer/final-acceptance/2026-10-16-source-inventory.json')))},scope:'Maintained production TS/JS source; tests/native fixtures excluded. Named explicit type-only syntax classified separately; no inferred type erasure, bundler execution, CSS graph, external package graph or browser claim.',inputHashes,delta,files:files.length,edges:edges.length,internalEdges:edges.filter(e=>e.target&&files.includes(e.target)).length,computed,unresolved,rootBarrelImports,specialistInversions,lowLayerImports,allSourceCycles:scc(false),runtimeSyntaxCycles:scc(true)};
report.supportingInputs=supportingInputs;
fs.writeFileSync(path.join(out,'graph-evidence.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({files:report.files,edges:report.edges,internalEdges:report.internalEdges,delta:delta.length,computed:computed.length,unresolved:unresolved.length,rootBarrelImports:rootBarrelImports.length,specialistInversions:specialistInversions.length,lowLayerImports:lowLayerImports.length,allCycles:report.allSourceCycles.length,runtimeCycles:report.runtimeSyntaxCycles.length},null,2));
