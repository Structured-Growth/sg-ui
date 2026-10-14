import ts from 'typescript';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'../../..');
const sourceRoot=resolve(root,'packages/ui/src')+'/';
const output=resolve(root,'apps/docs/content/component-composition.json');

/** Private helpers are transparent; stop at the next documented public component.
 * Native elements, interaction-engine internals and host-provided slots are excluded. */
export function generateComposition(catalog,{check=false}={}) {
  const entryPoints=['index.ts','components/index.ts','experimental/index.ts','theme/index.ts','primitives/index.ts','icons/index.ts'].map(path=>sourceRoot+path);
  const program=ts.createProgram(entryPoints,{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler,jsx:ts.JsxEmit.ReactJSX,skipLibCheck:true});
  const checker=program.getTypeChecker();
  const unalias=symbol=>symbol?.flags&ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
  const exports=new Map();
  for(const path of entryPoints) {
    const module=checker.getSymbolAtLocation(program.getSourceFile(path));
    for(const symbol of checker.getExportsOfModule(module))exports.set(symbol.name,unalias(symbol));
  }
  const publicSymbols=new Map();
  for(const entry of catalog)for(const name of entry.exports) {
    const symbol=exports.get(name);
    if(!symbol)throw Error(`Composition export not resolved: ${name}`);
    if(!/^[A-Z]/.test(name))continue; // Factories/hooks are not component boundaries.
    const names=publicSymbols.get(symbol)??[];
    names.push({name,slug:entry.slug});publicSymbols.set(symbol,names);
  }
  // Shells share the grid's renderer without adding another public state owner.
  // Treat that private entry as the same documented component boundary.
  const gridModule=checker.getSymbolAtLocation(program.getSourceFile(sourceRoot+'components/AppDataGrid/AppDataGrid.tsx'));
  const composedGrid=checker.getExportsOfModule(gridModule).find(symbol=>symbol.name==='ComposedAppDataGrid');
  if(!composedGrid)throw Error('Review the private AppDataGrid composition boundary');
  publicSymbols.set(unalias(composedGrid),[{name:'AppDataGrid',slug:'app-data-grid'}]);
  const result={};
  for(const entry of catalog) {
    result[entry.slug]=[];
    for(const name of entry.exports.filter(name=>/^[A-Z]/.test(name))) {
    const rootSymbol=exports.get(name);
    const children=new Map();
    const visited=new Set([rootSymbol]);
    const scanSymbol=raw=>{
      const symbol=unalias(raw);
      if(!symbol || visited.has(symbol))return;
      visited.add(symbol);
      const declaration=symbol.valueDeclaration;
      if(!declaration || !declaration.getSourceFile().fileName.startsWith(sourceRoot))return;
      const publicNames=publicSymbols.get(symbol);
      const child=publicNames?.find(item=>item.name===symbol.name)??publicNames?.[0];
      if(child && !(child.slug===entry.slug && child.name===name)){children.set(child.name,child);return;}
      // Aliases of this component and private renderer helpers do not add a level.
      const visit=node=>{
        if(ts.isTypeNode(node) || ts.isImportDeclaration(node) || ts.isExportDeclaration(node))return;
        if(ts.isIdentifier(node))scanSymbol(checker.getSymbolAtLocation(node));
        ts.forEachChild(node,visit);
      };
      visit(declaration);
    };
    // Start inside each documented implementation rather than count it as its own child.
    {
      const symbol=rootSymbol;
      const declaration=symbol.valueDeclaration;
      if(!declaration)continue;
      const visit=node=>{
        if(ts.isTypeNode(node))return;
        if(ts.isIdentifier(node))scanSymbol(checker.getSymbolAtLocation(node));
        ts.forEachChild(node,visit);
      };
      visit(declaration);
    }
    result[entry.slug].push({name,children:[...children.values()].sort((a,b)=>a.name.localeCompare(b.name,'en'))});
    }
  }
  const text=JSON.stringify(result,null,2)+'\n';
  if(check){if(readFileSync(output,'utf8')!==text)throw Error('Component composition is stale; run catalog:generate');}
  else writeFileSync(output,text);
  return result;
}
