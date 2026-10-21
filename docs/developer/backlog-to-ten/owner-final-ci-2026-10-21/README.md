# Accepted official checkpoint — 2026-10-21

A-R-12 and DOCS-005-l close against successful Actions run
[39682728117](https://github.com/Structured-Growth/sg-ui/actions/runs/39682728117),
exact source `fbc08a12a501aaf6982b1d090582c23d09900095`. DOCS-005 closes with its
last required leaf; it is not an additional task in the backlog count.

The [review](review.json), [run](run.json), [jobs](jobs.json),
[artifact inventory](artifacts.json) and [collection receipt](receipt.json) retain
the exact scope and identities. Node 22.12.0 and Node 24.22.0 both pass all 2,009
unit cases in 316 files, required package/type/import/token/CSS checks, fresh
native fixture builds and the applicable installed React 18.3/19 foundation,
editor, Flight and Next consumer gates. The full docs suite passes 247 cases.

All 834 native tests were collected independently for each engine. Chromium passes
834, Firefox passes 828 with six existing skips, and WebKit passes 829 with five
existing skips. There are no unexpected or flaky results. The review lists every
skip and its existing reason: Chromium-only CDP autofill/clipboard denial and
Firefox's unsupported Playwright hasTouch context. These are recorded limits,
not manual device or spoken-AT observations.

All eleven required official artifacts were downloaded through GitHub's API;
archive SHA-256 values match API digests. Extraction rejected unsafe paths,
duplicates, symlinks and oversized archives. Both runtime download verifiers pass,
joining the actual tarballs, packaged notices and outputs to exact-head build
receipts and the complete native-engine evidence. The 1,869 library distribution
files are byte-identical between the two supported runtimes. Stylesheet SHA-256
is `03fa0472abdedda04500df89274b61ae8d92be225ef6482361d6e81c5d19850f`.
The deterministic CSS repair and shared exact Node 24 pin retain strict equality.

Raw downloaded archives, extracted reports/logs and packaged files are retained
locally at the ignored directory named in `review.json`; they are not committed.
The inventory records each official artifact's name, ID, digest and expiry.
The collector treats downloaded files as data and never executes them. A local
watcher TLS timeout was retried against the same run; no failed CI result was
reclassified as successful. Earlier failed/superseded checkpoints remain separate.

Frozen installs, production docs/library builds, source/runtime/CI guards and the
full native/consumer gates establish the automated Storybook-removal acceptance
scope. Existing native scenario mappings and assertions are retained in their
new host. Manual AT/device/visual/support acceptance, licensing, repository trust/
protection controls, hosting and publication remain separate tasks. No main
promotion, tag, publication or repository-setting change was performed.

To reproduce API collection and verification, use the retained `collect-ci.py`
with the run ID, full checked head and a fresh lowercase output name. It refuses
non-successful runs and existing destinations. The checked-out trusted verifier
must still match the reviewed validation policy; downloaded code is never run.
