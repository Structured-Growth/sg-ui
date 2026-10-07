# Batch 106 — acceptance evidence for I-05, I-08, H-01 and H-03

Reviewed baseline: `e43bf604be74e0daf731bc990e6c3097f05ed89b` (`codex/dev`),
2026-10-07. Isolated managed worktree:
`/Users/thomashall/.codex/worktrees/batch106-evidence/sg-ui`.
Branch: `codex/batch106-acceptance-evidence`.
Exclusive change: this report. No production, shared configuration, acceptance
checklist, ledger, generator, other report or test changes. The coordinator owns
acceptance and integration; this report does not close any whole parent criterion.

## Per-ID evidence matrix

| ID | Assessment at reviewed head | Concrete support | Precise remaining gate |
| --- | --- | --- | --- |
| I-05 | Partial; shared mechanics supported by source, optical/contrast acceptance unproved | `createVector.tsx` defaults to square `1em`, stroke width 2, currentColor, no fill; shared CSS uses inline-block, middle alignment and nonshrinking flex. Eight directional wrappers opt into RTL scaleX; hosts can override. Icon documentation preserves consistent stroked replacement policy. | Review optical size/weight/alignment across all 95 mapped symbols at actual control sizes in light/dark themes; verify native RTL transform and contrast in their actual backgrounds/states. Inherited currentColor alone proves no contrast ratio. SSR data attributes alone prove no browser mirroring. Retain human visual/AT/device limits. |
| I-08 | Partial; catalog, accessibility and bundle checks plus notices exist; fresh shipped artifact proof missing | Public catalog stories, every-export native-ref/decorative tests, meaningful-label tests, individual icon exports and package checks. Packed fixture rejects three unused vector marker strings. Notices include Lucide ISC and Feather MIT; package files includes notices. | Coordinator fresh packed React 18/19 run and retained tarball/bundle evidence at exact head; reconcile all shipped vector origins against upstream licensing and emitted assets, including completeness of notices. Existing tests are representative semantics/pruning checks, not exhaustive AT or all-vector bundle proof. |
| H-01 | Partial parent; all named adapter behaviors supported by current source and retained test assertions | SGLink native fallback, custom Link/ref/attributes forwarding, host pathname updates and replace handling; guarded browser imperative fallback. Existing tests cover cancellation/modifiers/download/targets and SSR. Historical single custom-router Chromium case has unchanged relevant blobs. | Fresh exact-head engine evidence and representative real host router/composed navigation acceptance. Custom-provider story lacks modifier/target/download/cancellation fixtures; default adapter tests do not prove those host implementations. Physical devices and AT remain open. |
| H-03 | Partial parent; single-owner source integration supported, broader runtime acceptance open | React Aria Menu items obtain navigate from existing adapter, intercept eligible relative activation and prevent native default. Styled Link and Breadcrumbs use SGLink; Provider only supplies locale/scope. No React Aria RouterProvider or second routing context found, and package dependencies have no Next.js. | Verify React Aria menu keyboard/pointer/modified/target activation under a representative host router plus composed Breadcrumbs/SideNavigation routes. No new RouterProvider is required merely to close a checkbox; any future routing bridge must use existing host ownership. Current source inspection is not all runtime navigation proof. |

## Current source observations

The complete map contains 95 entries. The directional defaults are
ChevronRightIcon, RedoIcon, UndoIcon, FormatIndentIncreaseIcon,
FormatIndentDecreaseIcon, KeyboardArrowLeftIcon, ArrowForwardIcon and LogoutIcon.
All other mapped wrappers use the nonmirroring default. The public DirectionalIcons
story already exposes named RTL arrows and an explicit Undo override. Existing
AllPublicIcons and MeaningfulAndDecorative stories suffice for future bounded
visual/native review; no new fixture was invented.

Native fallback strips `replace` before spreading anchor attributes. Consumer
onClick executes before the default adapter navigation decision; custom Link
receives that callback directly and is not wrapped in another navigation handler.
Absolute/protocol-relative/scheme destinations bypass the custom Link and navigate.
`usePathname` observes host context; its unprovided fallback is `/`, not automatic
browser pathname tracking. Host changes are authoritative.

