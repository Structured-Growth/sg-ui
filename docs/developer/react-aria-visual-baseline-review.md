# Deliberate visual baseline review

This procedure covers the existing eight-case, 48-image representative visual
acceptance matrix. It supplements the component-family hardening review receipts;
it does not replace those accepted observations or expand them to all states.

Run on the coordinator's frozen docs-native host after acquiring the existing
serial validation lease. Record package/fixture/source hashes, browser/OS versions,
fonts and the interaction result. Keep failures and unsupported environments.
The config starts no host. Set `SGUI_VISUAL_BASE_URL` to its loopback origin and
`SGUI_VISUAL_OUTPUT` to a new absolute directory. Use the same browser/OS/font
runtime for capture and comparison. No update-snapshot CLI flags are accepted.

From `packages/ui`, with Node22.12+ or24 and the installed pinned tools:

```sh
SGUI_VISUAL_MODE=capture pnpm exec playwright test --config playwright.visual-acceptance.config.ts
```

Capture mode writes only candidates under `$SGUI_VISUAL_OUTPUT/candidates`. They
are not approved baselines. A capture run must finish all eight cases with no
warnings/errors before review. Inspect every image at native size; examine focus,
clipping, selection, contrast, RTL flow and loading/error/empty content. A rejected
or deferred image needs a defect/follow-up and cannot participate in comparison.
A corrected capture needs a new directory; never update images to clear a failure.

After actual review, create a schemaVersion1 JSON receipt with:

- `reviewer`, ISO `reviewedAt`, `engineVersion`, `osVersion`, `fontEnvironment`,
  and `reason`, describing the actual review environment and decision.
- `source`, `host`, and `interaction`: each `{path, sha256}`. Paths are relative
  to the repository. `source` points to `{files: {repositoryRelativePath: sha256}}`
  containing the relevant complete source/fixture/assertion/style/token closure.
  For durable regression comparisons, add `provenance` to that manifest:
  `{kind: "git-and-artifact-snapshot", commit: "FULL_REVIEWED_COMMIT", artifactSnapshot: {path: "repository/relative/historical-artifacts.json.gz", sha256: "ARCHIVE_SHA256"}}`.
  The checker reads tracked file bytes from that immutable Git commit, not HEAD or
  the working tree. Files absent from that commit (including ignored compiled
  package/host assets) are retained in one deterministic gzip JSON archive:
  `{schemaVersion: 1, files: {repositoryRelativePath: base64Bytes}}`. Its path and
  SHA-256 are pinned in `artifactSnapshot`. Every entry is path/format/hash checked;
  missing or unexpected entries fail. The checker decompresses in memory with a
  size bound and never extracts files. Preserve original paths and reviewed hashes. Git content mismatches, missing
  commits/artifacts and artifact escapes fail. Provision that exact Git object
  and retained packed artifact snapshot in CI; the checker never fetches or substitutes HEAD. The manifest itself remains bound
  by the review receipt's SHA-256. Legacy manifests without provenance retain
  their original current-tree check and need explicit migration before comparing
  a changed candidate.
  `host` identifies the exact immutable served assets; `interaction` identifies
  the successful native run. Include the spec, config, review helper, fixture,
  package output and shared styles/tokens; a selective manifest is not a full
  host attestation. Retain every referenced artifact. The checker verifies bytes,
  not manifest completeness, runtime success or who performed the review.
- `images`: exactly48 entries from `visualBaselineNames`, exported by
  `scripts/visual-baseline-review.mjs`. Each entry contains `name`, `path`
  relative to the candidate baseline directory, `sha256`, `disposition` and
  a concrete `observation`. Only `accepted` is admissible. The image basename
  must match `name`; symlinks or paths escaping the baseline root are rejected.

Keep original/replacement/diff images and their hashes for later changes. Explain
each delta rather than copying observations from earlier reviews. This tool checks
record integrity; it cannot authenticate reviewer identity or perform visual review.
No generated template is an acceptance record.

Before each comparison, record the admitted **current candidate** independently
from the historical baseline. From `packages/ui`, set these absolute paths inside
the repository; candidate and output destinations must be fresh and outside the
input directories inventoried below. The baseline and review remain unchanged.

```sh
export SGUI_VISUAL_MODE=compare
export SGUI_VISUAL_BASE_URL=http://127.0.0.1:6173
export SGUI_VISUAL_BASELINES=/absolute/repository/evidence/reviewed-capture/candidates
export SGUI_VISUAL_REVIEW=/absolute/repository/evidence/reviewed-baseline-provenance.json
export SGUI_VISUAL_CANDIDATE=/absolute/repository/evidence/new-comparison/candidate.json
export SGUI_VISUAL_OUTPUT=/absolute/repository/evidence/new-comparison/output
```

