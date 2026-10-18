import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { validateVisualBaseline, validateVisualCandidate, validateVisualExecution, visualBaselineNames } from './visual-baseline-review.mjs';
const hash = data => createHash('sha256').update(data).digest('hex');
function fixture(run) {
  const root = mkdtempSync(join(process.env.SGUI_REVIEW_TEST_TMP ?? tmpdir(), 'sgui-reviewed-baseline-'));
  try {
    const baselines = join(root, 'images'); mkdirSync(baselines);
    writeFileSync(join(root, 'source.ts'), 'current source');
    const source = JSON.stringify({ files: { 'source.ts': hash('current source') } });
    const host = 'immutable host metadata'; const interaction = 'native passed receipt';
    for (const [name, data] of [['source.json', source], ['host.json', host], ['interaction.json', interaction]]) writeFileSync(join(root, name), data);
    const receipt = { schemaVersion: 1, reviewer: 'Test-only reviewer', reviewedAt: '2026-10-17T21:00:00Z', engineVersion: 'test browser', osVersion: 'test OS', fontEnvironment: 'test fonts', reason: 'Test metadata only',
      source: {path:'source.json',sha256:hash(source)}, host: {path:'host.json',sha256:hash(host)}, interaction: {path:'interaction.json',sha256:hash(interaction)},
      images: visualBaselineNames.map(name => { writeFileSync(join(baselines,name), 'test image bytes'); return {name,path:name,sha256:hash('test image bytes'),disposition:'accepted',observation:'Test observation'}; }),
    };
    const candidatePath = join(root,'candidate.json'); writeFileSync(candidatePath, source);
    const candidateSha256 = hash(source);
    const receiptPath = join(root,'review.json');
    const check = () => { writeFileSync(receiptPath,JSON.stringify(receipt)); return validateVisualBaseline({receiptPath,baselineRoot:baselines,repositoryRoot:root}); };
    run({root,baselines,receipt,check,candidatePath,candidateSha256});
  } finally { rmSync(root,{recursive:true,force:true}); }
}
test('exact matrix is required; missing or pending image never becomes a baseline', () => fixture(({receipt,check}) => {
  assert.equal(visualBaselineNames.length,48); assert.deepEqual(check(),[]);
  receipt.images.pop(); assert(check().some(error => error.includes('Missing reviewed image')));
  receipt.images[0].disposition='deferred'; assert(check().some(error => error.includes('Unreviewed/rejected')));
}));
test('changed image, source or host invalidates the matching review', () => fixture(({root,baselines,receipt,check}) => {
  writeFileSync(join(baselines,receipt.images[0].path),'changed image'); assert(check().some(error => error.includes('Image hash mismatch')));
  writeFileSync(join(root,'source.ts'),'changed source'); assert(check().some(error => error.includes('Stale source')));
  writeFileSync(join(root,'host.json'),'changed host'); assert(check().some(error => error.startsWith('host:')));
}));
test('reject duplicate/unknown image coverage and missing actual review metadata', () => fixture(({receipt,check}) => {
  receipt.images.push({...receipt.images[0]}); receipt.images.push({...receipt.images[0],name:'other.png'}); receipt.reviewer='';
  const errors=check(); assert(errors.some(error=>error.includes('Unknown/duplicate'))); assert(errors.some(error=>error.includes('reviewer')));
}));
test('reject hash-valid path traversal and symlink escape', () => fixture(({root,baselines,receipt,check}) => {
  writeFileSync(join(root,receipt.images[0].name),'test image bytes'); receipt.images[0].path=`../${receipt.images[0].name}`;
  assert(check().some(error=>error.includes('escapes evidence root')));
  symlinkSync(root,join(baselines,'outside')); receipt.images[0].path=`outside/${receipt.images[0].name}`;
  assert(check().some(error=>error.includes('escapes evidence root')));
}));
test('malformed receipt or absent baseline rejects rather than grants review', () => fixture(({root,baselines}) => {
  const receiptPath=join(root,'bad.json'); writeFileSync(receiptPath,'null');
  assert(validateVisualBaseline({receiptPath,baselineRoot:baselines,repositoryRoot:root}).length>0);
}));

