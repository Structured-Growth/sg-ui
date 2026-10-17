"""Read-only all-member package reference audit. No extraction, install or legal approval."""
import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import tarfile

PATTERN = re.compile(rb'mui|emotion|material[ -]?ui|material design|basegridsx', re.I)
RETIRED = re.compile(r'^(@mui/|@emotion/|@material-ui/|emotion$|material-ui$)', re.I)
MAX_MEMBER_BYTES = 32 * 1024 * 1024
MAX_TOTAL_BYTES = 256 * 1024 * 1024
MAX_MEMBERS = 10000
ROOTS = {'dist', 'LICENSE', 'THIRD_PARTY_NOTICES.md', 'README.md', 'package.json'}


def audit(archive):
    rows, errors, seen, package, total = [], [], set(), None, 0
    with tarfile.open(archive, 'r:gz') as tar:
        for member in tar:
            name, path = member.name, PurePosixPath(member.name)
            if len(seen) >= MAX_MEMBERS:
                raise ValueError('Archive member count exceeds bound')
            if not path.parts or path.is_absolute() or '..' in path.parts or path.parts[0] != 'package' or '\\' in name or str(path) != name:
                raise ValueError('Unsafe/noncanonical archive path: ' + name)
            if name in seen:
                raise ValueError('Duplicate archive member: ' + name)
            seen.add(name)
            if len(path.parts) > 1 and path.parts[1] not in ROOTS:
                errors.append('unexpected-shipping-root:' + name)
            if member.isdir():
                continue
            if not member.isfile():
                raise ValueError('Nonregular archive member: ' + name)
            total += member.size
            if member.size > MAX_MEMBER_BYTES or total > MAX_TOTAL_BYTES:
                raise ValueError('Archive size exceeds audit bound')
            data = tar.extractfile(member).read()
            hits = []
            for number, line in enumerate(data.splitlines(), 1):
                matches = PATTERN.findall(line)
                if matches:
                    hits.append({'line': number, 'tokens': sorted({token.decode('ascii').lower() for token in matches})})
            legal = name in ['package/LICENSE', 'package/THIRD_PARTY_NOTICES.md']
            disposition = 'legal-preserve-owner-review' if legal and hits else 'needs-review' if hits else 'no-retired-text'
            if hits and not legal and all(not PATTERN.search(line.replace(b'scaleMotionDuration', b'')) for line in data.splitlines()):
                disposition = 'owned-motion-token-substring'
            if PATTERN.search(name.encode()):
                errors.append('retired-filename:' + name)
            if disposition == 'needs-review':
                errors.append('unclassified-retired-text:' + name)
            rows.append({'file': name, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest(), 'matches': hits, 'disposition': disposition})
            if name == 'package/package.json':
                package = json.loads(data)
    if not isinstance(package, dict):
        errors.append('missing-or-invalid-package-json')
    else:
        for group in ['dependencies', 'peerDependencies', 'optionalDependencies', 'devDependencies']:
            for name in package.get(group, {}):
                if RETIRED.search(name):
                    errors.append('retired-package:' + group + ':' + name)
    for name in ['LICENSE', 'THIRD_PARTY_NOTICES.md', 'README.md', 'dist/index.js', 'dist/index.d.ts', 'dist/styles.css']:
        if 'package/' + name not in {row['file'] for row in rows}:
            errors.append('missing-required-file:package/' + name)
    return {'schemaVersion': 1, 'archiveSha256': hashlib.sha256(Path(archive).read_bytes()).hexdigest(), 'pattern': PATTERN.pattern.decode(), 'files': rows, 'errors': errors, 'technicalReferenceAuditPass': not errors, 'legalApproval': False, 'limits': ['All regular archive bytes scanned, including maps and binary assets, for branded ASCII text. No extraction.', 'Binary/text matches require classification; no executable dependency inferred from a substring.', 'Legal hits preserved for review; no notices removed or derived-asset rights approved.', 'Join frozen installed transitive closure and fresh build/source identity separately.']}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('archive', type=Path)
    args = parser.parse_args()
    try:
        result = audit(args.archive)
        print(json.dumps(result, indent=2))
        return int(bool(result['errors']))
    except (OSError, ValueError, TypeError, tarfile.TarError) as error:
        print(json.dumps({'inputError': str(error), 'legalApproval': False}))
        return 2


if __name__ == '__main__':
    raise SystemExit(main())
