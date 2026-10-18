# Step announcement successor — actual speech still pending

Use `components-appoperationsteps--native-state-transitions` on the coordinator's
immutable fixture host. The proposed simulator scenario reads Apple's actual
`currentSpeech()` service after native button activation, without moving the
VoiceOver reading cursor to the host Status. No execution is claimed here.

The existing Select simulator receipt proves the service capability, not operation
step speech. Review the new candidate and run the named case using validation-plan.json.
Its timestamped samples can establish observed milestone speech; repeated samples
of one current utterance cannot establish repeated announcements, and a sampler
cannot establish silence between samples. Keep this distinction in the receipt.

An operator must still record the following on a named OS/browser/AT/version,
locale, immutable fixture digest, date and operator identity. Use the existing
wave-03-22/at-operator-receipt.md keyboard sequence: pending list, Start, Advance
twice, Complete, Fail, Reset, Start, Complete and Show single. Record literal
observed utterances, including duplicates and interruptions; do not copy expected
text into observations. Confirm focus remains with the activated host control and
steps are noninteractive. Record quiet progress ticks, one completion/error
milestone per transition and fresh retry completion. Single-step no-numbering
already retains native evidence; report actual AT discrepancies separately.

Status: NOT EXECUTED. Operator observations: absent. Simulator observations: absent.
Actual DOM `aria-live` persistence and native screenshot evidence do not fill these
fields. W02-01-C03-AT remains open after preparing this runnable successor.