test('actual comparison entry rejects alternate-config auto updates and wrong snapshot roots', () => fixture(({root,baselines,receipt,check,candidatePath,candidateSha256}) => {
  check();
  const options={mode:'compare',candidatePath,candidateSha256,updateSnapshots:'none',snapshotPaths:[join(baselines,receipt.images[0].name)],outputDirectory:join(root,'comparison'),baselineRoot:baselines,receiptPath:join(root,'review.json'),repositoryRoot:root};
  assert.deepEqual(validateVisualExecution(options),[]);
  for(const updateSnapshots of ['all','missing','changed']) assert(validateVisualExecution({...options,updateSnapshots}).some(error=>error.includes('update policy')));
  assert(validateVisualExecution({...options,snapshotPaths:[join(root,'unreviewed.png')]}).some(error=>error.includes('escapes admitted visual root')));
  assert(validateVisualExecution({...options,snapshotPaths:[join(baselines,'unreviewed',receipt.images[0].name)]}).some(error=>error.includes('not the reviewed image path')));
  assert(validateVisualExecution({...options,receiptPath:undefined}).some(error=>error.includes('actual review receipt')));
}));
test('actual capture entry writes only fresh candidates and refuses overwrites and update flags', () => fixture(({root}) => {
  const outputDirectory=join(root,'capture'),snapshot=join(outputDirectory,'candidates','first.png');mkdirSync(join(outputDirectory,'candidates'),{recursive:true});
  const options={mode:'capture',updateSnapshots:'all',snapshotPaths:[snapshot],outputDirectory,repositoryRoot:root};
  assert.deepEqual(validateVisualExecution(options),[]);
  for(const flag of ['--update-snapshots','--update-snapshots=all','-u']) assert(validateVisualExecution({...options,argv:[flag]}).some(error=>error.includes('flags are forbidden')));
  writeFileSync(snapshot,'old candidate');assert(validateVisualExecution(options).some(error=>error.includes('cannot overwrite')));
}));
test('actual entry rejects unbound paths, invalid modes and symlink escape', () => fixture(({root}) => {
  const outputDirectory=join(root,'capture');mkdirSync(outputDirectory);
  symlinkSync(root,join(outputDirectory,'candidates'));
  const options={mode:'capture',updateSnapshots:'all',snapshotPaths:[join(root,'other.png')],outputDirectory,repositoryRoot:root};
  assert(validateVisualExecution({...options,snapshotPaths:[join(outputDirectory,'candidates','unexpected.png')]}).some(error=>error.includes('Candidate root escapes')));
  assert(validateVisualExecution({...options,mode:''}).length);
  assert(validateVisualExecution({...options,snapshotPaths:[]}).some(error=>error.includes('Actual snapshot paths')));
  assert(validateVisualExecution({...options,snapshotPaths:[join(root,'..','escape.png')]}).some(error=>error.includes('escapes admitted visual root')));
}));