The React Aria Menu path is distinct from the styled anchor implementation but
shares `useNavigationAdapter().navigate`. Its eligible relative link onClick
prevents default before calling navigate with replace. Its tests retain native
anchor, disabled, external and target assertions. This is concrete routing
integration behind the adapter, without a React Aria RouterProvider. Static source
cannot certify every engine's keyboard event ordering or host router behavior.

No tracked `.svg`, `.png`, `.jpg` or `.webp` files were returned by `git ls-files`
for those extensions. That observation is not a complete emitted/dependency asset
inventory and does not prove all vector notices complete. Lucide wrappers import
vectors from the pinned `lucide-react` 1.52.0 dependency; notices also retain
historical material. No licensing text was changed.

## Retained execution evidence and loss limits

[Batch 78](../parallel-batch-78/custom-router-native.md) is a retained Git report
(blob listed below) of **one** custom host-router Chromium case passing retry zero
at tested head `0707b97c33a89cf494bb2b245962a7698510b4b8`, Node v24.19.0,
Playwright 1.63.0. Exact selection:
`tests/browser/batch01-adapters.spec.ts`, project Chromium, grep
`custom host router Link forwards native ref focus and owns keyboard and pointer routes$`.
The report records source digest
`c27a342ca93f11de9ce9540a030f97db8697a79dbd3ecb165bae0b6aa6e384f7`
and immutable build digest
`2f65e5a719bef9720b1cd6e44fdf818856e7d0c678d149d1f70dda5b3900a7b2`.
The recorded owner was coordinator `01a1164f-41db-7f30-aaf9-f20133b6566f`.

Direct existence inspection found the recorded raw artifact absent at
`/Users/thomashall/.codex/worktrees/23a1/sg-ui/artifacts/browser-pool/b234c72f-dd74-4363-a8f8-37a095bd905b/evidence.json`.
Thus the report survives; its raw artifact was not independently inspected here.
Git comparison confirms baseline Link.tsx, navigation.tsx, adapters.stories.tsx
and batch01-adapters.spec.ts blobs equal the tested head. That preserves narrow
historical relevance, not a run at the current baseline or a current full matrix.
The report retains the earlier URL-serialization assertion failure and separate
Firefox launch failure; neither establishes a product pass. Firefox/WebKit for
the final focused custom case remain pending in that record.

[Batch 01](../parallel-batch-01/adapters.md) records 24 adapter unit tests and CI
check/build at implementation head `cd8f34a1bf7c755b80314a76135024f58e2aa403`.
The current Link/navigation/story blobs equal that head; the browser spec differs.
Its older Chromium/WebKit passes preceded the final custom-router story, and
Node 24 CI was incomplete at handoff. No live CI was queried or inferred complete.

