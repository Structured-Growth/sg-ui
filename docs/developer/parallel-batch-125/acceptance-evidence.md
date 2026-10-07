# Batch 125: packaging, dependency, declarations and release evidence

Inspection date: 2026-10-07. Assigned parent criteria: R-05, R-07, R-09, R-13.
Reviewed source head: `e43bf604be74e0daf731bc990e6c3097f05ed89b` (`codex/dev` baseline).
This report is a read-only source/evidence assessment, not an acceptance update.
Only the coordinator may accept parent criteria, integrate changes or schedule validation.
No install, build, test, pack, browser, performance or CI command was executed here.
No production behavior defect was demonstrated; no speculative native regression was added.

## Per-criterion matrix

| ID | Disposition at reviewed head | Exact evidence and supported slice | Remaining gate / owner |
| --- | --- | --- | --- |
| R-05 | Partial; manifest/output contract supported by source | [Manifest](../../../package.json): `files` includes `dist` and legal files, root `types` points at `dist/index.d.ts`, explicit type/import entry conditions and `/styles.css` export exist, CSS is marked side-effectful through `./dist/**/*.css`, and no augmentation entry is exported. [Build](../../../scripts/build.mjs) removes old dist, emits declarations/ESM and compiles styles. [Package guard](../../../scripts/check-package.mjs) checks layers/compiled CSS, export declarations, packed exports/sideEffects, exact packed dist bytes and retired output. [Packed fixture](../../../scripts/test-foundation-consumer.mjs) imports the public stylesheet and asserts production Vite CSS retains tokens and compiled classes. These are implemented assertions, not new passes. | Coordinator: run the existing fresh-build/package/packed-consumer checks in a scheduled window and retain exact tested head, tarball and production CSS output. Historical runs support their own heads only. No current-head bundler execution was performed. |
| R-07 | Partial; current resolution text inspection supported | [Lockfile](../../../pnpm-lock.yaml) version 9 has importer resolutions for the manifest, including direct `react-aria` 3.52.1 and `react-stately` 3.50.0 added in `2b9ca35f097bcc6f99af31c5a95f8682ef2b890e`. No literal `@mui/` or `@emotion/` occurs anywhere in the current lockfile. Neither manifest nor lockfile declares overrides or patchedDependencies; no tracked workspace/patch file was found by the bounded filename search. Snapshot inspection found 104 blocks with `optional: true`, including platform esbuild/Rollup/oxc bindings, wasm helpers, fsevents and tooling options. OptionalDependencies edges remain present and are not ignored by the retired-package literal search. [Progress record](../react-aria-progress.md#public-theme-dependency-removal-and-m-39-presets) records package-manager removal of 44 retired packages without unrelated upgrades at the theme migration; `57abb6df848c424a39c7f4942ad25484926eee0e` removes 539 lockfile lines. | Coordinator: retain package-manager generation/frozen-install proof for the current lockfile and a resolved dependency/optional-platform review on supported runtime jobs. Git diffs and the historical narrative do not prove how the latest lockfile was generated or which optional packages actually installed. No package manager ran in this assignment. |
| R-09 | Partial; emitted-declaration guards and one compiler version implemented | [Package guard](../../../scripts/check-package.mjs) rejects React Aria/Stately/@react-types/@react-stately, retired foundation, Lucide and TanStack references in public/owned declarations; it recursively scans emitted implementation and maps for retired names and compares packed output bytes. Consumer imports are checked with strict tsc, Bundler resolution and `skipLibCheck`. The isolated packed foundation fixture pins TypeScript **5.9.3**, matching the lockfile's compiler; repository devDependency is `^5`. React 18.3/19 fixture variation is not a TypeScript version matrix. | Coordinator owns the supported TypeScript promise and exact-head execution. Define supported compiler versions, run published-tarball imports at those versions and retain logs; evaluate declaration checking with `skipLibCheck` disabled so dependency/declaration errors are not hidden. The string guards cover specified families, not every possible private upstream type. No current emitted/packed declaration artifact was produced or inspected here. |
| R-13 | Partial; requested sequencing/concurrency/history configuration fully supported by source | [Release workflow](../../../.github/workflows/release.yml): main push/manual dispatch, `sgui-release` concurrency with cancellation disabled, release job restricted to main and `needs: validate`, full checkout history (`fetch-depth: 0`), frozen install, build then semantic-release. [Reusable CI](../../../.github/workflows/ci.yml): Node 22.12/24 jobs run check, fresh Storybook and packed consumers; Node 24 additionally requires Chromium/Firefox/WebKit and Next consumer before package upload. Bash + tee preserves failure through runner pipefail. [Release config](../../../release.config.mjs) limits semantic-release to main and `v${version}` tags. [Policy tests](../../../scripts/release-policy.test.mjs) test commit bumps/title policy, not workflow sequencing. | Coordinator/repository owner: verify a successful required-check run at the actual production candidate, main/reusable workflow dependency conclusions, full tag fetch and serialized release behavior. Do not publish to obtain evidence. Source structure proves the configured gate; it does not prove a successful release invocation, external repository rules or broad acceptance. Existing manual/device/AT acceptance remains separate and unwaived. |

## Exact source identities

All following blobs are from the reviewed baseline, independent of this report commit.
Use `git show e43bf604be74e0daf731bc990e6c3097f05ed89b:<path>` to reproduce inspection.

| Path | Git blob |
| --- | --- |
| `package.json` | `f83bab2065c9ae79b31aa6b0aa143b7ae0b2a3f0` |
| `pnpm-lock.yaml` | `d312a82ec958b0badc4633899ec4510cbb655648` |
| `scripts/build.mjs` | `c6e328b74748cda5090c2cf2ccbc582944a7df2d` |
| `scripts/css-modules.mjs` | `32dec71c69010e4208e835be364f726fac2d65fe` |
| `tsconfig.build.json` | `0b3c89983bdafbd25abd9eaf9e7197b11943ae48` |
| `scripts/check-package.mjs` | `744f86595899989d90edc6cf590a757534c58f17` |
| `scripts/test-foundation-consumer.mjs` | `ff994cb7c9eaae3fbab58461c98ab0269a276c9c` |
| `.github/workflows/ci.yml` | `d1d9f200e46767226b6022925c40358680cd40c5` |
| `.github/workflows/release.yml` | `fdc2895cc6e7e48deb9f764dac75b65d6edc8f04` |
| `release.config.mjs` | `ee46e0de3e7545768032184650f0e1cc97f2c006` |
| `scripts/release-policy.test.mjs` | `b1b6c0dfe4661475033d30ba968f4972484bdaf9` |
| `docs/developer/react-aria-runtime-ci.md` | `9319d05492e47bcd15f751d3db7e042aa604fe0e` |
| `docs/developer/react-aria-removal-audit.md` | `0fcffdabebd08a1531bb8a16510a967157921482` |
| `docs/developer/react-aria-progress.md` | `ba00dce42931499695a89c8ae67bf5129007892f` |

## Retained historical evidence and loss limits

The committed [runtime record](../react-aria-runtime-ci.md) reports successful
[run 37559276148](https://github.com/Structured-Growth/sg-ui/actions/runs/37559276148)
at exact `c78a24eb8d5b538833f3a0aca58e428f970b642c` for both runtimes and packed
consumers. Recorded package IDs are `11456077801` (Node 22.12) and `11455963120`
(Node 24); validation IDs are `11456117638` and `11456047789`. Recorded expirations
are 2026-10-21 01:56:55/01:56:27 and 01:56:58/01:56:29 UTC respectively.
These identities are retained in Git; remote availability/content was not checked here.

That record separately reports successful three-engine/eight-consumer run
[37560788949](https://github.com/Structured-Growth/sg-ui/actions/runs/37560788949)
at `7f03a35108bbf861e9b123b646694f64b21bb369`, with browser artifact `11456977272`
expiring 2026-10-21 02:18:34 UTC. On this host `/tmp/sgui-ci-7f03-browser`,
`/tmp/sgui-ci-7f03.log`, `/tmp/sgui-ci-b63-browser` and
`/tmp/sgui-ci-calendar-browser` are **absent**. Historical downloaded-log claims
cannot be replayed from those paths. Later calendar results and failed clipboard/
image-lifetime runs are also distinct heads; none establishes baseline acceptance.
The removal audit's older tarball is explicitly prior-artifact evidence.
No historical result was promoted to a current-head full matrix, main release,
manual/device result or spoken assistive-technology result.

## Checks actually performed and bounded handoff

Performed read-only Git status/head/tree/blob/history inspection; manifest, build,
package guard, packed fixture, workflow and relevant committed record reads;
`rg` searches for assigned parent IDs, declaration/compiler/CSS checks and
lockfile override/patch/optional/retired references; Python standard-library text
inspection of the current lockfile optional snapshot families and existence checks
for the four historical evidence paths. The optional-block count is textual inventory,
not a package-manager graph traversal or executable validation. Also read README,
migration and component architecture guidance. No dependency/runtime commands ran.
Report verification checks relative links, diff whitespace and exclusive changed path.

No source fix handoff is warranted by a demonstrated runtime defect. The concrete
missing validation surface is R-09's supported-compiler matrix. If the coordinator
requests implementation, the minimal exclusive candidate allowlist is
`scripts/test-foundation-consumer.mjs` (parameterize the compiler and declaration
check mode), plus a new uniquely scoped compiler-matrix runner under `scripts/`
if orchestration is required. Its targeted check is strict compilation of the
installed published tarball with owned root/granular/theme imports at each declared
supported version, retaining exact versions/head/tarball and diagnostic logs.
This is a proposed handoff, **UNRUN**, not permission to edit those files here.
R-05/R-07/R-13 instead need scheduled existing validation/evidence review. No new
browser test or story would close these packaging/release gaps.
