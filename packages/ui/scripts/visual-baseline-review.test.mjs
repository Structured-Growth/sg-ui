import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { validateVisualBaseline, validateVisualExecution, visualBaselineNames } from './visual-baseline-review.mjs';
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
    const receiptPath = join(root,'review.json');
    const check = () => { writeFileSync(receiptPath,JSON.stringify(receipt)); return validateVisualBaseline({receiptPath,baselineRoot:baselines,repositoryRoot:root}); };
    run({root,baselines,receipt,check});
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

test('actual comparison entry rejects alternate-config auto updates and wrong snapshot roots', () => fixture(({root,baselines,receipt,check}) => {
  check();
  const options={mode:'compare',updateSnapshots:'none',snapshotPaths:[join(baselines,receipt.images[0].name)],outputDirectory:join(root,'comparison'),baselineRoot:baselines,receiptPath:join(root,'review.json'),repositoryRoot:root};
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
