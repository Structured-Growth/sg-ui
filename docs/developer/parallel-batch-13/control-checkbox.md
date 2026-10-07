# Batch 13: control-checkbox

Task slices: U-04/U-18 (and checkbox association U-05). This is focused automated
acceptance evidence, not whole-task or manual/device/AT gate completion.

## Isolation and scope

Verified baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
Managed worktree created and attached before edits:
`/Users/thomashall/.codex/worktrees/batch13-control-checkbox/sg-ui`.
Branch: `codex/batch13-control-checkbox`. Draft PR base: `codex/dev`.
Coverage commit: `797a1fa5ecd27f259915d9f5479e3e6d562fe44a`.
Draft PR: [#83](https://github.com/Structured-Growth/sg-ui/pull/83), base `codex/dev`.
Report commit: `dabc649` (subsequent report-only updates have their final head in the
coordinator message; a commit cannot contain its own hash).

Exclusive write allowlist:

- `src/experimental/Checkbox/`
- `tests/browser/batch13-control-checkbox.spec.ts`
- `docs/developer/parallel-batch-13/control-checkbox.md`

No shared guide, barrel, configuration, dependency, workflow or other module edits.
No product defect was demonstrated by the targeted baseline regressions, so runtime
behavior and public API are preserved. The implementation change is a ref JSDoc only.

## Existing evidence and added combination

[Batch 01 forms](../parallel-batch-01/forms.md) already records mixed serialization,
required blocking, checked/unchecked values, resets and controlled host rejection.
`Checkbox.test.tsx` already covers Space, mixed host authority, disabled/read-only,
description/error association, reset and mixed serialization. These are existing
coverage, not new batch 13 achievements.

The added combination covers disabled fieldset inheritance, enabling the fieldset
and required mixed checked/unchecked validation, label activation, submitting
underlying checked values, rejecting a controlled mixed request, native reset and
disabling the fieldset again. The ref test/story establishes the current boundary:
`ref` targets `HTMLLabelElement`; its native `control` is the nested input that owns
focus/validation. The component does not introduce a second input-ref API.

Tests were written before any runtime fix. Seven checkbox unit tests passed at
baseline behavior, including the two new fieldset/ref cases and an added mixed
assertion in the existing rejection case. The new `FieldsetAcceptance` story is a
host-owned form fixture using owned Provider/Button/Checkbox and supplied labels.
No library-owned string, translation contract or styling changed.

## Validation

Runtime: bundled Node `24.19.0`, pnpm `10.29.3`, React `19.2.3`.

- `pnpm install --frozen-lockfile`: passed, 608 packages; acquired atomic install
  slot with owner token and released only own slot in finally. No lockfile edits.
- `pnpm exec vitest run src/experimental/Checkbox/Checkbox.test.tsx --maxWorkers=1`:
  1 file / 7 tests passed, twice (second run adds mixed rejection assertion).
  Each run acquired a global light-validation slot and released only own slot.
- `pnpm typecheck`: passed.
- `pnpm foundations:check`: passed owned import/layer/token boundaries.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- Focused native execution: queued for coordinator browser-pool pairing, not passed.
  No native build/suite has run from this task. The earlier serialized attempts
  returned occupied/priority-queued without acquiring or launching anything.
- `git diff --check`: passed before coverage commit.

Browser/build ownership follows `/tmp/sgui-parallel-batch-01-validation.lock` and
`/tmp/sgui-browser-validation-priority.json`. The priority queue is honored; queued
checks are not passes. No other owner is stopped or removed. On coordinator pool approval, standalone
validation attempts stopped; coordinator pairing now owns native dispatch. No full `pnpm check`,
full browser suite, consumer build or GitHub CI/title run is requested for this slice.

## Review and reserved follow-ups

Keep the public label ref; changing it to an input would alter the existing API.
The shared [primitive guide](../react-aria-primitives.md) currently says native input
ref for Checkbox. Reserve a documentation-only coordinator task to change that row
to label ref and document `label.control` for native focus/validation. The prior
forms report and implementation already agree on label ref. This guide is outside
the exclusive write allowlist and is untouched here.

Broader externally associated forms, autofill, physical-device and assistive
technology acceptance remain open. No runtime fix or new API is justified by the
passing assigned regressions. Keep any engine/environment failure separate from
product acceptance.
