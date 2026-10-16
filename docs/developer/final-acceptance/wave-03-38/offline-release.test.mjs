import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
const root=process.cwd();
const require=createRequire(path.join(root,'packages/ui/package.json'));
const {analyzeCommits}=await import(pathToFileURL(require.resolve('@semantic-release/commit-analyzer')));
const {default:getNextVersion}=await import(pathToFileURL(path.join(path.dirname(require.resolve('semantic-release')),'lib/get-next-version.js')));
const {default:config}=await import(pathToFileURL(path.join(root,'packages/ui/release.config.mjs')));
const options=config.plugins.find(([name])=>name==='@semantic-release/commit-analyzer')[1];
const analyze=messages=>analyzeCommits(options,{cwd:path.join(root,'packages/ui'),commits:messages.map((message,i)=>({message,hash:`offline-${i}`})),logger:{log(){}}});
const next=(type,version)=>getNextVersion({branch:{type:'release',name:'main',tags:[]},nextRelease:{type},lastRelease:version?{version}:{},logger:{log(){}}});
test('first publication stays 1.0.0 with either breaking marker; later release becomes major',async()=>{
 for(const message of ['feat!: migrate public UI contracts to the owned foundation','refactor: migrate contracts\n\nBREAKING CHANGE: replace upstream styling and interaction contracts']) {
  const type=await analyze([message]); assert.equal(type,'major');
  assert.equal(next(type), '1.0.0'); assert.equal(next(type,'1.4.2'),'2.0.0');
 }
});
test('a maintenance squash loses the major signal; qualifying feature and fix retain normal policy',async()=>{
 assert.equal(await analyze(['docs: migrate contracts','refactor: migrate contracts']),null);
 assert.equal(next(await analyze(['feat: add component']),'1.4.2'),'1.5.0');
 assert.equal(next(await analyze(['fix: repair focus']),'1.4.2'),'1.4.3');
});
// Offline decision-table model, deliberately no IO or public mutation helpers.
function recovery({known=true,match=true,npm=false,tag=false,github=false,bad=false}) {
 if(!known)return 'observe'; if(!match)return 'incident'; if(bad)return 'new-version';
 if(npm&&!tag)return 'reconcile-history'; if(npm&&!github)return 'complete-github';
 if(tag&&!npm)return 'review-tag-only'; if(!npm&&!tag&&!github)return 'review-retry';
 return 'verify';
}
test('offline failure-state drill never treats partial or unknown publication as retry-safe',()=>{
 const rows=[ [{},'review-retry'],[{tag:true},'review-tag-only'],[{npm:true},'reconcile-history'],[{npm:true,tag:true},'complete-github'],[{npm:true,tag:true,github:true,match:false},'incident'],[{npm:true,tag:true,github:true,bad:true},'new-version'],[{known:false},'observe'],[{npm:true,tag:true,github:true},'verify'] ];
 for(const [state,expected]of rows)assert.equal(recovery(state),expected);
});