// Real temporary Git history proves comparison uses an immutable commit rather
// than HEAD/current working files. Ignored/untracked build outputs stay bound to
// their retained snapshot bytes, never to the new candidate's output directory.
function historicalFixture(run) {
  fixture(context => {
    const {root,receipt} = context;
    const git = args => execFileSync('git', ['-c','core.hooksPath=/dev/null','-c','user.name=Visual Test',
      '-c','user.email=visual-test@example.invalid',...args], {cwd:root,encoding:'utf8',stdio:'pipe'}).trim();
    git(['init','--quiet']); git(['add','source.ts']); git(['commit','--quiet','--no-gpg-sign','-m','baseline fixture']);
    const commit = git(['rev-parse','HEAD']);
    const artifactFiles = {'dist/bundle.js':Buffer.from('reviewed output').toString('base64')};
    mkdirSync(join(root,'dist')); writeFileSync(join(root,'dist','bundle.js'),'reviewed output');
    const manifest = {files:{'source.ts':hash('current source'),'dist/bundle.js':hash('reviewed output')},
      provenance:{kind:'git-and-artifact-snapshot',commit,artifactSnapshot:{path:'historical.json.gz',sha256:''}}};
    const pack = () => {const bytes=gzipSync(JSON.stringify({schemaVersion:1,files:Object.fromEntries(Object.entries(artifactFiles).sort())}),{level:9});writeFileSync(join(root,'historical.json.gz'),bytes);manifest.provenance.artifactSnapshot.sha256=hash(bytes);};
    pack();
    const bind = () => {const bytes=JSON.stringify(manifest);writeFileSync(join(root,'historical-source.json'),bytes);
      receipt.source={path:'historical-source.json',sha256:hash(bytes)};};
    const candidate = () => {const bytes=JSON.stringify({files:{'source.ts':hash(readFileSync(join(root,'source.ts'))),
      'dist/bundle.js':hash(readFileSync(join(root,'dist','bundle.js')))}});writeFileSync(context.candidatePath,bytes);
      return {candidatePath:context.candidatePath,candidateSha256:hash(bytes),repositoryRoot:root};};
    bind(); run({...context,git,manifest,bind,candidate,artifactFiles,pack});
  });
}
test('historical Git and artifact baseline accepts a separately bound changed candidate', () => historicalFixture(({root,baselines,receipt,check,git,candidate}) => {
  assert.deepEqual(check(),[]);
  writeFileSync(join(root,'source.ts'),'legitimate next candidate');
  writeFileSync(join(root,'dist','bundle.js'),'legitimate next output');
  git(['add','source.ts']);git(['commit','--quiet','--no-gpg-sign','-m','next fixture candidate']);
  const current=candidate();
  assert.deepEqual(check(),[]);assert.deepEqual(validateVisualCandidate(current),[]);
  assert.deepEqual(validateVisualExecution({...current,mode:'compare',updateSnapshots:'none',
    snapshotPaths:[join(baselines,receipt.images[0].name)],outputDirectory:join(root,'comparison'),baselineRoot:baselines,
    receiptPath:join(root,'review.json')}),[]);
}));
test('candidate drift fails independently while the historical baseline remains valid', () => historicalFixture(({root,check,candidate}) => {
  const current=candidate();writeFileSync(join(root,'source.ts'),'unrecorded drift');
  assert.deepEqual(check(),[]);
  assert(validateVisualCandidate(current).some(error=>error.includes('Stale source')));
  assert(validateVisualCandidate({...current,candidateSha256:'0'.repeat(64)}).some(error=>error.includes('manifest hash mismatch')));
  assert(validateVisualCandidate({...current,candidatePath:undefined}).some(error=>error.includes('Absolute candidate')));
}));
test('historical Git/source hash mismatch and unavailable commit are rejected', () => historicalFixture(({manifest,bind,check}) => {
  manifest.files['source.ts']=hash('not the committed source');bind();
  assert(check().some(error=>error.includes('Historical Git source hash mismatch')));
  manifest.files['source.ts']=hash('current source');manifest.provenance.commit='0'.repeat(40);bind();
  assert(check().some(error=>error.startsWith('source:')));
}));
test('packed historical artifact tamper, missing entries and unsafe paths are rejected', () => historicalFixture(({root,manifest,artifactFiles,pack,bind,check}) => {
  writeFileSync(join(root,'historical.json.gz'),'tampered archive');
  assert(check().some(error=>error.includes('snapshot hash mismatch')));
  artifactFiles['dist/bundle.js']=Buffer.from('changed reviewed output').toString('base64');pack();bind();
  assert(check().some(error=>error.includes('Historical artifact hash mismatch')));
  delete artifactFiles['dist/bundle.js'];pack();bind();
  assert(check().some(error=>error.includes('Missing historical artifact')));
  artifactFiles['dist/bundle.js']=Buffer.from('reviewed output').toString('base64');
  artifactFiles['../escape']=Buffer.from('anything').toString('base64');pack();bind();
  assert(check().some(error=>error.includes('Invalid historical artifact path')));
  delete artifactFiles['../escape'];manifest.files['../escape']=hash('anything');pack();bind();
  assert(check().some(error=>error.includes('Invalid source manifest entry')));
}));
test('packed artifact format, canonical base64 and unexpected entries are checked', () => historicalFixture(({root,manifest,artifactFiles,pack,bind,check}) => {
  artifactFiles['dist/bundle.js']='not base64!';pack();bind();
  assert(check().some(error=>error.includes('Invalid historical artifact base64')));
  artifactFiles['dist/bundle.js']=Buffer.from('reviewed output').toString('base64');artifactFiles['unexpected.js']='';pack();bind();
  assert(check().some(error=>error.includes('Unexpected historical artifact')));
  const invalid=gzipSync(JSON.stringify({schemaVersion:1,files:[]}));writeFileSync(join(root,'historical.json.gz'),invalid);manifest.provenance.artifactSnapshot.sha256=hash(invalid);bind();
  assert(check().some(error=>error.includes('Invalid historical artifact map')));
}));
test('reviewed manifest tamper and historical provenance masquerading as candidate are rejected', () => historicalFixture(({root,check,candidatePath}) => {
  assert.deepEqual(check(),[]);
  writeFileSync(join(root,'historical-source.json'),'tampered manifest');
  assert(check().some(error=>error.includes('Receipt hash mismatch')));
  const bytes=JSON.stringify({files:{'source.ts':hash('current source')},provenance:{kind:'git-and-artifact-snapshot'}});
  writeFileSync(candidatePath,bytes);
  assert(validateVisualCandidate({candidatePath,candidateSha256:hash(bytes),repositoryRoot:root}).some(error=>error.includes('current inputs')));
}));
test('actual comparison entry requires candidate binding even with an admitted baseline', () => historicalFixture(({root,baselines,receipt,check}) => {
  assert.deepEqual(check(),[]);
  const errors=validateVisualExecution({mode:'compare',updateSnapshots:'none',snapshotPaths:[join(baselines,receipt.images[0].name)],
    outputDirectory:join(root,'comparison'),baselineRoot:baselines,receiptPath:join(root,'review.json'),repositoryRoot:root});
  assert(errors.some(error=>error.startsWith('candidate:')));
}));

