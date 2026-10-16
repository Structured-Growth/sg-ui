# Bounded visual acceptance capture

The supplied fixture and spec create eight configurations with six captures each:
controls, focused action, grids, navigation, editor and overlay (48 images in one
Chromium project). This is representative visual coverage, not every component or
a Cartesian product. No capture was run in this shared mutable checkout.

Each configuration exercises production components at the named theme/density and
360px or 1280px viewport. Width is the host container supplied to the fixture;
this does not establish every nested-container boundary. Long labels are visible
pseudo-expanded English, not translated Arabic. Arabic locale plus RTL exercises
direction through the host translation Provider. Editor chrome remains its actual
fallback language; only its surrounding course heading is pseudo-expanded.

Controls include error text, disabled, pending and selected states. Grids include
selected rows and distinct initial-loading, empty and failed-load instances. The
editor begins empty and remains editable. Navigation includes current-page state.
The open dialog includes invalid and loading controls. Error/loading/empty states
are not invented as new Navigation or editor public APIs. The focused action is
entered with native Tab; the separate public docs check seeds local focus and
only claims traversal. Reduced motion is emulated for deterministic still captures;
public motion preference assertions run separately.

Before running, coordinator integrates the patch, registers the fixture as a new
native scenario, builds the library and native fixture host in a leased immutable
window, and saves source/build/runtime/browser/font hashes. Reuse existing browser
hosts only when those inputs match. Never reuse user server 3000 or launch a server
from this spec; configuration intentionally has no webServer.

Candidate generation: run once with `--update-snapshots`. That produces images,
not approved baselines. Review every image at its native dimensions for clipped
labels/controls, missing focus, contrast, selected cues, overflow, popup placement,
readable loading/error/empty messages and RTL flow. Record reviewer/date, engine,
source/host hashes, exact image SHA-256, findings and disposition in review.json.
Check warning attachments and failures; do not approve failed or missing images.
No mask hides production content. Carets and running animations are disabled for
capture only. Pixel tolerance is zero on the same pinned OS/browser/font runtime;
changes require explicit image review, not automatic baseline replacement. Platform
updates require a new attributable candidate set. Run again without
`--update-snapshots` only after review to establish repeatable visual regression.

On later changes save both baseline and actual/diff image paths plus hashes and
compare at the same dimensions. Manual review is mandatory for a new baseline.
Physical touch, actual browser zoom and spoken AT remain separate operator work;
Playwright WebKit is not physical Safari and RTL is not proof of localization.
Twenty editor V leaves remain separate.
