# Initial delegated performance measurements

These are immutable observations of source `2b611c2e689e598856f605ce03c429218cf2238e`
on the recorded Apple M5/16GiB host with4x Chromium CPU throttling for latency.
They do not yet establish the final reference budgets. Two small-grid/selector
sessions, plus the first processing-wide/large-page and catalog-small sessions
passed their complete protocols. The catalog-wide first navigation timed out
in pointer activation of the sort control; its JSON/screenshot are retained.
No missing updates or failed navigation is replaced with invented samples.

The separate memory packet passes all210 cycles with fixed listener counts,
cleared owner state and no late publications. Whole-page post-GC heap still grows
modestly, so no zero-growth or universal leak-free claim follows.

Follow-up measurement uses keyboard sort activation, preserving the overlapping
native input/selection and all50 required updates. The new runner hash is a
changed protocol: these old samples must not be mixed with it as if identical.
The subsequent CSS build-order repair also requires a freshly identified fixture.
