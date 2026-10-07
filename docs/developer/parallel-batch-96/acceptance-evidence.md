# Batch 96: A-15–A-17 and L-01–L-02 acceptance evidence

Reviewed source head: `e43bf604be74e0daf731bc990e6c3097f05ed89b` (requested pushed `codex/dev` baseline). Inspection date: 2026-10-07. Isolated managed checkout: `/Users/thomashall/.codex/worktrees/batch96-acceptance-evidence/sg-ui`.

This is an exclusive read-only criterion review plus this report. No master acceptance, ledger, production source, shared configuration or other report was changed. Root owns acceptance and integration. “Supported” below means the particular definition/documentation criterion is established by the identified retained Git content; it does not mean the migration or runtime matrix passed. No installs, tests, builds, packs, browser/performance sessions, global leases or CI commands ran. There is **no tested head from this assignment**; the reviewed source head is not a tested head.

## Per-ID matrix

| ID | Finding at reviewed head | Exact retained evidence | Remaining gate / owner |
| --- | --- | --- | --- |
| A-15 | **Fully supported for creating the requested old-to-new mappings.** All seven subjects have explicit before/after documentation. | B01 consumer mapping table; B03 theme objects; B04 typography/native styling; B05 modal callbacks; B06 selection/columns; B07 pagination. Current contract cross-checks: B08–B12. Topic details below. | Root can assess this bounded documentation criterion. Consumer adoption, behavior, breaking-release policy and broad G/U/X/R/Z acceptance remain independent; this report does not change checkboxes. |
| A-16 | **Partial.** Owned interaction boundaries and observable regression assertions are retained; engineering/API-change costs are expressly stated. No replacement engine was implemented or validated, and no fresh execution establishes current-head behavior. | B02 “Owned contracts” explicitly requires retaining observable tests and acknowledges engineering work/API changes. B01 final adoption paragraphs reject automatic portability. B13–B15 contain actual observable assertions; B27 contains transitive boundary enforcement. | Coordinator-owned targeted execution at an exact integration head, retained results and native engine coverage. Any actual engine replacement needs its own compatibility assessment, browser/AT/device/SSR/package work; no cost-free/nonbreaking promise. |
| A-17 | **Fully supported for defining host extension points and keeping inspected controls free of backend policy.** This is a contract/source finding, not a universal host or future-feature certification. | B02 host-owned scheduling/permission/booking boundary; B10/B11 grid selection, render/action/reorder callbacks; B16 account adapter; B18/B19 calendar availability/presets; B20 host upload/document callbacks; B21 deferred scheduling/booking. Production-source keyword inspection found only UI scheduling comments/helpers, no fetch/axios/XMLHttpRequest or backend booking/permission implementation matches. | Root owns acceptance. Hosts own data, permission enforcement, booking/scheduling persistence, accounts and network cleanup. Deferred scheduling is not an implemented advanced scheduling feature. Runtime adapter/AT/device gates remain independent. |
| L-01 | **Partial; actual selected-version/transitive distributed license verification is not established.** The manifest, lockfile and notices identify dependencies and license claims, but cannot substitute for actual upstream license/NOTICE bytes and distributed-code review. | B22 exact Adobe/date/TanStack/Lucide versions plus Lexical ranges; B23 resolved dependency records; B24 Adobe Apache text, MIT Lexical/TanStack and ISC/Feather attribution. B28 shows one actual Lucide import path. No installed dependency tree, fresh dist or tarball exists in this isolated checkout. | Legal/release owner must review the exact resolved distributed closure, including Adobe hook/state/date utilities, all editor/transitive packages and bundled vectors; retain package integrity, license/NOTICE hashes and exact artifact/build head. React peer variants also require explicit accounting. Do not declare blanket approval from SPDX names or lockfile integrity. |
| L-02 | **Partial.** Apache 2.0 text and Adobe attribution are retained, package files include legal notices, and the pack guard checks byte preservation. Copy/modification provenance and final applicable NOTICE completeness are not fully verified. | B24 Apache block and no-copy/no-modification statement; B25 third-party carve-out; B22 package files; B26 pack checks compare LICENSE/notices byte-for-byte. B29 explicitly leaves notice reconciliation/final tarball review open. | Legal/release owner verifies actual upstream NOTICE obligations, copied/modified file provenance and any required modification notices against final emitted code/artifact. Existing no-copy statements are retained claims, not a forensic proof. No notices are removed here. |

## Mapping detail (A-15)

- Theme objects: B03 maps `theme`, `lightTheme`, `darkTheme`, upstream providers and palette overrides to Provider/ThemeScope settings, generated tokens and CSS variables; B08 exports the owned scopes.
- Typography: B04 separates semantic `as` from visual `variant`, including `bodyAlt2`, and removes upstream augmentation/prop inheritance.
- Styling: B01/B04 replace `sx`, styling callbacks and upstream slots with declared native class/style/ref, token overrides and documented parts. These are deliberate breaking mappings.
- Modal callbacks: B05 maps `onClose(event, reason)` to owned reason-only dismissal and action `onClick(event)` to `onPress()`; B09 declares the matching owned callback contracts.
- Selection: B06 replaces engine include/exclude selection with explicit string-ID sets and top-level identity; B10 declares selected/default IDs, change callback and `isRowSelectable`.
- Columns: B06 replaces engine cell params with row accessors/format/render callbacks and visibility locks/order; B11 declares those owned callbacks.
- Pagination: B01/B06 define one processing/state owner and combined snapshots; B07 explicitly changes size handling to request page zero before the size callback. B12 implements the combined callback precedence without claiming legacy size-only parity.

