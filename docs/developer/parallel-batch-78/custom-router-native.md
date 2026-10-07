# Batch 78 — custom host-router native evidence

Task slice: H-01/H-03/H-04/U-10 final-story browser evidence. This completes a
missing evidence item identified in the [batch-01 adapter report](../parallel-batch-01/adapters.md),
whose native passes preceded the final custom-router story commit
`cd8f34a1bf7c755b80314a76135024f58e2aa403`. No product defect is asserted.

## Scope and review location

Baseline: `521e28426679adc4829128ecbedb500bcdeedb1d` (`codex/dev`).
Worktree: `/Users/thomashall/.codex/worktrees/23a1/sg-ui`.
Branch: `codex/batch78-custom-router-native`.
Exclusive writes: `tests/browser/batch01-adapters.spec.ts` and this report.
The final frozen prepared commit is supplied in the coordinator handoff, so the
report does not attempt a self-referential commit identifier.

The existing `Routing` story supplies an actual host-provided `CustomLink` through
`SGNavigationProvider`. The dedicated case verifies its anchor href, forwarded
attributes and native ref focus, Enter and pointer activation, exact replace
callback sequences and shared host pathname updates. The iframe URL must remain
unchanged; the host adapter owns route state. Ref focus is verified again after
host rerenders. Exact event text detects duplicate navigation callbacks.
The former weaker custom-router assertions were moved out of the broad adapter
case into this independently selectable case; native fallback/download/external
and account coverage remain in that file.

No production source, story or host API was changed. Custom-router cancellation,
modified activation, target and download fixtures are absent from the current
custom-provider subtree; the corresponding default-adapter story controls do not
establish custom-router proof. Those cases would need explicitly authorized story
fixtures. This slice does not claim real Next.js/framework routing integration,
whole H/U acceptance, physical devices or assistive-technology behavior.

## Lightweight preparation

Node `v24.19.0`, using
`/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin`.

- `pnpm install --frozen-lockfile`: passed under an atomic owned install slot;
  no tracked lockfile changes. pnpm reported ignored esbuild build scripts.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed under an owned
  light slot.
- `pnpm exec playwright test tests/browser/batch01-adapters.spec.ts --project=chromium --grep 'custom host router Link forwards native ref focus and owns keyboard and pointer routes$' --list`:
  passed, exactly **1 test in 1 file**.
- `git diff --check`: passed.

Typechecking and listing are not native execution. No local browser or Storybook
build ran. No whole `pnpm check`, GitHub CI rerun/dispatch or title run was requested.
Install/light leases were released after their commands settled.

## Frozen byte hashes (SHA-256)

| File | SHA-256 |
| --- | --- |
| `tests/browser/batch01-adapters.spec.ts` | `a325b361529b1fd86c8e44d93fe232a89200d55c8e7f68bd05ddae3aec63af4f` |
| `src/adapters/adapters.stories.tsx` | `2ad4f2fcfdca8745da4dbcb0df95a7b659237e2942c3daa28ef9f1f7d4eb1753` |
| `src/adapters/Link.tsx` | `632109fad519074531c2f305903bc2304a6ab01157a89950428d702adb3c05fa` |
| `src/adapters/navigation.tsx` | `6c961ccfaf1239ab7871c63d3593fd10dc4525dcbfec4b5965a59416c93e220e` |
| `pnpm-lock.yaml` | `786f56018e5278bc36f59b02d0c2d2ee0ab2df7fc7883178aeb4b9deb3d13438` |

## Coordinator native selection

Exact focused args:

```json
["tests/browser/batch01-adapters.spec.ts", "--project=chromium", "--grep", "custom host router Link forwards native ref focus and owns keyboard and pointer routes$"]
```

Snapshot shard equivalent (one expected case):

```json
{
  "id": "batch78-custom-router",
  "specs": ["tests/browser/batch01-adapters.spec.ts"],
  "project": "chromium",
  "grep": "custom host router Link forwards native ref focus and owns keyboard and pointer routes$"
}
```

