"""Capture isolated pnpm generation/install evidence, or verify an existing receipt.
Capture changes only the explicitly supplied isolated checkout and NEW output dir.
Check only reads. Neither mode performs a release or establishes legal approval.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess

INPUTS = ['package.json', 'packages/ui/package.json', 'apps/docs/package.json', 'pnpm-workspace.yaml', 'pnpm-lock.yaml']


def sha(data):
    return hashlib.sha256(data).hexdigest()


def run_process(command, cwd, env):
    try:
        result = subprocess.run(command, cwd=cwd, env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=1200, check=False)
        return result.returncode, result.stdout, result.stderr
    except subprocess.TimeoutExpired as error:
        return 124, error.stdout or b'', (error.stderr or b'') + b'\nCommand exceeded 1200 seconds'


def capture(repository, output, expected_head, expected_lock, node, pnpm, run=run_process):
    repository, output, node, pnpm = [Path(p).resolve() for p in (repository, output, node, pnpm)]
    if output == repository or repository in output.parents or output in repository.parents:
        raise ValueError('Evidence output must be outside the isolated checkout')
    if output.exists():
        raise ValueError('Evidence output must be a new directory')
    if not re.fullmatch('[0-9a-f]{40}', expected_head) or not re.fullmatch('[0-9a-f]{64}', expected_lock):
        raise ValueError('Require exact expected head and lock SHA256')
    env = dict(os.environ, PATH=str(node.parent) + os.pathsep + os.environ.get('PATH', ''))
    # The caller supplies an isolated, otherwise idle checkout under coordinator leases.
    # No package-manager command runs until the exact input/clean-head checks pass.
    code, stdout, stderr = run(['git', 'rev-parse', 'HEAD'], repository, env)
    if code or stdout.decode().strip() != expected_head:
        raise ValueError('Isolated HEAD differs from expected head')
    code, stdout, stderr = run(['git', 'status', '--porcelain', '--untracked-files=normal'], repository, env)
    if code or stdout.strip():
        raise ValueError('Isolated checkout must start clean')
    initial = {name: (repository / name).read_bytes() for name in INPUTS}
    if sha(initial['pnpm-lock.yaml']) != expected_lock:
        raise ValueError('Initial lock differs from expected SHA256')
    manager = json.loads(initial['package.json'])['packageManager']
    if not re.fullmatch(r'pnpm@\d+\.\d+\.\d+', manager):
        raise ValueError('Require an exact pnpm packageManager declaration')
    output.mkdir(parents=True)
    for name, data in initial.items():
        target = output / 'before' / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
    receipt = {'schemaVersion': 1, 'head': expected_head, 'expectedLockSha256': expected_lock, 'packageManager': manager, 'commands': [], 'before': {name: sha(data) for name, data in initial.items()}, 'after': {}, 'scope': 'isolated metadata/lock generation and physical install; no dependency upgrade, build, release, security or legal approval'}
    def checkpoint():
        (output / 'receipt.json').write_text(json.dumps(receipt, indent=2) + '\n')
    def execute(label, command):
        code, stdout, stderr = run(command, repository, env)
        (output / (label + '.stdout')).write_bytes(stdout)
        (output / (label + '.stderr')).write_bytes(stderr)
        receipt['commands'].append({'label': label, 'argv': [str(x) for x in command], 'exitCode': code, 'stdoutSha256': sha(stdout), 'stderrSha256': sha(stderr)})
        checkpoint()
        return code, stdout.decode(errors='replace').strip()
    checkpoint()
    code, version = execute('node-version', [str(node), '--version'])
    if code or not re.fullmatch(r'v24\.\d+\.\d+', version):
        raise ValueError('Use the development Node24 runtime; receipt retained')
    code, version = execute('pnpm-version', [str(pnpm), '--version'])
    if code or version != manager.removeprefix('pnpm@'):
        raise ValueError('pnpm version differs from repository; receipt retained')
    if execute('generate', [str(pnpm), 'install', '--lockfile-only', '--ignore-scripts'])[0]:
        raise ValueError('Lock generation failed; receipt retained')
    # No auto-upgrade is intended. A changed generated lock is retained for review,
    # and blocks installation against an unreviewed changed graph.
    generated = (repository / 'pnpm-lock.yaml').read_bytes()
    (output / 'generated-lock.yaml').write_bytes(generated)
    receipt['generatedLockSha256'] = sha(generated)
    receipt['after'] = {name: sha((repository / name).read_bytes()) for name in INPUTS}
    checkpoint()
    if receipt['before'] != receipt['after']:
        raise ValueError('Generation changed reviewed inputs; review diff before install')
    if execute('frozen-install', [str(pnpm), 'install', '--frozen-lockfile'])[0]:
        raise ValueError('Frozen install failed; receipt retained')
    installed = (repository / 'node_modules/.pnpm/lock.yaml').read_bytes()
    (output / 'installed-lock.yaml').write_bytes(installed)
    receipt['installedLockSha256'] = sha(installed)
    receipt['after'] = {name: sha((repository / name).read_bytes()) for name in INPUTS}
    checkpoint()
    if receipt['before'] != receipt['after'] or receipt['installedLockSha256'] != expected_lock:
        raise ValueError('Installation changed reviewed inputs or installed lock differs')
    if execute('physical-graph', [str(pnpm), '-r', 'list', '--depth', 'Infinity', '--json'])[0]:
        raise ValueError('Installed graph capture failed; receipt retained')
    checkpoint()
    return check(output, expected_head, expected_lock)


def check(output, expected_head, expected_lock):
    output = Path(output).resolve()
    receipt = json.loads((output / 'receipt.json').read_bytes())
    findings = []
    def require(condition, message):
        if not condition:
            findings.append(message)
    require(receipt['head'] == expected_head, 'unexpected-head')
    require(receipt['expectedLockSha256'] == expected_lock, 'unexpected-initial-lock')
    require(set(receipt['before']) == set(INPUTS) and receipt['before'] == receipt['after'], 'input-drift-or-incomplete-snapshot')
    for name in INPUTS:
        require(sha((output / 'before' / name).read_bytes()) == receipt['before'].get(name), 'before-input-hash:' + name)
    require(receipt['before']['pnpm-lock.yaml'] == expected_lock, 'before-lock-mismatch')
    require(receipt.get('generatedLockSha256') == expected_lock == sha((output / 'generated-lock.yaml').read_bytes()), 'generated-lock-mismatch')
    require(receipt.get('installedLockSha256') == expected_lock == sha((output / 'installed-lock.yaml').read_bytes()), 'installed-lock-mismatch')
    commands = receipt['commands']
    labels = ['node-version', 'pnpm-version', 'generate', 'frozen-install', 'physical-graph']
    require([c['label'] for c in commands] == labels, 'missing-reordered-or-duplicate-command')
    for command in commands:
        label = command['label']
        if label not in labels:
            raise ValueError('Unsupported command record')
        require(command['exitCode'] == 0, 'nonzero-command:' + label)
        for stream in ['stdout', 'stderr']:
            require(sha((output / (label + '.' + stream)).read_bytes()) == command[stream + 'Sha256'], 'log-hash:' + label + ':' + stream)
    by_label = {c['label']: c for c in commands}
    require(by_label.get('node-version', {}).get('argv', [])[1:] == ['--version'], 'unexpected-node-version-argv')
    require(by_label.get('pnpm-version', {}).get('argv', [])[1:] == ['--version'], 'unexpected-pnpm-version-argv')
    manager_paths = {c['argv'][0] for c in commands if c['label'] != 'node-version' and c.get('argv')}
    require(len(manager_paths) == 1, 'inconsistent-pnpm-executable')
    for label, suffix in [('generate', ['install', '--lockfile-only', '--ignore-scripts']), ('frozen-install', ['install', '--frozen-lockfile']), ('physical-graph', ['-r', 'list', '--depth', 'Infinity', '--json'])]:
        require(by_label.get(label, {}).get('argv', [])[1:] == suffix, 'unexpected-argv:' + label)
    require(bool(re.fullmatch(r'v24\.\d+\.\d+', (output / 'node-version.stdout').read_text().strip())), 'unsupported-node')
    declared = json.loads((output / 'before/package.json').read_text())['packageManager']
    require(receipt['packageManager'] == declared, 'package-manager-declaration-drift')
    require('pnpm@' + (output / 'pnpm-version.stdout').read_text().strip() == declared, 'pnpm-version-mismatch')
    graph = json.loads((output / 'physical-graph.stdout').read_bytes())
    require(isinstance(graph, list) and bool(graph), 'missing-physical-graph')
    return {'checksPass': not findings, 'findings': findings, 'head': expected_head, 'lockSha256': expected_lock, 'receiptSha256': sha((output / 'receipt.json').read_bytes()), 'limits': ['Local logs are evidence supplied by the operator, not independently authenticated execution attestation.', 'Review full locked optional/platform/override/patched topology separately; installed graph is the current machine only.', 'No security, legal, release or broader runtime support approval.']}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode', choices=['capture', 'check'])
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--expected-head', required=True)
    parser.add_argument('--expected-lock-sha256', required=True)
    parser.add_argument('--repository', type=Path)
    parser.add_argument('--node', type=Path)
    parser.add_argument('--pnpm', type=Path)
    args = parser.parse_args()
    try:
        if args.mode == 'capture':
            if not all([args.repository, args.node, args.pnpm]):
                parser.error('capture requires --repository, --node and --pnpm')
            result = capture(args.repository, args.output, args.expected_head, args.expected_lock_sha256, args.node, args.pnpm)
        else:
            result = check(args.output, args.expected_head, args.expected_lock_sha256)
        print(json.dumps(result, indent=2))
        return int(not result['checksPass'])
    except (OSError, ValueError, KeyError, TypeError, subprocess.TimeoutExpired) as error:
        print(json.dumps({'inputOrExecutionError': str(error), 'checksPass': False}))
        return 2


if __name__ == '__main__':
    raise SystemExit(main())
