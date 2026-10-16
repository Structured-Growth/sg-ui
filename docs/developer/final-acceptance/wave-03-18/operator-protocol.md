# Real autofill and spoken-output receipt

The proposed private `ProfileAutofill` fixture provides three independent forms:
uncontrolled, controlled accepting and controlled rejecting. Each has externally
associated email/address fields, a read-only field, a disabled field, two native
form owners and reset cancellation outside the form. This makes AF-1 executable
without adding autofill state or profile data to reusable components.

Use an explicitly synthetic populated browser profile. Record browser/version,
OS/version, date, operator and candidate source/output/host hashes. Open
`/fixtures/?id=migration-proofs-primitive-acceptance--profile-autofill&globals=a11y.manual:!true`.
Choose offered contact data through the browser's real autofill UI. Do not use
scripted fill, DOM value assignment or synthetic input events as autofill proof.

For each of the three named sections, record visible field values, actual callback
sequence (`Autofill requests`) and FormData obtained by submitting form a. Submit
with Enter where the browser offers it and with the explicit submit button; record
actual behavior separately. Disabled fields must not submit; read-only values are
retained. Record actual accepting/rejecting-host behavior without assuming the
browser emits an ordinary edit event for every autofill strategy.

Reset form a, then enable Cancel autofill reset and reset again. Uncontrolled
fields return to their defaults on accepted reset; controlled fields retain host
state because this fixture's host does not request a controlled reset. Canceled
reset changes nothing. Neither reset produces an edit callback. Select Move
autofill form, use actual offered autofill again, then verify form a no longer owns
submission/reset while form b does. The native submit outputs are test-host-only
instrumentation, not persistence or production examples.

Keep only consented synthetic data in the receipt. Avoid storing personal profile
contents/passwords. Save exact observations and failures; a fixture alone is not
completion. This contact-data case does not certify a password manager.

For U-04/U-05/U-09 spoken output, use a named actual OS/browser/screen reader
pairing. Focus each text field and describe its label/shared guidance/per-field
error; traverse the group legend; record mixed checkbox, required RadioGroup and
selected tab/panel announcements using the existing fixtures. Preserve speech
transcripts separately from ARIA or DOM assertions. No such operator result was
available to wave-03-18.
