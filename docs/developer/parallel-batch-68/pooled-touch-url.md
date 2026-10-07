# Batch 68: pooled touchscreen test navigation

## Scope and frozen source

This bounded browser driver correction starts from reviewed `codex/dev` ref
`1e3a6dc7c5cada97b463031078adc59f4c606694` in the attached managed worktree
`/Users/thomashall/.codex/worktrees/batch68-pooled-touch-url/sg-ui`.
Only `tests/browser/reorder.spec.ts` and this report are changed. The final
commit SHA is delivered in the coordinator completion message; the worktree
remains clean and frozen for composition with batch 59's separately owned focus work.

Corrected spec SHA-256:
`48485ccc9c464397fd72577dd9750db494e5ecc4655683b5bd42dc3e4a82a169`.

## Before and after

Wave 30 served the isolated pool on port 6613, but the manually created touch
context navigated to `http://127.0.0.1:6173${storyUrl}`. The touch case failed at
line 125 with `page.goto: net::ERR_CONNECTION_REFUSED`, before its interactions.
This is a confirmed test-driver URL defect. The separate Strict Mode focus
failure belongs to batch 59 and is not resolved or reclassified here.

Retained red evidence, read without modification:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/80b00fee-f55f-45e8-88dc-4666223d88cc/pointer-drop-focus/browser.log`.
Its SHA-256 is
`85476c1f51d9ecef55c9872997660aeaab1175a71de6ffed0f69c7f47cd3bb8a`.
That run reported nine passes and two failures; it is not passing evidence.

The touch case now requests Playwright's `baseURL` fixture, passes it into
`browser.newContext`, and navigates to the relative `storyUrl`, matching the
existing configured harness contract. The configured origin therefore follows
the pool's selected port. Touch emulation, viewport, three native taps, commit
and rollback order checks, trusted-event checks, runtime error checks, context
cleanup and all other cases are unchanged. No production, configuration,
scheduler or other browser-spec edits were made; retries remain zero.

## Targeted local validation

Followed [development validation](../react-aria-development-validation.md) and
[parallel browser validation](../react-aria-parallel-browser-validation.md).
Runtime: Node `v24.19.0` via
`/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin`.

- `pnpm install --frozen-lockfile`: passed under an atomic owner-exclusive
  `/tmp/sgui-install-slots/slot0` claim, released by the same owner.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed under an atomic
  owner-exclusive `/tmp/sgui-light-validation-slots/slot0` claim.
- Inline Node/TypeScript mocked driver regression: passed. It transpiles the
  actual spec, captures the registered touch callback, and invokes it with
  mocked browser contexts and baseURL fixtures at 6173, 6613 and 6673. Each
  context receives that exact baseURL and retains touch/viewport settings;
  relative navigation resolves to that origin and `finally` closes the context.
  It stops before native interactions and is not browser proof.
- Exact baseline comparison: passed after applying only the three intended
  replacements to the reviewed baseline. All remaining source bytes, including
  interactions and assertions, match. The first inline diagnostic attempted an
  inverse replacement and matched an earlier pointer case's relative goto;
  that diagnostic failed. It was corrected to compare forward replacements
  from the baseline; no spec or assertion changes were needed.
- `git diff --check`: passed. Lightweight claims were released by their owners.

## Required coordinator native proof: pending

No browser, Storybook build, scheduler, broad audit or GitHub Actions run was
launched by this worker. Before integration, the coordinator must compose this
exact corrected source with batch 59, build once from that clean committed head,
and record fresh Chromium evidence on a non-default pool port (for example
6613). The required focused arguments are:

```text
tests/browser/reorder.spec.ts --project=chromium --grep touchscreen non-drag Move alternative commits and rolls back with trusted touch input$
```

Pass `--grep` and its value as separate arguments. Snapshot shard selection:

```json
{
  "id": "batch68-pooled-touch-url",
  "specs": ["tests/browser/reorder.spec.ts"],
  "project": "chromium",
  "grep": "touchscreen non-drag Move alternative commits and rolls back with trusted touch input$"
}
```

If the coordinator's combined shard already owns `reorder.spec.ts`, retain that
single ownership and run the whole file or include the touch suffix in its
existing bounded filter. Do not duplicate the spec across shards. Preserve all
rollback/focus/callback assertions in the combined selection. Record the exact
composed SHA, selected port, command, result JSON and retained log. Chromium,
Firefox/WebKit, physical-device and broad native acceptance remain unverified
by this correction until their respective evidence exists.
