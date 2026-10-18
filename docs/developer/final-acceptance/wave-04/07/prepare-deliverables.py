from pathlib import Path
import json,hashlib,subprocess,datetime
root=Path.cwd(); out=root/'docs/developer/final-acceptance/wave-04/07'
# Proposed exact replacements; never mutate shared implementation or test runners.
p='packages/ui/tests/apple/SimulatorAcceptance.swift'
s=(root/p).read_text(); assert s.rstrip().endswith('}')
method='''

    /// Actual unsolicited milestone speech: do not move the VoiceOver cursor to the Status.
    /// This bounded service sampler does not prove exact announcement counts or quietness.
    func testOperationStepsVoiceOverMilestones() throws {
        continueAfterFailure = false
        let base = ProcessInfo.processInfo.environment["SGUI_APPLE_BASE_URL"] ?? "http://127.0.0.1:6173"
        let url = try XCTUnwrap(URL(string: base + "/fixtures/?id=components-appoperationsteps--native-state-transitions&embed=true"))
        let safari = XCUIApplication(bundleIdentifier: "com.apple.mobilesafari")
        safari.open(url)
        let web = safari.webViews.firstMatch
        let start = web.buttons["Start operation"]
        XCTAssertTrue(start.waitForExistence(timeout: 30), safari.debugDescription)
        let voiceOver = XCUIDevice.shared.voiceOverService
        let wasEnabled = voiceOver.isEnabled
        defer { if !wasEnabled { try? voiceOver.disable() } }
        try voiceOver.enable()
        XCTAssertTrue(voiceOver.isEnabled)
        var observations: [String] = []
        defer {
            let speech = XCTAttachment(string: observations.joined(separator: "\\n"))
            speech.name = "Operation steps actual sampled VoiceOver speech (not a continuous recording)"
            speech.lifetime = .keepAlways
            add(speech)
            let screen = XCTAttachment(screenshot: safari.screenshot())
            screen.name = "Operation steps final Safari state"
            screen.lifetime = .keepAlways
            add(screen)
        }
        func sample(_ phase: String, seconds: TimeInterval, expecting: String? = nil) throws {
            let deadline = Date().addingTimeInterval(seconds)
            var heard = false
            repeat {
                let utterance = try voiceOver.currentSpeech().utterance
                // Preserve every sample and timestamp, including identical samples.
                observations.append("\\(Date().timeIntervalSince1970) [\\(phase)] \\(utterance)")
                if let expecting, utterance.contains(expecting) { heard = true }
                Thread.sleep(forTimeInterval: 0.1)
            } while Date() < deadline
            if let expecting { XCTAssertTrue(heard, "Missing actual speech: \\(expecting)\\n" + observations.joined(separator: "\\n")) }
        }
        // Let navigation/enable speech settle before triggering a milestone.
        try sample("initial", seconds: 2)
        start.tap()
        try sample("active", seconds: 2)
        let advance = web.buttons["Advance progress"]
        XCTAssertTrue(advance.exists)
        advance.tap()
        try sample("progress-25", seconds: 2)
        advance.tap()
        try sample("progress-50", seconds: 2)
        web.buttons["Complete operation"].tap()
        try sample("complete", seconds: 5, expecting: "Course operation completed")
        web.buttons["Fail operation"].tap()
        try sample("failure", seconds: 5, expecting: "Course operation failed; review the materials and retry")
        web.buttons["Reset operation"].tap()
        try sample("reset", seconds: 2)
        start.tap()
        try sample("retry-active", seconds: 2)
        web.buttons["Complete operation"].tap()
        try sample("retry-complete", seconds: 5, expecting: "Course operation completed")
        // Native keyboard ownership, single-step numbering and list semantics retain
        // their existing desktop receipts. Sampling cannot prove absence of speech
        // between observations or distinguish repeated currentSpeech snapshots from
        // repeated announcements. The operator receipt remains required for those.
    }
'''
target=out/'proposed-files'/p;target.parent.mkdir(parents=True,exist_ok=True);target.write_text(s.rstrip()[:-1]+method+'}\n')
p='packages/ui/tests/apple/run-simulator.mjs';s=(root/p).read_text()
needle="const output = resolve(option('--output')"
assert needle in s
insert="""// Restrict a follow-up to its named XCTest instead of repeating accepted Select work.
const onlyTest = option('--only-test');
const allowedTests = ['testSafariSelectAndVoiceOverSpeech', 'testOperationStepsVoiceOverMilestones'];
if (args.includes('--only-test') && !allowedTests.includes(onlyTest)) throw Error('Use a known --only-test method: '+allowedTests.join(', '));
"""
s=s.replace(needle,insert+needle)
s=s.replace("status:'started', runs:[]", "status:'started', selectedTest:onlyTest ?? 'all', runs:[]")
s=s.replace("'One Select smoke does not close whole-library manual screen-reader acceptance.'", "'Named simulator scenarios do not close whole-library manual screen-reader acceptance; sampled speech cannot prove silence or exact announcement counts.'")
needle="'-parallel-testing-enabled','NO'";assert needle in s
s=s.replace(needle,"...(onlyTest ? ['-only-testing:SimulatorAcceptance/SimulatorAcceptance/'+onlyTest] : []),"+needle)
(out/'proposed-files'/p).write_text(s)
# Input and receipt reconciliation, narrowly using preexisting maps rather than rebuilding.
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
prior=json.loads((root/'docs/developer/final-acceptance/wave-03-22/evidence.json').read_text())
follow=json.loads((root/'docs/developer/final-acceptance/wave-03-followup/validated-source-inputs.json').read_text())
push=json.loads((root/'docs/developer/final-acceptance/wave-03-integration/push-source-inputs.json').read_text())
paths=set(prior['files'])
for name in ['Box','Stack','Surface','Card','Divider']:
 paths.update(str(p.relative_to(root)) for p in (root/'packages/ui/src/experimental'/name).rglob('*') if p.is_file())
