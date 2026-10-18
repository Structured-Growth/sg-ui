"""Process-level synthetic CLI integration only; never installs SGUI or runs real pnpm/git.
All fixture executables, outputs and transient data stay in this assignment folder.
"""
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
sys.dont_write_bytecode = True
OWN = Path(__file__).resolve().parent
ROOT = OWN.parents[4]
SCRIPTS = ROOT / 'packages/ui/scripts'


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


packed_tests = load('packed_fixture', OWN / 'proposed-files/packages/ui/scripts/check-packed-license-evidence.test.py')
lock = load('lock', SCRIPTS / 'check-lock-provenance.py')


class ShippedCliTests(unittest.TestCase):
    def execute(self, script, arguments, env=None):
        result = subprocess.run([sys.executable, str(SCRIPTS / script)] + arguments, env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=15, check=False)
        self.assertEqual(result.stderr, b'', result.stderr.decode(errors='replace'))
        return result.returncode, json.loads(result.stdout)

    def test_packed_cli_pass_and_real_findings_exit(self):
        fixture = packed_tests.EvidenceTests()
        fixture.setUp()
        self.addCleanup(fixture.doCleanups)
        fixture.run_audit()
        arguments = [str(fixture.root), str(fixture.archive), str(fixture.inventory_path)]
        code, result = self.execute('check-packed-license-evidence.py', arguments)
        self.assertEqual(code, 0)
        self.assertTrue(result['byteChecksPass'])
        self.assertFalse(result['legalApproval'])
        fixture.files['THIRD_PARTY_NOTICES.md'] = b'copyright removed'
        fixture.run_audit()
        code, result = self.execute('check-packed-license-evidence.py', arguments)
        self.assertEqual(code, 1)
        self.assertIn('legal-text-not-in-packed-notices', {r['code'] for r in result['findings']})

    def test_pnpm_pack_normalization_preserves_consumer_contract_in_real_cli(self):
        fixture = packed_tests.EvidenceTests()
        fixture.setUp()
        self.addCleanup(fixture.doCleanups)
        source = {'name': 'fixture', 'packageManager': 'pnpm@10.29.3',
                  'dependencies': {'dep': '1.0.0'}, 'exports': {'.': './dist/index.js'}}
        source_bytes = json.dumps(source, indent=2).encode()
        (fixture.package / 'package.json').write_bytes(source_bytes)
        fixture.inventory['inputs']['manifestSha256'] = lock.sha(source_bytes)
        packed = {'exports': source['exports'], 'dependencies': source['dependencies'], 'name': 'fixture'}
        fixture.files['package.json'] = json.dumps(packed).encode()
        fixture.run_audit()
        args = [str(fixture.root), str(fixture.archive), str(fixture.inventory_path)]
        code, result = self.execute('check-packed-license-evidence.py', args)
        self.assertEqual(code, 0)
        self.assertFalse(result['manifestComparison']['rawBytesEqual'])
        self.assertEqual(result['manifestComparison']['transformations'],
                         ['pnpm-pack-omitted-development-packageManager'])
        # Only the development-field omission/key order may change. Actual
        # dependency and export-target changes remain findings in the real CLI.
        for field, value in [('dependencies', {'dep': '2.0.0'}),
                             ('exports', {'.': './dist/private.js'}),
                             ('unexpectedConsumerMetadata', True)]:
            changed = dict(packed, **{field: value})
            fixture.files['package.json'] = json.dumps(changed).encode()
            fixture.run_audit()
            code, result = self.execute('check-packed-license-evidence.py', args)
            self.assertEqual(code, 1)
            self.assertIn({'code': 'packed-source-mismatch', 'subject': 'package.json'}, result['findings'])

    def fixture(self, fail_install=False):
        temp = tempfile.TemporaryDirectory(dir=OWN)
        self.addCleanup(temp.cleanup)
        base = Path(temp.name)
        repository, binary, output = base / 'isolated', base / 'bin', base / 'receipt'
        repository.mkdir()
        binary.mkdir()
        for name in lock.INPUTS:
            path = repository / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(b'{"packageManager":"pnpm@10.29.3"}' if name.endswith('package.json') else b'fixture lock input')
        head = 'b' * 40
        digest = lock.sha((repository / 'pnpm-lock.yaml').read_bytes())
        # Executables deliberately simulate tool output; these are no install evidence.
        executables = {
            'node': 'print("v24.21.0")',
            'git': 'import sys\nprint("' + head + '" if sys.argv[1] == "rev-parse" else "")',
            'pnpm': '''import json, pathlib, sys
args = sys.argv[1:]
with pathlib.Path('.fixture-pnpm-invocations.jsonl').open('a') as log:
    log.write(json.dumps(args) + '\\n')
if args == ['--version']:
    print('10.29.3')
elif args == ['install', '--lockfile-only', '--ignore-scripts']:
    print('synthetic generation')
elif args == ['install', '--frozen-lockfile']:
    if FAIL:
        print('synthetic failure retained', file=sys.stderr)
        raise SystemExit(7)
    target = pathlib.Path('node_modules/.pnpm/lock.yaml')
    target.parent.mkdir(parents=True)
    target.write_bytes(pathlib.Path('pnpm-lock.yaml').read_bytes())
    print('synthetic install')
elif args == ['-r', 'list', '--depth', 'Infinity', '--json']:
    print('[{"name":"synthetic-only"}]')
else:
    raise SystemExit(9)
'''.replace('FAIL', repr(fail_install))}
        for name, body in executables.items():
            path = binary / name
            path.write_text('#!' + sys.executable + '\n' + body + '\n')
            path.chmod(0o700)
        environment = dict(os.environ, PATH=str(binary) + os.pathsep + os.environ.get('PATH', ''))
        args = ['--output', str(output), '--expected-head', head, '--expected-lock-sha256', digest]
        capture_args = ['capture'] + args + ['--repository', str(repository), '--node', str(binary / 'node'), '--pnpm', str(binary / 'pnpm')]
        return repository, output, environment, args, capture_args

    def test_lock_capture_check_and_tamper_as_real_processes(self):
        repository, output, environment, args, capture_args = self.fixture()
        code, result = self.execute('check-lock-provenance.py', capture_args, environment)
        self.assertEqual(code, 0)
        self.assertTrue(result['checksPass'])
        calls = [json.loads(line) for line in (repository / '.fixture-pnpm-invocations.jsonl').read_text().splitlines()]
        self.assertEqual(calls, [['--version'], ['install', '--lockfile-only', '--ignore-scripts'], ['install', '--frozen-lockfile'], ['-r', 'list', '--depth', 'Infinity', '--json']])
        code, result = self.execute('check-lock-provenance.py', ['check'] + args, environment)
        self.assertEqual(code, 0)
        (output / 'generate.stdout').write_bytes(b'tampered')
        code, result = self.execute('check-lock-provenance.py', ['check'] + args, environment)
        self.assertEqual(code, 1)
        self.assertIn('log-hash:generate:stdout', result['findings'])

    def test_failed_install_cli_retains_actual_exit_and_stops_graph(self):
        repository, output, environment, args, capture_args = self.fixture(fail_install=True)
        code, result = self.execute('check-lock-provenance.py', capture_args, environment)
        self.assertEqual(code, 2)
        self.assertFalse(result['checksPass'])
        receipt = json.loads((output / 'receipt.json').read_bytes())
        self.assertEqual(receipt['commands'][-1]['label'], 'frozen-install')
        self.assertEqual(receipt['commands'][-1]['exitCode'], 7)
        self.assertIn(b'synthetic failure retained', (output / 'frozen-install.stderr').read_bytes())
        self.assertFalse((output / 'physical-graph.stdout').exists())


if __name__ == '__main__':
    unittest.main()
