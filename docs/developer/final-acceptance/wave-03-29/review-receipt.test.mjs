import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { validateReceipt } from './review-receipt.mjs';
const file=fileURLToPath(new URL('./assignment.json',import.meta.url));
const sha=createHash('sha256').update(readFileSync(file)).digest('hex');
function valid(){return {schemaVersion:1,reviewer:'synthetic test only',reviewedAt:'2026-10-16T23:00:00Z',sourceManifestPath:file,sourceManifestSha256:sha,hostManifestPath:file,hostManifestSha256:sha,engineVersion:'test engine',reason:'unit fixture, no approval',changes:[{beforePath:null,newBaselineReason:'test only',afterPath:file,afterSha256:sha,family:'test',theme:'light',density:'compact',viewport:'1280x720',fixtureId:'test',interactionReceipt:'test receipt',observation:'synthetic',disposition:'accepted'}]};}
test('pending or machine-only generation cannot satisfy deliberate review',()=>{assert.ok(validateReceipt({schemaVersion:1,changes:[{afterPath:file,afterSha256:sha,disposition:'pending'}]}).length>5);});
test('replacement image or manifest mutation invalidates receipt',()=>{const r=valid();r.changes[0].afterSha256='0'.repeat(64);r.hostManifestSha256='0'.repeat(64);const e=validateReceipt(r);assert.ok(e.includes('hostManifest hash mismatch'));assert.ok(e.includes('image 0: after hash mismatch'));});
test('new baseline, deferral, duplicate, and rejected deltas need reasons',()=>{const r=valid();delete r.changes[0].newBaselineReason;r.changes[0].disposition='deferred';r.changes.push({...r.changes[0]});const e=validateReceipt(r);assert.ok(e.some(x=>x.includes('duplicate')));assert.ok(e.some(x=>x.includes('followUp')));assert.ok(e.some(x=>x.includes('new baseline')));});
test('complete synthetic receipt passes structural validation only',()=>assert.deepEqual(validateReceipt(valid()),[]));
