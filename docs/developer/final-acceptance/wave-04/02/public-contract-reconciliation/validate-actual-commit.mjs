import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {analyzeCommits} from '../../../../../../packages/ui/node_modules/@semantic-release/commit-analyzer/index.js';
import config from '../../../../../../packages/ui/release.config.mjs';
const commit=execFileSync('git',['rev-parse','--verify',(process.argv[2]??'HEAD')+'^{commit}'],{encoding:'utf8'}).trim();
const message=execFileSync('git',['show','-s','--format=%B',commit],{encoding:'utf8'}),normalized=message.replace(/\s+/g,' ');
const output=resolve(process.argv[3]??'docs/developer/final-acceptance/wave-04/02/public-contract-reconciliation/actual-commit-validation.json');
const receipt={commit,url:'https://github.com/Structured-Growth/sg-ui/commit/'+commit,subject:message.split('\n')[0],messageSha256:createHash('sha256').update(message).digest('hex'),scope:'Actual committed message, not proposed text; pure configured analyzer only, no release/publish/version action.'};
try {
 assert.match(message,/^BREAKING CHANGE:/m);
 for(const text of ['DateRangeSelector','DateRangePicker','Calendar','rangeClickBehavior="adjust-end"','calendarNavigation="linked"'])assert(normalized.includes(text),'Missing concrete migration instruction: '+text);
 const options=config.plugins.find(([name])=>name==='@semantic-release/commit-analyzer')[1];
 receipt.semanticReleaseImpact=await analyzeCommits(options,{cwd:resolve('packages/ui'),commits:[{hash:commit,message}],logger:{log(){}}});
 assert.equal(receipt.semanticReleaseImpact,'major');receipt.status='pass';
} catch(error) {receipt.status='fail';receipt.failure=String(error.stack??error);process.exitCode=1;}
await writeFile(output,JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(receipt));
