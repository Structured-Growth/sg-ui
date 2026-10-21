# Checkpoint follow-up — 2026-10-21

Run [39674496190](https://github.com/Structured-Growth/sg-ui/actions/runs/39674496190)
checks source `7cf2db63f492ebcb143d2347c5c599d0f05bab27`. Its completed Chromium
job passes; docs and Firefox expose two concrete defects. They are retained as
failures, not accepted as a completed production matrix.

The docs catalog test records404 errors while rendering learner-grid, then reaches
its120s limit. Next Link's default prefetch follows host-owned demo destinations
as if they were docs routes. The docs routing adapter now disables prefetch while
retaining Next's native prefixed hrefs and client navigation. The existing full
catalog assertion still requires no console errors, every route and compilable
initial/changed source; its deadline and assertions are unchanged.

Firefox's combined overlay trace shows the focused tooltip present before Escape,
absent in the post-Escape snapshot at971594.492ms, then reopened with
`data-hovered=true` at971600.824ms. Restoring the viewport synthesized a hover entry.
The helper had tied keyboard hover suppression to open state, dropping it after
Escape even though the same trigger remained keyboard-focused. Suppression now
lasts through the keyboard-focus lifetime and resets with modality/focus, without
adding a global Escape listener or overriding host-controlled open state.

The new [regression fails on the prior implementation](tooltip-before.log),
and [all11 Tooltip tests pass with the correction](tooltip-after.log). The native
combined-overlay assertion remains unchanged. Full fresh exact-head CI is required
for both corrections. The ongoing performance reference remains explicitly bound
to7cf2db63 and its frozen build; these later changes are not relabeled as measured.
