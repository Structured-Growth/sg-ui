import XCTest

/// Private acceptance host only. Uses Safari and Apple's actual VoiceOver service.
@MainActor
final class SimulatorAcceptance: XCTestCase {

    private enum SpeechDriverFailure: Error {
        case missingOrOffscreenAnchor(String), wrongAnchor(String), noProgress(String), budget(String)
    }
    private func traceSpeech(_ operation: String, _ body: () throws -> String) throws -> String {
        let start = Date()
        NSLog("[SGUI-VO] BEGIN %@", operation)
        do {
            let utterance = try body()
            NSLog("[SGUI-VO] END %@ elapsed=%.3fs utterance=%@", operation,
                  Date().timeIntervalSince(start), utterance)
            return utterance
        } catch {
            NSLog("[SGUI-VO] ERROR %@ elapsed=%.3fs error=%@", operation,
                  Date().timeIntervalSince(start), String(describing: error))
            throw error
        }
    }
    // A coordinate single tap while VoiceOver is enabled explores this visible
    // target. Verify ACTUAL speech before scanning; never assume an AX query set
    // the VoiceOver cursor, or traverse onward from Safari's Tabs control.
    private func anchorVoiceOver(_ safari: XCUIApplication, anchor: XCUIElement,
                                 expected: String) throws -> String {
        guard anchor.waitForExistence(timeout: 5), anchor.isHittable else {
            throw SpeechDriverFailure.missingOrOffscreenAnchor(expected)
        }
        let frame = anchor.frame.intersection(safari.webViews.firstMatch.frame)
        guard !frame.isNull, frame.width > 0, frame.height > 0 else {
            throw SpeechDriverFailure.missingOrOffscreenAnchor(expected)
        }
        NSLog("[SGUI-VO] ANCHOR expected=%@ frame=%@", expected, String(describing: frame))
        // Convert the visible intersection center to an absolute Safari offset.
        let origin = safari.frame.origin
        safari.coordinate(withNormalizedOffset: CGVector(dx: 0, dy: 0))
            .withOffset(CGVector(dx: frame.midX - origin.x, dy: frame.midY - origin.y)).tap()
        let utterance = try traceSpeech("anchor.currentSpeech", {
            try XCUIDevice.shared.voiceOverService.currentSpeech().utterance
        })
        func words(_ text: String) -> String {
            text.lowercased().components(separatedBy: CharacterSet.alphanumerics.inverted)
                .filter { !$0.isEmpty }.joined(separator: " ")
        }
        guard words(utterance).contains(words(expected)) else {
            throw SpeechDriverFailure.wrongAnchor("Expected \(expected); actual \(utterance)")
        }
        return utterance
    }
    private func boundedSpeech(_ safari: XCUIApplication, name: String,
                               anchor: XCUIElement, expectedAnchor: String, limit: Int = 60,
                               complete: ([String]) -> Bool) throws -> [String] {
        let service = XCUIDevice.shared.voiceOverService
        let wasEnabled = service.isEnabled
        var lines: [String] = []
        defer {
            let text = XCTAttachment(string: lines.joined(separator: "\n"))
            text.name = name + " actual utterances"; text.lifetime = .keepAlways; add(text)
            let tree = XCTAttachment(string: safari.debugDescription)
            tree.name = name + " diagnostic tree (not speech)"; tree.lifetime = .keepAlways; add(tree)
            let image = XCTAttachment(screenshot: safari.screenshot())
            image.name = name; image.lifetime = .keepAlways; add(image)
            if !wasEnabled {
                do { try service.disable() }
                catch { XCTFail("VoiceOver restoration failed: \(error)") }
            }
        }
        NSLog("[SGUI-VO] BEGIN enable stage=%@", name)
        try service.enable()
        NSLog("[SGUI-VO] END enable stage=%@", name)
        XCTAssertTrue(service.isEnabled)
        do {
            lines.append(try anchorVoiceOver(safari, anchor: anchor, expected: expectedAnchor))
            let deadline = Date().addingTimeInterval(45)
            for index in 0..<min(limit, 60) {
                if complete(lines) { return lines }
                guard Date() < deadline else { throw SpeechDriverFailure.budget(name) }
                let line = try traceSpeech("\(name).forward.\(index)", { try service.moveForward().utterance })
                lines.append(line)
                // Fail a stuck item after 3 identical samples; fail a two-item
                // Safari-chrome cycle after 6. Do not restart or replay the loop.
                let tail3 = Array(lines.suffix(3)).map { $0.lowercased() }
                let tail6 = Array(lines.suffix(6)).map { $0.lowercased() }
                if !complete(lines) && ((tail3.count == 3 && Set(tail3).count == 1) ||
                    (tail6.count == 6 && Set(tail6).count <= 2)) {
                    throw SpeechDriverFailure.noProgress("\(name): \(tail6)")
                }
            }
            // Caller retains every original semantic assertion after returning.
            return lines
        } catch {
            lines.append("DRIVER FAILURE (not speech): \(error)")
            throw error
        }
    }