The coordinator owns exact-head review, queue admission, a fresh Storybook build
and focused Chromium supervisor execution per the
[development policy](../react-aria-development-validation.md) and
[parallel browser policy](../react-aria-parallel-browser-validation.md).
The corrected focused Chromium execution passed as recorded below. The source
reservation is released after final report handoff; Firefox/WebKit remain pending
for the checkpoint.

## Passed native proof and final report

Coordinator wave 39 freshly built Storybook, typechecked browser sources and ran
exactly **1 Chromium case**, passed at retry zero, from executable head
`0707b97c33a89cf494bb2b245962a7698510b4b8`. Evidence:
`artifacts/browser-pool/b234c72f-dd74-4363-a8f8-37a095bd905b/evidence.json`
inside this worktree. Supervisor owner token:
`browser-snapshot:23766:7f9d9b90-d5e4-45bb-955f-f4c5cca7b335`.
Queue owner: `01a1164f-41db-7f30-aaf9-f20133b6566f`.
The selection used the anchored spec argument
`(?:^|/)tests/browser/batch01-adapters\.spec\.ts$`, project Chromium and the
exact grep above. Port: 6853. Node: `v24.19.0`; Playwright: `1.63.0`.

| Attestation | Value |
| --- | --- |
| Source digest, before/after | `c27a342ca93f11de9ce9540a030f97db8697a79dbd3ecb165bae0b6aa6e384f7` |
| Immutable build digest, before/after | `2f65e5a719bef9720b1cd6e44fdf818856e7d0c678d149d1f70dda5b3900a7b2` |
| Harness SHA-256 | `2a356b667f224018b0e51f1c698e5d7ae044857cbd6e1ddddae96aa786efb1d2` |
| Final tested head | `0707b97c33a89cf494bb2b245962a7698510b4b8` |

The supervisor recorded clean final status, matching source/build digests, owned
commands settled and no owned processes after completion. The coordinator verified
released owned locks. Both keyboard and pointer paths completed, including native
ref focus after rerender and exact callback ownership. This proves this one
custom-router case on Chromium, not the entire adapter spec or a complete adapter
browser matrix. No worker browser/build or cleanup ran.

The final commit changes only this report; executable spec/story/source/lock bytes
remain identical to the tested head. Its exact final commit is in the coordinator
handoff. Firefox/WebKit, real framework integration and broad H/U/X/R/Z/manual,
physical-device and assistive-technology acceptance remain open.

## First native run and fixture correction

Coordinator wave 38 ran the focused Chromium case against fresh immutable
Storybook from `85aa6acdf805b15cc047e0f1cdbe0d9163b14e02`. It failed at the first
URL expectation (then line 52): Storybook serialized `globals=a11y.manual:!true`
as `globals=a11y.manual%3A!true`. Ref/href, Enter, pathname and exact callback
assertions passed before that failure; later pointer assertions were not executed.
This is a URL serialization expectation defect, with no confirmed product defect.
Red evidence is retained at
`artifacts/browser-pool/28119853-73c0-4e3a-993f-212036924d68/evidence.json`
inside this worktree. Coordinator reported exact-head/source/build attestation,
settled commands and released owned locks.

The corrected expectation canonically serializes URLSearchParams for both captured
and current URLs, preserving origin, path, hash and every decoded query entry
(including id, viewMode and globals). Both keyboard and pointer route guards retain
that comparison. No query checks, route guards or assertions were removed; no
sleeps or retries were added. Production/story bytes remain unchanged. Browser
TypeScript, the one-case list and diff checks are rerun for the corrected handoff.

Historical red evidence remains applicable only as a limitation: batch-01
Firefox failed before loading with `Could not find profile folder`, including
the worktree-local TMPDIR retry. The earlier Chromium/WebKit passes do not attest
the final custom-router story. An incomplete historical Node 24 CI job is not
inferred successful. The failed first run does not establish a native pass.
