# Batch 11: saved-document serialization (E-02/E-07 partial)

## Scope and findings

Baseline: `d0fcc6298004ad23d1a75480b216b39142e6df96`.
Worktree: `/Users/thomashall/.codex/worktrees/batch11-editor-serialization/sg-ui`.
Branch: `codex/batch11-editor-serialization`; draft PR base: `codex/dev`.

The baseline had no dedicated pure `serializeEditorDocument.test.ts` suite.
`OwnedLinkNode.test.ts` covers live link export/restoration and destination behavior;
`editorConfig.test.ts` covers restoration of representative registered rich nodes.
Neither directly exercises frozen arbitrary input or opaque metadata with
`type`, `root` and `children` keys. Composed formatting/dialog/floating tests use
the serializer, but do not establish that pure traversal boundary independently.

Five new colocated tests establish:

- Nested internal `sgui-link` nodes become public `link` nodes through document
  `root` and node `children`, including table/list structures and standalone links.
  Existing links, autolinks, URL/target/rel/title and rich text formatting survive.
- Deeply frozen input serializes without mutation; traversed nodes/children arrays
  are copied. This does not promise a deep clone of opaque metadata.
- Envelope, root, image and link metadata outside structural traversal survives,
  even with nested `type: "sgui-link"`, `root` and `children` fields. Shared frozen
  metadata retains its identity.
- Arrays, unknown node types, primitive values, null roots and non-array children
  retain their values; actual structural child links still convert.
- JSON encode/decode retains the public schema and opaque metadata, and a second
  serialization is stable.

All cases passed the existing implementation. No demonstrated traversal/schema
defect required a production change. Only the test file and this evidence record
changed. There are no UI, plugin, public API, dependency or architecture changes;
no changed-state story is needed.

## Targeted local validation

Runtime: Node `v24.21.0`, pnpm `10.29.3`, Vitest `4.1.11` on macOS.
The existing `/tmp/sgui-run24.mjs` wrapper prepends the installed Node 24 binary
from `/tmp/sgui-node24-path.log` to PATH before invoking pnpm.

Commands run from the worktree:

```sh
node /tmp/sgui-run24.mjs install --frozen-lockfile
node /tmp/sgui-run24.mjs exec node --version
node /tmp/sgui-run24.mjs exec vitest run src/components/PageRichTextEditorSection/lexical/serializeEditorDocument.test.ts src/components/PageRichTextEditorSection/lexical/editorConfig.test.ts src/components/PageRichTextEditorSection/lexical/OwnedLinkNode.test.ts
node /tmp/sgui-run24.mjs exec vitest related --run src/components/PageRichTextEditorSection/lexical/serializeEditorDocument.ts
git diff --check
```

Installation succeeded without lockfile changes. The explicit selection passed
3 files / 19 tests. The related selection passed 8 files / 51 tests, including
composed editor formatting, dialog and floating-toolbar consumers. Diff whitespace
checks passed. The final tested commit is recorded in the PR/coordinator report
rather than embedded in its own commit.

## Limits and next bounded work

This is pure saved-JSON regression coverage, not a claim of complete E-02/E-07
acceptance or validation of arbitrary metadata by Lexical's node import/export.
Serialization preserves saved destinations; the existing owned link policy governs
rendered activation. No sanitizer, trust policy or host asset authorization changes
are introduced. Broad native/device/assistive-technology and production validation
remain open.

No heavy build, Storybook, browser or packed-consumer process was necessary, so
this task did not acquire or modify the shared heavy-validation lock/queue. GitHub
CI/title runs for `codex/dev` remain user-paused. No full-suite pass is claimed.

A separate bounded E-02/E-07 task can examine registered node import/export metadata
roundtrips or remaining rich-content trust cases, after checking existing coverage.
Do not infer those guarantees from these pure traversal tests.

Central guidance remains [development validation policy](../react-aria-development-validation.md)
and [editor section contracts](../react-aria-editor-section.md). No central guidance
or broad acceptance checkbox was changed by this task.