extra=['AGENTS.md','docs/developer/react-aria-final-acceptance.md','docs/developer/react-aria-hardening-execution.md','docs/developer/final-acceptance/wave-03-22/report.md','docs/developer/final-acceptance/wave-03-22/results.json','docs/developer/final-acceptance/wave-03-09/report.md','docs/developer/final-acceptance/wave-03-18/report.md','docs/developer/final-acceptance/wave-03-integration/reconciliation.json','docs/developer/final-acceptance/wave-03-followup/validation-results.json','docs/developer/final-acceptance/wave-03-followup/native-final.log','docs/developer/final-acceptance/wave-03-followup/units-final.log','docs/developer/final-acceptance/editor-chrome-presentation/results.json','docs/developer/final-acceptance/rich-editor-presentation/results.json','docs/developer/react-aria-card-frames.md','docs/developer/react-aria-navigation-container.md','docs/developer/react-aria-modal-container.md','docs/developer/react-aria-data-toolbar.md','packages/ui/src/components/ClassCardFrame/ClassCardFrame.module.css','packages/ui/src/components/InstructorClassCard/InstructorClassCard.literal-labels.test.tsx','packages/ui/tests/browser/card-container-boundary.spec.ts','packages/ui/tests/browser/toolbar-container-boundary.spec.ts','packages/ui/tests/browser/navigation-shell-container-boundary.spec.ts','packages/ui/tests/browser/modal-container-boundary.spec.ts','packages/ui/tests/browser/wave03-18-primitives.spec.ts','apps/docs/native-fixtures/scenarios/experimental/PrimitiveAcceptance/PrimitiveAcceptance.fixture.tsx','packages/ui/tests/apple/SimulatorAcceptance.swift','packages/ui/tests/apple/run-simulator.mjs']
paths.update(extra)
evidence={'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'method':'Read/hash existing files only. No new unit/browser/simulator/build execution. Prior exact maps retain original dates/limits.','files':{}}
for p in sorted(paths):
 f=root/p; current=sha(f) if f.is_file() else None
 old=prior['files'].get(p,{}).get('sha256'); baseline=follow.get(p,push.get(p));
 evidence['files'][p]={'sha256':current,'wave03_22':old,'matchesWave03_22':current==old if old else None,'integratedSnapshot':baseline,'matchesIntegratedSnapshot':current==baseline if baseline else None,'snapshotSource':'wave-03-followup/validated-source-inputs.json' if p in follow else ('wave-03-integration/push-source-inputs.json' if p in push else None)}
log=root/'docs/developer/final-acceptance/wave-03-followup/native-final.log'
evidence['retainedNativePassLines']=[{'line':i,'text':line} for i,line in enumerate(log.read_text().splitlines(),1) if '✓' in line and ('card-container-boundary.spec.ts' in line or ('wave03-18-primitives.spec.ts:3:' in line))]
evidence['proposedBaseHashes']={p:sha(root/p) for p in ['packages/ui/tests/apple/SimulatorAcceptance.swift','packages/ui/tests/apple/run-simulator.mjs']}
(out/'evidence.json').write_text(json.dumps(evidence,indent=2)+'\n')
print('Prepared two exact replacements; captured',len(paths),'existing path hashes.')
