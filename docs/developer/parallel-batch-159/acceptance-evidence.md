# Batch 159: D-20 catalogue JSON fixture correction

Prepared October 7, 2026 from exact batch158 head
`ce35a4808138fd5d43ee31266a3633833b66793f` in isolated managed worktree
`/Users/thomashall/.codex/worktrees/736c/sg-ui`, verified clean and detached before
creating `codex/batch159-catalogue-import`. Existing batch158, batch153 and primary
worktrees were preserved. Only this record and
[foundation-catalogue.spec.ts](../../../tests/browser/foundation-catalogue.spec.ts)
change. No production implementation, stories, tokens or configuration change.

Read repository AGENTS.md, the
[development validation policy](../react-aria-development-validation.md),
[parallel browser validation](../react-aria-parallel-browser-validation.md) and
[canonical lease record](../parallel-batch-86/canonical-validation-leases.md).
The requested shortened `parallel-browser-validation.md` filename does not exist;
the linked `react-aria-parallel-browser-validation.md` is the repository guidance.

## Preserved failure and correction

The coordinator reports that Wave48 selection at exact candidate
`979783b99003239a8bffb4871f9067b386ae421c` failed **before build/browser execution**:
Node 24.21.0 requires the `type: json` import attribute for the spec's runtime
import of `src/foundation/tokens.json`. This is fixture/driver loading failure,
not product failure or native evidence. The original failure remains historical
red evidence; this worker did not rerun that candidate or inspect its absent local
artifact directory.

The spec now reads the actual production JSON bytes using
`readFileSync(new URL('../../src/foundation/tokens.json', import.meta.url), 'utf8')`
and `JSON.parse`. A type-only default import retains TypeScript's inferred token
shape and is erased at runtime. Expected values still come from production tokens;
there is no copied token map or `any` replacement. All bytes from `const prefix`
onward are unchanged from the base, preserving all eleven distinct strict cases,
composed/native separation, production comparisons and original keyboard input.
No assertions are weakened and no focus or scroll repair is introduced.

Spec SHA-256: `d854e256ecf3c5b1b9f9fc6107adbd84a52aceb379a7900d538f6f1e6964ad66`.
Spec Git blob: `82ae51875e2cf1238edca1eb3af6ee139d4f9a82`.
Unchanged production token JSON SHA-256:
`01f37daa692cf29c2a58465ec363a53315c86debb5df9f5165dea56a156b1f47`.

## Focused validation

All dependency/type/selection commands used Node **24.21.0**, with
`/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin` prepended to PATH,
pnpm **10.29.3**, TypeScript **5.9.3** and Playwright **1.63.0**.
The tested source was base `ce35a4808138fd5d43ee31266a3633833b66793f` plus the
spec bytes identified above. Only this evidence record was added afterward.

| Command/check | Result |
| --- | --- |
| `pnpm install --frozen-lockfile` | Exit 0; lockfile unchanged. Install warned that esbuild build scripts were ignored; no approval/configuration change made. |
| `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json` | Final exit 0. |
| `pnpm exec playwright test tests/browser/foundation-catalogue.spec.ts --project=chromium --list` | Final exit 0; exactly 11 distinct tests in one file. Selection loads the real spec and JSON; it launches no browser or server. |
| Base comparison from `const prefix` onward | Byte-identical test bodies and helpers. |
| Local evidence links, ownership and `git diff --check` | Passed. |

An initial draft used `typeof import('../../src/foundation/tokens.json').default`.
TypeScript rejected it with TS2694 (browser typecheck exit 2); initial selection
still listed 11 cases with exit 0. The final type-only default import resolves that
fixture typing mistake. Initial and final outputs are retained in ignored local
`artifacts/batch159/{browser-types,catalogue-selection,browser-types-final,catalogue-selection-final}.log`.
Neither selection result is a native or rendered assertion pass.

Owned leases were acquired through `acquireInstallSlot`/`acquireLightSlot` and
released through `releaseLease` after child commands settled:

- Install canonical `slot0` plus legacy `slot-0`, token
  `batch159:install:17f9a2b9-9d7e-4426-932e-831d325657c6`.
- Initial light canonical `slot1` plus legacy `slot-1`, token
  `batch159:light:ce71ceb9-1265-4253-9401-d16969dfcacb`.
- Final light canonical `slot1` plus legacy `slot-1`, token
  `batch159:light:f295bd84-7a1e-4783-b6a8-8b93b22cc544`.

No foreign lease, coordinator durable state, browser queue, shared heavy lock or
other worker source was modified.

## Remaining gates and handoff

**UNRUN:** builds (including Storybook), browser/native/rendered/composed-play
execution, other-engine selection/execution, full checks, unit suites,
foundation/token guards, packed consumers, remote CI, device/OS preferences,
assistive technology and published catalogue artifact validation. The coordinator
owns shared frozen native validation, review and integration. D-20 remains open;
this correction claims only fixture loading and browser TypeScript compatibility.

No merge, push, publication, workflow/permission/secrets changes or shared durable
state edits occurred. The completion report supplies the final commit, both changed
file hashes and clean worktree status; this record cannot embed its own final hash.
