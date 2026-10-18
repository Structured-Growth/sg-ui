# Evidence needed for the remaining owner-controlled gates

This packet preserves required work. It does not close any item or authorize a
release. The active count is 20 before the current full checkpoint is accepted.
Nine items have closed during this execution; six future features are excluded.

| Evidence or decision | Items it unblocks | Prepared technical record |
| --- | --- | --- |
| Package-specific license provenance, especially the actual `client-only@0.0.1` terms/notices, plus maintainer/rights disposition of copied/adapted source and the final shipped notices | A-L-01, A-L-02, A-L-04, A-Z-06; contributes to A-Z-14/15 | [License inventory](../react-aria-license-inventory.md#verified-attribution-facts-and-their-scope); [extraction lineage](../extraction-lineage.md); root/package third-party notices |
| Authentic manual reviews of dialogs, selectors, calendars, navigation, tables and editors, with platform/browser/AT versions and findings; remaining supported device/zoom/visual observations | A-P-07, A-X-11; contributes to A-Z-11 | [Supported-environment record](../react-aria-browser-support.md); existing automated checks remain bounded |
| Representative slower consumer hardware and agreed reproducible performance/memory budgets | A-P-08, A-X-19 | [Measured baseline/candidate results](../react-aria-performance.md); retained full runs and bounded tail diagnostic |
| npm scope/publication control, authentication/trusted publishing/provenance and reviewed commercial notices | A-R-17; contributes to A-Z-14 | [Read-only access result](npm-access-readonly.json): local npm identity unavailable, collaborators request forbidden |
| Maintainer review of AI-action trust and credential boundaries, plus an authorized live default-token draft-PR flow | A-R-21, A-R-23 | [CI/release readiness](../ci-release-readiness.md); CLI/proxy pinned to 0.163.0; source/guards verified. Current repository default token lacks PR-creation capability |
| Effective release-branch protection with current check names, including observed blocking when required checks are missing or fail | A-R-27 | [CI/release readiness](../ci-release-readiness.md). No release-branch settings were changed |
| Docs hosting target and immutable release URL convention | DOCS-007 | [Docs delivery checklist](../docs-website.md#delivery-checklist) |
| Which current menu should adopt HierarchicalMenu | HM-ADOPT-01 | [Adoption scope](../hierarchical-menu-scope.md); SideNavigation and the documentation sidebar are different integration targets |
| Final dependency/feature decisions and acceptance of reviewed PRs and all required evidence | A-Z-15, then A-Z-16 | [Final acceptance ledger](../react-aria-final-acceptance.md); [draft PR 97](https://github.com/Structured-Growth/sg-ui/pull/97) |

A-R-12 and DOCS-005-l are being pursued through the current complete CI checkpoint
and exact-head official-artifact verification. Passing those two gates alone
would leave 18 active items. The other rows require the evidence indicated; they
cannot be converted to optional work to reach the requested count of ten.

No merge to main, tag, publication, account login, repository setting change or
message to another person was performed. Production promotion remains subject to
the explicit human-release instruction in AGENTS.md.
