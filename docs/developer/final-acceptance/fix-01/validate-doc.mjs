import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const root = new URL('../../../../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const hash = value => createHash('sha256').update(value).digest('hex');
const docPath = 'docs/developer/react-aria-token-roles.md';
const doc = await read(docPath);
const source = JSON.parse(await read('packages/ui/src/foundation/tokens.json'));
const prior = JSON.parse(await read('docs/developer/final-acceptance/parallel-08/input-reconciliation.json'));
const groups = [...doc.matchAll(/^\| `([^`]+)` \| (?:Palette and scale|Shared typography|Semantic color|Density|Interaction|Component slots).*$/gm)].map(m=>m[1]);
assert.deepEqual(groups, ['base','shared','light','dark','compact','comfortable','pointer','touch','component']);
assert.deepEqual([...groups].sort(), Object.keys(source).sort());
const resolve = (group,key) => {
 const value=source[group][key].$value, alias=/^\{([^.]+)\.([^}]+)\}$/.exec(value);
 return alias ? resolve(alias[1],alias[2]) : value;
};
const table = doc.split('## Complete light/dark role table')[1].split('## Component relationships')[0];
const rows = [...table.matchAll(/^\| `([^`]+)` \| `([^`]+)` \| `([^`]+)` \|/gm)];
assert.deepEqual(rows.map(r=>r[1]).sort(),Object.keys(source.light).sort());
for(const [,key,light,dark] of rows) {
 assert.equal(resolve('light',key),light,key);
 assert.equal(resolve('dark',key),dark,key);
}
const mappings = [...doc.split('## Component relationships')[1].split('## Scopes,')[0].matchAll(/^\| `([^`]+)` \| `([^`]+)` \|/gm)];
for(const [,key,target] of mappings) assert.equal(source.component[key].$value,`{${target}}`,key);
const localLinks=[...doc.matchAll(/\]\(([^)]+\.md)\)/g)].map(m=>m[1]);
for(const path of localLinks) await read(`docs/developer/${path}`);
assert.equal(resolve('pointer','minimumTargetSize'),'0rem');
assert.equal(resolve('touch','minimumTargetSize'),'2.75rem');
assert.equal(resolve('pointer','navigationIconSize'),'1rem');
assert.equal(resolve('touch','navigationIconSize'),'1.25rem');
const paths = ['packages/ui/src/foundation/tokens.json','packages/ui/scripts/tokens.mjs','packages/ui/scripts/tokens.test.mjs','packages/ui/src/foundation/tokens.css','packages/ui/src/foundation/tokens.generated.ts'];
const inputs=[];
for(const path of paths) {
 const sha256=hash(await read(path)), old=prior.inputs.find(i=>i.path===path);
 assert(old,`Missing retained input: ${path}`);
 assert.equal(sha256,old.sha256,`Changed retained input: ${path}`);
 inputs.push({path,sha256,parallel08Sha256:old.sha256,matches:true});
}
const scopes = 'packages/ui/src/foundation/ThemeScope.tsx';
inputs.push({path:scopes,sha256:hash(await read(scopes)),comparison:'inspected current source; no retained comparison asserted'});
const result={schemaVersion:1,capturedAt:new Date().toISOString(),runtime:process.version,kind:'read-only documentation/data assertions and selected retained-input SHA-256 comparison; no compiler or test suite run',status:'pass',checks:{groups:groups.length,semanticTableRows:rows.length,selectedComponentMappings:mappings.length,localLinks:localLinks.length,interactionDefaults:4,retainedMatchingInputs:paths.length},inputs,documentation:{path:docPath,sha256:hash(doc)}};
await writeFile(new URL('doc-validation.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({status:result.status,checks:result.checks}));
