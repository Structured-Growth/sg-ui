# Batch 146: native editor selection driver correction

Parent tasks: E-03, E-04, M-27. This is a partial test-driver slice, not broad
editor, menu, history, browser, device or assistive-technology acceptance.

## Ownership and baseline

The new managed worktree is `/Users/thomashall/.codex/worktrees/12c9/sg-ui`,
starting at pushed `codex/dev` head
`164421fd639608a4afcfc013adda1d80ebf80cc7`. The coordinator's current worker
reservation assigns batch146 exactly:

- `tests/browser/batch64-style-menu-native-selection.spec.ts`
- `tests/browser/editor-mixed-formatting-history.spec.ts`
- `docs/developer/parallel-batch-146/acceptance-evidence.md`

Durable coordinator state was read before editing. Historical batch64/batch72
worker records are integrated with released scope; their older pending-ledger
records are retained history. No shared state/acceptance ledger was updated.
Batch136 paragraph coverage, production code, stories, other workers, primary
image-upload work, validation queues and slots remain outside this change.

## Retained failure evidence

Actual wave43 tested head: `c7e4863c922e7b94fb9fef143307343850993bff`.
Root evidence:
`/Users/thomashall/.codex/worktrees/reviewed-dev-fw-checkpoint-43/sg-ui/artifacts/browser-pool/74a00435-d263-40f8-bb40-57fac90a4818/evidence.json`.
Its SHA-256 at read time was
`1219120bd3640fad7013862fa4673f9bee5d528f3f325855cc05f8a5b043128a`.

The coordinator reviews were read from
`/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/`:

| Review | SHA-256 |
| --- | --- |
| `wave43-early-failure-review.json` | `22fa904c99bbd381b37b59744091d31abb9d1fc2fbce96eee6c843da8f41ec40` |
| `wave43-additional-native-failure-review.json` | `8af36a0988e9b70ac9d141f5a10c69c95515db0bc743a3bb68cda01f0fafd490` |

The additional review retains six style-menu and twelve mixed-formatting failed
Firefox/WebKit executions, all before commands. The style selector produced empty
text after click/Home/Shift+End; the mixed selector produced empty text after
click/Home/two ArrowRight/twelve Shift+ArrowRight. Their formatting, callback and
history assertions had not run. Both tested spec hashes equal this worktree's
baseline hashes:

| Spec | Baseline / wave43 SHA-256 | Proposed SHA-256 |
| --- | --- | --- |
| `batch64-style-menu-native-selection.spec.ts` | `7e7e9225d3c2b56f402564894ea5f7ba4265a5a1622fe6b24a9fc25958e8bbab` | `90dc995476e56da913720c4a86bdf657d5f46cfebbef0a4a3a46e8006cb943a3` |
| `editor-mixed-formatting-history.spec.ts` | `43fdce05a6ffb42d1e55b247a0274d256812f66f9d894397dde0cae846c3af58` | `22f05375d2262a66235e37b544e8cffad56fbda49760b553426d71ca2a8008e1` |

Read-only representative Firefox/WebKit trace inspection confirms real click/key
calls and editable DOM hosts. The WebKit mixed click is at (640, 294.5) in the
1184 by 283 editor, well beyond its short text line; the style click is at
(137, 111.03) in a 210 by 39.6875 sample. These clicks do not establish a start
caret. Retained snapshots do not record enough endpoint/active-element data to
prove initial focus or a particular collapsed offset. Empty selection alone is
not evidence of a formatting implementation defect.

## Native semantics and correction

[Apple's text-editing shortcuts](https://support.apple.com/en-us/102650) distinguish
Home/End document scrolling from Command+Left/Right caret movement, with Shift
extending selection. [Playwright 1.63.0 macOS editing bindings](https://github.com/microsoft/playwright/blob/v1.63.0/packages/playwright-core/src/server/macEditingCommands.ts)
(the lockfile version) likewise map Home to document scrolling and Meta+ArrowLeft
to a line-boundary caret command. Shift+Meta+ArrowRight extends to the line end.
[Gecko's Cocoa command implementation](https://github.com/mozilla/gecko-dev/blob/master/widget/cocoa/nsCocoaWindow.mm)
independently documents Home as ScrollTop, Command+Left as BeginLine and
Command+Shift+Right as SelectEndLine. The Gecko reference is upstream source,
not a claim that the exact retained browser binary was rebuilt or inspected.

The original assumption that Home puts the macOS caret at offset zero is therefore
a documented driver error. Whether this fully explains every retained failure
remains unverified until native runs observe focus and endpoints.

Both selectors retain the real click and now assert focused, document-focused,
editable hosts before keys. They use Meta+ArrowLeft on macOS and Home elsewhere,
then require a collapsed native offset zero. The style selector extends with
Shift+Meta+ArrowRight on macOS / Shift+End elsewhere and requires the exact
`MiXeD text` forward range 0 to 9. The mixed selector retains two ArrowRight and
twelve Shift+ArrowRight presses, checks its collapsed anchor at 2, and requires
the exact `ld plain Ita` forward range 2 to 14. The same checks run after serialized
replacement. No fallback sequence or retry chooses a passing selection.

Endpoint observations sum text lengths across existing nodes and siblings; they
support equivalent text or element boundaries without depending on formatting
wrappers. They only read Selection/DOM state. A JSON attachment in each selector's
finally block preserves current focus, editability, collapse, text and native
endpoint offsets even when a precondition fails. Existing menu commands,
callbacks, checked state, character format masks, exact serialized history,
markup and reload assertions remain intact. No Range construction, selection
mutation, state injection, synthetic dispatch, focus injection or production
formatting change was added.

## Validation and coordinator handoff

`git diff --check`: PASS (static whitespace review only).
Manual diff review: exactly the reserved specs and this report; existing cases
remain three style-menu plus six mixed-formatting cases per engine.

All executable validation is **UNRUN** under the dispatch restriction:

- Browser-source typecheck: UNRUN.
- Fresh Storybook build: UNRUN.
- Focused Chromium, Firefox and WebKit: UNRUN.
- Unit/composed tests and other guards: UNRUN; no production implementation changed.

No installs, builds, browser launches, shared slot/queue changes, CI operations,
merge, push or publication were performed. The coordinator should validate the
reviewed changed spec bytes on a fresh frozen build, including the known failing
macOS Firefox/WebKit cases and Chromium. Keep any new focus/offset failure separate
from formatting failures reached only after these preconditions pass. Other OS
branches are also unverified. Exact final clean commit and all three final file
hashes are supplied in the completion receipt; a report cannot contain its own
commit or hash without changing them.

Read-only follow-up: the unowned NativeSelection story's visible instruction still
says Home then Shift+End. A coordinator-reserved story update may align that text
with macOS instructions; it does not block this bounded spec correction.

See [development validation](../react-aria-development-validation.md) and
[parallel browser validation](../react-aria-parallel-browser-validation.md).
E-03/E-04/M-27 and broader acceptance remain open.
