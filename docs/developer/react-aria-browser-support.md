# Browser, touch and assistive-technology coverage

A-X-10 establishes the maintained browser checks and records representative input
and AT evidence. It does not close the separate A-X-11 manual six-family review,
A-P-07 prototype findings, or A-Z-11 final production checkpoint. Current policy
supports the declared React/browser contracts through scoped prerelease validation;
it does not promise every browser/device/AT pairing or a stable-version support SLA.

| Environment | Established checks and evidence | Limits |
| --- | --- | --- |
| Chromium / Chrome engine | Maintained Playwright project; current target geometry, trusted coarse touchscreen activation, forced colors, validation paint/focus and menu presentation. | Bundled Chromium is not certification of every installed Chrome channel or Android hardware. |
| Firefox | Maintained Playwright project; the same current target/contrast scopes and corrected LTR/RTL menu motion checks. | Browser emulation does not establish Android Firefox or spoken NVDA behavior. |
| WebKit | Maintained Playwright project; the same target/contrast scopes, focus, enlarged text and reduced-motion checks. | Playwright WebKit is not the installed macOS/iOS Safari application. |
| Safari / iPhone 18 Pro / iOS 27.0 Simulator | Retained native XCTest Select interaction and two successful actual VoiceOver-service captures; repeat build/test/summary/shutdown all exit zero. Xcode 27.1, build 27A9275; simulator OS build 24A434. | Synthetic native taps establish setup interaction, not physical touch or VoiceOver activation gestures. One Select flow is not whole-library manual review. |
| Desktop/mobile physical devices and other screen readers | Not established by these receipts. | Manual dialogs, selectors, calendars, navigation, tables and editors remain A-X-11. No NVDA, JAWS, TalkBack, macOS VoiceOver or physical-iPhone result is inferred. |

The current local projects use Playwright 1.63.0's pinned browser distributions:
Chromium 153.0.8010.12/revision1243, Firefox155.0/revision1543 and
WebKit26.6/revision2359. These are installed distribution identities, not a new
runtime observation of a branded browser. The [coverage receipt](backlog-to-ten/browser-support-closure.json)
hashes that inventory, raw results and retained speech evidence. The CI browser
matrix runs separately at the source identified by each Actions run.

The current touch scope verifies `any-pointer: coarse`, trusted single-touch events,
edge taps, independent checkbox/radio activation, selected calendar/quarter state,
grid utility containment, dropdown selection actions and non-drag resize controls.
It covers auto/pointer/touch policy where applicable. It does not validate physical
finger accuracy, scrolling inertia, mobile keyboards or assistive touch behavior.
The current native results contain twelve passing target executions, six passing
contrast executions and nine effective passing menu presentation executions.
Original unrelated motion-driver failures remain recorded alongside corrected runs;
a whole mixed run is not described as entirely passing.

Actual VoiceOver utterances are retained in
[the original transcript](final-acceptance/apple-simulator/voiceover-utterances.txt),
with [repeat execution](final-acceptance/apple-simulator/repeat-receipt.json) and
[Apple test summary](final-acceptance/apple-simulator/repeat-summary.json).
They include the first selector's Active value, its popup role, and the second
selector's Draft value. The transcript is service-produced speech output, not a
reconstruction from DOM labels. It remains historical evidence at its recorded
source/host hashes; it does not assert current whole-library speech conformance.
The earlier interrupted attempt and newer uncompleted family replay are not passes.

For changes, run affected maintained browser cases against fresh public compiled
fixtures and preserve engine/input/source identities. Reuse accepted unchanged
scope instead of replaying tests solely for checklist credit. Run real AT checks
when a changed contract affects speech or focus, and retain manual findings under
A-X-11. The proposed nine-method automation continuation is additional coverage;
it does not replace the explicit manual review or invalidate these bounded
successful captures.

The current native Chromium runner selects the installed full `chromium` channel,
matching the dedicated form-participation host's CDP Autofill requirement. The
headless-shell build omits that protocol. This is still Playwright's Chromium
distribution, not a claim about a separately installed branded Chrome version.

WebKit's forced-colors media emulation does not implement `forced-color-adjust`.
The maintained state proofs still run native selection/focus and authored
system-color/geometry assertions, annotating the unsupported UA-adjustment and
forced-paint contrast branches. Firefox and Chromium retain measured forced-paint
contrast assertions; this is not a three-engine UA-paint claim.
