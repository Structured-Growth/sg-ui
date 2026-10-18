from pathlib import Path
import json,hashlib,difflib,subprocess
root=Path(__file__).resolve().parents[5]
out=Path(__file__).resolve().parent
proposed=out/'proposed-files'
target='apps/docs/native-fixtures/scenarios/experimental/Calendar/Calendar.fixture.tsx'
original=(root/target).read_text()
addition='''
// Calendar spoken-output host. Decorations must remain absent from date names.
// Static and callback reasons are host data; no availability fetch or ambient clock.
export const SpeechSemantics: Story = { args: {
  label: "Speech calendar", navigation: "arrows", months: 1,
  defaultFocusedDate: "2024-02-14", defaultValue: "2024-02-14",
  unavailable: [{date: "2024-02-15", reason: "Static capacity closed"}],
  getDateUnavailableReason: (date: string) => date === "2024-02-16" ? "Callback capacity closed" : undefined,
  renderDayContent: () => <span>DECORATION_SENTINEL</span>,
} };
'''
# Add to the same XCTest source already included in the project: no project mutation.
swift='packages/ui/tests/apple/SimulatorAcceptance.swift'
s=(root/swift).read_text()
extra=r'''

    /// Returned utterances are actual VoiceOver speech; AX labels alone never pass.
    private func recordSpeech(_ safari: XCUIApplication, name: String,
                              until complete: ([String]) -> Bool) throws -> [String] {
        let voiceOver = XCUIDevice.shared.voiceOverService
        let wasEnabled = voiceOver.isEnabled
        defer { if !wasEnabled { try? voiceOver.disable() } }
        try voiceOver.enable()
        XCTAssertTrue(voiceOver.isEnabled)
        var utterances = [String]()
        defer {
            let speech = XCTAttachment(string: utterances.joined(separator: "\n"))
            speech.name = name; speech.lifetime = .keepAlways; add(speech)
            let tree = XCTAttachment(string: safari.debugDescription)
            tree.name = name + " accessibility tree (diagnostic only)"
            tree.lifetime = .keepAlways; add(tree)
            let screenshot = XCTAttachment(screenshot: safari.screenshot())
            screenshot.name = name + " screenshot"
            screenshot.lifetime = .keepAlways; add(screenshot)
        }
        utterances.append(try voiceOver.currentSpeech().utterance)
        for _ in 0..<100 {
            if complete(utterances) { break }
            utterances.append(try voiceOver.moveForward().utterance)
        }
        return utterances
    }

    private func openSpeechFixture(_ id: String, waitingFor label: String) throws -> XCUIApplication {
        let base = ProcessInfo.processInfo.environment["SGUI_APPLE_BASE_URL"] ?? "http://127.0.0.1:6173"
        let url = try XCTUnwrap(URL(string: base + "/fixtures/?id=" + id + "&embed=true&globals=locale:en-US;theme:light;density:comfortable"))
        let safari = XCUIApplication(bundleIdentifier: "com.apple.mobilesafari")
        safari.open(url)
        let marker = safari.webViews.descendants(matching: .any)
            .matching(NSPredicate(format: "label CONTAINS %@", label)).firstMatch
        XCTAssertTrue(marker.waitForExistence(timeout: 30), safari.debugDescription)
        return safari
    }

    func testCalendarDateNamesAndNonHoverReasonsVoiceOverSpeech() throws {
        continueAfterFailure = false
        let safari = try openSpeechFixture("migration-proofs-calendar--speech-semantics", waitingFor: "Unavailable dates")
        let disclosure = safari.webViews.descendants(matching: .any)
            .matching(NSPredicate(format: "label == %@", "Unavailable dates")).firstMatch
        XCTAssertTrue(disclosure.waitForExistence(timeout: 10), safari.debugDescription)
        disclosure.tap() // Native activation exposes both reasons without hover.
        func fullDate(_ speech: [String]) -> Bool {
            speech.contains { line in
                let text = line.lowercased()
                return text.contains("thursday") && text.contains("february") &&
                    text.contains("15") && text.contains("2024")
            }
        }
        let speech = try recordSpeech(safari, name: "Calendar actual VoiceOver date and disclosure") { lines in
            let text = lines.joined(separator: " ")
            return fullDate(lines) && text.contains("Static capacity closed") && text.contains("Callback capacity closed")
        }
        let transcript = speech.joined(separator: "\n")
        XCTAssertTrue(fullDate(speech), transcript)
        XCTAssertTrue(transcript.contains("Static capacity closed"), transcript)
        XCTAssertTrue(transcript.contains("Callback capacity closed"), transcript)
        XCTAssertFalse(transcript.contains("DECORATION_SENTINEL"), transcript)
    }

    func testCalendarPresetDescriptionsVoiceOverSpeech() throws {
        continueAfterFailure = false
        let safari = try openSpeechFixture("migration-proofs-daterangeselector--availability", waitingFor: "Early February")
        let speech = try recordSpeech(safari, name: "Calendar actual VoiceOver preset descriptions") { lines in
            let text = lines.joined(separator: " ")
            return text.contains("First two weeks, before capacity closes") && text.contains("Includes the unavailable capacity date")
        }
        let transcript = speech.joined(separator: "\n")
        XCTAssertTrue(transcript.contains("Early February"), transcript)
        XCTAssertTrue(transcript.contains("February reporting period"), transcript)
        XCTAssertTrue(transcript.contains("First two weeks, before capacity closes"), transcript)
        XCTAssertTrue(transcript.contains("Includes the unavailable capacity date"), transcript)
    }

    func testCalendarFocusedRangePreviewVoiceOverSpeech() throws {
        continueAfterFailure = false
        let safari = try openSpeechFixture("migration-proofs-daterangeselector--focused-endpoint-preview", waitingFor: "February 28")
        let anchor = safari.webViews.buttons
            .matching(NSPredicate(format: "label CONTAINS %@ AND label CONTAINS %@", "February 28", "2024")).firstMatch
        XCTAssertTrue(anchor.waitForExistence(timeout: 10), safari.debugDescription)
        anchor.tap() // Starts a draft; accepted Apply/Cancel authority has native coverage.
        let speech = try recordSpeech(safari, name: "Calendar actual VoiceOver focused range preview") { lines in
            let text = lines.joined(separator: " ")
            return text.contains("Range preview") && text.contains("Anchor") && text.contains("Focused endpoint") && text.contains("Apply commits the draft")
        }
        let transcript = speech.joined(separator: "\n")
        for content in ["Range preview", "Anchor", "Focused endpoint", "Apply commits the draft"] {
            XCTAssertTrue(transcript.contains(content), transcript)
        }
    }
'''
runner='packages/ui/tests/apple/run-simulator.mjs'
r=(root/runner).read_text()
r=r.replace("const owner = 'apple-simulator:'+process.pid;", "const calendarOnly = args.includes('--calendar-only');\nconst owner = 'apple-simulator:'+process.pid;")
r=r.replace("const hash = async path", "receipt.testSelection = calendarOnly ? 'three-calendar-speech-probes' : 'all-simulator-tests';\nif (calendarOnly) receipt.limits = ['Simulator execution is not physical-device evidence.', 'Three calendar speech probes do not close the full keyboard/AT/platform matrix.'];\nconst hash = async path")
r=r.replace("join(output,'result.xcresult')],240000);", "join(output,'result.xcresult'), ...(calendarOnly ? ['-only-testing:SimulatorAcceptance/SimulatorAcceptance/testCalendarDateNamesAndNonHoverReasonsVoiceOverSpeech', '-only-testing:SimulatorAcceptance/SimulatorAcceptance/testCalendarPresetDescriptionsVoiceOverSpeech', '-only-testing:SimulatorAcceptance/SimulatorAcceptance/testCalendarFocusedRangePreviewVoiceOverSpeech'] : [])],240000);")
changes={target:original+addition,swift:s.rstrip()[:-1]+extra+'\n}\n',runner:r}
patch=[]
for path,content in changes.items():
 p=proposed/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(content)
 patch.extend(difflib.unified_diff((root/path).read_text().splitlines(True),content.splitlines(True),fromfile='a/'+path,tofile='b/'+path))
(out/'calendar-speech.patch').write_text(''.join(patch))
(out/'proposal-inputs.json').write_text(json.dumps({p:{'beforeSha256':hashlib.sha256((root/p).read_bytes()).hexdigest(),'proposedSha256':hashlib.sha256((proposed/p).read_bytes()).hexdigest()} for p in changes},indent=2)+'\n')
print(json.dumps({'files':list(changes),'patch':'calendar-speech.patch'}))
