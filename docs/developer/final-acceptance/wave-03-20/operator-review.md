# Remaining operator evidence — unrun

Record operator, date, OS/build, browser/version, AT/version/settings, input mode,
source manifest hash, built fixture manifest hash, route, expected speech, verbatim
observed speech, active row/field/control and scrollTop/scrollLeft before and after.
These are review steps, not observed results. Do not replace spoken observations
with DOM live-region text or axe results. The operator must use one immutable host.

| Leaves | Existing working fixture / steps | Acceptance observation still needed |
| --- | --- | --- |
| A-G-15 | `migration-proofs-catalog-grid-interaction--retry-focus`: Alt+N empties rows, Alt+P starts pending, Alt+S success, Alt+E error, Retry starts pending. Run empty and retained; repeat once. | Loading/error/no-row messages spoken once with usable focus when Retry disappears; no suppressed final status under aria-busy. |
| A-G-15 | `migration-proofs-catalog-grid-interaction--client`: search for an absent course, clear; refresh while rows remain. | Distinct no-results versus empty and retained refresh; primary content/context remains usable. |
| A-G-15 / A-G-16 | `migration-proofs-catalog-grid-parts--interactive`: toggle First section, invoke Edit title, then Add course. | Actual table semantics, expanded/collapsed names, independent trailing actions, useful status/error speech. |
| A-G-16 | `migration-proofs-catalog-grid-interaction--focus-retention`: Tab from Host action, Shift+Tab back, Tab into remembered entry; arrows through nested Inspect/Review actions. | Actual tab sequence and announced interactive grid roles versus the separate plain table fixture. New automated case is not spoken proof. |
| A-G-21 | `migration-proofs-catalog-grid-cells--clipboard-feedback`: native Enter/Space copy text/JSON, paste into destination, perform deterministic rejection separately, copy independent cell. | Exact pasted bytes, visible keyboard focus and independent, intelligible success/error speech. Native OS/browser permission denial must be described separately from injected API rejection. |
| A-G-21 | `migration-proofs-catalog-grid-cells--all-cell-types` and `--host-locale`: Open, Preview, Edit; compare en-US/de-DE dates and missing image. Existing host-adapter spec covers modifier/target/download semantics. | Announced link versus row actions and current host's native adapter semantics, image fallback, literal date/calendar day, no raw HTML execution. Do not call a missing image source a newly observed network error. |
| A-G-28 / A-G-29 | New `data-display-appdatagridshell-host-operations--optimistic-actions` after integration: reorder then reject/retry; rename then reject/retry; cancel, replace and unmount before settling deferred requests; repeat in independent Second view. | Pending/requested differs from saved; no saved announcement after canceled/obsolete results; latest failure restores confirmed rows; sibling remains unchanged. Pure host checks already cover settlement races; native rendering and speech are separate. |

A-G-29 native selected disappearance is in the proposed spec. Existing batch01
focus and batch08 Retry specs retain refresh, hidden-column, deletion, empty,
page/size, both scroll axes and sibling/host focus coverage. Recover exact prior
source/host receipts before repeating those cases; if host identity cannot be
recovered, run only the uncovered transition/engine selection and keep that limit.
