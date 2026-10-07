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
| `tests/browser/batch01-adapters.spec.ts` | `a662ddd5b0a1919f9fb64ef42254076144f29b8ded9f6e8819e0fe33979aa3d1` |
| `src/adapters/adapters.stories.tsx` | `2ad4f2fcfdca8745da4dbcb0df95a7b659237e2942c3daa28ef9f1f7d4eb1753` |
| `src/adapters/Link.tsx` | `632109fad519074531c2f305903bc2304a6ab01157a89950428d702adb3c05fa` |
| `src/adapters/navigation.tsx` | `6c961ccfaf1239ab7871c63d3593fd10dc4525dcbfec4b5965a59416c93e220e` |
| `pnpm-lock.yaml` | `786f56018e5278bc36f59b02d0c2d2ee0ab2df7fc7883178aeb4b9deb3d13438` |

## Coordinator native selection and pending evidence

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
Source scope stays reserved until that proof returns. Chromium is pending at this
prepared handoff; Firefox/WebKit remain pending for the checkpoint.

Historical red evidence remains applicable only as a limitation: batch-01
Firefox failed before loading with `Could not find profile folder`, including
the worktree-local TMPDIR retry. The earlier Chromium/WebKit passes do not attest
the final custom-router story. An incomplete historical Node 24 CI job is not
inferred successful. This prepared change has no native result yet.