test('packed historical snapshot symlink escape is rejected', () => historicalFixture(({root,manifest,bind,check}) => {
  const outside=mkdtempSync(join(tmpdir(),'sgui-historical-outside-'));
  try {
    writeFileSync(join(outside,'archive.gz'),readFileSync(join(root,'historical.json.gz')));
    symlinkSync(join(outside,'archive.gz'),join(root,'escaped.gz'));manifest.provenance.artifactSnapshot.path='escaped.gz';bind();
    assert(check().some(error=>error.includes('escapes evidence root')));
  } finally {rmSync(outside,{recursive:true,force:true});}
}));

test('historical Git symlinks cannot masquerade as regular reviewed source files', () => historicalFixture(({root,git,manifest,bind,check}) => {
  symlinkSync('source.ts',join(root,'linked.ts'));git(['add','linked.ts']);
  git(['commit','--quiet','--no-gpg-sign','-m','symlink fixture']);
  manifest.provenance.commit=git(['rev-parse','HEAD']);manifest.files['linked.ts']=hash('source.ts');bind();
  assert(check().some(error=>error.includes('Non-regular Git source')));
}));

test('packed snapshot generation is deterministic for identical reviewed bytes', () => historicalFixture(({root,pack}) => {
  const first=readFileSync(join(root,'historical.json.gz'));pack();
  assert.deepEqual(readFileSync(join(root,'historical.json.gz')),first);
}));
