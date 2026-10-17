import assert from 'node:assert/strict';
import {isAbsolute} from 'node:path';

export const consumerScopes = ['foundation18','foundation19','editor18','editor19','next19'];

// Validate the entire plan before mkdir/copy/install. A missing --only value must
// never silently widen an intended continuation into the expensive full matrix.
export function parseConsumerMatrixOptions(argv, version = process.version) {
  const match = /^v?(\d+)\.(\d+)\.(\d+)/.exec(version);
  assert(match, 'Unrecognized Node runtime');
  const major = Number(match[1]), minor = Number(match[2]);
  assert(major === 24 || major === 22 && minor >= 12, 'Use supported Node >=22.12 on 22, or Node24');
  const result = {};
  for (let index = 0; index < argv.length; index++) {
    const key = argv[index];
    assert(['--tarball','--expected-sha256','--output','--only','--browser'].includes(key), `Unknown option ${key}`);
    assert(!Object.hasOwn(result, key), `Duplicate option ${key}`);
    if (key === '--browser') { result[key] = true; continue; }
    const value = argv[++index];
    assert(typeof value === 'string' && value.length > 0 && !value.startsWith('--'), `Missing value for ${key}`);
    result[key] = value;
  }
  for (const key of ['--tarball','--output']) {
    assert(typeof result[key] === 'string' && isAbsolute(result[key]), `${key} requires an absolute path`);
  }
  assert(/^[a-f0-9]{64}$/.test(result['--expected-sha256'] ?? ''), 'Pass reviewed --expected-sha256');
  if (result['--only'] !== undefined) {
    const selected = result['--only'].split(',');
    assert(selected.length > 0 && selected.every(name => consumerScopes.includes(name)), 'Unknown or empty --only scope');
    assert.equal(new Set(selected).size, selected.length, 'Duplicate --only scope');
  }
  return result;
}
