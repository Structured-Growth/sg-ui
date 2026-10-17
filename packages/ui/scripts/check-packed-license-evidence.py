"""Join an existing package archive to local inventory evidence; never extract/write/install.
Exit 0: defined byte checks pass; 1: findings; 2: invalid inputs. No legal approval.
"""
import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import tarfile


def sha(data):
    return hashlib.sha256(data).hexdigest()


def normalized(data):
    return re.sub(rb'\s+', b' ', data).strip()



def manifest_comparison(source_bytes, packed_bytes):
    source, packed = json.loads(source_bytes), json.loads(packed_bytes)
    if not isinstance(source, dict) or not isinstance(packed, dict):
        raise ValueError('Package manifests must be JSON objects')
    expected = dict(source)
    transformations = []
    # pnpm10.29.3 pack omits the development packageManager field. Key order and
    # whitespace are also not consumer contracts. Preserve all other JSON values.
    if 'packageManager' not in packed and re.fullmatch(r'pnpm@\d+\.\d+\.\d+', str(source.get('packageManager', ''))):
        expected.pop('packageManager')
        transformations.append('pnpm-pack-omitted-development-packageManager')
    return {'sourceSha256': sha(source_bytes), 'packedSha256': sha(packed_bytes),
            'rawBytesEqual': source_bytes == packed_bytes, 'transformations': transformations,
            'consumerMetadataEqual': expected == packed}


def audit(root, archive, inventory_path):
    root, archive, inventory_path = map(lambda p: Path(p).resolve(), (root, archive, inventory_path))
    package = root / 'packages/ui'
    raw_inventory = inventory_path.read_bytes()
    inventory = json.loads(raw_inventory)
    findings, members, closure = [], {}, []
    manifest_result = None
    def finding(code, subject):
        findings.append({'code': code, 'subject': subject})
    def local(path):
        resolved = path.resolve()
        if root not in resolved.parents:
            raise ValueError('Evidence path escapes repository')
        return resolved.read_bytes()
    for key, path in [('manifestSha256', package / 'package.json'), ('lockSha256', root / 'pnpm-lock.yaml'), ('installedLockSha256', root / 'node_modules/.pnpm/lock.yaml')]:
        if inventory['inputs'].get(key) != sha(local(path)):
            finding('stale-inventory-input', key)
    # Stream members, reject paths/duplicates/links before reading; no extraction.
    with tarfile.open(archive, 'r:gz') as tar:
        for member in tar:
            name = member.name
            path = PurePosixPath(name)
            if path.is_absolute() or '..' in path.parts or not path.parts or path.parts[0] != 'package' or '\\' in name:
                raise ValueError('Unsafe archive path')
            if member.isdir():
                continue
            if not member.isfile() or name in members:
                raise ValueError('Duplicate/nonregular archive member')
            if member.size > 32 * 1024 * 1024:
                raise ValueError('Archive member exceeds audit bound')
            members[name] = tar.extractfile(member).read()
    for name in ['LICENSE', 'THIRD_PARTY_NOTICES.md', 'package.json', 'README.md']:
        data = members.get('package/' + name)
        if data is None:
            finding('missing-packed-file', name)
        elif name == 'package.json':
            manifest_result = manifest_comparison(local(package / name), data)
            if not manifest_result['consumerMetadataEqual']:
                finding('packed-source-mismatch', name)
        elif data != local(package / name):
            finding('packed-source-mismatch', name)
        if name in ['LICENSE', 'THIRD_PARTY_NOTICES.md'] and local(package / name) != local(root / name):
            finding('root-package-legal-mismatch', name)
    notices = members.get('package/THIRD_PARTY_NOTICES.md', b'')
    for item in inventory['packages']:
        if not set(item['scopes']) & {'runtime', 'runtime-optional', 'peer-realization'}:
            continue
        evidence = []
        for metadata in item['metadata']:
            metadata_bytes = local(package / metadata['path'])
            if sha(metadata_bytes) != metadata['sha256']:
                finding('stale-package-metadata', item['id'])
            for legal in metadata['evidence']:
                data = local(package / legal['path'])
                current = sha(data)
                if current != legal['sha256']:
                    finding('stale-legal-evidence', legal['path'])
                present = bool(normalized(data)) and normalized(data) in normalized(notices)
                evidence.append(dict(legal, currentSha256=current, wholeNormalizedTextInPackedNotices=present))
                if not present:
                    finding('legal-text-not-in-packed-notices', legal['path'])
        if not evidence:
            finding('runtime-legal-evidence-missing', item['id'])
        closure.append({'id': item['id'], 'scopes': item['scopes'], 'legalEvidence': evidence})
    output = []
    for name, data in sorted(members.items()):
        same = None
        if name.startswith('package/dist/'):
            live = package / name.removeprefix('package/')
            same = live.is_file() and local(live) == data
            if not same:
                finding('packed-dist-current-drift', name)
        output.append({'file': name, 'bytes': len(data), 'sha256': sha(data), 'equalsCurrentDist': same})
    current_names = {'package/' + p.relative_to(package).as_posix() for p in (package / 'dist').rglob('*') if p.is_file()}
    for missing in sorted(current_names - set(members)):
        finding('current-dist-not-packed', missing)
    return {'schemaVersion': 1, 'archiveSha256': sha(archive.read_bytes()), 'inventorySha256': sha(raw_inventory), 'files': output, 'runtimePeerClosure': closure, 'manifestComparison': manifest_result, 'findings': findings, 'byteChecksPass': not findings, 'legalApproval': False, 'limits': ['Full normalized text presence is a conservative evidence check, not a distribution obligation or legal compatibility ruling.', 'Runtime reachability does not prove bundled code; copied code, inline notices, modification notices and docs bundles need independent provenance review.', 'Current dist equality does not establish a fresh build or correspondence to current source. No production approval.']}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('repository', type=Path)
    parser.add_argument('archive', type=Path)
    parser.add_argument('inventory', type=Path)
    args = parser.parse_args()
    try:
        report = audit(args.repository, args.archive, args.inventory)
        print(json.dumps(report, indent=2))
        return int(bool(report['findings']))
    except (OSError, ValueError, KeyError, TypeError, tarfile.TarError) as error:
        print(json.dumps({'inputError': str(error), 'legalApproval': False}))
        return 2


if __name__ == '__main__':
    raise SystemExit(main())
