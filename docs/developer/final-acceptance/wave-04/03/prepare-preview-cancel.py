from pathlib import Path
import hashlib,json,difflib
root=Path(__file__).resolve().parents[5];out=Path(__file__).resolve().parent
path='packages/ui/tests/apple/SimulatorAcceptance.swift';old=(root/path).read_text()
method=r'''

    func testCalendarCancelRemovesStalePreviewVoiceOverSpeech() throws {
        continueAfterFailure = false
        let safari = try openSpeechFixture("migration-proofs-daterangeselector--focused-endpoint-preview", waitingFor: "February 28")
        let anchor = safari.webViews.buttons
            .matching(NSPredicate(format: "label CONTAINS %@ AND label CONTAINS %@", "February 28", "2024")).firstMatch
        XCTAssertTrue(anchor.waitForExistence(timeout: 10), safari.debugDescription)
        anchor.tap()
        let before = try recordSpeech(safari, name: "Calendar preview before Cancel actual VoiceOver") { lines in
            let text = lines.joined(separator: " ")
            return text.contains("Range preview") && text.contains("Focused endpoint")
        }
        XCTAssertTrue(before.joined(separator: " ").contains("Range preview"), before.joined(separator: "\n"))
        XCTAssertTrue(before.joined(separator: " ").contains("Focused endpoint"), before.joined(separator: "\n"))
        let cancel = safari.webViews.buttons.matching(NSPredicate(format: "label == %@", "Cancel")).firstMatch
        XCTAssertTrue(cancel.waitForExistence(timeout: 10), safari.debugDescription)
        cancel.tap()
        // Start at a calendar day so a post-Cancel traversal reaches every date
        // before the action row. Native taps are setup, not VoiceOver gestures.
        XCTAssertTrue(anchor.waitForExistence(timeout: 10), safari.debugDescription)
        anchor.tap() // A tap would start another draft: avoid activation here.
    }
'''
# No native focus-only XCTest API: do NOT tap the date after Cancel. Traverse
# the complete bounded page and require both a date and Cancel to be observed.
method=method.replace('''        // Start at a calendar day so a post-Cancel traversal reaches every date
        // before the action row. Native taps are setup, not VoiceOver gestures.
        XCTAssertTrue(anchor.waitForExistence(timeout: 10), safari.debugDescription)
        anchor.tap() // A tap would start another draft: avoid activation here.
''',r'''        let after = try recordSpeech(safari, name: "Calendar preview after Cancel actual VoiceOver", rewindTo: "Use arrows to focus") { _ in false }
        let transcript = after.joined(separator: "\n")
        // If traversal could not return to the calendar, retain the failure;
        // absence in a toolbar-only transcript cannot establish stale removal.
        XCTAssertTrue(after.contains { $0.contains("February") && $0.contains("2024") }, transcript)
        XCTAssertTrue(transcript.contains("Cancel"), transcript)
        XCTAssertTrue(transcript.contains("Use arrows to focus"), transcript)
        for obsolete in ["Range preview", "Anchor:", "Focused endpoint", "Apply commits the draft"] {
            XCTAssertFalse(transcript.contains(obsolete), transcript)
        }
''')
new=old.rstrip()[:-1]+method+'\n}\n'
new=new.replace('name: String,\n                              until', 'name: String, rewindTo: String? = nil,\n                              until')
new=new.replace('        utterances.append(try voiceOver.currentSpeech().utterance)\n', '        if let marker = rewindTo {\n            for _ in 0..<100 {\n                let line = try voiceOver.moveBackward().utterance\n                utterances.append(line)\n                if line.contains(marker) { break }\n            }\n        }\n        utterances.append(try voiceOver.currentSpeech().utterance)\n')
(out/'range-preview-cancel.patch').write_text(''.join(difflib.unified_diff(old.splitlines(True),new.splitlines(True),fromfile='a/'+path,tofile='b/'+path)))
(out/'preview-cancel-proposed.swift').write_text(new)
(out/'preview-cancel-inputs.json').write_text(json.dumps({'target':path,'beforeSha256':hashlib.sha256(old.encode()).hexdigest(),'proposedSha256':hashlib.sha256(new.encode()).hexdigest(),'status':'unexecuted proposed-only; integrated nine-method run must finish first','command':'node packages/ui/tests/apple/run-simulator.mjs --only testCalendarCancelRemovesStalePreviewVoiceOverSpeech --output '+str(out/'calendar-preview-cancel-run'),'limit':'Native XCTest taps set up draft/Cancel; only actual VoiceOver utterances assert preview presence/removal. This does not establish physical gesture or keyboard timing.'},indent=2)+'\n')
print('Prepared single-method preview/Cancel speech successor against current integrated nine-method source.')
