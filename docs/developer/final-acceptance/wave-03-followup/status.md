# Browser failure follow-up

Snapshot `bd169b54` was pushed to `origin/dev` at the user's request, with open failures explicitly retained. Follow-up work is on `codex/acceptance-browser-followup`; merge requires passing affected checks.

## Initial current-head evidence

- Native: 147 passed, 8 failed, 1 skipped (unsupported Firefox touch emulation), 6 not run after the failure limit. The extra runner error reports that limit, not another product failure.
- Production docs: 8 passed, 3 failed. All 94 catalog routes rendered, and 1,138 setup/initial/changed source snapshots compiled against public declarations.
- Original acceptance counts remain 181/320 complete, 139 open, plus 20 editor visual and 6 future tasks. Browser fixes alone do not close broader device, AT, legal, performance, or visual requirements.

## Work tracked

- Menu Tab/Shift+Tab dismissal: production correction and focused unit/native verification in progress. Preserve rejecting controlled hosts and native traversal.
- Neutral Button hover/pressed feedback: owned component alias corrected to the semantic hover surface; regenerated tokens. Verify both docs appearances.
- WebKit Select/ComboBox traversal: fixture sentinels/reset use public Button rather than platform-dependent raw button tab stops.
- Editor Cancel restoration: poll deferred exact selection restoration; use explicit keyboard insertion for the keyboard focus-return contract.
- Touch targets: verify actual trusted touch dispatch in WebKit instead of requiring its inaccurate desktop-emulation maxTouchPoints hint. Keep every sizing/activation/focus assertion.
- ComboBox caret keys: use the platform-native start/end shortcuts, preserving exact caret expectations.
- Foundation source: locate the actual labeled code element; HTML code has no accessible name in this role mapping. Keep source compilation and independence assertions.

Initial failure logs are immutable. Later runs get separate names/output directories. Personal `.obsidian/workspace.json` is excluded throughout.

## Validated follow-up

Known automated failures resolved. The full unit checkpoint passed 297 files / 1,851 tests; the later Menu type guard passed all 17 affected cases. Fresh library, foundation, tokens, production docs, native fixture, browser types and package checks pass.

Native evidence covers 161 passing cases and one unsupported Firefox touch skip: the full run passed160 with one last WebKit CSS-property driver failure, then its corrected case passed all three engines. WebKit's unsupported forced-color-adjust branch is explicitly recorded; keyboard/system-color/selection assertions remain unconditional. No retries or unchanged full-matrix reruns conceal the original failure. Production docs passed eight cases (94 routes / 1,138 compiled source snapshots) plus the three corrected cases. See [receipts](validation-results.json).

The Menu Tab dismissal, neutral Button interaction token and editor Cancel focus-order bugs are fixed. Fixture, platform-key, deferred-observation and CSS-capability assumptions are corrected without dropping their applicable behavior assertions. Acceptance counts remain unchanged; broader gates stay open.