[Public icon migration record](../react-aria-progress.md#public-icons-and-primitives-m-36m-37)
records unit/catalog and packed React 18.3.1/19.2.3 checks. Its adjacent implementation
commit is `98b4f9ff7b2aa6ededd88dd5fe30ecde169320a2`; the prose does not explicitly
attest a frozen tested head. Git comparison shows createVector, public icon tests
and notices equal that commit, but the current packed-consumer script differs.
Recorded `/tmp/sgui-m36-m37-public-primitives.jpg`,
`/tmp/sgui-foundation-consumer-AkETpt` and
`/tmp/sgui-foundation-consumer-apK2L2` are absent. These historical claims cannot
supply a fresh retained bundle, screenshot, tarball, contrast or AT acceptance.

## Exact baseline Git blobs

All entries below are `git rev-parse <baseline>:<path>` results. Git blobs prove
reviewed bytes, not executed tests. Source paths are relative to repository root.

| Path | Git blob |
| --- | --- |
| `src/experimental/icons/createVector.tsx` | `96de9b9204544bce519a2d32564d1e8a65355a93` |
| `src/experimental/icons/icons.module.css` | `0c3b8b81fc6d1ffbad317bf54e7116b8ee99a195` |
| `src/experimental/icons/icon-map.json` | `3c4cbe29706e34e170a174a817b1deb9fb47cecf` |
| `src/components/icons/icons.stories.tsx` | `a83248ff1db029bc9e60ca40496a846a8b73bdb0` |
| `src/components/icons/icons.test.tsx` | `3bdb6c7c72265306fcdec80f7968fd1faa03e578` |
| `src/experimental/icons/icons.test.tsx` | `cbd7d5a2c181bdf4925e22f58669b37a290afca0` |
| `scripts/test-foundation-consumer.mjs` | `ff994cb7c9eaae3fbab58461c98ab0269a276c9c` |
| `scripts/check-package.mjs` | `744f86595899989d90edc6cf590a757534c58f17` |
| `THIRD_PARTY_NOTICES.md` | `a5a5cdef430e435077f85c002f4c7398a09c4c62` |
| `package.json` | `f83bab2065c9ae79b31aa6b0aa143b7ae0b2a3f0` |
| `src/adapters/Link.tsx` | `d5ed5662009771f4283760af377191d9c7a1da71` |
| `src/adapters/navigation.tsx` | `e18b09cd0755f37192e8a91af6f961a62189e2c0` |
| `src/adapters/navigationContext.ts` | `8e87b0349bfc611380ba84bb160c64ef7667a77e` |
| `src/adapters/navigation.test.tsx` | `4f7e9bcc278bd1cf27ff1c2a562fa188883fc2f0` |
| `src/adapters/navigation.ssr.test.tsx` | `c46a4b360608ea4c4cb3377c2838402a95c139ee` |
| `src/adapters/adapters.test.tsx` | `f7281d4acaaa7281d6b408b13114456fe97a5214` |
| `src/adapters/adapters.stories.tsx` | `15efd81e03623931fc9ee89da1fbf791a2b9849f` |
| `src/experimental/Link/Link.tsx` | `0eb6f15f598350a6b6e246eed3b7e59367dcae49` |
| `src/experimental/Menu/Menu.tsx` | `60ebffe51e492d220465271c2b783c422ccc716a` |
| `src/experimental/Provider/Provider.tsx` | `cb3e3de6f89932418f05fd793a4899bd8ff548ed` |
| `src/experimental/Breadcrumbs/Breadcrumbs.tsx` | `8c2c5ef1d21aaddd40624a25e5d2006d9818474d` |
| `tests/browser/batch01-adapters.spec.ts` | `98f123a4d5156d5da75c70355a7f12474f5a23b5` |
| `docs/developer/parallel-batch-78/custom-router-native.md` | `aa881e788f0f3bc893f068012f1ac16e951cc2ad` |
| `docs/developer/parallel-batch-01/adapters.md` | `372a72b474501bea781de3069d008003d8803ac5` |
| `docs/developer/react-aria-progress.md` | `ba00dce42931499695a89c8ae67bf5129007892f` |

| `src/experimental/Menu/Menu.test.tsx` | `8c7b3e01a429070d9a36166067cd335012f1d06c` |
| `docs/developer/react-aria-icons.md` | `f2524b342566b5727f41267a9990eb405c0a6f32` |
| `docs/developer/react-aria-host-adapter-acceptance.md` | `aa24170a566d1df2af79970f1a76e2b6bb33bd6a` |

## Checks performed and coordinator handoff

Performed only read-only Git status/head/history/blob comparisons, targeted rg
source/document/manifest searches, source/test assertion reads, map count and
wrapper-policy inspection, and filesystem existence checks of the exact recorded
artifacts. The broad initial `next` search produced incidental names; the refined
routing search found no RouterProvider/useLink/useNavigate or Next import, only
calendar `slot="next"` literals. Missing `public` and unmatched shell globs were
not evidence; tracked-file enumeration and explicit source paths supplied the
subsequent observations. Local report links and whitespace are checked before
commit. No install, unit test, build, pack, browser, performance, global lease or
CI command ran. No optional spec was added; no confirmed source defect was found.

Minimal next review is evidence work, not a production fix: coordinator owns a
fresh window for existing adapter/menu tests and existing catalog stories, then
retains exact tested head, engines, build/bundle and visual results. For a real
custom-router modifier/target/download/cancellation fixture, a separately authorized
exclusive allowlist would be `src/adapters/adapters.stories.tsx` and
`tests/browser/batch01-adapters.spec.ts`; focused native and adapter checks would
be required. Those files remain read-only in this assignment. Optical/contrast
review and shipped-notice reconciliation require explicit reviewer ownership;
manual/device/AT gates cannot be replaced with source assertions. Root alone
accepts criteria or schedules implementation after reviewing any actual defect.