## Observable assertions and extension inspection

A-16 evidence is the assertions themselves, not test filenames: B13's “traps focus…” case tabs inside the named dialog, checks the `escape` callback and restored trigger; its nested tabs/popover case checks local dismissal and portal theme. B14's first case asserts native DIV/TABLE refs, displayed rows, focused row and one combined pagination request; its sort case asserts page-before-sort ordering and one complete state snapshot. B15 checks stable system SSR settings and nested theme/density inheritance. These tests were read, **UNRUN in this assignment**. JSDOM focus assertions do not establish physical-device or spoken AT behavior, and retained source tests do not prove successful engine swappability.

For A-17, B16 only provides/delegates host operations with safe defaults; B17 asserts lazy host calls, original promise/error preservation and no implicit account work (also UNRUN). B18 accepts precomputed unavailable dates/reasons and presets with owned value callbacks; B19 converts explicit civil date/time values without a scheduling backend. B20 declares `onLexicalChange` and optional `onUploadImage(file)`; its insertion path awaits the host callback or creates a local preview URL. Local UI upload state/URL handling is not asset authorization or network persistence. B11 supplies row/action rendering, while B10 supplies selectability and reorder requests; callback visibility/disabled state is presentation, not backend permission enforcement.

## Retention and validation limits

The durable artifacts reviewed here are Git blobs in the table below. No browser result JSON, trace, screenshot, packed dependency tree, license archive or CI artifact was opened or downloaded. The isolated checkout lacks `node_modules`, `dist`, and `artifacts`; this says nothing about files retained in other worktrees or remote CI. Nothing was deleted or pruned.

B30 cites historical implementation head `83b8dae2148002e79d2df331fd105c274f97ca96`, a 45/45 Linux Chromium/Firefox/WebKit run, browser artifact ID `11456069764` and recorded expiry `2026-10-21 02:10:07 UTC`. Those are historical documentation claims, not inspected retained artifact contents or evidence for `e43bf604be74e0daf731bc990e6c3097f05ed89b`. Later count summaries cannot establish a current full matrix. Local Firefox launch limitations, physical-device interaction, manual visual acceptance and spoken AT remain explicit limits. Artifact loss/expiry or unavailable package files require reconstruction at a newly recorded head; filenames or successful jobs alone do not prove the assertions or license closure.

Performed checks: read README, migration/architecture and the cited contract/source/test/notice files; searched assigned IDs in the master list; searched production `src` excluding stories/tests for `fetch(`, `XMLHttpRequest`, `axios`, booking, permission and scheduling; inspected manifest dependency/files entries, lockfile version records, legal text and pack/boundary guard source; inspected clean Git status and exact baseline identity; resolved every evidence path to its immutable Git blob. Two guessed paths (`src/experimental/calendar/types.ts`, `src/icons/iconFactory.tsx`) and a direct primitive typography path were absent; corrected inspection used B18/B19, B28 and B04. No failed runtime checks were hidden because no runtime checks ran.

No genuine missing native regression was identified for these definition/legal criteria. No optional `acceptance-pack-96.spec.ts` was added and no production fix handoff is justified. Coordinator follow-up: run existing B13–B15/B17 tests as appropriate in its validation window and retain exact head/results; request legal-owner exact-distributed-closure review for L-01/L-02. Any license/provenance correction requires a separately assigned exclusive allowlist, limited initially to `THIRD_PARTY_NOTICES.md` and the specific proven copied/modified file, with a targeted exact-artifact notice-preservation check; this assignment grants no such edits.

## Immutable evidence index

All entries resolve from `e43bf604be74e0daf731bc990e6c3097f05ed89b`. Links are repository-relative for local navigation; Git blob hashes are the authoritative content identities. No entry is a test-result artifact.

