import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,unlink,rm,realpath} from 'node:fs/promises';
import {join,dirname,basename} from 'node:path';
import {tmpdir} from 'node:os';
import {execFileSync} from 'node:child_process';
import {consumerFixture} from './consumer-artifact.mjs';

test('retained fixture under a workspace has its own pnpm install/exec/list boundary', async () => {
  const parent=await mkdtemp(join(process.env.SGUI_ISOLATION_TEST_ROOT??tmpdir(),'sgui-fixture-isolation-'));
  try {
    await writeFile(join(parent,'pnpm-workspace.yaml'),"packages:\n  - 'apps/*'\n");
    await writeFile(join(parent,'package.json'),JSON.stringify({name:'shared-workspace-sentinel',private:true}));
    await writeFile(join(parent,'pnpm-lock.yaml'),'shared workspace lock sentinel\n');
    const evidence=join(parent,'docs/evidence');await mkdir(evidence,{recursive:true});
    const fixture=await consumerFixture('clean-',{SGUI_CONSUMER_ROOT:evidence});
    await writeFile(join(fixture,'package.json'),JSON.stringify({name:'isolated-packed-consumer',private:true,packageManager:'pnpm@10.29.3'}));
    const boundary=await readFile(join(fixture,'pnpm-workspace.yaml'),'utf8');
    assert.match(boundary,/linkWorkspacePackages: false/);
    assert.match(boundary,/sharedWorkspaceLockfile: false/);
    const root=()=>execFileSync('pnpm',['root','--workspace-root'],{cwd:fixture,encoding:'utf8',env:{...process.env,PATH:dirname(process.execPath)+':'+process.env.PATH}}).trim();
    const isolatedRoot=root();
    assert.equal(join(await realpath(dirname(isolatedRoot)),basename(isolatedRoot)),join(await realpath(fixture),'node_modules'));
    // The negative control proves that this fixture placement would otherwise
    // choose the parent's workspace. No install or shared node_modules mutation.
    await unlink(join(fixture,'pnpm-workspace.yaml'));
    const parentRoot=root();
    assert.equal(join(await realpath(dirname(parentRoot)),basename(parentRoot)),join(await realpath(parent),'node_modules'));
    await writeFile(join(fixture,'pnpm-workspace.yaml'),boundary);
    assert.equal(await readFile(join(parent,'pnpm-lock.yaml'),'utf8'),'shared workspace lock sentinel\n');
  } finally {await rm(parent,{recursive:true,force:true});}
});
