import test from 'node:test';import assert from 'node:assert/strict';import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';import {tmpdir} from 'node:os';import {join} from 'node:path';import {collectDocsLegalEvidence} from './docs-license-audit.mjs';
test('preserves authentic legal bytes and reports missing evidence without inventing attribution',()=>{
 const root=mkdtempSync(join(tmpdir(),'sgui-docs-legal-'));try{
  const one=join(root,'node_modules/one'),two=join(root,'node_modules/two');for(const dir of [one,two]){mkdirSync(dir,{recursive:true});writeFileSync(join(dir,'index.js'),'export {};');}
  writeFileSync(join(one,'package.json'),JSON.stringify({name:'one',version:'1.0.0',license:'MIT'}));writeFileSync(join(one,'LICENSE'),'Authentic notice\n');
  writeFileSync(join(two,'package.json'),JSON.stringify({name:'two',version:'2.0.0',license:'MIT'}));
  const report=collectDocsLegalEvidence([join(one,'index.js'),join(two,'index.js')],root);assert.equal(report.packages.length,2);assert.equal(report.legalFiles[0].text,'Authentic notice\n');assert.equal(report.findings.length,1);assert.equal(report.findings[0].id,'two@2.0.0');
 }finally{rmSync(root,{recursive:true,force:true});}
});

test('retains a nested bundled notice as well as its package license',()=>{
 const root=mkdtempSync(join(tmpdir(),'sgui-docs-nested-'));try{
  const pkg=join(root,'node_modules/framework'),nested=join(pkg,'compiled/tool');mkdirSync(nested,{recursive:true});
  writeFileSync(join(pkg,'package.json'),JSON.stringify({name:'framework',version:'1.0.0',license:'MIT'}));writeFileSync(join(pkg,'LICENSE'),'Framework license');writeFileSync(join(nested,'NOTICE'),'Bundled tool notice');writeFileSync(join(nested,'index.js'),'export {};');
  const report=collectDocsLegalEvidence([join(nested,'index.js')],root);assert.equal(report.legalFiles.length,2);assert(report.legalFiles.some(file=>file.text==='Bundled tool notice'));assert.deepEqual(report.findings,[]);
 }finally{rmSync(root,{recursive:true,force:true});}
});
