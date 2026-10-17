"""Explicit real pnpm capture in a NEW private dependency-input snapshot, no Git operations.
Source checkout is read only. Caller must hold coordinator install/heavy leases.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import platform
import re
import subprocess

INPUTS = ['package.json', 'packages/ui/package.json', 'apps/docs/package.json', 'pnpm-workspace.yaml', 'pnpm-lock.yaml']


def sha(data):
    return hashlib.sha256(data).hexdigest()


def snapshot_digest(inputs):
    return sha(json.dumps(inputs, sort_keys=True, separators=(',', ':')).encode())


def process(command, cwd, env):
    try:
        result = subprocess.run(command, cwd=cwd, env=env, capture_output=True, timeout=1200, check=False)
        return result.returncode, result.stdout, result.stderr
    except subprocess.TimeoutExpired as error:
        return 124, error.stdout or b'', (error.stderr or b'') + b'\n1200-second timeout'


def capture(source, output, expected_input_digest, node, pnpm, run=process):
    source, output, node, pnpm = [Path(path).resolve() for path in [source, output, node, pnpm]]
    if output.exists():
        raise ValueError('Output must be a new private directory')
    if output == source or output in source.parents:
        raise ValueError('Output cannot contain or replace source')
    initial = {name: (source / name).read_bytes() for name in INPUTS}
    hashes = {name: sha(data) for name, data in initial.items()}
    if not re.fullmatch('[0-9a-f]{64}', expected_input_digest) or snapshot_digest(hashes) != expected_input_digest:
        raise ValueError('Source dependency inputs differ from expected digest')
    for name in INPUTS:
        if name.endswith('package.json'):
            manifest = json.loads(initial[name])
            if set(manifest.get('scripts', {})) & {'preinstall', 'install', 'postinstall', 'prepare', 'prepublish'}:
                raise ValueError('Workspace lifecycle requires full source; use a reviewed isolated checkout')
    manager = json.loads(initial['package.json'])['packageManager']
    if not re.fullmatch(r'pnpm@\d+\.\d+\.\d+', manager):
        raise ValueError('Exact pnpm packageManager required')
    work = output / 'workspace'
    work.mkdir(parents=True)
    for name, data in initial.items():
        target = work / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
    receipt = {'schemaVersion': 1, 'sourceInputDigest': expected_input_digest, 'inputs': hashes, 'commands': [], 'platform': {'system': platform.system(), 'release': platform.release(), 'machine': platform.machine(), 'libc': platform.libc_ver()}, 'scope': 'Actual isolated dependency-input lock generation/frozen install/physical graph; no Git clone, source build, dependency upgrade or release approval'}
    def checkpoint():
        (output / 'receipt.json').write_text(json.dumps(receipt, indent=2) + '\n')
    def execute(label, command):
        code, stdout, stderr = run([str(arg) for arg in command], work, dict(os.environ, PATH=str(node.parent) + os.pathsep + os.environ.get('PATH', '')))
        (output / (label + '.stdout')).write_bytes(stdout)
        (output / (label + '.stderr')).write_bytes(stderr)
        receipt['commands'].append({'label': label, 'argv': [str(arg) for arg in command], 'exitCode': code, 'stdoutSha256': sha(stdout), 'stderrSha256': sha(stderr)})
        checkpoint()
        if code:
            raise ValueError(label + ' failed; later steps not executed')
        return stdout.decode().strip()
    def stable():
        if {name: sha((source / name).read_bytes()) for name in INPUTS} != hashes:
            raise ValueError('Shared source inputs changed during isolated capture')
        if {name: sha((work / name).read_bytes()) for name in INPUTS} != hashes:
            raise ValueError('Isolated generated inputs changed; retain and review diff before install')
    checkpoint()
    if not re.fullmatch(r'v24\.\d+\.\d+', execute('node-version', [node, '--version'])):
        raise ValueError('Use supported development Node24')
    if 'pnpm@' + execute('pnpm-version', [pnpm, '--version']) != manager:
        raise ValueError('pnpm version differs from frozen declaration')
    execute('generate', [pnpm, 'install', '--lockfile-only', '--ignore-scripts'])
    (output / 'generated-lock.yaml').write_bytes((work / 'pnpm-lock.yaml').read_bytes())
    stable()
    execute('frozen-install', [pnpm, 'install', '--frozen-lockfile'])
    stable()
    installed = (work / 'node_modules/.pnpm/lock.yaml').read_bytes()
    (output / 'installed-lock.yaml').write_bytes(installed)
    receipt['installedLockSha256'] = sha(installed)
    if receipt['installedLockSha256'] != hashes['pnpm-lock.yaml']:
        checkpoint()
        raise ValueError('Installed lock differs from expected bytes')
    graph = json.loads(execute('physical-graph', [pnpm, '-r', 'list', '--depth', 'Infinity', '--json']))
    if not isinstance(graph, list) or not graph:
        raise ValueError('Physical graph absent')
    receipt['physicalPackages'] = sorted(path.name for path in (work / 'node_modules/.pnpm').iterdir() if path.is_dir())
    receipt['sourceInputsStable'] = True
    receipt['generationUnchanged'] = True
    receipt['captureComplete'] = True
    checkpoint()
    return receipt


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ['source', 'output', 'node', 'pnpm']:
        parser.add_argument('--' + name, type=Path, required=True)
    parser.add_argument('--expected-input-digest', required=True)
    args = parser.parse_args()
    try:
        result = capture(args.source, args.output, args.expected_input_digest, args.node, args.pnpm)
        print(json.dumps({'captureComplete': result['captureComplete'], 'sourceInputDigest': result['sourceInputDigest'], 'installedLockSha256': result['installedLockSha256'], 'physicalPackages': len(result['physicalPackages'])}, indent=2))
        return 0
    except (OSError, ValueError, KeyError, TypeError) as error:
        print(json.dumps({'captureComplete': False, 'error': str(error)}))
        return 2


if __name__ == '__main__':
    raise SystemExit(main())
