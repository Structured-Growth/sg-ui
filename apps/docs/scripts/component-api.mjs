import ts from 'typescript';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
const root=resolve(import.meta.dirname,'../../..');
const dist=resolve(root,'packages/ui/dist');
const output=resolve(root,'apps/docs/content/component-api.json');
const entries=['index','experimental/index','theme/index','primitives/index','icons/index','adapters/index','i18n/index'];
const options={target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler,jsx:ts.JsxEmit.ReactJSX,skipLibCheck:true,strict:true};
const common=new Set(['children','id','name','value','type','disabled','autoFocus','className','style','title','tabIndex','slot','ref','form','formAction','formEncType','formMethod','formNoValidate','formTarget','required','readOnly','placeholder','min','max','step','minLength','maxLength','pattern','multiple','accept','download','href','target','rel','role','onBlur','onFocus']);
const descriptions={children:'Content supplied by the application.',ref:'Forwarded native element reference.',className:'Native CSS class hook.',style:'Native styles and applicable owned CSS variables.',label:'Label supplied by the application.',title:'Title supplied by the application.',density:'Local density; otherwise use the surrounding scope.',disabled:'Controls availability of the interaction.',loading:'Host-controlled pending presentation.',rows:'Rows supplied by the host; the component does not fetch them.',columns:'Column definitions for the supplied dataset.',open:'Controls open state. Handle the corresponding close/change request in the host.'};
function defaultsFromFile(path,name,seen=new Set()) {
 const key=path+':'+name;if(seen.has(key)||!existsSync(path))return {};seen.add(key);
 const source=ts.createSourceFile(path,readFileSync(path,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 let result={};
 const read=fn=>{
  const own={};const param=fn.parameters[0];if(!param)return;
  if(ts.isObjectBindingPattern(param.name))for(const element of param.name.elements)if(element.initializer&&ts.isIdentifier(element.name)) {
   const value=element.initializer.getText(source);if(value.length<100&&!/=>/.test(value))own[element.propertyName?.getText(source)??element.name.text]=value;
  }
  const statement=fn.body&&ts.isBlock(fn.body)?fn.body.statements.find(ts.isReturnStatement):undefined;
  let expression=statement?.expression??(fn.body&&!ts.isBlock(fn.body)?fn.body:undefined);
  if(expression&&ts.isParenthesizedExpression(expression))expression=expression.expression;
  const jsx=expression&&(ts.isJsxElement(expression)?expression.openingElement:ts.isJsxSelfClosingElement(expression)?expression:undefined);
  if(jsx&&jsx.attributes.properties.some(ts.isJsxSpreadAttribute)&&ts.isIdentifier(jsx.tagName)) {
   for(const decl of source.statements.filter(ts.isImportDeclaration)) {
    if(!ts.isStringLiteral(decl.moduleSpecifier)||!decl.moduleSpecifier.text.startsWith('.'))continue;
    const bindings=decl.importClause?.namedBindings;if(!bindings||!ts.isNamedImports(bindings))continue;
    const imported=bindings.elements.find(item=>item.name.text===jsx.tagName.text);if(!imported)continue;
    const base=resolve(dirname(path),decl.moduleSpecifier.text.replace(/\.js$/,''));
    const target=['.tsx','.ts','/index.tsx','/index.ts'].map(ext=>base+ext).find(existsSync);
    if(target)result={...result,...defaultsFromFile(target,imported.propertyName?.text??imported.name.text,seen)};
   }
  }
  result={...result,...own};
 };
 const unwrap=node=>{if(ts.isFunctionLike(node))read(node);else if(ts.isCallExpression(node))for(const arg of node.arguments)unwrap(arg);};
 const inspect=node=>{
  if(ts.isFunctionDeclaration(node)&&node.name?.text===name)read(node);
  if(ts.isVariableDeclaration(node)&&node.name.getText(source)===name&&node.initializer)unwrap(node.initializer);
  ts.forEachChild(node,inspect);
 };
 inspect(source);return result;
}
function defaultsFor(symbol) {
 const declaration=symbol.valueDeclaration;if(!declaration)return {};
 const sourceFile=declaration.getSourceFile().fileName.replace('/dist/','/src/').replace(/\.d\.ts$/,'.tsx');
 return defaultsFromFile(existsSync(sourceFile)?sourceFile:sourceFile.replace(/\.tsx$/,'.ts'),symbol.name);
}
export function generateAPI(catalog,{check=false}={}) {
 const paths=entries.map(entry=>`${dist}/${entry}.d.ts`);
 if(paths.some(path=>!existsSync(path)))throw Error('Build the public UI package before generating component documentation.');
 const program=ts.createProgram(paths,options),checker=program.getTypeChecker(),exports=new Map();
 for(let i=0;i<paths.length;i++) {
  const module=checker.getSymbolAtLocation(program.getSourceFile(paths[i]));
  for(const raw of checker.getExportsOfModule(module))if(!exports.has(raw.name))exports.set(raw.name,{symbol:raw.flags&ts.SymbolFlags.Alias?checker.getAliasedSymbol(raw):raw,from:i===0?'@structured-growth/sg-ui':`@structured-growth/sg-ui/${entries[i].replace('/index','')}`});
 }
 const result={};
 for(const entry of catalog) {
  const groups=[];
  for(const name of entry.exports) {
   const item=exports.get(name);if(!item)throw Error(`Public API documentation export missing: ${name}`);
   const {symbol,from}=item;
   const type=checker.getTypeOfSymbolAtLocation(symbol,symbol.valueDeclaration??symbol.declarations[0]);
   const signature=checker.getSignaturesOfType(type,ts.SignatureKind.Call)[0];
   if(!signature)throw Error(`No public call signature for ${name}`);
   const factory=/^[a-z]/.test(name);
   const defaults=defaultsFor(symbol);
   const parameters=signature.getParameters();
   const input=parameters[0]&&checker.getTypeOfSymbolAtLocation(parameters[0],parameters[0].valueDeclaration??symbol.valueDeclaration);
   const members=factory?parameters:(input?checker.getPropertiesOfType(input):[]);
   const inherited=[];const props=[];
   for(const prop of members) {
    const declarations=prop.declarations??[];
    const own=declarations.some(decl=>decl.getSourceFile().fileName.startsWith(dist+'/'));
    if(!factory&&!own&&!common.has(prop.name)) {inherited.push(prop.name);continue;}
    const location=prop.valueDeclaration??declarations[0]??symbol.valueDeclaration;
    const propertyType=checker.getTypeOfSymbolAtLocation(prop,location);
    const text=checker.typeToString(propertyType,location,ts.TypeFormatFlags.NoTruncation|ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope).replace(/import\("[^"]*\/packages\/ui\/dist\/([^\"]+)"\)\./g,'');
    const description=(own?ts.displayPartsToString(prop.getDocumentationComment(checker)):descriptions[prop.name])||descriptions[prop.name]||(prop.name.startsWith('on')?'Host callback; the signature specifies its arguments.':'See the type and source-backed examples for this option.');
    props.push({name:prop.name,type:text,required:!(prop.flags&ts.SymbolFlags.Optional)&&!(prop.valueDeclaration?.questionToken||prop.valueDeclaration?.initializer),default:defaults[prop.name]??'—',description});
   }
   if(!factory&&inherited.some(name=>name.startsWith('aria-')))props.push({name:'aria-*',type:'Accessibility attributes (React.AriaAttributes)',required:false,default:'—',description:'Standard accessible names, descriptions, state and relationships supported by this component.'});
   const native=inherited.filter(name=>!name.startsWith('aria-'));
   const group={names:[name],from,kind:factory?'function':'component',props,native};
   const same=groups.find(existing=>existing.from===from&&existing.kind===group.kind&&JSON.stringify(existing.props)===JSON.stringify(props)&&JSON.stringify(existing.native)===JSON.stringify(native));
   if(same)same.names.push(name);else groups.push(group);
  }
  result[entry.slug]=groups;
 }
 const text=JSON.stringify(result,null,2)+'\n';
 if(check){if(readFileSync(output,'utf8')!==text)throw Error('Component API metadata is stale; run catalog:generate after building the library.');}else writeFileSync(output,text);
 return result;
}