    // Coordinator runs this one short probe before any family replay. If a
    // coordinate tap activates instead of exploring, fail before a scan starts.
    func testVoiceOverVisibleTargetAnchor() throws {
        continueAfterFailure = false
        let safari = try openSpeechFixture("migration-proofs-select--independent", waitingFor: "First status")
        let first = safari.webViews.otherElements.matching(NSPredicate(format: "label ENDSWITH %@", "First status")).firstMatch
        XCTAssertTrue(first.waitForExistence(timeout: 5))
        let labelBefore = first.label
        let service = XCUIDevice.shared.voiceOverService
        let wasEnabled = service.isEnabled
        defer { if !wasEnabled { try? service.disable() } }
        try service.enable()
        let utterance = try anchorVoiceOver(safari, anchor: first, expected: "First status")
        let actual = XCTAttachment(string: utterance)
        actual.name = "Anchor smoke actual VoiceOver output"; actual.lifetime = .keepAlways; add(actual)
        XCTAssertEqual(first.label, labelBefore)
        XCTAssertFalse(element(safari, "Active").exists, "A single exploration tap must not open the options")
    }

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

        let utterances = try boundedSpeech(safari, name: "Select", anchor: first, expectedAnchor: "First status") { lines in
            let transcript = lines.joined(separator: "\n")
            return ["First status", "Second status", "Active", "Draft"].allSatisfy { transcript.contains($0) }
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


    // Interaction setup uses native XCTest taps/typeText with VoiceOver temporarily
    // disabled. Only speech()/seek() supplies spoken evidence. This deliberately
    // does not claim VoiceOver activation gestures or a human usability review.
    private func fixture(_ id: String, ready: String) throws -> XCUIApplication {
        continueAfterFailure = false
        let base = try XCTUnwrap(ProcessInfo.processInfo.environment["SGUI_APPLE_BASE_URL"])
        let url = try XCTUnwrap(URL(string: base + "/fixtures/?id=" + id + "&embed=true"))
        XCTAssertTrue(["127.0.0.1", "localhost", "::1"].contains(url.host ?? ""))
        XCTAssertNotEqual(url.port, 3000)
        let safari = XCUIApplication(bundleIdentifier: "com.apple.mobilesafari")
        safari.open(url)
        XCTAssertTrue(element(safari, ready).waitForExistence(timeout: 30), safari.debugDescription)
        return safari
    }

    private func element(_ safari: XCUIApplication, _ label: String) -> XCUIElement {
        safari.webViews.descendants(matching: .any)
            .matching(NSPredicate(format: "label == %@", label)).firstMatch
    }

    private func nativeAction(_ action: () throws -> Void) throws {
        let service = XCUIDevice.shared.voiceOverService
        let enabled = service.isEnabled
        if enabled { try service.disable() }
        defer { if enabled { try? service.enable() } }
        try action()
    }

    // Each inner array must match ONE actual utterance. This prevents unrelated
    // page text and an unrelated selected/required/button from satisfying a pair.
    private func speech(_ safari: XCUIApplication, stage: String, anchor: String,
                        required: [[String]], limit: Int = 60) throws {
        func satisfied(_ lines: [String], _ patterns: [String]) -> Bool {
            lines.contains { line in patterns.allSatisfy {
                line.range(of: $0, options: [.regularExpression, .caseInsensitive]) != nil
            } }
        }
        let lines = try boundedSpeech(safari, name: stage, anchor: element(safari, anchor),
                                      expectedAnchor: anchor, limit: limit) { lines in
            required.allSatisfy { satisfied(lines, $0) }
        }
        for patterns in required {
            XCTAssertTrue(satisfied(lines, patterns), "Missing same-utterance patterns \(patterns) in \(stage):\n" + lines.joined(separator: "\n"))
        }
    }

    func testSafariDialogVoiceOverContextAndDismissal() throws {
        let safari = try fixture("migration-proofs-dialog--nested-form", ready: "Create course")
        try nativeAction { element(safari, "Create course").tap() }
        XCTAssertTrue(element(safari, "Course name").waitForExistence(timeout: 10))
        try speech(safari, stage: "dialog-open", anchor: "Course name", required: [
            ["Create course", "dialog"], ["Course name", "required"],
            ["Review the settings before saving"], ["Cancel", "button"]
        ])
        try nativeAction { element(safari, "Cancel").tap() }
        XCTAssertTrue(element(safari, "Create course").waitForExistence(timeout: 10))
        XCTAssertFalse(element(safari, "Course name").exists)
        try speech(safari, stage: "dialog-dismissed", anchor: "Create course", required: [["Create course", "button"]])
        // Focus return remains a manual observation: finding the trigger while
        // scanning does not prove initial VoiceOver focus returned to it.
    }

    func testSafariNavigationVoiceOverCurrentAndExpandedState() throws {
        let safari = try fixture("migration-proofs-navigation--host-routing-and-expansion", ready: "Geometry")
        try speech(safari, stage: "navigation-initial", anchor: "Overview", required: [
            ["Main navigation"], ["Algebra", "current"], ["Courses", "expanded"], ["Geometry", "link"]
        ])
        try nativeAction { element(safari, "Geometry").tap() }
        try speech(safari, stage: "navigation-current-changed", anchor: "Geometry", required: [["Geometry", "current"]])
        try nativeAction { element(safari, "Courses").tap() }
        try speech(safari, stage: "navigation-collapsed", anchor: "Courses", required: [["Courses", "collapsed"]])
        XCTAssertFalse(element(safari, "Geometry").exists)
    }

    func testSafariTableVoiceOverReadingContext() throws {
        let safari = try fixture("migration-proofs-table--default", ready: "React fundamentals")
        try speech(safari, stage: "semantic-table", anchor: "Course enrollment", required: [
            ["Course enrollment", "table"], ["Learners"],
            ["React fundamentals"], ["12"], ["Accessible design"], ["24"]
        ])
        // These content/role checks are deliberately separate from a human
        // assessment of header association, rotor navigation and reading order.
    }

    func testSafariEditorVoiceOverEditingAndReadOnly() throws {
        let safari = try fixture("editors-pagerichtexteditorsection--clipboard-editing", ready: "Make read-only")
        XCTAssertTrue(element(safari, "Clipboard document").waitForExistence(timeout: 10))
        try speech(safari, stage: "editor-editable", anchor: "Bold", required: [
            ["Clipboard document", "text field|text area|editable"], ["Bold", "button"]
        ], limit: 100)
        try nativeAction {
            let editor = element(safari, "Clipboard document")
            editor.tap()
            editor.typeText("VoiceOver acceptance phrase")
        }
        try speech(safari, stage: "editor-typed", anchor: "Clipboard document", required: [["VoiceOver acceptance phrase"]], limit: 100)
        try nativeAction { element(safari, "Make read-only").tap() }
        XCTAssertTrue(element(safari, "Enable editing").waitForExistence(timeout: 10))
        try speech(safari, stage: "editor-read-only", anchor: "Enable editing", required: [
            ["VoiceOver acceptance phrase"], ["Enable editing", "button"]
        ], limit: 100)
        // Do not require one Apple-specific read-only wording. Operator must
        // verify read-only discoverability and inability to edit in AT mode.
    }

    /// Returned utterances are actual VoiceOver speech; AX labels alone never pass.
    private func recordSpeech(_ safari: XCUIApplication, name: String,
                              anchor: XCUIElement, expectedAnchor: String,
                              until complete: ([String]) -> Bool) throws -> [String] {
        try boundedSpeech(safari, name: name, anchor: anchor, expectedAnchor: expectedAnchor, complete: complete)
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
        let speech = try recordSpeech(safari, name: "Calendar actual VoiceOver date and disclosure", anchor: safari.webViews.descendants(matching: .any).matching(NSPredicate(format: "label CONTAINS %@", "February 15, 2024")).firstMatch, expectedAnchor: "February 15, 2024") { lines in
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
        let speech = try recordSpeech(safari, name: "Calendar actual VoiceOver preset descriptions", anchor: element(safari, "Early February"), expectedAnchor: "Early February") { lines in
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
        let speech = try recordSpeech(safari, name: "Calendar actual VoiceOver focused range preview", anchor: anchor, expectedAnchor: "February 28") { lines in
            let text = lines.joined(separator: " ")
            return text.contains("Range preview") && text.contains("Anchor") && text.contains("Focused endpoint") && text.contains("Apply commits the draft")
        }
        let transcript = speech.joined(separator: "\n")
        for content in ["Range preview", "Anchor", "Focused endpoint", "Apply commits the draft"] {
            XCTAssertTrue(transcript.contains(content), transcript)
        }
    }



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
            let speech = XCTAttachment(string: observations.joined(separator: "\n"))
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
                let utterance = try traceSpeech("milestone.currentSpeech", { try voiceOver.currentSpeech().utterance })
                // Preserve every sample and timestamp, including identical samples.
                observations.append("\(Date().timeIntervalSince1970) [\(phase)] \(utterance)")
                if let expecting, utterance.contains(expecting) { heard = true }
                Thread.sleep(forTimeInterval: 0.1)
            } while Date() < deadline
            if let expecting { XCTAssertTrue(heard, "Missing actual speech: \(expecting)\n" + observations.joined(separator: "\n")) }
        }
        _ = try anchorVoiceOver(safari, anchor: start, expected: "Start operation")
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

}
