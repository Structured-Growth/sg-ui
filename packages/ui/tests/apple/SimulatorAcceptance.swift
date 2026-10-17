import XCTest

/// Private acceptance host only. Uses Safari and Apple's actual VoiceOver service.
@MainActor
final class SimulatorAcceptance: XCTestCase {
    func testSafariSelectAndVoiceOverSpeech() throws {
        continueAfterFailure = false
        let base = ProcessInfo.processInfo.environment["SGUI_APPLE_BASE_URL"] ?? "http://127.0.0.1:6173"
        guard let url = URL(string: base + "/fixtures/?id=migration-proofs-select--independent&embed=true") else {
            XCTFail("Invalid fixture URL"); return
        }
        let safari = XCUIApplication(bundleIdentifier: "com.apple.mobilesafari")
        safari.open(url)
        let first = safari.webViews.otherElements.matching(NSPredicate(format: "label ENDSWITH %@", "First status")).firstMatch
        XCTAssertTrue(first.waitForExistence(timeout: 30), safari.debugDescription)
        first.tap()
        let active = safari.webViews.descendants(matching: .any).matching(NSPredicate(format: "label == %@", "Active")).firstMatch
        XCTAssertTrue(active.waitForExistence(timeout: 10), safari.debugDescription)
        active.tap()
        XCTAssertTrue(first.waitForExistence(timeout: 10))

        let voiceOver = XCUIDevice.shared.voiceOverService
        let wasEnabled = voiceOver.isEnabled
        defer { if !wasEnabled { try? voiceOver.disable() } }
        try voiceOver.enable()
        XCTAssertTrue(voiceOver.isEnabled)
        var utterances = [try voiceOver.currentSpeech().utterance]
        for _ in 0..<60 {
            utterances.append(try voiceOver.moveForward().utterance)
            let transcript = utterances.joined(separator: "\n")
            if transcript.contains("First status") && transcript.contains("Second status") && transcript.contains("Active") && transcript.contains("Draft") { break }
        }
        let transcript = utterances.joined(separator: "\n")
        let speech = XCTAttachment(string: transcript)
        speech.name = "Actual iOS VoiceOver utterances"
        speech.lifetime = .keepAlways
        add(speech)
        let screenshot = XCTAttachment(screenshot: safari.screenshot())
        screenshot.lifetime = .keepAlways
        add(screenshot)
        XCTAssertTrue(transcript.contains("First status"), transcript)
        XCTAssertTrue(transcript.contains("Second status"), transcript)
        XCTAssertTrue(transcript.contains("Active"), transcript)
        XCTAssertTrue(transcript.contains("Draft"), transcript)
    }
}
