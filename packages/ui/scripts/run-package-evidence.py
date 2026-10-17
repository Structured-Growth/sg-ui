"""Join a retained validated candidate to read-only inventory/license/reference checks.
No pack/build/install/fetch/settings/release actions. New evidence directory only.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys


def sha(data):
    return hashlib.sha256(data).hexdigest()


def process(command, cwd, env):
    result = subprocess.run(command, cwd=cwd, env=env, capture_output=True, timeout=180, check=False)
    return result.returncode, result.stdout, result.stderr


def source_snapshot(repository):
    paths = ['package.json', 'pnpm-lock.yaml', 'packages/ui/package.json', 'packages/ui/README.md', 'packages/ui/LICENSE', 'packages/ui/THIRD_PARTY_NOTICES.md', 'LICENSE', 'THIRD_PARTY_NOTICES.md']
    for name in ['packages/ui/src', 'packages/ui/dist', 'packages/ui/scripts']:
        paths += [p.relative_to(repository).as_posix() for p in (repository / name).rglob('*') if p.is_file() and '__pycache__' not in p.parts]
    return {name: sha((repository / name).read_bytes()) for name in sorted(paths)}


def run_batch(repository, candidate, output, node, run=process, snapshot=source_snapshot):
    repository, candidate, output, node = [Path(path).resolve() for path in [repository, candidate, output, node]]
    if output.exists():
        raise ValueError('Output must be a new evidence directory')
    if output == candidate or output in candidate.parents or candidate in output.parents:
        raise ValueError('Output and retained candidate must be separate')
    audit = json.loads((candidate / 'packed-audit.json').read_bytes())
    if audit.get('technicalPackageAudit') != 'passed' or not re.fullmatch(r'v(22|24)\.\d+\.\d+', audit.get('runtime', '')):
        raise ValueError('Retained candidate needs a successful supported-runtime package audit')
    name = audit.get('archive', '')
    if Path(name).name != name or not name.endswith('.tgz'):
        raise ValueError('Invalid retained archive name')
    archive = candidate / name
    if sha(archive.read_bytes()) != audit.get('archiveSha256'):
        raise ValueError('Retained archive digest differs from package audit')
    before = snapshot(repository)
    output.mkdir(parents=True)
    receipt = {'schemaVersion': 1, 'candidateAuditSha256': sha((candidate / 'packed-audit.json').read_bytes()), 'archiveSha256': audit['archiveSha256'], 'sourcesBefore': before, 'stages': [], 'legalApproval': False, 'releaseApproval': False, 'limits': ['Current source/output stability and candidate byte/metadata evidence; does not itself prove a fresh build.', 'Owner/legal, source-asset provenance, remote CI/account rights and release approval remain separate.']}
    env = dict(os.environ, PATH=str(node.parent) + os.pathsep + os.environ.get('PATH', ''))
    def checkpoint():
        (output / 'receipt.json').write_text(json.dumps(receipt, indent=2) + '\n')
    def execute(label, command, json_output=False):
        code, stdout, stderr = run([str(arg) for arg in command], repository, env)
        (output / (label + '.stdout')).write_bytes(stdout)
        (output / (label + '.stderr')).write_bytes(stderr)
        receipt['stages'].append({'label': label, 'argv': [str(arg) for arg in command], 'exitCode': code, 'stdoutSha256': sha(stdout), 'stderrSha256': sha(stderr)})
        checkpoint()
        if code not in ([0, 1] if json_output else [0]):
            raise ValueError('Execution/input error: ' + label)
        return json.loads(stdout) if json_output else stdout.decode().strip()
    checkpoint()
    version = execute('node-version', [node, '--version'])
    if not re.fullmatch(r'v24\.\d+\.\d+', version):
        raise ValueError('Use supported development Node24')
    inventory = execute('inventory', [node, repository / 'packages/ui/scripts/check-license-inventory.mjs', repository / 'packages/ui'], True)
    # Preserve exact JSON bytes as the next check's hashed input.
    inventory_path = output / 'inventory.stdout'
    license_join = execute('license-join', [sys.executable, repository / 'packages/ui/scripts/check-packed-license-evidence.py', repository, archive, inventory_path], True)
    references = execute('references', [sys.executable, repository / 'packages/ui/scripts/check-packed-retired-references.py', archive], True)
    after = snapshot(repository)
    receipt['sourcesAfter'] = after
    receipt['sourcesStable'] = before == after
    receipt['summary'] = {'inventoryFindings': len(inventory.get('findings', inventory.get('issues', []))), 'licenseFindings': license_join.get('findings'), 'technicalReferenceAuditPass': references.get('technicalReferenceAuditPass') is True, 'referenceErrors': references.get('errors'), 'archiveIdentityMatches': references.get('archiveSha256') == audit['archiveSha256'] == license_join.get('archiveSha256'), 'runtimePeerIdentities': len(license_join.get('runtimePeerClosure', [])), 'archiveMembers': len(references.get('files', []))}
    receipt['automatedChecksPass'] = receipt['sourcesStable'] and receipt['summary']['archiveIdentityMatches'] and receipt['summary']['technicalReferenceAuditPass'] and license_join.get('byteChecksPass') is True
    checkpoint()
    if not receipt['sourcesStable']:
        raise ValueError('Source/output inputs changed during read-only join; receipt retained')
    return receipt


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ['repository', 'candidate', 'output', 'node']:
        parser.add_argument('--' + name, type=Path, required=True)
    args = parser.parse_args()
    try:
        result = run_batch(args.repository, args.candidate, args.output, args.node)
        print(json.dumps({'automatedChecksPass': result['automatedChecksPass'], 'summary': result['summary'], 'receipt': str(args.output / 'receipt.json')}, indent=2))
        return int(not result['automatedChecksPass'])
    except (OSError, ValueError, KeyError, TypeError, subprocess.TimeoutExpired) as error:
        print(json.dumps({'inputOrExecutionError': str(error), 'automatedChecksPass': False}))
        return 2


if __name__ == '__main__':
    raise SystemExit(main())
