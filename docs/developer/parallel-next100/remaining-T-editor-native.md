# Remaining editor native regression proof

Assignment: `T-C25-02`, `T-C34-10`, `T-S15-04`, `T-S16-01`. Prepared at exact head
`1c8a4e4d2eb75479c5581c009eaacf5f3209aee4`. All matching F leaves are checked;
these four T leaves remain open. Root owns central acceptance and native execution.

Existing browser assertions cover all four named criteria. **No new spec or case
is necessary.** This report selects existing cases without modifying editor source,
stories, tests, object URL ownership or host upload behavior.

| Leaf | Existing case | What a successful native outcome would establish |
| --- | --- | --- |
| T-C25-02 | [inventory-selection-boundary.spec.ts:75](../../../tests/browser/inventory-selection-boundary.spec.ts#L75), “nested ancestor scroll and inner boundary collision reanchor the selected line” | Real mouse-created selection; native Range/toolbar rectangles; host scrolling reanchors within boundary and flips below the selected line. Geometry is measured, never mocked. |
| T-C34-10 | [editor-clipboard.spec.ts:38](../../../tests/browser/editor-clipboard.spec.ts#L38), “native multiline paste, undo/redo, serialization and read-only copy: ${theme}” | Native keyboard Select All/Copy from the read-only document pastes only its two lines into the host destination; trusted browser copy/paste events are attached. Selected-text inspection alone cannot establish clipboard bytes. |
| T-S15-04 | [editor-links.spec.ts:16](../../../tests/browser/editor-links.spec.ts#L16), “saved links retain host schema and reject unsafe activation; new tabs isolate opener: ${theme}”; [editor-links.spec.ts:52](../../../tests/browser/editor-links.spec.ts#L52), “native pasted links share the saved destination policy through reload: ${theme}” | Saved rejected links remain inert on ordinary/middle activation in editable/read-only modes; native pasted rejected links render inert, retain rich children and remain inert through reload/read-only activation. |
| T-S16-01 | [editor-image-lifecycle.spec.ts:13](../../../tests/browser/editor-image-lifecycle.spec.ts#L13), “local image undo/read-only lifetime and document cleanup: ${theme}” | Native undo removes the image; redo restores the same object URL and decoded PNG. It is retained through read-only and released on document reset/unmount. Instrumented URL methods still call the real browser implementations. |

This is five logical cases, nine light/dark-expanded cases per engine, or 27 if all
three engines are selected. These are **planned counts**, not observed passes.
The geometry case has one existing theme configuration. No engine matrix closure
is proposed from a single engine outcome.

The frozen daily checkpoint at `dfe9d8a67f7df4cb41c4ad6192115c60e7ba4f5c`
passed install/check, built Storybook and ran sixteen early browser sessions before
its load ceiling aborted the snapshot. None of these four editor spec files was
executed. Its 90 aggregate passes therefore contribute **zero assigned editor
passes**. Snapshot records say “owned commands settled”; source and build digests
match before/after. Root must independently review queue/lease settlement before
scheduling the selected cases. All four selected spec byte hashes match that frozen
head and the current assignment head.

The external receipt retains exact evidence paths, SHA-256 of inspected inputs and
checkpoint command logs, prior leaf holds, planned selections and resource outcome:
`/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/remaining-T-editor-native.json`.
Original clipboard/image `/tmp` raw outcomes and historical tested heads remain
unavailable; prior jsdom selection/geometry is partial evidence only.

For the coordinator's focused native run, retain exact head/tree/input/build hashes,
argv, engine/version/platform, permission grants or their absence, real clipboard
transfer evidence, logs/results/attachment hashes, admission and process settlement.
The existing Playwright config grants no explicit clipboard permissions. Clipboard
security/permission or engine failure remains an actual unverified/blocked outcome;
never substitute mocked selected text or skipped assertions for native Copy.

Worker validation: report links/line declarations and input/frozen byte equality
checked; `git diff --check` passed. Zero install, compiler, unit, browser, build or
matrix commands were launched; no validation lease was acquired. No product failure
was demonstrated here. All original broad editor, device, IME and AT gates remain
open. This report is a completed reconciliation prerequisite, not T acceptance.