| Ref | Source | Git blob |
| --- | --- | --- |
| B01 | [docs/migration.md](../../../docs/migration.md) | `c16a7ab44e0533329f80d69c3c0c43db766e877f` |
| B02 | [docs/developer/react-aria-architecture.md](../../../docs/developer/react-aria-architecture.md) | `66280bea05b7f70b0e1bcc9e4b2388add91de97a` |
| B03 | [docs/developer/react-aria-theme.md](../../../docs/developer/react-aria-theme.md) | `f4c013be5314931ed051863eeb1ead6501594772` |
| B04 | [docs/developer/react-aria-primitives.md](../../../docs/developer/react-aria-primitives.md) | `e3d7832c63d99f33f312935b69d7447dc6268d6b` |
| B05 | [docs/developer/react-aria-modal-shells.md](../../../docs/developer/react-aria-modal-shells.md) | `294a3e1d9882a565f95ebc793af42d786cbc3ba3` |
| B06 | [docs/developer/react-aria-catalog-grid.md](../../../docs/developer/react-aria-catalog-grid.md) | `58c59e7e56139e470d13c5f759e23d918dc913e1` |
| B07 | [docs/developer/react-aria-card-pagination.md](../../../docs/developer/react-aria-card-pagination.md) | `2d447b395dc927004af61b2d17a5b3d090e3f186` |
| B08 | [src/theme/index.ts](../../../src/theme/index.ts) | `32e4e1d82d1af0a7f10c51ed29d95ca4680ff444` |
| B09 | [src/components/AppModal/AppModal.tsx](../../../src/components/AppModal/AppModal.tsx) | `82b09b4104fd0d5c14dd4d63c4fca20bcbe3fc16` |
| B10 | [src/components/AppDataGrid/types.ts](../../../src/components/AppDataGrid/types.ts) | `aa61aad90e0d22b1f75addbf4b01c5fec63a5db7` |
| B11 | [src/components/AppDataGrid/ownedGridColumns.ts](../../../src/components/AppDataGrid/ownedGridColumns.ts) | `5c5ae8541622c9689db5ed74d5eaf1c1c5f8f18d` |
| B12 | [src/components/CardPaginationFooter/CardPaginationFooter.tsx](../../../src/components/CardPaginationFooter/CardPaginationFooter.tsx) | `a9ed1f8caf4f20dbff32dfe2ac56bd426dea9fad` |
| B13 | [src/components/AppModal/AppModal.test.tsx](../../../src/components/AppModal/AppModal.test.tsx) | `44aee8df429d817e517d8a66a27465f1f74cdf73` |
| B14 | [src/components/AppDataGrid/AppDataGrid.test.tsx](../../../src/components/AppDataGrid/AppDataGrid.test.tsx) | `4a644840cf2913ef0e29a25f0c75694af20d1aec` |
| B15 | [src/foundation/ThemeScope.test.tsx](../../../src/foundation/ThemeScope.test.tsx) | `d2a452011b3679297cf5c09f75f2999bc10f9c11` |
| B16 | [src/adapters/accounts.tsx](../../../src/adapters/accounts.tsx) | `205182f0161946cca99c8022a0c4c09543c4cef5` |
| B17 | [src/adapters/accounts.test.tsx](../../../src/adapters/accounts.test.tsx) | `d875841639f8ffcf75cd004f0cb9c4251d42ba9b` |
| B18 | [src/experimental/DateRangeSelector/DateRangeSelector.tsx](../../../src/experimental/DateRangeSelector/DateRangeSelector.tsx) | `0f570bbec2e6acafe464557fe471649fe3f23f44` |
| B19 | [src/experimental/DateRangeSelector/date-contract.ts](../../../src/experimental/DateRangeSelector/date-contract.ts) | `28fe61014fb64dbfa5e2c79dd433926548a75855` |
| B20 | [src/components/PageRichTextEditorSection/PageRichTextEditorSection.impl.tsx](../../../src/components/PageRichTextEditorSection/PageRichTextEditorSection.impl.tsx) | `09b1048767dcbe788779d59129382f33536e0b80` |
| B21 | [docs/developer/react-aria-calendar-contracts.md](../../../docs/developer/react-aria-calendar-contracts.md) | `3a3c1a7efbad904f16155e9977768c375f4d2c94` |
| B22 | [package.json](../../../package.json) | `f83bab2065c9ae79b31aa6b0aa143b7ae0b2a3f0` |
| B23 | [pnpm-lock.yaml](../../../pnpm-lock.yaml) | `d312a82ec958b0badc4633899ec4510cbb655648` |
| B24 | [THIRD_PARTY_NOTICES.md](../../../THIRD_PARTY_NOTICES.md) | `a5a5cdef430e435077f85c002f4c7398a09c4c62` |
| B25 | [LICENSE](../../../LICENSE) | `9dbc843502f2b1e8f74ed4c4940c471e7cca8acd` |
| B26 | [scripts/check-package.mjs](../../../scripts/check-package.mjs) | `744f86595899989d90edc6cf590a757534c58f17` |
| B27 | [scripts/check-foundations.mjs](../../../scripts/check-foundations.mjs) | `ecc96a852355231cc7845642c589980825a6356d` |
| B28 | [src/experimental/icons/AddIcon.tsx](../../../src/experimental/icons/AddIcon.tsx) | `09ec4625fbdf1ecd80ce7f85e99c75f55522026f` |
| B29 | [docs/developer/react-aria-removal-audit.md](../../../docs/developer/react-aria-removal-audit.md) | `0fcffdabebd08a1531bb8a16510a967157921482` |
| B30 | [docs/developer/react-aria-browser-acceptance.md](../../../docs/developer/react-aria-browser-acceptance.md) | `41db9ad1186ddccbb84fabcd2a23237e05300c56` |
