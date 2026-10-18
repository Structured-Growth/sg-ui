from pathlib import Path
import difflib
import hashlib
import json
root = Path.cwd()
own = root / 'docs/developer/final-acceptance/wave-04/13'
patch = (own / 'provenance-wording.patch').read_text()
newfiles = {}
for path in sorted((own / 'proposed-files/packages/ui/scripts').glob('*.py')):
    name = path.relative_to(own / 'proposed-files').as_posix()
    if (root / name).exists():
        raise ValueError('Review unexpected existing target before integration: ' + name)
    patch += ''.join(difflib.unified_diff([], path.read_text().splitlines(True), fromfile='/dev/null', tofile='b/' + name))
    newfiles[name] = {'before': 'absent', 'proposedSha256': hashlib.sha256(path.read_bytes()).hexdigest()}
(own / 'implementation.patch').write_text(patch)
(own / 'implementation-preconditions.json').write_text(json.dumps({'existingFiles': json.loads((own / 'patch-preconditions.json').read_text()), 'newFiles': newfiles}, indent=2) + '\n')
