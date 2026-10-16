# English/Arabic spoken count and clear record

Status: **not performed**. This file contains a protocol, no observed AT results.
The deterministic check and browser specs cannot populate the observation fields.

After coordinator integration and browser validation, use a native fixture host
with recorded source/build hashes. Open `foundations-translations--english-fallback`
and `foundations-translations--arabic-plural-and-direction` separately. Do not
substitute DOM-only `dir` for adapter locale. Record operating system/build,
physical device, browser/version, screen reader/version, speech language/voice,
locale, fixture URL and build identity before each session. Confirm the operator
can hear that locale; record any language-switch configuration actually required.

For each locale, navigate by keyboard to the increment button; activate to counts
1, 2, 3 and 11, allowing speech to settle at each checkpoint. Record the actual
spoken string, duplicate/missing announcements and focus position. Navigate to
Clear, activate, and record the actual zero-count announcement and retained focus.
Repeat increment after clear to detect a stale live region. Also record whether
the initial zero text was read by navigation versus announced as a live update.
An initial live-region announcement is not presumed. Do not require every rapid
increment to be spoken: polite speech can coalesce; test checkpoints separately.

| Required observation | English | Arabic |
| --- | --- | --- |
| OS/device/browser/AT/voice versions | Not observed | Not observed |
| Source/build hash and fixture URL | Not observed | Not observed |
| Count 1, 2, 3 and 11 speech | Not observed | Not observed |
| Clear to 0 speech and focus | Not observed | Not observed |
| Increment after clear speech/focus | Not observed | Not observed |
| Language switching or duplicate/missing speech | Not observed | Not observed |
| Operator/date/raw recording reference | Not observed | Not observed |

If output is wrong, preserve raw observations and file a bounded successor with
the exact component/host/AT combination. No spoken-output pass is claimed here.
