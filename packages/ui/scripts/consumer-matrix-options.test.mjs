import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseConsumerMatrixOptions} from './consumer-matrix-options.mjs';
const base = ['--tarball','/tmp/candidate.tgz','--output','/tmp/new-evidence','--expected-sha256','a'.repeat(64)];

test('supported runtimes preserve a bounded continuation and browser request', () => {
  for (const version of ['v22.12.0','v22.20.1','v24.0.0','v24.21.0']) {
    const parsed = parseConsumerMatrixOptions([...base,'--only','foundation19,editor19','--browser'], version);
    assert.equal(parsed['--only'], 'foundation19,editor19');
    assert.equal(parsed['--browser'], true);
    assert.equal(parsed['--expected-sha256'], 'a'.repeat(64));
  }
});
test('a missing or misspelled continuation option cannot launch the entire matrix', () => {
  for (const suffix of [['--only'],['--only','--browser'],['--only',''],['--only','bogus'],['--only','foundation19,'],['--only','foundation19,foundation19'],['--onnly','foundation19']]) {
    assert.throws(() => parseConsumerMatrixOptions([...base,...suffix], 'v24.21.0'));
  }
});
test('reviewed identity and output path are mandatory and unambiguous', () => {
  assert.throws(() => parseConsumerMatrixOptions(base.slice(0,4), 'v24.21.0'), /sha256/);
  assert.throws(() => parseConsumerMatrixOptions([...base,'--expected-sha256','b'.repeat(64)], 'v24.21.0'), /Duplicate/);
  assert.throws(() => parseConsumerMatrixOptions(['--tarball','relative.tgz',...base.slice(2)], 'v24.21.0'), /absolute/);
});
test('unsupported local analysis runtimes and older supported-major minors reject before work', () => {
  for (const version of ['v22.11.9','v20.19.0','v23.0.0','v26.5.0','invalid']) {
    assert.throws(() => parseConsumerMatrixOptions(base, version));
  }
});
