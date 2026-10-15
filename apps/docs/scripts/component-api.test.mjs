import test from 'node:test';
import assert from 'node:assert/strict';
import api from '../content/component-api.json' with {type:'json'};
import catalog from '../content/catalog.json' with {type:'json'};
test('prop reference covers every catalog export and includes required public callbacks',()=>{
 assert.deepEqual(Object.keys(api),catalog.map(entry=>entry.slug));
 for(const entry of catalog)assert.deepEqual(api[entry.slug].flatMap(group=>group.names).sort(),[...entry.exports].sort());
 const select=api.select[0].props;
 assert.equal(select.find(prop=>prop.name==='label').required,true);
 assert.match(select.find(prop=>prop.name==='onValueChange').type,/string \| null/);
 assert.equal(api['app-data-grid'][0].props.find(prop=>prop.name==='rows').required,true);
});
test('defaults follow transparent wrappers while preserving explicit wrapper overrides',()=>{
 const value=(slug,name)=>api[slug][0].props.find(prop=>prop.name===name).default;
 assert.equal(value('button','variant'),'"filled"');
 assert.equal(value('card','variant'),'"outlined"');
 assert.equal(value('card','as'),'"article"');
 assert.equal(api.card[1].props.find(prop=>prop.name==='padding').default,'4');
});
test('icons share their actual contract without duplicate tables or private filesystem paths',()=>{
 assert.ok(api.icons[0].names.includes('AddIcon'));
 assert.ok(api.icons[0].names.length>80);
 assert.ok(api.icons[0].props.some(prop=>prop.name==='label'));
 assert.doesNotMatch(JSON.stringify(api),/\/Users\/|node_modules\//);
});
