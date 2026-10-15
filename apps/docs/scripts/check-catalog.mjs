import {generateAPI} from './component-api.mjs';
import './check-example-isolation.mjs';
import {generateComposition} from './component-composition.mjs';
import componentNavigationGroups from '../content/component-navigation.json' with {type:'json'};
import ts from 'typescript';
import {readFileSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
const root=resolve(import.meta.dirname,'../../..');
const catalog=JSON.parse(readFileSync(resolve(root,'apps/docs/content/catalog.json'),'utf8'));
const bySlug=new Map(catalog.map(entry=>[entry.slug,entry]));
for(const entry of catalog)if(entry.exampleTitle!==undefined && (entry.slug!=='processing-grid'||entry.exampleTitle!=='Course data grid'))throw Error(`Unapproved single-example exception: ${entry.slug}`);
const grouped=componentNavigationGroups.flatMap(group=>group.slugs);
if(new Set(grouped).size!==grouped.length || grouped.length!==catalog.length || grouped.some(slug=>!bySlug.has(slug)))throw Error('Navigation must group every catalog page exactly once');
const usageSlugs=new Set();
for(const group of new Set(catalog.map(entry=>entry.group))) {
  const usage=JSON.parse(readFileSync(resolve(root,`apps/docs/content/component-usage/${group}.json`),'utf8'));
  for(const [slug,content] of Object.entries(usage)) {
    if(!bySlug.has(slug)||bySlug.get(slug).group!==group||usageSlugs.has(slug))throw Error(`Unexpected or duplicate component usage: ${group}/${slug}`);
    usageSlugs.add(slug);
    if(typeof content.when!=='string'||!content.when.trim()||!Array.isArray(content.how)||content.how.length<2||content.how.some(step=>typeof step!=='string'||!step.trim()))throw Error(`When/how guidance required: ${slug}`);
    if(content.related!==undefined&&(!Array.isArray(content.related)||content.related.some(link=>!bySlug.has(link.slug)||typeof link.label!=='string'||!link.label.trim())))throw Error(`Invalid related component link: ${slug}`);
  }
}
const missingUsage=catalog.filter(entry=>!usageSlugs.has(entry.slug)).map(entry=>entry.slug);
if(missingUsage.length)throw Error(`Component usage guidance missing: ${missingUsage.join(', ')}`);
const documented=new Set(catalog.flatMap(entry=>entry.exports));
const required=new Set();const seen=new Set();
function read(file){if(seen.has(file))return;seen.add(file);const source=ts.createSourceFile(file,readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true);for(const statement of source.statements){if(statement.modifiers?.some(m=>m.kind===ts.SyntaxKind.ExportKeyword)){if(ts.isFunctionDeclaration(statement)&&statement.name&&/^[A-Z][A-Za-z0-9]*$/.test(statement.name.text))required.add(statement.name.text);if(ts.isVariableStatement(statement))for(const d of statement.declarationList.declarations)if(ts.isIdentifier(d.name)&&/^[A-Z][A-Za-z0-9]*$/.test(d.name.text))required.add(d.name.text);}if(!ts.isExportDeclaration(statement)||statement.isTypeOnly)continue;if(statement.exportClause&&ts.isNamedExports(statement.exportClause)){for(const item of statement.exportClause.elements){if(!item.isTypeOnly&&/^[A-Z][A-Za-z0-9]*$/.test(item.name.text))required.add(item.name.text);}}else if(statement.moduleSpecifier&&ts.isStringLiteral(statement.moduleSpecifier)){const base=resolve(dirname(file),statement.moduleSpecifier.text);const next=['.ts','.tsx','/index.ts','/index.tsx'].map(s=>base+s).find(existsSync);if(next)read(next);}}}
for(const entry of ['index.ts','components/index.ts','experimental/index.ts','theme/index.ts','adapters/index.ts','i18n/index.tsx'])read(resolve(root,'packages/ui/src',entry));
const missing=[...required].filter(name=>!documented.has(name));if(missing.length)throw Error(`Public React component documentation missing: ${missing.join(', ')}`);
console.log(`${catalog.length} pages cover all ${required.size} public component/icon export names with when/how guidance`);

generateComposition(catalog,{check:true});

generateAPI(catalog,{check:true});
