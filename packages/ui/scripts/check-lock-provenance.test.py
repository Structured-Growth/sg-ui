import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import unittest
sys.dont_write_bytecode = True
OWN = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('lock_provenance', OWN / 'check-lock-provenance.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class LockProvenanceTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(dir=OWN)
        self.addCleanup(self.temp.cleanup)
        self.base = Path(self.temp.name)
        self.root = self.base / 'isolated'
        self.root.mkdir()
        for name in module.INPUTS:
            path = self.root / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(b'{"packageManager":"pnpm@10.29.3"}' if name.endswith('package.json') else b'locked input')
        self.output = self.base / 'evidence'
        self.head = 'a' * 40
        self.lock = module.sha((self.root / 'pnpm-lock.yaml').read_bytes())
        self.calls = []
        self.dirty = False
        self.change_lock = False
        self.fail_install = False

    def fake(self, command, cwd, env):
        self.calls.append(command)
        self.assertEqual(cwd, self.root)
        if command[:2] == ['git', 'rev-parse']:
            return 0, (self.head + '\n').encode(), b''
        if command[:2] == ['git', 'status']:
            return 0, b' M package.json\n' if self.dirty else b'', b''
        if command == ['/fake/node', '--version']:
            return 0, b'v24.21.0\n', b''
        if command == ['/fake/pnpm', '--version']:
            return 0, b'10.29.3\n', b''
        if command[1:] == ['install', '--lockfile-only', '--ignore-scripts']:
            if self.change_lock:
                (self.root / 'pnpm-lock.yaml').write_bytes(b'unreviewed graph')
            return 0, b'fixture generation completed', b''
        if command[1:] == ['install', '--frozen-lockfile']:
            if self.fail_install:
                return 1, b'', b'fixture install failure'
            target = self.root / 'node_modules/.pnpm/lock.yaml'
            target.parent.mkdir(parents=True)
            target.write_bytes((self.root / 'pnpm-lock.yaml').read_bytes())
            return 0, b'fixture frozen installation completed', b''
        if command[1:] == ['-r', 'list', '--depth', 'Infinity', '--json']:
            return 0, b'[{"name":"fixture","dependencies":{}}]', b''
        raise AssertionError(command)

    def capture(self):
        return module.capture(self.root, self.output, self.head, self.lock, '/fake/node', '/fake/pnpm', self.fake)

    def test_capture_and_read_only_verification(self):
        result = self.capture()
        self.assertTrue(result['checksPass'])
        before = {p: p.read_bytes() for p in self.output.rglob('*') if p.is_file()}
        self.assertTrue(module.check(self.output, self.head, self.lock)['checksPass'])
        self.assertEqual(before, {p: p.read_bytes() for p in self.output.rglob('*') if p.is_file()})
        self.assertEqual(len(self.calls), 7)
        with self.assertRaisesRegex(ValueError, 'new directory'):
            self.capture()

    def test_changed_generation_blocks_install_and_retains_diff_inputs(self):
        self.change_lock = True
        with self.assertRaisesRegex(ValueError, 'changed reviewed inputs'):
            self.capture()
        self.assertNotIn(['/fake/pnpm', 'install', '--frozen-lockfile'], self.calls)
        self.assertTrue((self.output / 'before/pnpm-lock.yaml').is_file())
        self.assertEqual((self.output / 'generated-lock.yaml').read_bytes(), b'unreviewed graph')

    def test_dirty_or_wrong_lock_preflight_never_runs_package_manager(self):
        self.dirty = True
        with self.assertRaisesRegex(ValueError, 'start clean'):
            self.capture()
        self.assertFalse(self.output.exists())
        self.dirty = False
        self.lock = '0' * 64
        with self.assertRaisesRegex(ValueError, 'Initial lock'):
            self.capture()
        self.assertFalse(any(command[0] == '/fake/pnpm' for command in self.calls))

    def test_failed_install_is_retained_and_stops_graph(self):
        self.fail_install = True
        with self.assertRaisesRegex(ValueError, 'Frozen install failed'):
            self.capture()
        receipt = json.loads((self.output / 'receipt.json').read_text())
        self.assertEqual(receipt['commands'][-1]['exitCode'], 1)
        self.assertEqual((self.output / 'frozen-install.stderr').read_bytes(), b'fixture install failure')
        self.assertFalse((self.output / 'physical-graph.stdout').exists())

    def test_tampered_logs_or_reordered_commands_fail(self):
        self.capture()
        (self.output / 'generate.stdout').write_bytes(b'changed')
        self.assertIn('log-hash:generate:stdout', module.check(self.output, self.head, self.lock)['findings'])
        receipt = json.loads((self.output / 'receipt.json').read_text())
        receipt['commands'].reverse()
        (self.output / 'receipt.json').write_text(json.dumps(receipt))
        self.assertIn('missing-reordered-or-duplicate-command', module.check(self.output, self.head, self.lock)['findings'])


if __name__ == '__main__':
    unittest.main()
