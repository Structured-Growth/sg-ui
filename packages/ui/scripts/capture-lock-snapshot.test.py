import importlib.util
import json
import os
from pathlib import Path
import sys
import tempfile
import unittest
sys.dont_write_bytecode = True
spec = importlib.util.spec_from_file_location('capture', Path(__file__).with_name('capture-lock-snapshot.py'))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


class SnapshotTests(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory(dir=os.environ.get('SGUI_CI_EVIDENCE_SCRATCH'))
        self.addCleanup(temp.cleanup)
        self.base = Path(temp.name).resolve()
        self.source, self.output = self.base / 'source', self.base / 'out'
        self.source.mkdir()
        for name in m.INPUTS:
            path = self.source / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(b'{"packageManager":"pnpm@10.29.3"}' if name.endswith('package.json') else b'lock')
        self.digest = m.snapshot_digest({name: m.sha((self.source / name).read_bytes()) for name in m.INPUTS})
        self.calls = []
        self.drift = False
        self.fail = False

    def fake(self, command, cwd, env):
        self.calls.append(command)
        self.assertEqual(cwd, self.output / 'workspace')
        if command[0] == '/fake/node':
            return 0, b'v24.21.0\n', b''
        if command[-1] == '--version':
            return 0, b'10.29.3\n', b''
        if '--lockfile-only' in command:
            if self.drift:
                (cwd / 'pnpm-lock.yaml').write_bytes(b'drift')
            return 0, b'generated', b''
        if '--frozen-lockfile' in command:
            if self.fail:
                return 1, b'', b'install error'
            store = cwd / 'node_modules/.pnpm'
            store.mkdir(parents=True)
            (store / 'lock.yaml').write_bytes(b'lock')
            (store / 'esbuild@1').mkdir()
            return 0, b'installed', b''
        return 0, b'[{"name":"fixture"}]', b''

    def capture(self):
        return m.capture(self.source, self.output, self.digest, '/fake/node', '/fake/pnpm', self.fake)

    def test_real_command_sequence_isolated_from_source_and_records_platform(self):
        result = self.capture()
        self.assertTrue(result['captureComplete'])
        self.assertEqual(len(self.calls), 5)
        self.assertTrue(result['generationUnchanged'])
        self.assertEqual(result['physicalPackages'], ['esbuild@1'])
        self.assertEqual((self.source / 'pnpm-lock.yaml').read_bytes(), b'lock')
        self.assertIn('machine', result['platform'])

    def test_wrong_inputs_existing_output_and_workspace_lifecycle_fail_before_execution(self):
        self.digest = '0' * 64
        with self.assertRaisesRegex(ValueError, 'digest'):
            self.capture()
        self.assertEqual(self.calls, [])
        (self.source / 'package.json').write_text('{"packageManager":"pnpm@10.29.3","scripts":{"prepare":"untrusted"}}')
        self.digest = m.snapshot_digest({name: m.sha((self.source / name).read_bytes()) for name in m.INPUTS})
        with self.assertRaisesRegex(ValueError, 'lifecycle'):
            self.capture()
        self.assertEqual(self.calls, [])

    def test_changed_generated_lock_and_failed_install_stop_later_steps_with_receipts(self):
        self.drift = True
        with self.assertRaisesRegex(ValueError, 'generated inputs'):
            self.capture()
        self.assertEqual(len(self.calls), 3)
        self.assertTrue((self.output / 'generated-lock.yaml').exists())

    def test_install_failure_retains_error_and_never_reports_completion(self):
        self.fail = True
        with self.assertRaisesRegex(ValueError, 'frozen-install failed'):
            self.capture()
        receipt = json.loads((self.output / 'receipt.json').read_text())
        self.assertNotIn('captureComplete', receipt)
        self.assertEqual(receipt['commands'][-1]['exitCode'], 1)
        self.assertEqual(len(self.calls), 4)


if __name__ == '__main__':
    unittest.main()
