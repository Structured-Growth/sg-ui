import {test} from 'node:test';
import assert from 'node:assert/strict';
import {documentationVersionTarget,unavailableDocumentationPath} from '../content/documentation-versioning.mjs';
const release={id:'1.2.3',label:'1.2.3',baseUrl:'https://docs.example.invalid/releases/1.2.3',routes:['/','/installation','/docs/components/button']};
test('version switches preserve available routes and deployment subpaths',()=>{
 assert.equal(documentationVersionTarget(release,'/docs/components/button'),'https://docs.example.invalid/releases/1.2.3/docs/components/button');
 assert.equal(documentationVersionTarget(release,'/'),'https://docs.example.invalid/releases/1.2.3/');
 assert.equal(documentationVersionTarget({id:'development',baseUrl:''},'/installation'),null);
});
test('missing release pages use the release overview and disclose the missing route',()=>{
 const url=new URL(documentationVersionTarget(release,'/docs/components/future'));
 assert.equal(url.pathname,'/releases/1.2.3/');
 assert.equal(unavailableDocumentationPath(url.search),'/docs/components/future');
});
test('unsafe destinations, mutable versions and incomplete route manifests fail closed',()=>{
 for(const edit of [{id:'latest'},{baseUrl:'javascript:alert(1)'},{baseUrl:'https://user:secret@example.invalid'},{baseUrl:'https://example.invalid/?query=1'},{routes:[]},{routes:['/','/../escape']},{routes:['/','/']}])assert.throws(()=>documentationVersionTarget({...release,...edit},'/installation'));
 for(const path of ['//evil.invalid','/../escape','/\\evil.invalid','/x?query=1','/x#anchor']) {
  assert.equal(documentationVersionTarget(release,path),'https://docs.example.invalid/releases/1.2.3/');
  assert.equal(unavailableDocumentationPath('?documentation-unavailable='+encodeURIComponent(path)),null);
 }
});
test('reject malformed or ambiguous numeric release versions',()=>{
 for(const id of ['01.2.3','1.02.3','1.2.03','1.2.3-','1.2.3-..','1.2.3-rc..1','1.2.3-rc.01'])assert.throws(()=>documentationVersionTarget({...release,id},'/'));
 for(const id of ['0.0.0','v1.2.3','1.2.3-rc.0','1.2.3-alpha-beta'])assert.equal(new URL(documentationVersionTarget({...release,id},'/')).pathname,'/releases/1.2.3/');
});
test('static prefixes and trailing slashes preserve canonical catalog identity',async()=>{
 const {canonicalDocumentationPath}=await import('../content/documentation-versioning.mjs');
 for(const path of ['/dev/docs/components/button/','/docs/components/button/'])assert.equal(canonicalDocumentationPath(path,'/dev'),'/docs/components/button');
 assert.equal(canonicalDocumentationPath('/dev/','/dev'),'/');assert.equal(canonicalDocumentationPath('/developer/','/dev'),'/developer');
});