Generate the source/fixture/assertion/style/token/build-output/served-host inventory
only after the coordinator admits the candidate build and immutable host. This
records bytes; it does not prove source-to-build attribution or approve a baseline.
The generator refuses symlinks and never overwrites an existing candidate manifest.

```sh
node --input-type=module <<'JS'
import {createHash} from 'node:crypto';
import {lstatSync, readdirSync, readFileSync, mkdirSync, writeFileSync} from 'node:fs';
import {resolve, relative, dirname, isAbsolute} from 'node:path';
const root = resolve('../..');
const destination = process.env.SGUI_VISUAL_CANDIDATE;
if (!isAbsolute(destination ?? '') || relative(root, destination).startsWith('..')) {
  throw Error('Candidate manifest must have an absolute path inside the repository');
}
const files = {};
function inventory(path) {
  const stat = lstatSync(path);
  if (stat.isSymbolicLink()) throw Error('Symlink input rejected: ' + path);
  if (stat.isDirectory()) {
    for (const name of readdirSync(path).sort()) inventory(resolve(path, name));
  } else if (stat.isFile()) {
    files[relative(root, path)] = createHash('sha256').update(readFileSync(path)).digest('hex');
  } else throw Error('Non-file input rejected: ' + path);
}
for (const path of ['src', 'scripts', 'tests/browser', 'dist', 'browser-docs-static',
  '../../apps/docs/native-fixtures', '../../apps/docs/theme', 'package.json',
  'tsconfig.json', 'playwright.visual-acceptance.config.ts', '../../package.json',
  '../../pnpm-lock.yaml', '../../pnpm-workspace.yaml', '../../apps/docs/package.json',
  '../../apps/docs/tsconfig.json', '../../docs/developer/react-aria-visual-baseline-review.md']) {
  inventory(resolve(path));
}
mkdirSync(dirname(destination), {recursive: true});
writeFileSync(destination, JSON.stringify({files: Object.fromEntries(Object.entries(files).sort())}, null, 2) + '\n', {flag: 'wx'});
JS
export SGUI_VISUAL_CANDIDATE_SHA256="$(node --input-type=module -e 'import {createHash} from "node:crypto"; import {readFileSync} from "node:fs"; process.stdout.write(createHash("sha256").update(readFileSync(process.env.SGUI_VISUAL_CANDIDATE)).digest("hex"));')"
pnpm exec playwright test --config playwright.visual-acceptance.config.ts
```

Retain the exact candidate manifest/hash, command/environment, build/host/runtime/
font admissions and before/after stability with the comparison receipt. The pinned
manifest has `{files: {...}}` and no historical `provenance`: both config admission
and the actual screenshot entry validate its bytes and current files. Unrecorded
candidate drift or manifest changes fail independently of historical baseline
validity. Do not regenerate the manifest in place or refresh baseline images to
clear a failure; record intentional candidate changes in a new destination.

Comparison refuses missing/stale/unreviewed images, validates the historical
baseline and separate candidate, and sets `updateSnapshots: 'none'` with
`maxDiffPixels: 0`. Never pass `--update-snapshots` or `-u`.
A new candidate may change source and compiled output; it is compared against
historical reviewed pixels. Keep the approved baseline source/host artifacts,
images and receipt intact. A tampered/missing historical artifact invalidates the
baseline; an unrecorded candidate change invalidates the candidate. Preserve
zero-pixel thresholds and failures. Do not refresh images to clear differences.

When migrating an already reviewed baseline, first verify the new immutable commit
contains the exact reviewed bytes for every tracked manifest entry. Copy each
non-Git entry from its retained reviewed output into a fresh deterministic gzip JSON map and
verify its original hash before packing and after decoding; never substitute current candidate bytes.
Pin the archive bytes by SHA-256 and retain it as one artifact, not thousands of compiled Git files. Keep the
original manifest and review receipt. Root must explicitly audit and approve a
provenance-only amendment that binds the new manifest while preserving all image
hashes and actual observations. Record the original/new manifest hashes, immutable
commit and amendment reason/date. Neither this gate nor a migration script may
approve images or silently rewrite an existing acceptance decision.
The coordinator must separately confirm that the running host matches the recorded
asset manifest. This gate does not inspect a remote process or prove speech,
physical touch, actual browser zoom, legal approval or release readiness.
