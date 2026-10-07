# Paragraph selection driver correction

Parent criteria: E-03/E-04. Bounded successor to
[batch80 paragraph transactions](../parallel-batch-80/editor-paragraph-transactions.md).
Base: `f9115e4add5083d48ff3aca81e6fbadb87dce298`.
Only the native browser selection driver and this report change; production,
fixture, composed unit, and earlier evidence remain unchanged.

## Retained failure and classification

The coordinator's fresh Chromium candidate
`7248a80d79eb50a59a2e18b7bf461f8e9d26897c` failed both light and dark
cases before any paragraph command. Expected first-paragraph selection was
`{ text: 'rget p', anchor: 2, focus: 8, target: true }`; actual selection was
`{ text: 'djacen', anchor: 1, focus: 7, target: false }` in the adjacent paragraph.
This is a native driver platform assumption, not a confirmed product defect.
Command/history behavior was not reached by that run.

Retained evidence root (read only; not replaced):

```text
/Users/thomashall/.codex/worktrees/batch80-83-native-candidate/sg-ui/artifacts/browser-pool/df2bc745-5e76-4922-80ae-03c3ccaa0f51/batch80
```

`results.json` records two unexpected failures, zero retries and one worker.
The light trace is under
`traces/editor-paragraph-transacti-f2378-on-history-and-saved-reload-chromium/trace.zip`;
the dark trace is under
`traces/editor-paragraph-transacti-698ba-on-history-and-saved-reload-chromium/trace.zip`.
Each directory also preserves its screenshot and error context.

Inspection of the retained light trace's native input records shows the first
`p` click at `(640, 165.79)` in a box at `(48, 153)` with width `1184` and
height `25.59375`. The screenshot shows the short bold target at the left,
with the selected italic adjacent text on the next line at the right.
The trace identifies the native host as `darwin`, despite the Playwright device
user agent describing Windows. The old full-width paragraph-center click and
bare Home therefore did not establish the first target's start. Intermediate
caret placement is not independently proven by these retained records.

## Prepared correction and preserved assertions

The driver clicks the first paragraph's actual rendered `strong` text through
ordinary Playwright actionability and native pointer input. It then uses
`Meta+ArrowUp` on a macOS host, or `Control+Home` elsewhere, to request document
start. Platform choice uses the native host, not the emulated user agent.
A new exact collapsed-selection assertion requires first-paragraph ownership
and offsets zero before the existing two Right and six Shift+Right keys.
The same helper applies after saved-document replacement and centered formatting.

The exact `rget p`/2/8/first-paragraph assertion remains, as do command/menu focus,
Undo/Redo selection, full saved JSON equality, adjacent paragraph/inline style
preservation, and saved reload/empty-history checks in both themes. No DOM
selection mutation, forced click, assertion relaxation or retry is introduced.
Browser evaluation continues to observe selection only.

## Freeze and coordinator validation

Read-only source/trace inspection and `git diff --check` were completed.
No dependency install, typecheck, unit test, browser, Storybook build or packed
consumer command was run in this task while the shared pool was frozen.
The prepared correction has no native pass claim.

The coordinator owns the lightweight validation window and fresh changed-byte
Chromium execution/integration for this exact frozen successor commit. Use the
Node 24 runtime directory
`/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin` on `PATH`.
Focused browser scope:
`tests/browser/editor-paragraph-transactions.spec.ts --project=chromium --workers=1 --retries=0`.
Keep results separate from the unchanged old candidate and its failed evidence.
Record the exact candidate head and new artifact paths with the result.
Firefox/WebKit and broad E-03/E-04/device/assistive-technology acceptance remain
pending; this correction does not close them.
